### Enhancements
~~nicolocarpignoli

- Refactor: make gps-camera-position and gps-camera-rotation one single component, talking to entity-place via events. gps-camera-debug becomes an attribute 
- Change setInterval interaction between aframe components. Refactor this part good, is not only for demo purposes
===> usare emit event deel componente gps position, quando è pronta posiz. utente => la ascene si registra e fa cose (es. fetcha places)


- try to integrate altitude
- Do not update entity (place) position if there is too much difference between consequential user GPS positions (i.e. gps signal is not so stable, so if position is changing a lot in 1-2 seconds, do not consider that --> this may cause problems if user is in a car or some kind of fast moving transport?)
- Add UX/UI and messages when gps access is not granted by the user (events for that should be available as for camera permissions on AR.js)
- Add UX/UI and messages when gps data is not available or there's very poor signal (is there any events for that?)
- ...


### Demo todos

- show something at user's location
- show something near user's location
