const config = require("config");
const mongoose = require("mongoose");
require("dotenv").config();
const dbConfig = config.get("database");

async function connectToDatabase(DB_URL = dbConfig.URL) {
	try {
		await mongoose.connect(DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		// eslint-disable-next-line no-undef
		process.env.NODE_ENV != "test"
			? console.log("Connected to the database")
			: undefined;
	} catch (error) {
		console.error("Error connecting to the database:", error);
	}
}

module.exports = { connectToDatabase, mongoose };
