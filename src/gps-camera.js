let camera_angle;
let compass_heading;
let yaw_angle;
let current_coords_latitude;
let current_coords_longitude;
let origin_coords_latitude;
let origin_coords_longitude;
let camera_p_x;
let camera_p_z;

AFRAME.registerComponent('gps-camera', {
    _watchPositionId: null,
    originCoords: null,
    currentCoords: null,
    lookControls: null,
    heading: null,

    schema: {
        debugEnabled: {
            type: 'boolean',
            default: false,
        },
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
    },

    init: function () {
        if (this.el.components['look-controls'] === undefined) {
            return;
        }

        this.lookControls = this.el.components['look-controls'];

        // listen to deviceorientation event
        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);
        window.addEventListener(eventName, this._onDeviceOrientation, false);

        this._watchPositionId = this._initWatchGPS(function (position) {
            this.currentCoords = position.coords;
            this._updatePosition();
        }.bind(this));

        if (this.data.debugEnabled) {
            _initDebug();
        }
    },

    tick: function () {
        if (this.heading === null) {
            return;
        }

        this._updateRotation();

        if (this.data.debugEnabled) {
            _updateDebug();
        }
    },

    remove: function () {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;

        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);
    },

    /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function () {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    },

    /**
     * Get current user position.
     * 
     * @param {function} onSuccess 
     * @param {function} onError 
     * @returns {Promise}
     */
    _initWatchGPS: function (onSuccess, onError) {
        // TODO put that in .init directly

        if (!onError) {
            onError = function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        });
    },

    /**
     * Update user position.
     * 
     * @returns {void}
     */
    _updatePosition: function () {
        // don't update if accuracy isn't good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            return;
        }

        if (!this.originCoords) {
            this.originCoords = this.currentCoords;
        }

        var position = this.el.getAttribute('position');

        // compute position.x
        var dstCoords = {
            longitude: this.currentCoords.longitude,
            latitude: this.originCoords.latitude,
        };
        position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

        // compute position.z
        var dstCoords = {
            longitude: this.originCoords.longitude,
            latitude: this.currentCoords.latitude,
        }
        position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

        // update position
        this.el.setAttribute('position', position);
    },

    /**
     * Returns distance in meters between source and destination inputs.
     * 
     * @param {Position} src 
     * @param {Position} dest 
     * 
     * @returns {number} distance
     */
    computeDistanceMeters: function (src, dest) {
        // 'Calculate distance, bearing and more between Latitude/Longitude points'
        // Details: https://www.movable-type.co.uk/scripts/latlong.html

        var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = angle * 6378160;

        return distance;
    },

    /**
     * Compute compass heading.
     * 
     * @param {number} alpha 
     * @param {number} beta 
     * @param {number} gamma 
     * 
     * @returns {number} compass heading
     */
    _computeCompassHeading: function (alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var cB = Math.cos(betaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },

    /**
     * Handler for device orientation event.
     * 
     * @param {Event} event 
     * @returns {void}
     */
    _onDeviceOrientation: function (event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },

    /**
     * Update user rotation data.
     * 
     * @returns {void}
     */
    _updateRotation: function () {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
    },

    _initDebug: function () {
        // initialize
        var domElement = document.createElement('div');
        domElement.innerHTML = _buildCameraDebugUI();
        document.body.appendChild(domElement);

        // retrieve specific UI components
        camera_angle = document.querySelector('#camera_angle');
        compass_heading = document.querySelector('#compass_heading');
        yaw_angle = document.querySelector('#yaw_angle');
        current_coords_latitude = document.querySelector('#current_coords_latitude');
        current_coords_longitude = document.querySelector('#current_coords_longitude');
        origin_coords_latitude = document.querySelector('#origin_coords_latitude');
        origin_coords_longitude = document.querySelector('#origin_coords_longitude');
        camera_p_x = document.querySelector('#camera_p_x');
        camera_p_z = document.querySelector('#camera_p_z');

        // TODO deferr this after event
        // buildDistancesDebugUI
    },

    _updateDebug: function () {
        // for now, show only position debug data
        // if rotation is needed, just re-implement from old 'gps-camera-debug'
        const position = this.el.getAttribute('position');

        camera_p_x.innerText = position.x.toFixed(6);
        camera_p_z.innerText = position.z.toFixed(6);

        var gpsPosition = this.el.components['gps-camera-position'];
        if (gpsPosition) {
            if (gpsPosition.currentCoords) {
                current_coords_longitude.innerText = gpsPosition.currentCoords.longitude.toFixed(6);
                current_coords_latitude.innerText = gpsPosition.currentCoords.latitude.toFixed(6);
            }

            if (gpsPosition.originCoords) {
                origin_coords_longitude.innerText = gpsPosition.originCoords.longitude.toFixed(6);
                origin_coords_latitude.innerText = gpsPosition.originCoords.latitude.toFixed(6);
            }
        }
    },

    _buildDistancesDebugUI: function (_deferredSelector) {
        const div = document.querySelector('.debug');
        document.querySelectorAll('a-text[gps-entity-place]').forEach((box) => {
            const debugDiv = document.createElement('div');
            debugDiv.classList.add('debug-distance');
            debugDiv.innerHTML = box.getAttribute('value');
            debugDiv.setAttribute('value', box.getAttribute('value'));
            div.appendChild(debugDiv);
        });
    },

    _buildCameraDebugUI: function() {
        const container = document.createElement('div');
        div.classList.add('debug');
        div.style = 'font-size: 0.75em; position: fixed; bottom: 20px; left: 10px; width:100%; z-index: 1; color: limegreen';
        
        const currentLatLng = document.createElement('div');
        currentLatLng.innerText = 'current lng/lat coords: ';
        const spanLng = document.createElement('span');
        spanLng.id = 'current_coords_longitude';
        const spanLat = document.createElement('span');
        spanLat.id = 'current_coords_latitude';
        currentLatLng.appendChild(spanLng);
        currentLatLng.appendChild(spanLat);

        const originLatLng = document.createElement('div');
        originLatLng.innerText = 'origin lng/lat coords: ';
        const originSpanLng = document.createElement('span');
        originSpanLng.id = 'origin_coords_longitude';
        const originSpanLat = document.createElement('span');
        originSpanLat.id = 'origin_coords_latitude';
        originLatLng.appendChild(originSpanLng);
        originLatLng.appendChild(originSpanLat);
        
        container.appendChild(currentLatLng);
        container.appendChild(originLatLng);

        const cameraDiv = document.createElement('div');
        cameraDiv.innerText = 'camera 3d position: ';
        const cameraSpanX = document.createElement('span');
        cameraSpanX.id = 'span id="camera_p_x';
        const cameraSpanZ = document.createElement('span');
        cameraSpanZ.id = 'span id="camera_p_z';

        cameraDiv.appendChild(cameraSpanX);
        cameraDiv.appendChild(cameraSpanZ);
        container.appendChild(cameraDiv);
    }
});
