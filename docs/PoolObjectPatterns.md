# Pool Object Patterns Documentation

## Overview

This document describes the implementation of a Pool Object using three design patterns: Singleton, Adapter, and Observer. The Pool Object manages a collection of resources, provides compatibility with different interfaces, and notifies clients about resource availability.

## Design Patterns Used

### 1. Singleton Pattern

**Purpose**: Ensures that only one instance of the resource pool exists throughout the application.

**Implementation**: 
- `ResourcePool` class implements the Singleton pattern
- Static method `getInstance()` returns the single instance
- Constructor is private to prevent direct instantiation
- Supports custom maximum pool size

**Benefits**:
- Global access point to the resource pool
- Prevents resource duplication
- Ensures consistent state across the application

### 2. Adapter Pattern

**Purpose**: Converts different types of resources to a unified interface for use in the resource pool.

**Implementation**:
- `ResourceAdapter` class implements the `Resource` interface
- `ResourceAdapterFactory` provides static methods to create adapted resources
- Supports conversion from Points, Shapes, and arbitrary objects

**Benefits**:
- Enables heterogeneous resource types in a single pool
- Provides consistent interface for different resource types
- Facilitates resource reuse and management

### 3. Observer Pattern

**Purpose**: Notifies clients when the state of the resource pool changes.

**Implementation**:
- `ResourcePool` implements the `Observable` interface
- Clients can subscribe as observers to receive notifications
- Notifications are sent on resource addition, acquisition, and release

**Benefits**:
- Loose coupling between pool and observers
- Real-time updates about resource availability
- Supports multiple observers simultaneously

## Architecture

### Core Components

1. **Resource Interface** (`src/pool/Resource.ts`)
   - Defines the contract for all resources in the pool
   - Methods: `getId()`, `isAvailable()`, `acquire()`, `release()`, `isAcquired()`, `getLastUsedTime()`, `updateLastUsedTime()`

2. **ResourcePool Class** (`src/pool/ResourcePool.ts`)
   - Singleton implementation for resource management
   - Manages resource lifecycle (add, acquire, release, remove)
   - Implements Observer pattern for notifications
   - Automatic cleanup of unused resources

3. **ResourceAdapter Class** (`src/pool/ResourceAdapter.ts`)
   - Adapts different object types to the Resource interface
   - Wraps original objects while providing unified access
   - Supports type checking and conversion

4. **ResourceAdapterFactory Class** (`src/pool/ResourceAdapterFactory.ts`)
   - Factory methods for creating adapted resources
   - Methods: `createFromPoint()`, `createFromShape()`, `createFromObject()`

### Usage Example

```typescript
import { ResourcePool, ResourceAdapterFactory } from './pool';
import { Point } from './entities/Point';
import { Oval } from './entities/Oval';

// Get the singleton instance
const pool = ResourcePool.getInstance(10);

// Create resources from different types
const point = new Point(1, 2, 3);
const oval = new Oval('oval-1', 'Test Oval', point1, point2);

const pointResource = ResourceAdapterFactory.createFromPoint(point);
const ovalResource = ResourceAdapterFactory.createFromShape(oval);

// Add resources to pool
pool.addResource(pointResource);
pool.addResource(ovalResource);

// Acquire resources
const resource = pool.acquireResource();

// Work with the resource
if (resource) {
  console.log(`Using resource: ${resource.getName()}`);
  // ... use the resource
}

// Release resource back to pool
pool.releaseResource(resource);
```

## Features

### Resource Management
- **Add Resources**: Add new resources to the pool
- **Acquire Resources**: Get available resources for use
- **Release Resources**: Return used resources to the pool
- **Remove Resources**: Remove resources from the pool
- **Pool Queries**: Get information about pool state and resources

### Automatic Cleanup
- Background process removes unused resources after timeout
- Configurable cleanup interval and timeout
- Automatic process termination when pool is empty

### Observer Support
- Subscribe to pool state changes
- Real-time notifications for resource operations
- Multiple observers supported

### Resource Types
- **Point Resources**: 3D points converted to resources
- **Shape Resources**: Geometric shapes as resources
- **Custom Resources**: Arbitrary objects wrapped as resources

## Testing

Comprehensive test suite available in `tests/pool/ResourcePool.test.ts`:

- Singleton pattern verification
- Resource management operations
- Pool state queries
- Observer pattern functionality
- Adapter pattern with different resource types

Run tests with:
```bash
npm test -- tests/pool/ResourcePool.test.ts
```

## Example Usage

See `src/examples/PoolObjectExample.ts` for a complete demonstration:

- Pool initialization and configuration
- Resource creation and management
- Observer pattern usage
- Integration with existing shape entities
- Automatic cleanup demonstration

## Integration

The Pool Object integrates seamlessly with the existing codebase:

- Uses existing `Observable` and `Observer` interfaces
- Compatible with existing shape entities (Oval, Tetrahedron)
- Follows established coding patterns and conventions
- Supports TypeScript type safety

## Benefits

1. **Resource Efficiency**: Reuse expensive resources instead of creating new ones
2. **Memory Management**: Automatic cleanup prevents memory leaks
3. **Type Safety**: Strong typing with TypeScript support
4. **Flexibility**: Support for different resource types through Adapter pattern
5. **Scalability**: Singleton pattern ensures consistent resource management
6. **Real-time Updates**: Observer pattern provides immediate notifications

## Future Enhancements

Potential improvements for the Pool Object:

1. **Resource Validation**: Add validation for resource quality and state
2. **Priority Queuing**: Support for priority-based resource allocation
3. **Resource Metrics**: Collect and report usage statistics
4. **Distributed Pools**: Support for distributed resource pools
5. **Resource Pools**: Specialized pools for specific resource types

## Conclusion

The Pool Object implementation demonstrates effective use of Singleton, Adapter, and Observer patterns to create a robust resource management system. It provides a foundation for efficient resource utilization while maintaining code quality and extensibility.
