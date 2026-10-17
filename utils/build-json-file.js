import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isNotEmptyString } from "./object-type-checking.js";

// READ RECORDS
const getRecords = (filePath) => {
  ensureFile(filePath);

  const data = fs.readFileSync(filePath, "utf-8");

  let records;

  try {
    records = JSON.parse(data);
  } catch (error) {
    throw new Error(`${filePath} has invalid JSON. ${error.message}`);
  }

  if (!Array.isArray(records)) {
    throw new Error(
      `${filePath} must contain a list, but it contains ${typeof records}.`,
    );
  }

  return records;
};

// SAVE RECORDS
const saveRecords = (filePath, records) => {
  const preparedRecords = JSON.stringify(records);
  const tempFileName = `${filePath}.tmp`;
  fs.writeFileSync(tempFileName, preparedRecords, "utf-8");
  fs.renameSync(tempFileName, filePath);
};

// CREATE RECORD
const createRecord = (filePath, record) => {
  const records = getRecords(filePath);

  const newRecord = {
    ...record,
    id: randomUUID(),
  };

  records.push(newRecord);
  saveRecords(filePath, records);

  return newRecord;
};

// UPDATE RECORD
const updateRecord = (filePath, id, updates, protectedFields = []) => {
  const records = getRecords(filePath);

  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;

  const allowedUpdates = { ...updates };
  protectedFields.forEach((field) => delete allowedUpdates[field]);

  records[index] = {
    ...records[index],
    ...allowedUpdates,
    id,
  };

  saveRecords(filePath, records);

  return records[index];
};

// DELETE RECORD
const deleteRecord = (filePath, id) => {
  const records = getRecords(filePath);
  let isSuccessful = false;

  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return isSuccessful;

  const filteredRecords = records.filter((record) => record.id !== id);

  if (filteredRecords.length !== records.length) {
    saveRecords(filePath, filteredRecords);
    isSuccessful = true;
  }

  return isSuccessful;
};

// CREATE BLANK FILE IF MISSING
const ensureFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "[]", "utf-8");
    return;
  }

  if (!isNotEmptyString(fs.readFileSync(filePath, "utf-8"))) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
};

export { getRecords, createRecord, updateRecord, deleteRecord };
