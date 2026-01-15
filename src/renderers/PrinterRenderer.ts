import { Renderer } from './Renderer.js';

/**
 * Concrete implementation of Renderer for printer output.
 * Implements Bridge pattern, allowing shapes to be printed on printer.
 */
export class PrinterRenderer implements Renderer {
  private groupLevel: number = 0;

  public renderOval(oval: { getId: () => string; getName: () => string; toString: () => string }): void {
    console.log(`[Printer] Printing Oval: ${oval.toString()}`);
  }

  public renderTetrahedron(tetrahedron: { getId: () => string; getName: () => string; toString: () => string }): void {
    console.log(`[Printer] Printing Tetrahedron: ${tetrahedron.toString()}`);
  }

  public beginGroup(): void {
    this.groupLevel++;
    const indent = '  '.repeat(this.groupLevel - 1);
    console.log(`${indent}[Printer] Starting batch printing...`);
  }

  public endGroup(): void {
    const indent = '  '.repeat(this.groupLevel - 1);
    console.log(`${indent}[Printer] Batch printing completed.`);
    if (this.groupLevel > 0) {
      this.groupLevel--;
    }
  }
}
