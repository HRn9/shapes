/**
 * Типы для геометрических фигур и визиторов
 */

/**
 * Точка в 3D пространстве
 */
export interface Point3D {
  getX(): number;
  getY(): number;
  getZ(): number;
}

/**
 * Овал, определенный двумя точками ограничивающего прямоугольника
 */
export interface OvalData {
  getSemiMajorAxis(): number;
  getSemiMinorAxis(): number;
}

/**
 * Тетраэдр, определенный четырьмя вершинами
 */
export interface TetrahedronData {
  getVertices(): Point3D[];
}

/**
 * Результат вычисления площади
 */
export interface AreaResult {
  shapeId: string;
  shapeName: string;
  area: number;
}

/**
 * Результат вычисления периметра
 */
export interface PerimeterResult {
  shapeId: string;
  shapeName: string;
  perimeter: number;
}

/**
 * Конфигурация рендерера
 */
export interface RendererConfig {
  format: 'screen' | 'printer';
  colorize: boolean;
  timestamp: boolean;
}

/**
 * Конфигурация визитора
 */
export interface VisitorConfig {
  precision: number;
  includeDetails: boolean;
  logResults: boolean;
}

/**
 * Данные для создания овала
 */
export interface OvalCreationData {
  id: string;
  name: string;
  point1: Point3D;
  point2: Point3D;
}

/**
 * Данные для создания тетраэдра
 */
export interface TetrahedronCreationData {
  id: string;
  name: string;
  vertex1: Point3D;
  vertex2: Point3D;
  vertex3: Point3D;
  vertex4: Point3D;
}

/**
 * Статистика по вычислениям
 */
export interface CalculationStats {
  totalShapes: number;
  totalArea: number;
  totalPerimeter: number;
  averageArea: number;
  averagePerimeter: number;
  calculationTime: number;
}

/**
 * Конфигурация системы рендеринга
 */
export interface RenderingSystemConfig {
  defaultRenderer: 'screen' | 'printer';
  batchMode: boolean;
  groupRendering: boolean;
  errorHandling: 'strict' | 'lenient';
}

/**
 * Конфигурация системы визиторов
 */
export interface VisitorSystemConfig {
  defaultPrecision: number;
  enableCaching: boolean;
  parallelProcessing: boolean;
  validationEnabled: boolean;
}
