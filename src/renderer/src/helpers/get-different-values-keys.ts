type AnyObject = { [key: string]: any };

function areEqual(value1: any, value2: any): boolean {
  if (value1 === value2) {
    return true;
  }

  if (value1 === null || value1 === undefined || value2 === null || value2 === undefined) {
    return false;
  }

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!areEqual(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof value1 === "object" && typeof value2 === "object") {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!value2.hasOwnProperty(key) || !areEqual(value1[key], value2[key])) {
        return false;
      }
    }

    return true;
  } else {
    // For non-object, non-array values
    return value1 === value2;
  }
}

export function getDifferentValuesKeys(initialValues: AnyObject, values: AnyObject): AnyObject {
  const result: AnyObject = {};

  const allKeys = new Set([...Object.keys(initialValues), ...Object.keys(values)]);

  for (const key of allKeys) {
    if (typeof initialValues[key] === "boolean") {
      result[key] = values[key];
    }
    if (!areEqual(initialValues[key], values[key])) {
      result[key] = values[key];
    }
  }

  return result;
}
