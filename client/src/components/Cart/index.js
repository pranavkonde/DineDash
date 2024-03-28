import React from 'react';

const Cart = ({ cartItems = [], removeItem, increaseQuantity, decreaseQuantity }) => {
    // cartItems is now guaranteed to be an array, thanks to the default parameter value

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * item.menuItem.price / 100), 0);
    // Inside Cart component
console.log("Cart items:", cartItems);

    return (
        <div>
            <h2>Your Cart</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.menuItem.id}>
                        {item.menuItem.name} - Quantity: {item.quantity}
                        <button onClick={() => increaseQuantity(item.menuItem)}>+</button>
                        <button onClick={() => decreaseQuantity(item.menuItem)}>-</button>
                        <button onClick={() => removeItem(item.menuItem.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
            <button><a href='/payment'>Proceed to payment</a></button>
        </div>
    );
};

export default Cart;
