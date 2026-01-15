import { describe, it, expect, beforeEach } from '@jest/globals';
import { Oval } from '../../src/entities/Oval.js';
import { Tetrahedron } from '../../src/entities/Tetrahedron.js';
import { Point } from '../../src/entities/Point.js';
import { ScreenRenderer } from '../../src/renderers/ScreenRenderer.js';
import { PrinterRenderer } from '../../src/renderers/PrinterRenderer.js';
import { ShapeRenderer } from '../../src/bridge/ShapeRenderer.js';
import { AreaVisitor } from '../../src/visitors/AreaVisitor.js';
import { PerimeterVisitor } from '../../src/visitors/PerimeterVisitor.js';

describe('Bridge and Visitor Integration', () => {
  let oval: Oval;
  let tetrahedron: Tetrahedron;
  let screenRenderer: ScreenRenderer;
  let printerRenderer: PrinterRenderer;
  let shapeRenderer: ShapeRenderer;
  let areaVisitor: AreaVisitor;
  let perimeterVisitor: PerimeterVisitor;

  beforeEach(() => {
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

    screenRenderer = new ScreenRenderer();
    printerRenderer = new PrinterRenderer();
    shapeRenderer = new ShapeRenderer(screenRenderer);
    areaVisitor = new AreaVisitor();
    perimeterVisitor = new PerimeterVisitor();
  });

  it('should work with both Bridge and Visitor patterns together', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const shapes = [oval, tetrahedron];

    // Используем паттерн Bridge для отображения
    shapeRenderer.renderShapes(shapes);

    // Используем паттерн Visitor для вычислений
    for (const shape of shapes) {
      shape.accept(areaVisitor);
      shape.accept(perimeterVisitor);
    }

    // Проверяем, что оба паттерна работают
    expect(areaVisitor.getTotalArea()).toBeGreaterThan(0);
    expect(perimeterVisitor.getTotalPerimeter()).toBeGreaterThan(0);

    // Проверяем, что рендеринг прошел успешно
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Starting group rendering...')
    );

    consoleSpy.mockRestore();
  });

  it('should demonstrate Bridge pattern flexibility', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const shapes = [oval];

    // Используем экран для отображения
    shapeRenderer.setRenderer(screenRenderer);
    shapeRenderer.renderShapes(shapes);

    // Меняем на принтер
    shapeRenderer.setRenderer(printerRenderer);
    shapeRenderer.renderShapes(shapes);

    // Проверяем, что оба рендерера работают
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Screen] Starting group rendering...')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Printer] Starting batch printing...')
    );

    consoleSpy.mockRestore();
  });

  it('should demonstrate Visitor pattern extensibility', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const shapes = [oval, tetrahedron];

    // Используем AreaVisitor
    for (const shape of shapes) {
      shape.accept(areaVisitor);
    }
    const areaBefore = areaVisitor.getTotalArea();

    // Используем PerimeterVisitor
    for (const shape of shapes) {
      shape.accept(perimeterVisitor);
    }
    const perimeter = perimeterVisitor.getTotalPerimeter();

    // Проверяем, что оба визитора работают независимо
    expect(areaBefore).toBeGreaterThan(0);
    expect(perimeter).toBeGreaterThan(0);
    expect(areaVisitor.getTotalArea()).toBe(areaBefore);

    consoleSpy.mockRestore();
  });

  it('should handle shape accept method correctly', () => {
    // Проверяем, что метод accept правильно вызывает соответствующие методы визитора
    oval.accept(areaVisitor);
    oval.accept(perimeterVisitor);
    tetrahedron.accept(areaVisitor);
    tetrahedron.accept(perimeterVisitor);

    // Проверяем, что визиторы получили данные
    expect(areaVisitor.getTotalArea()).toBeGreaterThan(0);
    expect(perimeterVisitor.getTotalPerimeter()).toBeGreaterThan(0);
  });
});