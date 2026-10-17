import path from "node:path";
import fs from "node:fs";

const logError = (context, error) => {
  const time = new Date().toISOString();

  const entry = JSON.stringify({
    time,
    context,
    code: error.code,
    message: error.message,
    stack: error.stack,
  });

  console.error(entry);

  try {
    fs.appendFileSync(path.resolve("errors.log"), entry + "\n", "utf-8");
  } catch (logWriteError) {
    console.error(
      `${time}: Could not write to errors.log. ${logWriteError.message}`,
    );
  }
};
