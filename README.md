# 🍎 Grocery Item Detection System

An AI-powered real-time object detection system that identifies grocery and office items using your webcam.

## 🎯 Features

- **Real-time Detection**: Live webcam object detection
- **Dual Categories**: Detects both grocery and office items
- **Modern UI**: Clean, responsive web interface
- **High Accuracy**: Uses TensorFlow COCO-SSD model
- **RESTful API**: NestJS backend with TypeScript

## 🛠️ Tech Stack

**Backend:**
- NestJS (Node.js framework)
- TypeScript
- TensorFlow.js with COCO-SSD model
- Express.js

**Frontend:**
- HTML5 / CSS3 / JavaScript
- Canvas API for video processing
- Responsive design

## 📁 Project Structure

```
grocery-item-detection/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── detection/       # Detection module
│   │   ├── common/          # Shared utilities
│   │   └── main.ts         # Entry point
│   ├── test/               # Test files
│   └── package.json
├── frontend/               # Web client
│   ├── src/
│   │   ├── js/            # JavaScript files
│   │   ├── css/           # Stylesheets
│   │   └── assets/        # Static assets
│   └── index.html
├── docs/                  # Documentation
├── scripts/               # Build/deployment scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser with webcam

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rimzim-002/Grocery-Item-Detector.git
   cd Grocery-Item-Detector
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   python3 -m http.server 8000
   # or use any static file server
   ```

4. **Open Application**
   Navigate to `http://localhost:8000`

## 🔍 Detectable Items

### 🥕 Grocery Items
- Fruits: apple, orange, banana
- Vegetables: broccoli, carrot
- Food: hot dog, pizza, donut, cake, sandwich
- Beverages: bottle, wine glass, cup
- Utensils: fork, knife, spoon, bowl
- Plants: potted plant

### 💻 Office Items
- Electronics: laptop, mouse, keyboard, cell phone, tv/monitor
- Furniture: chair
- Tools: scissors, clock
- Materials: book

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run start:dev    # Development mode with hot reload
npm run build        # Production build
npm run test         # Run tests
```

### API Endpoints
- `GET /health` - Health check
- `POST /detect` - Object detection
  ```json
  {
    "image": "data:image/jpeg;base64,..."
  }
  ```

## 📊 Performance

- **Detection Interval**: 1.2 seconds
- **Model**: COCO-SSD lite_mobilenet_v2
- **Confidence Threshold**: 40%
- **Image Processing**: Real-time webcam capture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- TensorFlow.js and COCO-SSD model
- NestJS framework
- Open source community