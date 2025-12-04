import { FileReader } from './readers/FileReader.js';
import { ShapeFactory } from './factories/ShapeFactory.js';
import { ShapeType } from './factories/ShapeType.js';
import { OvalService } from './services/OvalService.js';
import { TetrahedronService } from './services/TetrahedronService.js';
import { Oval } from './entities/Oval.js';
import { Tetrahedron } from './entities/Tetrahedron.js';
import { logger } from './utils/Logger.js';
import { ShapeRepository } from './repositories/ShapeRepository.js';
import { Warehouse } from './warehouse/Warehouse.js';
import { IdSpecification } from './specifications/IdSpecification.js';
import { NameSpecification } from './specifications/NameSpecification.js';
import { QuadrantSpecification } from './specifications/QuadrantSpecification.js';
import { RangeSpecification } from './specifications/RangeSpecification.js';
import { DistanceSpecification } from './specifications/DistanceSpecification.js';
import { IdComparator } from './comparators/IdComparator.js';
import { NameComparator } from './comparators/NameComparator.js';
import { XCoordinateComparator } from './comparators/XCoordinateComparator.js';
import { YCoordinateComparator } from './comparators/YCoordinateComparator.js';

/**
 * Helper function to wait for logger to flush before exiting
 */
async function flushAndExit(code: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  process.exit(code);
}

/**
 * Main application entry point.
 * Demonstrates usage of the shapes repository system.
 */
async function main(): Promise<void> {
  try {
    logger.info('=== Shapes Repository Application Started ===');

    const fileReader = new FileReader();
    const ovalService = new OvalService();
    const tetrahedronService = new TetrahedronService();

    // Read and process Ovals
    logger.info('--- Processing Ovals ---');
    try {
      const ovals = await fileReader.readShapesFromFile(
        'ovals.txt',
        ShapeType.OVAL,
      );
      logger.info(`Successfully loaded ${ovals.length} ovals from file`);

      for (const shape of ovals) {
        const oval = shape as Oval;
        logger.info(`Processing ${oval.getName()}`);

        try {
          // Calculate area
          const area = ovalService.calculateArea(oval);
          logger.info(`  Area: ${area.toFixed(4)}`);

          // Calculate perimeter
          const perimeter = ovalService.calculatePerimeter(oval);
          logger.info(`  Perimeter: ${perimeter.toFixed(4)}`);

          // Check if it's a valid oval
          const isValid = ovalService.isValidOval(oval);
          logger.info(`  Is valid oval: ${isValid}`);

          // Check if it's a circle
          const isCircle = ovalService.isCircle(oval);
          logger.info(`  Is circle: ${isCircle}`);

          // Check axis intersections
          const intersectsX = ovalService.intersectsXAxis(oval);
          const intersectsY = ovalService.intersectsYAxis(oval);
          logger.info(`  Intersects X axis: ${intersectsX}`);
          logger.info(`  Intersects Y axis: ${intersectsY}`);

          // Calculate eccentricity
          const eccentricity = ovalService.calculateEccentricity(oval);
          logger.info(`  Eccentricity: ${eccentricity.toFixed(4)}`);

          // Calculate focal distance
          const focalDistance = ovalService.calculateFocalDistance(oval);
          logger.info(`  Focal distance: ${focalDistance.toFixed(4)}`);

          logger.info('');
        } catch (error) {
          logger.error(`Error processing oval ${oval.getName()}`, error);
        }
      }
    } catch (error) {
      logger.error('Failed to read ovals from file', error);
    }

    // Read and process Tetrahedrons
    logger.info('--- Processing Tetrahedrons ---');
    try {
      const tetrahedrons = await fileReader.readShapesFromFile(
        'tetrahedrons.txt',
        ShapeType.TETRAHEDRON,
      );
      logger.info(
        `Successfully loaded ${tetrahedrons.length} tetrahedrons from file`,
      );

      for (const shape of tetrahedrons) {
        const tetrahedron = shape as Tetrahedron;
        logger.info(`Processing ${tetrahedron.getName()}`);

        try {
          // Calculate volume
          const volume = tetrahedronService.calculateVolume(tetrahedron);
          logger.info(`  Volume: ${volume.toFixed(4)}`);

          // Calculate surface area
          const surfaceArea
            = tetrahedronService.calculateSurfaceArea(tetrahedron);
          logger.info(`  Surface Area: ${surfaceArea.toFixed(4)}`);

          // Check if it's a valid tetrahedron
          const isValid = tetrahedronService.isValidTetrahedron(tetrahedron);
          logger.info(`  Is valid tetrahedron: ${isValid}`);

          // Check if base is on coordinate planes
          const onXY = tetrahedronService.isBaseOnXYPlane(tetrahedron);
          const onXZ = tetrahedronService.isBaseOnXZPlane(tetrahedron);
          const onYZ = tetrahedronService.isBaseOnYZPlane(tetrahedron);
          logger.info(`  Base on XY plane: ${onXY}`);
          logger.info(`  Base on XZ plane: ${onXZ}`);
          logger.info(`  Base on YZ plane: ${onYZ}`);

          // Check if it's regular
          const isRegular
            = tetrahedronService.isRegularTetrahedron(tetrahedron);
          logger.info(`  Is regular tetrahedron: ${isRegular}`);

          // Get edge lengths
          const edges = tetrahedronService.getEdgeLengths(tetrahedron);
          logger.info(
            `  Edge lengths: ${edges.map((e) => e.toFixed(4)).join(', ')}`,
          );

          // Calculate volume ratios for coordinate planes
          try {
            const ratioXY = tetrahedronService.calculateVolumeRatioByXYPlane(
              tetrahedron,
              0,
            );
            logger.info(
              `  Volume ratio by XY plane (z=0): ${ratioXY.toFixed(4)}`,
            );
          } catch (error) {
            logger.debug('Could not calculate volume ratio for XY plane');
          }

          logger.info('');
        } catch (error) {
          logger.error(
            `Error processing tetrahedron ${tetrahedron.getName()}`,
            error,
          );
        }
      }
    } catch (error) {
      logger.error('Failed to read tetrahedrons from file', error);
    }

    // Demonstrate Factory usage
    logger.info('--- Factory Method Demonstration ---');
    const factory = new ShapeFactory();

    // Create an oval using factory
    const customOval = factory.createShape(
      ShapeType.OVAL,
      [0, 0, 10, 6],
      'CustomOval',
    );
    logger.info(`Created shape using factory: ${customOval.toString()}`);

    const ovalArea = ovalService.calculateArea(customOval as Oval);
    logger.info(`Custom oval area: ${ovalArea.toFixed(4)}`);

    // Create a tetrahedron using factory
    const customTetrahedron = factory.createShape(
      ShapeType.TETRAHEDRON,
      [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      'CustomTetrahedron',
    );
    logger.info(`Created shape using factory: ${customTetrahedron.toString()}`);

    const tetraVolume = tetrahedronService.calculateVolume(
      customTetrahedron as Tetrahedron,
    );
    logger.info(`Custom tetrahedron volume: ${tetraVolume.toFixed(4)}`);

    // Demonstrate Repository, Warehouse, Specifications, and Comparators
    logger.info('--- Repository Pattern Demonstration ---');
    const repository = new ShapeRepository();
    const warehouse = Warehouse.getInstance();

    // Add shapes to repository
    logger.info('Adding shapes to repository...');
    repository.add(customOval);
    repository.add(customTetrahedron);

    // Read shapes from file and add to repository
    try {
      const fileOvals = await fileReader.readShapesFromFile(
        'ovals.txt',
        ShapeType.OVAL,
      );
      for (const oval of fileOvals.slice(0, 5)) {
        // Add first 5 ovals
        repository.add(oval);
      }
      logger.info(`Added ${fileOvals.slice(0, 5).length} ovals from file`);
    } catch (error) {
      logger.warn(
        'Could not add ovals from file to repository',
        error instanceof Error ? { error: error.message } : undefined,
      );
    }

    logger.info(`Repository now contains ${repository.size()} shapes`);

    // Demonstrate Warehouse (Singleton + Observer)
    logger.info('--- Warehouse (Singleton + Observer) Demonstration ---');
    const warehouseArea = warehouse.getArea(customOval.getId());
    const warehousePerimeter = warehouse.getPerimeter(customOval.getId());
    const warehouseVolume = warehouse.getVolume(customTetrahedron.getId());
    const warehouseSurfaceArea = warehouse.getSurfaceArea(
      customTetrahedron.getId(),
    );

    logger.info(`Warehouse metrics for ${customOval.getName()}:`);
    logger.info(`  Area: ${warehouseArea?.toFixed(4) ?? 'N/A'}`);
    logger.info(`  Perimeter: ${warehousePerimeter?.toFixed(4) ?? 'N/A'}`);

    logger.info(`Warehouse metrics for ${customTetrahedron.getName()}:`);
    logger.info(`  Volume: ${warehouseVolume?.toFixed(4) ?? 'N/A'}`);
    logger.info(`  Surface Area: ${warehouseSurfaceArea?.toFixed(4) ?? 'N/A'}`);

    const allMetrics = warehouse.getAllMetrics();
    logger.info(`Total metrics stored in Warehouse: ${allMetrics.size}`);

    // Demonstrate Specifications
    logger.info('--- Specification Pattern Demonstration ---');

    // Search by ID
    const idSpec = new IdSpecification(customOval.getId());
    const foundById = repository.findBySpecification(idSpec);
    logger.info(`Found ${foundById.length} shape(s) by ID: ${customOval.getId()}`);

    // Search by name
    const nameSpec = new NameSpecification('Custom', false); // Partial match
    const foundByName = repository.findBySpecification(nameSpec);
    logger.info(`Found ${foundByName.length} shape(s) by name pattern "Custom"`);

    // Search by quadrant
    const firstQuadrantSpec = new QuadrantSpecification(1);
    const firstQuadrantShapes = repository.findBySpecification(
      firstQuadrantSpec,
    );
    logger.info(
      `Found ${firstQuadrantShapes.length} shape(s) in first quadrant`,
    );

    // Search by area range
    const areaRangeSpec = new RangeSpecification(
      (shape) => {
        if (shape instanceof Oval) {
          return ovalService.calculateArea(shape);
        }
        return 0;
      },
      10,
      100,
    );
    const shapesInAreaRange = repository.findBySpecification(areaRangeSpec);
    logger.info(
      `Found ${shapesInAreaRange.length} shape(s) with area between 10 and 100`,
    );

    // Search by volume range
    const volumeRangeSpec = new RangeSpecification(
      (shape) => {
        if (shape instanceof Tetrahedron) {
          return tetrahedronService.calculateVolume(shape);
        }
        return 0;
      },
      0.1,
      1.0,
    );
    const shapesInVolumeRange = repository.findBySpecification(
      volumeRangeSpec,
    );
    logger.info(
      `Found ${shapesInVolumeRange.length} shape(s) with volume between 0.1 and 1.0`,
    );

    // Search by distance from origin
    const distanceSpec = new DistanceSpecification(0, 10);
    const shapesInDistanceRange = repository.findBySpecification(distanceSpec);
    logger.info(
      `Found ${shapesInDistanceRange.length} shape(s) within distance 0-10 from origin`,
    );

    // Combine specifications
    const combinedSpec = firstQuadrantSpec.and(areaRangeSpec);
    const combinedResults = repository.findBySpecification(combinedSpec);
    logger.info(
      `Found ${combinedResults.length} shape(s) in first quadrant AND area 10-100`,
    );

    // Demonstrate Comparators
    logger.info('--- Comparator Pattern Demonstration ---');

    // Sort by ID
    const idComparator = new IdComparator();
    const sortedById = repository.sort(idComparator);
    logger.info(
      `Sorted by ID (first 3): ${sortedById
        .slice(0, 3)
        .map((s) => s.getId())
        .join(', ')}`,
    );

    // Sort by name
    const nameComparator = new NameComparator();
    const sortedByName = repository.sort(nameComparator);
    logger.info(
      `Sorted by name (first 3): ${sortedByName
        .slice(0, 3)
        .map((s) => s.getName())
        .join(', ')}`,
    );

    // Sort by X coordinate
    const xComparator = new XCoordinateComparator();
    const sortedByX = repository.sort(xComparator);
    logger.info(
      `Sorted by X coordinate (first 3): ${sortedByX
        .slice(0, 3)
        .map((s) => s.getId())
        .join(', ')}`,
    );

    // Sort by Y coordinate (reversed)
    const yComparator = new YCoordinateComparator();
    yComparator.setReversed(true);
    const sortedByYReversed = repository.sort(yComparator);
    logger.info(
      `Sorted by Y coordinate (descending, first 3): ${sortedByYReversed
        .slice(0, 3)
        .map((s) => s.getId())
        .join(', ')}`,
    );

    // Demonstrate removal
    logger.info('--- Repository Removal Demonstration ---');
    const removed = repository.remove(customOval.getId());
    logger.info(
      `Removed shape ${customOval.getId()}: ${removed}, Repository size: ${repository.size()}`,
    );

    logger.info('=== Application Completed Successfully ===');
  } catch (error) {
    logger.fatal('Application failed with error', error);
    await flushAndExit(1);
  }
}

// Run the application
main().catch(async (error) => {
  logger.fatal('Unhandled error in main', error);
  await flushAndExit(1);
});
