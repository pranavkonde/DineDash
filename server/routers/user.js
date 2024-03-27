const express = require("express");
const sendMail = require("../utils/sendMail");

const authorization = require("../middlewares/authorization");
const userModel = require("../database/models/user");
const otpModel = require("../database/models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

const createExpiry = () => {
    var expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);
    return expiryDate;
  };

function generateOtp(userId) {
    let otp =
      "" +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10) +
      Math.floor(Math.random() * 10);
    bcrypt.hash(otp, 10).then((hashedOtp) => {
      otpModel
        .updateOne(
          { userId: userId },
          {
            userId: userId,
            otp: hashedOtp,
            expireAt: createExpiry(),
          },
          { upsert: true }
        )
        .then(function (res) {
          console.log(res);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  
    return otp;
  }
  
  function deleteOtpFromDatabase(userId) {
    otpModel.deleteMany({ userId: userId }).then(function (del) {
      console.log("1");
    });
  }
  
  function makeUserVerified(userId) {
    userModel
      .updateOne({ _id: userId }, { isVerified: true })
      .then(function (res) {
        console.log(1);
      });
  }

userRouter.get("/authenticate", authorization, function (req, res) {
  const obj = {
    userId: req.userId,
    email: req.email,
    full_name: req.full_name,
    phone_no: req.phone_no,
    address: req.address
  };
  res.status(200).json(obj);
});

userRouter.post("/register", function (req, res) {
  let full_name = req.body.full_name;
  let email = req.body.email;
  let phone_no = req.body.phone_no;
  let password = req.body.password;

  userModel.findOne({ email: email }, function (err, user) {
    if (user) res.status(404).end();
    else {
      bcrypt.hash(password, 10).then((hashedPassword) => {
        userModel
          .create({
            full_name: full_name,
            email: email,
            password: hashedPassword,
            phone_no: phone_no,
            isVerified: false,
          })
          .then((user) => {
            sendMail(
              user.email,
              user.full_name,
              "Welcome to DineDash | Verify email",
              generateOtp(user._id),
              "verify email",
              function (err) {
                if (err) {
                  res.status(500).end();
                } else {
                  res
                    .status(200)
                    .end(
                      JSON.stringify({ userId: user._id, email: user.email })
                    );
                }
              }
            );
          })
          .catch((err) => {
            console.log(err);
            res.status(500).end();
          });
      });
    }
  });
});

userRouter.post("/verify", function (req, res) {
  var userId = req.body.userId;
  var otp = req.body.otp;

  if (!userId || !otp) {
    res.status(400).end();
    return;
  }

  otpModel
    .findOne({ userId: userId })
    .then(function (value) {
      var currentDate = new Date();
      if (value.expireAt.getTime() > currentDate.getTime()) {
        bcrypt
          .compare(otp, value.otp)
          .then(function (flag) {
            if (flag) {
              deleteOtpFromDatabase(userId);
              makeUserVerified(userId);
              res.status(200).end();
            } else {
              res.status(401).end();
            }
          })
          .catch(function (err) {
            res.status(401).end();
          });
      } else {
        res.status(404).end();
      }
    })
    .catch(function (err) {
      res.status(404).end();
    });
});

userRouter.post("/resendOtp", function (req, res) {
  userModel.findOne({ _id: req.body.userId }).then(function (user) {
    sendMail(
      user.email,
      user.full_name,
      "Welcome to DineDash | Verify email",
      generateOtp(user._id),
      "verify email",
      function (err) {
        if (err) {
          res.status(500).end();
        } else {
          res.status(201).end();
        }
      }
    );
  });
});

userRouter.post("/login", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  userModel
    .findOne({ email: email })
    .then((user) => {
      if (user.isVerified) {
        bcrypt
          .compare(password, user.password)
          .then((flag) => {
            if (flag) {
              var token = jwt.sign(
                {
                  userId: user._id,
                  email: email
                },
                process.env.TOKEN_SECRET
              );
              res.cookie("token", token, { maxAge: 9000000, httpOnly: true });
              res.status(200).send({token:token});
            } else {
              console.log(err);
              res.status(401).end();
            }
          })
          .catch((err) => {
            res.status(401).end();
          });
      } else {
        sendMail(
          user.email,
          user.full_name,
          "Welcome to DineDash | Verify email",
          generateOtp(user._id),
          "verify email",
          function (err) {
            if (err) {
              res.status(500).end();
            } else {
              res
                .status(201)
                .end(JSON.stringify({ userId: user._id, email: user.email }));
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).end();
    });
});

userRouter.get("/logout", authorization, function (req, res) {
  res.clearCookie("token");
  res.status(200).end();
});

userRouter.get("/:id", authorization, (req, res) => {
  const userId = req.params.id;

  userModel
    .findOne({ _id: userId })
    .then((user) => {
      if (user._id) {
        res.status(200).send(user);
      } else {
        res
          .status(400)
          .send({ error: "Can't find user with provided user I'd" });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .end({
          error:
            "Something went wrong while finding user with provided user I'd",
        });
    });
});

userRouter.post("/forgotPassword", function (req, res) {
 let email = req.body.email;

 userModel.findOne({ email: email }, function (err, user) {
    if (err || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: '1h' 
    });

    sendMail(
      user.email,
      user.full_name,
      "Reset your password",
      `http://localhost:1234/user/resetPassword?token=${token}`,
      "reset password",
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Error sending email" });
        }
        res.status(200).json({ message: "Password reset email sent" });
      }
    );
 });
});

userRouter.post('/user/resetPassword', async (req, res) => {
  try {
      const {  password, confirmPassword } = req.body;
      const decoded = jwt.verify(token, 'your_secret_key');
 
     if (!password || !confirmPassword) {
       return res.status(400).json({ message: 'All fields are required' });
     }
 
     if (password !== confirmPassword) {
       return res.status(400).json({ message: 'Passwords do not match' });
     }
 
     // Hash the new password
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Update the user's password in the database
     const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });
 
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
 
     res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal Server error' });
  }
 });
 
   

module.exports = userRouter;
