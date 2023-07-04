/* eslint-disable no-undef */
require("dotenv").config();
module.exports = {
	database: {
		URL: process.env.DB_URL,
	},

	session: {
		secret: process.env.SESSION_KEY,
	},
};
