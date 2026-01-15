import { OvalData, TetrahedronData } from '../types/index.js';

/**
 * Interface for Visitor pattern.
 * Defines operations for visiting different types of geometric shapes.
 * Allows adding new operations to shapes without changing their classes.
 */
export interface Visitor {
  /**
   * Visits an oval to perform an operation
   * @param oval - oval to visit
   */
  visitOval(oval: OvalData): void;

  /**
   * Visits a tetrahedron to perform an operation
   * @param tetrahedron - tetrahedron to visit
   */
  visitTetrahedron(tetrahedron: TetrahedronData): void;
}
