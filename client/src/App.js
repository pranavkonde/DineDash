import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, useMatch } from "react-router-dom";

import "./App.css";
import UserContext from "./utils/UserContext";

const App = () => {
  const [user, setUser] = useState({
    name: "Pranav Konde",
    email: "pranavkonde2020@gmail.com",
  });
  return (
    <>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <div className='main'>
          <Header />
          <Outlet />
          <Footer />
        </div>
      </UserContext.Provider>
    </>
  );
};

export default App;
