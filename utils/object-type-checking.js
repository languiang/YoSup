const isPlainObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === null ||
      Object.getPrototypeOf(value) === Object.prototype)
  );
};

const isRealDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

const isDateString = (value) =>
  typeof value === "string" && isRealDate(new Date(value));

const isNotEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

const isNotEmptyArray = (value) => Array.isArray(value) && value.length > 0;

const isNotEmptyObject = (value) =>
  isPlainObject(value) && Object.keys(value).length > 0;

const isFiniteNumber = (value) => Number.isFinite(value);

export {
  isPlainObject,
  isRealDate,
  isNotEmptyString,
  isDateString,
  isNotEmptyArray,
  isNotEmptyObject,
  isFiniteNumber,
};
