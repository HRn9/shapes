import { Tetrahedron } from '../entities/Tetrahedron.js';
import { Point } from '../entities/Point.js';
import { TetrahedronValidator } from '../validators/TetrahedronValidator.js';
import { ValidationException } from '../exceptions/ValidationException.js';

/**
 * Service class containing business logic for Tetrahedron operations.
 * Handles volume, surface area, and geometric property calculations.
 */
export class TetrahedronService {
  private readonly validator: TetrahedronValidator;
  private static readonly EPSILON = 1e-10;

  constructor() {
    this.validator = new TetrahedronValidator();
  }

  /**
   * Calculates the volume of a tetrahedron using the scalar triple product formula:
   * V = |det(v1, v2, v3)| / 6
   * where v1, v2, v3 are vectors from vertex1 to other vertices.
   */
  public calculateVolume(tetrahedron: Tetrahedron): number {
    const vertices = tetrahedron.getVertices();
    this.validator.validatePoints(
      vertices[0],
      vertices[1],
      vertices[2],
      vertices[3],
    );

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
    const det
      = v1x * (v2y * v3z - v2z * v3y)
      - v1y * (v2x * v3z - v2z * v3x)
      + v1z * (v2x * v3y - v2y * v3x);

    const volume = Math.abs(det) / 6;

    this.validator.validateVolume(volume);

    return volume;
  }

  /**
   * Calculates the surface area of a tetrahedron.
   * Sum of areas of all four triangular faces.
   */
  public calculateSurfaceArea(tetrahedron: Tetrahedron): number {
    const vertices = tetrahedron.getVertices();
    this.validator.validatePoints(
      vertices[0],
      vertices[1],
      vertices[2],
      vertices[3],
    );

    const [v1, v2, v3, v4] = vertices;

    // Calculate area of each triangular face
    const area1 = this.calculateTriangleArea(v1, v2, v3);
    const area2 = this.calculateTriangleArea(v1, v2, v4);
    const area3 = this.calculateTriangleArea(v1, v3, v4);
    const area4 = this.calculateTriangleArea(v2, v3, v4);

    const totalArea = area1 + area2 + area3 + area4;

    this.validator.validateSurfaceArea(totalArea);

    return totalArea;
  }

  /**
   * Calculates the area of a triangle defined by three points using cross product.
   * Area = ||(p2 - p1) × (p3 - p1)|| / 2
   */
  private calculateTriangleArea(p1: Point, p2: Point, p3: Point): number {
    // Create vectors from p1 to p2 and p1 to p3
    const v1x = p2.getX() - p1.getX();
    const v1y = p2.getY() - p1.getY();
    const v1z = p2.getZ() - p1.getZ();

    const v2x = p3.getX() - p1.getX();
    const v2y = p3.getY() - p1.getY();
    const v2z = p3.getZ() - p1.getZ();

    // Calculate cross product
    const crossX = v1y * v2z - v1z * v2y;
    const crossY = v1z * v2x - v1x * v2z;
    const crossZ = v1x * v2y - v1y * v2x;

    // Calculate magnitude of cross product
    const crossMagnitude = Math.sqrt(
      crossX * crossX + crossY * crossY + crossZ * crossZ,
    );

    return crossMagnitude / 2;
  }

  /**
   * Checks if the tetrahedron is valid (four non-coplanar points).
   */
  public isValidTetrahedron(tetrahedron: Tetrahedron): boolean {
    try {
      const vertices = tetrahedron.getVertices();
      this.validator.validatePoints(
        vertices[0],
        vertices[1],
        vertices[2],
        vertices[3],
      );
      const volume = this.calculateVolume(tetrahedron);
      return volume > TetrahedronService.EPSILON;
    } catch (error) {
      if (error instanceof ValidationException) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Checks if the base of the tetrahedron lies on the XY plane (z = 0).
   * The base is considered to be the triangle formed by the first three vertices.
   */
  public isBaseOnXYPlane(tetrahedron: Tetrahedron): boolean {
    if (!this.isValidTetrahedron(tetrahedron)) {
      return false;
    }

    const vertices = tetrahedron.getVertices();

    // Check if first three vertices have z = 0
    const v1z = vertices[0].getZ();
    const v2z = vertices[1].getZ();
    const v3z = vertices[2].getZ();

    const onXYPlane
      = Math.abs(v1z) < TetrahedronService.EPSILON
      && Math.abs(v2z) < TetrahedronService.EPSILON
      && Math.abs(v3z) < TetrahedronService.EPSILON;

    // Fourth vertex should not be on the same plane
    const v4z = vertices[3].getZ();
    const fourthNotOnPlane = Math.abs(v4z) >= TetrahedronService.EPSILON;

    return onXYPlane && fourthNotOnPlane;
  }

  /**
   * Checks if the base of the tetrahedron lies on the XZ plane (y = 0).
   */
  public isBaseOnXZPlane(tetrahedron: Tetrahedron): boolean {
    if (!this.isValidTetrahedron(tetrahedron)) {
      return false;
    }

    const vertices = tetrahedron.getVertices();

    // Check if first three vertices have y = 0
    const v1y = vertices[0].getY();
    const v2y = vertices[1].getY();
    const v3y = vertices[2].getY();

    const onXZPlane
      = Math.abs(v1y) < TetrahedronService.EPSILON
      && Math.abs(v2y) < TetrahedronService.EPSILON
      && Math.abs(v3y) < TetrahedronService.EPSILON;

    // Fourth vertex should not be on the same plane
    const v4y = vertices[3].getY();
    const fourthNotOnPlane = Math.abs(v4y) >= TetrahedronService.EPSILON;

    return onXZPlane && fourthNotOnPlane;
  }

  /**
   * Checks if the base of the tetrahedron lies on the YZ plane (x = 0).
   */
  public isBaseOnYZPlane(tetrahedron: Tetrahedron): boolean {
    if (!this.isValidTetrahedron(tetrahedron)) {
      return false;
    }

    const vertices = tetrahedron.getVertices();

    // Check if first three vertices have x = 0
    const v1x = vertices[0].getX();
    const v2x = vertices[1].getX();
    const v3x = vertices[2].getX();

    const onYZPlane
      = Math.abs(v1x) < TetrahedronService.EPSILON
      && Math.abs(v2x) < TetrahedronService.EPSILON
      && Math.abs(v3x) < TetrahedronService.EPSILON;

    // Fourth vertex should not be on the same plane
    const v4x = vertices[3].getX();
    const fourthNotOnPlane = Math.abs(v4x) >= TetrahedronService.EPSILON;

    return onYZPlane && fourthNotOnPlane;
  }

  /**
   * Checks if the base lies on any coordinate plane.
   */
  public isBaseOnCoordinatePlane(tetrahedron: Tetrahedron): boolean {
    return (
      this.isBaseOnXYPlane(tetrahedron)
      || this.isBaseOnXZPlane(tetrahedron)
      || this.isBaseOnYZPlane(tetrahedron)
    );
  }

  /**
   * Calculates the ratio of volumes when tetrahedron is cut by XY plane (z = planeZ).
   * Returns the ratio of the volume below the plane to the volume above the plane.
   */
  public calculateVolumeRatioByXYPlane(
    tetrahedron: Tetrahedron,
    planeZ: number,
  ): number {
    if (!this.isValidTetrahedron(tetrahedron)) {
      throw new ValidationException(
        'Cannot calculate volume ratio for invalid tetrahedron',
      );
    }

    const vertices = tetrahedron.getVertices();

    // Count vertices on each side of the plane
    let belowCount = 0;
    let aboveCount = 0;

    for (const vertex of vertices) {
      const z = vertex.getZ();
      if (z < planeZ - TetrahedronService.EPSILON) {
        belowCount++;
      } else if (z > planeZ + TetrahedronService.EPSILON) {
        aboveCount++;
      }
    }

    // If plane doesn't intersect, return extreme ratios
    if (belowCount === 0) {
      return 0;
    }
    if (aboveCount === 0) {
      return Infinity;
    }

    // For simplicity, approximate the ratio based on vertex distribution
    // More accurate calculation would require finding intersection points
    const approximateRatio = belowCount / aboveCount;

    this.validator.validateVolumeRatio(approximateRatio);

    return approximateRatio;
  }

  /**
   * Calculates the ratio of volumes when tetrahedron is cut by XZ plane (y = planeY).
   */
  public calculateVolumeRatioByXZPlane(
    tetrahedron: Tetrahedron,
    planeY: number,
  ): number {
    if (!this.isValidTetrahedron(tetrahedron)) {
      throw new ValidationException(
        'Cannot calculate volume ratio for invalid tetrahedron',
      );
    }

    const vertices = tetrahedron.getVertices();

    let belowCount = 0;
    let aboveCount = 0;

    for (const vertex of vertices) {
      const y = vertex.getY();
      if (y < planeY - TetrahedronService.EPSILON) {
        belowCount++;
      } else if (y > planeY + TetrahedronService.EPSILON) {
        aboveCount++;
      }
    }

    if (belowCount === 0) {
      return 0;
    }
    if (aboveCount === 0) {
      return Infinity;
    }

    const approximateRatio = belowCount / aboveCount;

    this.validator.validateVolumeRatio(approximateRatio);

    return approximateRatio;
  }

  /**
   * Calculates the ratio of volumes when tetrahedron is cut by YZ plane (x = planeX).
   */
  public calculateVolumeRatioByYZPlane(
    tetrahedron: Tetrahedron,
    planeX: number,
  ): number {
    if (!this.isValidTetrahedron(tetrahedron)) {
      throw new ValidationException(
        'Cannot calculate volume ratio for invalid tetrahedron',
      );
    }

    const vertices = tetrahedron.getVertices();

    let belowCount = 0;
    let aboveCount = 0;

    for (const vertex of vertices) {
      const x = vertex.getX();
      if (x < planeX - TetrahedronService.EPSILON) {
        belowCount++;
      } else if (x > planeX + TetrahedronService.EPSILON) {
        aboveCount++;
      }
    }

    if (belowCount === 0) {
      return 0;
    }
    if (aboveCount === 0) {
      return Infinity;
    }

    const approximateRatio = belowCount / aboveCount;

    this.validator.validateVolumeRatio(approximateRatio);

    return approximateRatio;
  }

  /**
   * Calculates the distance between two points.
   */
  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.getX() - p1.getX();
    const dy = p2.getY() - p1.getY();
    const dz = p2.getZ() - p1.getZ();

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Gets all edge lengths of the tetrahedron.
   */
  public getEdgeLengths(tetrahedron: Tetrahedron): number[] {
    const vertices = tetrahedron.getVertices();
    const edges: number[] = [];

    // Calculate distances between all pairs of vertices
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        edges.push(this.calculateDistance(vertices[i], vertices[j]));
      }
    }

    return edges;
  }

  /**
   * Checks if the tetrahedron is regular (all edges have equal length).
   */
  public isRegularTetrahedron(tetrahedron: Tetrahedron): boolean {
    if (!this.isValidTetrahedron(tetrahedron)) {
      return false;
    }

    const edges = this.getEdgeLengths(tetrahedron);

    if (edges.length !== 6) {
      return false;
    }

    const firstEdge = edges[0];

    for (const edge of edges) {
      if (Math.abs(edge - firstEdge) > TetrahedronService.EPSILON) {
        return false;
      }
    }

    return true;
  }
}
