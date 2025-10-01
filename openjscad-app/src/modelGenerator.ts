import { primitives, booleans, expansions } from '@jscad/modeling';
import type { BoxParameters } from './types';

const { cuboid } = primitives;
const { subtract } = booleans;
const { expand } = expansions;

export function generateHollowBox(params: BoxParameters) {
  const { wallThickness, layerHeight, boxWidth, boxDepth, boxHeight, edgeFillet } = params;

  // Calculate the actual box height as closest multiple of layer height without going over
  const layerCount = Math.floor(boxHeight / layerHeight);
  const actualBoxHeight = layerCount * layerHeight;

  // Create outer box (the main rectangular box)
  const outerBox = cuboid({
    size: [boxWidth, boxDepth, actualBoxHeight],
    center: [0, 0, actualBoxHeight / 2] // Center the box with bottom at z=0
  });

  // Calculate inner cavity dimensions
  const innerWidth = boxWidth - (2 * wallThickness);
  const innerDepth = boxDepth - (2 * wallThickness);
  const innerHeight = actualBoxHeight - wallThickness; // Remove material from top, keep bottom wall

  // Ensure inner dimensions are positive
  if (innerWidth <= 0 || innerDepth <= 0 || innerHeight <= 0) {
    throw new Error('Wall thickness is too large for the given box dimensions');
  }

  // Create inner cavity (cut from the top)
  const innerBox = cuboid({
    size: [innerWidth, innerDepth, innerHeight],
    center: [0, 0, wallThickness + (innerHeight / 2)] // Offset by wall thickness from bottom
  });

  // Create hollow box by subtracting inner cavity from outer box
  let hollowBox = subtract(outerBox, innerBox);

  // Apply edge filleting if specified
  if (edgeFillet > 0) {
    hollowBox = expand({
      delta: edgeFillet,
      corners: 'round',
      segments: 16
    }, hollowBox);
  }

  return {
    geometry: hollowBox,
    actualDimensions: {
      width: boxWidth,
      depth: boxDepth,
      height: actualBoxHeight,
      wallThickness: wallThickness,
      layerCount: layerCount,
      innerWidth: innerWidth,
      innerDepth: innerDepth,
      innerHeight: innerHeight
    }
  };
}

export function validateParameters(params: BoxParameters): string[] {
  const errors: string[] = [];

  if (params.wallThickness <= 0) {
    errors.push('Wall thickness must be greater than 0');
  }

  if (params.layerHeight <= 0) {
    errors.push('Layer height must be greater than 0');
  }

  if (params.nozzleSize <= 0) {
    errors.push('Nozzle size must be greater than 0');
  }

  if (params.edgeFillet < 0) {
    errors.push('Edge fillet must be greater than or equal to 0');
  }

  if (params.buildVolumeWidth <= 0) {
    errors.push('Build volume width must be greater than 0');
  }

  if (params.buildVolumeDepth <= 0) {
    errors.push('Build volume depth must be greater than 0');
  }

  if (params.buildVolumeHeight <= 0) {
    errors.push('Build volume height must be greater than 0');
  }

  if (params.boxWidth <= 0) {
    errors.push('Box width must be greater than 0');
  }

  if (params.boxDepth <= 0) {
    errors.push('Box depth must be greater than 0');
  }

  if (params.boxHeight <= 0) {
    errors.push('Box height must be greater than 0');
  }

  if (params.wallThickness * 2 >= params.boxWidth) {
    errors.push('Wall thickness is too large for box width');
  }

  if (params.wallThickness * 2 >= params.boxDepth) {
    errors.push('Wall thickness is too large for box depth');
  }

  if (params.wallThickness >= params.boxHeight) {
    errors.push('Wall thickness is too large for box height');
  }

  // Validate nozzle size relationship to wall thickness
  if (params.wallThickness < params.nozzleSize) {
    errors.push('Wall thickness should be at least equal to nozzle size for proper printing');
  }

  // Validate edge fillet constraints
  if (params.edgeFillet < params.nozzleSize) {
    errors.push('Edge fillet should be at least equal to nozzle size');
  }

  if (params.edgeFillet > params.wallThickness) {
    errors.push('Edge fillet should not exceed wall thickness');
  }

  // Validate box dimensions against build volume
  if (params.boxWidth > params.buildVolumeWidth) {
    errors.push('Box width exceeds build volume width');
  }

  if (params.boxDepth > params.buildVolumeDepth) {
    errors.push('Box depth exceeds build volume depth');
  }

  if (params.boxHeight > params.buildVolumeHeight) {
    errors.push('Box height exceeds build volume height');
  }

  return errors;
}