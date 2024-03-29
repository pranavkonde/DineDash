const  cartModel  = require("../database/models/cart");

const express = require("express");

const cartRouter = express.Router();

// Create a new cart
cartRouter.post('/cart', async (req, res) => {
    const { userId, restaurantId } = req.body;
    const cart= await cartModel.create({userId,restaurantId})
    if(cart){
        res.status(201).send(cart);
    }
    res.status(400).end();
   });
   
   // Add an item to the cart
   cartRouter.post('/cart/:cartId/items', async (req, res) => {
    const { cartId } = req.params;
    console.log("cartId",cartId)
    const { menuItem, quantity, price } = req.body;
    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).send('Cart not found');
   
    cart.items.push({ menuItem, quantity });
    cart.totalPrice += quantity * price; 
    await cart.save();
    res.send(cart);
   });
   
   // Get cart details
   cartRouter.get('/cart/:cartId', async (req, res) => {
    const { cartId } = req.params;
    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).send('Cart not found');
    res.send(cart);
   });
   
   // Update an item in the cart
   cartRouter.put('/cart/:cartId/items/:itemIndex', async (req, res) => {
    const { cartId, itemIndex } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).send('Cart not found');
   
    const item = cart.items[itemIndex];
    if (!item) return res.status(404).send('Item not found');
   
    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.menuItem.price, 0);
    await cart.save();
    res.send(cart);
   });
   
   // Delete an item from the cart
   cartRouter.delete('/api/cart/:cartId/items/:itemIndex', async (req, res) => {
    const { cartId, itemIndex } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).send('Cart not found');
   
    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.menuItem.price, 0);
    await cart.save();
    res.send(cart);
   });
   

   module.exports = cartRouter;