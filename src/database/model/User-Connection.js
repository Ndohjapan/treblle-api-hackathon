const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const en = require("../../../locale/en");

const UserConnectionSchema = new mongoose.Schema({
  users: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: function() {
        return en.userconnection_max_size;
      }
    }
  },
  lastMessage: {
    type:  mongoose.Schema.Types.ObjectId, 
    ref: "message"
  }
}, {timestamps: true});

UserConnectionSchema.plugin(mongoosePaginate);

UserConnectionSchema.index(
  { users: 1 },
  { unique: true, partialFilterExpression: { students: { $exists: true, $ne: [] } } }
);

module.exports =  mongoose.model("user-connection", UserConnectionSchema);