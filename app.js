require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("tiny"));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: "*",
};
app.enable("trust proxy");
app.use(cors(corsOptions));

const silexSecureCMS = require("./routes/silexSecureCMS");
const authRoute = require("./routes/authRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const pageRoute = require("./routes/pageRoute");
const postRoute = require("./routes/postRoute");
const mediaRoute = require("./routes/mediaRoute");
const googleTagManagerRoute = require("./routes/googleTagManagerRoute");
const notificationRoute = require("./routes/notificationRoute");
const tagRoute = require("./routes/tagRoute");

// Routes
app.use("/api/v1/", silexSecureCMS);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/page", pageRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/googleTagManager", googleTagManagerRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/tag", tagRoute);
module.exports = app;
