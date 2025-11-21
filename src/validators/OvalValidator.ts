import { Point } from '../entities/Point.js';
import { ValidationException } from '../exceptions/ValidationException.js';

/**
 * Validator class for Oval entity.
 * Validates data before creating Oval instances.
 */
export class OvalValidator {
  private static readonly NUMBER_PATTERN: RegExp = /^-?\d+(\.\d+)?$/;
  private static readonly MIN_COORDINATES = 4;
  private static readonly EPSILON = 1e-10;

  /**
   * Validates raw string data for creating an Oval.
   * Expected format: "x1 y1 x2 y2" where (x1, y1) and (x2, y2) are rectangle points.
   */
  public validateRawData(line: string): boolean {
    try {
      const trimmedLine = line.trim();

      if (trimmedLine.length === 0) {
        return false;
      }

      const parts = trimmedLine.split(/\s+/);

      if (parts.length !== OvalValidator.MIN_COORDINATES) {
        return false;
      }

      // Check if all parts are valid numbers
      for (const part of parts) {
        if (!OvalValidator.NUMBER_PATTERN.test(part)) {
          return false;
        }
      }

      // Parse coordinates
      const coordinates = parts.map((part) => parseFloat(part));

      // Additional validation
      return this.validateCoordinates(coordinates);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validates parsed coordinates array.
   */
  private validateCoordinates(coordinates: number[]): boolean {
    if (coordinates.length !== OvalValidator.MIN_COORDINATES) {
      return false;
    }

    // Check if any coordinate is NaN or Infinity
    for (const coord of coordinates) {
      if (!Number.isFinite(coord)) {
        return false;
      }
    }

    const [x1, y1, x2, y2] = coordinates;

    // Check if points are different
    if (Math.abs(x1 - x2) < OvalValidator.EPSILON || Math.abs(y1 - y2) < OvalValidator.EPSILON) {
      return false;
    }

    return true;
  }

  /**
   * Validates two Point objects can form a valid Oval.
   * Points must not lie on the same line parallel to coordinate axes.
   */
  public validatePoints(point1: Point, point2: Point): void {
    const x1 = point1.getX();
    const y1 = point1.getY();
    const x2 = point2.getX();
    const y2 = point2.getY();

    // Check if points are the same
    if (point1.equals(point2)) {
      throw new ValidationException(
        'Points cannot be identical',
        { point1: point1.toString(), point2: point2.toString() },
      );
    }

    // Check if points lie on a line parallel to X axis (same Y coordinate)
    if (Math.abs(y1 - y2) < OvalValidator.EPSILON) {
      throw new ValidationException(
        'Points lie on a line parallel to X axis',
        { point1: point1.toString(), point2: point2.toString() },
      );
    }

    // Check if points lie on a line parallel to Y axis (same X coordinate)
    if (Math.abs(x1 - x2) < OvalValidator.EPSILON) {
      throw new ValidationException(
        'Points lie on a line parallel to Y axis',
        { point1: point1.toString(), point2: point2.toString() },
      );
    }

    // Check that z coordinates are the same (oval must be in 2D plane)
    if (Math.abs(point1.getZ() - point2.getZ()) >= OvalValidator.EPSILON) {
      throw new ValidationException(
        'Points must be in the same Z plane',
        { point1: point1.toString(), point2: point2.toString() },
      );
    }
  }

  /**
   * Validates semi-major and semi-minor axes values.
   */
  public validateAxes(semiMajorAxis: number, semiMinorAxis: number): void {
    if (semiMajorAxis <= 0) {
      throw new ValidationException(
        'Semi-major axis must be positive',
        { semiMajorAxis },
      );
    }

    if (semiMinorAxis <= 0) {
      throw new ValidationException(
        'Semi-minor axis must be positive',
        { semiMinorAxis },
      );
    }

    if (!Number.isFinite(semiMajorAxis) || !Number.isFinite(semiMinorAxis)) {
      throw new ValidationException(
        'Axes values must be finite numbers',
        { semiMajorAxis, semiMinorAxis },
      );
    }
  }

  /**
   * Validates that the shape is a valid oval (not degenerate).
   */
  public validateOvalShape(semiMajorAxis: number, semiMinorAxis: number): boolean {
    try {
      this.validateAxes(semiMajorAxis, semiMinorAxis);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validates area value.
   */
  public validateArea(area: number): void {
    if (area <= 0) {
      throw new ValidationException(
        'Area must be positive',
        { area },
      );
    }

    if (!Number.isFinite(area)) {
      throw new ValidationException(
        'Area must be a finite number',
        { area },
      );
    }
  }

  /**
   * Validates perimeter value.
   */
  public validatePerimeter(perimeter: number): void {
    if (perimeter <= 0) {
      throw new ValidationException(
        'Perimeter must be positive',
        { perimeter },
      );
    }

    if (!Number.isFinite(perimeter)) {
      throw new ValidationException(
        'Perimeter must be a finite number',
        { perimeter },
      );
    }
  }

  /**
   * Validates distance value.
   */
  public validateDistance(distance: number): void {
    if (distance < 0) {
      throw new ValidationException(
        'Distance cannot be negative',
        { distance },
      );
    }

    if (!Number.isFinite(distance)) {
      throw new ValidationException(
        'Distance must be a finite number',
        { distance },
      );
    }
  }
}
