/**
 * Comparator interface for comparing objects.
 * Used for sorting collections.
 * @template T - The type of objects to compare
 */
export interface Comparator<T> {
  /**
   * Compares two objects.
   * @param a - First object
   * @param b - Second object
   * @returns Negative number if a < b, positive if a > b, 0 if a === b
   */
  compare(a: T, b: T): number;
}
