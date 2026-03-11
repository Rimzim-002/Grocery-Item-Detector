# API Documentation

## Base URL
```
http://localhost:3001
```

## Endpoints

### Health Check
**GET** `/health`

Check if the API is running and the AI model is loaded.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-10T15:30:00.000Z",
  "version": "1.0.0",
  "modelLoaded": true
}
```

### Object Detection
**POST** `/detect`

Detect objects in a base64-encoded image.

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response:**
```json
{
  "count": 2,
  "items": [
    {
      "label": "apple",
      "score": 0.87,
      "bbox": [100, 150, 80, 90],
      "confidence": "87%"
    },
    {
      "label": "laptop",
      "score": 0.92,
      "bbox": [200, 100, 150, 100],
      "confidence": "92%"
    }
  ],
  "processingTime": 234
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid image data",
  "timestamp": "2026-03-10T15:30:00.000Z"
}
```

## Supported Items

### Grocery Items
- Fruits: apple, orange, banana
- Vegetables: broccoli, carrot
- Food: hot dog, pizza, donut, cake, sandwich
- Beverages: bottle, wine glass, cup
- Utensils: fork, knife, spoon, bowl
- Plants: potted plant

### Office Items
- Electronics: laptop, mouse, keyboard, cell phone, tv/monitor
- Furniture: chair
- Tools: scissors, clock
- Materials: book

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid image data |
| 413 | Payload Too Large - Image exceeds 10MB |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Model not loaded |

## Rate Limiting
- 100 requests per 15-minute window
- Resets automatically

## Image Requirements
- Format: JPEG, JPG, PNG
- Max Size: 10MB
- Encoding: Base64 with data URL prefix