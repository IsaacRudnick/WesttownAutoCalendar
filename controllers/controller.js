import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = "92967650602-un0j7tq20lburr34pkdgbsi20n8nn7ee.apps.googleusercontent.com";
const oauth2_client = new OAuth2Client(CLIENT_ID);
import User from "../models/user.js";
import { update_user } from "../updater/calendar_updater.js";
import fs from "fs";

const login_get = (req, res) => {
  res.render("login");
};

const login_post = (req, res) => {
  // For simplicity and cleaner debugging.
  let token = req.body.id_token;

  async function verifyAndUpdate() {
    const ticket = await oauth2_client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    var query = { email: ticket.getPayload().email };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const user = await User.findOneAndUpdate(query, {}, options);

    return user;
  }

  verifyAndUpdate().then((user) => {
    let jwt_token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    // FIXME: {secure: true} for production.
    res.cookie("JWT", jwt_token, { httpOnly: true });
    res.redirect("/setup");
  });
};

let client_email = JSON.parse(fs.readFileSync("./updater/service_account_key.json"))["client_email"];
const setup_get = (req, res) => {
  User.findOne({ email: req.verified_email }).then((user) => {
    res.render("setup", { client_email: client_email, ical_feed_url: user?.ical_feed_url });
  });
};

const setup_post = (req, res) => {
  const email = req.verified_email;
  const ical_feed_url = req.body.ical_feed_url;

  // Find user by email and update their ical_feed_url
  User.findOneAndUpdate({ email }, { ical_feed_url }).then(async (err, user) => {
    if (err) {
      console.log(err);
    }
    update_user(email, ical_feed_url);
  });

  res.render("success");
};

// Clears cookies and redirects to /login
const logout_get = (req, res) => {
  res.clearCookie("JWT");
  res.redirect("/login");
};

export { login_get, login_post, setup_get, setup_post, logout_get };
