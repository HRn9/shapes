import { OvalValidator } from '../../src/validators/OvalValidator';
import { Point } from '../../src/entities/Point';
import { ValidationException } from '../../src/exceptions/ValidationException';

describe('OvalValidator', () => {
  let validator: OvalValidator;

  beforeEach(() => {
    validator = new OvalValidator();
  });

  describe('validateRawData', () => {
    test('should return true for valid oval data with 4 coordinates', () => {
      const result = validator.validateRawData('0 0 4 2');

      expect(result).toBe(true);
    });

    test('should return true for valid oval data with negative coordinates', () => {
      const result = validator.validateRawData('-5 -3 5 3');

      expect(result).toBe(true);
    });

    test('should return true for valid oval data with decimal numbers', () => {
      const result = validator.validateRawData('1.5 2.5 6.5 8.5');

      expect(result).toBe(true);
    });

    test('should return false for empty string', () => {
      const result = validator.validateRawData('');

      expect(result).toBe(false);
    });

    test('should return false for whitespace only string', () => {
      const result = validator.validateRawData('   ');

      expect(result).toBe(false);
    });

    test('should return false for insufficient data (less than 4 values)', () => {
      const result = validator.validateRawData('1.0 2.0');

      expect(result).toBe(false);
    });

    test('should return false for too much data (more than 4 values)', () => {
      const result = validator.validateRawData('1 2 3 4 5 6');

      expect(result).toBe(false);
    });

    test('should return false for data with non-numeric characters', () => {
      const result = validator.validateRawData('2a.0 3.0 4.0 5.0');

      expect(result).toBe(false);
    });

    test('should return false for data with special characters', () => {
      const result = validator.validateRawData('1.0 2.0 @3.0 4.0');

      expect(result).toBe(false);
    });

    test('should return false for points on same vertical line', () => {
      const result = validator.validateRawData('3.0 1.0 3.0 5.0');

      expect(result).toBe(false);
    });

    test('should return false for points on same horizontal line', () => {
      const result = validator.validateRawData('1.0 4.0 5.0 4.0');

      expect(result).toBe(false);
    });

    test('should return false for identical points', () => {
      const result = validator.validateRawData('2.0 2.0 2.0 2.0');

      expect(result).toBe(false);
    });

    test('should return false for NaN value', () => {
      const result = validator.validateRawData('NaN 1.0 2.0 3.0');

      expect(result).toBe(false);
    });

    test('should return false for Infinity value', () => {
      const result = validator.validateRawData('Infinity 1.0 2.0 3.0');

      expect(result).toBe(false);
    });

    test('should handle multiple spaces between numbers', () => {
      const result = validator.validateRawData('1   2   3   4');

      expect(result).toBe(true);
    });

    test('should handle leading and trailing whitespace', () => {
      const result = validator.validateRawData('  1 2 3 4  ');

      expect(result).toBe(true);
    });
  });

  describe('validatePoints', () => {
    test('should not throw for valid oval points', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 0);

      expect(() => validator.validatePoints(point1, point2)).not.toThrow();
    });

    test('should not throw for valid oval points with negative coordinates', () => {
      const point1 = new Point(-5, -3, 0);
      const point2 = new Point(5, 3, 0);

      expect(() => validator.validatePoints(point1, point2)).not.toThrow();
    });

    test('should throw ValidationException for identical points', () => {
      const point1 = new Point(2, 2, 0);
      const point2 = new Point(2, 2, 0);

      expect(() => validator.validatePoints(point1, point2)).toThrow(ValidationException);
      expect(() => validator.validatePoints(point1, point2)).toThrow('Points cannot be identical');
    });

    test('should throw ValidationException for points on horizontal line', () => {
      const point1 = new Point(1, 4, 0);
      const point2 = new Point(5, 4, 0);

      expect(() => validator.validatePoints(point1, point2)).toThrow(ValidationException);
      expect(() => validator.validatePoints(point1, point2)).toThrow('parallel to X axis');
    });

    test('should throw ValidationException for points on vertical line', () => {
      const point1 = new Point(3, 1, 0);
      const point2 = new Point(3, 5, 0);

      expect(() => validator.validatePoints(point1, point2)).toThrow(ValidationException);
      expect(() => validator.validatePoints(point1, point2)).toThrow('parallel to Y axis');
    });

    test('should throw ValidationException for points in different Z planes', () => {
      const point1 = new Point(0, 0, 0);
      const point2 = new Point(4, 2, 5);

      expect(() => validator.validatePoints(point1, point2)).toThrow(ValidationException);
      expect(() => validator.validatePoints(point1, point2)).toThrow('same Z plane');
    });

    test('should not throw for points forming a valid rectangle', () => {
      const point1 = new Point(1.5, 2.5, 0);
      const point2 = new Point(6.5, 8.5, 0);

      expect(() => validator.validatePoints(point1, point2)).not.toThrow();
    });
  });

  describe('validateAxes', () => {
    test('should not throw for positive axes values', () => {
      expect(() => validator.validateAxes(5, 3)).not.toThrow();
    });

    test('should not throw for equal axes values (circle)', () => {
      expect(() => validator.validateAxes(5, 5)).not.toThrow();
    });

    test('should throw ValidationException for zero semi-major axis', () => {
      expect(() => validator.validateAxes(0, 3)).toThrow(ValidationException);
      expect(() => validator.validateAxes(0, 3)).toThrow('Semi-major axis must be positive');
    });

    test('should throw ValidationException for negative semi-major axis', () => {
      expect(() => validator.validateAxes(-5, 3)).toThrow(ValidationException);
      expect(() => validator.validateAxes(-5, 3)).toThrow('Semi-major axis must be positive');
    });

    test('should throw ValidationException for zero semi-minor axis', () => {
      expect(() => validator.validateAxes(5, 0)).toThrow(ValidationException);
      expect(() => validator.validateAxes(5, 0)).toThrow('Semi-minor axis must be positive');
    });

    test('should throw ValidationException for negative semi-minor axis', () => {
      expect(() => validator.validateAxes(5, -3)).toThrow(ValidationException);
      expect(() => validator.validateAxes(5, -3)).toThrow('Semi-minor axis must be positive');
    });

    test('should throw ValidationException for infinite semi-major axis', () => {
      expect(() => validator.validateAxes(Infinity, 3)).toThrow(ValidationException);
      expect(() => validator.validateAxes(Infinity, 3)).toThrow('finite numbers');
    });

    test('should throw ValidationException for infinite semi-minor axis', () => {
      expect(() => validator.validateAxes(5, Infinity)).toThrow(ValidationException);
      expect(() => validator.validateAxes(5, Infinity)).toThrow('finite numbers');
    });

    test('should throw ValidationException for NaN semi-major axis', () => {
      expect(() => validator.validateAxes(NaN, 3)).toThrow(ValidationException);
    });

    test('should throw ValidationException for NaN semi-minor axis', () => {
      expect(() => validator.validateAxes(5, NaN)).toThrow(ValidationException);
    });

    test('should not throw for very small positive values', () => {
      expect(() => validator.validateAxes(0.001, 0.001)).not.toThrow();
    });

    test('should not throw for very large positive values', () => {
      expect(() => validator.validateAxes(1000000, 500000)).not.toThrow();
    });
  });

  describe('validateOvalShape', () => {
    test('should return true for valid oval shape', () => {
      const result = validator.validateOvalShape(5, 3);

      expect(result).toBe(true);
    });

    test('should return true for circle shape (equal axes)', () => {
      const result = validator.validateOvalShape(5, 5);

      expect(result).toBe(true);
    });

    test('should return false for invalid axes (negative)', () => {
      const result = validator.validateOvalShape(-5, 3);

      expect(result).toBe(false);
    });

    test('should return false for invalid axes (zero)', () => {
      const result = validator.validateOvalShape(0, 3);

      expect(result).toBe(false);
    });

    test('should return false for infinite axes', () => {
      const result = validator.validateOvalShape(Infinity, 3);

      expect(result).toBe(false);
    });

    test('should return false for NaN axes', () => {
      const result = validator.validateOvalShape(NaN, 3);

      expect(result).toBe(false);
    });
  });

  describe('validateArea', () => {
    test('should not throw for positive area', () => {
      expect(() => validator.validateArea(25.5)).not.toThrow();
    });

    test('should throw ValidationException for zero area', () => {
      expect(() => validator.validateArea(0)).toThrow(ValidationException);
      expect(() => validator.validateArea(0)).toThrow('Area must be positive');
    });

    test('should throw ValidationException for negative area', () => {
      expect(() => validator.validateArea(-10)).toThrow(ValidationException);
      expect(() => validator.validateArea(-10)).toThrow('Area must be positive');
    });

    test('should throw ValidationException for infinite area', () => {
      expect(() => validator.validateArea(Infinity)).toThrow(ValidationException);
      expect(() => validator.validateArea(Infinity)).toThrow('finite number');
    });

    test('should throw ValidationException for NaN area', () => {
      expect(() => validator.validateArea(NaN)).toThrow(ValidationException);
    });

    test('should not throw for very small positive area', () => {
      expect(() => validator.validateArea(0.0001)).not.toThrow();
    });

    test('should not throw for very large area', () => {
      expect(() => validator.validateArea(1000000)).not.toThrow();
    });
  });

  describe('validatePerimeter', () => {
    test('should not throw for positive perimeter', () => {
      expect(() => validator.validatePerimeter(15.7)).not.toThrow();
    });

    test('should throw ValidationException for zero perimeter', () => {
      expect(() => validator.validatePerimeter(0)).toThrow(ValidationException);
      expect(() => validator.validatePerimeter(0)).toThrow('Perimeter must be positive');
    });

    test('should throw ValidationException for negative perimeter', () => {
      expect(() => validator.validatePerimeter(-20)).toThrow(ValidationException);
      expect(() => validator.validatePerimeter(-20)).toThrow('Perimeter must be positive');
    });

    test('should throw ValidationException for infinite perimeter', () => {
      expect(() => validator.validatePerimeter(Infinity)).toThrow(ValidationException);
      expect(() => validator.validatePerimeter(Infinity)).toThrow('finite number');
    });

    test('should throw ValidationException for NaN perimeter', () => {
      expect(() => validator.validatePerimeter(NaN)).toThrow(ValidationException);
    });

    test('should not throw for very small positive perimeter', () => {
      expect(() => validator.validatePerimeter(0.001)).not.toThrow();
    });

    test('should not throw for very large perimeter', () => {
      expect(() => validator.validatePerimeter(10000)).not.toThrow();
    });
  });

  describe('validateDistance', () => {
    test('should not throw for positive distance', () => {
      expect(() => validator.validateDistance(10)).not.toThrow();
    });

    test('should not throw for zero distance', () => {
      expect(() => validator.validateDistance(0)).not.toThrow();
    });

    test('should throw ValidationException for negative distance', () => {
      expect(() => validator.validateDistance(-5)).toThrow(ValidationException);
      expect(() => validator.validateDistance(-5)).toThrow('Distance cannot be negative');
    });

    test('should throw ValidationException for infinite distance', () => {
      expect(() => validator.validateDistance(Infinity)).toThrow(ValidationException);
      expect(() => validator.validateDistance(Infinity)).toThrow('finite number');
    });

    test('should throw ValidationException for NaN distance', () => {
      expect(() => validator.validateDistance(NaN)).toThrow(ValidationException);
    });

    test('should not throw for very small distance', () => {
      expect(() => validator.validateDistance(0.0001)).not.toThrow();
    });

    test('should not throw for very large distance', () => {
      expect(() => validator.validateDistance(1000000)).not.toThrow();
    });
  });
});
