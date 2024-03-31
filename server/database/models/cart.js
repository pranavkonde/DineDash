const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  menuItem: {
    type: String,
    ref: "menuItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const MenuItemSchema = new Schema({
  description: String,
  id: String,
  imageId: String,
  isVeg: Boolean,
  name: String,
  price: Number,
});

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    items: [MenuItemSchema],
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", CartSchema);

module.exports = cartModel;
