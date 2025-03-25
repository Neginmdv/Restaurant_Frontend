fetch("http://77.153.9.61:8000/api/restaurant/")
  .then(response => response.json())
  .then(data => {
    if (data && data.results && data.results.length > 0) {
      const restaurant = data.results[0];

      // Set document title dynamically
      document.title = restaurant.name;

      // Update favicon dynamically
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = restaurant.logo || "/default-favicon.png"; // Use restaurant logo if available

      // Ensure the logo URL is properly formatted
      let logoUrl = "/default-logo192.png"; // Default fallback
      if (restaurant.logo && !restaurant.logo.startsWith("http")) {
        logoUrl = `http://77.153.9.61:8000${restaurant.logo}`; // Append base URL if needed
      } else if (restaurant.logo) {
        logoUrl = restaurant.logo; // Use full URL if already correct
      }

      const newManifest = {
        short_name: restaurant.name,
        name: restaurant.name,
        icons: [
          {
            src: logoUrl,
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: logoUrl,
            sizes: "512x512",
            type: "image/png"
          }
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff"
      };

      // Convert JSON to Blob and create a new manifest file dynamically
      const stringManifest = JSON.stringify(newManifest);
      const blob = new Blob([stringManifest], { type: "application/json" });
      const manifestURL = URL.createObjectURL(blob);

      // Replace the current manifest with the new one
      document.querySelector("link[rel='manifest']").setAttribute("href", manifestURL);
    }
  })
  .catch(error => console.error("Error updating manifest, title, and favicon:", error));
