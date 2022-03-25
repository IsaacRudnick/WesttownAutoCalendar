import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import * as controller from "../controllers/controller.js";

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
// Redirect index to login
router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", controller.login_get);
router.post("/login", controller.login_post);

router.get("/setup", authenticateToken, controller.shareCalendar_get);
router.post("/shareCalendar", authenticateToken, controller.shareCalendar_post);

// router.post("/icalFeedSetup", authenticateToken, controller.icalFeedSetup_post);

router.get("/logout", controller.logout_get);

export default router;
