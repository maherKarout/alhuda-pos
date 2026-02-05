import { stringifyAllValues } from "./object-converter";

/**
 * Converts an object to a search params string
 * @param obj - The object to convert
 * @returns A search params string (e.g., "key1=value1&key2=value2")
 */
export function objectToSearchParams(obj: Record<string, any>): string {
  // First convert all values to strings using existing helper
  const stringifiedObj = stringifyAllValues(obj);

  // Create URLSearchParams object
  const searchParams = new URLSearchParams();

  // Add each key-value pair to the search params
  Object.entries(stringifiedObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "undefined") {
      searchParams.append(key, value);
    }
  });

  // Return the search params string
  return searchParams.toString();
}

/**
 * Converts an object to a search params string with a leading question mark
 * @param obj - The object to convert
 * @returns A search params string with leading ? (e.g., "?key1=value1&key2=value2")
 */
export function objectToSearchParamsWithQuestionMark(obj: Record<string, any>): string {
  const searchParamsString = objectToSearchParams(obj);
  return searchParamsString ? `?${searchParamsString}` : "";
}
