const express = require("express");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const passport = require("passport");
const { interceptorParam } = require("./middleware/logger");
const { mongoose } = require("./database/connection");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const treblle = require("@treblle/express");
const config = require("config");
require("dotenv").config();

const treblleConfig = config.get("treblle");

const errorHandler = require("./error/error-handler");
const en = require("../locale/en");
const NotFundException = require("./error/not-found-exception");
const { auth, connections, user, file, message } = require("./routes");
const { securityResponseHeader } = require("./middleware/res-header");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(securityResponseHeader);

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "test") {
  app.use(interceptorParam);
  app.use(  treblle({
    apiKey: treblleConfig.apiKey,
    projectId: treblleConfig.projectId,
    additionalFieldsToMask: [],
  }));
}


const sessionStore = MongoStore.create({
  mongoUrl: config.get("database").URL,
  mongooseConnection: mongoose.connection,
});

require("./service/passport");

app.use(
  session({
    secret: config.get("session").secret,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.session.lastUsedDate = new Date();
  next();
});

file(app);
auth(app);
connections(app);
user(app);
message(app);

app.use((req, res, next) => {
  next(new NotFundException(en.page_not_found));
});

app.use(errorHandler);

module.exports = { app };
