import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import useFetch from "../../hooks/useFetch";

const Cart = () => {
    // Access cart context to manage cart state and actions
    const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
    
    // Fetch menu data from API
    const { data: menuData, error } = useFetch("http://77.153.9.61:8000/api/product/");

    // Ensure menuItems is always an array to prevent errors
    const menuItems = Array.isArray(menuData?.results) ? menuData.results : [];

    // Handle errors during fetching
    if (error) return <p>Error loading menu: {error.message}</p>;
    if (!menuItems.length) return <p>Loading cart...</p>;

    // Filter cart items from the menu, ensuring only added products appear
    const cartItems = menuItems.filter(item => cart[item.id]);

    // Calculate total price based on cart quantities
    const totalPrice = cartItems.reduce((sum, item) => sum + (cart[item.id] * parseFloat(item.price)), 0);

    return (
        <div className="container text-center mx-auto">
            <h2>Your Cart</h2>

            {/* Display message if the cart is empty */}
            {cartItems.length === 0 && <p>Your cart is empty!</p>}

            {/* Display list of cart items */}
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        {/* Product Image */}
                        <img src={item.img || "/no-image.png"} alt={item.name} className="cart-image"/>
                        {/* Product Name and Quantity */}
                        {item.name} - ${item.price} x {cart[item.id]}
                        {/* Buttons to modify quantity */}
                        <div className="cart-buttons">
                            <button className="cart-btn remove" onClick={() => removeFromCart(item.id)}>-</button>
                            <button className="cart-btn add" onClick={() => addToCart(item.id)}>+</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Display total price and clear cart button if cart is not empty */}
            {cartItems.length > 0 && (
                <>
                    <p className="cart-summary"><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
                    <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
                </>
            )}
        </div>
    );
};

export default Cart;
