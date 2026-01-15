import { Specification } from './Specification.js';
import { AndSpecification } from './AndSpecification.js';
import { OrSpecification } from './OrSpecification.js';
import { NotSpecification } from './NotSpecification.js';

/**
 * Base class for specifications providing default implementations.
 * @template T - The type of objects to filter
 */
export abstract class CompositeSpecification<T> implements Specification<T> {
  public and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  public or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  public not(): Specification<T> {
    return new NotSpecification(this);
  }

  public abstract isSatisfiedBy(item: T): boolean;
}
