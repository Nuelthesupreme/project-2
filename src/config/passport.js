const passport = require("passport");
const Strategy = require("passport-local").Strategy;

const User = require("../models/user");

const EMAIL_ERROR_MESSAGE = "Incorrect email address";
const PASSWORD_ERROR_MESSAGE = "Incorrect password";

const verifyCallback = async (email, password, done) => {
  const dbUser = await User.findOne({ where: { email } });

  if (!dbUser) {
    return done(null, false, { message: EMAIL_ERROR_MESSAGE });
  }

  if (!dbUser.validPassword(password)) {
    return done(null, false, { message: PASSWORD_ERROR_MESSAGE });
  }

  return done(null, dbUser);
};

const localStrategy = new Strategy({ usernameField: "email" }, verifyCallback);

passport.use(localStrategy);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

module.exports = passport;
