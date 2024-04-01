import React, { useContext } from "react";
import CartContext from "../../utils/CartContext";
import { IMAGE_URL } from "../../config";
import UserContext from "../../utils/UserContext";
import axios from "axios";

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const user = useContext(UserContext);

  // Calculate the total price of all items in the cart
  const totalPrice = cart?.items?.reduce(
    (total, item) => total + item.price,
    0
  );

  const removeFromCart = (menuItem, restaurantId) => {
    setCart([...cart, menuItem]);
    axios
      .post(
        "http://localhost:5500/cart/removeFromCart",
        { menu: menuItem, restaurantId: restaurantId, userId: user.userId },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clearCart = () => {
    axios
      .delete(`http://localhost:5500/cart/clearCart/${user.userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setCart([]);
        console.log(res?.data);
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <button
        style={{ width: "50px", height: "25px" }}
        onClick={() => clearCart()}
      >
        Clear Cart
      </button>
      <div className='resataurantMenu'>
        <ol className=''>
          {cart?.items?.map((menu) => {
            return (
              <li className='row'>
                <div className='col-md-6'>
                  <h2>{menu?.name}</h2>
                  <p>{menu?.description}</p>
                  <p>Price: ₹{menu?.price / 100}</p>
                  <p>Veg: {menu?.isVeg ? "Yes" : "No"}</p>
                </div>
                <div className='col-md-6'>
                  <img
                    src={IMAGE_URL + menu?.imageId}
                    alt={menu?.name + " image"}
                    style={{
                      width: "200px",
                      height: "200px",
                      marginRight: "10px",
                    }}
                  />

                  <button
                    style={{ width: "50px", height: "25px" }}
                    onClick={() => removeFromCart(menu, restaurantDetails._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Display the total price */}
      <div>
        <h2>Total Price: ₹{totalPrice / 100}</h2>
      </div>

      <button>
        <a href={`/payment/${totalPrice / 100}`}>Proceed to payment</a>
      </button>
    </div>
  );
};

export default Cart;
