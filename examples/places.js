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


window.onload =  () => {
    const scene = document.querySelector('a-scene');
    PLACES.forEach((place) => {
        const box = document.createElement('a-box');
        box.setAttribute('gps-entity-place', `latitude: ${place.latitude}; longitude: ${place.longitude};`);
        box.setAttribute('color', place.placemarkColor);
        box.setAttribute('name', place.name);
        scene.appendChild(box);
    });
};
