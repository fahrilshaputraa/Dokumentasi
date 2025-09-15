# Alerts API — Usage and Flow

This document describes how external systems interact with the Alerts API to submit alert events and read configuration and execution results. It also explains the background processing flow and links to the Mermaid diagram of the process.

## Overview

- Purpose: Provide a stable API for creating alert events (non-webhook) and reading alert rules, executions, inventory, and playbooks used by Semaphore.
- Base Path: `/api/`
- Auth: Currently open (`AllowAny`). Token/JWT auth can be added on request.
- Docs UIs: `/swagger/` and `/redoc/` (schema at `/swagger.json|.yaml`).

## Endpoints

### Alerts

- POST `/api/alerts/events/`
  - Create an alert event. Enqueues background processing via Celery and returns 201.
  - Request body (examples):
    - Minimal:
      ```json
      {"event_name": "sshd: Service is not running", "host_ip": "10.1.2.3"}
      ```
    - Full:
      ```json
      {
        "event_id": "evt-123",
        "event_name": "sshd: Service is not running",
        "host_ip": "10.1.2.3",
        "host_name": "web-01",
        "severity": 3,
        "payload": {"groups": ["Linux Servers"], "tags": {"zone": "dmz"}}
      }
      ```
  - Response (201):
    ```json
    {
      "id": "<alert_receive_uuid>",
      "name": "...",
      "received_at": "2025-09-15T01:02:03Z",
      "remote_addr": "...",
      "content_type": "application/json",
      "payload": { ... },
      "headers": { ... },
      "event_id": "evt-123",
      "event_name": "...",
      "host_ip": "10.1.2.3",
      "host_name": "web-01",
      "severity": 3,
      "created_at": "2025-09-15T01:02:03Z",
      "status": "queued",
      "task_id": "<celery_task_id>"
    }
    ```

- GET `/api/alerts/rules/` and `/api/alerts/rules/{id}/`
  - Read-only access to active alert rules used for matching and playbook selection.

- GET `/api/alerts/executions/` and `/api/alerts/executions/{id}/`
  - Read-only access to alert execution records: status, stage, task IDs, inventory used.

### Inventory

- GET `/api/inventory/configs/` and `/api/inventory/configs/{id}/`
  - Active inventory configs with attached variables.

- GET `/api/inventory/mappings/` and `/api/inventory/mappings/{id}/`
  - Connection-test results and discovered mappings (e.g., the chosen Semaphore inventory per host).

### Playbooks

- GET `/api/playbooks/` and `/api/playbooks/{id}/`
  - Active Semaphore playbooks and their survey variables (for building request forms upstream).

## Typical Sequence

1) External system POSTs an alert event to `/api/alerts/events/`.
2) API stores `AlertReceive` and enqueues `process_alert_receive` Celery task.
3) Worker matches an `AlertRule`, resolves or discovers inventory, selects a playbook, executes it via Semaphore, and updates `AlertExecution` with outcome.
4) External system can poll `/api/alerts/executions/` for status or rely on your notification sink.

## Execution Status and Stage

- `AlertExecution.status`: `pending | matched | running | success | failed`
- `AlertExecution.stage`:
  - `received`: alert recorded
  - `matched_rule`: rule matched
  - `inventory_lookup`: trying to resolve inventory
  - `inventory_wait`: waiting for inventory discovery
  - `queued_execution`: about to execute
  - `running`: executing via Semaphore
  - `completed`: finished (success/failed)

## Curl Examples

Create an alert event:
```bash
curl -X POST http://localhost:8000/api/alerts/events/ \
  -H 'Content-Type: application/json' \
  -d '{
    "event_id": "evt-123",
    "event_name": "sshd: Service is not running",
    "host_ip": "10.1.2.3",
    "host_name": "web-01",
    "severity": 3,
    "payload": {"groups": ["Linux Servers"], "tags": {"zone": "dmz"}}
  }'
```

List rules:
```bash
curl http://localhost:8000/api/alerts/rules/
```

List executions:
```bash
curl http://localhost:8000/api/alerts/executions/
```

List inventory configs:
```bash
curl http://localhost:8000/api/inventory/configs/
```

List playbooks:
```bash
curl http://localhost:8000/api/playbooks/
```

## Flow Diagram (Mermaid)

Rendered by GitHub/VSC with Mermaid support. Source is maintained in `docs/alerts_api_flow.mmd`.

```mermaid
%% Source: docs/alerts_api_flow.mmd (keep in sync)
flowchart TD
  %% Alerts API end-to-end flow POST ingestion + background + GET access

  subgraph Client
    C[External System]
  end

  subgraph API_Layer[API Layer Django REST Framework]
    A1[POST /api/alerts/events/\nAlertReceiveViewSet.create]
    A2[DB Create AlertReceive]
    A3[[Enqueue Celery Task\nprocess_alert_receive]]

    G1[GET /api/alerts/rules/]
    G2[DB List AlertRule]

    G3[GET /api/alerts/executions/]
    G4[DB List AlertExecution]

    G5[GET /api/inventory/configs/]
    G6[DB List InventoryConfig +variables]

    G7[GET /api/inventory/mappings/]
    G8[DB List InventoryMapping]

    G9[GET /api/playbooks/]
    G10[DB List SemaphorePlaybook +variables]
  end

  subgraph Worker[Celery Worker]
    W0[Load AlertReceive by id]
    W1{Match active AlertRule?}
    W2[Create AlertExecution\nstatus=matched, stage=matched_rule]
    W3[stage=inventory_lookup]
    W4{Resolve inventory by IP mapping?}
    W5[Set pending_reason=inventory_not_found]
    W6{SemaphoreApiConfig available?}
    W7[[Attempt connection test via\nInventoryManager + Semaphore API]]
    W8{Connection test found working\nSemaphore inventory?}
    W9[Set status=pending\nstage=inventory_wait]
    W10[Select playbook from rule\nby OS/zone]
    W11[[Ensure host exists in inventory]]
    W12[[Execute playbook via\nSemaphoreService]]
    W13{Task success?}
    W14[status=success]
    W15[status=failed]
    W16[stage=completed\nrecord task_id, time_execution]
    WN[[notify_alert_summary]]
  end

  subgraph Ext[External Systems]
    S1[Semaphore API]
  end

  %% Client to API POST Flow
  C --> A1 --> A2 --> A3 -->|task_id| W0

  %% Worker rule matching
  W0 --> W1
  W1 -- No --> R0[Return {status: "no_rule"}]:::terminal
  W1 -- Yes --> W2 --> W3 --> W4

  %% Inventory resolution branch
  W4 -- Yes --> W10
  W4 -- No --> W5 --> W6
  W6 -- No --> W9 --> W16
  W6 -- Yes --> W7 --> W8
  W8 -- No --> W9 --> W16
  W8 -- Yes --> W10

  %% Execution path
  W10 --> W11 --> W12 --> W13
  W13 -- Yes --> W14 --> W16
  W13 -- No  --> W15 --> W16
  W12 -. uses .-> S1
  W11 -. uses .-> S1

  %% Completion notification
  W16 --> WN

  %% GET endpoints
  C --> G1 --> G2
  C --> G3 --> G4
  C --> G5 --> G6
  C --> G7 --> G8
  C --> G9 --> G10

  %% Docs
  subgraph Docs[API Documentation]
    D1[/swagger/]
    D2[/redoc/]
  end
  C --> D1
  C --> D2

  classDef terminal fill:#eee,stroke:#999,stroke-width:1px;
```

## Notes & Future Enhancements

- Authentication/Authorization: add DRF Token or JWT (djangorestframework-simplejwt) if required.
- Filtering & Pagination: add standard filters for executions (by status, stage, host_ip), rules (by active), etc.
- Webhook vs API: webhook remains at `/alerts/webhook` for systems already integrated; new integrations should prefer the API.

## Code References

- Router and docs: `middleware/core/urls.py:1`
- Alert API serializers/viewsets: `middleware/alerts/api.py:1`
- Inventory API serializers/viewsets: `middleware/inventory/api.py:1`
- Playbooks API serializers/viewsets: `middleware/playbooks/api.py:1`
- Celery task: `middleware/alerts/tasks.py:1`
- Alert services/flow: `middleware/alerts/services.py:200`

