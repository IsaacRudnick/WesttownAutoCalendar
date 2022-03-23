const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "92967650602-un0j7tq20lburr34pkdgbsi20n8nn7ee.apps.googleusercontent.com";
const oauth2_client = new OAuth2Client(CLIENT_ID);
const User = require("../models/user");
const calendar_updater = require("../updater/calendar_updater");

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
    var query = { email: ticket.getPayload().email },
      update = {},
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const user = await User.findOneAndUpdate(query, update, options);

    return user;
  }

  verifyAndUpdate().then((user) => {
    jwt_token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    // FIXME: {secure: true} for production.
    res.cookie("JWT", jwt_token, { httpOnly: true });
    res.redirect("/profile");
  });
};

const profile_get = (req, res) => {
  id = jwt.decode(req.cookies.JWT).id;
  res.render("profile");
};

const profile_post = (req, res) => {
  const email = req.verified_email;
  const ical_feed_url = req.body.ical_feed_url;

  // Find user by email and update their ical_feed_url
  const user = User.findOneAndUpdate({ email }, { ical_feed_url }, (err, user) => {
    if (err) {
      console.log(err);
    }
    calendar_updater.update_user({ email, ical_feed_url });
  });

  res.render("success");
};

// Clears cookies and redirects to /login
const logout_get = (req, res) => {
  res.clearCookie("JWT");
  res.redirect("/login");
};

module.exports = {
  login_get,
  login_post,
  profile_get,
  profile_post,
  logout_get,
};
