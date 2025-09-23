import React from "react";

const CheckoutForm = ({
    clientName, setClientName, clientEmail, setClientEmail, clientNum, setClientNum , formErrors , setFormErrors
    }) => {
    return (
        <div className="checkout-form">
            <h4>Customer Info</h4>
            <input type="text" placeholder="Your Name (required)" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            <input type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            {formErrors?.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
            <input type="text" placeholder="Phone Number" value={clientNum} onChange={(e) => setClientNum(e.target.value)} />
            {formErrors?.phone && <p style={{ color: "red" }}>{formErrors.phone}</p>}
        </div>
    );
};

export default CheckoutForm;
