import { primitives, booleans } from '@jscad/modeling';
import type { BoxParameters } from './types';

const { cuboid } = primitives;
const { subtract } = booleans;

export function generateHollowBox(params: BoxParameters) {
  const { wallThickness, layerHeight, boxWidth, boxDepth, boxHeight } = params;

  // Ensure minimum wall thickness and layer height for 3D printing
  const minWallThickness = Math.max(wallThickness, layerHeight * 2);

  // Create outer box
  const outerBox = cuboid({
    size: [boxWidth, boxDepth, boxHeight],
    center: [0, 0, 0]
  });

  // Create inner cavity (subtract wall thickness from all sides)
  const innerWidth = Math.max(0.1, boxWidth - (minWallThickness * 2));
  const innerDepth = Math.max(0.1, boxDepth - (minWallThickness * 2));
  const innerHeight = Math.max(0.1, boxHeight - minWallThickness); // Open top

  const innerBox = cuboid({
    size: [innerWidth, innerDepth, innerHeight],
    center: [0, 0, minWallThickness / 2] // Offset to create bottom wall
  });

  // Create hollow box by subtracting inner from outer
  const hollowBox = subtract(outerBox, innerBox);

  return hollowBox;
}

export function validateParameters(params: BoxParameters): string[] {
  const errors: string[] = [];

  if (params.wallThickness <= 0) {
    errors.push('Wall thickness must be greater than 0');
  }

  if (params.layerHeight <= 0) {
    errors.push('Layer height must be greater than 0');
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

  return errors;
}