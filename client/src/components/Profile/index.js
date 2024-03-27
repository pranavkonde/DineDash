import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateUserDetails = ({ userId }) => {
 const [user, setUser] = useState({
    full_name: '',
    address: '',
    email: '',
    phone_no: '',
 });

 useEffect(() => {
    // Fetch the current user's information when the component mounts
    axios.get(`/api/users/${userId}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
 }, [userId]);

 const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
 };

 const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5500/user/profile/${userId}`, user)
      .then(response => {
        alert('User details updated successfully');
        // Optionally, redirect or update the UI to reflect the changes
      })
      .catch(error => {
        console.error('Error updating user details:', error);
        alert('Failed to update user details');
      });
 };

 return (
    <form onSubmit={handleSubmit}>
      <label>
        Full Name:
        <input
          type="text"
          name="full_name"
          value={user.full_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phone_no"
          value={user.phone_no}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Update Details</button>
    </form>
 );
};

export default UpdateUserDetails;
