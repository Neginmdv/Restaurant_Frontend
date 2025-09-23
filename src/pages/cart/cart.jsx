import React, { useContext , useState } from "react";
import { CartContext } from "../../context/CartContext";
import useFetch from "../../hooks/useFetch";
import CheckoutForm from "./CheckoutForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';


const Cart = () => {
    const [formErrors, setFormErrors] = useState({ email: "", phone: "" });
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientNum, setClientNum] = useState("");
    const [tableNum, setTableNum] = useState("");
    const [orderType, setOrderType] = useState("A emporter");

    // Local state for order submission
    const [showFinalizePopup, setShowFinalizePopup] = useState(false); // Popup confirmation state
    const [isSending, setIsSending] = useState(false); // Disables button while sending
    const [orderSuccess, setOrderSuccess] = useState(false); // Shows success message
    
    // Access cart context to manage cart state and actions
    const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
    // Fetch menu data from API
    const { data: menuData, error } = useFetch("http://77.153.9.61:8000/api/product/");
    // Ensure menuItems is always an array to prevent errors
    const menuItems = Array.isArray(menuData?.results) ? menuData.results : [];
    // Filter cart items from the menu, ensuring only added products appear
    const cartItems = menuItems.filter(item => cart[item.id]);
    // Calculate total price based on cart quantities
    const totalPrice = cartItems.reduce((sum, item) => sum + (cart[item.id] * parseFloat(item.price)), 0);

    // input validation functions
    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) =>
        /^\+?[0-9]{8,15}$/.test(phone);
    
    // Validation function before finalizing the order
    const validateBeforeFinalize = () => { 
        const errors = {email: "", phone: ""};

        if (!clientName.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (clientEmail && !isValidEmail(clientEmail)) errors.email = "Invalid email format (e.g. example@gmail.com)";
        
        if (clientNum && !isValidPhone(clientNum)) errors.phone = "Invalid phone number (e.g. +33612345678)";

        if (orderType === "Sur place" && (!tableNum || tableNum === "")) {
            alert("Please enter the table number for dine-in orders.");
            return;
        }
        
        if (errors.email || errors.phone) {
            setFormErrors(errors);
            return;
        }
        
        setFormErrors({email: "", phone: ""});
        setShowFinalizePopup(true);
    };

    // Function to place the order and send it to the backend
    const handleOrderSubmit = async () => {
        if (cartItems.length === 0) return; // No items in cart
 
        setIsSending(true);
        setOrderSuccess(false);

        try {
            console.log("SENDING:", {
                order_type: orderType,
                client_name: clientName,
                client_email: clientEmail,
                client_num: clientNum,
                table_number: tableNum,
                is_validated: true
              });
              
            //Create the order
            const panierRes = await fetch("http://77.153.9.61:8000/api/panier/", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    order_type: orderType,
                    client_name: clientName,
                    client_email: clientEmail,
                    client_num: clientNum,
                    table_number: orderType === "Sur place" ? tableNum : null,
                    is_validated: true
                })
            });

            const panierData = await panierRes.json();
            const panierId = panierData.id;            

            //Add each product to quantite
            const quantiteRequests = cartItems.map(item =>
                fetch("http://77.153.9.61:8000/api/quantite/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        products: item.id,
                        panier: panierId,
                        qte_product: cart[item.id]
                    })
                })
            );

            await Promise.all(quantiteRequests); //Wait for all to finish

            setOrderSuccess(true);  //Show confirmation
            
            //reset form fields
            setClientName("");
            setClientEmail("");
            setClientNum("");
            setTableNum("");
            setShowFinalizePopup(false);

        } catch (err) {
            console.error("Order failed:", err);
            alert("There was a problem placing the order. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    // Handle errors during fetching
    if (error) return <p> Error loading menu: {error.message}</p>;
    if (!menuItems.length) return null;

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
                            <button className="cart-btn remove" onClick={() => removeFromCart(item.id)}>
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <button className="cart-btn add" onClick={() => addToCart(item.id)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button className="cart-btn trash" onClick={() => removeFromCart(item.id, true)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/*if cart is not empty */}
            {cartItems.length > 0 && (
                <>
                    {/*Display total price and clear button*/}
                    <div className="cart-summary-wrapper">
                        <p className="cart-summary"><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
                        <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
                    </div>

                    <CheckoutForm
                        clientName={clientName}
                        setClientName={setClientName}
                        clientEmail={clientEmail}
                        setClientEmail={setClientEmail}
                        clientNum={clientNum}
                        setClientNum={setClientNum}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                    />
                    
                    {/* Order Type Selector */}
                    <div className="order-type-selector" >
                        <label><h5>Order Type:</h5></label><br />
                        <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                            <option value="Sur place">Dine In</option>
                            <option value="A emporter">Takeaway</option>
                        </select>
                        {orderType === "Sur place" && (
                            <input type="number" placeholder="Table Number (required)" 
                            value={tableNum} onChange={(e) => setTableNum(e.target.value)} 
                            required className="table-form"/>
                        )}

                    </div>

                    {/* Finalise order*/}
                    {!showFinalizePopup && (
                        <button onClick={validateBeforeFinalize} className="clear-cart">Confirm Order</button>
                    )}

                    {/* Final Confirmation */}
                    {showFinalizePopup && (
                        <div className="modal-overlay" onClick={() => setShowFinalizePopup(false)}>
                            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                <h3> Finalize Order </h3>
                                <p>Are you sure you want to send your order? </p>
                                <div className="popup-buttons">
                                    <button onClick={() => setShowFinalizePopup(false)} className="finalize"> Cancel </button>
                                    <button onClick={handleOrderSubmit} disabled={isSending} className="finalize"> {isSending ? "Sending..." : "Yes"} </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {orderSuccess && (
                        <p style={{ color: "green", marginTop: "10px" }}> Order placed successfully! </p>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;
