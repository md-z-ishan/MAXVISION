# 💻 MAXVISION Optical – Developer Access & Platform Administration

**Lead Developer:** Zishan (B.Tech CSE, Lovely Professional University)  
**Architecture:** Decoupled React 18 SPA + Django 4.2 REST Backend  
**Security Tier:** Level 1 (Developer Superuser)  

---

## 1. Developer Account Architecture

The Developer account is the sole **Django superuser** (`is_staff=True`, `is_superuser=True`).  
It possesses complete technical governance over the platform:
* Full database access and migration authority.
* User, Group, and Permission management.
* Creation, deactivation, and credential rotation of the designated Shop Owner account.
* System logging, throttling configuration, and environment secrets management.
* Deletion authority over erroneous test records (with audit responsibility).

---

## 2. Managing the Shop Owner Account

### Initial Provisioning (Command-Line)
Run the automated and secure management command:
```bash
python3 manage.py create_shop_owner
```
Or with CLI arguments:
```bash
python3 manage.py create_shop_owner --username shop_owner_asif --email owner@maxvisionoptical.com
```
* The command uses `getpass` to prompt for the password interactively so plaintext credentials are never echoed to terminal logs.
* Sets `is_staff=True` and `is_superuser=False`.
* Automatically attaches the user to the `Shop Owner` group with audited business permissions.

### Enforcing the Single Active Shop Owner Constraint
The platform strictly permits **exactly one designated active Shop Owner account**:
```bash
# If an active Shop Owner already exists, running create_shop_owner throws an Architecture Violation error.
# To rotate or replace the Shop Owner:
python3 manage.py create_shop_owner --username new_owner --rotate
```
Passing `--rotate` safely deactivates the previous owner account before creating the new one.

---

## 3. Idempotent Role & Permission Setup

To audit or refresh the `Shop Owner` group permissions at any time:
```bash
python3 manage.py setup_roles
```
* Ensures `Shop Owner` has exactly the 18 required business permissions.
* Strictly prevents assignment of `delete_order`, `delete_invoice`, `delete_prescription`, or `auth.*` permissions.
* Can be run repeatedly in CI/CD without side-effects or drift.

---

## 4. Protected Media & Customer Document Privacy

Customer medical prescriptions (`media/prescriptions/`) and tax invoices (`media/invoices/`) are routed through `store/media_views.py:protected_media_serve`.
* Direct unauthenticated HTTP access to `/media/prescriptions/...` is blocked with **HTTP 403 Forbidden**.
* Authorized access is strictly served via `/api/orders/<id>/prescription/` and `/api/orders/<id>/invoice/`, enforcing object-level ownership checks (`order.user == request.user` or `request.user.is_staff`).
* Public product images (`/media/products/`) and payment QR images continue to serve normally for storefront visitors.

---

## 5. Production Environment Checklist (`.env`)

Before live deployment, ensure `.env` contains:
```bash
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<generate_strong_random_key_50+_characters>
ALLOWED_HOSTS=maxvisionoptical.com,www.maxvisionoptical.com
DATABASE_URL=postgres://maxvision_user:strongpassword@localhost:5432/maxvision_prod
CORS_ALLOWED_ORIGINS=https://maxvisionoptical.com
CSRF_TRUSTED_ORIGINS=https://maxvisionoptical.com
SECURE_SSL_REDIRECT=True
```
*(When `DJANGO_DEBUG=False`, Django automatically enforces HTTPS redirects, HSTS, and secure session/CSRF cookies).*

