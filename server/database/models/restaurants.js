const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
 description: String,
 id: String,
 imageId: String,
 isVeg: Boolean,
 name: String,
 price: Number
});

const RestaurantSchema = new Schema({
 id: String,
 name: String,
 cloudinaryImageId: String,
 locality: String,
 areaName: String,
 costForTwo: String,
 cuisines: [String],
 avgRating: Number,
 parentId: String,
 avgRatingString: String,
 totalRatingsString: String,
 menu: [MenuItemSchema]
});

const MenuItem = mongoose.model('menuItem', MenuItemSchema);
const Restaurant = mongoose.model('restaurant', RestaurantSchema);

module.exports = { Restaurant, MenuItem };
