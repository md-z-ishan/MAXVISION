# 👓 MAXVISION Optical – Flagship Eyewear eCommerce & Clinical Retail Platform

[![React](https://img.shields.io/badge/Frontend-React%2018.3.1-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite%205.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Django](https://img.shields.io/badge/Backend-Django%204.2%20LTS-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework%203.16.1-red?style=for-the-badge&logo=django&logoColor=white)](https://django-rest-framework.org)
[![SimpleJWT](https://img.shields.io/badge/Auth-SimpleJWT%205.5.1-black?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![ReportLab](https://img.shields.io/badge/PDF%20Engine-ReportLab%204.5.0-orange?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)](https://www.reportlab.com)
[![Location](https://img.shields.io/badge/Showroom-Ranchi%2C%20Jharkhand-green?style=for-the-badge&logo=google-maps&logoColor=white)](https://www.google.com/maps/search/?api=1&query=Sheetal+Tower+Taxi+Stand+Main+Road+Ranchi+Jharkhand)

---

## 📖 Table of Contents

1. [Executive Summary & Retail Store Information](#-executive-summary--retail-store-information)
2. [Complete System Architecture & Tech Stack](#-complete-system-architecture--tech-stack)
3. [Verified Feature Implementation Status Matrix](#-verified-feature-implementation-status-matrix)
4. [In-Depth Feature Analysis](#-in-depth-feature-analysis)
   - [4.1 Product Catalog & Contact Lens Engine](#41-product-catalog--contact-lens-engine)
   - [4.2 Prescription System & Clinical Privacy](#42-prescription-system--clinical-privacy)
   - [4.3 Lens Package Engine](#43-lens-package-engine)
   - [4.4 Atomic Conditional Stock Engine](#44-atomic-conditional-stock-engine)
   - [4.5 Dual Payment Architecture (COD + Dynamic UPI QR)](#45-dual-payment-architecture-cod--dynamic-upi-qr)
   - [4.6 Instant WhatsApp Order Confirmation](#46-instant-whatsapp-order-confirmation)
   - [4.7 Visual Order Tracking & History](#47-visual-order-tracking--history)
   - [4.8 Dynamic ReportLab PDF Tax Invoicing](#48-dynamic-reportlab-pdf-tax-invoicing)
   - [4.9 Customer Profile, Address Book & Password Recovery](#49-customer-profile-address-book--password-recovery)
   - [4.10 Doorstep "Try @ Home" & Ranchi Store Locator](#410-doorstep-try--home--ranchi-store-locator)
   - [4.11 Virtual Try-On Studio](#411-virtual-try-on-studio)
5. [Role-Based Access Control (RBAC) Architecture](#-role-based-access-control-rbac-architecture)
6. [Complete REST API Reference](#-complete-rest-api-reference)
7. [Database Schema & Data Models](#-database-schema--data-models)
8. [Administrative & Management Commands](#-administrative--management-commands)
9. [Automated Testing & QA Verification Suite](#-automated-testing--qa-verification-suite)
10. [Local Development & Setup Guide](#-local-development--setup-guide)
11. [Repository Directory Structure](#-repository-directory-structure)
12. [Owner Configuration Checklist (Pre-Production)](#-owner-configuration-checklist-pre-production)
13. [Production Hardening & Deployment Guide](#-production-hardening--deployment-guide)
14. [Project Documentation Links](#-project-documentation-links)
15. [Developer & Maintainer Credits](#-developer--maintainer-credits)

---

## 🏢 Executive Summary & Retail Store Information

**MAXVISION** is an enterprise-grade full-stack eCommerce and clinical optical retail platform developed for an active optical retail business located in **Ranchi, Jharkhand**. Inspired by industry benchmarks like **Lenskart** and **Flipkart**, the platform delivers an omnichannel digital retail solution for corrective spectacles, fashion sunglasses, blue-light computer glasses, specialized contact lenses, and custom ophthalmic lens fittings.

### 📍 Flagship Physical Showroom Information
* **Business Name:** MAXVISION Optical
* **Address:** Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand – 834001
* **Direct Telephone:** `+91 7485067874` | `+91 7033353140`
* **Operating Hours:** `10:00 AM – 8:30 PM (Mon–Sun)` `[OWNER CONFIRMATION REQUIRED]`
* **Local In-Store Services:**
  - Free in-store computer eye checkup `[OWNER CONFIRMATION REQUIRED]`
  - Rapid single-vision lens fitting within 30 minutes `[OWNER CONFIRMATION REQUIRED]`
  - Frame alignment, nose pad replacement, and ultrasonics cleaning `[OWNER CONFIRMATION REQUIRED]`
* **Doorstep Services:** Doorstep home eye testing and frame trials across Ranchi municipal limits `[OWNER CONFIRMATION REQUIRED]`
* **Lead Engineer:** Zishan (B.Tech Computer Science & Engineering, Lovely Professional University)

> [!NOTE]
> Marketing claims regarding total customer count or upcoming physical branches require explicit store owner validation before public dissemination. All such items are flagged with `[OWNER CONFIRMATION REQUIRED]`.

---

## 🏗️ Complete System Architecture & Tech Stack

The application employs a decoupled architecture: a modern React 18 single-page application (SPA) bundled via Vite 5 communicates asynchronously with a hardened Django 4.2 LTS REST Framework backend:

```
+───────────────────────────────────────────────────────────────────────────────────+
|                          CLIENT LAYER (Mobile & Desktop)                          |
|  - React 18.3.1 SPA with Vite 5.4 bundler and Tailwind CSS 3.4.19                |
|  - Redux Toolkit 2.11.2 (Auth & Cart state) + Axios 1.16.0 (JWT Interceptors)     |
|  - React Router DOM 6.30.3 with Protected Routes                                  |
|  - Responsive Viewports: Mobile (360/375/414px), Tablet (768px), PC (1280/1536px) |
+─────────────────────────────────────────┬─────────────────────────────────────────+
                                          │
                                          │ HTTP / HTTPS (JSON Payloads & JWT)
                                          ▼
+───────────────────────────────────────────────────────────────────────────────────+
|                         APPLICATION LAYER (Django 4.2 LTS)                        |
|  - Django REST Framework (DRF 3.16.1) API Routers & ViewSets                      |
|  - SimpleJWT 5.5.1 Authentication (24hr Access, 7-day Refresh)                    |
|  - Role-Based Access Control (RBAC): Developer (Superuser), Shop Owner, Customer   |
|  - Protected Media Streaming Guard (`protected_media_serve` with HTTP 403 blocks)  |
|  - Atomic Database Transactions with Conditional F() Stock Deduction              |
|  - Dynamic ReportLab 4.5.0 PDF Tax Invoice Generator                              |
|  - Throttling & Rate Limiting (`AnonRateThrottle`, `UserRateThrottle`)            |
+──────────────────────────┬───────────────────────────────┬────────────────────────+
                           │                               │
                           ▼                               ▼
+──────────────────────────────────────+       +────────────────────────────────────+
|            DATA STORAGE              |       |           MEDIA STORAGE            |
|  - SQLite (Local Dev & Testing)      |       |  - Public: /media/products/        |
|  - PostgreSQL (Production Target)    |       |  - Public: /media/payment_qr/      |
|  - Additive Migrations Only (0001-09)|       |  - Protected: /media/prescriptions/|
|  - Real Database-Calculated Totals   |       |  - Protected: /media/invoices/     |
+──────────────────────────────────────+       +────────────────────────────────────+
```

### Verified Technology Versions
* **Frontend:**
  - `react`: `18.3.1`
  - `react-dom`: `18.3.1`
  - `react-router-dom`: `6.30.3`
  - `@reduxjs/toolkit`: `2.11.2`
  - `react-redux`: `9.2.0`
  - `axios`: `1.16.0`
  - `framer-motion`: `12.38.0`
  - `tailwindcss`: `3.4.19`
  - `vite`: `5.4.10` / `5.4.21`
* **Backend:**
  - `django`: `4.2 LTS`
  - `djangorestframework`: `3.16.1`
  - `djangorestframework_simplejwt`: `5.5.1`
  - `django-filter`: `25.1`
  - `reportlab`: `4.5.0` (runtime) / `4.4.10` (`requirements.txt`)
  - `whitenoise`: `6.11.0`
  - `gunicorn`: `25.1.0`
  - `pillow`: `12.1.1`

---

## 📊 Verified Feature Implementation Status Matrix

Every feature has been audited against actual source code and automated tests. Features are categorized into four distinct confidence states:

| Feature / Module | Scope | Status | Verification Detail |
| :--- | :--- | :---: | :--- |
| **JWT Authentication** | Register, Login, Refresh, Profile | **VERIFIED** | SimpleJWT with auto request headers via Axios interceptor. Registration is guarded against privilege escalation. |
| **Product Catalog & Filters** | Category, Frame Shape, Size, Brand, Price | **VERIFIED** | Dynamic database-driven filters; category-aware view for Eyeglasses, Sunglasses, Computer Glasses. |
| **Contact Lenses Engine** | Lens Type, Wear Duration, Pack Size | **VERIFIED** | Additive fields on `Product`; filters for spherical, toric, multifocal, colored, daily, monthly, yearly. |
| **Smart Search & Sorting** | Debounced search & Multi-sort | **VERIFIED** | Real-time navbar search; sorting by Price, Newest, Discount, and Recommended. |
| **Lens Packages & Pricing** | Frame Only (₹0), Zero Power (₹300), Single Vision (₹500), Bifocal (₹1500) | **VERIFIED** | Pricing calculated strictly on the server in `CartViewSet`; client tampering ignored. |
| **Shopping Cart Engine** | Subtotal, Quantity limits, Out-of-stock | **VERIFIED** | Quantity capped at available `stock_quantity`; 44px mobile touch targets; zero layout shift. |
| **Wishlist Management** | Database-backed user wishlist toggle | **VERIFIED** | Isolated per authenticated user in `Wishlist` model. |
| **Atomic Stock Engine** | Conditional deduction, rollback, cancellation | **VERIFIED** | `Product.objects.filter(..., stock_quantity__gte=qty).update(...)`; atomic rollback; `stock_restored` single-restore. |
| **Prescription Privacy** | Upload (PDF/JPG/PNG) & Manual OD/OS | **VERIFIED** | Protected media view (`protected_media_serve`) blocks direct unauthenticated URL access with HTTP 403. |
| **Visual Order Tracking** | 5-Stage Flipkart/Amazon style tracker | **VERIFIED** | Displays `Pending` ➡️ `Accepted` ➡️ `Processing Lenses` ➡️ `Shipped` ➡️ `Delivered` with timestamp history. |
| **Automated Tax Invoicing** | GST-compliant ReportLab PDF invoice | **VERIFIED** | Itemized invoice generated on-the-fly with Ranchi shop address, downloadable by customer and staff. |
| **Customer Address Book** | Multi-address CRUD with default selector | **VERIFIED** | Object-level user isolation; default address toggle updates siblings atomically. |
| **Store Locator & Directions** | Ranchi Sheetal Tower Showroom | **VERIFIED** | Google Maps link and dual store call buttons (`7485067874` / `7033353140`). |
| **Role-Based Access Control** | 3-Tier Access (Developer, Shop Owner, Customer) | **VERIFIED** | Developer (Superuser), Single Shop Owner (18 permissions, locks), Customer (isolated). |
| **Automated Test Suite** | 42 unit & concurrency tests | **VERIFIED** | 42/42 tests passing in 15.817s across the entire project. |
| **Manual UPI QR Payment** | Singleton `StorePaymentSettings` & UTR | **PENDING OWNER CONFIG** | Code and UI complete; requires shop owner to upload official QR code and verify UPI ID in Django Admin. |
| **WhatsApp Order Confirm** | Click-to-chat `wa.me` order summary link | **PENDING OWNER CONFIG** | URL generator tested; requires shop owner to confirm primary active WhatsApp number (`917485067874`). |
| **Doorstep "Try @ Home"** | Home visit booking in Ranchi | **PENDING OWNER CONFIG** | Database model and booking form verified; requires store owner operational staff to service visits. |
| **Virtual Try-On Studio** | 2D webcam overlay with Owner Studio controls | **PARTIALLY IMPLEMENTED** | 2D canvas overlay works; does not currently include 3D facial landmark mesh detection (MediaPipe). |
| **Customer Self-Service Cancel** | Order cancellation with stock restore | **PARTIALLY IMPLEMENTED** | Backend `Order.save()` single-restore cancellation verified; triggered via Django Admin / backend. |
| **Cloud Object Storage** | Private media storage (Cloudinary/S3) | **PENDING PROD SETUP** | Development uses local protected filesystem streaming; production requires private bucket with signed URLs. |
| **Automated SMS/Email Alerts** | Transactional notifications | **PENDING PROD SETUP** | Currently uses instant WhatsApp confirmation; SMS/Email gateway not connected. |

---

## 🔍 In-Depth Feature Analysis

### 4.1 Product Catalog & Contact Lens Engine
* **Four Product Categories:**
  1. `eyeglasses`: Prescription corrective frames.
  2. `sunglasses`: Polarized and UV-tinted fashion sunglasses.
  3. `computer_glasses`: Anti-glare blue-light filtering frames.
  4. `contact_lenses`: Clinical contact lenses with medical parameters.
* **Category-Aware Filtering:**
  - Spectacles & Sunglasses: Frame Shape (`rectangle`, `round`, `wayfarer`, `aviator`, `cat_eye`, `geometric`), Frame Size (`narrow`, `medium`, `wide`, `extra_wide`), Brand, and Price slider.
  - Contact Lenses: Lens Type (`spherical`, `toric`, `multifocal`, `colored`), Wear Duration (`daily`, `monthly`, `yearly`), and Pack Size.
* **Instant Debounced Search:** Navbar search bar provides keyword suggestions with debounce handling to avoid redundant API queries.

### 4.2 Prescription System & Clinical Privacy
* **Dual Prescription Input:**
  1. **Digital Document Upload:** Upload doctor prescription slips in PDF, JPG, or PNG format at checkout.
  2. **Manual Power Entry:** Structured clinical inputs for OD (Right Eye) and OS (Left Eye):
     - Sphere (`SPH`), Cylinder (`CYL`), Axis (`AXIS`), Addition (`ADD`).
     - Pupillary Distance (`PD`) in millimeters.
* **Medical Privacy Security Architecture:**
  - Prescriptions are saved in `/media/prescriptions/` but protected against direct URL harvesting.
  - `store/media_views.py:protected_media_serve` intercepts direct requests, returning **HTTP 403 Forbidden**.
  - Authenticated downloads are permitted strictly through `/api/orders/<id>/prescription/` for the order owner or staff.

### 4.3 Lens Package Engine
* **Verified Pricing Tiers:**
  - **Frame Only (+₹0):** Shipped with acrylic demonstration lenses.
  - **Zero Power Blu Cut (+₹300):** Blue-light filter lenses for computer work.
  - **Single Vision Anti-Glare (+₹500):** Distance or reading corrective power.
  - **Bifocal / Progressive (+₹1,500):** Dual-vision or progressive transition lenses.
* **Server-Side Enforcement:** Lens prices are validated strictly in `store/api_views.py:CartViewSet` and `CheckoutAPI`. Any client-side price manipulation is completely disregarded.

### 4.4 Atomic Conditional Stock Engine
* **Race-Condition Immune:** Eliminates overselling via conditional database update queries:
  ```python
  Product.objects.filter(pk=item.product_id, stock_quantity__gte=qty).update(
      stock_quantity=F('stock_quantity') - qty
  )
  ```
* **Atomic Rollback:** If any item in a multi-item cart exceeds available inventory, the entire order transaction rolls back atomically with an **HTTP 400 Bad Request**.
* **Single-Restore Cancellation:** Setting an order to `Cancelled` in Django Admin restores inventory to the catalog **strictly once**, tracked by the `stock_restored` boolean field.

### 4.5 Dual Payment Architecture (COD + Dynamic UPI QR)
* **1. Cash on Delivery (COD):**
  - Instant order placement with stock deduction and `payment_status = 'UNPAID'`.
* **2. Manual UPI QR Payment:**
  - Managed via the singleton model `StorePaymentSettings`.
  - Displays the store UPI QR code uploaded by the shop owner in Django Admin.
  - Mobile deep linking via `upi://pay?pa=...&pn=MAXVISION%20Optical&am=...`.
  - Copy UPI ID button with immediate visual feedback.
  - Customer enters a mandatory 12-digit UTR/Transaction number.
  - Order is marked `payment_status = 'PENDING_VERIFICATION'` until verified by the shop owner in Django Admin.

### 4.6 Instant WhatsApp Order Confirmation
* Generates a pre-filled click-to-chat WhatsApp link (`wa.me/917485067874`):
  - Automatically compiles Order ID, customer name, items, lens package, delivery address, order total, and payment method into a message (<1,500 characters).
  - **Privacy Safe:** Excludes raw prescription medical values and files from the public WhatsApp message text.
  - Prominent "Confirm Order on WhatsApp" button on the Order Success and Order Tracking screens.

### 4.7 Visual Order Tracking & History
* 5-Stage visual tracking progression:
  `Pending` ➡️ `Accepted` ➡️ `Processing Lenses` ➡️ `Shipped` ➡️ `Delivered`
* Status changes logged chronologically with timestamps and notes in `OrderStatusHistory`.

### 4.8 Dynamic ReportLab PDF Tax Invoicing
* Dynamically generates a printable GST-compliant PDF invoice via `ReportLab 4.5`:
  - Contains full store details (MAXVISION Optical, Sheetal Tower, Main Road, Ranchi – 834001, Ph: 7485067874).
  - Itemized table with frame name, lens package, unit price, quantity, delivery fee, and net total.
  - Downloadable directly from the customer Orders dashboard or Django Admin.

### 4.9 Customer Profile, Address Book & Password Recovery
* **User Profile (`/profile`):** Customer dashboard showing contact info, recent orders, and saved addresses.
* **Address Book:** Multi-address support with default shipping address selection.
* **Password Recovery:** Secure token-based password reset workflow (`/api/auth/password-reset-request/` & `/api/auth/password-reset-confirm/`).

### 4.10 Doorstep "Try @ Home" & Ranchi Store Locator
* **Doorstep Home Visit Booking (`/try-at-home`):** Ranchi residents can schedule a free home visit for eye testing and frame trials. Requests are tracked in Django Admin (`HomeVisitRequest`).
* **Store Locator (`/stores`):** Interactive Ranchi showroom guide with direct Google Maps directions and dual one-click call buttons (`7485067874` / `7033353140`).

### 4.11 Virtual Try-On Studio
* 2D webcam and photo overlay try-on module allowing shoppers to visualize frame fit and shape on their face.
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

Every endpoint listed below corresponds directly to routes in `store/urls.py` and `store/api_views.py`:

### 🔐 Authentication & Accounts
| Method | Exact URL | Auth Requirement | Allowed Role | Purpose & Response |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/auth/register/` | Public | Anyone | Register customer. Rejects privileged field injections (`is_staff`, `role`, etc.) with HTTP 400. |
| `POST` | `/api/auth/login/` | Public | Anyone | Obtain SimpleJWT access (24h) and refresh (7d) token pair. |
| `POST` | `/api/auth/refresh/` | Public | Anyone | Refresh an expired access token using refresh token. |
| `GET` | `/api/auth/profile/` | Bearer Token | Authenticated User | Retrieve profile, mobile number, age, gender, and default address. |
| `PATCH` | `/api/auth/profile/` | Bearer Token | Authenticated User | Update user profile details. |
| `POST` | `/api/auth/password-reset-request/` | Public | Anyone | Initiate password reset request; generates secure one-time token. |
| `POST` | `/api/auth/password-reset-confirm/` | Public | Anyone | Complete password reset using token and new password. |

### 🕶️ Product Catalog
| Method | Exact URL | Auth Requirement | Allowed Role | Purpose & Response |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/products/` | Public | Anyone | Filterable product list (`category`, `frame_shape`, `frame_size`, `brand`, `lens_type`, `wear_duration`, `ordering`). |
| `GET` | `/api/products/<id>/` | Public | Anyone | Technical specifications of a single product or contact lens pack. |

### 🛒 Shopping Cart & Wishlist
| Method | Exact URL | Auth Requirement | Allowed Role | Purpose & Response |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/cart/` | Bearer Token | Authenticated User | Retrieve current user's active cart items with subtotals. |
| `POST` | `/api/cart/` | Bearer Token | Authenticated User | Add item to cart with lens package choice. Stock ceiling enforced. |
| `PATCH` | `/api/cart/update/<pk>/<action>/`| Bearer Token | Authenticated User | Increment (`inc`) or decrement (`dec`) item quantity. |
| `DELETE` | `/api/cart/<pk>/` | Bearer Token | Authenticated User | Remove item from cart. |
| `GET` | `/api/wishlist/` | Bearer Token | Authenticated User | Retrieve current user's saved wishlist frames. |
| `POST` | `/api/wishlist/toggle/<product_id>/`| Bearer Token | Authenticated User | Toggle product in/out of customer wishlist. |

### 📦 Checkout & Order Management
| Method | Exact URL | Auth Requirement | Allowed Role | Purpose & Response |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/checkout/` | Bearer Token | Authenticated User | Atomic checkout with prescription upload, address, and payment method (COD / UPI). |
| `GET` | `/api/orders/` | Bearer Token | Authenticated User | List current user's order history with tracking timelines. |
| `GET` | `/api/orders/<pk>/invoice/` | Bearer Token | Order Owner / Staff | Download dynamic ReportLab GST tax invoice PDF. |
| `GET` | `/api/orders/<pk>/prescription/` | Bearer Token | Order Owner / Staff | Download customer's uploaded prescription file. |

### 🏠 Customer Address Book
| Method | Exact URL | Auth Requirement | Allowed Role | Purpose & Response |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/addresses/` | Bearer Token | Authenticated User | List user's saved delivery addresses. |
| `POST` | `/api/addresses/` | Bearer Token | Authenticated User | Add a new delivery address (supports `is_default`). |
| `PUT/PATCH`| `/api/addresses/<id>/` | Bearer Token | Authenticated User | Update an existing address. |
| `DELETE` | `/api/addresses/<id>/` | Bearer Token | Authenticated User | Delete an address. |

### 🛠️ Store Administration & System Health
| Method | Exact URL | Auth Requirement | Allowed Role | Purpose & Response |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/payment-settings/` | Public | Anyone | Retrieve store UPI ID, QR code image URL, and payment active flags. |
| `POST` | `/api/home-visit/` | Public | Anyone | Submit doorstep "Try @ Home" eye test request for Ranchi. |
| `GET` | `/api/admin/dashboard-stats/` | Bearer Token | Staff Only | Return store revenue, pending orders, and inventory alert metrics. |
| `GET` | `/api/health/` | Public | Anyone | System uptime, database connectivity, and health check status. |

---

## 🗄️ Database Schema & Data Models

All models are defined in `store/models.py`:

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

### 2. Create or Rotate Designated Shop Owner (`create_shop_owner`)
Enforces **exactly one active designated shop owner account**. Rejects second owner creation unless explicit `--rotate` flag is provided:
```bash
# Interactive password input (Recommended):
python3 manage.py create_shop_owner --username shopowner --email owner@maxvision.com

# Non-interactive CLI flag:
python3 manage.py create_shop_owner --username shopowner --password "SecurePass123"

# Rotate existing owner account:
python3 manage.py create_shop_owner --username newowner --password "NewPass123" --rotate
```

### 3. Seed Demo Catalog (`populate_products`)
Seeds high-resolution optical frames and contact lenses into the local database for development:
```bash
python3 populate_products.py
```

> [!CAUTION]
> **NEVER RUN `populate_products.py` IN PRODUCTION!**  
> Running this script on a live production database will modify existing catalog records and overwrite custom pricing and inventory data set by the shopkeeper.

---

## 🧪 Automated Testing & QA Verification Suite

The repository contains a comprehensive automated test suite covering all core business logic, stock deductions, RBAC security, and media privacy:

| Test Module | Test Coverage | Count | Status |
| :--- | :--- | :---: | :---: |
| `store.tests_stock_phase1` | Conditional F() stock deduction, transaction rollback, single-restore cancellation | 6 | ✅ Pass |
| `store.tests_stage7` | Visual order tracking and status history logging | 7 | ✅ Pass |
| `store.tests_stage8a` | Dynamic UPI QR payment settings, UTR validation, WhatsApp links | 5 | ✅ Pass |
| `store.tests_stage8b` | ReportLab PDF invoice generation, address book CRUD, profile updates | 6 | ✅ Pass |
| `store.tests_stage9` | Production settings, throttling scopes, environment variables | 4 | ✅ Pass |
| `store.tests_concurrency` | High-concurrency rapid checkout inventory protection | 1 | ✅ Pass |
| `store.tests_stage11_rbac` | RBAC roles, Django admin hardening, prescription privacy (HTTP 403) | 13 | ✅ Pass |
| **Total Project Test Suite** | **Full End-to-End Automated Test Verification** | **42** | **✅ 42/42 Pass (15.8s)** |

### Running the Test Suite:
```bash
# Run the entire test suite (42 tests):
python3 manage.py test --noinput

# Run RBAC security tests specifically:
python3 manage.py test store.tests_stage11_rbac --noinput

# Run Django system health check:
python3 manage.py check
```

---

## 💻 Local Development & Setup Guide

### Method A: Quick Launcher (Recommended)
Use the included automated launcher from the project root directory:
```bash
./run_local.sh
```
Follow the interactive prompt to boot both the Django API (port 8000) and the React Vite SPA (port 5173).

---

### Method B: Manual Step-by-Step Setup

#### 1. Backend Setup (Django)
```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
python3 manage.py migrate

# 4. Configure RBAC roles and shop owner
python3 manage.py setup_roles
python3 manage.py create_shop_owner --username shopowner --password "OwnerPass123"

# 5. Start Django development server
python3 manage.py runserver 0.0.0.0:8000
```
* Django API: `http://localhost:8000/api/`
* Django Admin: `http://localhost:8000/admin/`

#### 2. Frontend Setup (React + Vite)
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
├── populate_products.py               # Optical catalog data seeder (DEV ONLY)
├── run_local.sh                       # Interactive local launch script
├── README.md                          # Primary comprehensive documentation
├── plan.md                            # Multi-stage execution master plan
├── .env.example                       # Template for environment secrets
│
├── ecommerce2/                        # Django project configuration root
│   ├── settings.py                    # Hardened settings (SimpleJWT, WhiteNoise, Security)
│   ├── urls.py                        # Root URL router & protected media router
│   └── wsgi.py                        # WSGI production entrypoint
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
│   ├── tests_stock_phase1.py          # Stock deduction tests
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
│           ├── VirtualTryOn.jsx       # 2D webcam virtual eyewear fitting
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

## 📋 Owner Configuration Checklist (Pre-Production)

Before opening the platform for live customer orders, the store owner must complete and verify the following operational configuration:

- [ ] **Official Store UPI ID:** Configure active business UPI ID (e.g., `maxvision@okhdfcbank`) in Django Admin (`StorePaymentSettings`).
- [ ] **Official Store UPI QR Code:** Upload the official printed showroom QR code image in Django Admin.
- [ ] **Merchant Display Name:** Set registered shop name in `StorePaymentSettings`.
- [ ] **Official WhatsApp Phone Number:** Confirm primary active WhatsApp number (currently set to `917485067874` in `siteConfig.js`).
- [ ] **Showroom Operating Hours:** Confirm physical store opening and closing times.
- [ ] **Delivery Charges & Municipal Radius:** Set flat home delivery fees or free delivery thresholds for Ranchi.
- [ ] **Store Pickup Logistics:** Specify pickup timing guidelines for customers collecting frames at Sheetal Tower.
- [ ] **Return & Exchange Policy:** Finalize customer return window (e.g., 7 days or 14 days) and warranty conditions.
- [ ] **GSTIN Registration:** Provide official GST number to appear on customer PDF tax invoices.
- [ ] **Doorstep Service Staffing:** Assign an optometrist/technician to process `HomeVisitRequest` bookings.

---

## 🌐 Production Hardening & Deployment Guide

### Recommended Cloud Stack
* **Frontend SPA:** Vercel or Netlify (Fast global CDN edge routing with SPA rewrite rules).
* **Backend API:** Render, Railway, or AWS EC2 (Python 3.9+ environment with Gunicorn).
* **Database:** Managed PostgreSQL (Supabase, Neon, or AWS RDS).
* **Media & Prescriptions:** Cloudinary or AWS S3 private buckets with signed, time-limited private download URLs.

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
* **Client / Store:** MAXVISION Optical (Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand – 834001)
