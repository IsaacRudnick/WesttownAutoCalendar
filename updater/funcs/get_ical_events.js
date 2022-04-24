import fetch from "node-fetch";
import ical from "node-ical";
import log_info from "./log_info.js";

/**
 * Be aware, iCal "events" include "VCALENDAR", "VTIMEZONE", and possible more objects.
 * To deal with these, see the loop in {@link create_new_events}
 *
 * @param {string} ical_feed_url the url of the ical feed
 * @returns {Array} Array of all events in the ical feed
 */
async function get_ical_events(ical_feed_url) {
  try {
    let ical_data = await (await fetch(ical_feed_url, { method: "GET" })).text();
    // Convert to text to allow parsing
    let ical_events = ical.sync.parseICS(ical_data);
    return ical_events;
  } catch (error) {
    await log_info("Error getting iCal Events", 2, error);
    return false;
  }
}

export default get_ical_events;
