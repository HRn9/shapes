import { Visitor } from './Visitor.js';

/**
 * Visitor for calculating area of shapes
 */
export class AreaVisitor implements Visitor {
  private totalArea: number = 0;

  public visitOval(oval: { getSemiMajorAxis: () => number; getSemiMinorAxis: () => number }): void {
    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();
    const area = Math.PI * a * b;
    this.totalArea += area;
  }

  public visitTetrahedron(
    tetrahedron: { getVertices: () => { getX: () => number; getY: () => number; getZ: () => number }[] },
  ): void {
    const vertices = tetrahedron.getVertices();
    if (vertices.length !== 4) {
      return;
    }

    // Calculate area of 4 triangular faces
    const area = this.calculateTetrahedronArea(vertices);
    this.totalArea += area;
  }

  public getTotalArea(): number {
    return this.totalArea;
  }

  public reset(): void {
    this.totalArea = 0;
  }

  private calculateTetrahedronArea(
    vertices: { getX: () => number; getY: () => number; getZ: () => number }[],
  ): number {
    // Area = sum of areas of 4 triangular faces
    const v1 = vertices[0];
    const v2 = vertices[1];
    const v3 = vertices[2];
    const v4 = vertices[3];

    // Calculate areas of 4 faces
    const area1 = this.triangleArea(v1, v2, v3);
    const area2 = this.triangleArea(v1, v2, v4);
    const area3 = this.triangleArea(v1, v3, v4);
    const area4 = this.triangleArea(v2, v3, v4);

    return area1 + area2 + area3 + area4;
  }

  private triangleArea(
    v1: { getX: () => number; getY: () => number; getZ: () => number },
    v2: { getX: () => number; getY: () => number; getZ: () => number },
    v3: { getX: () => number; getY: () => number; getZ: () => number },
  ): number {
    // Cross product for calculating triangle area
    const x1 = v2.getX() - v1.getX();
    const y1 = v2.getY() - v1.getY();
    const z1 = v2.getZ() - v1.getZ();

    const x2 = v3.getX() - v1.getX();
    const y2 = v3.getY() - v1.getY();
    const z2 = v3.getZ() - v1.getZ();

    // Cross product
    const crossX = y1 * z2 - z1 * y2;
    const crossY = z1 * x2 - x1 * z2;
    const crossZ = x1 * y2 - y1 * x2;

    // Vector length (parallelogram area)
    const length = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);

    // Triangle area = half of parallelogram area
    return length / 2;
  }
}
