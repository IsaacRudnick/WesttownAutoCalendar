import cliProgress from "cli-progress";

/**
 * @description creates a progress bar for the user to see how far along the process is
 * @returns {Object} A cli-progress bar object
 */
function create_progress_bar() {
  // 2/3 of terminal width minus the added info (percent, ETA, fraction)
  bar_width = Math.round(process.stdout.columns / 2);
  return new cliProgress.SingleBar(
    { linewrap: true, barsize: bar_width, hideCursor: true, stopOnComplete: true },
    cliProgress.Presets.shades_classic
  );
}
export default { create_progress_bar };
