import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Grocery and Office items from COCO-SSD's 80 classes
const DETECTION_LABELS = new Set([
  // Food & Grocery Items
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
  'refrigerator',
  'microwave',
  'oven',
  'toaster',
  'sink',
  // Office & Technology Items
  'laptop',
  'mouse',
  'keyboard',
  'cell phone',
  'book',
  'chair',
  'tv', // monitors/screens
  'scissors',
  'clock',
  'remote',
  'handbag',
  'backpack',
  'umbrella',
  'suitcase',
  // Common items for testing
  'couch',
  'dining table',
  'toilet',
  'bed',
  'person', // for testing detection
]);

export interface DetectionResult {
  label: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

@Injectable()
export class DetectionService implements OnModuleInit {
  private model: cocoSsd.ObjectDetection;
  private readonly logger = new Logger(DetectionService.name);

  async onModuleInit() {
    this.logger.log('Loading COCO-SSD model... (this may take a moment)');
    this.model = await cocoSsd.load({
      base: 'mobilenet_v2', // Use full model instead of lite for better accuracy
    });
    this.logger.log('✅ COCO-SSD model loaded successfully!');
  }

  async detectFromBase64(base64Image: string): Promise<DetectionResult[]> {
    // Strip data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Decode image to tensor
    let imageTensor: tf.Tensor3D;
    try {
      imageTensor = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D;
    } catch (error) {
      this.logger.error('Failed to decode image', error);
      throw new Error('Invalid image data');
    }

    try {
      // Run detection
      const predictions = await this.model.detect(imageTensor);

      // Filter to grocery and office items and map to our format
      const results: DetectionResult[] = predictions
        .filter(
          (pred) =>
            DETECTION_LABELS.has(pred.class.toLowerCase()) &&
            pred.score >= 0.25,
        )
        .map((pred) => ({
          label: pred.class,
          score: Math.round(pred.score * 100) / 100,
          bbox: pred.bbox,
        }));

      return results;
    } finally {
      imageTensor.dispose();
    }
  }
}
