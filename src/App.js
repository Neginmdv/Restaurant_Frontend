// Import global styles and Bootstrap for styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import necessary React components and hooks
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from './pages/cart/cart';
import Nav from './components/nav';
import Info from './pages/info/info';
import Menu from './pages/menu/menu';
import CartProvider from './context/CartContext';
import { useEffect } from "react";
import useFetch from "./hooks/useFetch";

function App() {
    // Fetch restaurant data to dynamically update the page title
    const { data: resInfo } = useFetch("http://77.153.9.61:8000/api/restaurant/");

    // Update the document title dynamically when restaurant data is loaded
    useEffect(() => {
        if (resInfo && resInfo.results && resInfo.results.length > 0) {
            document.title = resInfo.results[0].name; // Set tab title to restaurant name
        }
    }, [resInfo]); // Runs whenever resInfo changes

    return (
        // Provide cart state globally using CartProvider
        <CartProvider>
            {/* Enable routing in the application */}
            <Router>
                {/* Navigation bar component */}
                <Nav />

                {/* Define application routes for different pages */}
                <Routes>
                    <Route path="/" element={<Menu />} /> {/* Default route - Menu Page */}
                    <Route path="/menu" element={<Menu />} /> {/* Menu Page */}
                    <Route path="/cart" element={<Cart />} /> {/* Cart Page */}
                    <Route path="/info" element={<Info />} /> {/* Info Page */}
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;
