import { OvalService } from "../../src/services/OvalService";
import { Oval } from "../../src/entities/Oval";
import { Point } from "../../src/entities/Point";
import { ValidationException } from "../../src/exceptions/ValidationException";

describe("OvalService", () => {
  let service: OvalService;

  beforeEach(() => {
    service = new OvalService();
  });

  describe("calculateArea", () => {
    test("should calculate area correctly for a standard oval", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const area = service.calculateArea(oval);

      expect(area).toBeCloseTo(Math.PI * 2 * 1, 5);
      expect(area).toBeGreaterThan(0);
      expect(typeof area).toBe("number");
      expect(Number.isFinite(area)).toBe(true);
    });

    test("should calculate area correctly for a circle", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 4, 0);
      const oval = new Oval("2", "Circle", point1, point2);

      const area = service.calculateArea(oval);

      expect(area).toBeCloseTo(Math.PI * 2 * 2, 5);
      expect(area).toBeGreaterThan(12);
      expect(area).toBeLessThan(13);
      expect(Number.isFinite(area)).toBe(true);
    });

    test("should calculate area for oval with negative coordinates", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("3", "NegOval", point1, point2);

      const area = service.calculateArea(oval);

      expect(area).toBeCloseTo(Math.PI * 5 * 3, 5);
      expect(area).toBeGreaterThan(47);
      expect(area).toBeLessThan(48);
      expect(typeof area).toBe("number");
    });

    test("should calculate area for very small oval", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(0.2, 0.4, 0);
      const oval = new Oval("4", "SmallOval", point1, point2);

      const area = service.calculateArea(oval);

      expect(area).toBeGreaterThan(0);
      expect(area).toBeLessThan(1);
      expect(Number.isFinite(area)).toBe(true);
      expect(area).toBeCloseTo(Math.PI * 0.1 * 0.2, 5);
    });

    test("should calculate area for large oval", () => {
      const point1 = new Point(-100, -50, 0);
      const point2 = new Point(100, 50, 0);
      const oval = new Oval("5", "LargeOval", point1, point2);

      const area = service.calculateArea(oval);

      expect(area).toBeCloseTo(Math.PI * 100 * 50, 5);
      expect(area).toBeGreaterThan(15000);
      expect(typeof area).toBe("number");
      expect(Number.isFinite(area)).toBe(true);
    });

    test("should throw ValidationException for invalid oval", () => {
      const point1 = new Point(1, 1, 0);
      const point2 = new Point(1, 5, 0);
      const oval = new Oval("6", "InvalidOval", point1, point2);

      expect(() => service.calculateArea(oval)).toThrow(ValidationException);
      expect(() => service.calculateArea(oval)).toThrow(
        "Semi-major axis must be positive",
      );
    });
  });

  describe("calculatePerimeter", () => {
    test("should calculate perimeter correctly for a standard oval", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const perimeter = service.calculatePerimeter(oval);

      expect(perimeter).toBeGreaterThan(0);
      expect(perimeter).toBeGreaterThan(9);
      expect(perimeter).toBeLessThan(10);
      expect(typeof perimeter).toBe("number");
      expect(Number.isFinite(perimeter)).toBe(true);
    });

    test("should calculate perimeter for a circle", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 4, 0);
      const oval = new Oval("2", "Circle", point1, point2);

      const perimeter = service.calculatePerimeter(oval);

      expect(perimeter).toBeCloseTo(2 * Math.PI * 2, 1);
      expect(perimeter).toBeGreaterThan(12);
      expect(perimeter).toBeLessThan(13);
      expect(typeof perimeter).toBe("number");
    });

    test("should calculate perimeter for oval with negative coordinates", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("3", "NegOval", point1, point2);

      const perimeter = service.calculatePerimeter(oval);

      expect(perimeter).toBeGreaterThan(25);
      expect(perimeter).toBeLessThan(26);
      expect(Number.isFinite(perimeter)).toBe(true);
      expect(typeof perimeter).toBe("number");
    });

    test("should calculate perimeter for very small oval", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(0.2, 0.4, 0);
      const oval = new Oval("4", "SmallOval", point1, point2);

      const perimeter = service.calculatePerimeter(oval);

      expect(perimeter).toBeGreaterThan(0);
      expect(perimeter).toBeLessThan(2);
      expect(Number.isFinite(perimeter)).toBe(true);
      expect(typeof perimeter).toBe("number");
    });

    test("should throw ValidationException for invalid oval", () => {
      const point1 = new Point(1, 4, 0);
      const point2 = new Point(5, 4, 0);
      const oval = new Oval("5", "InvalidOval", point1, point2);

      expect(() => service.calculatePerimeter(oval)).toThrow(
        ValidationException,
      );
      expect(() => service.calculatePerimeter(oval)).toThrow(
        "Semi-minor axis must be positive",
      );
    });
  });

  describe("isValidOval", () => {
    test("should return true for valid oval", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const result = service.isValidOval(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("should return true for valid oval with negative coordinates", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("2", "NegOval", point1, point2);

      const result = service.isValidOval(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for oval with points on vertical line", () => {
      const point1 = new Point(3, 1, 0);
      const point2 = new Point(3, 5, 0);
      const oval = new Oval("3", "InvalidOval", point1, point2);

      const result = service.isValidOval(oval);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for oval with points on horizontal line", () => {
      const point1 = new Point(1, 4, 0);
      const point2 = new Point(5, 4, 0);
      const oval = new Oval("4", "InvalidOval", point1, point2);

      const result = service.isValidOval(oval);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for identical points", () => {
      const point1 = new Point(2, 2, 0);
      const point2 = new Point(2, 2, 0);
      const oval = new Oval("5", "InvalidOval", point1, point2);

      const result = service.isValidOval(oval);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for points in different Z planes", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 5);
      const oval = new Oval("6", "InvalidOval", point1, point2);

      const result = service.isValidOval(oval);

      expect(result).toBe(false);
    });
  });

  describe("isCircle", () => {
    test("should return true for a circle (equal axes)", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 4, 0);
      const oval = new Oval("1", "Circle", point1, point2);

      const result = service.isCircle(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for an ellipse (unequal axes)", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval("2", "Ellipse", point1, point2);

      const result = service.isCircle(oval);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return true for circle with negative coordinates", () => {
      const point1 = new Point(-5, -5, 0);
      const point2 = new Point(5, 5, 0);
      const oval = new Oval("3", "Circle", point1, point2);

      const result = service.isCircle(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for invalid oval", () => {
      const point1 = new Point(3, 1, 0);
      const point2 = new Point(3, 5, 0);
      const oval = new Oval("4", "InvalidOval", point1, point2);

      const result = service.isCircle(oval);

      expect(result).toBe(false);
    });

    test("should return true for very small circle", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(0.2, 0.2, 0);
      const oval = new Oval("5", "SmallCircle", point1, point2);

      const result = service.isCircle(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("intersectsOnlyXAxisAtDistance", () => {
    test("should return true when oval intersects only X axis at specified distance", () => {
      const point1 = new Point(-5, 1, 0);
      const point2 = new Point(5, 5, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const result = service.intersectsOnlyXAxisAtDistance(oval, 3);

      expect(typeof result).toBe("boolean");
    });

    test("should return false when oval intersects both axes", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("2", "TestOval", point1, point2);

      const result = service.intersectsOnlyXAxisAtDistance(oval, 3);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for invalid oval", () => {
      const point1 = new Point(3, 1, 0);
      const point2 = new Point(3, 5, 0);
      const oval = new Oval("3", "InvalidOval", point1, point2);

      const result = service.intersectsOnlyXAxisAtDistance(oval, 2);

      expect(result).toBe(false);
    });

    test("should throw ValidationException for negative distance", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval("4", "TestOval", point1, point2);

      expect(() => service.intersectsOnlyXAxisAtDistance(oval, -5)).toThrow(
        ValidationException,
      );
      expect(() => service.intersectsOnlyXAxisAtDistance(oval, -5)).toThrow(
        "Distance cannot be negative",
      );
    });
  });

  describe("intersectsOnlyYAxisAtDistance", () => {
    test("should return false when oval intersects both axes", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const result = service.intersectsOnlyYAxisAtDistance(oval, 2);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return false for invalid oval", () => {
      const point1 = new Point(1, 4, 0);
      const point2 = new Point(5, 4, 0);
      const oval = new Oval("2", "InvalidOval", point1, point2);

      const result = service.intersectsOnlyYAxisAtDistance(oval, 3);

      expect(result).toBe(false);
    });

    test("should throw ValidationException for negative distance", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval("3", "TestOval", point1, point2);

      expect(() => service.intersectsOnlyYAxisAtDistance(oval, -3)).toThrow(
        ValidationException,
      );
      expect(() => service.intersectsOnlyYAxisAtDistance(oval, -3)).toThrow(
        "Distance cannot be negative",
      );
    });
  });

  describe("intersectsXAxis", () => {
    test("should return true when oval intersects X axis", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const result = service.intersectsXAxis(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("should return false when oval does not intersect X axis", () => {
      const point1 = new Point(0, 5, 0);
      const point2 = new Point(4, 10, 0);
      const oval = new Oval("2", "TestOval", point1, point2);

      const result = service.intersectsXAxis(oval);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return true when oval is centered on X axis", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("3", "TestOval", point1, point2);

      const result = service.intersectsXAxis(oval);

      expect(result).toBe(true);
    });

    test("should return false for invalid oval", () => {
      const point1 = new Point(3, 1, 0);
      const point2 = new Point(3, 5, 0);
      const oval = new Oval("4", "InvalidOval", point1, point2);

      const result = service.intersectsXAxis(oval);

      expect(result).toBe(false);
    });
  });

  describe("intersectsYAxis", () => {
    test("should return true when oval intersects Y axis", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("1", "TestOval", point1, point2);

      const result = service.intersectsYAxis(oval);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("should return false when oval does not intersect Y axis", () => {
      const point1 = new Point(5, 0, 0);
      const point2 = new Point(10, 4, 0);
      const oval = new Oval("2", "TestOval", point1, point2);

      const result = service.intersectsYAxis(oval);

      expect(result).toBe(false);
      expect(typeof result).toBe("boolean");
    });

    test("should return true when oval is centered on Y axis", () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval("3", "TestOval", point1, point2);

      const result = service.intersectsYAxis(oval);

      expect(result).toBe(true);
    });

    test("should return false for invalid oval", () => {
      const point1 = new Point(1, 4, 0);
      const point2 = new Point(5, 4, 0);
      const oval = new Oval("4", "InvalidOval", point1, point2);

      const result = service.intersectsYAxis(oval);

      expect(result).toBe(false);
    });
  });

  describe("calculateEccentricity", () => {
    test("should calculate eccentricity correctly for an ellipse", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(8, 4, 0);
      const oval = new Oval("1", "Ellipse", point1, point2);

      const eccentricity = service.calculateEccentricity(oval);

      expect(eccentricity).toBeGreaterThan(0);
      expect(eccentricity).toBeLessThan(1);
      expect(typeof eccentricity).toBe("number");
      expect(Number.isFinite(eccentricity)).toBe(true);
    });

    test("should return eccentricity close to 0 for a circle", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 4, 0);
      const oval = new Oval("2", "Circle", point1, point2);

      const eccentricity = service.calculateEccentricity(oval);

      expect(eccentricity).toBeCloseTo(0, 10);
      expect(eccentricity).toBeGreaterThanOrEqual(0);
      expect(typeof eccentricity).toBe("number");
    });

    test("should calculate eccentricity for oval with negative coordinates", () => {
      const point1 = new Point(-10, -5, 0);
      const point2 = new Point(10, 5, 0);
      const oval = new Oval("3", "Ellipse", point1, point2);

      const eccentricity = service.calculateEccentricity(oval);

      expect(eccentricity).toBeGreaterThan(0);
      expect(eccentricity).toBeLessThan(1);
      expect(Number.isFinite(eccentricity)).toBe(true);
    });

    test("should throw ValidationException for invalid oval", () => {
      const point1 = new Point(3, 1, 0);
      const point2 = new Point(3, 5, 0);
      const oval = new Oval("4", "InvalidOval", point1, point2);

      expect(() => service.calculateEccentricity(oval)).toThrow(
        ValidationException,
      );
      expect(() => service.calculateEccentricity(oval)).toThrow("invalid oval");
    });
  });

  describe("calculateFocalDistance", () => {
    test("should calculate focal distance correctly for an ellipse", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(8, 4, 0);
      const oval = new Oval("1", "Ellipse", point1, point2);

      const focalDistance = service.calculateFocalDistance(oval);

      expect(focalDistance).toBeGreaterThan(0);
      expect(typeof focalDistance).toBe("number");
      expect(Number.isFinite(focalDistance)).toBe(true);
      expect(focalDistance).toBeCloseTo(Math.sqrt(12), 5);
    });

    test("should return focal distance close to 0 for a circle", () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 4, 0);
      const oval = new Oval("2", "Circle", point1, point2);

      const focalDistance = service.calculateFocalDistance(oval);

      expect(focalDistance).toBeCloseTo(0, 10);
      expect(focalDistance).toBeGreaterThanOrEqual(0);
      expect(typeof focalDistance).toBe("number");
    });

    test("should calculate focal distance for oval with negative coordinates", () => {
      const point1 = new Point(-10, -5, 0);
      const point2 = new Point(10, 5, 0);
      const oval = new Oval("3", "Ellipse", point1, point2);

      const focalDistance = service.calculateFocalDistance(oval);

      expect(focalDistance).toBeGreaterThan(0);
      expect(Number.isFinite(focalDistance)).toBe(true);
      expect(typeof focalDistance).toBe("number");
    });

    test("should throw ValidationException for invalid oval", () => {
      const point1 = new Point(1, 4, 0);
      const point2 = new Point(5, 4, 0);
      const oval = new Oval("4", "InvalidOval", point1, point2);

      expect(() => service.calculateFocalDistance(oval)).toThrow(
        ValidationException,
      );
      expect(() => service.calculateFocalDistance(oval)).toThrow(
        "invalid oval",
      );
    });
  });
});
