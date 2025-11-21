/**
 * Enum representing available shape types.
 * Used by the Factory Method pattern to determine which shape to create.
 */
export enum ShapeType {
  OVAL = 'OVAL',
  TETRAHEDRON = 'TETRAHEDRON',
}

/**
 * Type guard to check if a string is a valid ShapeType.
 */
export function isValidShapeType(value: string): value is ShapeType {
  return Object.values(ShapeType).includes(value as ShapeType);
}

/**
 * Converts a string to ShapeType, case-insensitive.
 * Returns undefined if the string is not a valid shape type.
 */
export function parseShapeType(value: string): ShapeType | undefined {
  const upperValue = value.toUpperCase();

  if (isValidShapeType(upperValue)) {
    return upperValue as ShapeType;
  }

  return undefined;
}
