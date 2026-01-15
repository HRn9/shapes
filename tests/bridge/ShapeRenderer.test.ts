import { describe, it, expect, beforeEach } from '@jest/globals';
import { ShapeRenderer } from '../../src/bridge/ShapeRenderer.js';
import { ScreenRenderer } from '../../src/renderers/ScreenRenderer.js';
import { PrinterRenderer } from '../../src/renderers/PrinterRenderer.js';
import { Oval } from '../../src/entities/Oval.js';
import { Tetrahedron } from '../../src/entities/Tetrahedron.js';
import { Point } from '../../src/entities/Point.js';

describe('ShapeRenderer (Bridge Pattern)', () => {
  let screenRenderer: ScreenRenderer;
  let printerRenderer: PrinterRenderer;
  let shapeRenderer: ShapeRenderer;
  let oval: Oval;
  let tetrahedron: Tetrahedron;

  beforeEach(() => {
    screenRenderer = new ScreenRenderer();
    printerRenderer = new PrinterRenderer();
    shapeRenderer = new ShapeRenderer(screenRenderer);

    oval = new Oval(
      'oval-1',
      'Test Oval',
      new Point(0, 0),
      new Point(4, 2),
    );

    tetrahedron = new Tetrahedron(
      'tetra-1',
      'Test Tetrahedron',
      new Point(0, 0, 0),
      new Point(3, 0, 0),
      new Point(0, 4, 0),
      new Point(0, 0, 5),
    );
  });

  it('should render oval on screen', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    shapeRenderer.renderShape(oval);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Rendering Oval')
    );

    consoleSpy.mockRestore();
  });

  it('should render tetrahedron on screen', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    shapeRenderer.renderShape(tetrahedron);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Rendering Tetrahedron')
    );

    consoleSpy.mockRestore();
  });

  it('should render multiple shapes on screen', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const shapes = [oval, tetrahedron];

    shapeRenderer.renderShapes(shapes);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Starting group rendering...')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Rendering Oval')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Rendering Tetrahedron')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Group rendering completed.')
    );

    consoleSpy.mockRestore();
  });

  it('should switch renderer dynamically', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Initially using screen renderer
    shapeRenderer.renderShape(oval);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Rendering Oval')
    );

    // Switch to printer renderer
    shapeRenderer.setRenderer(printerRenderer);
    shapeRenderer.renderShape(oval);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Printer] Printing Oval')
    );

    consoleSpy.mockRestore();
  });

  it('should handle unknown shape type', () => {
    // Create a mock shape that is not Oval or Tetrahedron
    const mockShape = {
      getId: () => 'mock-1',
      getName: () => 'Mock Shape',
      toString: () => 'MockShape[id=mock-1, name=Mock Shape]'
    } as any;

    // В strict режиме должен выбрасываться Error
    expect(() => {
      shapeRenderer.renderShape(mockShape);
    }).toThrow('Unknown shape type: MockShape[id=mock-1, name=Mock Shape]');
  });
});