import { useState, useEffect } from "react";
import axios from "axios";

// Custom Hook for Fetching Data
const useFetch = (url) => {
    // State to store fetched data
    const [data, setData] = useState(null);
    // State to store any errors during fetching
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(url)
            .then(response => {
                setData(response.data); // Store the fetched data in state
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err); // Store the error in state for handling
                setData({ results: [] }); // Ensure `results` exists to prevent potential errors
            });
    }, [url]); // Re-run effect when the URL changes

    return { data, error }; // Return fetched data and error state
};

export default useFetch;
