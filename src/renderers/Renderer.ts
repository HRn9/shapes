/**
 * Interface for rendering geometric shapes on different devices.
 * Defines basic operations for displaying shapes.
 * Allows changing the rendering implementation without modifying the shape code.
 */
export interface Renderer {
  /**
   * Renders an oval on the device
   * @param oval - oval to render
   */
  renderOval(oval: { getId: () => string; getName: () => string; toString: () => string }): void;

  /**
   * Renders a tetrahedron on the device
   * @param tetrahedron - tetrahedron to render
   */
  renderTetrahedron(tetrahedron: { getId: () => string; getName: () => string; toString: () => string }): void;

  /**
   * Begins grouping shapes
   */
  beginGroup(): void;

  /**
   * Ends grouping shapes
   */
  endGroup(): void;
}
