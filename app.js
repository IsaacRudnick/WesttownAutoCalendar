const express = require("express");
const app = express();
const routes = require("./routes/routes");
const mongoose = require("mongoose");
require("dotenv").config();

const morgan = require("morgan");

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
  .then((result) => {
    port = process.env.PORT || 8080;
    app.listen(port);
    console.log(`Listening on port ${port}`);
  }) // listen for requests
  .catch((err) => console.log(err)); // log any errors
