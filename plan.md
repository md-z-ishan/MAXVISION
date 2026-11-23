# 🚀 MAXVISION Optical (Ranchi)
## Complete Project Audit, Master Plan & Production Handover Guide

> **Project Role:** Lead Full-Stack Freelance Developer (Zishan, B.Tech CSE)  
> **Client / Shop:** MAXVISION Optical  
> **Shop Address:** Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand 834001  
> **Contact Numbers:** +91 7485067874 | +91 7033353140  
> **Target Standard:** Real-world Optical & E-Commerce platform comparable to **Lenskart** & **Flipkart**  
> **Execution Strategy:** 100% Local Development & Testing first, followed by Cloud Deployment & Handover to Shopkeeper  

---

## 📌 Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Current Codebase Audit: Working vs. Broken vs. Missing](#2-current-codebase-audit-working-vs-broken-vs-missing)
3. [Deep-Dive File & Module Analysis](#3-deep-dive-file--module-analysis)
4. [Step-by-Step Local Development Roadmap (Phases 1-5)](#4-step-by-step-local-development-roadmap-phases-1-5)
5. [Local Setup & Testing Instructions](#5-local-setup--testing-instructions)
6. [Essential Production Features for Lenskart/Flipkart Standard](#6-essential-production-features-for-lenskartflipkart-standard)
7. [Shopkeeper Handover Strategy](#7-shopkeeper-handover-strategy)
8. [Claude.ai Modular Prompt Pack (Feed to Claude Phase-by-Phase)](#8-claudeai-modular-prompt-pack)

---

## 1. Project Overview & Architecture

This repository contains a modern **decoupled full-stack web application**:
* **Frontend:** Single Page Application (SPA) powered by **React 18**, **Vite**, **Tailwind CSS**, and **Framer Motion**.
* **Backend:** REST API powered by **Django 4.2** and **Django REST Framework (DRF)** with **Simple JWT** authentication.
* **Database:** SQLite (`db.sqlite3`) for zero-friction local development; easily swappable to **PostgreSQL** via `dj-database-url` for production.
* **Media / Storage:** Django Media handling product photography and uploaded customer prescription files (PDF/JPG/PNG).

### System Topology
```
[ Customer / Mobile / PC Browser ]
              │
              ▼  (HTTP / JSON Requests on port 5173 -> 8000)
    +─────────────────────────────────────────+
    │   React 18 + Vite Frontend Application   │
    │   - Redux Toolkit (Auth State)          │
    │   - Axios with JWT Interceptor          │
    │   - Framer Motion Animations            │
    │   - Pages: Home, Products, Cart,        │
    │     Checkout, Orders, Stores, Try-On    │
    +────────────────────┬────────────────────+
                         │
                         ▼  (REST API /api/...)
    +─────────────────────────────────────────+
    │   Django 4.2 REST Framework (Port 8000) │
    │   - JWT Bearer Authentication           │
    │   - Product & Filter ViewSet            │
    │   - Cart & Wishlist APIs                │
    │   - Checkout & Order API                │
    │   - Multipart Form Parser (Prescriptions)│
    │   - Django Admin Portal (/admin/)       │
    +────────────────────┬────────────────────+
                         │
                         ▼
    +─────────────────────────────────────────+
    │          Database & Storage             │
    │   - SQLite (Local Dev) / Postgres (Prod)│
    │   - Media Root: /media/products/        │
    │   - Media Root: /media/prescriptions/   │
    +─────────────────────────────────────────+
```

---

## 2. Current Codebase Audit: Working vs. Broken vs. Missing

An honest, transparent assessment of what is currently built versus what is needed for a real Lenskart/Flipkart level shop:

| Category | Component / Feature | Current State | Status | What Needs To Be Done |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | User Registration (`/api/auth/register/`) | Working | 🟢 Active | Add phone number validation & full name support in user profile. |
| **Authentication** | User Login (`/api/auth/login/`) | Working | 🟢 Active | JWT tokens issued and stored in `localStorage`. |
| **Authentication** | Profile Fetch (`/api/auth/profile/`) | Working | 🟢 Active | Works via API; needs dedicated UI profile view in React frontend. |
| **Authentication** | Password Reset / Forgot Password | Missing | 🔴 Missing | Needs OTP via WhatsApp/SMS or Email reset link. |
| **Catalog** | Product List & Filters (`/api/products/`) | Working | 🟢 Active | Filters by `category`, `shape`, `size`, `color`, `brand`, and `q`. 26 products seeded. |
| **Catalog** | Product Detail (`/product/:id`) | Working | 🟢 Active | Frame specs, pricing, discount, and lens selection. |
| **Cart** | Cart CRUD (`/api/cart/`) | Working | 🟢 Active | Item addition, quantity increment/decrement, and subtotal calculation with lens package. |
| **Wishlist** | Wishlist Toggle (`/api/wishlist/`) | Working | 🟢 Active | Authenticated users can save and remove items dynamically. |
| **Prescription** | File Upload (Checkout) | Working | 🟢 Active | Customer can upload PDF or image prescription file during checkout. |
| **Prescription** | Manual Eye Power Entry (OD/OS/PD) | Mockup / Half-Done | 🟡 Incomplete | `Prescription` model has OD/OS fields in Django, but frontend checkout doesn't have the numeric power input form. |
| **Checkout** | Shipping Address & Phone | Working | 🟢 Active | Form captures address and mobile number. |
| **Payments** | Payment Gateway / COD | Mockup | 🟡 Incomplete | Checkout creates order with "Pending" status directly without payment choice (Razorpay / UPI / Cash on Delivery). |
| **Inventory** | Stock Auto-Deduction | Broken / Missing | 🔴 Missing | When order is placed, `product.stock_quantity` is NOT decremented. Out-of-stock items can still be ordered. |
| **Orders** | Order Tracking (`/orders`) | Working | 🟢 Active | Flipkart-style visual stage tracker (Pending ➡️ Accepted ➡️ Processing ➡️ Shipped ➡️ Delivered). |
| **Invoices** | Order PDF Invoice | Mockup | 🟡 Incomplete | `Invoice` model exists, but `render_to_pdf` in `utils.py` is mocked (`"Mock PDF Content"`). Real PDF generation is needed. |
| **Admin** | Django Admin (`/admin/`) | Working | 🟢 Active | Shop owner / Admin can inspect orders, download prescriptions, and modify status. |
| **Admin** | Custom Shopkeeper Dashboard | Half-Done | 🟡 Incomplete | Django templates exist (`store/templates/admin/dashboard.html`), but disconnected from React frontend. |
| **Store Locator** | Ranchi Store Locator (`/stores`) | Working | 🟢 Active | Shows Sheetal Tower, Main Road, Ranchi with direct Google Maps link & phone numbers. |
| **Try-On** | Virtual Try-On (`/try-on`) | Prototype | 🟡 Incomplete | Webcam 2D overlay with canvas slider controls. Needs MediaPipe face tracking for auto-alignment. |
| **Alerts** | WhatsApp / SMS Order Notification | Missing | 🔴 Missing | Shopkeeper needs immediate WhatsApp notification when a Ranchi customer places an order. |

---

## 3. Deep-Dive File & Module Analysis

### Backend: `Django-eCommerce-Web-Application-main/`
* `ecommerce2/settings.py`:
  - Configures Django REST Framework with Simple JWT.
  - WhiteNoise configured for static files.
  - SQLite default with `dj-database-url` for production PostgreSQL.
  - `CORS_ALLOW_ALL_ORIGINS = True` (ideal for local dev, needs domain locking for prod).
* `store/models.py`:
  - `Product`: Eyewear attributes (`frame_shape`, `frame_size`, `frame_color`, `brand`, `material`, `price`, `discount_percentage`, `stock_quantity`, `category`).
  - `Prescription`: Detailed optical values (`od_sph`, `od_cyl`, `od_axis`, `od_add`, `os_sph`, `os_cyl`, `os_axis`, `os_add`, `pd`).
  - `Cart`: Linked to user and product with `lens_package` and `lens_price`.
  - `Order` & `OrderItem`: Order fulfillment statuses (`Pending`, `Accepted`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), `prescription_file`.
  - `Invoice`: Serial number and PDF field.
* `store/api_views.py`:
  - DRF ViewSets for `ProductViewSet`, `CartViewSet`, `WishlistViewSet`.
  - APIViews for `RegisterUserAPI`, `UserProfileAPI`, `CheckoutAPI`, `UserOrdersAPI`.
* `populate_products.py`:
  - High quality seeder script with 26 real optical models (Ray-Ban, Oakley, Titan Eye+, Fastrack, Ranchi Asif, Vincent Chase).

### Frontend: `Django-eCommerce-Web-Application-main/frontend/src/`
* `pages/Home.jsx`: Hero banner, popular categories, top brands, and promotional eyewear banners.
* `pages/Products.jsx`: Dynamic product catalog with category, shape, and price filters.
* `pages/ProductDetails.jsx`: Frame specifications, stock indicator, lens selector (Frame Only, Single Vision, Bifocal, Zero Power), and Add-to-Cart.
* `pages/Cart.jsx`: Real-time cart calculation with quantity increments and deletions.
* `pages/Checkout.jsx`: Shipping address, mobile phone, prescription file upload, and order summary.
* `pages/Orders.jsx`: Multi-stage visual timeline tracking with delivery estimates.
* `pages/Stores.jsx`: Ranchi Sheetal Tower flagship store locator with Google Maps link and direct call buttons.
* `pages/VirtualTryOn.jsx`: Interactive camera try-on module.
* `api/axios.js`: Axios instance pointing to `http://127.0.0.1:8000/api/` with automatic Bearer token injection.

---

## 4. Step-by-Step Local Development Roadmap (Phases 1-5)

Follow these phases locally to make the platform 100% production-ready before handing it over to the shopkeeper:

```
+-------------------------------------------------------------------------+
| PHASE 1: Local Foundation & Operational Stability                       |
| - Verify virtual environments & clean install of dependencies           |
| - Create unified start script (backend + frontend)                      |
| - Verify database migrations & initial admin superuser                  |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| PHASE 2: Core E-Commerce Logic & Optical Prescription Enhancement       |
| - Add stock auto-deduction on order placement (prevent overselling)     |
| - Add Payment Method choice: Cash on Delivery (COD) & UPI / Online      |
| - Add Dual Prescription Option: (A) Upload Photo OR (B) Enter Eye Powers|
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| PHASE 3: Ranchi Shopkeeper Operations & WhatsApp Order Alerts           |
| - Create Instant WhatsApp Order Ping (Click-to-Chat & Shopkeeper Alert) |
| - Real PDF Invoice generator (with GST, shop address & phone)           |
| - Customer Profile & Address Book page                                  |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| PHASE 4: UI/UX Polish, Search & Mobile Experience                       |
| - Lenskart-style instant search bar with live dropdown                  |
| - Flipkart-style sticky mobile bottom navigation (Cart / Home / Orders) |
| - Align branding: "MAXVISION Optical"                                   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
| PHASE 5: Production Deployment & Shopkeeper Handover                    |
| - PostgreSQL database setup (Supabase / Neon free tier)                 |
| - Cloudinary setup for product & prescription images                    |
| - Deploy backend on Render / Railway & frontend on Vercel               |
| - Shopkeeper handover manual & training video checklist                 |
+-------------------------------------------------------------------------+
```

---

## 5. Local Setup & Testing Instructions

### Step 1: Backend Setup
```bash
# Navigate to the backend folder
cd /Users/mdzishan/Desktop/maxvision/Django-eCommerce-Web-Application-main

# Activate or create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install all backend requirements
pip install -r req_unpinned.txt dj-database-url psycopg2-binary django-cors-headers reportlab

# Run migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) Seed 26 optical products if database is fresh
python populate_products.py

# Create shopkeeper admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver 127.0.0.1:8000
```
Backend will be live at: `http://127.0.0.1:8000/`  
Admin panel will be live at: `http://127.0.0.1:8000/admin/`

---

### Step 2: Frontend Setup
```bash
# Open a new terminal tab and navigate to frontend
cd /Users/mdzishan/Desktop/maxvision/Django-eCommerce-Web-Application-main/frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be live at: `http://localhost:5173/`

---

## 6. Essential Production Features for Lenskart/Flipkart Standard

To make this project commercial-grade for the Ranchi shop owner:

1. **Stock Reduction on Order (`store/api_views.py`):**
   - In `CheckoutAPI`, wrap order creation in `transaction.atomic()`.
   - Check `item.product.stock_quantity >= item.quantity`.
   - Decrement `item.product.stock_quantity -= item.quantity` and save.
2. **Payment Selection (COD + UPI QR Code):**
   - Provide two options at checkout:
     * **Cash on Delivery (Pay at Ranchi Store or Delivery)**
     * **Direct UPI QR Code / GPay / PhonePe (Instant Payment)** with payment reference UTR input.
3. **Dual Prescription Mode:**
   - Option 1: File Upload (Doctor slip image/PDF).
   - Option 2: Form input for Spherical, Cylindrical, Axis, and Pupillary Distance (PD).
4. **Instant WhatsApp Order Notification:**
   - Send order summary to shop owner (+91 7485067874) via WhatsApp link or Twilio/Gupshup API.
   - Example WhatsApp message text:
     ```
     🛒 *New Order from MAXVISION Online!*
     *Order ID:* #1042
     *Customer:* Rahul Kumar (9876543210)
     *Address:* Morabadi, Ranchi
     *Total:* ₹2,499 (Cash on Delivery)
     *Items:* Ray-Ban Highstreet (Single Vision Lens)
     *Prescription Attached:* Yes
     ```
5. **Real PDF Invoice Generation (`reportlab`):**
   - Generate professional GST tax invoice with shop details:
     * **MAXVISION Optical**
     * Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand - 834001
     * Contact: 7485067874 / 7033353140

---

## 7. Shopkeeper Handover Strategy

When you hand over this project to the shopkeeper in Ranchi:

1. **Admin Control:**
   - Provide a simplified login: `/admin/` where the shopkeeper can:
     - Add new spectacles, sunglasses, and contact lenses.
     - Update product prices, discounts, and inventory.
     - View and download uploaded customer eye prescriptions.
     - Change order status with one click (`Pending` ➡️ `Accepted` ➡️ `Shipped` ➡️ `Delivered`).
2. **Shopkeeper Training Checklist:**
   - [ ] How to log in to the admin panel from mobile or laptop.
   - [ ] How to add a new frame photo and set price.
   - [ ] How to download a customer's eye prescription PDF/photo.
   - [ ] How to mark an order as "Delivered".
3. **Customer Billing / Offline Integration:**
   - Customer can order online and choose "Store Pickup at Sheetal Tower, Taxi Stand" or "Home Delivery in Ranchi".

---

## 8. Claude.ai Modular Prompt Pack

Copy-paste these exact prompts into Claude.ai phase-by-phase when developing each component:

### 💬 Prompt 1: Fixing Stock Deduction & Adding COD / UPI Payment
```markdown
I am working on a full-stack Django + React e-commerce application for an optical store in Ranchi ("MAXVISION").
Backend: Django REST Framework. Frontend: React 18 + Vite + Tailwind CSS.

Here is the current CheckoutAPI in store/api_views.py:
[PASTE CheckoutAPI from store/api_views.py]

Please update the backend CheckoutAPI and frontend Checkout.jsx to:
1. Wrap order creation inside a database transaction (transaction.atomic).
2. Validate and deduct product.stock_quantity for every ordered item. Return error if insufficient stock.
3. Add a payment_method field in Order model ('COD', 'UPI', 'ONLINE') with default 'COD'.
4. In frontend Checkout.jsx, allow user to choose between "Cash on Delivery / Pay at Shop" and "UPI / Online Payment".
5. If UPI is selected, display the shop's UPI QR code / UPI ID (7485067874@ybl) and allow entering the 12-digit UTR/Transaction ID.
```

### 💬 Prompt 2: Dual Prescription Mode (File Upload + Manual Power Entry)
```markdown
In our optical project, users should be able to provide prescriptions in two ways:
Option A: Upload prescription photo/PDF.
Option B: Enter manual optical powers (OD Right Eye & OS Left Eye: Spherical, Cylindrical, Axis, Addition, and Pupillary Distance PD).

Backend already has a Prescription model in store/models.py:
[PASTE Prescription model]

Please provide:
1. The updated CheckoutAPI serializer and view to handle either prescription_file OR manual prescription fields.
2. A clean, professional React modal/form component in Checkout.jsx for entering OD/OS values with standard dropdowns (-10.00 to +10.00 in 0.25 steps).
```

### 💬 Prompt 3: Real PDF GST Invoice Generation
```markdown
We need a real PDF invoice download feature using ReportLab in Django (replacing the mocked function in store/utils.py).
Shop Details to print on Invoice:
- MAXVISION Optical
- Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand 834001
- Phone: 7485067874 / 7033353140

Please write:
1. Complete store/utils.py using ReportLab to generate a clean, modern, professional GST-ready invoice PDF containing Order items, lens charges, total, customer address, and shop contact info.
2. An API endpoint in store/api_views.py: /api/orders/<id>/invoice/ that streams the generated PDF.
3. A "Download Invoice" button in frontend Orders.jsx.
```

### 💬 Prompt 4: Production Deployment on Render + Vercel
```markdown
I am ready to deploy the MAXVISION Django + React app to production.
Backend: Django 4.2 + DRF.
Frontend: React + Vite.
Database: Free PostgreSQL (Neon / Supabase).
Media: Cloudinary.

Please give me:
1. Exact configuration for settings.py for production (DEBUG=False, SECRET_KEY, ALLOWED_HOSTS, Cloudinary storage for images/prescriptions).
2. build.sh script and Procfile for Render.
3. vercel.json for the React frontend with proper rewrites and VITE_API_URL environment variable.
4. Step-by-step checklist to migrate database and create superuser on production.
```
