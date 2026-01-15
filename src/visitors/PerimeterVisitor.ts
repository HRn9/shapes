import { Visitor } from './Visitor.js';

/**
 * Visitor for calculating perimeter of shapes
 */
export class PerimeterVisitor implements Visitor {
  private totalPerimeter: number = 0;

  public visitOval(oval: { getSemiMajorAxis: () => number; getSemiMinorAxis: () => number }): void {
    const a = oval.getSemiMajorAxis();
    const b = oval.getSemiMinorAxis();
    // Approximate ellipse perimeter formula (Ramanujan's formula)
    const h = (a - b) ** 2 / (a + b) ** 2;
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    this.totalPerimeter += perimeter;
  }

  public visitTetrahedron(
    tetrahedron: { getVertices: () => { getX: () => number; getY: () => number; getZ: () => number }[] },
  ): void {
    const vertices = tetrahedron.getVertices();
    if (vertices.length !== 4) {
      return;
    }

    // For tetrahedron, perimeter = sum of all edge lengths
    const perimeter = this.calculateTetrahedronPerimeter(vertices);
    this.totalPerimeter += perimeter;
  }

  public getTotalPerimeter(): number {
    return this.totalPerimeter;
  }

  public reset(): void {
    this.totalPerimeter = 0;
  }

  private calculateTetrahedronPerimeter(
    vertices: { getX: () => number; getY: () => number; getZ: () => number }[],
  ): number {
    // Tetrahedron has 6 edges
    const edges = [
      [0, 1], [0, 2], [0, 3], // Edges from first vertex
      [1, 2], [1, 3], // Edges from second vertex
      [2, 3], // Edge between third and fourth vertices
    ];

    let totalLength = 0;
    for (const [i, j] of edges) {
      const v1 = vertices[i];
      const v2 = vertices[j];
      const length = this.distance(v1, v2);
      totalLength += length;
    }

    return totalLength;
  }

  private distance(
    v1: { getX: () => number; getY: () => number; getZ: () => number },
    v2: { getX: () => number; getY: () => number; getZ: () => number },
  ): number {
    const dx = v2.getX() - v1.getX();
    const dy = v2.getY() - v1.getY();
    const dz = v2.getZ() - v1.getZ();
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
