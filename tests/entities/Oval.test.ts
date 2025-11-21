import { Oval } from '../../src/entities/Oval';
import { Point } from '../../src/entities/Point';

describe('Oval Entity', () => {
  describe('constructor', () => {
    test('should create an oval with id, name, and two points', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      expect(oval.getId()).toBe('1');
      expect(oval.getName()).toBe('TestOval');
      expect(oval.getPoint1()).toBe(point1);
      expect(oval.getPoint2()).toBe(point2);
    });

    test('should create an oval with negative coordinates', () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval('2', 'NegativeOval', point1, point2);

      expect(oval.getId()).toBe('2');
      expect(oval.getName()).toBe('NegativeOval');
      expect(oval.getPoint1().getX()).toBe(-5);
      expect(oval.getPoint2().getX()).toBe(5);
    });

    test('should create an oval with decimal coordinates', () => {
      const point1 = new Point(1.5, 2.5, 0);
      const point2 = new Point(6.5, 8.5, 0);
      const oval = new Oval('3', 'DecimalOval', point1, point2);

      expect(oval.getPoint1().getX()).toBe(1.5);
      expect(oval.getPoint2().getY()).toBe(8.5);
      expect(typeof oval.getPoint1().getX()).toBe('number');
    });
  });

  describe('getPoint1', () => {
    test('should return the first point', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const result = oval.getPoint1();

      expect(result).toBe(point1);
      expect(result.getX()).toBe(0);
      expect(result.getY()).toBe(0);
    });
  });

  describe('getPoint2', () => {
    test('should return the second point', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const result = oval.getPoint2();

      expect(result).toBe(point2);
      expect(result.getX()).toBe(4);
      expect(result.getY()).toBe(2);
    });
  });

  describe('getCenterX', () => {
    test('should calculate center X coordinate correctly', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const centerX = oval.getCenterX();

      expect(centerX).toBe(2);
      expect(typeof centerX).toBe('number');
    });

    test('should calculate center X for negative coordinates', () => {
      const point1 = new Point(-10, 0, 0);
      const point2 = new Point(10, 0, 0);
      const oval = new Oval('2', 'TestOval', point1, point2);

      const centerX = oval.getCenterX();

      expect(centerX).toBe(0);
      expect(typeof centerX).toBe('number');
    });

    test('should calculate center X for asymmetric oval', () => {
      const point1 = new Point(2, 0, 0);
      const point2 = new Point(8, 0, 0);
      const oval = new Oval('3', 'TestOval', point1, point2);

      const centerX = oval.getCenterX();

      expect(centerX).toBe(5);
      expect(Number.isFinite(centerX)).toBe(true);
    });

    test('should calculate center X for decimal coordinates', () => {
      const point1 = new Point(1.5, 0, 0);
      const point2 = new Point(6.5, 0, 0);
      const oval = new Oval('4', 'TestOval', point1, point2);

      const centerX = oval.getCenterX();

      expect(centerX).toBe(4);
      expect(typeof centerX).toBe('number');
    });
  });

  describe('getCenterY', () => {
    test('should calculate center Y coordinate correctly', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const centerY = oval.getCenterY();

      expect(centerY).toBe(1);
      expect(typeof centerY).toBe('number');
    });

    test('should calculate center Y for negative coordinates', () => {
      const point1 = new Point(0, -10, 0);
      const point2 = new Point(0, 10, 0);
      const oval = new Oval('2', 'TestOval', point1, point2);

      const centerY = oval.getCenterY();

      expect(centerY).toBe(0);
      expect(typeof centerY).toBe('number');
    });

    test('should calculate center Y for asymmetric oval', () => {
      const point1 = new Point(0, 3, 0);
      const point2 = new Point(0, 9, 0);
      const oval = new Oval('3', 'TestOval', point1, point2);

      const centerY = oval.getCenterY();

      expect(centerY).toBe(6);
      expect(Number.isFinite(centerY)).toBe(true);
    });

    test('should calculate center Y for decimal coordinates', () => {
      const point1 = new Point(0, 2.5, 0);
      const point2 = new Point(0, 8.5, 0);
      const oval = new Oval('4', 'TestOval', point1, point2);

      const centerY = oval.getCenterY();

      expect(centerY).toBe(5.5);
      expect(typeof centerY).toBe('number');
    });
  });

  describe('getSemiMajorAxis', () => {
    test('should calculate semi-major axis correctly', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(8, 4, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const semiMajorAxis = oval.getSemiMajorAxis();

      expect(semiMajorAxis).toBe(4);
      expect(typeof semiMajorAxis).toBe('number');
      expect(semiMajorAxis).toBeGreaterThan(0);
    });

    test('should calculate semi-major axis for negative coordinates', () => {
      const point1 = new Point(-10, 0, 0);
      const point2 = new Point(10, 0, 0);
      const oval = new Oval('2', 'TestOval', point1, point2);

      const semiMajorAxis = oval.getSemiMajorAxis();

      expect(semiMajorAxis).toBe(10);
      expect(semiMajorAxis).toBeGreaterThan(0);
    });

    test('should calculate semi-major axis using absolute value', () => {
      const point1 = new Point(10, 0, 0);
      const point2 = new Point(0, 0, 0);
      const oval = new Oval('3', 'TestOval', point1, point2);

      const semiMajorAxis = oval.getSemiMajorAxis();

      expect(semiMajorAxis).toBe(5);
      expect(semiMajorAxis).toBeGreaterThan(0);
      expect(Number.isFinite(semiMajorAxis)).toBe(true);
    });

    test('should calculate semi-major axis for decimal coordinates', () => {
      const point1 = new Point(1.5, 0, 0);
      const point2 = new Point(6.5, 0, 0);
      const oval = new Oval('4', 'TestOval', point1, point2);

      const semiMajorAxis = oval.getSemiMajorAxis();

      expect(semiMajorAxis).toBe(2.5);
      expect(typeof semiMajorAxis).toBe('number');
    });
  });

  describe('getSemiMinorAxis', () => {
    test('should calculate semi-minor axis correctly', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(8, 4, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const semiMinorAxis = oval.getSemiMinorAxis();

      expect(semiMinorAxis).toBe(2);
      expect(typeof semiMinorAxis).toBe('number');
      expect(semiMinorAxis).toBeGreaterThan(0);
    });

    test('should calculate semi-minor axis for negative coordinates', () => {
      const point1 = new Point(0, -6, 0);
      const point2 = new Point(0, 6, 0);
      const oval = new Oval('2', 'TestOval', point1, point2);

      const semiMinorAxis = oval.getSemiMinorAxis();

      expect(semiMinorAxis).toBe(6);
      expect(semiMinorAxis).toBeGreaterThan(0);
    });

    test('should calculate semi-minor axis using absolute value', () => {
      const point1 = new Point(0, 10, 0);
      const point2 = new Point(0, 0, 0);
      const oval = new Oval('3', 'TestOval', point1, point2);

      const semiMinorAxis = oval.getSemiMinorAxis();

      expect(semiMinorAxis).toBe(5);
      expect(semiMinorAxis).toBeGreaterThan(0);
      expect(Number.isFinite(semiMinorAxis)).toBe(true);
    });

    test('should calculate semi-minor axis for decimal coordinates', () => {
      const point1 = new Point(0, 2.5, 0);
      const point2 = new Point(0, 8.5, 0);
      const oval = new Oval('4', 'TestOval', point1, point2);

      const semiMinorAxis = oval.getSemiMinorAxis();

      expect(semiMinorAxis).toBe(3);
      expect(typeof semiMinorAxis).toBe('number');
    });
  });

  describe('toString', () => {
    test('should return formatted string representation', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const result = oval.toString();

      expect(result).toContain('Oval');
      expect(result).toContain('id=1');
      expect(result).toContain('name=TestOval');
      expect(result).toContain('Point(0, 0, 0)');
      expect(result).toContain('Point(4, 2, 0)');
      expect(typeof result).toBe('string');
    });

    test('should include negative coordinates in string', () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);
      const oval = new Oval('2', 'NegativeOval', point1, point2);

      const result = oval.toString();

      expect(result).toContain('-5');
      expect(result).toContain('-3');
      expect(result).toContain('NegativeOval');
      expect(typeof result).toBe('string');
    });

    test('should include decimal coordinates in string', () => {
      const point1 = new Point(1.5, 2.5, 0);
      const point2 = new Point(6.5, 8.5, 0);
      const oval = new Oval('3', 'DecimalOval', point1, point2);

      const result = oval.toString();

      expect(result).toContain('1.5');
      expect(result).toContain('8.5');
      expect(result).toContain('DecimalOval');
    });
  });

  describe('inheritance from Shape', () => {
    test('should inherit getId method from Shape', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('SHAPE_001', 'TestOval', point1, point2);

      expect(oval.getId()).toBe('SHAPE_001');
      expect(typeof oval.getId()).toBe('string');
    });

    test('should inherit getName method from Shape', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'MyCustomOval', point1, point2);

      expect(oval.getName()).toBe('MyCustomOval');
      expect(typeof oval.getName()).toBe('string');
    });
  });

  describe('immutability', () => {
    test('should not allow direct modification of points', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const retrievedPoint1 = oval.getPoint1();

      // Points are immutable, so this doesn't affect the oval
      expect(retrievedPoint1.getX()).toBe(0);
      expect(oval.getPoint1().getX()).toBe(0);
    });

    test('should maintain consistent values across multiple getter calls', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);
      const oval = new Oval('1', 'TestOval', point1, point2);

      const centerX1 = oval.getCenterX();
      const centerX2 = oval.getCenterX();
      const semiMajor1 = oval.getSemiMajorAxis();
      const semiMajor2 = oval.getSemiMajorAxis();

      expect(centerX1).toBe(centerX2);
      expect(semiMajor1).toBe(semiMajor2);
      expect(centerX1).toBe(2);
      expect(semiMajor1).toBe(2);
    });
  });

  describe('edge cases', () => {
    test('should handle very small oval', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(0.001, 0.002, 0);
      const oval = new Oval('1', 'TinyOval', point1, point2);

      expect(oval.getSemiMajorAxis()).toBe(0.0005);
      expect(oval.getSemiMinorAxis()).toBe(0.001);
      expect(oval.getCenterX()).toBe(0.0005);
      expect(oval.getCenterY()).toBe(0.001);
    });

    test('should handle very large oval', () => {
      const point1 = new Point(-1000000, -500000, 0);
      const point2 = new Point(1000000, 500000, 0);
      const oval = new Oval('2', 'HugeOval', point1, point2);

      expect(oval.getSemiMajorAxis()).toBe(1000000);
      expect(oval.getSemiMinorAxis()).toBe(500000);
      expect(oval.getCenterX()).toBe(0);
      expect(oval.getCenterY()).toBe(0);
    });

    test('should handle oval with equal axes (circle)', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(10, 10, 0);
      const oval = new Oval('3', 'Circle', point1, point2);

      expect(oval.getSemiMajorAxis()).toBe(5);
      expect(oval.getSemiMinorAxis()).toBe(5);
      expect(oval.getSemiMajorAxis()).toBe(oval.getSemiMinorAxis());
    });
  });
});
