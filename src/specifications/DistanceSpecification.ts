import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { BaseSpecification } from './BaseSpecification.js';

/**
 * Specification for finding shapes within a distance range from the origin (0, 0, 0).
 * Calculates distance from the center or first point of the shape.
 */
export class DistanceSpecification extends BaseSpecification<Shape> {
  private readonly minDistance: number;
  private readonly maxDistance: number;

  /**
   * Creates a new distance specification.
   * @param minDistance - Minimum distance from origin (inclusive)
   * @param maxDistance - Maximum distance from origin (inclusive)
   */
  constructor(minDistance: number, maxDistance: number) {
    super();
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
  }

  /**
   * Checks if a shape is within the specified distance range from origin.
   * @param shape - The shape to check
   * @returns True if the shape is within the distance range
   */
  public isSatisfiedBy(shape: Shape): boolean {
    const distance = this.calculateDistanceFromOrigin(shape);
    return distance >= this.minDistance && distance <= this.maxDistance;
  }

  /**
   * Calculates the distance from origin to the shape's center or first point.
   * @param shape - The shape
   * @returns The distance from origin
   */
  private calculateDistanceFromOrigin(shape: Shape): number {
    if (shape instanceof Oval) {
      const centerX = shape.getCenterX();
      const centerY = shape.getCenterY();
      return Math.sqrt(centerX * centerX + centerY * centerY);
    }
    if (shape instanceof Tetrahedron) {
      const vertex1 = shape.getVertex1();
      const x = vertex1.getX();
      const y = vertex1.getY();
      const z = vertex1.getZ();
      return Math.sqrt(x * x + y * y + z * z);
    }
    return 0;
  }
}
