const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  roles: [{ type: ObjectId, ref: "Role" }],
  ifActive: Boolean,
  createdAt:Date
});

module.exports = mongoose.model("User", Schema);
