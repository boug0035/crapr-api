"use strict";

const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    googleId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("User", userSchema);
