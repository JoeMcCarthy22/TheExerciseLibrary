const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const feedController = require("../controllers/feed");
const { ensureAuth } = require("../middleware/auth");

// ======= MAIN PAGES =======
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, feedController.getFeed);

// ======= AUTH ROUTES =======
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/guest-login", authController.getGuestLogin); // <-- guest login
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;