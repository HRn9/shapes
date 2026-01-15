import { CompositeSpecification } from './CompositeSpecification.js';
import { Specification } from './Specification.js';

/**
 * AND specification combining two specifications.
 */
export class AndSpecification<T> extends CompositeSpecification<T> {
  private readonly spec1: Specification<T>;
  private readonly spec2: Specification<T>;

  constructor(spec1: Specification<T>, spec2: Specification<T>) {
    super();
    this.spec1 = spec1;
    this.spec2 = spec2;
  }

  public isSatisfiedBy(item: T): boolean {
    return this.spec1.isSatisfiedBy(item) && this.spec2.isSatisfiedBy(item);
  }
}
