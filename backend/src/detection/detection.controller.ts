import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetectionService, DetectionResult } from './detection.service';

class DetectDto {
  image: string; // base64 encoded image
}

@Controller('api')
export class DetectionController {
  constructor(private readonly detectionService: DetectionService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
  @Post('detect')
  async detect(
    @Body() body: DetectDto,
  ): Promise<{ items: DetectionResult[]; count: number }> {
    if (!body.image) {
      return { items: [], count: 0 };
    }

    const items = await this.detectionService.detectFromBase64(body.image);
    return { items, count: items.length };
  }
}
