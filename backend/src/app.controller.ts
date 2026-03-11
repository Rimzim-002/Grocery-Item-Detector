import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiInfo() {
    return {
      name: 'Grocery Item Detection API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: 'GET /api/health',
        detect: 'POST /api/detect'
      },
      message: 'AI-powered grocery and office item detection service'
    };
  }
}
