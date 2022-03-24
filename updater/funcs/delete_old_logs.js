import fs from "fs";
import moment from "moment";
/**
 * Delete logs from /logs that are older than the specified number of days
 * @param {int} days
 */
function delete_old_logs(days) {
  let files = fs.readdirSync("./updater/logs").filter((file) => file.endsWith(".mylog"));

  let today = moment().tz("America/New_York");

  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    var file_name = file.split(".")[0];
    var file_date = moment(file_name, "YYYY-MM-DD");
    var diff = today.diff(file_date, "days");

    if (diff >= days) {
      fs.unlinkSync(`./updater/logs/${file}`);
    }
  }
}

export default delete_old_logs;
