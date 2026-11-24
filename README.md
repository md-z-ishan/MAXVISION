# 👓 MAXVISION Optical – Flagship Eyewear eCommerce & Clinical Optical Retail Platform

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite%205-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Django](https://img.shields.io/badge/Backend-Django%204.2%20LTS-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework-red?style=for-the-badge&logo=django&logoColor=white)](https://django-rest-framework.org)
[![JWT](https://img.shields.io/badge/Auth-SimpleJWT-black?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![ReportLab](https://img.shields.io/badge/PDF%20Engine-ReportLab%204.5-orange?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)](https://www.reportlab.com)
[![Location](https://img.shields.io/badge/Flagship%20Store-Ranchi%2C%20Jharkhand-green?style=for-the-badge&logo=google-maps&logoColor=white)](https://www.google.com/maps/search/?api=1&query=Sheetal+Tower+Taxi+Stand+Main+Road+Ranchi+Jharkhand)

---

## 📖 Table of Contents

1. [Executive Summary & Retail Store Information](#-executive-summary--retail-store-information)
2. [Complete System Architecture](#-complete-system-architecture)
3. [Full Project Feature Breakdown](#-full-project-feature-breakdown)
   - [3.1 Product Catalog & Contact Lens Engine](#31-product-catalog--contact-lens-engine)
   - [3.2 Prescription Handling & Privacy Architecture](#32-prescription-handling--privacy-architecture)
   - [3.3 Lens Package Engine](#33-lens-package-engine)
   - [3.4 Atomic Conditional Stock Engine](#34-atomic-conditional-stock-engine)
   - [3.5 Dual Payment Architecture (COD + Dynamic UPI QR)](#35-dual-payment-architecture-cod--dynamic-upi-qr)
   - [3.6 Instant WhatsApp Order Confirmation](#36-instant-whatsapp-order-confirmation)
   - [3.7 Visual Order Tracking & History](#37-visual-order-tracking--history)
   - [3.8 Automated ReportLab PDF Tax Invoicing](#38-automated-reportlab-pdf-tax-invoicing)
   - [3.9 User Profile, Address Book & Password Recovery](#39-user-profile-address-book--password-recovery)
   - [3.10 Doorstep "Try @ Home" & Ranchi Store Locator](#310-doorstep-try--home--ranchi-store-locator)
   - [3.11 Virtual 3D/2D Try-On Studio](#311-virtual-3d2d-try-on-studio)
4. [Role-Based Access Control (RBAC) Architecture](#-role-based-access-control-rbac-architecture)
5. [Complete REST API Reference](#-complete-rest-api-reference)
6. [Data Models & Database Schema](#-data-models--database-schema)
7. [Administrative & Management Commands](#-administrative--management-commands)
8. [Automated Testing & QA Verification Suite](#-automated-testing--qa-verification-suite)
9. [Local Development & Setup Guide](#-local-development--setup-guide)
10. [Repository Directory Structure](#-repository-directory-structure)
11. [Production Hardening & Deployment Guide](#-production-hardening--deployment-guide)
12. [Project Documentation Links](#-project-documentation-links)
13. [Developer & Maintainer Credits](#-developer--maintainer-credits)

---

## 🏢 Executive Summary & Retail Store Information

**MAXVISION** is an enterprise-grade, full-stack eCommerce and clinical optical retail platform built specifically for an active optical business located in **Ranchi, Jharkhand**. Inspired by industry benchmarks like **Lenskart** and **Flipkart**, the platform delivers an omnichannel digital retail solution for spectacles, sunglasses, blue-light computer glasses, contact lenses, and custom ophthalmic lens fittings.

### 📍 Flagship Physical Showroom Information
* **Business Name:** MAXVISION Optical
* **Address:** Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand – 834001
* **Direct Telephone:** `+91 7485067874` | `+91 7033353140`
* **Operating Hours:** 10:00 AM – 8:30 PM (Open 7 days a week)
* **Local Services:** Free in-store computer eye checkups, doorstep home frame trials across Ranchi, frame repair, and rapid single-vision lens fitting within 30 minutes.
* **Lead Engineer:** Zishan (B.Tech Computer Science & Engineering, Lovely Professional University)

---

## 🏗️ Complete System Architecture

The application employs a high-performance decoupled architecture. The frontend is a modern single-page application (SPA) built in React 18 with Vite, which communicates asynchronously via secure JSON REST APIs with a hardened Django 4.2 LTS backend:

```
+───────────────────────────────────────────────────────────────────────────────────+
|                          CLIENT LAYER (Mobile & Desktop)                          |
|  - Progressive Single Page Application (React 18, Vite 5, Tailwind CSS)          |
|  - Redux Toolkit (Session & Auth State), Axios with JWT Request Interceptor       |
|  - Viewport-Responsive Layouts (360px Mobile -> 1536px Ultra-Wide Desktop)        |
+─────────────────────────────────────────┬─────────────────────────────────────────+
                                          │
                                          │ HTTP / HTTPS (JSON Payloads & JWT)
                                          ▼
+───────────────────────────────────────────────────────────────────────────────────+
|                         APPLICATION LAYER (Django 4.2 LTS)                        |
|  - Django REST Framework (DRF 3.16) API Routers & ViewSets                        |
|  - SimpleJWT Authentication & Token Refresh Flow                                  |
|  - Role-Based Access Control (RBAC): Developer, Shop Owner, Customer              |
|  - Protected Media Streaming Guard (`protected_media_serve` with HTTP 403 blocks)  |
|  - Atomic Database Transactions with Conditional F() Stock Deduction              |
|  - Dynamic ReportLab PDF Tax Invoice Generator                                    |
|  - Security Throttling & Rate Limiting (`AnonRateThrottle`, `UserRateThrottle`)  |
+──────────────────────────┬───────────────────────────────┬────────────────────────+
                           │                               │
                           ▼                               ▼
+──────────────────────────────────────+       +────────────────────────────────────+
|            DATA STORAGE              |       |           MEDIA STORAGE            |
|  - SQLite (Local Dev & Testing)      |       |  - Public: /media/products/        |
|  - PostgreSQL (Production Tier)      |       |  - Public: /media/payment_qr/      |
|  - Additive Migrations Only          |       |  - Protected: /media/prescriptions/|
|  - Real Database-Calculated Totals   |       |  - Protected: /media/invoices/     |
+──────────────────────────────────────+       +────────────────────────────────────+
```

---

## 🚀 Full Project Feature Breakdown

### 3.1 Product Catalog & Contact Lens Engine
* **Four Dedicated Categories:**
  1. `eyeglasses`: Optical frames for corrective prescription lenses.
  2. `sunglasses`: Polarized and UV-protected fashion and sports eyewear.
  3. `computer_glasses`: Anti-glare and blue-light protection frames.
  4. `contact_lenses`: Specialized lens packs with medical specifications.
* **Category-Aware Dynamic Filtering:**
  - Eyewear filters: Frame Shape (`rectangle`, `round`, `wayfarer`, `aviator`, `cat_eye`, `geometric`), Frame Size (`narrow`, `medium`, `wide`, `extra_wide`), Brand, and Price Range.
  - Contact lens filters: Lens Type (`spherical`, `toric`, `multifocal`, `colored`), Wear Duration (`daily`, `monthly`, `yearly`), and Pack Size.
* **Smart Search with Real-Time Debounce:** Integrated navbar search with instant keyword suggestions for brands, models, and frame shapes.
* **Multi-Criteria Sorting:** Sort by Recommended, Price: Low to High, Price: High to Low, Newest Arrivals, and Highest Discount.
* **Zero Layout Shift:** Responsive image fallbacks and skeleton loaders across mobile (375px) and desktop (1280px).

### 3.2 Prescription Handling & Privacy Architecture
* **Dual Prescription Input:**
  1. **Digital Upload:** Customers can upload doctor prescription slips in PDF, PNG, or JPG format directly at checkout.
  2. **Manual Power Entry:** Detailed clinical parameters for both eyes:
     - **OD (Right Eye):** Sphere (`SPH`), Cylinder (`CYL`), Axis (`AXIS`), Addition (`ADD`).
     - **OS (Left Eye):** Sphere (`SPH`), Cylinder (`CYL`), Axis (`AXIS`), Addition (`ADD`).
     - **Pupillary Distance:** `PD` measurement in millimeters.
* **Medical Privacy Security Guard:**
  - Prescriptions are stored in `/media/prescriptions/` but protected against direct unauthorized URL scraping.
  - Unauthenticated access returns an explicit **HTTP 403 Forbidden**.
  - Secure downloads are permitted exclusively via authenticated API endpoints (`/api/orders/<id>/prescription/`) reserved for the order owner or authenticated staff.

### 3.3 Lens Package Engine
* **Transparent Pricing Tiers:**
  - **Frame Only (+₹0):** Shipped with standard acrylic demo lenses.
  - **Single Vision (+₹500):** Corrective lenses for either distance or reading power.
  - **Bifocal / Progressive (+₹1,500):** Dual-vision or smooth multifocal transition lenses.
  - **Zero Power Computer (+₹300):** Anti-glare blue-cut lenses for digital screen comfort.
* **Server-Side Validation:** All total amounts are computed strictly in backend database transactions; client-side price tampering is completely ignored.

### 3.4 Atomic Conditional Stock Engine
* **Race-Condition Immune:** Eliminates overselling via conditional database update queries:
  ```python
  Product.objects.filter(pk=item.product_id, stock_quantity__gte=qty).update(
      stock_quantity=F('stock_quantity') - qty
  )
  ```
* **Strict Transaction Rollback:** If any item in a multi-product cart has insufficient inventory, the entire order transaction rolls back atomically and returns a descriptive **HTTP 400 Bad Request**.
* **Single-Restore Order Cancellation:** Cancelling an order via API or Django Admin restores inventory to the catalog **strictly once**, tracked by the `stock_restored` boolean flag.

### 3.5 Dual Payment Architecture (COD + Dynamic UPI QR)
* **1. Cash on Delivery (COD):**
  - Instant order confirmation with inventory deduction and `payment_status = 'UNPAID'`.
* **2. Manual UPI QR Payment:**
  - Managed via the singleton database model `StorePaymentSettings`.
  - Displays the official store QR code uploaded by the shop owner in Django Admin.
  - Dynamic fallback to store UPI ID (`7485067874@upi` / `maxvision@upi`).
  - Mobile deep linking via `upi://pay?pa=...&pn=MAXVISION%20Optical&am=...`.
  - One-click "Copy UPI ID" button with visual feedback.
  - Mandatory customer 12-digit UTR/Transaction Number input.
  - Sets order to `payment_status = 'PENDING_VERIFICATION'` until verified in Django Admin by the shop owner.

### 3.6 Instant WhatsApp Order Confirmation
* Generates a pre-filled WhatsApp click-to-chat URL linking directly to the store's official phone (`wa.me/917485067874`):
  - Automatically compiles Order ID, customer name, delivery address, items, lens package, order total, and payment method into a compact message (<1,500 characters).
  - **Privacy Safe:** Excludes raw prescription medical values and files from the public WhatsApp message text.
  - Prominent "Confirm on WhatsApp" button available on Order Success and Order Tracking screens.

### 3.7 Visual Order Tracking & History
* Flipkart and Amazon-style graphical order timeline:
  `Pending` ➡️ `Accepted` ➡️ `Processing Lenses` ➡️ `Shipped` ➡️ `Delivered`
* Status changes logged chronologically with timestamps and optional internal notes in `OrderStatusHistory`.
* Self-service customer order cancellation available while an order is in `Pending` status.

### 3.8 Automated ReportLab PDF Tax Invoicing
* Dynamically generates a professional, printable GST-compliant PDF invoice using `ReportLab 4.5`:
  - Contains complete store details (MAXVISION Optical, Sheetal Tower, Main Road, Ranchi – 834001, Ph: 7485067874).
  - Unique invoice serial numbers (e.g., `INV-2026-0001`).
  - Itemized table with frame name, lens package, unit price, quantity, delivery fee, and net total.
  - Downloadable directly from the customer Orders dashboard or Django Admin.

### 3.9 User Profile, Address Book & Password Recovery
* **User Profile (`/profile`):** Customer dashboard showing contact info, recent orders, and saved addresses.
* **Address Book:** Multi-address support with default shipping address selection.
* **Password Recovery:** Secure token-based password reset workflow (`/api/auth/password-reset-request/` & `/api/auth/password-reset-confirm/`).

### 3.10 Doorstep "Try @ Home" & Ranchi Store Locator
* **Doorstep Home Visit Booking (`/try-at-home`):** Ranchi residents can schedule a free home visit for eye testing and frame trials. Requests are tracked in Django Admin (`HomeVisitRequest`).
* **Store Locator (`/stores`):** Interactive Ranchi showroom guide with direct Google Maps directions and dual one-click call buttons (`7485067874` / `7033353140`).

### 3.11 Virtual 3D/2D Try-On Studio
* Live webcam and photo-upload try-on module allowing shoppers to visualize frame fit and shape on their face prior to purchase.
* Studio controls protected by staff permissions.

---

## 🛡️ Role-Based Access Control (RBAC) Architecture

MAXVISION features a hardened **Three-Tier Account Architecture**:

```
+─────────────────────────────────────────────────────────────────────────────+
|                                1. DEVELOPER                                 |
|                       (Django Superuser: is_superuser=True)                 |
|  - Full technical & database control                                        |
|  - Manages Django Users, Groups, Permissions, and Settings                  |
|  - Creates, rotates, and manages the single Shop Owner account               |
+─────────────────────────────────────────────────────────────────────────────+
                                       │
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                               2. SHOP OWNER                                 |
|              (is_staff=True, is_superuser=False, Group: "Shop Owner")       |
|  - Business management interface via Django Admin (/admin/)                 |
|  - Exactly 18 business permissions:                                         |
|    • Products: Add, Change, Delete, View                                    |
|    • Orders & Order Items: View, Change status                              |
|    • UPI Payments: Verify UTR & Mark Orders Paid                            |
|    • StorePaymentSettings: Manage UPI ID & QR Code                          |
|    • Invoices & Prescriptions: View & Download                              |
|    • Home Visits: View & Change status                                      |
|    • User Profiles & Addresses: View for shipping fulfillment               |
|  - Strict Lockouts:                                                         |
|    • Cannot access User/Group management (Hidden & 403 Forbidden)           |
|    • Cannot delete Orders, Invoices, Prescriptions, or OrderStatusHistory   |
|    • Cannot change own staff/superuser status or permissions                |
+─────────────────────────────────────────────────────────────────────────────+
                                       │
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                                3. CUSTOMER                                  |
|                     (is_staff=False, is_superuser=False)                    |
|  - Front-end shopper interface (React SPA)                                  |
|  - Manages own Cart, Wishlist, Profile, Orders, and Addresses               |
|  - Strict object-level isolation (Cannot view or edit other customer data)  |
|  - Blocked from Django Admin (/admin/) with 403/Redirect                    |
|  - Registration endpoint rejects privilege escalation injections (400 Bad)  |
+─────────────────────────────────────────────────────────────────────────────+
```

---

## 🔗 Complete REST API Reference

### 🔐 Authentication & Accounts
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register/` | Public | Register new customer account (guarded against privilege escalation) |
| `POST` | `/api/auth/login/` | Public | Obtain JWT Access and Refresh token pair |
| `POST` | `/api/auth/refresh/` | Public | Refresh an expired access token |
| `GET` | `/api/auth/profile/` | JWT | Get logged-in user profile, mobile, age, and default address |
| `PATCH` | `/api/auth/profile/` | JWT | Update user profile information |
| `POST` | `/api/auth/password-reset-request/` | Public | Request password reset token |
| `POST` | `/api/auth/password-reset-confirm/` | Public | Confirm password reset with token and new password |

### 🕶️ Product Catalog
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/products/` | Public | Filterable catalog (`category`, `shape`, `size`, `brand`, `lens_type`, `search`, `ordering`) |
| `GET` | `/api/products/<id>/` | Public | Retrieve full technical specifications of a single frame or contact lens pack |

### 🛒 Shopping Cart & Wishlist
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/cart/` | JWT | Retrieve current user's cart items with computed subtotals |
| `POST` | `/api/cart/` | JWT | Add item to cart with lens package choice and prescription ID |
| `PATCH` | `/api/cart/update/<pk>/<action>/` | JWT | Increment (`inc`) or decrement (`dec`) quantity (stock ceiling enforced) |
| `DELETE` | `/api/cart/<pk>/` | JWT | Remove item from cart |
| `GET` | `/api/wishlist/` | JWT | Retrieve current user's saved wishlist frames |
| `POST` | `/api/wishlist/toggle/<product_id>/` | JWT | Toggle product in/out of customer wishlist |

### 📦 Checkout & Order Management
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/checkout/` | JWT | Atomic order placement with prescription upload, address, and payment method |
| `GET` | `/api/orders/` | JWT | Retrieve logged-in user's order history with tracking timelines |
| `POST` | `/api/orders/<id>/cancel/` | JWT | Cancel a pending order with atomic stock restoration |
| `GET` | `/api/orders/<id>/invoice/` | JWT/Staff | Download dynamic GST tax invoice PDF |
| `GET` | `/api/orders/<id>/prescription/` | JWT/Staff | Download customer's uploaded prescription file |

### 🏠 Customer Address Book
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/addresses/` | JWT | List customer's saved shipping addresses |
| `POST` | `/api/addresses/` | JWT | Add a new delivery address |
| `PUT/PATCH` | `/api/addresses/<id>/` | JWT | Update an existing address |
| `DELETE` | `/api/addresses/<id>/` | JWT | Delete a saved address |

### 🛠️ Store Administration & Utility
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/payment-settings/` | Public | Retrieve active store UPI ID, QR code image URL, and payment flags |
| `POST` | `/api/home-visit/` | Public | Submit doorstep "Try @ Home" request for Ranchi |
| `GET` | `/api/admin/dashboard-stats/` | Staff | Summary of orders, revenue, and inventory alerts |
| `GET` | `/api/health/` | Public | System uptime, database connectivity, and health check |

---

## 🗄️ Data Models & Database Schema

All database models reside in `store/models.py`:

```
+──────────────────────────+       +──────────────────────────+       +──────────────────────────+
|         Product          |       |       Prescription       |       |       UserProfile        |
|──────────────────────────|       |──────────────────────────|       |──────────────────────────|
| id (PK)                  |       | id (PK)                  |       | id (PK)                  |
| name, description, price |       | user (FK -> User)        |       | user (1:1 -> User)       |
| discount_percentage      |       | od_sph, od_cyl, od_axis  |       | mobile (unique)          |
| stock_quantity           |       | os_sph, os_cyl, os_axis  |       | age, gender              |
| category, frame_shape    |       | od_add, os_add, pd       |       +──────────────────────────+
| frame_size, frame_color  |       +──────────────────────────+
| brand, material, image   |                     │
| lens_type, wear_duration |                     │
| pack_size, power_required|                     │
+──────────────────────────+                     │
             │                                   │
             ▼                                   ▼
+──────────────────────────+       +──────────────────────────+       +──────────────────────────+
|           Cart           |       |          Order           |       |        OrderItem         |
|──────────────────────────|       |──────────────────────────|       |──────────────────────────|
| id (PK)                  |       | id (PK)                  |       | id (PK)                  |
| user (FK -> User)        |       | user (FK -> User)        |       | order (FK -> Order)      |
| product (FK -> Product)  |<──────| address, mobile          |       | product (FK -> Product)  |
| quantity, lens_package   |       | total_amount, status     |       | quantity, price          |
| lens_price, prescription |       | payment_method, utr_no   |       | lens_package, lens_price |
+──────────────────────────+       | payment_status           |       | prescription_details     |
                                   | delivery_type, charge    |       +──────────────────────────+
                                   | stock_restored (bool)    |
                                   | prescription_file        |
                                   +──────────────────────────+
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   ▼                             ▼                             ▼
+──────────────────────────+       +──────────────────────────+       +──────────────────────────+
|         Invoice          |       |   OrderStatusHistory     |       |   StorePaymentSettings   |
|──────────────────────────|       |──────────────────────────|       |──────────────────────────|
| id (PK)                  |       | id (PK)                  |       | id (PK: singleton 1)     |
| order (1:1 -> Order)     |       | order (FK -> Order)      |       | upi_id, display_name     |
| serial_number (unique)   |       | status, notes, created_at|       | qr_image, upi_enabled    |
| pdf (FileField)          |       +──────────────────────────+       +──────────────────────────+
+──────────────────────────+
```

---

## ⚙️ Administrative & Management Commands

### 1. Configure RBAC Roles (`setup_roles`)
Configures the `Shop Owner` group with the exact 18 business management permissions. This command is completely idempotent:
```bash
python3 manage.py setup_roles
```

### 2. Create or Rotate the Designated Shop Owner (`create_shop_owner`)
Ensures exactly one active shop owner account exists:
```bash
# Interactive password prompt:
python3 manage.py create_shop_owner --username shopowner --email owner@maxvision.com

# Non-interactive with password parameter:
python3 manage.py create_shop_owner --username shopowner --password "SecurePass123"

# Rotate an existing owner account safely:
python3 manage.py create_shop_owner --username newowner --password "NewPass123" --rotate
```

### 3. Seed Catalog Products (`populate_products`)
Seeds high-resolution optical frames and contact lenses into the local database:
```bash
python3 populate_products.py
```

---

## 🧪 Automated Testing & QA Verification Suite

The repository contains an exhaustive automated test suite covering all security, inventory, and payment features:

| Test Module | Description | Test Count |
| :--- | :--- | :---: |
| `store.tests_stock_phase1` | Atomic conditional stock deduction & rollback logic | 6 |
| `store.tests_stage7` | Visual order tracking and single-restore cancellation | 4 |
| `store.tests_stage8a` | Dynamic UPI QR payment, UTR verification, WhatsApp links | 5 |
| `store.tests_stage8b` | ReportLab PDF invoice generation, address book, profile | 6 |
| `store.tests_stage9` | Production settings, throttling, environment variables | 4 |
| `store.tests_concurrency` | High-concurrency rapid checkout inventory protection | 1 |
| `store.tests_stage11_rbac` | Complete Role-Based Access Control, Admin hardening, media privacy | 13 |

### Running the Tests:
```bash
# Run the complete test suite:
python3 manage.py test store.tests_stage8a store.tests_stage8b store.tests_stage9 store.tests_concurrency store.tests_stage11_rbac --noinput

# Run RBAC security tests specifically:
python3 manage.py test store.tests_stage11_rbac --noinput

# Run Django system health check:
python3 manage.py check
```

---

## 💻 Local Development & Setup Guide

### Method A: Quick Launcher (Recommended)
Use the included automated startup script from the root folder:
```bash
./run_local.sh
```
Follow the interactive prompt to automatically boot both the Django API (port 8000) and the React Vite SPA (port 5173).

---

### Method B: Manual Step-by-Step Setup

#### 1. Backend (Django)
```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
python3 manage.py migrate

# 4. Set up RBAC roles and shop owner
python3 manage.py setup_roles
python3 manage.py create_shop_owner --username shopowner --password "OwnerPass123"

# 5. Start Django development server
python3 manage.py runserver 0.0.0.0:8000
```
* Backend API: `http://localhost:8000/api/`
* Django Admin: `http://localhost:8000/admin/`

#### 2. Frontend (React + Vite)
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install node dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
* Customer Storefront: `http://localhost:5173/`

---

## 📁 Repository Directory Structure

```
maxvision/
├── manage.py                          # Django management script
├── db.sqlite3                         # Local SQLite development database
├── requirements.txt                   # Production Python package manifest
├── populate_products.py               # Optical catalog data seeder
├── run_local.sh                       # Interactive local launch script
├── README.md                          # Primary comprehensive documentation
├── plan.md                            # Complete multi-stage execution master plan
├── .env.example                       # Template for environment secrets
│
├── ecommerce2/                        # Django project configuration root
│   ├── settings.py                    # Hardened settings (SimpleJWT, WhiteNoise, Security)
│   ├── urls.py                        # Root URL router & protected media router
│   └── wsgi.py                        # WSGI entrypoint
│
├── store/                             # Core optical retail Django application
│   ├── models.py                      # Data models (Product, Order, Invoice, RBAC, etc.)
│   ├── api_views.py                   # REST API ViewSets & endpoints
│   ├── views.py                       # Legacy template views & CSV exports
│   ├── media_views.py                 # Protected prescription/invoice media streaming
│   ├── admin.py                       # Hardened Django Admin (SecureUserAdmin, guards)
│   ├── serializers.py                 # DRF serializers
│   ├── utils.py                       # ReportLab PDF invoice generator
│   ├── management/commands/           # Management commands
│   │   ├── setup_roles.py             # Idempotent Shop Owner role configuration
│   │   └── create_shop_owner.py       # Single designated shop owner creation command
│   ├── tests_stock_phase1.py          # Phase 1 stock tests
│   ├── tests_stage7.py                # Order tracking tests
│   ├── tests_stage8a.py               # UPI & WhatsApp tests
│   ├── tests_stage8b.py               # Invoicing & Address book tests
│   ├── tests_stage9.py                # Security & Throttling tests
│   ├── tests_concurrency.py           # Concurrency stock tests
│   └── tests_stage11_rbac.py          # Full RBAC & security tests
│
├── frontend/                          # React 18 + Vite SPA frontend
│   ├── package.json                   # NPM package manifest
│   ├── vite.config.js                 # Vite bundler configuration
│   ├── tailwind.config.js             # Tailwind CSS design tokens
│   └── src/
│       ├── api/axios.js               # Axios instance with JWT bearer interceptor
│       ├── config/siteConfig.js       # Store phone numbers, address, and metadata
│       ├── components/                # Global UI components
│       │   ├── Navbar.jsx             # Category links, debounced search, badges
│       │   ├── Footer.jsx             # Ranchi store info, quick links, policies
│       │   └── FloatingWhatsApp.jsx   # One-click floating WhatsApp chat
│       └── pages/                     # Storefront page views
│           ├── Home.jsx               # Hero banner, category highlights, USP
│           ├── Products.jsx           # Category-aware product catalog with filters
│           ├── ProductDetails.jsx     # Specs, lens package selector, live stock
│           ├── Cart.jsx               # Quantity limits, subtotals, checkout gate
│           ├── Checkout.jsx           # Rx upload, address picker, COD / UPI QR
│           ├── Orders.jsx             # Visual order tracker & PDF invoice download
│           ├── Profile.jsx            # User profile & address book management
│           ├── Stores.jsx             # Ranchi Sheetal Tower store locator & maps
│           ├── TryAtHome.jsx          # Doorstep eye test booking form
│           ├── VirtualTryOn.jsx       # 2D/3D webcam virtual eyewear fitting
│           └── Login.jsx / Register.jsx # Authentication screens
│
├── docs/                              # Project documentation & operational handbooks
│   ├── OWNER_HANDOVER.md              # Shop Owner operational manual for Django Admin
│   ├── DEVELOPER_ACCESS.md            # Developer technical guide & account rotation
│   ├── ROLE_PERMISSION_MATRIX.md      # Detailed RBAC permissions matrix
│   ├── PREDEPLOY_QA.md                # Pre-deployment QA verification checklist
│   └── DEV_LOG.md                     # Engineering progress log for Stages 1 through 11
│
├── media/                             # Local media upload storage
│   ├── products/                      # Product images (publicly accessible)
│   ├── payment_qr/                    # Store UPI QR codes (publicly accessible)
│   ├── prescriptions/                 # Uploaded prescription slips (HTTP 403 protected)
│   └── invoices/                      # Generated tax invoice PDFs (HTTP 403 protected)
│
└── backups/                           # Local database & media backup snapshots
```

---

## 🌐 Production Hardening & Deployment Guide

### Recommended Cloud Stack
* **Frontend SPA:** Vercel or Netlify (Fast global CDN edge routing with SPA rewrite rules).
* **Backend API:** Render, Railway, or AWS EC2 (Python 3.9+ environment with Gunicorn).
* **Database:** Managed PostgreSQL (Supabase, Neon, or AWS RDS).
* **Media & Prescriptions:** Cloudinary or AWS S3 with signed private download URLs.

### Production Environment Variables (`.env`)
```ini
DJANGO_SECRET_KEY=production_high_entropy_secret_key_here
DEBUG=False
ALLOWED_HOSTS=api.maxvisionoptical.com,maxvisionoptical.com
DATABASE_URL=postgres://user:password@hostname:5432/maxvision_db
CORS_ALLOWED_ORIGINS=https://maxvisionoptical.com,https://www.maxvisionoptical.com
STORE_UPI_ID=7485067874@upi
STORE_PHONE_PRIMARY=917485067874
STORE_PHONE_SECONDARY=917033353140
```

---

## 📚 Project Documentation Links

For specialized operational guidelines and deep-dive technical manuals, consult the documentation in `docs/`:

* 📖 **[Shop Owner Handover Guide](docs/OWNER_HANDOVER.md)** — Step-by-step business management guide for the shopkeeper (managing products, orders, UPI approvals, and downloading invoices).
* 🔧 **[Developer Technical Access Guide](docs/DEVELOPER_ACCESS.md)** — Handbook for developers covering superuser credentials, database rotation, management commands, and environment setups.
* 🛡️ **[Role & Permission Matrix](docs/ROLE_PERMISSION_MATRIX.md)** — Complete access control mapping across Developer, Shop Owner, Customer, and Anonymous users.
* 🧪 **[Pre-Deployment QA Report](docs/PREDEPLOY_QA.md)** — Multi-device responsive design verification, security checks, and audit trails.
* 📝 **[Full Engineering Development Log](docs/DEV_LOG.md)** — Detailed chronological changelog documenting implementation across all project stages.

---

## 👨‍💻 Developer & Maintainer Credits

* **Lead Full-Stack Developer:** **Zishan**
* **Academic Background:** B.Tech Computer Science & Engineering, Lovely Professional University
* **Specialization:** Full-Stack Web Architecture, Django REST Framework, React Ecosystem, Enterprise eCommerce Systems
* **Client / Store:** MAXVISION Optical (Shop 4, Sheetal Tower, Main Road, Ranchi, Jharkhand – 834001)
