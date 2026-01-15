import { Renderer } from './Renderer.js';

/**
 * Concrete implementation of Renderer for screen display.
 * Implements Bridge pattern, allowing shapes to be displayed on screen.
 */
export class ScreenRenderer implements Renderer {
  private groupLevel: number = 0;

  public renderOval(oval: { getId: () => string; getName: () => string; toString: () => string }): void {
    console.log(`[Screen] Rendering Oval: ${oval.toString()}`);
  }

  public renderTetrahedron(tetrahedron: { getId: () => string; getName: () => string; toString: () => string }): void {
    console.log(`[Screen] Rendering Tetrahedron: ${tetrahedron.toString()}`);
  }

  public beginGroup(): void {
    this.groupLevel++;
    const indent = '  '.repeat(this.groupLevel - 1);
    console.log(`${indent}[Screen] Starting group rendering...`);
  }

  public endGroup(): void {
    const indent = '  '.repeat(this.groupLevel - 1);
    console.log(`${indent}[Screen] Group rendering completed.`);
    if (this.groupLevel > 0) {
      this.groupLevel--;
    }
  }
}
