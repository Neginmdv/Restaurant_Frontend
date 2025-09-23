import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark ,faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import useFetch from "../../hooks/useFetch";
import { CartContext } from "../../context/CartContext";

const Menu = () => {
    // Fetch menu data from API
    const { data: menuData, error: menuError } = useFetch("http://77.153.9.61:8000/api/product/");
    
    // Access cart context to manage cart state and actions
    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    
    // State to store selected category for filtering menu items
    const [selectedCategory, setSelectedCategory] = useState("All");
        
    // State to manage popup for selected menu item
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch categories from API
    const { data: categoryData, error: categoryError } = useFetch("http://77.153.9.61:8000/api/category/");
    const categories = Array.isArray(categoryData?.results) ? categoryData.results : [];
    if (categoryError) return <p>Error loading categories: {categoryError.message}</p>;


    // Ensure menuItems is always an array to prevent errors
    const menuItems = Array.isArray(menuData?.results) ? menuData.results : [];

    // Handle errors during fetching
    if (menuError) return <p>Error loading menu: {menuError.message}</p>;
    if (!menuData && !menuError) return null;

    // Create a category map {id: name} for easy lookup
    const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
    }, {});

    // Create category buttons with "All" option
    const uniqueCategories = ["All", ...categories.map(category => category.name)];

    // Filter items based on selected category
    const filteredItems = selectedCategory === "All"
        ? menuItems
        : menuItems.filter(item => categoryMap[item.category] === selectedCategory);

    // Function to show popup with item details
    const openPopup = (item) => setSelectedItem(item);
    
    // Function to close popup
    const closePopup = () => setSelectedItem(null);

    return (
        <div className="container text-center">
            <h2>Our Menu</h2>

            {/* Category Filter Buttons */}
            <div className="category-filter">
                {uniqueCategories.map((category, index) => (
                    <button key={index} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "active" : ""}>
                        {category}
                    </button>
                ))}
            </div>

            {/* Display Menu Items */}
            <div className="menu-grid">
                {filteredItems.map(item => (
                <div key={item.id} className={`menu-item ${item.is_available ? "" : "unavailable"}`} onClick={() => openPopup(item)}>
                    <img src={item.img || "/no-image.png"} alt={item.name || "Menu item"} className="menu-image" />

                        <div className="menu-content">
                            <h3>{item.name}</h3>
                            <p>{item.description?.length > 30 ? item.description.substring(0, 30) + "..." : item.description}</p>
                            <p className={item.is_available ? "available" : "not-available"}>
                                {item.is_available ? "Available" : "Not Available"}
                            </p>
                            <p><strong>${item.price}</strong></p>
                        </div>

                        <div className="quantity-controls">
                            <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} disabled={!item.is_available}>
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span>{cart[item.id] || 0}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(item.id); }} disabled={!item.is_available}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popup for More Info */}
            {selectedItem && (
            <div className="popup-overlay" onClick={closePopup}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>

                    {/* Close Button with FontAwesome Icon */}
                    <button className="close-btn" onClick={closePopup}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>

                    <h2>{selectedItem.name}</h2>
                    <img src={selectedItem.img || "/no-image.png"} alt={selectedItem.name} className="popup-image" />
                    <p>{selectedItem.description}</p>
                    <p className={selectedItem.is_available ? "available" : "not-available"}>
                        {selectedItem.is_available ? "Available" : "Not Available"}
                    </p>
                    <p><strong>${selectedItem.price}</strong></p>
                </div>
            </div>
            )}
        </div>
    );
};

export default Menu;
