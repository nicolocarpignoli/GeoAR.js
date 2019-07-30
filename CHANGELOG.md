# Changelog v0.0.1
~~nicolocarpignoli

### What I want to do

- Fix text added to places ONLY towards north directionm otherwise it added only icon (very strange bug)
- Do not update entity (place) position if there is too much difference between consequential user GPS positions (i.e. gps signal is not so stable, so if position is changing a lot in 1-2 seconds, do not consider that --> this may cause problems if user is in a car or some kind of fast moving transport?)
- Add UX/UI and messages when gps data is not available or there's very poor signal
- Try to integrate altitude
- Have more beers
- ...

### What I done so far

- Added comments and cleaned code using standard coding practices
- Refactor: merged `gps-camera-position` and `gps-camera-rotation` into one single component, interacting with `gps-entity-place`s using events. `gps-camera-debug` is now an attribute of the `a-scene`
- Updated `a-frame` to 0.9.0 version, adapting code according to this
- Removed unuseful and confusing parts of the code
- Added a better demo
- Enhanced Documentation
- Added an alert message when geolocation is switched off (from Phone Settings or permission not granted)
- Remove every setInterval interaction between aframe components, interactions are now only event based
- Had some beers


### About demos..

- Show something at user's location
- Show something near user's location
