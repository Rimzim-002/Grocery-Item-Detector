export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = this.formatTimestamp();
    const ctx = context ? `[${context}]` : '';
    return `${timestamp} ${level} ${ctx} ${message}`;
  }

  static log(message: string, context?: string): void {
    console.log(this.formatMessage('LOG', message, context));
  }

  static error(message: string, error?: Error, context?: string): void {
    console.error(this.formatMessage('ERROR', message, context));
    if (error && error.stack) {
      console.error(error.stack);
    }
  }

  static warn(message: string, context?: string): void {
    console.warn(this.formatMessage('WARN', message, context));
  }

  static debug(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }
}

export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function validateBase64Image(base64String: string): boolean {
  const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
  return base64Regex.test(base64String);
}

export function sanitizeFileName(filename: string): string {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
}

export function calculateProcessingTime(startTime: number): number {
  return Math.round(performance.now() - startTime);
}
