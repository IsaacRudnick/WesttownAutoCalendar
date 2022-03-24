import fs from "fs";
import moment from "moment-timezone";
/**
 * This function:
 * - logs the provided message to the console
 * - Writes the message, with the date and time, to the log file
 * @param {string} message the message to be outputted and logged
 * @param {int} indent the number of spaces to indent the log
 * @param {string | Object} extra extra information to be logged and NOT outputted
 */
async function log_info(message, indent, extra = "") {
  // Get current date in format YYYY-MM-DD to write to that log file
  let today = moment().tz("America/New_York").format("YYYY-MM-DD");
  let log_file_path = `./updater/logs/${today}.mylog`;

  console.log(message);

  indent = "\t".repeat(indent + 1);

  // Create new date object in format hh:mm:ss
  let logged_time = new Date().toLocaleTimeString();

  // Ensure consistent formatting of log file whether or not parameter extra is provided
  if (extra != "") extra = JSON.stringify(extra).replace("\n", "\n" + indent) + "\n";

  // message = message.replace("\n", "\n" + indent);

  let to_write = `${logged_time}: \n${indent + message}\n${indent + extra}\n`;

  fs.appendFileSync(log_file_path, to_write);
}

export default log_info;
