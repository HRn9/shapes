import { FileReader } from './readers/FileReader.js';
import { ShapeFactory } from './factories/ShapeFactory.js';
import { ShapeType } from './factories/ShapeType.js';
import { OvalService } from './services/OvalService.js';
import { TetrahedronService } from './services/TetrahedronService.js';
import { Oval } from './entities/Oval.js';
import { Tetrahedron } from './entities/Tetrahedron.js';
import { logger } from './utils/Logger.js';

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
      const ovals = await fileReader.readShapesFromFile('ovals.txt', ShapeType.OVAL);
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
      logger.info(`Successfully loaded ${tetrahedrons.length} tetrahedrons from file`);

      for (const shape of tetrahedrons) {
        const tetrahedron = shape as Tetrahedron;
        logger.info(`Processing ${tetrahedron.getName()}`);

        try {
          // Calculate volume
          const volume = tetrahedronService.calculateVolume(tetrahedron);
          logger.info(`  Volume: ${volume.toFixed(4)}`);

          // Calculate surface area
          const surfaceArea = tetrahedronService.calculateSurfaceArea(tetrahedron);
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
          const isRegular = tetrahedronService.isRegularTetrahedron(tetrahedron);
          logger.info(`  Is regular tetrahedron: ${isRegular}`);

          // Get edge lengths
          const edges = tetrahedronService.getEdgeLengths(tetrahedron);
          logger.info(`  Edge lengths: ${edges.map((e) => e.toFixed(4)).join(', ')}`);

          // Calculate volume ratios for coordinate planes
          try {
            const ratioXY = tetrahedronService.calculateVolumeRatioByXYPlane(tetrahedron, 0);
            logger.info(`  Volume ratio by XY plane (z=0): ${ratioXY.toFixed(4)}`);
          } catch (error) {
            logger.debug('Could not calculate volume ratio for XY plane');
          }

          logger.info('');
        } catch (error) {
          logger.error(`Error processing tetrahedron ${tetrahedron.getName()}`, error);
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

    const tetraVolume = tetrahedronService.calculateVolume(customTetrahedron as Tetrahedron);
    logger.info(`Custom tetrahedron volume: ${tetraVolume.toFixed(4)}`);

    logger.info('=== Application Completed Successfully ===');
  } catch (error) {
    logger.fatal('Application failed with error', error);
    process.exit(1);
  }
}

// Run the application
main().catch((error) => {
  logger.fatal('Unhandled error in main', error);
  process.exit(1);
});
