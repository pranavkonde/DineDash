const { Restaurant } = require("../database/models/restaurants");

const express = require("express");

const restaurantRouter = express.Router();

restaurantRouter.get("/all", async (req, res) => {
  try {
    const restuarants = await Restaurant.find({});
    if (restuarants.length) {
      return res.status(200).json(restuarants);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching all restaurants" });
  }
});

restaurantRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (restaurant) {
      return res.status(200).json(restaurant);
    }

    return res.status(404).json({ message: "Restaurant not found" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the restaurant" });
  }
});

restaurantRouter.get("/:id/menus", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id, "menu");

    if (restaurant) {
      return res.status(200).json(restaurant.menu);
    }

    return res.status(404).json({ message: "Restaurant not found" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the menus" });
  }
});


// Add a new restaurant
restaurantRouter.post('/restaurants', async (req, res) => {
  try {
     const restaurant = new Restaurant(req.body);
     await restaurant.save();
     res.status(201).send(restaurant);
  } catch (error) {
     res.status(400).send(error);
  }
 });
 
 // Add a menu item to a restaurant
 restaurantRouter.post('/restaurants/:id/menu', async (req, res) => {
  try {
     const restaurant = await Restaurant.findById(req.params.id);
     if (!restaurant) {
       return res.status(404).send('Restaurant not found');
     }
 
     const menuItem = new MenuItem(req.body);
     restaurant.menu.push(menuItem);
     await restaurant.save();
 
     res.status(201).send(menuItem);
  } catch (error) {
     res.status(400).send(error);
  }
 });

module.exports = restaurantRouter;
