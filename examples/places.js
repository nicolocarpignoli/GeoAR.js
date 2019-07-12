// if getting places by hardcoded data
const PLACES = [
    {
        name: "Piazza Maggiore",
        latitude: 44.493910,
        longitude: 11.343250,
        placemarkColor: "red",
    },
    {
        name: "Due Torri",
        latitude: 44.494660,
        longitude: 11.347180,
        placemarkColor: "yellow",
    },
    {
        name: "Via Spataro",
        latitude: 44.492150,
        longitude: 11.324330,
        placemarkColor: "blue",
    },
    {
        name: "Plumetis",
        latitude: 44.492493,
        longitude: 11.325399,
        placemarkColor: "pink",
    },
];

// if getting places from REST APIs
function loadPlaceFromAPIs() {
    const params = {
        lat: 44.496684,
        lng: 11.320247,
        clientId: 'your client id',
        clientSecret: 'your client secret',
        radius: 150,
    };

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin&ll=${params.lat},${params.lng}&radius=${params.radius}&client_id=${params.clientId}&client_secret=${params.clientSecret}&v=20300101`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload =  () => {
    const scene = document.querySelector('a-scene');
    loadPlaceFromAPIs()
        .then((places) => {
            places.forEach((place) => {
                const element = document.createElement('a-text');
                const latitude = place.location.lat;
                const longitude = place.location.lng;
                element.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                element.setAttribute('value', place.name);
                scene.appendChild(element);
            });
        })
};
