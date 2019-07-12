// getting places by hardcoded data
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

// getting places from REST APIs
function loadPlaceFromAPIs() {
    const params = {
        lat: 44.496684, // origin coordinates: change that with current user location, dynamically
        lng: 11.320247,
        radius: 150,    // search places less far than this values (in meters)
        clientId: 'your client id', 
        clientSecret: 'your client secret',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    
    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${params.lat},${params.lng}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &v=${param.version}`;
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
                const latitude = place.location.lat;
                const longitude = place.location.lng;
                
                // TODO find a better place to locate icon & text at same location

                // add text with place name
                const text = document.createElement('a-text');
                text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                text.setAttribute('value', place.name);
                scene.appendChild(text);

                // add place icon
                const icon = document.createElement('a-image');
                icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                icon.setAttribute('src', 'assets/place_icon.png');
                scene.appendChild(icon);
            });
        })
};
