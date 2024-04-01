const cartModel = require("../database/models/cart");

const express = require("express");

const cartRouter = express.Router();

// Create a new cart
cartRouter.post("/cart", async (req, res) => {
  const { userId, restaurantId } = req.body;
  const cart = await cartModel.create({ userId, restaurantId });
  if (cart) {
    res.status(201).send(cart);
  }
  res.status(400).end();
});

// Add an item to the cart
cartRouter.post("/addToCart", async (req, res) => {
  const { menu, restaurantId, userId } = req.body;

  const cart = await cartModel.findOne({ userId: userId });

  if (cart && cart._id) {
    cart.items = [...cart.items, menu];
    const response = await cartModel.findByIdAndUpdate(cart._id, {
      items: cart.items,
    });
    if (!response._id) {
      return res.sendStatus(404);
    }
    return res.status(200).send(response);
  } else {
    const cart1 = await cartModel.create({
      userId: userId,
      restaurantId: restaurantId,
      items: [menu],
    });
    if (!cart1._id) {
      return res.sendStatus(404);
    }
    return res.status(200).send(cart1);
  }
});

// Get cart details
cartRouter.get("/getAll/:userId", async (req, res) => {
  const { userId } = req.params;
  const cart = await cartModel.findOne({ userId: userId });
  if (!cart) return res.status(404).send("Cart not found");
  res.status(200).send(cart);
});

cartRouter.delete("/clearCart/:userId", async (req, res) => {
  const { userId } = req.params;
  const cart = await cartModel.findOneAndUpdate(
    { userId: userId },
    { items: [] }
  );
  if (!cart) return res.status(404).send("Cart not found");
  res.status(200).send(cart);
});

cartRouter.post("/removeFromCart", async (req, res) => {
  const { menuId, userId } = req.body;

  const cart = await cartModel.findOne({ userId: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => item.id.toString() !== menuId);

  await cart.save();

  if (!cart) return res.status(404).send("Cart not found");
  res.status(200).json({ message: "Item removed from cart" });
});

// Update an item in the cart
cartRouter.put("/cart/:cartId/items/:itemIndex", async (req, res) => {
  const { cartId, itemIndex } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).send("Cart not found");

  const item = cart.items[itemIndex];
  if (!item) return res.status(404).send("Item not found");

  item.quantity = quantity;
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.menuItem.price,
    0
  );
  await cart.save();
  res.send(cart);
});

// Delete an item from the cart
cartRouter.delete("/api/cart/:cartId/items/:itemIndex", async (req, res) => {
  const { cartId, itemIndex } = req.params;
  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).send("Cart not found");

  cart.items.splice(itemIndex, 1);
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.menuItem.price,
    0
  );
  await cart.save();
  res.send(cart);
});

module.exports = cartRouter;
