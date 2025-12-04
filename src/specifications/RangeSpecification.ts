import { Shape } from '../entities/Shape.js';
import { BaseSpecification } from './BaseSpecification.js';

/**
 * Specification for finding shapes whose calculated metric is within a range.
 * Used for finding shapes by area, volume, perimeter, etc.
 */
export class RangeSpecification extends BaseSpecification<Shape> {
  private readonly metricCalculator: (shape: Shape) => number;
  private readonly minValue: number;
  private readonly maxValue: number;

  /**
   * Creates a new range specification.
   * @param metricCalculator - Function that calculates the metric for a shape
   * @param minValue - Minimum value (inclusive)
   * @param maxValue - Maximum value (inclusive)
   */
  constructor(
    metricCalculator: (shape: Shape) => number,
    minValue: number,
    maxValue: number,
  ) {
    super();
    this.metricCalculator = metricCalculator;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  /**
   * Checks if a shape's metric is within the specified range.
   * @param shape - The shape to check
   * @returns True if the shape's metric is within the range
   */
  public isSatisfiedBy(shape: Shape): boolean {
    try {
      const metric = this.metricCalculator(shape);
      return metric >= this.minValue && metric <= this.maxValue;
    } catch (error) {
      // If calculation fails, the shape doesn't satisfy the specification
      return false;
    }
  }
}
