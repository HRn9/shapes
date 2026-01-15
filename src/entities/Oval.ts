import { Point } from './Point.js';
import { Shape } from './Shape.js';
import { Visitor } from '../visitors/Visitor.js';

/**
 * Oval entity class representing an oval defined by two points of bounding rectangle.
 * The oval is oriented parallel to coordinate axes.
 * Contains only data, no business logic.
 */
export class Oval extends Shape {
  private readonly point1: Point;
  private readonly point2: Point;

  constructor(id: string, name: string, point1: Point, point2: Point) {
    super(id, name);
    this.point1 = point1;
    this.point2 = point2;
  }

  public getPoint1(): Point {
    return this.point1;
  }

  public getPoint2(): Point {
    return this.point2;
  }

  public getCenterX(): number {
    return (this.point1.getX() + this.point2.getX()) / 2;
  }

  public getCenterY(): number {
    return (this.point1.getY() + this.point2.getY()) / 2;
  }

  public getSemiMajorAxis(): number {
    return Math.abs(this.point2.getX() - this.point1.getX()) / 2;
  }

  public getSemiMinorAxis(): number {
    return Math.abs(this.point2.getY() - this.point1.getY()) / 2;
  }

  public toString(): string {
    return `Oval[id=${this.getId()}, name=${this.getName()}, `
           + `point1=${this.point1.toString()}, point2=${this.point2.toString()}]`;
  }

  public accept(visitor: Visitor): void {
    visitor.visitOval(this);
  }
}
