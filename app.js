const express = require("express");
const app = express();
const routes = require("./routes");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("./calendar_updater.js");

app.set("view engine", "ejs");
// Logging middleware
app.use(morgan("dev"));
// used to parse JSON bodies and replaces deprecated body-parser
app.use(express.json());

app.use("", routes);

// connect to mongodb & listen for requests
const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(process.env.PORT || 8080)) // listen for requests
  .catch((err) => console.log(err)); // log any errors
