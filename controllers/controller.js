const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "92967650602-e7g2asfp18qkl8vt6db3906jg5ssj5p7.apps.googleusercontent.com";
const oauth2_client = new OAuth2Client(CLIENT_ID);

const login_get = (req, res) => {
  res.render("login");
};

const login_post = (req, res) => {
  // For simplicity and cleaner debugging.
  let token = req.body.id_token;

  async function verify() {
    const ticket = await oauth2_client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    return ticket.getPayload();
  }

  verify().then((ticket) => {
    jwt_token = jwt.sign({ email: ticket.email }, process.env.JWT_SECRET);
    // FIXME: {secure: true} for production.
    res.cookie("JWT", jwt_token, { httpOnly: true });
    console.log("🚀 ~ file: controller.js ~ line 28 ~ verify ~ ticket.email", ticket.email);
    res.redirect("/profile");
  });
};

const profile_get = (req, res) => {
  id = jwt.decode(req.cookies.JWT).id;
  res.render("profile");
};

const profile_post = (req, res) => {
  // TODO: Do something with the profile data
  console.log("🚀 ~ file: controller.js ~ line 35 ~  res.body", res.body);
  res.render("profile");
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
