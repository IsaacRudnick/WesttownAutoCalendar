import create_progress_bar from "./create_progress_bar.js";
import log_info from "./log_info.js";
import snooze from "./snooze.js";
import newline from "./newline.js";
import moment from "moment";

// This function is an easter egg. It is called to generate a description for select events
function get_description(event_name) {
  /* =================================== Guaranteed easter eggs =================================== */
  if (event_name.includes("Robotics")) return "Go Metal Moose!";
  if (event_name.includes("Intro to Programming")) return 'print("Hello, World!")';

  /* ============================== Low probability easter eggs (1%) ============================== */
  if (Math.random() > 0.01) return null;
  if (event_name.includes("Computer Science")) return "SSdtIGFuIGVhc3RlciBlZ2ch!";
}

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

    newline(1);
    log_info(`Event: ${ical_event.summary}`, 2, ical_event);

    /* ==================== Check if the event already exists in google calendar ==================== */
    //  and skip this loop iteration if so
    let ical_event_start = moment(ical_event.start).tz("America/New_York").unix();
    let ical_event_end = moment(ical_event.end).tz("America/New_York").unix();

    let related_gcal_event = gcal_events.find((e) => {
      // This is the best way to compare timestamps regardless of timezone that I can find given the inconsistency of MyWesttown's ical feed
      let gcal_event_start = moment(e.start.dateTime).tz("America/New_York").unix();
      let gcal_event_end = moment(e.end.dateTime).tz("America/New_York").unix();

      return (
        e.summary === ical_event.summary && gcal_event_start === ical_event_start && gcal_event_end === ical_event_end
      );
    });

    if (related_gcal_event) {
      log_info("Event already exists in Google Calendar; skipping", 3);
      // Remove this event from the static list of fetched gcal_events
      gcal_events = gcal_events.filter((e) => {
        return e !== related_gcal_event;
      });
    } else {
      /* =============================== Otherwise add event to calendar ============================== */
      log_info("Event doesn't exist in Google Calendar; creating...", 3);
      // Pause each iteration to avoid rate limiting
      await snooze(process.env.API_SLOWDOWN_SNOOZE_MS);

      await calendar_client.events.insert({
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
          // Easter egg
          description: get_description(ical_event.summary),
          status: "confirmed",
        },
      });
      log_info("Event created", 3);
    }
    newline(1);
    progress_bar.increment();
  }
  return gcal_events;
}

export default create_new_events;
