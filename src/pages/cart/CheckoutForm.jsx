import React from "react";

const CheckoutForm = ({
    clientName, setClientName, clientEmail, setClientEmail, clientNum, setClientNum , tableNumber, setTableNum ,formErrors
    }) => {
    return (
        <div className="checkout-form">

            <h4>Customer Info</h4>

            <input type="text" placeholder="Your Name (required)" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            
            <input type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            {formErrors?.email && <p style={{ color: "red" }}>{formErrors.email}</p>}

            <input type="text" placeholder="Phone Number" value={clientNum} onChange={(e) => setClientNum(e.target.value)} />
            {formErrors?.phone && <p style={{ color: "red" }}>{formErrors.phone}</p>}

            <input type="text" placeholder="Table Number" value={tableNumber} onChange={(e) => setTableNum(e.target.value)} />
        
        </div>
    );
};

export default CheckoutForm;
