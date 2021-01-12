import * as THREE from 'three';
import { Euler, Quaternion } from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { movementModule } from '../modules/movementModule';
import { materialModule } from './materialsModule';
import { buildingModule } from './buildingModule';

export const objectModule = (function () {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 80);
	const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });

	const ObjLoader = new OBJLoader();

	let interactableGroup;

	// Hemisphere light config
	const skyColor = 0xe7d5b1; // light blue
	const groundColor = 0x28241b; // brownish orange
	const intensity = 1;

	// Light Shadows config
	const shadowWidth = 128;
	const shadowHeight = 128;
	const shadowNear = 0.5;
	const shadowFar = 50;
	const shadowRadius = 5;

	const init = function () {
		// window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		document.body.appendChild(renderer.domElement);
		scene.add(camera);

		interactableGroup = new THREE.Group();
		interactableGroup.name = 'interactable';
		scene.add(interactableGroup);

		// LIGHT

		for (let i = 0; i < 1; i++) {
			const light = new THREE.PointLight('#F6ECCD', 0.6, 50, 0.5);
			light.position.x = -20;
			light.position.y = 3;
			light.castShadow = true;
			light.shadow.mapSize.width = shadowWidth;
			light.shadow.mapSize.height = shadowHeight;
			light.shadow.camera.near = shadowNear;
			light.shadow.camera.far = shadowFar;
			light.shadow.radius = shadowRadius;
			scene.add(light);
			console.log('added');
		}

		const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
		scene.add(hemisphereLight);

		const size = 10;
		const divisions = 10;

		buildingModule.spawnBuilding(scene);
		movementModule.initializeMovement(camera, scene, renderer);

		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		}
		animate();
	};

	const spawnObject = function (ObjectURL, materialFunc, rotationXYZ = [0, 0, 0], scaleXYZ = [1, 1, 1], postionXYZ = [0, 0, 0], interactable = false) {
		ObjLoader.load(
			ObjectURL,
			function (object) {
				object.isInteractedWith = false;
				if (interactable) {
					interactableGroup.add(object);
				} else {
					scene.add(object);
				}

				object.rotation.x = rotationXYZ[0];
				object.rotation.y = rotationXYZ[1];
				object.rotation.z = rotationXYZ[2];
				object.scale.x = scaleXYZ[0];
				object.scale.y = scaleXYZ[1];
				object.scale.z = scaleXYZ[2];
				object.position.x = postionXYZ[0];
				object.position.y = postionXYZ[1];
				object.position.z = postionXYZ[2];

				object.children[0].castShadow = true;
				object.children[0].receiveShadow = false;
				object.children[0].tag = [];

				object.children[0].isLookedAt = false;

				materialFunc(object);

				if (interactable) {
					// OUTLINE
					let outlineObject = object.clone();
					let outlineMat = new THREE.MeshBasicMaterial({ color: '#fff', side: THREE.BackSide });
					outlineObject.children[0].material = outlineMat;
					outlineObject.scale.addScalar(0.01);
					outlineObject.visible = false;
					outlineObject.castShadow = false;
					outlineObject.receiveShadow = false;
					scene.add(outlineObject);

					object.children[0].tag.push('interactable');
					object.children[0].interact = () => {
						let domEle = document.querySelector('.sidetext');
						domEle.classList.toggle('isHidden');
						if (object.isInteractedWith) {
							object.isInteractedWith = false;
						} else {
							object.isInteractedWith = true;
						}
					};

					function loop() {
						requestAnimationFrame(loop);
						if (object.children[0].isLookedAt === true) {
							// OUTLINE
							if (object.isInteractedWith == true) {
								outlineObject.visible = false;
							}
							if (outlineObject.visible == false && object.isInteractedWith == false) {
								outlineObject.visible = true;
							}
							// console.log('ratata');
							object.children[0].isLookedAt = false;
							// scene.add(object2);
						} else if (object.children[0].isLookedAt === false || object.isInteractedWith == false) {
							outlineObject.visible = false;
							// materialFunc(object);
							object.children[0].isLookedAt = undefined;
						}
					}
					loop();
				}
				// Outlines

				// let object1 = object.clone();
				// object1.children[0].material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide });
				// object1.scale.set(1.02, 1.02, 1.02);
				// scene.add(object1);
			},
			undefined,
			function (error) {
				console.error(error);
			},
		);
	};

	return { init: init, spawnObject: spawnObject };
})();
