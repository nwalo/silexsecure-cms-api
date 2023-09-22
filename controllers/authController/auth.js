const User = require("../../models/user");
const moment = require("moment");
const passport = require("passport");
const _ = require("lodash");
const notificationController = require("../notificationController/notification");
const jwt = require("jsonwebtoken");

// Passport configuration
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});

const createUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ _id: req?.user?._id });

    User.register(
      {
        username: req.body.username,
        fullName: req.body.fullName,
        userRole: req.body.userRole,
        createdBy: req.user && req.user._id,
      },
      req.body.password,
      function (err, result) {
        if (err) {
          return res
            .status(400)
            .json({ message: "user already exist", error: err });
        } else {
          result.hash = undefined;
          result.salt = undefined;

          const notif = {
            title: "User Registration",
            description: `A user named ${req.body.fullName} was registered ${
              findUser ? `by ${findUser.fullName}` : ""
            }.`,
          };
          notificationController.createNotification(notif);
          return res.status(200).json({
            status: "success",
            message: "Account has been created.",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = req.body;

    if (!user.username)
      return res.status(400).json({
        message: "Kindly provide your username",
      });
    if (!user.password)
      return res.status(400).json({
        message: "Kindly provide your password",
      });
    const userCheck = await User.findOne({ username: user.username });
    if (!userCheck)
      return res.status(401).json({
        message: "User does not exist",
      });

    passport.authenticate("local", function (err, user, info) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: "error",
          message: "An internal server error occurred.",
          data: err,
        });
      }

      if (!user) {
        return res.status(401).json({
          status: "Unauthorized user",
          message: "Invalid credentials",
        });
      }

      req.logIn(user, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: "error",
            message: "Unable to log in user.",
            data: err,
          });
        }

        const userData = {
          username: userCheck?.username,
          fullName: userCheck.fullName,
          userRole: userCheck?.userRole,
        };

        const accessToken = jwt.sign(userData, process.env.JWT_SECRET);

        return res.status(200).json({
          status: "success",
          message: "Login successful.",
          data: { ...userCheck._doc, accessToken },
        });
      });
    })(req, res);

    // createSendToken(user, 200, req, res);
  } catch (error) {
    res.status(500).json({ status: error, message: "something went wrong" });
  }
};

const logout = async (req, res) => {
  try {
    req.logout((err) => {
      err && console.log(err);
    });
    return res.status(200).json({
      status: "success",
      message: "Logout successful.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ status: error, message: "something went wrong" });
  }
};

// const ResetAccount = async (req, res) => {
//   try {
//     const email = req.body.email;

//     const user = await User.findOne({ email });

//     if (!user)
//       return res.status(404).json({
//         status: "error",
//         message: "email is not registered.",
//       });

//     const resetKey = resetLink();

//     const token = resetKey.token;
//     const expiredDate = moment().add(1, "hours");

//     await user.updateOne({
//       rememberToken: {
//         token,
//         expiredDate,
//       },
//     });

//     const subject = `Kindly use this link to reset your account `;

//     const html = ResetPassword(resetKey.url);
//     ///email //////////////////////////////////
//     Mailer(user.email, subject, html, async function (err, result) {
//       if (err) {
//         console.log(`error while sending emails`, err);
//       } else {
//         console.log(`sent successfully`, result);
//       }

//       // console.log('Error from message sent', err && err.message);
//       // console.log('Result from message sent', result && result.statusMessage);
//     });
//     return res.status(200).json({
//       status: "success",
//       message: "Password reset link has been sent to your mail.",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: "error",
//       message: "something went wrong. Please try again",
//     });
//   }
// };

// const VerifyRegisteredAccount = async (req, res) => {
//   try {
//     const token = req.body.token;

//     if (!token)
//       return res
//         .status(400)
//         .json({ status: "error", message: "Token is required" });

//     const currentDate = new Date();

//     const user = await User.findOne({
//       "rememberToken.token": token,
//       verified: false,
//       "rememberToken.expiredDate": { $gte: currentDate },
//     });

//     if (!user)
//       return res
//         .status(400)
//         .json({ status: "error", message: "Your session has expired." });

//     console.log("user", user);

//     await user.updateOne({
//       verified: true,
//       rememberToken: null,
//     });

//     createSendToken(user, 200, req, res);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send("Something went wrong");
//   }
// };

// const handleChangePassword = async (req, res) => {
//   try {
//     // validate the user data
//     let { error } = validatePasswordReset(req.body);

//     // check if there was error
//     if (error) return res.status(400).send(error.details[0].message);

//     let token = req.body.token;
//     let password = req.body.password;
//     let confirmPassword = req.body.confirmPassword;

//     if (password !== confirmPassword)
//       return res.status(400).json({
//         status: "error",
//         message: "Your new password doesn't match your confirm password.",
//       });

//     let currentDate = new Date().valueOf();

//     let user = await User.findOne({
//       "rememberToken.token": token,
//       "rememberToken.expiredDate": { $gte: currentDate },
//     });

//     if (!user)
//       return res.status(404).json({
//         status: "error",
//         message: "Token already expired. Please reset password again.",
//       });

//     // now if the current provided is a match then
//     let newPass = await bcrypt.hash(password, 10);
//     newPass = newPass.replace("$2b$", "$2y$");

//     // update the user password
//     await user.updateOne({ password: newPass });

//     return res.status(200).json({
//       status: "success",
//       message: "Password successfully changed.",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json({
//       status: "error",
//       message: "something went wrong. Please try again",
//     });
//   }
// };
module.exports = {
  createUser,
  loginUser,
  logout,
};
