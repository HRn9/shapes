import { Shape } from '../entities/Shape.js';
import { BaseSpecification } from './BaseSpecification.js';

/**
 * Specification for finding shapes by ID.
 */
export class IdSpecification extends BaseSpecification<Shape> {
  private readonly id: string;

  /**
   * Creates a new ID specification.
   * @param id - The ID to search for
   */
  constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Checks if a shape has the specified ID.
   * @param shape - The shape to check
   * @returns True if the shape's ID matches
   */
  public isSatisfiedBy(shape: Shape): boolean {
    return shape.getId() === this.id;
  }
}
