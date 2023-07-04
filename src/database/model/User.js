const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    firstname: {
      type: String,
      min: 3,
      max: 20,
      default: "firstname",
      required: true,
    },
    lastname: {
      type: String,
      min: 2,
      max: 20,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongoosePaginate);

// Define a query helper to exclude specified fields
UserSchema.query.excludeFields = function (fields) {
  const projection = fields.reduce((proj, field) => {
    proj[field] = 0; // Exclude the specified field
    return proj;
  }, {});

  return this.select(projection);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", UserSchema);
