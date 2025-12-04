import { Shape } from '../entities/Shape.js';
import { BaseSpecification } from './BaseSpecification.js';

/**
 * Specification for finding shapes by name.
 * Supports exact match and partial match.
 */
export class NameSpecification extends BaseSpecification<Shape> {
  private readonly name: string;
  private readonly exactMatch: boolean;

  /**
   * Creates a new name specification.
   * @param name - The name to search for
   * @param exactMatch - If true, requires exact match; if false, allows partial match
   */
  constructor(name: string, exactMatch: boolean = true) {
    super();
    this.name = name;
    this.exactMatch = exactMatch;
  }

  /**
   * Checks if a shape's name matches the specification.
   * @param shape - The shape to check
   * @returns True if the shape's name matches
   */
  public isSatisfiedBy(shape: Shape): boolean {
    if (this.exactMatch) {
      return shape.getName() === this.name;
    }
    return shape.getName().toLowerCase().includes(this.name.toLowerCase());
  }
}
