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
 
  // Validate full_name (no numbers)
  const fullNameRegex = /^[a-zA-Z\s]*$/;
  if (!fullNameRegex.test(full_name)) {
     return res.status(400).json({ message: "Full name should not contain numbers." });
  }
 
  // Validate email (no spaces, valid format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
     return res.status(400).json({ message: "Email should not contain spaces and must be in a valid format." });
  }
 
  // Validate phone_no (only digits)
  const phoneNoRegex = /^\d+$/;
  if (!phoneNoRegex.test(phone_no)) {
     return res.status(400).json({ message: "Phone number should not contain any characters other than digits." });
  }
 
  // Validate password (at least one special character, one number, length <= 8)
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{1,8}$/;
  if (!passwordRegex.test(password)) {
     return res.status(400).json({ message: "Password must contain at least one special character, one number, and be 8 characters or less." });
  }
 
  userModel.findOne({ email: email }, function (err, user) {
     if (user) {
       // User already exists, send a specific message
       return res.status(400).json({ message: "User already registered with this email." });
     } else {
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
 
  // Validate email (no spaces, valid format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email should not contain spaces and must be in a valid format." });
  }
 
  // Validate password (at least one special character, one number, length <= 8)
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{1,8}$/;
  if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one special character, one number, and be 8 characters or less." });
  }
 
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
                // Send a response indicating an incorrect password
                res.status(401).json({ message: "Incorrect password." });
              }
            })
            .catch((err) => {
              // Handle any errors that occur during the bcrypt.compare operation
              console.error(err);
              res.status(401).json({ message: "An error occurred while verifying the password." });
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
        res.status(401).json({ message: "User not Registered." });
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

userRouter.post('/resetPassword', async (req, res) => {
  try {
      const {  password, confirmPassword,token } = req.body;
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
     if (!password || !confirmPassword) {
       return res.status(400).json({ message: 'All fields are required' });
     }
 
     if (password !== confirmPassword) {
       return res.status(400).json({ message: 'Passwords do not match' });
     }
 
     // Hash the new password
     const hashedPassword = await bcrypt.hash(password, 10);
    
     const user = await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });
 
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
 
     res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal Server error' });
  }
 });
 


// User Profile Update API
userRouter.put('/profile/:id', async (req, res) => {
  try {
     const { id } = req.params;
     const { full_name, address, phone_no } = req.body;
 
     const update = {
       full_name: full_name,
       address: address,
       phone_no: phone_no,
     };
 
     const updatedUser = await userModel.findByIdAndUpdate(id, update, { new: true });
 
     if (!updatedUser) {
       return res.status(404).send('User not found');
     }
 
     res.send(updatedUser);
  } catch (error) {
     res.status(500).send(error.message);
  }
 });
 
module.exports = userRouter;
