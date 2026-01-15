import { fileURLToPath } from 'url';
import { Point } from '../entities/Point.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { ScreenRenderer } from '../renderers/ScreenRenderer.js';
import { PrinterRenderer } from '../renderers/PrinterRenderer.js';
import { ShapeRenderer } from '../bridge/ShapeRenderer.js';
import { AreaVisitor } from '../visitors/AreaVisitor.js';
import { PerimeterVisitor } from '../visitors/PerimeterVisitor.js';
import { RenderingSystemConfig } from '../types/index.js';

/**
 * Example usage of Bridge and Visitor patterns
 */
export class BridgeVisitorExample {
  public static run(): void {
    console.log('Bridge and Visitor patterns - Example usage\n');

    // Create geometric shapes
    const oval = new Oval(
      'oval-1',
      'Ellipse 1',
      new Point(0, 0),
      new Point(4, 2),
    );

    const tetrahedron = new Tetrahedron(
      'tetra-1',
      'Tetrahedron 1',
      new Point(0, 0, 0),
      new Point(3, 0, 0),
      new Point(0, 4, 0),
      new Point(0, 0, 5),
    );

    const shapes = [oval, tetrahedron];

    // Demonstrate Bridge pattern - display on different devices
    console.log('BRIDGE PATTERN - Screen display:');
    const screenRenderer = new ScreenRenderer();
    const screenShapeRenderer = new ShapeRenderer(screenRenderer);
    screenShapeRenderer.renderShapes(shapes);

    console.log('\nBRIDGE PATTERN - Printer output:');
    const printerRenderer = new PrinterRenderer();
    const printerShapeRenderer = new ShapeRenderer(printerRenderer);
    printerShapeRenderer.renderShapes(shapes);

    // Demonstrate advanced Bridge pattern features
    console.log('\nADVANCED BRIDGE FEATURES:');
    const advancedRenderer = new ShapeRenderer(screenRenderer, {
      batchMode: true,
      groupRendering: false,
      errorHandling: 'lenient',
    } as RenderingSystemConfig);
    console.log('Advanced renderer config:', advancedRenderer.getConfig());
    advancedRenderer.renderShape(oval);

    // Demonstrate Visitor pattern - calculate area and perimeter
    console.log('\nVISITOR PATTERN - Area calculation:');
    const areaVisitor = new AreaVisitor();
    for (const shape of shapes) {
      shape.accept(areaVisitor);
    }
    console.log(`Total area: ${areaVisitor.getTotalArea().toFixed(2)}`);

    console.log('\nVISITOR PATTERN - Perimeter calculation:');
    const perimeterVisitor = new PerimeterVisitor();
    for (const shape of shapes) {
      shape.accept(perimeterVisitor);
    }
    console.log(`Total perimeter: ${perimeterVisitor.getTotalPerimeter().toFixed(2)}`);

    // Demonstrate pattern flexibility
    console.log('\nDynamic renderer switching:');
    screenShapeRenderer.setRenderer(printerRenderer);
    console.log('Now screen renderer uses printer:');
    screenShapeRenderer.renderShape(oval);

    console.log('\nExample completed!');
  }
}

// Run example when file is executed directly
const filename = fileURLToPath(import.meta.url);

if (process.argv[1] === filename) {
  BridgeVisitorExample.run();
}
