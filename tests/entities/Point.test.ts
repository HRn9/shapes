import { Point } from '../../src/entities/Point';

describe('Point Entity', () => {
  describe('constructor', () => {
    test('should create a point with 3D coordinates', () => {
      const point = new Point(1, 2, 3);

      expect(point.getX()).toBe(1);
      expect(point.getY()).toBe(2);
      expect(point.getZ()).toBe(3);
    });

    test('should create a point with default z coordinate as 0', () => {
      const point = new Point(5, 10);

      expect(point.getX()).toBe(5);
      expect(point.getY()).toBe(10);
      expect(point.getZ()).toBe(0);
    });

    test('should create a point with negative coordinates', () => {
      const point = new Point(-5, -10, -15);

      expect(point.getX()).toBe(-5);
      expect(point.getY()).toBe(-10);
      expect(point.getZ()).toBe(-15);
    });

    test('should create a point with decimal coordinates', () => {
      const point = new Point(1.5, 2.7, 3.9);

      expect(point.getX()).toBe(1.5);
      expect(point.getY()).toBe(2.7);
      expect(point.getZ()).toBe(3.9);
    });

    test('should create a point at origin', () => {
      const point = new Point(0, 0, 0);

      expect(point.getX()).toBe(0);
      expect(point.getY()).toBe(0);
      expect(point.getZ()).toBe(0);
    });
  });

  describe('getX', () => {
    test('should return x coordinate', () => {
      const point = new Point(42, 0, 0);

      const result = point.getX();

      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });
  });

  describe('getY', () => {
    test('should return y coordinate', () => {
      const point = new Point(0, 84, 0);

      const result = point.getY();

      expect(result).toBe(84);
      expect(typeof result).toBe('number');
    });
  });

  describe('getZ', () => {
    test('should return z coordinate', () => {
      const point = new Point(0, 0, 126);

      const result = point.getZ();

      expect(result).toBe(126);
      expect(typeof result).toBe('number');
    });
  });

  describe('equals', () => {
    test('should return true for identical points', () => {
      const point1 = new Point(1, 2, 3);
      const point2 = new Point(1, 2, 3);

      const result = point1.equals(point2);

      expect(result).toBe(true);
      expect(point2.equals(point1)).toBe(true);
    });

    test('should return false for points with different x coordinate', () => {
      const point1 = new Point(1, 2, 3);
      const point2 = new Point(4, 2, 3);

      const result = point1.equals(point2);

      expect(result).toBe(false);
      expect(point2.equals(point1)).toBe(false);
    });

    test('should return false for points with different y coordinate', () => {
      const point1 = new Point(1, 2, 3);
      const point2 = new Point(1, 5, 3);

      const result = point1.equals(point2);

      expect(result).toBe(false);
      expect(point2.equals(point1)).toBe(false);
    });

    test('should return false for points with different z coordinate', () => {
      const point1 = new Point(1, 2, 3);
      const point2 = new Point(1, 2, 6);

      const result = point1.equals(point2);

      expect(result).toBe(false);
      expect(point2.equals(point1)).toBe(false);
    });

    test('should return true for points at origin', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(0, 0, 0);

      const result = point1.equals(point2);

      expect(result).toBe(true);
      expect(point2.equals(point1)).toBe(true);
    });

    test('should return true for negative coordinate points', () => {
      const point1 = new Point(-5, -10, -15);
      const point2 = new Point(-5, -10, -15);

      const result = point1.equals(point2);

      expect(result).toBe(true);
      expect(point2.equals(point1)).toBe(true);
    });

    test('should return false when comparing with very close but different coordinates', () => {
      const point1 = new Point(1.0, 2.0, 3.0);
      const point2 = new Point(1.0001, 2.0, 3.0);

      const result = point1.equals(point2);

      expect(result).toBe(false);
    });
  });

  describe('toString', () => {
    test('should return formatted string representation', () => {
      const point = new Point(1, 2, 3);

      const result = point.toString();

      expect(result).toBe('Point(1, 2, 3)');
      expect(typeof result).toBe('string');
      expect(result).toContain('Point');
    });

    test('should return formatted string for negative coordinates', () => {
      const point = new Point(-5, -10, -15);

      const result = point.toString();

      expect(result).toBe('Point(-5, -10, -15)');
      expect(result).toContain('-5');
      expect(result).toContain('-10');
      expect(result).toContain('-15');
    });

    test('should return formatted string for decimal coordinates', () => {
      const point = new Point(1.5, 2.7, 3.9);

      const result = point.toString();

      expect(result).toBe('Point(1.5, 2.7, 3.9)');
      expect(result).toContain('1.5');
      expect(result).toContain('2.7');
    });

    test('should return formatted string for point at origin', () => {
      const point = new Point(0, 0, 0);

      const result = point.toString();

      expect(result).toBe('Point(0, 0, 0)');
      expect(result).toMatch(/Point\(0, 0, 0\)/);
    });
  });

  describe('immutability', () => {
    test('should not allow modification of x coordinate through getter', () => {
      const point = new Point(1, 2, 3);
      const x = point.getX();

      // This won't affect the point since we're working with primitives
      const modifiedX = x + 10;

      expect(point.getX()).toBe(1);
      expect(modifiedX).toBe(11);
    });

    test('should maintain same values after multiple getter calls', () => {
      const point = new Point(5, 10, 15);

      const x1 = point.getX();
      const x2 = point.getX();
      const y1 = point.getY();
      const y2 = point.getY();

      expect(x1).toBe(x2);
      expect(y1).toBe(y2);
      expect(x1).toBe(5);
    });
  });
});
