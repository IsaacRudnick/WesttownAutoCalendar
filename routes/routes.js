const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
router.get("/login", controller.login_get);
router.post("/login", controller.login_post);

router.get("/profile", controller.profile_get);
router.post("/profile", controller.profile_post);

module.exports = router;
