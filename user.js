const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User will later add in other data or information
const userSchema = new Schema(
  {
    // user email
    email: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
