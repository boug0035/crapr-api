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
      // Dont forget to import from process.env
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      try {
        // here, we will look up a user by the googleId, and either
        // create a new User if none exists, or
        // update the existing User, in case they changed their name in google.
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            $set: {
              name: profile.displayName,
              googleId: profile.id,
            },
          },
          // upsert is how we tell mongoose to UP-date the document or in-SERT a new one
          // don't forget to tell mongoose to return the updated document!
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
  // the strategy gets the token for us from the headers.
  new BearerStrategy(async function (token, done) {
    try {
      // we decoded the token using the verify method. This will throw an error if the signature cannot be verified
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // next, we use the id from our token to lookup the user in Mongoose
      const user = await User.findById(decodedToken.id);

      // finally, we either throw an error, or pass on the user to passports callback function
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
