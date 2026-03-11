export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface DetectionRequest {
  image: string; // base64 encoded image
}

export interface DetectionResponse {
  count: number;
  items: DetectionItem[];
  processingTime: number;
}

export interface DetectionItem {
  label: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  confidence: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version?: string;
  modelLoaded?: boolean;
}

export const SUPPORTED_ITEMS = {
  grocery: [
    'apple',
    'orange',
    'banana',
    'broccoli',
    'carrot',
    'hot dog',
    'pizza',
    'donut',
    'cake',
    'sandwich',
    'bottle',
    'wine glass',
    'cup',
    'fork',
    'knife',
    'spoon',
    'bowl',
    'potted plant',
  ],
  office: [
    'laptop',
    'mouse',
    'keyboard',
    'cell phone',
    'book',
    'chair',
    'tv',
    'scissors',
    'clock',
  ],
} as const;
