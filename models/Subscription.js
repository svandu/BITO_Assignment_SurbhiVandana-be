const mongoose = require("mongoose");

// Define schema for Subscription
const subscriptionSchema = new mongoose.Schema({
  subscriberId: {
    type: String,
    unique: true,
    required: true,
  },
  subscriberName: {
    type: String,
    required: true,
  },
  subscriberCountry: {
    type: String,
    required: true,
  },
  subscriptionDate: {
    type: Date,
    required: true,
  },
});

// Create Subscription model
const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
