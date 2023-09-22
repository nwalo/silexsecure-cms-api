const mongoose = require("mongoose");
const googleTagManagerSchema = new mongoose.Schema(
  {
    tagId: { type: String, required: true, unique: true },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const GoogleTagManager = mongoose.model(
  "GoogleTagManager",
  googleTagManagerSchema
);

module.exports = GoogleTagManager;
