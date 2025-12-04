import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { Point } from '../entities/Point.js';
import { ShapeType } from './ShapeType.js';
import { OvalValidator } from '../validators/OvalValidator.js';
import { TetrahedronValidator } from '../validators/TetrahedronValidator.js';
import { ShapeCreationException } from '../exceptions/ShapeCreationException.js';
import { Warehouse } from '../warehouse/Warehouse.js';

/**
 * Factory class implementing Factory Method pattern for creating Shape objects.
 * Handles the creation of different shape types based on validated input data.
 * Automatically registers created shapes in Warehouse for metric tracking.
 */
export class ShapeFactory {
  private static idCounter = 0;
  private readonly ovalValidator: OvalValidator;
  private readonly tetrahedronValidator: TetrahedronValidator;
  private readonly warehouse: Warehouse;

  constructor() {
    this.ovalValidator = new OvalValidator();
    this.tetrahedronValidator = new TetrahedronValidator();
    this.warehouse = Warehouse.getInstance();
  }

  /**
   * Factory method to create a Shape based on type and data.
   * Automatically registers the created shape in Warehouse.
   * @param shapeType - The type of shape to create
   * @param data - Raw data array containing shape parameters
   * @param name - Optional name for the shape
   * @returns Created Shape instance
   * @throws ShapeCreationException if creation fails
   */
  public createShape(shapeType: ShapeType, data: number[], name?: string): Shape {
    try {
      let shape: Shape;
      switch (shapeType) {
        case ShapeType.OVAL:
          shape = this.createOval(data, name);
          break;
        case ShapeType.TETRAHEDRON:
          shape = this.createTetrahedron(data, name);
          break;
        default:
          throw new ShapeCreationException(
            `Unknown shape type: ${shapeType}`,
            shapeType,
          );
      }

      // Automatically register shape in Warehouse
      this.warehouse.registerShape(shape);

      return shape;
    } catch (error) {
      if (error instanceof ShapeCreationException) {
        throw error;
      }
      throw new ShapeCreationException(
        `Failed to create shape: ${(error as Error).message}`,
        shapeType,
        { originalError: (error as Error).message, data },
      );
    }
  }

  /**
   * Factory method to create a Shape from a raw string line.
   * @param shapeType - The type of shape to create
   * @param line - Raw string containing shape parameters
   * @param name - Optional name for the shape
   * @returns Created Shape instance or null if data is invalid
   */
  public createShapeFromLine(
    shapeType: ShapeType,
    line: string,
    name?: string,
  ): Shape | null {
    try {
      // Validate and parse the line based on shape type
      let isValid = false;

      switch (shapeType) {
        case ShapeType.OVAL:
          isValid = this.ovalValidator.validateRawData(line);
          break;
        case ShapeType.TETRAHEDRON:
          isValid = this.tetrahedronValidator.validateRawData(line);
          break;
        default:
          return null;
      }

      if (!isValid) {
        return null;
      }

      // Parse the data
      const data = this.parseLineToNumbers(line);

      if (data === null) {
        return null;
      }

      // Create the shape
      return this.createShape(shapeType, data, name);
    } catch (error) {
      // If any error occurs, return null (invalid data)
      return null;
    }
  }

  /**
   * Creates an Oval from numeric data array.
   * Expected format: [x1, y1, x2, y2]
   */
  private createOval(data: number[], name?: string): Oval {
    const EXPECTED_LENGTH = 4;

    if (data.length !== EXPECTED_LENGTH) {
      throw new ShapeCreationException(
        `Invalid data length for Oval. Expected ${EXPECTED_LENGTH}, got ${data.length}`,
        ShapeType.OVAL,
        { data },
      );
    }

    const [x1, y1, x2, y2] = data;

    // Create points (z = 0 for 2D oval)
    const point1 = new Point(x1, y1, 0);
    const point2 = new Point(x2, y2, 0);

    // Validate points
    try {
      this.ovalValidator.validatePoints(point1, point2);
    } catch (error) {
      throw new ShapeCreationException(
        `Invalid points for Oval: ${(error as Error).message}`,
        ShapeType.OVAL,
        { point1: point1.toString(), point2: point2.toString() },
      );
    }

    // Generate ID and name
    const id = this.generateId();
    const shapeName = name ?? `Oval_${id}`;

    return new Oval(id, shapeName, point1, point2);
  }

  /**
   * Creates a Tetrahedron from numeric data array.
   * Expected format: [x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4]
   */
  private createTetrahedron(data: number[], name?: string): Tetrahedron {
    const EXPECTED_LENGTH = 12;

    if (data.length !== EXPECTED_LENGTH) {
      throw new ShapeCreationException(
        `Invalid data length for Tetrahedron. Expected ${EXPECTED_LENGTH}, got ${data.length}`,
        ShapeType.TETRAHEDRON,
        { data },
      );
    }

    // Create four vertices
    const vertex1 = new Point(data[0], data[1], data[2]);
    const vertex2 = new Point(data[3], data[4], data[5]);
    const vertex3 = new Point(data[6], data[7], data[8]);
    const vertex4 = new Point(data[9], data[10], data[11]);

    // Validate vertices
    try {
      this.tetrahedronValidator.validatePoints(vertex1, vertex2, vertex3, vertex4);
    } catch (error) {
      throw new ShapeCreationException(
        `Invalid vertices for Tetrahedron: ${(error as Error).message}`,
        ShapeType.TETRAHEDRON,
        {
          vertex1: vertex1.toString(),
          vertex2: vertex2.toString(),
          vertex3: vertex3.toString(),
          vertex4: vertex4.toString(),
        },
      );
    }

    // Generate ID and name
    const id = this.generateId();
    const shapeName = name ?? `Tetrahedron_${id}`;

    return new Tetrahedron(id, shapeName, vertex1, vertex2, vertex3, vertex4);
  }

  /**
   * Parses a string line into an array of numbers.
   * Returns null if parsing fails.
   */
  private parseLineToNumbers(line: string): number[] | null {
    try {
      const trimmedLine = line.trim();

      if (trimmedLine.length === 0) {
        return null;
      }

      const parts = trimmedLine.split(/\s+/);
      const numbers: number[] = [];

      for (const part of parts) {
        const num = parseFloat(part);

        if (!Number.isFinite(num)) {
          return null;
        }

        numbers.push(num);
      }

      return numbers;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generates a unique ID for a shape.
   */
  private generateId(): string {
    ShapeFactory.idCounter += 1;
    return `SHAPE_${ShapeFactory.idCounter.toString().padStart(6, '0')}`;
  }

  /**
   * Resets the ID counter (useful for testing).
   */
  public static resetIdCounter(): void {
    ShapeFactory.idCounter = 0;
  }
}
