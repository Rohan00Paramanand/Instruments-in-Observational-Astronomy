/**
 * Map functionality using Leaflet.js
 * Handles location selection and sets lat/lon in form inputs.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Function to get CSRF cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Check if the map container exists
    const mapElement = document.getElementById('map-container');
    if (!mapElement) return;

    // Initialize the map
    // Centered roughly on Central India (e.g. Nagpur area)
    const map = L.map('map-container', {
        center: [21.1458, 79.0882],
        zoom: 5,
        minZoom: 2 // Allow seeing more of the world
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Get input fields
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');

    // Marker that will move on click
    let currentMarker = null;

    const userId = window.currentUserId || 'guest';
    const latKey = `latitude_${userId}`;
    const lonKey = `longitude_${userId}`;

    // Default to Ujjain coordinates or LocalStorage if inputs are empty
    if (!latInput.value || !lonInput.value) {
        const savedLat = localStorage.getItem(latKey);
        const savedLon = localStorage.getItem(lonKey);
        
        if (savedLat && savedLon) {
            latInput.value = savedLat;
            lonInput.value = savedLon;
        } else {
            latInput.value = 23.1765;
            lonInput.value = 75.7885;
        }
    } else {
        // If they had values from Django rendering, store them
        localStorage.setItem(latKey, latInput.value);
        localStorage.setItem(lonKey, lonInput.value);
    }

    // Set initial marker
    const initialLat = parseFloat(latInput.value);
    const initialLon = parseFloat(lonInput.value);

    if (!isNaN(initialLat) && !isNaN(initialLon)) {
        currentMarker = L.marker([initialLat, initialLon]).addTo(map);
        map.setView([initialLat, initialLon], 6);
    }

    // Handle map clicks
    map.on('click', function (e) {
        const selectedLat = e.latlng.lat;
        const selectedLon = e.latlng.lng;

        // Update input fields, limiting decimals
        latInput.value = selectedLat.toFixed(5);
        lonInput.value = selectedLon.toFixed(5);

        // Update or create marker
        if (currentMarker) {
            currentMarker.setLatLng(e.latlng);
        } else {
            currentMarker = L.marker(e.latlng).addTo(map);
        }

        // Save location to LocalStorage instead of hitting the backend
        localStorage.setItem(latKey, latInput.value);
        localStorage.setItem(lonKey, lonInput.value);
    });

    // Search functionality
    const searchInput = document.getElementById('address-search');
    const searchBtn = document.getElementById('search-btn');

    async function searchLocation() {
        if (!searchInput.value.trim()) return;

        searchBtn.textContent = 'Searching...';
        searchBtn.disabled = true;

        try {
            const query = encodeURIComponent(searchInput.value);
            const response = await fetch(`/api/search/?q=${query}`);
            const jsonResponse = await response.json();

            if (jsonResponse.status === 'success' && jsonResponse.data && jsonResponse.data.length > 0) {
                const result = jsonResponse.data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);

                // Update map view
                map.setView([lat, lon], 13);

                // Update input fields
                latInput.value = lat.toFixed(5);
                lonInput.value = lon.toFixed(5);

                // Update marker
                if (currentMarker) {
                    currentMarker.setLatLng([lat, lon]);
                } else {
                    currentMarker = L.marker([lat, lon]).addTo(map);
                }

                // Save to LocalStorage
                localStorage.setItem(latKey, latInput.value);
                localStorage.setItem(lonKey, lonInput.value);

            } else {
                alert("Location not found. Please try a different search term.");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("An error occurred while searching. Please try again.");
        } finally {
            searchBtn.textContent = 'Search';
            searchBtn.disabled = false;
        }
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', searchLocation);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchLocation();
            }
        });
    }
});
