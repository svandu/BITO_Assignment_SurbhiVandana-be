const express = require("express");
const router = express.Router();
const Controller = require("../controllers/subscription.controller.js");

// Route to handle subscription form submission
router.post("/subscription", Controller.submitSubscriptionForm);
router.get("/subscription", Controller.showSubscribers);
router.get("/subscriber-stats", Controller.subscribersStats);

module.exports = router;
