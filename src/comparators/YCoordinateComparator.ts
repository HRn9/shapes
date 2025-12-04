import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { Comparator } from './Comparator.js';

/**
 * Comparator for sorting shapes by Y coordinate of the first point.
 */
export class YCoordinateComparator implements Comparator<Shape> {
  private reversed: boolean = false;

  /**
   * Sets whether the comparison should be reversed.
   * @param reversed - True for descending order, false for ascending
   */
  public setReversed(reversed: boolean): void {
    this.reversed = reversed;
  }

  /**
   * Compares two shapes by Y coordinate of their first point.
   * @param a - First shape
   * @param b - Second shape
   * @returns Comparison result
   */
  public compare(a: Shape, b: Shape): number {
    const yA = this.getFirstPointY(a);
    const yB = this.getFirstPointY(b);
    const result = yA - yB;
    return this.reversed ? -result : result;
  }

  /**
   * Gets the Y coordinate of the first point of a shape.
   * @param shape - The shape
   * @returns Y coordinate
   */
  private getFirstPointY(shape: Shape): number {
    if (shape instanceof Oval) {
      return shape.getPoint1().getY();
    }
    if (shape instanceof Tetrahedron) {
      return shape.getVertex1().getY();
    }
    return 0;
  }
}
