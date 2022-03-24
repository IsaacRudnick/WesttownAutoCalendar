import { google } from "googleapis";

const client = new google.auth.GoogleAuth({
  keyFile: "./updater/service_account_key.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar_client = google.calendar({ version: "v3", auth: client });

export default calendar_client;
