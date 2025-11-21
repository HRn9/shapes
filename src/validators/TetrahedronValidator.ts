import { Point } from '../entities/Point.js';
import { ValidationException } from '../exceptions/ValidationException.js';

/**
 * Validator class for Tetrahedron entity.
 * Validates data before creating Tetrahedron instances.
 */
export class TetrahedronValidator {
  private static readonly NUMBER_PATTERN: RegExp = /^-?\d+(\.\d+)?$/;
  private static readonly MIN_COORDINATES = 12; // 4 vertices * 3 coordinates
  private static readonly EPSILON = 1e-10;

  /**
   * Validates raw string data for creating a Tetrahedron.
   * Expected format: "x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4" where each triplet is a vertex.
   */
  public validateRawData(line: string): boolean {
    try {
      const trimmedLine = line.trim();

      if (trimmedLine.length === 0) {
        return false;
      }

      const parts = trimmedLine.split(/\s+/);

      if (parts.length !== TetrahedronValidator.MIN_COORDINATES) {
        return false;
      }

      // Check if all parts are valid numbers
      for (const part of parts) {
        if (!TetrahedronValidator.NUMBER_PATTERN.test(part)) {
          return false;
        }
      }

      // Parse coordinates
      const coordinates = parts.map((part) => parseFloat(part));

      // Additional validation
      return this.validateCoordinates(coordinates);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validates parsed coordinates array.
   */
  private validateCoordinates(coordinates: number[]): boolean {
    if (coordinates.length !== TetrahedronValidator.MIN_COORDINATES) {
      return false;
    }

    // Check if any coordinate is NaN or Infinity
    for (const coord of coordinates) {
      if (!Number.isFinite(coord)) {
        return false;
      }
    }

    // Create points to validate they form a valid tetrahedron
    const points: Point[] = [];
    for (let i = 0; i < coordinates.length; i += 3) {
      points.push(new Point(coordinates[i], coordinates[i + 1], coordinates[i + 2]));
    }

    // Check if all points are different
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].equals(points[j])) {
          return false;
        }
      }
    }

    // Check if points are not coplanar (must form a 3D tetrahedron)
    return !this.arePointsCoplanar(points);
  }

  /**
   * Validates four Point objects can form a valid Tetrahedron.
   */
  public validatePoints(vertex1: Point, vertex2: Point, vertex3: Point, vertex4: Point): void {
    const vertices = [vertex1, vertex2, vertex3, vertex4];

    // Check if all points are different
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        if (vertices[i].equals(vertices[j])) {
          throw new ValidationException(
            `Vertices ${i + 1} and ${j + 1} are identical`,
            {
              vertex1: vertices[i].toString(),
              vertex2: vertices[j].toString(),
            },
          );
        }
      }
    }

    // Check if points are coplanar
    if (this.arePointsCoplanar(vertices)) {
      throw new ValidationException(
        'All four vertices are coplanar - cannot form a valid tetrahedron',
        {
          vertex1: vertex1.toString(),
          vertex2: vertex2.toString(),
          vertex3: vertex3.toString(),
          vertex4: vertex4.toString(),
        },
      );
    }
  }

  /**
   * Checks if four points are coplanar using scalar triple product.
   * If volume is zero, points are coplanar.
   */
  private arePointsCoplanar(vertices: Point[]): boolean {
    if (vertices.length !== 4) {
      return false;
    }

    const [p1, p2, p3, p4] = vertices;

    // Create vectors from p1 to other points
    const v1x = p2.getX() - p1.getX();
    const v1y = p2.getY() - p1.getY();
    const v1z = p2.getZ() - p1.getZ();

    const v2x = p3.getX() - p1.getX();
    const v2y = p3.getY() - p1.getY();
    const v2z = p3.getZ() - p1.getZ();

    const v3x = p4.getX() - p1.getX();
    const v3y = p4.getY() - p1.getY();
    const v3z = p4.getZ() - p1.getZ();

    // Calculate scalar triple product (determinant)
    const scalarTripleProduct = v1x * (v2y * v3z - v2z * v3y)
                                - v1y * (v2x * v3z - v2z * v3x)
                                + v1z * (v2x * v3y - v2y * v3x);

    return Math.abs(scalarTripleProduct) < TetrahedronValidator.EPSILON;
  }

  /**
   * Validates volume value.
   */
  public validateVolume(volume: number): void {
    if (volume <= 0) {
      throw new ValidationException(
        'Volume must be positive',
        { volume },
      );
    }

    if (!Number.isFinite(volume)) {
      throw new ValidationException(
        'Volume must be a finite number',
        { volume },
      );
    }
  }

  /**
   * Validates surface area value.
   */
  public validateSurfaceArea(surfaceArea: number): void {
    if (surfaceArea <= 0) {
      throw new ValidationException(
        'Surface area must be positive',
        { surfaceArea },
      );
    }

    if (!Number.isFinite(surfaceArea)) {
      throw new ValidationException(
        'Surface area must be a finite number',
        { surfaceArea },
      );
    }
  }

  /**
   * Validates volume ratio value.
   */
  public validateVolumeRatio(ratio: number): void {
    if (ratio < 0) {
      throw new ValidationException(
        'Volume ratio cannot be negative',
        { ratio },
      );
    }

    if (!Number.isFinite(ratio)) {
      throw new ValidationException(
        'Volume ratio must be a finite number',
        { ratio },
      );
    }
  }

  /**
   * Validates distance value.
   */
  public validateDistance(distance: number): void {
    if (distance < 0) {
      throw new ValidationException(
        'Distance cannot be negative',
        { distance },
      );
    }

    if (!Number.isFinite(distance)) {
      throw new ValidationException(
        'Distance must be a finite number',
        { distance },
      );
    }
  }

  /**
   * Validates coordinate plane identifier.
   */
  public validateCoordinatePlane(plane: string): void {
    const validPlanes = ['XY', 'XZ', 'YZ'];

    if (!validPlanes.includes(plane.toUpperCase())) {
      throw new ValidationException(
        'Invalid coordinate plane',
        { plane, validPlanes },
      );
    }
  }
}
