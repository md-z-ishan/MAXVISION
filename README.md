# 👓 MAXVISION – Premium Eyewear eCommerce Platform

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Django](https://img.shields.io/badge/Backend-Django%204.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework-red?style=for-the-badge&logo=django&logoColor=white)](https://django-rest-framework.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20(Dev)-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![Location](https://img.shields.io/badge/Shop-Ranchi%2C%20Jharkhand-green?style=for-the-badge&logo=google-maps&logoColor=white)](https://www.google.com/maps/search/?api=1&query=Sheetal+Tower+Taxi+Stand+Main+Road+Ranchi+Jharkhand)

---

## 🧾 Project & Retail Store Overview

**MAXVISION** is a decoupled full-stack eCommerce and clinical optical retail platform engineered for an active retail business in **Ranchi, Jharkhand**. Inspired by industry benchmarks like **Lenskart** and **Flipkart**, the platform is built to provide local and regional customers with a fast digital shopping experience for spectacles, sunglasses, computer glasses, contact lenses, and prescription lens customization.

### 📍 Flagship Retail Store Information
* **Shop Name:** MAXVISION Optical
* **Address:** Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand – 834001
* **Contact Numbers:** `+91 7485067874` | `+91 7033353140`
* **Operating Hours:** 10:00 AM – 8:30 PM (Mon–Sun)
* **Lead Developer:** Zishan (B.Tech CSE, Lovely Professional University)

---

## 🏗️ System Architecture

The application runs on a decoupled architecture where the React Single Page Application (SPA) communicates with the Django REST Framework API via structured JSON payloads:

```
[ Customer Browser / Mobile Device ]
                 │
                 ▼  (HTTP / JSON on Port 5173 -> 8000)
+───────────────────────────────────────────────────────────+
|               React 18 Frontend Application               |
|  - Vite Bundler + Tailwind CSS + Framer Motion            |
|  - Redux Toolkit (Auth State) & Axios JWT Interceptor     |
|  - Pages: Home, Products, Details, Cart, Checkout,        |
|    Orders, Stores (Ranchi Locator), Virtual Try-On        |
+─────────────────────────────┬─────────────────────────────+
                              │
                              ▼  (REST API /api/...)
+───────────────────────────────────────────────────────────+
|                 Django 4.2 REST Backend                   |
|  - Simple JWT Token Authentication (Bearer tokens)        |
|  - Product ViewSet with dynamic filtering (Category/Shape)|
|  - Cart & Wishlist Stateful Management                    |
|  - Multipart Form Parser (Prescription file uploads)      |
|  - Order Fulfillment Pipeline                             |
|  - Django Admin Backoffice Portal (/admin/)               |
+─────────────────────────────┬─────────────────────────────+
                              │
                              ▼
+───────────────────────────────────────────────────────────+
|                   Database & Storage                      |
|  - SQLite (Local Development) / PostgreSQL (Production)   |
|  - Local Media: /media/products/ & /media/prescriptions/  |
+───────────────────────────────────────────────────────────+
```

---

## 🚀 Feature Status Matrix: Working vs. Incomplete vs. Planned

| Feature | Description | Status | Details |
| :--- | :--- | :---: | :--- |
| **JWT Authentication** | Register, Login, Refresh, Profile API | 🟢 Active | Secure sessionless tokens saved in `localStorage`. |
| **Product Catalog** | Filter by Category, Shape, Brand, Price, Sort | 🟢 Active | Category-aware (Eyeglasses, Sunglasses, Contact Lenses) with DB-driven filters. |
| **Product Details** | Dimensions, materials, live stock status | 🟢 Active | Full eyewear specifications & lens package selector + direct WhatsApp inquiry. |
| **Lens Packages** | Single Vision (+₹500), Bifocal (+₹1500), Zero Power (+₹300) | 🟢 Active | Dynamic pricing calculated strictly on server and added to cart. |
| **Shopping Cart** | Cart synchronization, quantity controls | 🟢 Active | Max stock ceiling, 44px touch targets, zero layout shift, instant updates. |
| **Wishlist** | Toggle frame wishlist | 🟢 Active | Database-backed user wishlist toggle. |
| **Prescription Privacy** | Upload (PDF/JPG/PNG) & Manual OD/OS | 🟢 Active | Protected from public media URLs; authenticated download via `/api/orders/<id>/prescription/`. |
| **Order Tracking** | Flipkart/Amazon-style visual tracker | 🟢 Active | Tracks `Pending` ➡️ `Accepted` ➡️ `Processing` ➡️ `Shipped` ➡️ `Delivered`. |
| **Store Locator** | Ranchi Sheetal Tower Flagship Store | 🟢 Active | Direct Google Maps navigation link & dual store call buttons (7485067874 / 7033353140). |
| **Admin Panel & RBAC** | 3-Tier Access (Developer, Shop Owner, Customer) | 🟢 Active | Strict Django Admin business management for single Shop Owner; User/Group protected for Developer. |
| **Virtual Try-On** | 3D / 2D frame placement preview | 🟢 Active | Owner Studio upload controls protected by staff permissions. |
| **Dual Payment Options** | Cash on Delivery + Manual UPI QR (UTR verification) | 🟢 Active | Admin-managed `StorePaymentSettings` with QR display, Copy UPI, and mobile `upi://pay` deep link. |
| **Stock Auto-Deduction** | Atomic conditional stock deduction | 🟢 Active | `F('stock_quantity') - qty` conditional update; atomic rollback on failure; single restore on cancel. |
| **Real PDF Invoices** | Downloadable GST tax invoice | 🟢 Active | Generated dynamically via ReportLab with store address, items, and tax breakdown. |
| **WhatsApp Order Confirm** | Customer WhatsApp order confirmation link | 🟢 Active | Prefilled URL (<1500 chars) opening WhatsApp with order summary; sensitive Rx values excluded. |
| **Doorstep Try @ Home** | Doorstep eye test booking in Ranchi | 🟢 Active | `HomeVisitRequest` model with full admin tracking. |
| **Address Book & Profile** | Saved addresses & user details | 🟢 Active | `/profile` page with default delivery address selector and object-level isolation. |

---

## 🛠️ Tech Stack Details

### Frontend
* **Core:** React.js (v18.3.1), Vite 5
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **State Management:** Redux Toolkit + React-Redux
* **Routing:** React Router DOM (v6)
* **HTTP Client:** Axios (configured with automatic request interceptors for JWT)
* **Animation & Icons:** Framer Motion, React Icons

### Backend
* **Core:** Python 3.9 / 3.11, Django 4.2 LTS
* **API Framework:** Django REST Framework (DRF 3.16)
* **Auth:** `djangorestframework-simplejwt` (24hr access token, 7-day refresh)
* **CORS:** `django-cors-headers`
* **Static Management:** WhiteNoise
* **Database Driver:** `dj-database-url`, `sqlite3` (dev), `psycopg2-binary` (prod)

---

## ⚙️ Local Development Setup

Everything can be run locally using the provided `run_local.sh` script or manually in two terminal tabs:

### Option A: Using the Quick Runner Script
```bash
# In the root maxvision directory
./run_local.sh
```
Follow the interactive prompt to start both servers, run migrations, or seed data.

---

### Option B: Manual Setup

#### 1. Backend Server Setup
```bash
cd Django-eCommerce-Web-Application-main

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r req_unpinned.txt dj-database-url psycopg2-binary django-cors-headers

# Apply database migrations
python manage.py migrate

# (Optional) Populate catalog with 26 optical frames
python populate_products.py

# Create shopkeeper admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver 127.0.0.1:8000
```
* Django API: `http://127.0.0.1:8000/api/`
* Django Admin: `http://127.0.0.1:8000/admin/`

#### 2. Frontend Setup
```bash
# Open a new terminal tab
cd Django-eCommerce-Web-Application-main/frontend

# Install node dependencies
npm install

# Start Vite local development server
npm run dev
```
* React Frontend: `http://localhost:5173/`

---

## 🔗 REST API Reference

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register/` | No | Register new user account |
| `POST` | `/api/auth/login/` | No | Obtain JWT access and refresh token pair |
| `POST` | `/api/auth/refresh/` | No | Refresh expired access token |
| `GET` | `/api/auth/profile/` | Yes | Get authenticated user profile details |
| `GET` | `/api/products/` | No | List products with query filtering (`?category=...&shape=...&brand=...`) |
| `GET` | `/api/products/<id>/` | No | Get single frame specifications |
| `GET` | `/api/cart/` | Yes | Get active user cart and total subtotal |
| `POST` | `/api/cart/` | Yes | Add frame + lens package to cart |
| `PATCH` | `/api/cart/update/<id>/<action>/` | Yes | Increment or decrement item quantity |
| `DELETE` | `/api/cart/<id>/` | Yes | Remove item from cart |
| `GET` | `/api/wishlist/` | Yes | Retrieve user's saved wishlist |
| `POST` | `/api/wishlist/toggle/<id>/` | Yes | Add or remove frame from wishlist |
| `POST` | `/api/checkout/` | Yes | Create order with shipping info & prescription file |
| `GET` | `/api/orders/` | Yes | List user's order history and tracking status |

---

## 📁 Repository Structure

```
maxvision/
├── plan.md                          # Master execution plan & Claude.ai prompt pack
├── run_local.sh                     # Interactive local development launcher script
├── README.md                        # Primary project documentation
└── Django-eCommerce-Web-Application-main/
    ├── manage.py                    # Django management script
    ├── db.sqlite3                   # Local SQLite database (26 products, test users)
    ├── populate_products.py         # Catalog seeder with high-res optical assets
    ├── requirements.txt             # Production python dependencies
    ├── req_unpinned.txt             # Flexible dependency requirements
    ├── ecommerce2/                  # Django project root (settings, urls, wsgi)
    ├── store/                       # Core optical retail application
    │   ├── models.py                # Product, Prescription, Cart, Order, Invoice
    │   ├── serializers.py           # DRF model serializers
    │   ├── api_views.py             # DRF ViewSets & API endpoints
    │   ├── urls.py                  # Routing configuration
    │   └── utils.py                 # Invoice helpers
    ├── media/                       # Uploaded prescriptions & product pictures
    └── frontend/                    # React 18 + Vite SPA
        ├── package.json             # NPM package manifest
        ├── vite.config.js           # Vite configuration
        └── src/
            ├── api/axios.js         # Axios interceptor for JWT auth
            ├── components/          # Navbar, Footer
            ├── redux/               # Redux auth slice
            └── pages/               # Home, Products, Cart, Checkout, Orders, Stores, Try-On
```

---

## 📋 Production Handover & Deployment Checklist

Before handing the platform over to the shop owner at Sheetal Tower, Ranchi:

1. **Local Hardening & Testing:**
   - [x] Verify user registration and login flow.
   - [x] Verify product filters and lens pricing calculation.
   - [ ] Implement atomic inventory deduction upon checkout.
   - [ ] Enable Cash on Delivery (COD) and UPI payment options.
   - [ ] Add ReportLab PDF generation for printable GST shop invoices.
2. **Cloud Infrastructure Deployment:**
   - **Backend:** Deploy on Render / Railway with Gunicorn.
   - **Frontend:** Deploy on Vercel with automatic rewrites.
   - **Database:** Supabase / Neon PostgreSQL (free, reliable cloud tier).
   - **Media Assets:** Connect Cloudinary for durable prescription storage.
3. **Shopkeeper Handover Training:**
   - Provide shopkeeper admin credentials.
   - Show how to add new frames and update prices on smartphone/laptop.
   - Show how to download customer eye prescriptions and change order status to "Shipped" / "Delivered".

---

## 👨‍💻 Developer & Maintainer

* **Developer:** Zishan
* **Role:** Full-Stack Freelance Developer
* **Education:** B.Tech Computer Science Engineering (Lovely Professional University)
* **GitHub:** [github.com/md-z-ishan](https://github.com/md-z-ishan)
