import create_progress_bar from "./create_progress_bar.js";
import log_info from "./log_info.js";
import snooze from "./snooze.js";
import newline from "./newline.js";

/**
 * @description Delete all remaining events
 *
 * @param {Array} remaining_events Array of all remaining Google Calendar events
 * @param {string} email email address of user
 * @param {Object} calendar_client Google Calendar client
 */
async function delete_old_events(remaining_events, email, calendar_client) {
  // Remove google calendar events ~made by this script~ that are no longer in the user's ical feed
  let progress_bar = create_progress_bar();
  progress_bar.start(Object.keys(remaining_events).length, 0);

  for (const [key, gcal_event] of Object.entries(remaining_events)) {
    log_info(`Removing event: ${gcal_event.summary}`, 2, gcal_event);
    // Pause each iteration to avoid rate limiting
    await snooze(500);
    calendar_client.events.delete({
      calendarId: email,
      eventId: gcal_event.id,
    });
    // Update progress bar
    newline(1);
    progress_bar.increment();
    newline(1);
  }
}

export default delete_old_events;
