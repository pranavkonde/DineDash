import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../../utils/UserContext";

const UpdateUserDetails = () => {
  const user1 = useContext(UserContext);
  console.log("1", user1);
  const [user, setUser] = useState({
    full_name: "",
    address: "",
    email: "",
    phone_no: "",
  });

  useEffect(() => {
    if (user1) {
      axios
        .get(`http://localhost:5500/user/user/${user1?.userId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const { password, ...userData } = response.data;
          console.log("userID", userData._id);
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5500/user/updateProfile/${user1?.userId}`, user)
      .then((response) => {
        alert("User details updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
        alert("Failed to update user details");
      });
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f8f8f8",
  };

  const labelStyle = {
    marginBottom: "10px",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "4px 8px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#fc8019",
    color: "#fff",
    cursor: "pointer",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label style={labelStyle}>
        Full Name:
        <input
          type='text'
          name='full_name'
          value={user.full_name}
          onChange={handleChange}
          required
          style={inputStyle}
          readOnly
        />
      </label>
      <label style={labelStyle}>
        Address:
        <input
          type='text'
          name='address'
          value={user.address}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>
      <label style={labelStyle}>
        Email:
        <input
          type='email'
          name='email'
          value={user.email}
          onChange={handleChange}
          required
          style={inputStyle}
          readOnly
        />
      </label>
      <label style={labelStyle}>
        Phone Number:
        <input
          type='text'
          name='phone_no'
          value={user.phone_no}
          onChange={handleChange}
          required
          style={inputStyle}
          readOnly
        />
      </label>
      <button type='submit' style={buttonStyle}>
        Update
      </button>
    </form>
  );
};

export default UpdateUserDetails;
