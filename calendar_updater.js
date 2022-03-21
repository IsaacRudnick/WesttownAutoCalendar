const { addWeeks } = require("date-fns");
const { google } = require("googleapis");
const service_account = require("./service_account_key.json");
const User = require("../models/user");

const scopes = ["https://www.googleapis.com/auth/calendar"];

const client = new google.auth.GoogleAuth({
  keyFile: "./service_account_key.json",
  scopes,
});

client.subject = service_account.client_email;

const calendar = google.calendar({ version: "v3", auth: client });

calendar.events.list(
  {
    calendarId: "roo.turin@gmail.com",
    timeMin: new Date().toISOString(),
    timeMax: addWeeks(new Date(), 1).toISOString(), // Let's get events for one week
    singleEvents: true,
    orderBy: "startTime",
  },
  (err, res) => {
    if (err) {
      console.log(`The API returned an error: ${err}`);
    }
    // console.log(res.data.items) // All data
    const appointments = res.data.items.map((appointment) => ({
      start: appointment.start.dateTime || appointment.start.date,
      end: appointment.end.dateTime || appointment.end.date,
      id: appointment.id,
      status: appointment.status,
      creator: appointment.creator,
      description: appointment.description,
    }));
    console.log(appointments);
  }
);
