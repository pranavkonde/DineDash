import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useMatch } from "react-router-dom";
import axios from "axios";

import "./App.css";
import UserContext from "./utils/UserContext";
import CartContext from "./utils/CartContext";

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5500/user/authenticate", { withCredentials: true })
      .then((res) => {
        console.log(res?.data);
        setUser(res?.data);
      })
      .catch((err) => {
        console.log(err?.response?.status);
      });
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5500/cart/getAll/${user?.userId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setCart(res?.data);
        })
        .catch((err) => {
          console.log(err?.response?.status);
        });
    }
  }, [user, cart]);

  return (
    <>
      <UserContext.Provider value={user}>
        <CartContext.Provider value={{ cart: cart, setCart: setCart }}>
          <div className='main'>
            <Header />
            <Outlet />
            <Footer />
          </div>
        </CartContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default App;
