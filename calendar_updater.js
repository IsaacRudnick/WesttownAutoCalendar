const { addWeeks } = require("date-fns");
const { google } = require("googleapis");
const User = require("./models/user");
const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require("toad-scheduler");
const scheduler = new ToadScheduler();
// get JSON from internet
const fetch = require("node-fetch");
const ical = require("node-ical");

const scopes = ["https://www.googleapis.com/auth/calendar"];
const client = new google.auth.GoogleAuth({
  keyFile: "./service_account_key.json",
  scopes,
});

const calendar = google.calendar({ version: "v3", auth: client });

// calendar.events.list(
//   {
//     calendarId: "roo.turin@gmail.com",
//     timeMin: new Date().toISOString(),
//     // Get all events in the next 2 months
//     timeMax: addWeeks(new Date(), 2 * 4).toISOString(),
//     singleEvents: true,
//     orderBy: "startTime",
//   },
//   (err, res) => {
//     if (err) {
//       console.log(`The API returned an error: ${err}`);
//     }
//     const appointments = res.data.items.map((appointment) => ({
//       name: appointment.summary,
//       start: appointment.start.dateTime || appointment.start.date,
//       end: appointment.end.dateTime || appointment.end.date,
//       id: appointment.id,
//       status: appointment.status,
//       creator: appointment.creator,
//       description: appointment.description,
//     }));
//     console.log(appointments);
//   }
// );

async function update_user(user) {
  fetch(user.ical_feed_url, { method: "GET" })
    .then((res) => res.text())
    .then((text) => {
      // Parse the raw iCal data
      const ical_events = ical.sync.parseICS(text);

      // Get a list of all the google calendar events for this user
      gcal_events = calendar.events.list(
        {
          calendarId: user.email,
          timeMin: new Date().toISOString(),
          timeMax: addWeeks(new Date(), 2 * 4).toISOString(),
        },
        (err, res) => {
          gcal_events = res.data.items;
        }
      );

      for (const x in ical_events) {
        ical_event = ical_events[x];
        if (ical_event.type !== "VEVENT") continue;

        refactored_uid = (
          ical_event.summary +
          ical_event.start +
          ical_event.uid.toLowerCase() +
          ical_event.end
        )
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");

        if (gcal_events?.refactored_uid) continue;
        // If the event is not in the google calendar, add it
        console.log("Event doesn't exist in google calendar");
      }
    });
}

async function update_all_users() {
  // For all users in DB, update them using update_user function
  User.find({}, (err, users) => {
    for (var i = 0; i < users.length; i++) {
      update_user(users[i]);
    }
  });
}

// // Create task to check all BGs and schedule it for every 5 minutes (and immediately)
// const update_all_users_task = new AsyncTask(
//   "update all users' calendars",
//   update_all_users,
//   (err) => {
//     console.log(err);
//   }
// );

// scheduler.addSimpleIntervalJob(
//   new SimpleIntervalJob(
//     // Every 2 hours, check all users' feeds and update their calendars
//     { minutes: 2 * 60, runImmediately: true },
//     update_all_users_task
//   )
// );

update_user({
  ical_feed_url:
    "https://westtown.myschoolapp.com/podium/feed/iCal.aspx?z=cOXDirz06uMqQcrHv6xbrJEZh%2bztBuNCX9t%2frXSVl9uF9N9e9STkQbfvqOeH5hif5C5Poq38hqp95ClTGrOdYv2SZKuaINsgs2cl8yqrZ6duI7AQz0l%2bW65hAdeshut4",
  email: "roo.turin@gmail.com",
});
