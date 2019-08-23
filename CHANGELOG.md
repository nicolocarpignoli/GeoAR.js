# Changelog v0.0.1
~~nicolocarpignoli

### What I done so far

- Added comments and cleaned code using standard coding practices
- Refactor: merged `gps-camera-position` and `gps-camera-rotation` into one single component, interacting with `gps-entity-place`s using events. `gps-camera-debug` is now an attribute of the `a-scene`
- Updated `a-frame` to 0.9.0 version, adapting code according to this
- Removed unuseful and confusing parts of the code
- Added a better demo
- Enhanced Documentation
- Added an alert message when geolocation is switched off (from Phone Settings or permission not granted)
- Remove every setInterval interaction between aframe components, interactions are now only event based
- Add UX/UI and messages when GPS data is not available or there's very poor signal (using a property)
- Had some beers
