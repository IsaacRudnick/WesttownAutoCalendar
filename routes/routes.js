const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controllers/controller");

// Verify JWT token
// If invalid, redirect to /login
// Can be placed in router requests to verify token before accessing route
function authenticateToken(req, res, next) {
  const token = req.cookies["JWT"];
  if (token == null) return res.redirect("/login");

  // Verifies token. redirect to /login if error.
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("User not logged in, redirecting");
      res.redirect("/login");
    }

    // If no error, assign id to req.id
    req.verified_email = decoded.email;
    next();
  });
}

router.get("/login", controller.login_get);
router.post("/login", controller.login_post);

router.get("/profile", authenticateToken, controller.profile_get);
router.post("/profile", authenticateToken, controller.profile_post);

module.exports = router;
