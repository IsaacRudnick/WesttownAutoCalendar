import User from "../models/user.js";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
const scheduler = new ToadScheduler();
import log_info from "./funcs/log_info.js";
import get_ical_events from "./funcs/get_ical_events.js";
import get_gcal_events from "./funcs/get_gcal_events.js";
import calendar_client from "./funcs/calendar_client.js";
import create_new_events from "./funcs/create_new_events.js";
import delete_old_events from "./funcs/delete_old_events.js";
import newline from "./funcs/newline.js";

/**
 * This function:
 * - {@link get_ical_events Gets the user's ical feed}
 * - {@link get_gcal_events Gets the user's google calendar events} (that were made by this program)
 * - {@link create_new_events Generates Google Calendar} events from the user's ical feed that don't exist in the user's google calendar
 * - {@link delete_old_events Deletes incorrect Google Calendar events} that exist in the user's google calendar but not in the user's ical feed
 *
 * @param {string} email email address of user
 * @param {string} ical_feed_url url of user's ical feed
 */
async function update_user(email, ical_feed_url) {
  log_info(`Updating ${email}'s calendar`, 0);

  /* ======================================= Get iCal Events ====================================== */
  log_info("Getting iCal events", 1);
  let ical_events = await get_ical_events(ical_feed_url);
  if (!ical_events) {
    log_info("Skipping this user", 1);
    return;
  }
  log_info(`Found ${Object.entries(ical_events).length} iCal events`, 1);

  /* ================================= Get Google Calendar Events ================================= */
  log_info("Getting Google Calendar events", 1);
  let gcal_events = await get_gcal_events(email, calendar_client);
  if (!gcal_events) {
    log_info("Skipping this user", 1);
    return;
  }
  log_info(`Found ${gcal_events.length} Google Calendar events`, 1);

  // WARNING: uncommenting the below 2 lines will delete ALL google calendar events generated by this script
  // await delete_old_events(gcal_events, email, calendar_client);
  // return;

  /* ======================================= Update Calendar ====================================== */
  log_info("Creating new events", 1);
  let remaining_events = await create_new_events(ical_events, gcal_events, email, calendar_client);

  log_info("Deleting old events", 1);
  await delete_old_events(remaining_events, email, calendar_client);

  newline(1);
  log_info(`Finished updating user: ${email}'s calendar`, 0);
}

/**
 * This function:
 *  - Gets all users with ical feeds set up from the DB
 *  - Calls {@link update_user} for each user
 */
async function update_all_users() {
  // For all users in DB, update them using update_user function
  let users = await User.find({ ical_feed_url: { $ne: null } });
  for (var i = 0; i < users.length; i++) {
    let user = users[i];
    await update_user(user.email, user.ical_feed_url);
  }
}

// Create task to check all BGs and schedule it for every 5 minutes (and immediately)
const update_all_users_task = new AsyncTask("update all users' calendars", update_all_users, (err) => {});

function start_update_loop() {
  scheduler.addSimpleIntervalJob(
    new SimpleIntervalJob(
      // Every 2 hours, check all users' feeds and update their calendars
      { minutes: 2 * 60, runImmediately: true },
      update_all_users_task
    )
  );
}
// Allow other files to access the update_user function
// So when a user sets up the service, it runs once for them
export { start_update_loop, update_user };
