/**
 * Resource interface for the resource pool.
 * Defines basic operations for all resources in the pool.
 */
export interface Resource {
  /**
   * Get the resource identifier
   */
  getId(): string;

  /**
   * Check if the resource is available
   */
  isAvailable(): boolean;

  /**
   * Acquire the resource
   */
  acquire(): void;

  /**
   * Release the resource
   */
  release(): void;

  /**
   * Check if the resource is acquired
   */
  isAcquired(): boolean;

  /**
   * Get the last used time
   */
  getLastUsedTime(): Date;

  /**
   * Update the last used time
   */
  updateLastUsedTime(): void;

  /**
   * Get the resource name
   */
  getName(): string;

  /**
   * Check if the resource is a point
   */
  isPoint(): boolean;

  /**
   * Get the point (if the resource is a point)
   */
  getPoint(): { getX(): number; getY(): number; getZ(): number } | null;

  /**
   * Check if the resource is a shape
   */
  isShape(): boolean;

  /**
   * Get the shape (if the resource is a shape)
   */
  getShape(): { getId(): string; getName(): string } | null;

  /**
   * Get the original resource
   */
  getOriginalResource(): unknown;
}
