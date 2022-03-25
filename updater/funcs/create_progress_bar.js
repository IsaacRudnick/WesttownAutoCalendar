import cliProgress from "cli-progress";

/**
 * Creates a progress bar for the user to see how far along the process is
 * @returns {Object} A cli-progress bar object
 */
function create_progress_bar() {
  // 1/2 of terminal width total (includes info such as percent and ETA)
  let bar_width = Math.round(process.stdout.columns / 2);
  return new cliProgress.SingleBar(
    { linewrap: true, barsize: bar_width, hideCursor: true, stopOnComplete: true },
    cliProgress.Presets.shades_classic
  );
}
export default create_progress_bar;
