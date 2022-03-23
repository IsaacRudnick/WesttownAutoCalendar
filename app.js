const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const routes = require("./routes/routes");
const mongoose = require("mongoose");
require("dotenv").config();

const morgan = require("morgan");

const calendar_updater = require("./updater/calendar_updater.js");

// allows url encoding
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// Web request logging middleware
app.use(morgan("dev"));
// used to parse JSON bodies and replaces deprecated body-parser
app.use(express.json());
// allow cookie reading
app.use(cookieParser());

app.use("", routes);

// connect to mongodb & listen for requests
const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    port = process.env.PORT || 8080;
    app.listen(port);
    console.log(`Listening on port ${port}`);
    // Only run the updater when DB connection is established
    calendar_updater.start_update_loop();
  }) // listen for requests
  .catch((err) => console.log(err)); // log any errors
