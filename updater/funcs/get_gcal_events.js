const { addWeeks } = require("date-fns");
const fs = require("fs");
const snooze = require("./snooze");

async function get_gcal_events(email, calendar_client, nextPageToken = "") {
  response_info = await calendar_client.events.list({
    nextPageToken: nextPageToken,
    // The user's primary calendar's ID = their email address
    calendarId: email,
    timeMin: new Date().toISOString(),
    // Goes more than 8 weeks just in case
    timeMax: addWeeks(new Date(), 12).toISOString(),
    // Ignore deleted events
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 100,
  });

  events = response_info.data.items;
  console.log(
    "🚀 ~ file: get_gcal_events.js ~ line 21 ~ get_gcal_events ~ nextPageToken",
    nextPageToken == response_info.data.nextPageToken
  );
  nextPageToken = response_info.data.nextPageToken;

  if (nextPageToken) {
    snooze(1000);
    return events.push(await get_gcal_events(email, calendar_client, nextPageToken));
  } else {
    return {};
  }

  fs.appendFileSync("info.json", JSON.stringify(response_info.data.items));
}

module.exports = get_gcal_events;
