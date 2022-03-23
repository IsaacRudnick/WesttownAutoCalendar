// Resolves after ms milliseconds have passed
/**
 *
 * @param {int} ms milliseconds to wait
 * @returns {Promise} Promise that resolves after ms milliseconds have passed
 */
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default { snooze };
