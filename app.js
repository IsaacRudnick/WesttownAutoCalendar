import cookieParser from "cookie-parser";
import express from "express";
const app = express();
import routes from "./routes/routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import log_info from "./updater/funcs/log_info.js";
import { start_update_loop as start_calendar_updater } from "./updater/calendar_updater.js";

// allows url encoding
app.use(express.urlencoded({ extended: true }));
// sets public folder (css, images, browser/client js, etc.)
app.use(express.static("public"));
app.set("view engine", "ejs");
// Web request logging middleware
app.use(morgan("dev"));
// used to parse JSON bodies and replaces deprecated body-parser
app.use(express.json());
// allow cookie reading
app.use(cookieParser());

// Direct all requests to routes
app.use("", routes);

// connect to mongodb before anything else
const dbURI = process.env.DBURI;
await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(process.env.PORT);
await log_info(`Listening on port ${process.env.PORT}`);
// Only run the updater when DB connection is established
start_calendar_updater();
