import { createContext, useState, useEffect } from "react";

// Create a context for managing the cart state globally
export const CartContext = createContext();

const CartProvider = ({ children }) => {
    // Initialize cart state, retrieving stored data from localStorage if available
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    // Persist cart state in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Function to add an item to the cart (increments quantity if already present)
    const addToCart = (itemId) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart, [itemId]: (prevCart[itemId] || 0) + 1 };
            return updatedCart;
        });
    };

    // Function to remove an item from the cart (decrements quantity, removes if zero)
    const removeFromCart = (itemId) => {
        setCart(prevCart => {
            if (!prevCart[itemId]) return prevCart;
            const updatedCart = { ...prevCart };
            updatedCart[itemId] -= 1;
            if (updatedCart[itemId] === 0) delete updatedCart[itemId];
            return updatedCart;
        });
    };

    // Function to clear all items from the cart
    const clearCart = () => {
        setCart({});
        localStorage.removeItem("cart");
    };

    return (
        // Provide cart state and functions to children components
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;