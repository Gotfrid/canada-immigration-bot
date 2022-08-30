const { Schema, model } = require("mongoose");

// Schema definition
const roundSchema = new Schema({
  drawNumber: {
    type: String, // draw number cannot be a Number bc of 91a and 91b
    index: true,
    unique: true,
  },
  drawDate: String, // Probably should be Date, but string is OK
  drawName: String,
  drawSize: Number,
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

// Model definition
const Round = model("Round", roundSchema);
const Subscriber = model("Subscriber", subscriberSchema);
const User = model("User", userSchema);

module.exports = { Round, Subscriber, User };
