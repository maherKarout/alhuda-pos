export function generateColors(gradientSteps: number) {
  const baseColor = "#5F2A6E";

  // Convert the base color to RGB format
  const rgbBaseColor = baseColor.substring(1); // Remove the "#" symbol
  const r = parseInt(rgbBaseColor.substring(0, 2), 16);
  const g = parseInt(rgbBaseColor.substring(2, 4), 16);
  const b = parseInt(rgbBaseColor.substring(4, 6), 16);

  // Calculate the step size for each RGB channel
  const rStep = Math.round((255 - r) / gradientSteps);
  const gStep = Math.round((255 - g) / gradientSteps);
  const bStep = Math.round((255 - b) / gradientSteps);

  // Generate the gradient of colors
  const gradientColors = Array.from({ length: gradientSteps }, (_, index) => {
    const rValue = r + rStep * index;
    const gValue = g + gStep * index;
    const bValue = b + bStep * index;
    const hexColor = `#${((1 << 24) | (rValue << 16) | (gValue << 8) | bValue).toString(16).slice(1)}`;
    return hexColor;
  });

  return gradientColors;
}
