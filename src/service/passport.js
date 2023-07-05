const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { AuthService } = require("./auth-service");

const service = new AuthService();

const customUserFields = {
  usernameField: "username",
  passwordField: "password",
};

const verifyUserCallback = async (username, password, done) => {
  try {
    const user = await service.UserSignIn({ username, password });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const userStrategy = new LocalStrategy(customUserFields, verifyUserCallback);

passport.use("user", userStrategy);

passport.serializeUser((user, done) => {
  done(null, user.user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    let user = await service.FindUserById(userId);
    return done(null, user);
  } catch (error) {
    done(error);
  }
});
