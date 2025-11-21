import { Point } from './Point.js';
import { Shape } from './Shape.js';

/**
 * Tetrahedron entity class representing a tetrahedron defined by four vertices.
 * The tetrahedron can have its base on one of the coordinate planes.
 * Contains only data, no business logic.
 */
export class Tetrahedron extends Shape {
  private readonly vertex1: Point;
  private readonly vertex2: Point;
  private readonly vertex3: Point;
  private readonly vertex4: Point;

  constructor(
    id: string,
    name: string,
    vertex1: Point,
    vertex2: Point,
    vertex3: Point,
    vertex4: Point,
  ) {
    super(id, name);
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.vertex3 = vertex3;
    this.vertex4 = vertex4;
  }

  public getVertex1(): Point {
    return this.vertex1;
  }

  public getVertex2(): Point {
    return this.vertex2;
  }

  public getVertex3(): Point {
    return this.vertex3;
  }

  public getVertex4(): Point {
    return this.vertex4;
  }

  public getVertices(): Point[] {
    return [this.vertex1, this.vertex2, this.vertex3, this.vertex4];
  }

  public toString(): string {
    return `Tetrahedron[id=${this.getId()}, name=${this.getName()}, `
           + `vertex1=${this.vertex1.toString()}, vertex2=${this.vertex2.toString()}, `
           + `vertex3=${this.vertex3.toString()}, vertex4=${this.vertex4.toString()}]`;
  }
}
