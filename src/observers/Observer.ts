/**
 * Observer interface for the Observer pattern.
 * Implemented by classes that need to be notified of changes in observable objects.
 */
export interface Observer {
  /**
   * Called when the observed object changes.
   * @param observable - The object that changed
   */
  update(observable: unknown): void;
}
