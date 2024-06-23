// Set Mapbox access token
mapboxgl.accessToken = mapToken; // Ensure mapToken is defined and accessible

document.addEventListener('DOMContentLoaded', () => {
    // Initialize map with initial coordinates
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: listing.geometry.coordinates,
        zoom: 12
    });

    // Add marker for initial coordinates
    const marker = new mapboxgl.Marker()
        .setLngLat(listing.geometry.coordinates)
        .addTo(map);

    // Function to update map location based on new coordinates
    function updateMapLocation(coordinates) {
        map.setCenter(coordinates);
        marker.setLngLat(coordinates);
    }

    // Example of handling form submission to update location
    const updateLocationForm = document.getElementById('updateLocationForm');
    if (updateLocationForm) {
        updateLocationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newLocation = document.querySelector('input[name="listing[location]"]').value;

            try {
                const response = await fetch(`/listings/${listing._id}?_method=PUT`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ location: newLocation }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update listing location');
                }

                const data = await response.json();
                console.log('Updated listing data:', data);

                // Update listing object with new location data
                listing.location = newLocation;
                listing.geometry.coordinates = data.coordinates; // Update coordinates from response

                // Update map with new coordinates
                updateMapLocation(listing.geometry.coordinates);

                // Optionally update UI or show success message
            } catch (error) {
                console.error('Error updating listing location:', error.message);
                // Handle error: display error message or revert changes
            }
        });
    }
});
