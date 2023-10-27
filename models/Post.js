const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        tags: [{ type: String }],
        content: { type: String },
        summaryContent: { type: String },
        thumbnailURL: { type: String },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
