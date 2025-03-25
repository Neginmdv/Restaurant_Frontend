import React from "react";
import useFetch from "../../hooks/useFetch";

const Info = () => {
  // Fetch restaurant information from API
  const { data: resInfo, error } = useFetch("http://77.153.9.61:8000/api/restaurant/");

  // Display an error message if the API request fails
  if (error) return <p>Error loading restaurant info: {error.message}</p>;

  // Display a loading message while waiting for data
  if (!resInfo || !resInfo.results || resInfo.results.length === 0) return <p>Loading info...</p>;

  // Extract restaurant information from API response
  const restaurant = resInfo.results[0];

  return (
    <div className="container text-center mx-auto">
      <h2>About Us</h2>
      <div className="info-section">
        {/* Display restaurant name, address, and contact number */}
        <h3>{restaurant.name}</h3>
        <p>{restaurant.address}</p>
        <p>{restaurant.number}</p>
      </div>
    </div>
  );
};

export default Info;
