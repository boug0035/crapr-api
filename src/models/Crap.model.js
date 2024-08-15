"use strict";

const { model, Schema } = require("mongoose");
const { validate } = require("./User.model");

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const SuggestionSchema = new Schema({
  address: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "Address should not be empty",
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const CrapSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    location: {
      type: PointSchema,
      required: true,
      _id: false,
    },
    images: {
      type: [String],
      required: true,
      validate: [
        (urls) => urls.length > 0,
        "Please provide at least one image",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["AVAILABLE", "INTERESTED", "SCHEDULED", "AGREED", "FLUSHED"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    suggestion: {
      type: SuggestionSchema,
      required: false,
      _id: false,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Crap", CrapSchema);
