import cookieParser from "cookie-parser";
import express from "express";
const app = express();
import routes from "./routes/routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import delete_old_logs from "./updater/funcs/delete_old_logs.js";
import log_info from "./updater/funcs/log_info.js";
import { start_update_loop as start_calendar_updater } from "./updater/calendar_updater.js";

// allows url encoding
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// Web request logging middleware
app.use(morgan("dev"));
// used to parse JSON bodies and replaces deprecated body-parser
app.use(express.json());
// allow cookie reading
app.use(cookieParser());

// Direct all requests to routes
app.use("", routes);

// connect to mongodb & listen for requests
const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    let port = process.env.PORT || 8080;
    app.listen(port);
    log_info(`Listening on port ${port}`);
    // Delete old logs
    delete_old_logs(3);
    // Only run the updater when DB connection is established
    start_calendar_updater();
  }) // listen for requests
  .catch((err) => console.log(err)); // log any errors
