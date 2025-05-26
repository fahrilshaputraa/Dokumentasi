const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const ref = req.body.ref;
  if (ref === "refs/heads/main") {
    console.log("Detected push to main, updating...");
    exec(`
      cd /home/fahril/fahrilshaputra/docsify && \
      git pull origin main && \
      cd docs && \
      docker compose down && \
      docker compose up -d
    `, (error, stdout, stderr) => {
      if (error) {
        console.error("Exec error:", error);
        return res.sendStatus(500);
      }
      console.log(stdout);
      console.error(stderr);
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(200);
  }
});

app.listen(3001, () => {
  console.log("Webhook listener aktif di port 3001");
});
