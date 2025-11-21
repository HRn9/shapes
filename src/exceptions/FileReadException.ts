/**
 * Custom exception for file reading errors.
 * Used when file operations fail.
 */
export class FileReadException extends Error {
  private readonly filePath?: string;
  private readonly details?: Record<string, unknown>;

  constructor(message: string, filePath?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'FileReadException';
    this.filePath = filePath;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileReadException);
    }
  }

  public getFilePath(): string | undefined {
    return this.filePath;
  }

  public getDetails(): Record<string, unknown> | undefined {
    return this.details;
  }

  public toString(): string {
    let result = `${this.name}: ${this.message}`;

    if (this.filePath) {
      result += ` | File: ${this.filePath}`;
    }

    if (this.details) {
      result += ` | Details: ${JSON.stringify(this.details)}`;
    }

    return result;
  }
}
