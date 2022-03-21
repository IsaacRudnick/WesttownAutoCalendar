const express = require("express");
const router = express.Router();
const controller = require("./controller");
router.get("/login", controller.login_get);
router.post("/login", controller.login_post);

module.exports = router;
