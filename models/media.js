const mongoose = require("mongoose");
const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    fileType: {
      type: String,
      required: true,
      enum: ["image", "video", "file"],
    },
    fileSize: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
