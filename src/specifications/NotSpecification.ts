import { CompositeSpecification } from './CompositeSpecification.js';
import { Specification } from './Specification.js';

/**
 * NOT specification negating another specification.
 */
export class NotSpecification<T> extends CompositeSpecification<T> {
  private readonly spec: Specification<T>;

  constructor(spec: Specification<T>) {
    super();
    this.spec = spec;
  }

  public isSatisfiedBy(item: T): boolean {
    return !this.spec.isSatisfiedBy(item);
  }
}
