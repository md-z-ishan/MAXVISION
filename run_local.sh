#!/usr/bin/env bash

# MAXVISION Optical - Local Development Runner
# Location: Ranchi, Jharkhand

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "=========================================================="
echo " 👓 MAXVISION Optical - Local Development Runner          "
echo " 📍 Shop: Sheetal Tower, Taxi Stand, Main Road, Ranchi    "
echo "=========================================================="
echo "Select an option:"
echo " 1) Start Full Stack (Backend + Frontend simultaneously)"
echo " 2) Start Django Backend only (Port 8000)"
echo " 3) Start React Frontend only (Port 5173)"
echo " 4) Run Backend Migrations & Seed Products"
echo " 5) Exit"
echo "=========================================================="
read -p "Enter choice [1-5]: " choice

start_backend() {
    # Auto-free port 8000 if occupied by previous session
    OLD_BACKEND_PID=$(lsof -ti :8000 2>/dev/null)
    if [ -n "$OLD_BACKEND_PID" ]; then
        echo "⚡ Port 8000 already occupied by PID $OLD_BACKEND_PID. Freeing port 8000..."
        kill -9 $OLD_BACKEND_PID 2>/dev/null
        sleep 1
    fi

    echo "▶ Starting Django Backend Server on http://127.0.0.1:8000/ ..."
    cd "$BACKEND_DIR"
    if [ -d "venv" ]; then
        source venv/bin/activate
    elif [ -d "../.venv" ]; then
        source ../.venv/bin/activate
    fi
    python3 manage.py runserver 127.0.0.1:8000
}

start_frontend() {
    # Auto-free port 5173 if occupied by previous session
    OLD_FRONTEND_PID=$(lsof -ti :5173 2>/dev/null)
    if [ -n "$OLD_FRONTEND_PID" ]; then
        echo "⚡ Port 5173 already occupied by PID $OLD_FRONTEND_PID. Freeing port 5173..."
        kill -9 $OLD_FRONTEND_PID 2>/dev/null
        sleep 1
    fi

    echo "▶ Starting Vite React Frontend on http://localhost:5173/ ..."
    cd "$FRONTEND_DIR"
    npm run dev
}

case $choice in
    1)
        echo "🚀 Launching both Backend and Frontend..."
        (start_backend) &
        BACKEND_PID=$!
        sleep 2
        (start_frontend) &
        FRONTEND_PID=$!

        trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
        wait
        ;;
    2)
        start_backend
        ;;
    3)
        start_frontend
        ;;
    4)
        cd "$BACKEND_DIR"
        if [ -d "venv" ]; then
            source venv/bin/activate
        elif [ -d "../.venv" ]; then
            source ../.venv/bin/activate
        fi
        echo "Applying migrations..."
        python3 manage.py migrate
        echo "Seeding products..."
        python3 populate_products.py
        echo "Done!"
        ;;
    *)
        echo "Exiting."
        exit 0
        ;;
esac
