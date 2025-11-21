/**
 * Custom exception for shape creation errors.
 * Used when shape factory fails to create a shape instance.
 */
export class ShapeCreationException extends Error {
  private readonly shapeType?: string;
  private readonly details?: Record<string, unknown>;

  constructor(message: string, shapeType?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ShapeCreationException';
    this.shapeType = shapeType;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShapeCreationException);
    }
  }

  public getShapeType(): string | undefined {
    return this.shapeType;
  }

  public getDetails(): Record<string, unknown> | undefined {
    return this.details;
  }

  public toString(): string {
    let result = `${this.name}: ${this.message}`;

    if (this.shapeType) {
      result += ` | Shape Type: ${this.shapeType}`;
    }

    if (this.details) {
      result += ` | Details: ${JSON.stringify(this.details)}`;
    }

    return result;
  }
}
