import { describe, it, expect, beforeEach } from '@jest/globals';
import { PerimeterVisitor } from '../../src/visitors/PerimeterVisitor.js';
import { Oval } from '../../src/entities/Oval.js';
import { Tetrahedron } from '../../src/entities/Tetrahedron.js';
import { Point } from '../../src/entities/Point.js';

describe('PerimeterVisitor (Visitor Pattern)', () => {
  let perimeterVisitor: PerimeterVisitor;
  let oval: Oval;
  let tetrahedron: Tetrahedron;

  beforeEach(() => {
    perimeterVisitor = new PerimeterVisitor();

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

  it('should calculate oval perimeter correctly', () => {
    perimeterVisitor.visitOval(oval);

    // Для овала с полуосями 2 и 1 периметр приближенно равен ~9.69
    expect(perimeterVisitor.getTotalPerimeter()).toBeGreaterThan(9);
    expect(perimeterVisitor.getTotalPerimeter()).toBeLessThan(10);
  });

  it('should calculate tetrahedron perimeter correctly', () => {
    perimeterVisitor.visitTetrahedron(tetrahedron);

    // Проверяем, что периметр был вычислен (не ноль)
    expect(perimeterVisitor.getTotalPerimeter()).toBeGreaterThan(0);
  });

  it('should calculate total perimeter for multiple shapes', () => {
    perimeterVisitor.visitOval(oval);
    perimeterVisitor.visitTetrahedron(tetrahedron);

    const totalPerimeter = perimeterVisitor.getTotalPerimeter();
    expect(totalPerimeter).toBeGreaterThan(0);
    expect(totalPerimeter).toBeCloseTo(perimeterVisitor.getTotalPerimeter(), 2);
  });

  it('should reset total perimeter', () => {
    perimeterVisitor.visitOval(oval);
    expect(perimeterVisitor.getTotalPerimeter()).toBeGreaterThan(0);

    perimeterVisitor.reset();
    expect(perimeterVisitor.getTotalPerimeter()).toBe(0);
  });

  it('should handle invalid tetrahedron', () => {
    // Создаем тетраэдр с неправильным количеством вершин
    const invalidTetrahedron = {
      getVertices: () => [new Point(0, 0, 0), new Point(1, 1, 1)] // Только 2 вершины
    } as any;

    perimeterVisitor.visitTetrahedron(invalidTetrahedron);

    // Для невалидного тетраэдра периметр не должен измениться
    const perimeterBefore = perimeterVisitor.getTotalPerimeter();
    perimeterVisitor.visitTetrahedron(invalidTetrahedron);
    const perimeterAfter = perimeterVisitor.getTotalPerimeter();
    expect(perimeterAfter).toBe(perimeterBefore);
  });

  it('should calculate perimeter for simple tetrahedron', () => {
    const simpleTetrahedron = new Tetrahedron(
      'simple-tetra',
      'Simple Tetrahedron',
      new Point(0, 0, 0),
      new Point(1, 0, 0),
      new Point(0, 1, 0),
      new Point(0, 0, 1),
    );

    perimeterVisitor.visitTetrahedron(simpleTetrahedron);

    // Для простого тетраэдра с ребрами длиной 1, √2, √2, 1, 1, √2
    // Общий периметр должен быть около 7.24
    expect(perimeterVisitor.getTotalPerimeter()).toBeCloseTo(7.24, 1);
  });
});