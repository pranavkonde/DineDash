import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IMAGE_URL, restaurantMenuAPI } from "../../config";
import Cart from './index.js'; // Assuming this is your Cart component
import Shimmer from "../Shimmer";
import axios from "axios";
import "./index.css";

const RestaurantMenu = () => {
    const param = useParams();
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [restaurantMenu, setRestaurantMenu] = useState(null);
    const [cart, setCart] = useState([]); // Manage Cart State
    const [quantityInput, setQuantityInput] = useState({}); // Manage quantity input for each menu item

    useEffect(() => {
        fetchRestuarantDetails();
    }, []);

    async function fetchRestuarantDetails() {
        axios
            .get(`http://localhost:5500/restaurants/${param.id}`)
            .then((response) => {
                setRestaurantDetails(response?.data);
                setRestaurantMenu(response?.data?.menu);
            });
    }

    // Add to Cart Function
    const addToCart = (menuItem) => {
        const quantity = quantityInput[menuItem.id] || 0;
        if (quantity > 0) {
            // Check if the item already exists in the cart
            const existingItem = cart.find(item => item.menuItem.id === menuItem.id);

            if (existingItem) {
                // If the item exists, update the quantity
                const updatedCart = cart.map(item =>
                    item.menuItem.id === menuItem.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                setCart(updatedCart);
            } else {
                // If the item doesn't exist, add it with the selected quantity
                setCart([...cart, { menuItem, quantity }]);
            }
        }
    };

    // Functions to increase and decrease quantity
    const increaseQuantity = (menuItem) => {
        setQuantityInput(prev => ({ ...prev, [menuItem.id]: (prev[menuItem.id] || 0) + 1 }));
    };

    const decreaseQuantity = (menuItem) => {
        setQuantityInput(prev => ({ ...prev, [menuItem.id]: Math.max((prev[menuItem.id] || 0) - 1, 0) }));
    };

    // Remove item from cart
    const removeItem = (menuItemId) => {
        setCart(cart.filter(item => item.menuItem.id !== menuItemId));
    };

    return !restaurantDetails || !restaurantMenu ? (
        <Shimmer />
    ) : (
        <div className="restaurantMenu">
            <ol className="">
                {restaurantMenu?.map((menu) => (
                    <li className="row" key={menu.id}>
                        <div className="col-md-6">
                            <h2>{menu?.name}</h2>
                            <p>{menu?.description}</p>
                            <p>Price: ₹{menu?.price / 100}</p>
                            <p>Veg: {menu?.isVeg ? "Yes" : "No"}</p>
                        </div>
                        <div className="col-md-6">
                            <img
                                src={IMAGE_URL + menu?.imageId}
                                alt={menu?.name + " image"}
                                style={{ width: '200px', height: '200px', marginRight: '10px' }}
                            />
                            {/* Quantity input and Add button */}
                            <input
                                type="number"
                                value={quantityInput[menu.id] || ''}
                                onChange={(e) => setQuantityInput({ ...quantityInput, [menu.id]: parseInt(e.target.value) })}
                                style={{ width: '50px', height: '25px' }}
                            />
                            <button style={{ width: '50px', height: '25px' }} onClick={() => addToCart(menu)}>ADD</button>
                        </div>
                    </li>
                ))}
            </ol>
            <Cart
    cartItems={cart}
    removeItem={removeItem}
    increaseQuantity={increaseQuantity}
    decreaseQuantity={decreaseQuantity}
/>
        </div>
    );
};

export default RestaurantMenu;
