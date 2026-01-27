import { ResourcePool } from '../../src/pool/ResourcePool.js';
import { ResourceAdapterFactory } from '../../src/pool/ResourceAdapterFactory.js';
import { Point3D } from '../../src/types/index.js';

describe('ResourcePool', () => {
  let pool: ResourcePool;

  beforeEach(() => {
    ResourcePool.destroyInstance();
    pool = ResourcePool.getInstance(5);
  });

  afterEach(() => {
    ResourcePool.destroyInstance();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const pool1 = ResourcePool.getInstance();
      const pool2 = ResourcePool.getInstance();
      expect(pool1).toBe(pool2);
    });

    it('should allow setting custom max pool size', () => {
      const customPool = ResourcePool.getInstance(10);
      expect(customPool).toBe(pool);
    });
  });

  describe('Resource management', () => {
    it('should add resource to pool', () => {
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      
      expect(pool.getPoolSize()).toBe(1);
      expect(pool.getAvailableCount()).toBe(1);
    });

    it('should not allow adding more resources than max pool size', () => {
      const resources = Array.from({ length: 6 }, (_, i) => 
        ResourceAdapterFactory.createFromObject({}, `resource-${i}`, `Resource ${i}`)
      );

      resources.slice(0, 5).forEach(resource => pool.addResource(resource));
      
      expect(() => pool.addResource(resources[5])).toThrow('Resource pool is full');
    });

    it('should acquire available resource', () => {
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      
      const acquired = pool.acquireResource();
      
      expect(acquired).toBe(resource);
      expect(pool.getAvailableCount()).toBe(0);
      expect(pool.getAcquiredCount()).toBe(1);
    });

    it('should return null when no resources available', () => {
      const acquired = pool.acquireResource();
      expect(acquired).toBeNull();
    });

    it('should release resource back to pool', () => {
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      pool.acquireResource();
      
      pool.releaseResource(resource);
      
      expect(pool.getAvailableCount()).toBe(1);
      expect(pool.getAcquiredCount()).toBe(0);
    });

    it('should remove resource from pool', () => {
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      
      const removed = pool.removeResource('test-resource');
      
      expect(removed).toBe(true);
      expect(pool.getPoolSize()).toBe(0);
    });

    it('should not remove acquired resource', () => {
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      pool.acquireResource();
      
      const removed = pool.removeResource('test-resource');
      
      expect(removed).toBe(false);
      expect(pool.getPoolSize()).toBe(1);
    });
  });

  describe('Resource queries', () => {
    beforeEach(() => {
      const resources = Array.from({ length: 3 }, (_, i) => 
        ResourceAdapterFactory.createFromObject({}, `resource-${i}`, `Resource ${i}`)
      );
      
      resources.forEach(resource => pool.addResource(resource));
      pool.acquireResource();
    });

    it('should get all resources', () => {
      const allResources = pool.getAllResources();
      expect(allResources).toHaveLength(3);
    });

    it('should get available resources', () => {
      const available = pool.getAvailableResources();
      expect(available).toHaveLength(2);
    });

    it('should get acquired resources', () => {
      const acquired = pool.getAcquiredResources();
      expect(acquired).toHaveLength(1);
    });

    it('should check if pool is empty', () => {
      expect(pool.isEmpty()).toBe(false);
      
      pool.clear();
      expect(pool.isEmpty()).toBe(true);
    });

    it('should check if pool is full', () => {
      expect(pool.isFull()).toBe(false);
      
      const resources = Array.from({ length: 2 }, (_, i) => 
        ResourceAdapterFactory.createFromObject({}, `additional-resource-${i}`, `Additional Resource ${i}`)
      );
      
      resources.forEach(resource => pool.addResource(resource));
      pool.acquireResource();
      
      expect(pool.isFull()).toBe(true);
    });
  });

  describe('Pool operations', () => {
    it('should clear all resources', () => {
      const resources = Array.from({ length: 3 }, (_, i) => 
        ResourceAdapterFactory.createFromObject({}, `resource-${i}`, `Resource ${i}`)
      );
      
      resources.forEach(resource => pool.addResource(resource));
      
      pool.clear();
      
      expect(pool.getPoolSize()).toBe(0);
      expect(pool.isEmpty()).toBe(true);
    });

    it('should update max pool size', () => {
      pool.setMaxPoolSize(10);
      
      const resources = Array.from({ length: 8 }, (_, i) => 
        ResourceAdapterFactory.createFromObject({}, `resource-${i}`, `Resource ${i}`)
      );
      
      expect(() => resources.forEach(resource => pool.addResource(resource))).not.toThrow();
      expect(pool.getPoolSize()).toBe(8);
    });
  });

  describe('Observer pattern', () => {
    it('should notify observers on resource changes', () => {
      const observer = {
        update: jest.fn()
      };
      
      pool.addObserver(observer);
      
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      
      expect(observer.update).toHaveBeenCalledWith(pool);
    });

    it('should not notify removed observers', () => {
      const observer = {
        update: jest.fn()
      };
      
      pool.addObserver(observer);
      pool.removeObserver(observer);
      
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      pool.addResource(resource);
      
      expect(observer.update).not.toHaveBeenCalled();
    });
  });

  describe('ResourceAdapter', () => {
    it('should create resource from point', () => {
      const point: Point3D = {
        getX: () => 1,
        getY: () => 2,
        getZ: () => 3
      };
      
      const resource = ResourceAdapterFactory.createFromPoint(point);
      
      expect(resource.getId()).toBe('point-1-2-3');
      expect(resource.getName()).toBe('Point Resource');
      expect(resource.isPoint()).toBe(true);
      expect(resource.getPoint()).toBe(point);
    });

    it('should create resource from shape-like object', () => {
      const shape = {
        getId: () => 'shape-1',
        getName: () => 'Test Shape'
      };
      
      const resource = ResourceAdapterFactory.createFromShape(shape as any);
      
      expect(resource.getId()).toBe('shape-1');
      expect(resource.getName()).toBe('Test Shape Resource');
      expect(resource.isShape()).toBe(true);
      expect(resource.getShape()).toBe(shape);
    });

    it('should create resource from arbitrary object', () => {
      const obj = { data: 'test' };
      
      const resource = ResourceAdapterFactory.createFromObject(obj, 'custom-id', 'Custom Resource');
      
      expect(resource.getId()).toBe('custom-id');
      expect(resource.getName()).toBe('Custom Resource');
      expect(resource.getOriginalResource()).toBe(obj);
    });

    it('should handle resource lifecycle', () => {
      const resource = ResourceAdapterFactory.createFromObject({}, 'test-resource', 'Test Resource');
      
      expect(resource.isAvailable()).toBe(true);
      expect(resource.isAcquired()).toBe(false);
      
      resource.acquire();
      
      expect(resource.isAvailable()).toBe(false);
      expect(resource.isAcquired()).toBe(true);
      
      resource.release();
      
      expect(resource.isAvailable()).toBe(true);
      expect(resource.isAcquired()).toBe(false);
    });
  });
});