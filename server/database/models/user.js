const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: {
      type: String, 
      required: true,
    },
    address: {
      type: String, 
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    }
},
{ timestamps: true }
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;