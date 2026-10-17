const isEqualValue = (a, b) => {
  if (a === null || b === null) return a === b;
  if (a === undefined || b === undefined) return a === b;
  if (typeof a === typeof b) return a === b;
  if (typeof a === "boolean" || typeof b === "boolean") return a === b;
  return String(a) === String(b);
};

const isEqualArray = (source, target) => {
  if (!Array.isArray(target)) return false;
  if (source.length !== target.length) return false;

  return (
    JSON.stringify([...source].sort()) === JSON.stringify([...target].sort())
  );
};

const isEqualObject = (source, target) => {
  for (const [key, value] of Object.entries(source)) {
    if (!(key in target)) return false;

    if (Array.isArray(value)) {
      if (!isEqualArray(value, target[key])) return false;
      continue;
    }

    if (!isEqualValue(value, target[key])) return false;
  }

  return true;
};

export { isEqualArray, isEqualObject, isEqualValue };
