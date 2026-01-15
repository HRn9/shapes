import { Observable } from '../observers/Observable.js';
import { Observer } from '../observers/Observer.js';
import { Visitor } from '../visitors/Visitor.js';

/**
 * Abstract Shape base class.
 * All shapes must extend this class and contain an identifier.
 * Contains only data, no business logic.
 * Implements Observable pattern to notify observers (e.g., Warehouse) of changes.
 */
export abstract class Shape implements Observable {
  private readonly id: string;
  private readonly name: string;
  private readonly observers: Observer[] = [];

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

  public addObserver(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update(this);
    });
  }

  public abstract toString(): string;

  /**
   * Method for Visitor pattern - allows visitor to visit the shape
   * @param visitor - visitor to visit the shape
   */
  public abstract accept(visitor: Visitor): void;
}
