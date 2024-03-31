import { useContext, useEffect, useState } from "react";

import RestaurantCard from "../RestaurantCard";
import Shimmer from "../Shimmer";
import axios from "axios";
import "./index.css";
import { restaurantListAPI } from "../../config";
import { Link } from "react-router-dom";
import UserContext from "../../utils/UserContext";

function filterRestaurants(searchText, restaurants) {
  const lst = restaurants.filter((restaurant) =>
    restaurant?.name?.toLowerCase().includes(searchText?.toLowerCase())
  );
  return lst;
}

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  // const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    axios.get("http://localhost:5500/restaurants/all").then((response) => {
      setAllRestaurants(response.data);
      setFilteredRestaurants(response.data);
    });
  }

  if (!allRestaurants) return null; //This will help to not break if allRestaurnts is not there

  return allRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <>
      <div className='searchDiv'>
        <input
          type='text'
          value={searchText}
          placeholder='Search for Restaurants'
          autoComplete='on'
          onChange={(e) => {
            setSearchText(e.target.value);
            const data = filterRestaurants(e.target.value, allRestaurants);
            setFilteredRestaurants(data);
          }}
        />
        {searchText.length < 1 ? (
          <svg
            className='_1GTCc'
            viewBox='5 -1 12 25'
            height='17'
            width='17'
            fill='#686b78'
          >
            <path d='M17.6671481,17.1391632 L22.7253317,22.1973467 L20.9226784,24 L15.7041226,18.7814442 C14.1158488,19.8024478 12.225761,20.3946935 10.1973467,20.3946935 C4.56550765,20.3946935 0,15.8291858 0,10.1973467 C0,4.56550765 4.56550765,0 10.1973467,0 C15.8291858,0 20.3946935,4.56550765 20.3946935,10.1973467 C20.3946935,12.8789625 19.3595949,15.3188181 17.6671481,17.1391632 Z M10.1973467,17.8453568 C14.4212261,17.8453568 17.8453568,14.4212261 17.8453568,10.1973467 C17.8453568,5.97346742 14.4212261,2.54933669 10.1973467,2.54933669 C5.97346742,2.54933669 2.54933669,5.97346742 2.54933669,10.1973467 C2.54933669,14.4212261 5.97346742,17.8453568 10.1973467,17.8453568 Z'></path>
          </svg>
        ) : (
          <svg
            width='19'
            height='19'
            viewBox='0 0 24 24'
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSearchText("");
              const data = filterRestaurants("", allRestaurants);
              setFilteredRestaurants(data);
            }}
          >
            <path
              d='M17.0251484,0.288798437 C17.5090218,-0.114571204 18.2292627,-0.0967643175 18.6927565,0.350826444 C19.189357,0.830387975 19.2031698,1.62172366 18.7236083,2.11832416 L18.7236083,2.11832416 L11.274,9.831 L18.7236083,17.5450054 C19.2031698,18.0416059 19.189357,18.8329416 18.6927565,19.3125031 C18.2292627,19.7600939 17.5090218,19.7779007 17.0251484,19.3745311 L16.9252588,19.2816513 L9.537,11.631 L2.14917595,19.2816513 L2.04928636,19.3745311 C1.56541292,19.7779007 0.845172034,19.7600939 0.381678232,19.3125031 C-0.114922271,18.8329416 -0.128735086,18.0416059 0.350826444,17.5450054 L0.350826444,17.5450054 L7.799,9.831 L0.350826444,2.11832416 C-0.128735086,1.62172366 -0.114922271,0.830387975 0.381678232,0.350826444 C0.845172034,-0.0967643175 1.56541292,-0.114571204 2.04928636,0.288798437 L2.14917595,0.381678232 L9.537,8.032 L16.9252588,0.381678232 Z'
              fill='#535766'
              fillRule='nonzero'
            ></path>
          </svg>
        )}
      </div>
      <div className='Restaurants'>
        {filteredRestaurants.length === 0 ? (
          <h1>No Restaurants Found!!</h1>
        ) : (
          filteredRestaurants?.map((restaurant) => {
            return (
              <Link
                to={"/restaurants/" + restaurant._id}
                key={restaurant.id}
                style={{ color: "inherit" }}
              >
                <RestaurantCard {...restaurant} />
              </Link>
            );
          })
        )}
      </div>
    </>
  );
};

export default Body;
