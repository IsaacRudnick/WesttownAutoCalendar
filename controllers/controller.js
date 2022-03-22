const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "92967650602-e7g2asfp18qkl8vt6db3906jg5ssj5p7.apps.googleusercontent.com";
const oauth2_client = new OAuth2Client(CLIENT_ID);

login_get = (req, res) => {
  res.render("login");
};

login_post = (req, res) => {
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
    console.log("🚀 ~ file: controller.js ~ line 19 ~ verify ~ ticket", ticket);
    res.redirect("/app");
  });
};

profile_get = (req, res) => {
  res.render("profile");
};

profile_post = (req, res) => {
  // TODO: Do something with the profile data
  res.render("profile");
};

module.exports = {
  login_get,
  login_post,
  profile_get,
  profile_post,
};
