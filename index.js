const { app } = require("./src/app");
const { connectToDatabase } = require("./src/database/connection");
const { SessionService } = require("./src/service/session-service");
const session = new SessionService();
require("dotenv").config();

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 7001;

// Connect to database
connectToDatabase();
// Delete unused sessions
session.sheduleSessionDelete();

app.listen(PORT, async() => {
    console.log("Server is running on port " + PORT);
});