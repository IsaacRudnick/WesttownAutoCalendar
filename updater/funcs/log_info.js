const fs = require("fs");

async function log_info(message, indent, extra = "") {
  // Get current date in format YYYY-MM-DD to write to that log file
  date = new Date().toISOString().slice(0, 10);
  log_file_path = `./logs/${date}.txt`;

  console.log(message);

  indent = "\t".repeat(indent + 1);

  // Create new date object in format hh:mm:ss
  logged_time = new Date().toLocaleTimeString();

  // Ensure consistent formatting of log file whether or not parameter extra is provided
  if (extra != "") extra = JSON.stringify(extra).replace("\n", "\n" + indent) + "\n";

  // message = message.replace("\n", "\n" + indent);

  to_write = `${logged_time}: \n${indent + message}\n${indent + extra}\n`;

  fs.appendFileSync(log_file_path, to_write);
}

module.exports = log_info;
