import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { Comparator } from './Comparator.js';

/**
 * Comparator for sorting shapes by X coordinate of the first point.
 */
export class XCoordinateComparator implements Comparator<Shape> {
  private reversed: boolean = false;

  /**
   * Sets whether the comparison should be reversed.
   * @param reversed - True for descending order, false for ascending
   */
  public setReversed(reversed: boolean): void {
    this.reversed = reversed;
  }

  /**
   * Compares two shapes by X coordinate of their first point.
   * @param a - First shape
   * @param b - Second shape
   * @returns Comparison result
   */
  public compare(a: Shape, b: Shape): number {
    const xA = this.getFirstPointX(a);
    const xB = this.getFirstPointX(b);
    const result = xA - xB;
    return this.reversed ? -result : result;
  }

  /**
   * Gets the X coordinate of the first point of a shape.
   * @param shape - The shape
   * @returns X coordinate
   */
  private getFirstPointX(shape: Shape): number {
    if (shape instanceof Oval) {
      return shape.getPoint1().getX();
    }
    if (shape instanceof Tetrahedron) {
      return shape.getVertex1().getX();
    }
    return 0;
  }
}
