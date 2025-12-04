import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { BaseSpecification } from './BaseSpecification.js';

/**
 * Specification for finding shapes whose points are in a specific quadrant.
 * Quadrants:
 * - 1: x > 0, y > 0
 * - 2: x < 0, y > 0
 * - 3: x < 0, y < 0
 * - 4: x > 0, y < 0
 */
export class QuadrantSpecification extends BaseSpecification<Shape> {
  private readonly quadrant: number;

  /**
   * Creates a new quadrant specification.
   * @param quadrant - The quadrant number (1, 2, 3, or 4)
   * @throws Error if quadrant is not 1, 2, 3, or 4
   */
  constructor(quadrant: number) {
    super();
    if (quadrant < 1 || quadrant > 4) {
      throw new Error(`Invalid quadrant: ${quadrant}. Must be 1, 2, 3, or 4`);
    }
    this.quadrant = quadrant;
  }

  /**
   * Checks if a shape's points are in the specified quadrant.
   * @param shape - The shape to check
   * @returns True if the shape's points are in the specified quadrant
   */
  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Oval) {
      return this.checkOvalQuadrant(shape);
    }
    if (shape instanceof Tetrahedron) {
      return this.checkTetrahedronQuadrant(shape);
    }
    return false;
  }

  /**
   * Checks if an oval's points are in the specified quadrant.
   * @param oval - The oval to check
   * @returns True if the oval's points are in the specified quadrant
   */
  private checkOvalQuadrant(oval: Oval): boolean {
    const point1 = oval.getPoint1();
    const point2 = oval.getPoint2();

    return (
      this.isPointInQuadrant(point1.getX(), point1.getY())
      && this.isPointInQuadrant(point2.getX(), point2.getY())
    );
  }

  /**
   * Checks if a tetrahedron's vertices are in the specified quadrant.
   * @param tetrahedron - The tetrahedron to check
   * @returns True if all vertices are in the specified quadrant
   */
  private checkTetrahedronQuadrant(tetrahedron: Tetrahedron): boolean {
    const vertices = tetrahedron.getVertices();
    return vertices.every((vertex) => this.isPointInQuadrant(
      vertex.getX(),
      vertex.getY(),
    ));
  }

  /**
   * Checks if a point (x, y) is in the specified quadrant.
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns True if the point is in the specified quadrant
   */
  private isPointInQuadrant(x: number, y: number): boolean {
    switch (this.quadrant) {
      case 1:
        return x > 0 && y > 0;
      case 2:
        return x < 0 && y > 0;
      case 3:
        return x < 0 && y < 0;
      case 4:
        return x > 0 && y < 0;
      default:
        return false;
    }
  }
}
