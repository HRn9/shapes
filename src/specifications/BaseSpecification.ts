import { CompositeSpecification } from './CompositeSpecification.js';

/**
 * Base class for specifications providing default implementations.
 * @template T - The type of objects to filter
 */
export abstract class BaseSpecification<T> extends CompositeSpecification<T> {
  public abstract isSatisfiedBy(item: T): boolean;
}
