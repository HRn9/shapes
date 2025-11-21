/**
 * Point entity class representing a point in 3D space.
 * Contains only data, no business logic.
 */
export class Point {
  private readonly x: number;
  private readonly y: number;
  private readonly z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getZ(): number {
    return this.z;
  }

  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  public toString(): string {
    return `Point(${this.x}, ${this.y}, ${this.z})`;
  }
}
