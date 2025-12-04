import { Shape } from '../entities/Shape.js';
import { Comparator } from './Comparator.js';

/**
 * Comparator for sorting shapes by ID.
 */
export class IdComparator implements Comparator<Shape> {
  private reversed: boolean = false;

  /**
   * Sets whether the comparison should be reversed.
   * @param reversed - True for descending order, false for ascending
   */
  public setReversed(reversed: boolean): void {
    this.reversed = reversed;
  }

  /**
   * Compares two shapes by their ID.
   * @param a - First shape
   * @param b - Second shape
   * @returns Comparison result
   */
  public compare(a: Shape, b: Shape): number {
    const result = a.getId().localeCompare(b.getId());
    return this.reversed ? -result : result;
  }
}
