/**
 * Custom exception for validation errors.
 * Used when data validation fails.
 */
export class ValidationException extends Error {
  private readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ValidationException';
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }

  public getDetails(): Record<string, unknown> | undefined {
    return this.details;
  }

  public toString(): string {
    if (this.details) {
      return `${this.name}: ${this.message} | Details: ${JSON.stringify(this.details)}`;
    }
    return `${this.name}: ${this.message}`;
  }
}
