import { Renderer } from '../renderers/Renderer.js';
import { Shape } from '../entities/Shape.js';
import { Oval } from '../entities/Oval.js';
import { Tetrahedron } from '../entities/Tetrahedron.js';
import { RenderingSystemConfig } from '../types/index.js';

/**
 * Bridge pattern class for combining shapes and renderers
 */
export class ShapeRenderer {
  private renderer: Renderer;
  private config: RenderingSystemConfig;

  constructor(renderer: Renderer, config?: Partial<RenderingSystemConfig>) {
    this.renderer = renderer;
    this.config = {
      defaultRenderer: 'screen',
      batchMode: false,
      groupRendering: true,
      errorHandling: 'strict',
      ...config,
    };
  }

  public setRenderer(renderer: Renderer): void {
    this.renderer = renderer;
  }

  public setConfig(config: Partial<RenderingSystemConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): RenderingSystemConfig {
    return { ...this.config };
  }

  public renderShape(shape: Shape): void {
    if (shape instanceof Oval) {
      this.renderer.renderOval(shape);
    } else if (shape instanceof Tetrahedron) {
      this.renderer.renderTetrahedron(shape);
    } else if (this.config.errorHandling === 'strict') {
      throw new Error(`Unknown shape type: ${shape.toString()}`);
    } else {
      console.log(`❓ Unknown shape type: ${shape.toString()}`);
    }
  }

  public renderShapes(shapes: Shape[]): void {
    if (this.config.groupRendering) {
      this.renderer.beginGroup();
    }

    for (const shape of shapes) {
      this.renderShape(shape);
    }

    if (this.config.groupRendering) {
      this.renderer.endGroup();
    }
  }
}
