import { Shape } from '../entities/Shape.js';
import { Comparator } from './Comparator.js';

/**
 * Comparator for sorting shapes by name.
 */
export class NameComparator implements Comparator<Shape> {
  private reversed: boolean = false;

  /**
   * Sets whether the comparison should be reversed.
   * @param reversed - True for descending order, false for ascending
   */
  public setReversed(reversed: boolean): void {
    this.reversed = reversed;
  }

  /**
   * Compares two shapes by their name.
   * @param a - First shape
   * @param b - Second shape
   * @returns Comparison result
   */
  public compare(a: Shape, b: Shape): number {
    const result = a.getName().localeCompare(b.getName());
    return this.reversed ? -result : result;
  }
}
