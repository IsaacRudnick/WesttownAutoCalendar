import create_progress_bar from "./create_progress_bar.js";
import log_info from "./log_info.js";
import snooze from "./snooze.js";
import newline from "./newline.js";

/**
 * This function:
 * - Loops through all ical_events
 * - For each ical_event, it checks if the event is already in the google calendar
 * - If it isn't, it creates a new event in the google calendar
 *
 * @param {Array} ical_events Array of all events from the ical feed
 * @param {Array} gcal_events Array of all events from the Google Calendar
 * @param {string} email - the email of the user
 * @param {Object} calendar_client - the Google Calendar client
 * @returns {Array} An array of all provided gcal_events that were not in the ical_events
 */
async function create_new_events(ical_events, gcal_events, email, calendar_client) {
  let progress_bar = create_progress_bar();

  let total_events = Object.values(ical_events).filter((e) => e.type == "VEVENT").length;
  progress_bar.start(total_events, 0);

  log_info(`Creating events on Google Calendar for ${email}`, 1);
  // For loop is written like this to allow for use of async calls *inside* the for loop
  for (const [key, ical_event] of Object.entries(ical_events)) {
    // If not an event (e.g. a timezone or calendar type entry), skip
    if (ical_event.type !== "VEVENT") continue;

    // Create valid google calendar event 'ID' for later use
    // This doesn't use the event's ID property because MySchoolApp changes the ID property sometimes
    // These values are only encoded to Base64 so that it looks cooler to users
    let summary = Buffer.from(ical_event.summary, "utf8").toString("hex");
    let start = Buffer.from(ical_event.start, "utf8").toString("hex");
    let end = Buffer.from(ical_event.end, "utf8").toString("hex");

    let unique_descriptor = `AUTOGENERATED by Westtown AutoCal\n\nID: \n${summary}--${start}--${end}`;

    log_info(`Event: ${ical_event.summary}`, 2, ical_event);

    // Skip this loop if the event already exists in google calendar
    if (gcal_events.filter((e) => e.description === unique_descriptor).length > 0) {
      log_info("Event already exists in Google Calendar; skipping", 3);
      // Remove this event from the static list of fetched gcal_events
      gcal_events = gcal_events.filter((obj) => {
        return obj.description !== unique_descriptor;
      });
    } else {
      log_info("Event doesn't exist in Google Calendar; creating...", 3);
      // Pause each iteration to avoid rate limiting
      await snooze(500);

      calendar_client.events
        .insert({
          calendarId: email,
          resource: {
            start: {
              dateTime: ical_event.start,
              timeZone: ical_event.timeZone,
            },
            end: {
              dateTime: ical_event.end,
              timeZone: ical_event.timeZone,
            },
            summary: ical_event.summary,
            // Use description as unique identifier for google calendar event
            description: unique_descriptor,
            status: "confirmed",
          },
        })
        .then(log_info("Event created", 3));
    }
    newline(1);
    progress_bar.increment();
    newline(1);
  }
  return gcal_events;
}

export default create_new_events;
