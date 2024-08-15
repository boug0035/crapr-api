"use strict";

const GoogleStrategy = require("passport-google-oauth2");
const BearerStrategy = require("passport-http-bearer");
const passport = require("passport");
const User = require("../models/User.model");
const { UnauthenticatedError } = require("../utils/errors");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      try {
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            $set: {
              name: profile.displayName,
              googleId: profile.id,
            },
          },

          { upsert: true, new: true }
        );
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async function (token, done) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken.id);

      if (!user) {
        throw new UnauthenticatedError();
      }
      done(null, user);
    } catch (error) {
      logger.error(`Error in BearerStrategy: ${error.message}`);
      done(new UnauthenticatedError());
    }
  })
);
