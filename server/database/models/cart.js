const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
 menuItem: {
    type: String,
    ref: 'menuItem',
    required: true
 },
 quantity: {
    type: Number,
    required: true,
    min: 1
 }
});

const CartSchema = new Schema({
 userId: {
    type: Schema.Types.ObjectId,
    ref: 'user', 
    required: true
 },
 restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true
 },
 items: [CartItemSchema],
 totalPrice: {
    type: Number,
    default: 0
 }
}, { timestamps: true }); 

const cartModel = mongoose.model('Cart', CartSchema);

module.exports = cartModel;
