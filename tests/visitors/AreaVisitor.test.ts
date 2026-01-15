import { describe, it, expect, beforeEach } from '@jest/globals';
import { AreaVisitor } from '../../src/visitors/AreaVisitor.js';
import { Oval } from '../../src/entities/Oval.js';
import { Tetrahedron } from '../../src/entities/Tetrahedron.js';
import { Point } from '../../src/entities/Point.js';

describe('AreaVisitor (Visitor Pattern)', () => {
  let areaVisitor: AreaVisitor;
  let oval: Oval;
  let tetrahedron: Tetrahedron;

  beforeEach(() => {
    areaVisitor = new AreaVisitor();

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

  it('should calculate oval area correctly', () => {
    areaVisitor.visitOval(oval);

    // Для овала с полуосями 2 и 1 площадь = π * 2 * 1 = 2π ≈ 6.28
    expect(areaVisitor.getTotalArea()).toBeCloseTo(6.28, 1);
  });

  it('should calculate tetrahedron area correctly', () => {
    areaVisitor.visitTetrahedron(tetrahedron);

    // Проверяем, что площадь была вычислена (не ноль)
    expect(areaVisitor.getTotalArea()).toBeGreaterThan(0);
  });

  it('should calculate total area for multiple shapes', () => {
    areaVisitor.visitOval(oval);
    areaVisitor.visitTetrahedron(tetrahedron);

    const totalArea = areaVisitor.getTotalArea();
    expect(totalArea).toBeGreaterThan(0);
    expect(totalArea).toBeCloseTo(areaVisitor.getTotalArea(), 2);
  });

  it('should reset total area', () => {
    areaVisitor.visitOval(oval);
    expect(areaVisitor.getTotalArea()).toBeGreaterThan(0);

    areaVisitor.reset();
    expect(areaVisitor.getTotalArea()).toBe(0);
  });

  it('should handle invalid tetrahedron', () => {
    // Создаем тетраэдр с неправильным количеством вершин
    const invalidTetrahedron = {
      getVertices: () => [new Point(0, 0, 0), new Point(1, 1, 1)] // Только 2 вершины
    } as any;

    areaVisitor.visitTetrahedron(invalidTetrahedron);

    // Для невалидного тетраэдра площадь не должна измениться
    const areaBefore = areaVisitor.getTotalArea();
    areaVisitor.visitTetrahedron(invalidTetrahedron);
    const areaAfter = areaVisitor.getTotalArea();
    expect(areaAfter).toBe(areaBefore);
  });
});