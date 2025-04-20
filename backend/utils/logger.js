import fs from "fs";
import path from "path";

const logFilePath = path.resolve(process.cwd(), "log.txt");

export function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logLine, "utf8");
}
