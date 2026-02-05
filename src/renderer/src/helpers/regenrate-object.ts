function funReturnSpecificKeys(obj: Record<string, any>, arrayKeys: string[]) {
  let newObj = { ...obj };
  let neededKeys = {};

  arrayKeys.forEach((k, index) => {
    let nestedKeys = k.split(".");
    if (nestedKeys.length === 1) {
      // it mean not have nested key
      if (newObj.hasOwnProperty(k))
        neededKeys = { ...neededKeys, [k]: newObj[k] };
    } else {
      // it mean have nested key
      let currentObj = newObj;
      for (const n of nestedKeys) {
        if (currentObj[n] && typeof currentObj[n] === "object") {
          currentObj = currentObj[n];
        } else {
          neededKeys = { ...neededKeys, [n]: currentObj[n] };
          break;
        }
      }
    }
  });
  return neededKeys;
}

function removeKeysObj(obj: Record<string, any>, keys: string[]) {
  let newObj = { ...obj };

  keys.forEach((k, index) => {
    const nestedKeys = k.split(".");

    if (nestedKeys.length === 1) {
      if (newObj.hasOwnProperty(k)) {
        delete newObj[k];
      } else {
        newObj = { [k]: newObj[k] };
      }
    } else {
      let currentObj = newObj;
      for (let i = 0; i < nestedKeys.length - 1; i++) {
        if (currentObj && typeof currentObj[nestedKeys[i]] === "object")
          currentObj = currentObj[nestedKeys[i]];
        else break;
      }
      const lastKey = nestedKeys[nestedKeys.length - 1];
      if (currentObj && currentObj.hasOwnProperty(lastKey)) {
        delete currentObj[lastKey];
      }
    }
  });

  return newObj;
}

export function regenerateObject(
  obj: Record<string, Record<string, any> | string | number | boolean>,
  keys: string[],
  removeThisKey: boolean
) {
  let newObj = {};
  if (removeThisKey) newObj = removeKeysObj(obj, keys);
  else newObj = funReturnSpecificKeys(obj, keys);

  return newObj;
}
