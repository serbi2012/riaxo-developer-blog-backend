const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        refreshToken: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Token", tokenSchema);
