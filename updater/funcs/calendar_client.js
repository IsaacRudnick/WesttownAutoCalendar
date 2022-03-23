const { google } = require("googleapis");

const client = new google.auth.GoogleAuth({
  keyFile: "./service_account_key.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar_client = google.calendar({ version: "v3", auth: client });

module.exports = calendar_client;
