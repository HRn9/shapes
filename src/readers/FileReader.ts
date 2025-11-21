import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Shape } from '../entities/Shape.js';
import { ShapeFactory } from '../factories/ShapeFactory.js';
import { ShapeType } from '../factories/ShapeType.js';
import { FileReadException } from '../exceptions/FileReadException.js';
import { logger } from '../utils/Logger.js';

/**
 * FileReader class for reading shape data from text files.
 * Handles file reading, parsing, and shape creation with error handling.
 */
export class FileReader {
  private readonly factory: ShapeFactory;
  private readonly LINE_SEPARATOR: RegExp = /\r?\n/;

  constructor() {
    this.factory = new ShapeFactory();
  }

  /**
   * Reads shapes from a file and returns an array of successfully created shapes.
   * Invalid lines are skipped and logged.
   *
   * @param filePath - Relative path to the file from the data directory
   * @param shapeType - Type of shapes expected in the file
   * @returns Array of successfully created Shape objects
   * @throws FileReadException if file cannot be read
   */
  public async readShapesFromFile(filePath: string, shapeType: ShapeType): Promise<Shape[]> {
    try {
      // Resolve absolute path from data directory
      const absolutePath = this.resolveFilePath(filePath);

      logger.info('Reading shapes from file', {
        filePath: absolutePath,
        shapeType,
      });

      // Read file content
      const content = await this.readFileContent(absolutePath);

      // Parse and create shapes
      const shapes = this.parseShapesFromContent(content, shapeType);

      logger.info('Successfully read shapes from file', {
        filePath: absolutePath,
        shapeType,
        totalShapes: shapes.length,
      });

      return shapes;
    } catch (error) {
      if (error instanceof FileReadException) {
        throw error;
      }

      throw new FileReadException(
        `Failed to read shapes from file: ${(error as Error).message}`,
        filePath,
        { shapeType, originalError: (error as Error).message },
      );
    }
  }

  /**
   * Reads file content and returns it as a string.
   */
  private async readFileContent(absolutePath: string): Promise<string> {
    try {
      const content = await readFile(absolutePath, 'utf-8');
      return content;
    } catch (error) {
      throw new FileReadException(
        `Cannot read file: ${(error as Error).message}`,
        absolutePath,
        { originalError: (error as Error).message },
      );
    }
  }

  /**
   * Parses file content and creates Shape objects.
   * Invalid lines are skipped and logged.
   */
  private parseShapesFromContent(content: string, shapeType: ShapeType): Shape[] {
    const shapes: Shape[] = [];
    const lines = content.split(this.LINE_SEPARATOR);

    let lineNumber = 0;

    for (const line of lines) {
      lineNumber += 1;

      // Skip empty lines
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) {
        continue;
      }

      // Skip comments (lines starting with #)
      if (trimmedLine.startsWith('#')) {
        continue;
      }

      try {
        // Try to create shape from line
        const shape = this.factory.createShapeFromLine(shapeType, trimmedLine);

        if (shape === null) {
          // Invalid data, log and skip
          logger.warn('Skipping invalid line', {
            lineNumber,
            line: trimmedLine,
            shapeType,
            reason: 'Failed validation',
          });
          continue;
        }

        shapes.push(shape);

        logger.debug('Successfully created shape from line', {
          lineNumber,
          shapeId: shape.getId(),
          shapeName: shape.getName(),
        });
      } catch (error) {
        // Log error and continue to next line
        logger.warn('Error processing line', {
          lineNumber,
          line: trimmedLine,
          shapeType,
          error: (error as Error).message,
        });
      }
    }

    return shapes;
  }

  /**
   * Resolves file path relative to the data directory.
   */
  private resolveFilePath(filePath: string): string {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const projectRoot = resolve(currentDir, '..', '..');
    const dataDir = resolve(projectRoot, 'data');
    return resolve(dataDir, filePath);
  }

  /**
   * Reads shapes from multiple files.
   */
  public async readShapesFromFiles(
    filePaths: string[],
    shapeType: ShapeType,
  ): Promise<Shape[]> {
    const allShapes: Shape[] = [];

    for (const filePath of filePaths) {
      try {
        const shapes = await this.readShapesFromFile(filePath, shapeType);
        allShapes.push(...shapes);
      } catch (error) {
        logger.error('Failed to read shapes from file', error, { filePath, shapeType });
        // Continue with next file instead of throwing
      }
    }

    return allShapes;
  }

  /**
   * Validates that a file exists and is readable.
   */
  public async validateFile(filePath: string): Promise<boolean> {
    try {
      const absolutePath = this.resolveFilePath(filePath);
      await readFile(absolutePath, 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }
}
