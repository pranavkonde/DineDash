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
      
        <h1>{restaurantDetails.name}</h1>
        {/* <img
          src={IMAGE_URL + restaurantDetails.cloudinaryImageId}
          alt={restaurantDetails.name + " image"}
          
        /> */}
        
      
      <div className="resataurantMenu">
        <ol className="">
          {restaurantMenu?.map((menu) => {
            return (
              <li className="row">
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

                 <button style={{ width: '50px', height: '25px' }} onClick={() => addToCart(menu)}>ADD</button>
                 </div>
             </li>
            );
          })}
        </ol>
      </div>
    </div>
 );
};

export default RestaurantMenu;
