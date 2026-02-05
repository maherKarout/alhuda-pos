type stringifyAllValuesType = (obj: Record<string, any>) => Record<string, string>;

export const stringifyAllValues: stringifyAllValuesType = (obj) => {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    return { ...prev, [key]: `${value}` };
  }, {});
};

type typedAllValuesType = (obj: Record<string, string | string[]>) => Record<string, any>;

export const typedAllValues: typedAllValuesType = (obj) => {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    return { ...prev, [key]: parseString(value) };
  }, {});
};

type ParsedType = string | number | boolean | object | null | [];

function parseString(input: string | string[]): ParsedType {
  function isValidMongoId(id: string) {
    if (typeof id !== "string") {
      return false;
    }
    // A MongoDB ObjectId is a 24-character hexadecimal string
    return /^[0-9a-fA-F]{24}$/.test(id) ? id : null;
  }
  // Helper function to check for boolean values
  const parseBoolean = (str: string | string[]): boolean | null => {
    if (typeof str === "string") {
      if (str.toLowerCase() === "true") return true;
      if (str.toLowerCase() === "false") return false;
    } else if (Array.isArray(str)) {
      str.map((value) => parseString(value));
    }
    return null;
  };

  // Helper function to check for numeric values
  const parseNumber = (str: string | string[]): number | null => {
    if (typeof str === "string") {
      if (str === "") return null;

      if (!isNaN(+str) && str?.length >= 24) return null;
      return isNaN(+str) ? null : +str;
    } else if (Array.isArray(str)) {
      str.map((value) => parseString(value));
    }
    return null;
  };

  // Helper function to check for JSON objects/arrays
  const parseJSON = (str: string): object | null => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const mongoIdResult = isValidMongoId(input as string);
  if (mongoIdResult !== null) return mongoIdResult;

  // Attempt to parse as boolean
  const booleanResult = parseBoolean(input);
  if (booleanResult !== null) return booleanResult;

  // Attempt to parse as number
  const numberResult = parseNumber(input);
  if (numberResult !== null) return numberResult;

  // Attempt to parse as JSON
  const jsonResult = parseJSON(input as string);
  if (jsonResult !== null) return jsonResult;

  // Return as string if no other type matched
  return input;
}
