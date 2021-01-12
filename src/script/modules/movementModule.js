import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls';

let getMilliseconds = () => {
	var d = new Date();
	return d.getTime();
};

export const movementModule = (function () {
	let listenerDown;
	let listenerUp;
	let listenerMouseDown;
	let listenerMouseUp;
	let camera;
	let scene;
	let keyDown = { w: false, a: false, s: false, d: false, e: false };
	let mouseDown = false;
	let lookedAtObject = undefined;
	let interactText = document.querySelector('.interact');
	let controls;
	let orbitControls;
	let savedCameraPosition;
	let savedCameraRotation;
	const raycaster = new THREE.Raycaster();
	const cursor = new THREE.Vector2(0, 0);

	const direction = new THREE.Vector3();
	let speed = 6;

	const initializeMovement = (cam, sceneAtr, renderer) => {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			// true for mobile device
			controls = new DeviceOrientationControls(cam);
			controls.connect();
		} else {
			// false for not mobile device
			controls = new PointerLockControls(cam, renderer.domElement);
			renderer.domElement.addEventListener(
				'click',
				function () {
					if (!orbitControls.enabled) {
						controls.lock();
					}
				},
				false,
			);
		}

		orbitControls = new OrbitControls(cam, renderer.domElement);
		orbitControls.enabled = false;

		raycaster.near = 0.2;
		raycaster.far = 5;
		camera = cam;
		scene = sceneAtr;

		// INITIAL CAMERA POSITION
		camera.position.y = 1.8;
		camera.rotateY(1.5708);
		//KEYS
		listenerDown = document.addEventListener('keydown', handleKeyDown);
		listenerUp = document.addEventListener('keyup', handleKeyUp);

		// MOBILE

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			listenerMouseDown = document.addEventListener('touchstart', () => {
				mouseDown = true;
			});
			listenerMouseUp = document.addEventListener('touchend', () => {
				mouseDown = false;
			});
		}

		let intersects = [];
		let previousFrame = getMilliseconds();

		function movement() {
			requestAnimationFrame(movement);
			let frameStart = getMilliseconds();
			let frameTime = frameStart - previousFrame;
			// MOVEMENT KEYS
			if (keyDown.w) {
				camera.getWorldDirection(direction);
				let total = Math.abs(direction.x) + Math.abs(direction.z);
				direction.x = direction.x / total;
				direction.z = direction.z / total;
				direction.y = 0;
				camera.position.addScaledVector(direction, (speed / 1000) * frameTime);
			}
			if (keyDown.s) {
				camera.getWorldDirection(direction);
				let total = Math.abs(direction.x) + Math.abs(direction.z);
				direction.x = direction.x / total;
				direction.z = direction.z / total;
				direction.y = 0;
				camera.position.addScaledVector(direction.negate(), (speed / 1000) * frameTime);
			}
			if (keyDown.a) {
				camera.getWorldDirection(direction);
				direction.y = 0;
				let total = Math.abs(direction.x) + Math.abs(direction.z);
				direction.x = direction.x / total;
				direction.z = direction.z / total;
				var axis = new THREE.Vector3(0, 1, 0);
				var angle = Math.PI / 2;
				camera.position.addScaledVector(direction.applyAxisAngle(axis, angle), (speed / 1000) * frameTime);
			}
			if (keyDown.d) {
				camera.getWorldDirection(direction);
				direction.y = 0;
				let total = Math.abs(direction.x) + Math.abs(direction.z);
				direction.x = direction.x / total;
				direction.z = direction.z / total;
				var axis = new THREE.Vector3(0, 1, 0);
				var angle = -Math.PI / 2;
				camera.position.addScaledVector(direction.applyAxisAngle(axis, angle), (speed / 1000) * frameTime);
			}

			// MOVEMENT MOBILE
			if (mouseDown) {
				camera.getWorldDirection(direction);
				let total = Math.abs(direction.x) + Math.abs(direction.z);
				direction.x = direction.x / total;
				direction.z = direction.z / total;
				direction.y = 0;
				camera.position.addScaledVector(direction, (speed / 1000) * frameTime);
			}

			// INTERACTION

			if (keyDown.e) {
				if (lookedAtObject) {
					// console.log(lookedAtObject);
					if (lookedAtObject.interact) {
						keyDown.e = false;
						lookedAtObject.interact();
						if (orbitControls.enabled) {
							controls.connect();
							controls.lock();
							orbitControls.enabled = false;
							camera.position.set(savedCameraPosition.x, savedCameraPosition.y, savedCameraPosition.z);
							camera.rotation.set(savedCameraRotation.x, savedCameraRotation.y, savedCameraRotation.z);
						} else {
							savedCameraPosition = camera.position.clone();
							savedCameraRotation = camera.rotation.clone();
							controls.disconnect();
							controls.unlock();
							orbitControls.enabled = true;
							lookedAtObject.geometry.computeBoundingBox();
							const size = lookedAtObject.geometry.boundingBox.getSize();
							orbitControls.target.set(lookedAtObject.parent.position.x, lookedAtObject.parent.position.y + size.y / 2, lookedAtObject.parent.position.z);
							orbitControls.update();
						}
					}
				} else {
					document.querySelector('.sidetext').classList.add('isHidden');
				}
			}

			// RAYCAST
			raycaster.setFromCamera(cursor, camera);
			intersects = raycaster.intersectObjects(scene.getObjectByName('interactable').children, true);
			if (intersects.length >= 1 && intersects[0].object.tag) {
				let object = intersects[0].object;
				if (object.tag.includes('interactable')) {
					if (object.parent.isInteractedWith == true) {
						interactText.classList.add('isHidden');
					} else {
						interactText.classList.remove('isHidden');
					}

					object.isLookedAt = true;
					lookedAtObject = object;
				} else {
					interactText.classList.add('isHidden');
					lookedAtObject = undefined;
				}
			} else {
				interactText.classList.add('isHidden');
				lookedAtObject = undefined;
			}
			previousFrame = frameStart;
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				controls.update();
			}
		}

		movement();
	};
	const handleKeyDown = (ev) => {
		if (ev.keyCode == 87) {
			keyDown.w = true;
		}
		if (ev.keyCode == 83) {
			keyDown.s = true;
		}
		if (ev.keyCode == 65) {
			keyDown.a = true;
		}
		if (ev.keyCode == 68) {
			keyDown.d = true;
		}
		if (ev.keyCode == 32) {
			console.log(camera);
		}
		if (ev.keyCode == 69) {
			keyDown.e = true;
		}
	};
	const handleKeyUp = (ev) => {
		if (ev.keyCode == 87) {
			keyDown.w = false;
		}
		if (ev.keyCode == 83) {
			keyDown.s = false;
		}
		if (ev.keyCode == 65) {
			keyDown.a = false;
		}
		if (ev.keyCode == 68) {
			keyDown.d = false;
		}
		if (ev.keyCode == 69) {
			keyDown.e = false;
		}
	};

	return {
		initializeMovement: initializeMovement,
		scene: scene,
	};
})();
