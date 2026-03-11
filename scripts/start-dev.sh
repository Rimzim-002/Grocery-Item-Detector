#!/bin/bash
# Development setup and start script

set -e

echo "🚀 Starting Grocery Item Detection Development Environment"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"
echo ""

# Start backend in development mode
echo "🔧 Starting backend server..."
npm run start:dev &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"
echo ""

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 10

# Start frontend server
echo "🌐 Starting frontend server..."
cd ../frontend
python3 -m http.server 8000 &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"
echo ""

echo "🎉 Development environment is ready!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:8000"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/health"
echo ""
echo "🛑 To stop all servers, run: npm run stop"
echo ""

# Save PIDs for cleanup script
echo "$BACKEND_PID" > ../.backend.pid
echo "$FRONTEND_PID" > ../.frontend.pid

# Keep script running
wait