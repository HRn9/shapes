import { Resource } from './Resource.js';
import { Observable } from '../observers/Observable.js';
import { Observer } from '../observers/Observer.js';

/**
 * Resource pool class implementing Singleton pattern.
 * Manages a collection of resources, provides allocation and release.
 */
export class ResourcePool implements Observable {
  private static instance: ResourcePool | null = null;
  private resources: Map<string, Resource> = new Map();
  private observers: Observer[] = [];
  private maxPoolSize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor(maxPoolSize: number = 100) {
    this.maxPoolSize = maxPoolSize;
    this.startCleanupProcess();
  }

  /**
   * Get the singleton instance of the resource pool
   */
  public static getInstance(maxPoolSize?: number): ResourcePool {
    if (!ResourcePool.instance) {
      ResourcePool.instance = new ResourcePool(maxPoolSize);
    }
    return ResourcePool.instance;
  }

  /**
   * Add a resource to the pool
   */
  public addResource(resource: Resource): void {
    if (this.resources.size >= this.maxPoolSize) {
      throw new Error('Resource pool is full');
    }

    this.resources.set(resource.getId(), resource);
    this.notifyObservers();
  }

  /**
   * Get an available resource from the pool
   */
  public acquireResource(): Resource | null {
    for (const resource of this.resources.values()) {
      if (resource.isAvailable()) {
        resource.acquire();
        resource.updateLastUsedTime();
        this.notifyObservers();
        return resource;
      }
    }
    return null;
  }

  /**
   * Release a resource and return it to the pool
   */
  public releaseResource(resource: Resource): void {
    if (this.resources.has(resource.getId())) {
      resource.release();
      this.notifyObservers();
    }
  }

  /**
   * Remove a resource from the pool
   */
  public removeResource(resourceId: string): boolean {
    const resource = this.resources.get(resourceId);
    if (resource && !resource.isAcquired()) {
      this.resources.delete(resourceId);
      this.notifyObservers();
      return true;
    }
    return false;
  }

  /**
   * Get all resources
   */
  public getAllResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  /**
   * Get available resources
   */
  public getAvailableResources(): Resource[] {
    return Array.from(this.resources.values()).filter((resource) => resource.isAvailable());
  }

  /**
   * Get acquired resources
   */
  public getAcquiredResources(): Resource[] {
    return Array.from(this.resources.values()).filter((resource) => resource.isAcquired());
  }

  /**
   * Get the pool size
   */
  public getPoolSize(): number {
    return this.resources.size;
  }

  /**
   * Get the count of available resources
   */
  public getAvailableCount(): number {
    return this.getAvailableResources().length;
  }

  /**
   * Get the count of acquired resources
   */
  public getAcquiredCount(): number {
    return this.getAcquiredResources().length;
  }

  /**
   * Check if the pool is empty
   */
  public isEmpty(): boolean {
    return this.resources.size === 0;
  }

  /**
   * Check if the pool is full
   */
  public isFull(): boolean {
    return this.resources.size >= this.maxPoolSize;
  }

  /**
   * Clear the pool (remove all resources)
   */
  public clear(): void {
    this.resources.clear();
    this.notifyObservers();
  }

  /**
   * Set the maximum pool size
   */
  public setMaxPoolSize(size: number): void {
    this.maxPoolSize = size;
    this.notifyObservers();
  }

  /**
   * Start the automatic cleanup process
   */
  private startCleanupProcess(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  /**
   * Stop the automatic cleanup process
   */
  private stopCleanupProcess(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Cleanup the pool from unused resources
   */
  private cleanup(): void {
    const now = new Date();
    const timeout = 5 * 60 * 1000; // 5 minutes timeout

    for (const resource of this.resources.values()) {
      if (!resource.isAcquired() && (now.getTime() - resource.getLastUsedTime().getTime()) > timeout) {
        this.resources.delete(resource.getId());
      }
    }

    if (this.resources.size === 0) {
      this.stopCleanupProcess();
    }
  }

  /**
   * Implementation of Observable interface
   */
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

  /**
   * Destroy the instance (for testing)
   */
  public static destroyInstance(): void {
    if (ResourcePool.instance?.cleanupInterval) {
      clearInterval(ResourcePool.instance.cleanupInterval);
    }
    ResourcePool.instance = null;
  }
}
