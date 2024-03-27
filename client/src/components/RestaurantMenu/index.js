import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IMAGE_URL, restaurantMenuAPI } from "../../config";
import Shimmer from "../Shimmer";
import axios from "axios";
import "./index.css";

const RestaurantMenu = () => {
 const param = useParams();
 const [restaurantDetails, setRestaurantDetails] = useState(null);
 const [restaurantMenu, setRestaurantMenu] = useState(null);
 const [cart, setCart] = useState([]); // Step 1: Manage Cart State

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

 // Step 2: Add to Cart Function
 const addToCart = (menuItem) => {
    setCart([...cart, menuItem]);
 };

 return !restaurantDetails || !restaurantMenu ? (
    <Shimmer />
 ) : (
    <div className="restaurantPage">
      <div className="resataurantDetails">
        <h1>{restaurantDetails.name}</h1>
        <p>{restaurantDetails.id}</p>
        <img
          src={IMAGE_URL + restaurantDetails.cloudinaryImageId}
          alt={restaurantDetails.name + " image"}
        />
      </div>
      <div className="resataurantMenu">
        <ol>
          {restaurantMenu?.map((menu) => {
            return (
              <li key={menu?.id}>
                <h2>{menu?.name}</h2>
                <p>{menu?.description}</p>
                <p>Price: ₹{menu?.price / 100}</p>
                <p>Veg: {menu?.isVeg ? "Yes" : "No"}</p>
                <img
                 src={IMAGE_URL + menu?.imageId}
                 alt={menu?.name + " image"}
                 style={{ width: '100px', height: '100px' }}
                />
                {/* Step 3: Button in Each Menu Item */}
                <button onClick={() => addToCart(menu)}>Add to Cart</button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
 );
};

export default RestaurantMenu;
