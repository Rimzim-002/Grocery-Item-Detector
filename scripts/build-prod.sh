#!/bin/bash
# Production build script

set -e

echo "🏗️  Building Grocery Item Detection for Production"
echo ""

# Build backend
echo "📦 Building backend..."
cd backend
npm run build
echo "✅ Backend build completed"
echo ""

# Optimize frontend (if needed)
echo "🌐 Preparing frontend..."
cd ../frontend
# Add minification/optimization steps here if needed
echo "✅ Frontend prepared"
echo ""

# Create production archive
echo "📁 Creating production archive..."
cd ..
tar -czf grocery-detection-prod.tar.gz backend/dist backend/package.json backend/package-lock.json frontend/ docs/ README.md
echo "✅ Production archive created: grocery-detection-prod.tar.gz"
echo ""

echo "🎉 Production build completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Extract archive on production server"
echo "   2. Run: npm install --production"
echo "   3. Set environment variables"
echo "   4. Start with: npm run start:prod"