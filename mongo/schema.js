const { Schema, model } = require("mongoose");

// Schema definition
const roundSchema = new Schema({
  drawNumber: {
    type: String, // draw number cannot be a Number bc of 91a and 91b
    index: true,
    unique: true,
  },
  drawDate: String, // Probably should be Date, but string is OK
  drawDateFull: String,
  drawDateTime: String,
  drawName: String,
  drawSizeStr: String,
  drawSizeNum: Number,
  drawCRS: Number,
});

const subscriberSchema = new Schema({
  chatID: {
    type: Number,
    unique: true,
  },
  firstName: String,
  lastName: String,
  subscribedAt: Date,
});

const userSchema = new Schema({
  chatID: {
    type: Number,
    unique: true,
  },
  firstName: String,
  lastName: String,
  startedAt: Date,
});

const distributionSchema = new Schema({
  drawNumber: {
    type: String, // draw number cannot be a Number bc of 91a and 91b
    index: true,
    unique: true,
  },
  drawDistributionAsOn: String,
  dd1: String,
  dd2: String,
  dd3: String,
  dd4: String,
  dd5: String,
  dd6: String,
  dd7: String,
  dd8: String,
  dd9: String,
  dd10: String,
  dd11: String,
  dd12: String,
  dd13: String,
  dd14: String,
  dd15: String,
  dd16: String,
  dd17: String,
  dd18: String,
});

// Model definition
const Round = model("Round", roundSchema);
const Subscriber = model("Subscriber", subscriberSchema);
const User = model("User", userSchema);
const Distribution = model("Distribution", distributionSchema);

module.exports = { Round, Subscriber, User, Distribution };
