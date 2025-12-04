import { Shape } from '../entities/Shape.js';
import { Specification } from '../specifications/Specification.js';
import { Comparator } from '../comparators/Comparator.js';
import { Warehouse } from '../warehouse/Warehouse.js';
import { logger } from '../utils/Logger.js';

/**
 * Repository for storing and managing geometric shapes.
 * Implements Repository pattern for centralized shape management.
 * Integrates with Warehouse for automatic metric tracking.
 */
export class ShapeRepository {
  private readonly shapes: Map<string, Shape> = new Map();
  private readonly warehouse: Warehouse;

  /**
   * Creates a new shape repository.
   */
  constructor() {
    this.warehouse = Warehouse.getInstance();
  }

  /**
   * Adds a shape to the repository.
   * Automatically registers the shape in Warehouse.
   * @param shape - The shape to add
   * @throws Error if a shape with the same ID already exists
   */
  public add(shape: Shape): void {
    if (this.shapes.has(shape.getId())) {
      throw new Error(`Shape with ID ${shape.getId()} already exists`);
    }

    this.shapes.set(shape.getId(), shape);
    this.warehouse.registerShape(shape);
    logger.info(`Shape added to repository: ${shape.getId()}`);
  }

  /**
   * Removes a shape from the repository by ID.
   * Automatically unregisters the shape from Warehouse.
   * @param id - The ID of the shape to remove
   * @returns True if the shape was removed, false if not found
   */
  public remove(id: string): boolean {
    const shape = this.shapes.get(id);
    if (shape) {
      this.shapes.delete(id);
      this.warehouse.unregisterShape(shape);
      logger.info(`Shape removed from repository: ${id}`);
      return true;
    }
    return false;
  }

  /**
   * Finds a shape by ID.
   * @param id - The ID to search for
   * @returns The shape if found, undefined otherwise
   */
  public findById(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  /**
   * Finds all shapes with a given name.
   * @param name - The name to search for
   * @returns Array of shapes with the specified name
   */
  public findByName(name: string): Shape[] {
    return Array.from(this.shapes.values()).filter(
      (shape) => shape.getName() === name,
    );
  }

  /**
   * Gets all shapes in the repository.
   * @returns Array of all shapes
   */
  public findAll(): Shape[] {
    return Array.from(this.shapes.values());
  }

  /**
   * Finds shapes that satisfy a specification.
   * @param specification - The specification to use for filtering
   * @returns Array of shapes that satisfy the specification
   */
  public findBySpecification(specification: Specification<Shape>): Shape[] {
    return Array.from(this.shapes.values()).filter(
      (shape) => specification.isSatisfiedBy(shape),
    );
  }

  /**
   * Sorts shapes using a comparator.
   * Returns a new array without modifying the repository.
   * @param comparator - The comparator to use for sorting
   * @returns Sorted array of shapes
   */
  public sort(comparator: Comparator<Shape>): Shape[] {
    const shapes = Array.from(this.shapes.values());
    return shapes.sort((a, b) => comparator.compare(a, b));
  }

  /**
   * Gets the number of shapes in the repository.
   * @returns The count of shapes
   */
  public size(): number {
    return this.shapes.size;
  }

  /**
   * Checks if the repository is empty.
   * @returns True if the repository is empty
   */
  public isEmpty(): boolean {
    return this.shapes.size === 0;
  }

  /**
   * Clears all shapes from the repository.
   * Also unregisters all shapes from Warehouse.
   */
  public clear(): void {
    const shapes = Array.from(this.shapes.values());
    shapes.forEach((shape) => {
      this.warehouse.unregisterShape(shape);
    });
    this.shapes.clear();
    logger.info('Repository cleared');
  }
}
