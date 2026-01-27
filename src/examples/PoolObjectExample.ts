import { ResourcePool } from '../pool/ResourcePool.js';
import { ResourceAdapterFactory } from '../pool/ResourceAdapterFactory.js';
import { Resource } from '../pool/Resource.js';
import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { Point } from '../entities/Point.js';

/**
 * Example of using Pool Object with Singleton, Adapter, and Observer patterns
 */
export class PoolObjectExample {
  private pool: ResourcePool;
  private observer: {
    update: (observable: unknown) => void;
  };

  constructor() {
    // Get the singleton instance of the resource pool (Singleton)
    this.pool = ResourcePool.getInstance(10);

    // Create an observer to track changes in the pool (Observer)
    this.observer = {
      update: (): void => {
        console.log('Pool state changed:', {
          poolSize: this.pool.getPoolSize(),
          availableCount: this.pool.getAvailableCount(),
          acquiredCount: this.pool.getAcquiredCount(),
        });
      },
    };

    // Subscribe to pool changes
    this.pool.addObserver(this.observer);
  }

  /**
   * Demonstrate using the pool with different types of resources
   */
  public demonstratePoolUsage(): void {
    console.log('=== Pool Object Example ===\n');

    // Create different types of resources using adapters (Adapter)
    const point1 = new Point(1, 2, 3);
    const point2 = new Point(4, 5, 6);

    const oval = new Oval('oval-1', 'Test Oval', point1, point2);
    const tetrahedron = new Tetrahedron('tetra-1', 'Test Tetrahedron', point1, point2, point1, point2);

    // Convert different objects to a unified Resource interface
    const pointResource = ResourceAdapterFactory.createFromPoint(point1, 'point-resource-1');
    const ovalResource = ResourceAdapterFactory.createFromShape(oval, 'oval-resource-1');
    const tetrahedronResource = ResourceAdapterFactory.createFromShape(tetrahedron, 'tetra-resource-1');

    const customResource = ResourceAdapterFactory.createFromObject(
      { type: 'database-connection', host: 'localhost' },
      'db-connection-1',
      'Database Connection',
    );

    console.log('1. Adding resources to pool:');

    // Add resources to the pool
    this.pool.addResource(pointResource);
    this.pool.addResource(ovalResource);
    this.pool.addResource(tetrahedronResource);
    this.pool.addResource(customResource);

    console.log('\n2. Acquiring resources:');

    // Acquire resources
    const acquired1 = this.pool.acquireResource();
    const acquired2 = this.pool.acquireResource();

    if (acquired1) {
      console.log(`Acquired: ${acquired1.getName()} (${acquired1.getId()})`);
    }

    if (acquired2) {
      console.log(`Acquired: ${acquired2.getName()} (${acquired2.getId()})`);
    }

    console.log('\n3. Pool status after acquisition:');
    console.log(`Available: ${this.pool.getAvailableCount()}, Acquired: ${this.pool.getAcquiredCount()}`);

    console.log('\n4. Working with acquired resources:');

    // Work with resources through the adapter
    if (acquired1) {
      this.workWithResource(acquired1);
    }

    if (acquired2) {
      this.workWithResource(acquired2);
    }

    console.log('\n5. Releasing resources:');

    // Release resources
    if (acquired1) {
      this.pool.releaseResource(acquired1);
      console.log(`Released: ${acquired1.getName()}`);
    }

    if (acquired2) {
      this.pool.releaseResource(acquired2);
      console.log(`Released: ${acquired2.getName()}`);
    }

    console.log('\n6. Pool status after release:');
    console.log(`Available: ${this.pool.getAvailableCount()}, Acquired: ${this.pool.getAcquiredCount()}`);

    console.log('\n7. Demonstrating Singleton pattern:');

    // Show that this is the same instance
    const samePool = ResourcePool.getInstance();
    console.log(`Same instance: ${this.pool === samePool}`);
    console.log(`Pool size: ${this.pool.getPoolSize()}`);

    console.log('\n8. Cleaning up:');

    // Clear the pool
    this.pool.clear();
    console.log('Pool cleared');
  }

  /**
   * Work with a resource depending on its type
   */
  private workWithResource(resource: Resource): void {
    console.log(`Working with ${resource.getName()}:`);

    // Check the resource type and work with it accordingly
    if (resource.isPoint()) {
      const point = resource.getPoint();
      if (point) {
        console.log(`  Point coordinates: (${point.getX()}, ${point.getY()}, ${point.getZ()})`);
      }
    } else if (resource.isShape()) {
      const shape = resource.getShape();
      if (shape) {
        console.log(`  Shape ID: ${shape.getId()}`);
        console.log(`  Shape Name: ${shape.getName()}`);
      }
    } else {
      const original = resource.getOriginalResource();
      console.log('  Original resource:', original);
    }
  }

  /**
   * Demonstrate automatic pool cleanup
   */
  public demonstrateAutoCleanup(): void {
    console.log('\n=== Auto Cleanup Demonstration ===\n');

    // Create temporary resources
    const tempResource1 = ResourceAdapterFactory.createFromObject({}, 'temp-1', 'Temporary Resource 1');
    const tempResource2 = ResourceAdapterFactory.createFromObject({}, 'temp-2', 'Temporary Resource 2');

    this.pool.addResource(tempResource1);
    this.pool.addResource(tempResource2);

    console.log('Added temporary resources');
    console.log(`Pool size: ${this.pool.getPoolSize()}`);

    // Release resources (they will be automatically removed after 5 minutes)
    this.pool.releaseResource(tempResource1);
    this.pool.releaseResource(tempResource2);

    console.log('Released temporary resources');
    console.log('Note: Auto cleanup runs every minute and removes unused resources after 5 minutes');
  }

  /**
   * Demonstrate using the pool with shapes from the system
   */
  public demonstrateWithShapes(): void {
    console.log('\n=== Pool with Shapes Demonstration ===\n');

    // Create shapes
    const point1 = new Point(0, 0, 0);
    const point2 = new Point(10, 5, 0);
    const point3 = new Point(5, 10, 5);
    const point4 = new Point(0, 0, 10);

    const oval = new Oval('shape-1', 'Pool Oval', point1, point2);
    const tetrahedron = new Tetrahedron('shape-2', 'Pool Tetrahedron', point1, point2, point3, point4);

    // Convert shapes to resources
    const ovalResource = ResourceAdapterFactory.createFromShape(oval);
    const tetrahedronResource = ResourceAdapterFactory.createFromShape(tetrahedron);

    console.log('Adding shapes to pool:');
    this.pool.addResource(ovalResource);
    this.pool.addResource(tetrahedronResource);

    console.log('\nAcquiring shape resources:');
    const shapeResource1 = this.pool.acquireResource();
    const shapeResource2 = this.pool.acquireResource();

    if (shapeResource1 && shapeResource1.isShape()) {
      const shape = shapeResource1.getShape() as Shape;
      console.log(`Acquired shape: ${shape.getName()} (${shape.getId()})`);
    }

    if (shapeResource2 && shapeResource2.isShape()) {
      const shape = shapeResource2.getShape() as Shape;
      console.log(`Acquired shape: ${shape.getName()} (${shape.getId()})`);
    }

    // Release resources
    if (shapeResource1) {
      this.pool.releaseResource(shapeResource1);
    }
    if (shapeResource2) {
      this.pool.releaseResource(shapeResource2);
    }

    console.log('\nPool status:');
    console.log(`Available: ${this.pool.getAvailableCount()}, Acquired: ${this.pool.getAcquiredCount()}`);
  }
}

/**
 * Run the example
 */
export function runPoolObjectExample(): void {
  const example = new PoolObjectExample();

  // Demonstrate main usage
  example.demonstratePoolUsage();

  // Demonstrate with shapes
  example.demonstrateWithShapes();

  // Demonstrate auto cleanup
  example.demonstrateAutoCleanup();

  console.log('\n=== Example completed ===');
}
