import { Specification } from './Specification.js';

/**
 * Base class for specifications providing default implementations.
 * @template T - The type of objects to filter
 */
/* eslint-disable max-classes-per-file */
export abstract class BaseSpecification<T> implements Specification<T> {
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

/**
 * AND specification combining two specifications.
 */
class AndSpecification<T> extends BaseSpecification<T> {
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

/**
 * OR specification combining two specifications.
 */
class OrSpecification<T> extends BaseSpecification<T> {
  private readonly spec1: Specification<T>;
  private readonly spec2: Specification<T>;

  constructor(spec1: Specification<T>, spec2: Specification<T>) {
    super();
    this.spec1 = spec1;
    this.spec2 = spec2;
  }

  public isSatisfiedBy(item: T): boolean {
    return this.spec1.isSatisfiedBy(item) || this.spec2.isSatisfiedBy(item);
  }
}

/**
 * NOT specification negating another specification.
 */
class NotSpecification<T> extends BaseSpecification<T> {
  private readonly spec: Specification<T>;

  constructor(spec: Specification<T>) {
    super();
    this.spec = spec;
  }

  public isSatisfiedBy(item: T): boolean {
    return !this.spec.isSatisfiedBy(item);
  }
}
