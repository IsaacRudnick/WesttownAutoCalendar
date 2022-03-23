import fetch from "node-fetch";
import ical from "node-ical";

/**
 *
 * @param {string} ical_feed_url the url of the ical feed
 * @returns {Array} Array of all events in the ical feed
 */
async function get_ical_events(ical_feed_url) {
  return (
    fetch(ical_feed_url, { method: "GET" })
      // Convert to text to allow parsing
      .then((res) => res.text())
      .then((text) => {
        // Parse the raw ical data
        ical_events = ical.sync.parseICS(text);
        return ical_events;
      })
  );
}

export default { get_ical_events };
