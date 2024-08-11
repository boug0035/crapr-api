const authRouter = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");

// Import passport configuration
require("../utils/passport");

// Route to redirect the user to Google for authentication
authRouter.get("/google", authController.googleAuth);

// Route to handle the Google OAuth callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fail", session: false }),
  authController.googleCallback
);

module.exports = authRouter;
