const authRouter = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");

require("../utils/passport");

authRouter.get("/google", authController.googleAuth);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fail", session: false }),
  authController.googleCallback
);

module.exports = authRouter;
