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
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ', 
        clientSecret: '5BG42SKEZXXANBN4ZHC5XKHLDFQVSKMWUS3VXKOASMR5SNEB',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    
    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &v=${params.version}`;
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

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaceFromAPIs(position.coords)
            .then((places) => {
                places.push({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    name: "casa",
                })
               
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;
                    
                    // TODO find a better place to locate AFRAME icon & text at same location

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

                console.log('added all place objects');
        })
        }, 
        (err) => console.error('Error in retrieving position', err), 
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
