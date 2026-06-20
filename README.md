# 👓 MAXVISION – Premium Eyewear eCommerce Platform

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Django](https://img.shields.io/badge/Backend-Django%204.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework-red?style=for-the-badge&logo=django&logoColor=white)](https://django-rest-framework.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)

---

## 🧾 Project Overview

**MAXVISION** is a high-performance, production-grade, decoupled full-stack eCommerce application designed specifically for premium eyewear and clinical optical retail. Inspired by modern industry giants like **Lenskart**, MAXVISION is independently engineered from the ground up using **React** and **Django** to support frame discovery, custom lens/wishlist configurations, prescription uploads, and advanced order fulfillment pipelines.

By separating the visual customer client from the backend business logic and database layer, the platform achieves sub-150ms page transitions while maintaining strict data integrity, state safety, and clean API-first execution.

---

## 🚀 Live Features (Implemented Features)

The following components are fully completed, active, and verified in local and production settings:

* **✅ JWT Authentication (Login / Register):** Sessionless token-based security with automatic token refreshing and client-side storage using `localStorage`.
* **✅ Product Catalog API:** High-speed product endpoints with support for filtering by brand, price ranges, and frame shape category.
* **✅ Product Detail API:** In-depth frame specification mapping (dimensions, materials, lens types) and live stock status checks.
* **✅ Shopping Cart:** React-managed state synchronization computing item counts, subtotal parameters, and custom options in real time.
* **✅ Wishlist:** Real-time wishlist toggling from frame listings with instant SQLite database synchronization.
* **✅ Checkout System:** Integrated shipping address registration, contact verification, and order packaging options.
* **✅ Prescription Upload:** Multi-part form request parser allowing users to securely upload doctor prescription files (PDF/Images) during checkout.
* **✅ Order Tracking:** Visually detailed Amazon/Flipkart-style tracker showing progress stages (Pending ➡️ Accepted ➡️ Processing Lenses ➡️ Shipped ➡️ Delivered) with exact timestamps.
* **✅ Django Admin Management:** Custom administration panels enabling operators to download user-submitted prescriptions and change order fulfillment stages directly.
* **✅ REST APIs using Django REST Framework:** Modular DRF views, token permissions, custom serializers, and RESTful CRUD interfaces.
* **✅ React Frontend Integration:** Sleek Single Page Application (SPA) powered by Axios interceptors (auto-injecting JWT tokens), React Router DOM (v6), and responsive custom layouts.
* **✅ Responsive Design:** Visually optimized interface fitting seamlessly on mobile, tablet, and desktop monitors.

---

## 🏗️ System Architecture

MAXVISION operates on a completely decoupled architecture, communicating via structured JSON payloads over HTTPS:

```
                  +-----------------------------------+
                  |          React Client             |
                  |     (Vite Single Page App)        |
                  +-----------------+-----------------+
                                    |
                           HTTP Requests / JSON
                                    |
                                    v
                  +-----------------+-----------------+
                  |      Django REST Framework        |
                  |       (API Business Logic)        |
                  +-----------------+-----------------+
                                    |
                           ORM Queries & Files
                                    |
                                    v
                  +-----------------+-----------------+
                  |   SQLite (Dev) / PostgreSQL (Prod)|
                  |     + Local File Media Storage    |
                  +-----------------------------------+
```

---

## 🛠️ Tech Stack

### Frontend Layer
* **Framework:** React.js (v18)
* **Build Tool:** Vite (Optimized production bundler)
* **Routing:** React Router DOM (v6) for Client-side Navigation
* **State Management & Network:** Context API + Axios (with Request/Response Interceptors for JWT auth)
* **Icons & Animation:** React Icons, CSS Micro-animations

### Backend Layer
* **Framework:** Django (v4.2)
* **API Framework:** Django REST Framework (DRF)
* **Security:** Simple JWT (JSON Web Tokens)
* **CORS Management:** `django-cors-headers`
* **Static Management:** WhiteNoise (optimizing local files and stylesheets)

---

## 📂 Core Modules

* **User Authentication Engine:** Manages secure user signups, sign-ins, profile lookups, and session tokens.
* **Product Catalog Service:** Drives categories, custom queries, detailed frame shape filtering (Rectangle, Aviator, Round, Cateye, etc.), and stock levels.
* **Shopping Cart & Wishlist:** Stateful memory structures handling local client updates, backend updates, and active item caching.
* **Prescription Registry:** Validates and saves prescription records (PDFs/images), linking them directly to newly created order records.
* **Fulfillment Pipeline:** Django-administered order tracker changing order stages in the database and updating client-facing timelines.

---

## ⚙️ API Features

* **JWT Stateless Access:** Employs brief access tokens and persistent refresh tokens for secure and scalable access control.
* **Form Data Parsing:** Integrates `MultiPartParser` and `FormParser` in the checkout API to support combined text data and file uploads in a single request.
* **Dynamic Search & Filtering:** API endpoints support direct querying to filter frames by shape, category, and availability.

---

## 🔒 Authentication & Security

* **Access Control:** REST endpoints for Cart, Wishlist, Checkout, and Orders are shielded by DRF's `IsAuthenticated` permission class.
* **Route Guards:** Frontend routes (e.g., `/cart`, `/wishlist`, `/orders`, `/checkout`) redirect unauthenticated users to `/login`.
* **CORS Settings:** Strict CORS configurations limit backend access to registered domains in production.
* **Token Rotation:** Silent JWT token refresh mechanism ensures seamless user sessions without manual relogins.

---

## 🗄️ Database Design

The database schema utilizes relational modeling to connect authentication profiles with retail operations:

```
  +--------------+          +------------------+          +------------------+
  |  django_user  | 1 ---- * |    store_cart    | * ---- 1 |  store_product   |
  +-------+------+          +------------------+          +--------+---------+
          |                                                        |
          | 1                                                      | 1
          |                                                        |
          | *                                                      | *
  +-------v------+          +------------------+          +--------v---------+
  | store_order  | 1 ---- * | store_orderitem  | * ------ |  store_product   |
  +--------------+          +------------------+          +------------------+
```

### Key Models & Fields
* **Product:** Name, Brand, Category, Frame Shape, Price, Stock, Image.
* **Order:** Customer User, Full Name, Email, Address, Phone, Total Price, Status (Pending, Accepted, Processing Lenses, Shipped, Delivered), Prescription File, Created/Updated Timestamps.
* **CartItem:** User, Product, Quantity.
* **Wishlist:** User, Product, Created Timestamp.

---

## 🖼️ Screenshots Section

Visual walkthroughs of the key consumer pages:

| Interface Page | Mockup / Reference Path |
| :--- | :--- |
| **Home Page** | `docs/screenshots/home.png` |
| **Products Catalog Grid** | `docs/screenshots/products.png` |
| **Shopping Cart Detail** | `docs/screenshots/cart.png` |
| **Checkout & Prescription Upload** | `docs/screenshots/checkout.png` |
| **Fulfillment Django Admin Dashboard** | `docs/screenshots/admin.png` |

---

## ⚙️ Installation & Local Setup

### System Prerequisites
* **Python 3.9+**
* **Node.js 18+**

### 1. Backend API Server Setup
```bash
# Go to Django directory
cd Django-eCommerce-Web-Application-main

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r req_unpinned.txt dj-database-url psycopg2-binary django-cors-headers

# Apply database migrations
python manage.py migrate

# Seed catalog database with 24 optical products
python populate_products.py

# Create a Django administrator account
python manage.py createsuperuser

# Launch local server
python manage.py runserver
```
*Django API endpoint is active at:* `http://127.0.0.1:8000/`

### 2. Frontend React Setup
```bash
# Open a new terminal tab and go to the frontend directory
cd Django-eCommerce-Web-Application-main/frontend

# Install node dependencies
npm install

# Run the local Vite server
npm run dev
```
*React frontend is active at:* `http://localhost:5173/`

---

## 🔗 API Endpoints

| Endpoint Route | Method | Permission | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register/` | `POST` | AllowAny | Creates a new user credential |
| `/api/auth/login/` | `POST` | AllowAny | Returns JWT access & refresh tokens |
| `/api/auth/profile/` | `GET` | IsAuthenticated | Fetches registered profile information |
| `/api/products/` | `GET` | AllowAny | Returns product items (supports category query) |
| `/api/cart/` | `GET / POST` | IsAuthenticated | Retrieves or inserts items in shopping cart |
| `/api/cart/update/<id>/<action>/` | `PATCH` | IsAuthenticated | Increments/decrements cart item quantity |
| `/api/wishlist/` | `GET` | IsAuthenticated | Returns saved products for current user |
| `/api/wishlist/toggle/<id>/` | `POST` | IsAuthenticated | Saves or deletes a product from user's wishlist |
| `/api/checkout/` | `POST` | IsAuthenticated | Processes checkout and uploads prescription file |
| `/api/orders/` | `GET` | IsAuthenticated | Retrieves past order logs and delivery status |

---

## 📊 Project Statistics

* **Frontend:** React + Vite
* **Backend:** Django REST Framework
* **Authentication:** JWT
* **Database:** SQLite (PostgreSQL Ready)
* **APIs:** Products, Cart, Wishlist, Orders, Checkout, Auth
* **Architecture:** Decoupled Frontend + Backend

---

## 📂 Folder Structure

```
MAXVISION/
├── frontend/             # React (Vite) Frontend Single Page Application
├── store/                # Django Main App (Models, Views, Serializers, URLs)
├── ecommerce2/           # Django settings, root routing configuration
├── static/               # Shared stylesheets and public static files
├── media/                # Saved product photographs & uploaded doctor prescriptions
├── manage.py             # Django admin CLI entry point
├── requirements.txt      # Primary production requirements file
└── README.md             # Developer documentation guide
```

---

## 📈 Latest Development Progress

### 🟢 Core Platform Capabilities (Fully Functional & Integrated)
* **JWT Authentication:** Sessionless authentication with token-rotation lifecycle and client-side route guards.
* **REST APIs using Django REST Framework:** Modular endpoint serializers, custom views, and token authorization control.
* **Product Catalog & Detail Discovery:** Multi-criteria product queries with localized dimension tracking for categorizing frames (Aviator, Cateye, Rectangle, etc.).
* **Wishlist Integration:** Real-time wishlist toggling from frame listings with dynamic database sync.
* **Shopping Cart & Checkout:** State-synchronized cart calculations, address forms, and phone metadata checks.
* **Prescription Upload Vault:** Integrated multi-part request parsing to securely upload clinical prescription PDFs and images directly onto order details.
* **Fulfillment Order Tracking:** Multi-stage timelines tracking statuses from Pending to Delivered, showing exact timestamps or estimated days.
* **Django Admin Optimization:** Custom administration grids sorting user orders, wishlists, and direct downloads of uploaded prescription records.
* **Decoupled System Verification:** Verified database schemas, JWT lifecycles, and transaction flows locally with seamless SQLite database configurations.

---

## 🚀 Future Roadmap

### 🔵 Planned / Upcoming Additions
* **Face Shape Recommendation:** Short quiz using face coordinates to recommend ideal frames.
* **Razorpay Integration:** Live Indian/global payment gateway integration.
* **Cloudinary Uploads:** Shifting media files from local folders to Cloudinary CDN.
* **PostgreSQL Production Migration:** Moving databases to production Cloud Postgres.
* **AR Virtual Try-On:** Interactive WebGL overlay to test frames in real-time.

---

## 👨+ Author Information

* **Author:** Zishan
* **Academic Profile:** B.Tech Computer Science Engineering
* **University:** Lovely Professional University
* **GitHub Profile:** [github.com/md-z-ishan](https://github.com/md-z-ishan)
