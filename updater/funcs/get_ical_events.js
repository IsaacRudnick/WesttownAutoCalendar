const fetch = require("node-fetch");
const ical = require("node-ical");

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

module.exports = get_ical_events;
