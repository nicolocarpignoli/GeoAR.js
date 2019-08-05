AFRAME.registerComponent('gps-entity-place', {
    _cameraGps: null,
    schema: {
        latitude: {
            type: 'number',
            default: 0,
        },
        longitude: {
            type: 'number',
            default: 0,
        },
    },
    init: function () {
        this._positionXDebug = 0;
        this._listening = null;

        // TODO Remove this, is temporary and only for debug/demo purposes

        this.clickListener = function(ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute('name');

            if (this._listening && this._listening === name) {
                return;
            }
            this._listening = name;

            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                const label = document.createElement('span');
                label.setAttribute('id', 'place-label');
                label.innerText = name;
                document.body.appendChild(label);

                setTimeout(() => {
                    label.parentElement.removeChild(label);
                    this._listening = null;
                }, 2000);
            }
        };

        this.el.addEventListener('click', this.clickListener.bind(this));

        this.debugUIAddedHandler = function() {
            this.setDebugData(this.el);
            window.removeEventListener('debug-ui-added', this.debugUIAddedHandler.bind(this));
        };

        window.addEventListener('debug-ui-added', this.debugUIAddedHandler.bind(this));

        if (this._cameraGps === null) {
            var camera = document.querySelector('a-camera, [camera]');
            if (camera.components['gps-camera'] === undefined) {
                return;
            }
            this._cameraGps = camera.components['gps-camera'];
        }

        if (this._cameraGps.originCoords === null) {
            return;
        }

        this._updatePosition();
        return true;
    },

    _updatePosition: function () {
        var position = { x: 0, y: 0, z: 0 }

        // update position.x
        var dstCoords = {
            longitude: this.data.longitude,
            latitude: this._cameraGps.originCoords.latitude,
        };

        position.x = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);
        this._positionXDebug = position.x;
        position.x *= this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

        // update position.z
        var dstCoords = {
            longitude: this._cameraGps.originCoords.longitude,
            latitude: this.data.latitude,
        };

        position.z = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);
		position.z *= this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

        // update element's position in 3D world
        this.el.setAttribute('position', position);
    },

    setDebugData: function(element) {
        const elements =  document.querySelectorAll('.debug-distance');
        elements.forEach((el) => {
            const distance = formatDistance(this._positionXDebug);
            if (element.getAttribute('value') == el.getAttribute('value')) {
                el.innerHTML = `${el.getAttribute('value')}: ${distance} far`;
            }
        });
    },
});

function formatDistance(distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
        return `${distance/1000} kilometers`;
    }

    return `${distance} meters`;
};
