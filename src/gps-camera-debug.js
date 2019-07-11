let camera_angle;
let compass_heading;
let yaw_angle;
let current_coords_latitude;
let current_coords_longitude;
let origin_coords_latitude;
let origin_coords_longitude;
let camera_p_x;
let camera_p_z;
let camera;

AFRAME.registerComponent('rotation-reader', {
    init: function () {
        // initialize
        camera = this.el;
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
    },
    tick: function () {
        // updated rotation and position data for this thick
        const rotation = this.el.getAttribute('rotation');
        const position = this.el.getAttribute('position');

        var compassRotation = camera.components['gps-camera-rotation'];
        var lookControls = camera.components['look-controls'];
        camera_angle.innerText = rotation.y.toFixed(2);

        // update UI components data to see debug data on screen
        if (lookControls) {
            yaw_angle.innerText = THREE.Math.radToDeg(lookControls.yawObject.rotation.y).toFixed(2);
        }

        if (compassRotation && compassRotation.heading !== null) {
            compass_heading.innerText = compassRotation.heading.toFixed(2);
        }

        camera_p_x.innerText = position.x;
        camera_p_z.innerText = position.z;
        var gpsPosition = camera.components['gps-camera-position'];

        if (gpsPosition) {
            if (gpsPosition.currentCoords) {
                current_coords_longitude.innerText = gpsPosition.currentCoords.longitude;
                current_coords_latitude.innerText = gpsPosition.currentCoords.latitude;
            }

            if (gpsPosition.originCoords) {
                origin_coords_longitude.innerText = gpsPosition.originCoords.longitude;
                origin_coords_latitude.innerText = gpsPosition.originCoords.latitude;
            }
        }
    }
});

function buildCameraDebugUI() {
    return `<div style="position: fixed; top: 10px; left: 5px; width:100%; text-align: center; z-index: 1; color: limegreen">
			<div>
				current lng/lat coords: <span id="current_coords_longitude"></span>, <span id="current_coords_latitude"></span>
			</div>
			<div>
				origin lng/lat coords: <span id="origin_coords_longitude"></span>, <span id="origin_coords_latitude"></span>
			</div>
			<div>
				camera 3d position: <span id="camera_p_x"></span>, <span id="camera_p_z"></span>
			<div>
				compass heading: <span id="comspanass_heading"></span>,
				camera angle: <span id="camera_angle"></span>,
				yaw angle: <span id="yaw_angle"></span>
			</div>
		</div>`;
}
