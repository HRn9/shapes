import { Observer } from './Observer.js';

/**
 * Observable interface for the Observer pattern.
 * Implemented by classes that need to notify observers of changes.
 */
export interface Observable {
  /**
   * Adds an observer to the list of observers.
   * @param observer - The observer to add
   */
  addObserver(observer: Observer): void;

  /**
   * Removes an observer from the list of observers.
   * @param observer - The observer to remove
   */
  removeObserver(observer: Observer): void;

  /**
   * Notifies all observers of a change.
   */
  notifyObservers(): void;
}
