# GeoAR.js

To better introduce this library I wrote an [article on Medium](https://medium.com/chialab-open-source/location-based-gps-augmented-reality-on-the-web-7a540c515b3c). You can start from it.

## Overview

🌍The aim is to bring a basic but working Location Based AR system to the actual [AR.js](https://github.com/jeromeetienne/AR.js/) (currently marker based only).

The original version was working with some limitations, but it is now outdated (it was based on [aframe](https://aframe.io/) v0.6.0, now we have [aframe](https://aframe.io/) v0.9.0 version with different APIs).
The aim is to make it work with updated dependencies and possibly better performances, also refactoring for a more maintainable codebase.

These `aframe` components can work independently from AR.js. By the way, they are a powerful and simple system that become interesting if added to AR.js' marker based capabilities, thus making AR.js a multiple-AR library.

🚀 **[Here](./CHANGELOG.md) you can track my updates about this project.**

For updated stuff about GeoAR.js and AR.js, you can [follow me](https://twitter.com/nicolocarp).

## How it works

Basically, you can add `gps-entity-place` - custom `aframe` entities that have a specific longitude/latitude values. You can add them with a script, loading them from APIs (Foursquare, Google Maps, and so on) or just add them statically on your HTML. You can also load them dynamically as you move to a wider area using APIs. Choice is yours and possibilities are endless with Javascript.

Once you have added one or more gps-entities, and added the `gps-camera` on the `camera` entity, the system calculates, at every frame, your position and the distance of places from you. 

Using your phone sensors for orientation/position, it is able to show on your camera a content for each place on its 'physical' place (so if you point the camera toward the place in real life, you will see the content near it).

If you move the camera, it calculates again orientation and position. If places are far, it shows smaller content. If places are near you, it shows it bigger.
Hope I give to you the basic idea. Let's try a demo.

## Demo

🌍Click on the example name for the online version.  
📲Open from mobile phone.

- [Click Places](https://nicolo-carpignoli.herokuapp.com/examples/basic.html) 

    Show place icon for every place. Clicking on the icon will show the place name.

    <img height="569" width="320" src="docs/click-places.gif">
- [Places Name](https://nicolo-carpignoli.herokuapp.com/examples/places-name) 

    Show icon and place name above. Clicking on places will redirect to a certain URL (now mocked up).

    <img height="569" width="320" src="docs/places-name.gif">
- [Add Objects](./examples/add-objects/) [WIP]
    
    Add one or more objects on certain GPS positions and see them in real world with your camera.

Every example uses the `places.js` script to load places. You can use that with static data using your coordinates, adding these info in the first lines of code (there are comments to explain better).

Otherwise, as default, the script searches for places of interest near the user using Foursquare APIs. Please retrieve valid API credentials [here](https://developer.foursquare.com/) in order to use it. Place credentials (client secret and client id) on `places.js`.

You can also use GeoAR.js **without** the script, adding `gps-entity-place` entities as documentated on the following section, putting them directly on the `index.html` file.

## Components

>Work In Progress

### `gps-camera`

**Required**: yes  
**Max allowed per scene**: 1

This component enables the Location AR. It has to be added to the `camera` entity.
It makes possible to handle both position and rotation of the camera and it's used to determine where the user is pointing their device.

For example:

```HTML
<a-camera gps-camera rotation-reader></a-camera>
```

In addition to that, as you can see on the example above, we also have to add `rotation-reader` to handle rotation events. See [here](https://aframe.io/docs/0.9.0/components/camera.html#reading-position-or-rotation-of-the-camera) for more details.


### Properties

| Property   | Description | Default Value |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| alert     | Whether to show a message when GPS signal is under the `positionMinAccuracy`                  | false |                                                                                                                                                                        | true          |
| positionMinAccuracy        | Minimum accuracy allowed for position signal    | 100 |
| minDistance        | If set, places with a distance from the user lower than this value, are not showed. Only a positive value is allowed. Value is in meters.    | 0 (disabled) |

### `gps-entity-place`

**Required**: yes  
**Max allowed per scene**: no limit

This component makes every entity GPS-trackable. It assignes a specific world position to the entity, so the user can see it when their phone is pointing to its position in the real world. If user is far from the entity, their will see it smaller. If it is too far, their will not see it at all.

It requires latitude and longitude as a single string parameter (example with `a-box` aframe primitive):

```HTML
<a-box color="yellow" gps-entity-place="latitude: <your-latitude>; longitude: <your-longitude>"/>
```

### `gps-camera-debug`

**Required**: no  
**Max allowed per scene**: 1

This component has to be added only in development environments, not production ones.
It shows a debug UI with camera informations and a list of registered `gps-entity-place` entities, showing also distance from the user for each one.

It has to be added to the `a-scene`:

```HTML
<a-scene gps-camera-debug embedded arjs='sourceType: webcam; debugUIEnabled: false;'></a-scene>
```

## Support

Tried on Huawei P20, works like charm.

Works good also on iPhone 6.

On iOS, from 12.2, Motion sensors on Safari has be to activated from Settings. If not, GeoAR.js will prompt the user to do so.
This [may change with final release of iOS 13](https://developer.apple.com/documentation/safari_release_notes/safari_13_beta_6_release_notes) but as September 2019 is not yet out.

We need a lot of more tests, but the first impression is: the more advanced the phone (so newer) the better. This because of better quality sensors.

## Credits

It is based on the discussion from this [github issue](https://github.com/jeromeetienne/AR.js/issues/190).
It has been originated by [1d10t](https://github.com/1d10t) in this [file](https://1d10t.github.io/test/phills-sphere.html).
The first mock up project has been originally created by Jerome Etienne as a branch of AR.js and then as standalone repository, but was left alone from 2017. 
What I'm doing is to bring it alive and kicking for the first time since its creation.

Thanks a LOT for all contributions! ❤️
