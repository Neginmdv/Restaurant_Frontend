import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

const Info = () => {
  // Fetch restaurant information from API
  const { data: resInfo, error } = useFetch("http://77.153.9.61:8000/api/restaurant/");

  // State to store opening hours
  const [hours, setHours] = useState([]);
  
  // Fetch opening hours
  useEffect(() => {
    if (resInfo?.results?.length > 0) {
      const restaurantId = resInfo.results[0].id;
      fetch(`http://77.153.9.61:8000/api/horaire/?restaurant=${restaurantId}`)
        .then(response => response.json())
        .then(data => setHours(data.results || []))
        .catch(err => console.error("Error loading opening hours:", err));
    }
  }, [resInfo]);

  // Display an error message if the API request fails
  if (error) return <p>Error loading restaurant info: {error.message}</p>;

  // Display a loading message while waiting for data
  if (!resInfo || !resInfo.results || resInfo.results.length === 0) return null;

  // Extract restaurant information from API response
  const restaurant = resInfo.results[0];

  return (
    <div className="container text-center mx-auto">
      <h2>About Us</h2>
      <div className="info-section">
        {/* Display restaurant name, address, and contact number */}
        <h3>{restaurant.name}</h3>
        <p><strong>Address : </strong> {restaurant.address}</p>
        <p><strong>Phone Number : </strong> {restaurant.number}</p>
        <iframe
          title="Google Map"
          width="100%"
          height="300"
          style={{ border: 0, marginTop: "20px", borderRadius: "10px" }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.address)}&output=embed`}>
        </iframe>

        {/* Display opening hours */}
        {hours.length > 0 && (
          <div>
            <p><strong>Openning Hours</strong></p>
            {hours.map(h => (
              <p key={h.id}>
                {h.jour} : {h.heure_ouverture} - {h.heure_fermeture}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
