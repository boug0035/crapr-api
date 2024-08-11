const authService = require("../services/auth.service");
const logger = require("../utils/logger");
const passport = require("passport");

require("../utils/passport");

exports.googleAuth = (req, res, next) => {
  const { redirect_url } = req.query;

  // Generate state for Google OAuth
  const state = authService.generateState(redirect_url);

  // Initiate Google OAuth process using Passport
  passport.authenticate("google", {
    scope: ["profile"],
    state,
  })(req, res, next);
};

exports.googleCallback = (req, res) => {
  const { state } = req.query;

  // Process the callback and get the redirect URL with token
  const redirectUrl = authService.processGoogleCallback(req.user, state);

  // Redirect the user
  res.redirect(redirectUrl);
};
