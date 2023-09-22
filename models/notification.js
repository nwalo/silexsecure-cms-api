const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
