/**
 * Specification interface for the Specification pattern.
 * Used to encapsulate business rules for filtering objects.
 * @template T - The type of objects to filter
 */
export interface Specification<T> {
  /**
   * Checks if an item satisfies the specification.
   * @param item - The item to check
   * @returns True if the item satisfies the specification
   */
  isSatisfiedBy(item: T): boolean;

  /**
   * Combines this specification with another using AND logic.
   * @param other - Another specification
   * @returns A new specification that is satisfied when both are satisfied
   */
  and(other: Specification<T>): Specification<T>;

  /**
   * Combines this specification with another using OR logic.
   * @param other - Another specification
   * @returns A new specification that is satisfied when either is satisfied
   */
  or(other: Specification<T>): Specification<T>;

  /**
   * Negates this specification.
   * @returns A new specification that is satisfied when this is not satisfied
   */
  not(): Specification<T>;
}
