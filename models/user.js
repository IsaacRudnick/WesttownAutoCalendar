import mongoose from "mongoose";
const Schema = mongoose.Schema;

//User will later add in other data or information
const userSchema = new Schema(
  {
    // user email
    email: { type: String },
    // ical feed url
    ical_feed_url: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
