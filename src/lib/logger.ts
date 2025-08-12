// lib/logger.ts
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  info(message: string, data?: any) {
    if (this.isDevelopment) {
      if (typeof data === 'object' && data !== null) {
        console.log(`[INFO] ${message}`, JSON.stringify(data, null, 2));
      } else {
        console.log(`[INFO] ${message}`, data || '');
      }
    }
  }

  error(message: string, data?: any) {
    if (this.isDevelopment) {
      if (typeof data === 'object' && data !== null) {
        console.error(`[ERROR] ${message}`, JSON.stringify(data, null, 2));
      } else {
        console.error(`[ERROR] ${message}`, data || '');
      }
    }
  }

  warn(message: string, data?: any) {
    if (this.isDevelopment) {
      if (typeof data === 'object' && data !== null) {
        console.warn(`[WARN] ${message}`, JSON.stringify(data, null, 2));
      } else {
        console.warn(`[WARN] ${message}`, data || '');
      }
    }
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      if (typeof data === 'object' && data !== null) {
        console.debug(`[DEBUG] ${message}`, JSON.stringify(data, null, 2));
      } else {
        console.debug(`[DEBUG] ${message}`, data || '');
      }
    }
  }
}

export const logger = new Logger();