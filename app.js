const express = require("express");
const app = express();
const routes = require("./routes");
const morgan = require("morgan");

app.set("view engine", "ejs");
// Logging middleware
app.use(morgan("dev"));
// used to parse JSON bodies and replaces deprecated body-parser
app.use(express.json());

app.use("", routes);
app.listen(8080);
