const { addWeeks } = require("date-fns");
const fs = require("fs");
async function get_gcal_events(email, calendar_client) {
  nextPageToken = null;
  gcal_events = [];
  while (nextPageToken == null) {
    response = await calendar_client.events.list({
      nextPageToken: nextPageToken,
      // The user's primary calendar's ID = their email address
      calendarId: email,
      timeMin: new Date().toISOString(),
      // Goes more than 8 weeks just in case
      timeMax: addWeeks(new Date(), 12).toISOString(),
      // Ignore deleted events
      singleEvents: true,
      orderBy: "startTime",
    });
    gcal_events.push(response.data.items);
    nextPageToken = response.data.nextPageToken;
    "🚀 ~ file: get_gcal_events.js ~ line 19 ~ get_gcal_events ~ nextPageToken", nextPageToken;
  }
  fs.appendFileSync("info.json", JSON.stringify(gcal_events));
  console.log("🚀 ~ file: get_gcal_events.js ~ line 23 ~ get_gcal_events ~ gcal_events", gcal_events);
  return gcal_events;
}

module.exports = get_gcal_events;
