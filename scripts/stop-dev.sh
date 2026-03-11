#!/bin/bash
# Stop development servers

set -e

echo "🛑 Stopping development servers..."

# Read PIDs if they exist
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo "✅ Backend server stopped (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend server was not running"
    fi
    rm .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo "✅ Frontend server stopped (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend server was not running"
    fi
    rm .frontend.pid
fi

# Fallback: kill by port
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "✅ Killed processes on port 3001" || echo "ℹ️  No processes on port 3001"
lsof -ti:8000 | xargs kill -9 2>/dev/null && echo "✅ Killed processes on port 8000" || echo "ℹ️  No processes on port 8000"

echo "🏁 All development servers stopped"