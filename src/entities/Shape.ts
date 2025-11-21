/**
 * Abstract Shape base class.
 * All shapes must extend this class and contain an identifier.
 * Contains only data, no business logic.
 */
export abstract class Shape {
  private readonly id: string;
  private readonly name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public abstract toString(): string;
}
