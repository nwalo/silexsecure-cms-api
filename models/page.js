const mongoose = require("mongoose");
const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
