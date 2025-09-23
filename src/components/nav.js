import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import useFetch from '../hooks/useFetch';

const Nav = () => {
    // State to manage the mobile menu toggle
    const [isOpen, setIsOpen] = useState(false);

    // Fetch restaurant info from API
    const { data: resInfo, error } = useFetch("http://77.153.9.61:8000/api/restaurant/");
    const restaurant = resInfo?.results?.[0];

    // Extract restaurant logo from API response
    const restaurantLogo = restaurant?.logo || null;

    // Extract restaurant name from API response, defaulting to "Restaurant" if data is unavailable
    const restaurantName = restaurant?.name || "Restaurant";

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                {/* Display restaurant name and logo in the navbar */}
                <div className="navbar-brand d-flex align-items-center gap-2">
                {restaurantLogo && (
                    <img src={restaurantLogo} alt="Restaurant Logo" className="nav-logo" />
                )}
                <h1 className="restaurant-title">{restaurantName}</h1>
                </div>

                {/* Show error message if API request fails */}
                {error && <p style={{ color: 'red' }}>Failed to load name</p>}

                {/* Button to toggle the mobile navigation menu */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>

                {/* Navigation Menu Items */}
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto">
                        {["Menu", "Info", "Cart"].map((page, index) => (
                            <li key={index} className="nav-item">
                                {/* Link to different pages, close menu on selection */}
                                <Link to={`/${page.toLowerCase()}`} className='nav-link' onClick={() => setIsOpen(false)}>
                                    {/* Display shopping cart icon for Cart page */}
                                    {page === "Cart" ? <FontAwesomeIcon icon={faShoppingCart} /> : page}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
