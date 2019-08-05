# GeoAR.js

## Overview

🌍The aim is to bring a basic but working Location Based AR system to the actual [AR.js](https://github.com/jeromeetienne/AR.js/) (currently marker based only).

This is still experimental and a Work In Progress.
The original version was working with some limitations, but now it's outdated (it was based on [aframe](https://aframe.io/) v0.6.0, now we have [aframe](https://aframe.io/) v0.9.0 version with different APIs).
The aim is to make it work with updated dependencies and possibly better performances, also refactoring for a more maintainable codebase.

These `aframe` components can work independently from AR.js. By the way, they are a powerful and simple system that become interesting if added to AR.js' marker based capabilities, thus making AR.js a multiple-feature-AR library.

🚀 **[Here](./CHANGELOG.md) you can track my updates about this project.**

For updated stuff about GeoAR.js and AR.js, you can [follow me](https://twitter.com/nicolocarp).

## Demo

>Work In Progress

The only available demo is at [examples/basic.html](examples/basic.html).

It uses the [examples/places.js](examples/place.js) script to load places. You can use that, with static data adding your coordinates
on that script, in the first lines of code (there are comments to explain better).

Otherwise, as default, the script searches for places of interest near the user using Foursquare APIs. Please retrieve valid API credentials [here](https://developer.foursquare.com/) in order to use it. Place credentials (client secret and client id) on `examples/places.js` line 30 or so.

You can also use GeoAR.js without that script, adding `gps-entity-place` entities as documentated on the following section, 
putting them directly on the `basic.html` file.

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

Problem with iPhone 6, loads all good but when rotating and moving the camera, places position are not updated and remain fixed.

We need a lot of more tests, but the first impression is: the more advanced the phone (so newer) the better. This because of better quality sensors.

## Credits

It is based on the discussion from this [github issue](https://github.com/jeromeetienne/AR.js/issues/190).
It has been originated by [1d10t](https://github.com/1d10t) in this [file](https://1d10t.github.io/test/phills-sphere.html).
This project has been originally crated by Jerome Etienne as a branch of AR.js and then as standalone repository, but was left alone from 2017. Now I'm trying to bring it alive again!

Thanks a LOT for all contributions! ❤️
