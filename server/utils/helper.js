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
  console.log(123)
  userModel
    .updateOne({ _id: userId }, { isVerified: true })
    .then(function (res) {
      console.log(1);
    });
}

module.exports = {
  createExpiry,
  generateOtp,
  deleteOtpFromDatabase,
  makeUserVerified,
};
