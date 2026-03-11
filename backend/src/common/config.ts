export const CONFIG = {
  // Server Configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // AI Model Configuration
  MODEL_CONFIG: {
    base: 'lite_mobilenet_v2' as const,
    confidenceThreshold: 0.4,
    maxDetections: 20,
  },
  // Image Processing
  IMAGE_CONFIG: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
    quality: 0.7,
  },
  // API Configuration
  API_CONFIG: {
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    bodyLimit: '10mb',
    rateLimitMax: 100,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Detection Configuration
  DETECTION_CONFIG: {
    intervalMs: 1200,
    enableHistory: true,
    maxHistoryItems: 100,
  },
} as const;

export const ITEM_CATEGORIES = {
  GROCERY: 'grocery',
  OFFICE: 'office',
  ALL: 'all',
} as const;
