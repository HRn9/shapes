import { Observer } from '../observers/Observer.js';
import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { ShapeType } from '../factories/ShapeType.js';
import { OvalService } from '../services/OvalService.js';
import { TetrahedronService } from '../services/TetrahedronService.js';
import { logger } from '../utils/Logger.js';

/**
 * Interface for shape metrics stored in Warehouse.
 */
export interface ShapeMetrics {
  shapeId: string;
  shapeType: ShapeType;
  area?: number;
  perimeter?: number;
  volume?: number;
  surfaceArea?: number;
  lastUpdated: Date;
}

/**
 * Warehouse class implementing Singleton pattern.
 * Stores and manages metrics (area, volume, perimeter) for all shapes.
 * Implements Observer pattern to automatically recalculate metrics when shapes change.
 */
export class Warehouse implements Observer {
  private static instance: Warehouse | null = null;
  private readonly metrics: Map<string, ShapeMetrics> = new Map();
  private readonly ovalService: OvalService;
  private readonly tetrahedronService: TetrahedronService;

  /**
   * Private constructor for Singleton pattern.
   */
  private constructor() {
    this.ovalService = new OvalService();
    this.tetrahedronService = new TetrahedronService();
  }

  /**
   * Gets the singleton instance of Warehouse.
   * @returns The Warehouse instance
   */
  public static getInstance(): Warehouse {
    if (Warehouse.instance === null) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  /**
   * Observer pattern: called when a shape changes.
   * Recalculates and updates metrics for the shape.
   * @param observable - The shape that changed
   */
  public update(observable: unknown): void {
    if (!(observable instanceof Shape)) {
      return;
    }

    try {
      this.calculateAndStoreMetrics(observable);
      logger.debug(`Warehouse updated metrics for shape: ${observable.getId()}`);
    } catch (error) {
      logger.error(
        `Failed to update metrics for shape ${observable.getId()}`,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Registers a shape in the warehouse and calculates initial metrics.
   * @param shape - The shape to register
   */
  public registerShape(shape: Shape): void {
    shape.addObserver(this);
    this.calculateAndStoreMetrics(shape);
    logger.debug(`Shape registered in Warehouse: ${shape.getId()}`);
  }

  /**
   * Unregisters a shape from the warehouse.
   * @param shape - The shape to unregister
   */
  public unregisterShape(shape: Shape): void {
    shape.removeObserver(this);
    this.metrics.delete(shape.getId());
    logger.debug(`Shape unregistered from Warehouse: ${shape.getId()}`);
  }

  /**
   * Calculates and stores metrics for a shape.
   * @param shape - The shape to process
   */
  private calculateAndStoreMetrics(shape: Shape): void {
    const metrics: ShapeMetrics = {
      shapeId: shape.getId(),
      shapeType: this.getShapeType(shape),
      lastUpdated: new Date(),
    };

    if (shape instanceof Oval) {
      try {
        metrics.area = this.ovalService.calculateArea(shape);
        metrics.perimeter = this.ovalService.calculatePerimeter(shape);
      } catch (error) {
        logger.warn(
          `Failed to calculate metrics for Oval ${shape.getId()}`,
          error instanceof Error ? { error: error.message } : undefined,
        );
      }
    } else if (shape instanceof Tetrahedron) {
      try {
        metrics.volume = this.tetrahedronService.calculateVolume(shape);
        metrics.surfaceArea
          = this.tetrahedronService.calculateSurfaceArea(shape);
      } catch (error) {
        logger.warn(
          `Failed to calculate metrics for Tetrahedron ${shape.getId()}`,
          error instanceof Error ? { error: error.message } : undefined,
        );
      }
    }

    this.metrics.set(shape.getId(), metrics);
  }

  /**
   * Gets the shape type for a shape instance.
   * @param shape - The shape
   * @returns The shape type
   */
  private getShapeType(shape: Shape): ShapeType {
    if (shape instanceof Oval) {
      return ShapeType.OVAL;
    }
    if (shape instanceof Tetrahedron) {
      return ShapeType.TETRAHEDRON;
    }
    throw new Error(`Unknown shape type: ${shape.constructor.name}`);
  }

  /**
   * Gets the area for a shape.
   * @param shapeId - The shape ID
   * @returns The area, or undefined if not found or not applicable
   */
  public getArea(shapeId: string): number | undefined {
    return this.metrics.get(shapeId)?.area;
  }

  /**
   * Gets the perimeter for a shape.
   * @param shapeId - The shape ID
   * @returns The perimeter, or undefined if not found or not applicable
   */
  public getPerimeter(shapeId: string): number | undefined {
    return this.metrics.get(shapeId)?.perimeter;
  }

  /**
   * Gets the volume for a shape.
   * @param shapeId - The shape ID
   * @returns The volume, or undefined if not found or not applicable
   */
  public getVolume(shapeId: string): number | undefined {
    return this.metrics.get(shapeId)?.volume;
  }

  /**
   * Gets the surface area for a shape.
   * @param shapeId - The shape ID
   * @returns The surface area, or undefined if not found or not applicable
   */
  public getSurfaceArea(shapeId: string): number | undefined {
    return this.metrics.get(shapeId)?.surfaceArea;
  }

  /**
   * Gets all metrics stored in the warehouse.
   * @returns A map of shape IDs to their metrics
   */
  public getAllMetrics(): Map<string, ShapeMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Gets metrics for a specific shape.
   * @param shapeId - The shape ID
   * @returns The metrics, or undefined if not found
   */
  public getMetrics(shapeId: string): ShapeMetrics | undefined {
    return this.metrics.get(shapeId);
  }

  /**
   * Clears all metrics from the warehouse.
   * Use with caution - this removes all stored data.
   */
  public clear(): void {
    this.metrics.clear();
    logger.info('Warehouse cleared');
  }
}
