AFRAME.registerComponent('gps-camera-rotation', {
	lookControls: null,
	heading: null,

	schema: {},

	init: function () {

		if (this.el.components['look-controls'] === undefined) {
            return;
        }

		this.lookControls = this.el.components['look-controls'];

		// listen to deviceorientation event
		var eventName = this._getDeviceOrientationEventName();
		this._onDeviceOrientation = this._onDeviceOrientation.bind(this);
		window.addEventListener(eventName, this._onDeviceOrientation, false);
	},

	tick: function() {
		if (this.heading === null) {
            return;
        }

		this._updateRotation();
	},

	remove: function () {
        var eventName = this._getDeviceOrientationEventName();
        console.log(eventName)
		window.removeEventListener(eventName, this._onDeviceOrientation, false);
	},

    // it depends on browser
	_getDeviceOrientationEventName: function() {
		if ('ondeviceorientationabsolute' in window) {
			var eventName = 'deviceorientationabsolute'
		} else if ('ondeviceorientation' in window){
			var eventName = 'deviceorientation'
		} else {
			var eventName = ''
			console.error('Compass not supported')
        }

		return eventName
	},

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
		var rC = - cB * cG;

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

	_onDeviceOrientation: function(event) {
        console.log('orientation event', event)
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

	_updateRotation: function() {
		var heading = 360 - this.heading;
		var cameraRotation = this.el.getAttribute('rotation').y;
		var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
		var offset = (heading - (cameraRotation - yawRotation)) % 360;
		this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
	},
});
