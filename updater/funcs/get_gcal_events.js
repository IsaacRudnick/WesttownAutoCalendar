import moment from "moment";
import fs from "fs";
import snooze from "./snooze.js";
import log_info from "./log_info.js";

let client_email = JSON.parse(fs.readFileSync("./updater/service_account_key.json"))["client_email"];

/**
 * @param {string} email the email of the user
 * @param {Object} calendar_client Google calendar client
 * @returns {Array} Array of all Google Calendar events **made by this script**
 */
async function get_gcal_events(email, calendar_client, pageToken = null) {
  try {
    let response_info = await calendar_client.events.list({
      pageToken: pageToken,
      // The user's primary calendar's ID = their email address
      calendarId: email,
      timeMin: moment().startOf("day").toISOString(),
      // Goes more than 2 (mySchoolApp default) months just in case
      timeMax: moment().add(2.5, "months").toISOString(),
      // Ignore deleted events
      singleEvents: true,
      orderBy: "startTime",
      // Lowering this number does not decrease network usage, since this function recurses to get all events
      maxResults: 2500,
      // This makes it so if user deleted the event, it won't be re-added
      // showDeleted: true
    });

    let events = response_info.data.items;

    pageToken = response_info.data.nextPageToken;

    if (response_info.data.nextPageToken) {
      snooze(process.env.API_SLOWDOWN_SNOOZE_MS);
      let next_page = await get_gcal_events(email, calendar_client, pageToken);
      return events.concat(next_page);
    } else {
      // Called when highest level of recursion finishes (when no more pages)
      return events.filter((event) => event.creator.email == client_email);
    }
  } catch (error) {
    log_info("Error getting Google Calendar Events", 2, error);
    return false;
  }
}

export default get_gcal_events;
