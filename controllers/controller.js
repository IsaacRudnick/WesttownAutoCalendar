import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = "92967650602-un0j7tq20lburr34pkdgbsi20n8nn7ee.apps.googleusercontent.com";
const oauth2_client = new OAuth2Client(CLIENT_ID);
import User from "../models/user.js";
import { update_user } from "../updater/calendar_updater.js";
import fs from "fs";
import calendar_client from "../updater/funcs/calendar_client.js";

let client_email = JSON.parse(fs.readFileSync("./updater/service_account_key.json"))["client_email"];

const login_get = (req, res) => res.render("login");

const login_post = async (req, res) => {
  // For simplicity and cleaner debugging.
  let token = req.body.id_token;

  async function verifyAndUpdate() {
    const ticket = await oauth2_client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    let query = { email: ticket.getPayload().email };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const user = await User.findOneAndUpdate(query, {}, options);

    return user;
  }

  let user = await verifyAndUpdate();

  let jwt_token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  // FIXME: {secure: true} for production.
  res.cookie("JWT", jwt_token, { httpOnly: true });
  res.redirect("/setup");
};

const shareCalendar_get = (req, res) => res.render("steps/shareCalendar", { client_email: client_email });

const shareCalendar_post = async (req, res) => {
  let user = await User.findOne({ email: req.verified_email });
  try {
    await calendar_client.events.insert({
      calendarId: user.email,
      resource: {
        summary: "AutoCal Test",
        start: {
          dateTime: new Date().toISOString(),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: new Date().toISOString(),
          timeZone: "America/New_York",
        },
        status: "cancelled",
      },
    });
  } catch (err) {
    // If there's an error, give a reason
    switch (err.errors[0].reason) {
      case "requiredAccessLevel":
        var error = 'Error: make sure you choose "Make changes to events" in sharing settings';
        break;
      default:
        var error = "I can't seem to get you calendar events. Please redo all of the steps";
    }
    res.send({ error: error });
    return;
  }
  res.render("steps/iCalFeedSetup", { client_email: client_email, ical_feed_url: user?.ical_feed_url });
};

// Clears cookies and redirects to /login
const logout_get = (req, res) => {
  res.clearCookie("JWT");
  res.redirect("/login");
};

export { login_get, login_post, logout_get, shareCalendar_get, shareCalendar_post };
