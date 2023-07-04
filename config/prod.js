/* eslint-disable no-undef */
require("dotenv").config();
module.exports = {
  database: {
    URL: process.env.DB_URL,
  },

  session: {
    secret: process.env.SESSION_KEY,
  },

  redis: {
    URL: process.env.REDISCLOUD_URL,
  },

  treblle: {
    apiKey: process.env.TREBLLE_API_KEY,
    projectId: process.env.TREBLLE_PROJECT_ID
  }
};
