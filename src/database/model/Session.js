const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  _id: String,
  session: Object,
  expires: Date,
});

module.exports = mongoose.model("session", SessionSchema);