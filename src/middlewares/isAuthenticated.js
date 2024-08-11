const passport = require("passport");
const { UnauthenticatedError } = require("../utils/errors");
const logger = require("../utils/logger");

module.exports = isAuthenticated = (req, res, next) => {
  passport.authenticate("bearer", {
    session: false,
    failWithError: true,
  })(req, res, (err) => {
    if (err) {
      logger.error(
        `Error in isAuthenticated middleware: (if err) ${err.message}`
      );
      next(new UnauthenticatedError(err.message));
    }
    next();
  });
};
