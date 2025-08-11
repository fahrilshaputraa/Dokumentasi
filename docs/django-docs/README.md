# Dokumentasi Dasar Django

## 1. Persiapan & Instalasi (F)
- Penjelasan singkat tentang Django (apa & kegunaannya).
- Cara instal Python & Django (versi yang dipakai).
- Membuat virtual environment (`venv`) dan mengaktifkannya.
- Instalasi Django di virtual environment.

## 2. Membuat Proyek Django (F)
- Perintah `django-admin startproject nama_proyek`.
- Struktur folder & penjelasan file:
  - `manage.py`
  - Folder `settings.py`, `urls.py`, `wsgi.py`, `asgi.py`
- Cara menjalankan server (`python manage.py runserver`).

## 3. Membuat Aplikasi di Django (F)
- Perintah `python manage.py startapp nama_aplikasi`.
- Penjelasan struktur folder app:
  - `views.py`
  - `models.py`
  - `admin.py`
  - `apps.py`
- Menambahkan app di `INSTALLED_APPS` (settings.py).

## 4. Routing (URLs) (F)
- Konsep URL routing di Django.
- `urls.py` di project vs di app.
- Cara menambahkan path baru (`path()` dan `include()`).

## 5. Views (F)
- Fungsi view sederhana (`HttpResponse`).
- View dengan `render()` untuk template HTML.
- Perbedaan Function-Based View (FBV) dan Class-Based View (CBV).

## 6. Template (F)
- Folder `templates/` & cara mengaturnya di `settings.py`.
- Sintaks dasar template Django (`{{ }}` dan `{% %}`).
- Template inheritance (`extends` dan `block`).
- Static files (`css`, `js`, `images`):
  - Folder `static/`
  - `{% load static %}`

## 7. Models & Database (F)
- Konsep model di Django.
- Membuat model (`models.Model`).
- Field types (CharField, IntegerField, DateField, dll).
- Relasi antar model (OneToOne, ForeignKey, ManyToMany).
- Migrasi database (`makemigrations` & `migrate`).

## 8. Django Admin (F)
- Membuat superuser (`createsuperuser`).
- Registrasi model di `admin.py`.
- Customisasi tampilan admin sederhana.

## 9. Forms
- Form manual di HTML.
- Django `forms.Form` dan `forms.ModelForm`.
- Validasi data form.

## 10. CRUD
- Create, Read, Update, Delete dengan Django.
- Contoh view & template CRUD sederhana.
