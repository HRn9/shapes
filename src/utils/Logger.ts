import pino from 'pino';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createWriteStream, mkdirSync, existsSync } from 'fs';

/**
 * Logger utility class using Pino for structured logging.
 * Logs to both console and file.
 */
class Logger {
  private static instance: Logger | null = null;
  private readonly logger: pino.Logger;

  private constructor() {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const projectRoot = join(currentDir, '..', '..');
    const logsDir = join(projectRoot, 'logs');
    const logFilePath = join(logsDir, 'application.log');

    // Ensure logs directory exists
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    // Create file stream for logging
    const fileStream = createWriteStream(logFilePath, { flags: 'a' });

    // Create logger with multistream
    this.logger = pino(
      {
        level: 'info',
        formatters: {
          level: (label) => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.multistream([{ stream: process.stdout }, { stream: fileStream }]),
    );
  }

  /**
   * Gets the singleton instance of Logger.
   */
  public static getInstance(): Logger {
    if (Logger.instance === null) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Logs an info message.
   */
  public info(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.logger.info(data, message);
    } else {
      this.logger.info(message);
    }
  }

  /**
   * Logs a warning message.
   */
  public warn(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.logger.warn(data, message);
    } else {
      this.logger.warn(message);
    }
  }

  /**
   * Logs an error message.
   */
  public error(
    message: string,
    error?: Error | unknown,
    data?: Record<string, unknown>,
  ): void {
    const logData: Record<string, unknown> = { ...data };

    if (error instanceof Error) {
      logData.error = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    } else if (error) {
      logData.error = error;
    }

    this.logger.error(logData, message);
  }

  /**
   * Logs a debug message.
   */
  public debug(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.logger.debug(data, message);
    } else {
      this.logger.debug(message);
    }
  }

  /**
   * Logs a trace message.
   */
  public trace(message: string, data?: Record<string, unknown>): void {
    if (data) {
      this.logger.trace(data, message);
    } else {
      this.logger.trace(message);
    }
  }

  /**
   * Logs a fatal message.
   */
  public fatal(
    message: string,
    error?: Error | unknown,
    data?: Record<string, unknown>,
  ): void {
    const logData: Record<string, unknown> = { ...data };

    if (error instanceof Error) {
      logData.error = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    } else if (error) {
      logData.error = error;
    }

    this.logger.fatal(logData, message);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
