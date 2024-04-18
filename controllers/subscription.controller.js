const Subscription = require("../models/Subscription.js");
const ApiError = require("../utils/error-response.js");
const httpStatusCodes = require("../utils/httpstatuscodes.js");
const ApiSuccess = require("../utils/sucess-response.js");

// Controller function to handle subscription form submission
module.exports = {
  submitSubscriptionForm: async (req, res) => {
    try {
      // Extract subscription data from the request body
      const {
        subscriberId,
        subscriberName,
        subscriberCountry,
        subscriberDuration,
      } = req.body;

      // Check if the subscriptionId already exists
      const existingSubscription = await Subscription.findOne({ subscriberId });
      if (existingSubscription) {
        ApiError.message = "Subscriber ID already exists";
        return res.status(httpStatusCodes.BAD_REQUEST).json(ApiError);
      }

      // Create a new subscription instance
      const newSubscription = new Subscription({
        subscriberId,
        subscriberName,
        subscriberCountry,
        subscriptionDate: subscriberDuration,
      });

      // Save the subscription to the database
      await newSubscription.save();

      ApiSuccess.message = "Subscription added successfully";
      ApiSuccess.data = newSubscription;
      // Return success response
      return res.status(httpStatusCodes.CREATED).json(ApiSuccess);
    } catch (error) {
      // Handle errors
      ApiError.message = "Internal server error";
      return res.status(httpStatusCodes.BAD_REQUEST).json(ApiError);
    }
  },

  showSubscribers: async (req, res) => {
    try {
      const findSubscription = await Subscription.find({});

      ApiSuccess.message = "All subscribers listed successfully";
      ApiSuccess.data = findSubscription;
      return res.status(httpStatusCodes.OK).json(ApiSuccess);
    } catch (error) {
      // Handle errors
      ApiError.message = "Internal server error";
      return res.status(httpStatusCodes.BAD_REQUEST).json(ApiError);
    }
  },

  subscribersStats: async (req, res) => {
    try {
      // Total Subscriber Count
      const totalSubscriberCount = await Subscription.countDocuments();

      // Longest Subscription Duration
      const earliestSubscriptionDate = await Subscription.findOne({}).sort({
        subscriptionDate: 1,
      }); // Sort by subscription date in ascending order to get the earliest date

      let longestDurationInDays = 0;
      if (earliestSubscriptionDate) {
        const now = new Date();
        const longestDurationInMilliseconds =
          now - earliestSubscriptionDate.subscriptionDate;
        longestDurationInDays = Math.round(
          longestDurationInMilliseconds / (1000 * 3600 * 24)
        ); // Convert milliseconds to days
      }

      // Country with Most Subscribers
      const countryWithMostSubscribers = await Subscription.aggregate([
        {
          $group: {
            _id: "$subscriberCountry", // Group by the subscriberCountry field
            count: { $sum: 1 }, // Count the number of occurrences for each country
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      console.log(countryWithMostSubscribers);
      const countryNameWithMostSubscribers =
        countryWithMostSubscribers.length > 0
          ? countryWithMostSubscribers[0]._id
          : 0;

      ApiSuccess.message = "Subscription stats fetched successfully";
      ApiSuccess.data = {
        totalSubscriberCount,
        longestDurationInDays,
        countryWithMostSubscribers: countryNameWithMostSubscribers,
      };

      res.status(httpStatusCodes.OK).json(ApiSuccess);
    } catch (error) {
      // Handle errors
      ApiError.message = "Internal server error";
      return res.status(httpStatusCodes.BAD_REQUEST).json(ApiError);
    }
  },
};
