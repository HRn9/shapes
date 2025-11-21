import { Oval } from '../entities/Oval.js';
import { OvalValidator } from '../validators/OvalValidator.js';
import { ValidationException } from '../exceptions/ValidationException.js';

/**
 * Service class containing business logic for Oval operations.
 * Handles area, perimeter, and geometric property calculations.
 */
export class OvalService {
  private readonly validator: OvalValidator;
  private static readonly EPSILON = 1e-10;

  constructor() {
    this.validator = new OvalValidator();
  }

  /**
   * Calculates the area of an oval using the formula: π * a * b
   * where a is semi-major axis and b is semi-minor axis.
   */
  public calculateArea(oval: Oval): number {
    const semiMajorAxis = oval.getSemiMajorAxis();
    const semiMinorAxis = oval.getSemiMinorAxis();

    this.validator.validateAxes(semiMajorAxis, semiMinorAxis);

    const area = Math.PI * semiMajorAxis * semiMinorAxis;

    this.validator.validateArea(area);

    return area;
  }

  /**
   * Calculates the perimeter (circumference) of an oval using Ramanujan's approximation:
   * π * [3(a + b) - √((3a + b)(a + 3b))]
   * where a is semi-major axis and b is semi-minor axis.
   */
  public calculatePerimeter(oval: Oval): number {
    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();

    this.validator.validateAxes(a, b);

    // Ramanujan's first approximation for ellipse perimeter
    const h = (a - b) ** 2 / (a + b) ** 2;
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

    this.validator.validatePerimeter(perimeter);

    return perimeter;
  }

  /**
   * Checks if the two points actually form a valid oval.
   * Points must not lie on the same line parallel to coordinate axes.
   */
  public isValidOval(oval: Oval): boolean {
    try {
      this.validator.validatePoints(oval.getPoint1(), oval.getPoint2());
      const semiMajorAxis = oval.getSemiMajorAxis();
      const semiMinorAxis = oval.getSemiMinorAxis();
      return this.validator.validateOvalShape(semiMajorAxis, semiMinorAxis);
    } catch (error) {
      if (error instanceof ValidationException) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Checks if the oval is actually a circle (semi-major axis equals semi-minor axis).
   */
  public isCircle(oval: Oval): boolean {
    if (!this.isValidOval(oval)) {
      return false;
    }

    const semiMajorAxis = oval.getSemiMajorAxis();
    const semiMinorAxis = oval.getSemiMinorAxis();

    return Math.abs(semiMajorAxis - semiMinorAxis) < OvalService.EPSILON;
  }

  /**
   * Checks if the oval intersects only the X axis at a given distance from origin.
   * Returns true if the oval crosses the X axis at the specified distance
   * and does not cross the Y axis.
   */
  public intersectsOnlyXAxisAtDistance(oval: Oval, distance: number): boolean {
    this.validator.validateDistance(distance);

    if (!this.isValidOval(oval)) {
      return false;
    }

    const centerX = oval.getCenterX();
    const centerY = oval.getCenterY();
    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();

    // Check if oval intersects X axis (y = 0)
    // For ellipse equation: ((x - cx)² / a²) + ((y - cy)² / b²) = 1
    // At y = 0: ((x - cx)² / a²) + (cy² / b²) = 1
    // Solving for x: x = cx ± a * √(1 - cy²/b²)

    const discriminantX = 1 - (centerY * centerY) / (b * b);

    if (discriminantX <= 0) {
      // Oval doesn't intersect X axis
      return false;
    }

    const xIntersect1 = centerX - a * Math.sqrt(discriminantX);
    const xIntersect2 = centerX + a * Math.sqrt(discriminantX);

    const intersectsAtDistance = Math.abs(Math.abs(xIntersect1) - distance) < OvalService.EPSILON
                                 || Math.abs(Math.abs(xIntersect2) - distance) < OvalService.EPSILON;

    if (!intersectsAtDistance) {
      return false;
    }

    // Check if oval intersects Y axis (x = 0)
    const discriminantY = 1 - (centerX * centerX) / (a * a);

    // Should NOT intersect Y axis
    return discriminantY <= 0;
  }

  /**
   * Checks if the oval intersects only the Y axis at a given distance from origin.
   * Returns true if the oval crosses the Y axis at the specified distance
   * and does not cross the X axis.
   */
  public intersectsOnlyYAxisAtDistance(oval: Oval, distance: number): boolean {
    this.validator.validateDistance(distance);

    if (!this.isValidOval(oval)) {
      return false;
    }

    const centerX = oval.getCenterX();
    const centerY = oval.getCenterY();
    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();

    // Check if oval intersects Y axis (x = 0)
    // At x = 0: (cx² / a²) + ((y - cy)² / b²) = 1
    // Solving for y: y = cy ± b * √(1 - cx²/a²)

    const discriminantY = 1 - (centerX * centerX) / (a * a);

    if (discriminantY <= 0) {
      // Oval doesn't intersect Y axis
      return false;
    }

    const yIntersect1 = centerY - b * Math.sqrt(discriminantY);
    const yIntersect2 = centerY + b * Math.sqrt(discriminantY);

    const intersectsAtDistance = Math.abs(Math.abs(yIntersect1) - distance) < OvalService.EPSILON
                                 || Math.abs(Math.abs(yIntersect2) - distance) < OvalService.EPSILON;

    if (!intersectsAtDistance) {
      return false;
    }

    // Check if oval intersects X axis (y = 0)
    const discriminantX = 1 - (centerY * centerY) / (b * b);

    // Should NOT intersect X axis
    return discriminantX <= 0;
  }

  /**
   * Checks if the oval intersects the X axis at all.
   */
  public intersectsXAxis(oval: Oval): boolean {
    if (!this.isValidOval(oval)) {
      return false;
    }

    const centerY = oval.getCenterY();
    const b = oval.getSemiMinorAxis();

    // Oval intersects X axis if center's Y distance is less than semi-minor axis
    return Math.abs(centerY) <= b + OvalService.EPSILON;
  }

  /**
   * Checks if the oval intersects the Y axis at all.
   */
  public intersectsYAxis(oval: Oval): boolean {
    if (!this.isValidOval(oval)) {
      return false;
    }

    const centerX = oval.getCenterX();
    const a = oval.getSemiMajorAxis();

    // Oval intersects Y axis if center's X distance is less than semi-major axis
    return Math.abs(centerX) <= a + OvalService.EPSILON;
  }

  /**
   * Gets the eccentricity of the oval.
   * For a circle, eccentricity is 0. For an ellipse, it's between 0 and 1.
   */
  public calculateEccentricity(oval: Oval): number {
    if (!this.isValidOval(oval)) {
      throw new ValidationException('Cannot calculate eccentricity for invalid oval');
    }

    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();

    if (a >= b) {
      // a is the major axis
      return Math.sqrt(1 - (b * b) / (a * a));
    }
    // b is the major axis
    return Math.sqrt(1 - (a * a) / (b * b));
  }

  /**
   * Calculates the distance from the center to a focus point.
   */
  public calculateFocalDistance(oval: Oval): number {
    if (!this.isValidOval(oval)) {
      throw new ValidationException('Cannot calculate focal distance for invalid oval');
    }

    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();

    // c = √(a² - b²) for a > b, or √(b² - a²) for b > a
    if (a >= b) {
      return Math.sqrt(a * a - b * b);
    }
    return Math.sqrt(b * b - a * a);
  }
}
