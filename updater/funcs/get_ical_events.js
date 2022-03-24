import fetch from "node-fetch";
import ical from "node-ical";
import log_info from "./log_info.js";

/**
 *
 * @param {string} ical_feed_url the url of the ical feed
 * @returns {Array} Array of all events in the ical feed
 */
async function get_ical_events(ical_feed_url) {
  try {
    let ical_data = await fetch(ical_feed_url, { method: "GET" })
      // Convert to text to allow parsing
      .then((res) => res.text())
      .then((text) => {
        // Parse the raw ical data
        let ical_events = ical.sync.parseICS(text);

        return ical_events;
      });
    return ical_data;
  } catch (error) {
    await log_info("Error getting iCal Events", 2, error);
    return false;
  }
}

export default get_ical_events;
