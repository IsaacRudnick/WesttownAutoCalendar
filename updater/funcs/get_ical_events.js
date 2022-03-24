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
        let ical_events = ical.sync.parseICS(text, (err, res) => {
          if (err) {
            log_info(JSON.stringify(err), 2);
            return false;
          }
        });
        return ical_events;
      })
  );
}

export default get_ical_events;
