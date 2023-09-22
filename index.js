require("dotenv").config();
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
  })
  .then((res) => console.log("connected to DB"))
  .catch((err) => console.log("Error: " + err));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message, err);
//   server.close(() => {
//     process.exit(1);
//   });
// });
