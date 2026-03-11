# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Python 3.7+ (for frontend server)
- Modern browser with webcam support

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rimzim-002/Grocery-Item-Detector.git
   cd Grocery-Item-Detector
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure environment variables
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   # No additional setup needed for vanilla HTML/CSS/JS
   ```

## Development Workflow

### Backend Development
```bash
cd backend

# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

### Frontend Development
```bash
cd frontend

# Start development server
python3 -m http.server 8000
# or use any static file server like Live Server in VS Code
```

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── detection/           # Detection module
│   │   ├── detection.controller.ts
│   │   ├── detection.service.ts
│   │   └── detection.module.ts
│   ├── common/              # Shared utilities
│   │   ├── interfaces.ts    # Type definitions
│   │   ├── config.ts        # Configuration
│   │   └── utils.ts         # Utility functions
│   ├── app.module.ts        # Root module
│   └── main.ts              # Entry point
├── test/                    # Test files
├── dist/                    # Compiled output
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── js/
│   │   └── app.js           # Main application logic
│   ├── css/
│   │   └── style.css        # Styles
│   └── assets/              # Static assets
└── index.html               # Main HTML file
```

## Coding Standards

### Backend (TypeScript)
- Use TypeScript strict mode
- Follow NestJS conventions
- Use dependency injection
- Write unit tests for services
- Use ESLint + Prettier for formatting

### Frontend (JavaScript)
- Use modern ES6+ syntax
- Follow consistent naming conventions
- Use const/let instead of var
- Write clean, readable code
- Use semantic HTML

## Testing

### Backend Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Manual Testing
1. Start both backend and frontend servers
2. Open browser to http://localhost:8000
3. Allow camera access
4. Test detection with various objects
5. Check browser console for errors
6. Verify API responses in Network tab

## Debugging

### Backend Debugging
- Use VS Code debugger with NestJS
- Check console logs for TensorFlow initialization
- Monitor memory usage during detection
- Use Chrome DevTools for Node.js debugging

### Frontend Debugging
- Use browser DevTools console
- Check Network tab for API calls
- Verify camera permissions
- Test canvas rendering

## Performance Optimization

### Backend
- Use model caching
- Implement request throttling
- Optimize image processing
- Monitor memory leaks

### Frontend
- Optimize canvas operations
- Reduce detection frequency if needed
- Implement proper error handling
- Use efficient DOM updates

## Deployment

### Backend Deployment
```bash
npm run build
npm run start:prod
```

### Frontend Deployment
- Use any static file hosting service
- Ensure CORS is properly configured
- Update API_URL for production

## Environment Variables

Create `.env` file in backend directory:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:8000,http://localhost:3000
```