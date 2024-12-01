//   // Your Azure Maps subscription key
//   const subscriptionKey = '8OSFv8CwY2gSTa5yJN5RA2kge5xDjWRKHPv8TgzF0XJ1BRD3wtpyJQQJ99AKACYeBjFo5hARAAAgAZMP10ys';

//   // Initialize the map
//   const map = new atlas.Map('myMap', {
//       center:[77.1025, 28.7041] , // Longitude, Latitude (Example: Seattle)
//       zoom: 10,
//       language: 'en-US',
//       view: 'Auto',
//       authOptions: {
//           authType: 'subscriptionKey',
//           subscriptionKey: subscriptionKey
//       }
//   });

//   // Add controls to the map
//   map.events.add('ready', function () {
//       // Add a zoom control to the map
//       map.controls.add(new atlas.control.ZoomControl(), {
//           position: 'top-right'
//       });

//       // Add a marker to the map
//       const marker = new atlas.HtmlMarker({
//           color: 'red',
//           text: 'A',
//           position: [77.1025, 28.7041] 
//       });
//       map.markers.add(marker);
//   });


// Initialize the map centered at Florence, Italy
var map = L.map('map').setView([43.7696, 11.2558], 13); // Coordinates for Florence, Italy

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker at Florence with a popup
L.marker([43.7696, 11.2558]).addTo(map) // Marker at Florence
    .bindPopup("Your Listing") // Popup text
    .openPopup();
