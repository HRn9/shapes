import { ResourceAdapter } from './ResourceAdapter.js';
import { Point3D } from '../types/index.js';
import { Shape } from '../entities/Shape.js';

/**
 * Factory for creating adapted resources
 */
export class ResourceAdapterFactory {
  /**
   * Create an adapted resource from a point
   */
  public static createFromPoint(point: Point3D, id?: string): ResourceAdapter {
    const resourceId = id || `point-${point.getX()}-${point.getY()}-${point.getZ()}`;
    return new ResourceAdapter(resourceId, 'Point Resource', point);
  }

  /**
   * Create an adapted resource from a shape
   */
  public static createFromShape(shape: Shape, id?: string): ResourceAdapter {
    const resourceId = id || shape.getId();
    return new ResourceAdapter(resourceId, `${shape.getName()} Resource`, shape);
  }

  /**
   * Create an adapted resource from an arbitrary object
   */
  public static createFromObject(obj: unknown, id: string, name: string): ResourceAdapter {
    return new ResourceAdapter(id, name, obj);
  }
}
