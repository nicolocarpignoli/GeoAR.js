let camera_angle;
let compass_heading;
let yaw_angle;
let current_coords_latitude;
let current_coords_longitude;
let origin_coords_latitude;
let origin_coords_longitude;
let camera_p_x;
let camera_p_z;

AFRAME.registerComponent('gps-camera-debug', {
    init: function () {
        // initialize
        var domElement = document.createElement('div');
        domElement.innerHTML = buildCameraDebugUI();
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

        const _deferredSelector = setInterval(() => {
            buildDistancesDebugUI(_deferredSelector);
        }, 2000);
    },
    tick: function () {
        // updated rotation and position data for this thick
        const rotation = this.el.getAttribute('rotation');
        const position = this.el.getAttribute('position');

        var compassRotation = this.el.components['gps-camera-rotation'];
        var lookControls = this.el.components['look-controls'];
        camera_angle.innerText = rotation.y.toFixed(2);

        // update UI components data to see debug data on screen
        if (lookControls) {
            yaw_angle.innerText = THREE.Math.radToDeg(lookControls.yawObject.rotation.y).toFixed(2);
        }

        if (compassRotation && compassRotation.heading !== null) {
            compass_heading.innerText = compassRotation.heading.toFixed(2);
        }

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
    }
});

function buildCameraDebugUI() {
    return `<div class="debug" style="font-size: 0.75em; position: fixed; bottom: 20px; left: 10px; width:100%; z-index: 1; color: limegreen">
			<div>
				current lng/lat coords: <span id="current_coords_longitude"></span>, <span id="current_coords_latitude"></span>
			</div>
			<div>
				origin lng/lat coords: <span id="origin_coords_longitude"></span>, <span id="origin_coords_latitude"></span>
			</div>
			<div>
				camera 3d position: <span id="camera_p_x"></span>, <span id="camera_p_z"></span>
			<div style="margin-bottom: 1.5em">
				compass heading: <div id="compass_heading">no value</div>
				camera angle: <div id="camera_angle">no value</div>
				yaw angle: <div id="yaw_angle">no value</div>
			</div>
		</div>`;
}

function buildDistancesDebugUI(_deferredSelector) {
    const div = document.querySelector('.debug');
    document.querySelectorAll('[gps-entity-place]').forEach((box) => {
        const debugDiv = document.createElement('div');
        debugDiv.classList.add('debug-distance');
        debugDiv.innerHTML = box.getAttribute('name');
        debugDiv.setAttribute('name', box.getAttribute('name'));
        div.appendChild(debugDiv);
    });

    clearInterval(_deferredSelector);
}
