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
];


window.on('load', () => {
    const scene = document.querySelector('a-scene');
    PLACES.forEach((place) => {
        const box = document.createElement('a-box');
        box.setAttribute('gps-entity-place', `latitude: ${place.latitude}; longitude: ${place.longitude};`);
        box.setAttribute('color', placemarkColor);
        scene.appendChild(box);
    });
});
