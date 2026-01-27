import { Resource } from './Resource.js';
import { Point3D } from '../types/index.js';
import { Shape } from '../entities/Shape.js';

/**
 * Adapter for converting different resource types to unified Resource interface.
 * Allows using heterogeneous resources in a single pool.
 */
export class ResourceAdapter implements Resource {
  private id: string;
  private name: string;
  private isAcquiredStatus: boolean = false;
  private lastUsedTime: Date;
  private originalResource: unknown;

  constructor(id: string, name: string, originalResource: unknown) {
    this.id = id;
    this.name = name;
    this.originalResource = originalResource;
    this.lastUsedTime = new Date();
  }

  /**
   * Get the resource identifier
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Check if the resource is available
   */
  public isAvailable(): boolean {
    return !this.isAcquiredStatus;
  }

  /**
   * Acquire the resource
   */
  public acquire(): void {
    this.isAcquiredStatus = true;
    this.updateLastUsedTime();
  }

  /**
   * Release the resource
   */
  public release(): void {
    this.isAcquiredStatus = false;
    this.updateLastUsedTime();
  }

  /**
   * Check if the resource is acquired
   */
  public isAcquired(): boolean {
    return this.isAcquiredStatus;
  }

  /**
   * Get the last used time
   */
  public getLastUsedTime(): Date {
    return this.lastUsedTime;
  }

  /**
   * Update the last used time
   */
  public updateLastUsedTime(): void {
    this.lastUsedTime = new Date();
  }

  /**
   * Get the original resource
   */
  public getOriginalResource(): unknown {
    return this.originalResource;
  }

  /**
   * Get the resource name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Check if the original resource is a point
   */
  public isPoint(): boolean {
    const point = this.originalResource as Point3D;
    return point && typeof point.getX === 'function'
           && typeof point.getY === 'function'
           && typeof point.getZ === 'function';
  }

  /**
   * Get the point from the original resource
   */
  public getPoint(): Point3D | null {
    if (this.isPoint()) {
      return this.originalResource as Point3D;
    }
    return null;
  }

  /**
   * Check if the original resource is a shape
   */
  public isShape(): boolean {
    const shape = this.originalResource as Shape;
    return shape && typeof shape.getId === 'function'
           && typeof shape.getName === 'function';
  }

  /**
   * Get the shape from the original resource
   */
  public getShape(): { getId(): string; getName(): string } | null {
    if (this.isShape()) {
      return this.originalResource as { getId(): string; getName(): string };
    }
    return null;
  }
}
