export const updateNestedProperty = (
  obj: Record<string, any>,
  propertyPath: string | string[],
  value: any
): Record<string, any> => {
  // Handle empty or invalid inputs
  if (!obj || !propertyPath) {
    return obj;
  }

  // Convert property path to array if string
  const properties = Array.isArray(propertyPath) ? propertyPath : propertyPath.split(".");

  const [currentProperty, ...remainingProperties] = properties;

  // Handle invalid property
  if (!currentProperty) {
    return obj;
  }

  // Base case - no more nested properties
  if (!remainingProperties.length) {
    return { ...obj, [currentProperty]: value };
  }

  // Initialize nested object if it doesn't exist
  const currentValue = obj[currentProperty] || {};

  // Recursive case - update nested property
  return {
    ...obj,
    [currentProperty]: updateNestedProperty(currentValue, remainingProperties, value),
  };
};
