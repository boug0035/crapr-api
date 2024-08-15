const authService = require("../services/auth.service");
const logger = require("../utils/logger");
const passport = require("passport");

require("../utils/passport");

exports.googleAuth = (req, res, next) => {
  const { redirect_url } = req.query;

  const state = authService.generateState(redirect_url);

  passport.authenticate("google", {
    scope: ["profile"],
    state,
  })(req, res, next);
};

exports.googleCallback = (req, res) => {
  const { state } = req.query;

  const redirectUrl = authService.processGoogleCallback(req.user, state);

  res.redirect(redirectUrl);
};
