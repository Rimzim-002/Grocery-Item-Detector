import { Module } from '@nestjs/common';
import { DetectionModule } from './detection/detection.module';

@Module({
  imports: [DetectionModule],
})
export class AppModule {}
