const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const MessageSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user-connection",
      required: true,
    },
    text: {
      type: String,
      min: 1,
      max: 20,
      required: true,
    },
    images: {
      type: [{ type: String }],
    },
    videos: {
      type: [{ type: String }],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("message", MessageSchema);
