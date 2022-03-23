// Resolves after ms milliseconds have passed
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = snooze;
