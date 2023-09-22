const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String },
    picture: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    userRole: {
      type: String,
      enum: ["Admin", "Developer", "Manager", "Member"],
      default: "Member",
    },
    token: String,
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;
