const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const connectDB = require("./mongodb.js");
const app = express();

/**
 * Load all the envirnoment variables on the initial load of first entry point
 */
dotenv.config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(express.json());

const subscriptionRoute = require("./routes/subscription.routes.js");

// Subscription routes
app.use("/api/v1", subscriptionRoute);

// routes import
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB Connection FAILED !!!", err);
  });
