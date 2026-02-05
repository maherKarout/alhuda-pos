/**
 * Determines if a color is dark or light and returns the appropriate text color
 * @param backgroundColor - The background color in hex format (e.g., "#FF0000") or rgb format
 * @returns "white" for dark backgrounds, "black" for light backgrounds
 */
export const getColorByBackgroundColor = (backgroundColor: string): "white" | "black" => {
  if (!backgroundColor) return "black";

  // Remove spaces and convert to lowercase
  let color = backgroundColor.trim().toLowerCase();

  // Handle rgb/rgba format
  if (color.startsWith("rgb")) {
    const rgbMatch = color.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const r = parseInt(rgbMatch[0]);
      const g = parseInt(rgbMatch[1]);
      const b = parseInt(rgbMatch[2]);
      return isColorDark(r, g, b) ? "white" : "black";
    }
  }

  // Remove # if present
  color = color.replace("#", "");

  // Handle hex format
  if (color.length === 3) {
    // Convert 3-digit hex to 6-digit (e.g., "f0a" becomes "ff00aa")
    color = color
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Validate hex color
  if (!/^[0-9a-f]{6}$/i.test(color)) {
    console.warn(`Invalid color format: ${backgroundColor}`);
    return "black";
  }

  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  return isColorDark(r, g, b) ? "white" : "black";
};

/**
 * Determines if a color is dark based on its RGB values using WCAG luminance calculation
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns true if the color is dark, false if light
 */
const isColorDark = (r: number, g: number, b: number): boolean => {
  // Convert RGB to relative luminance using WCAG formula
  // First convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

  // Threshold for determining dark vs light (0.5 is a good middle ground)
  return luminance < 0.5;
};

/**
 * Alternative function that returns boolean for dark/light check
 * @param backgroundColor - The background color in hex format
 * @returns true if dark, false if light
 */
export const isBackgroundColorDark = (backgroundColor: string): boolean => {
  return getColorByBackgroundColor(backgroundColor) === "white";
};

/**
 * Debug function to test color detection
 * @param backgroundColor - The background color to test
 */
export const debugColorDetection = (backgroundColor: string): void => {
  const textColor = getColorByBackgroundColor(backgroundColor);
  const isDark = isBackgroundColorDark(backgroundColor);

  console.log(`Color: ${backgroundColor}`);
  console.log(`Text should be: ${textColor}`);
  console.log(`Is dark: ${isDark}`);
  console.log("---");
};

/**
 * Test function for your specific colors
 */
export const testCategoryColors = (): void => {
  const colors = [
    "#08468E", // Blue
    "#D9D9D9", // Gray
    "#E3C775", // Yellow/Gold
    "#84CAFF", // Light Blue
    "#3D62A7", // Dark Blue
  ];

  console.log("Testing category colors:");
  colors.forEach(debugColorDetection);
};

export default getColorByBackgroundColor;
