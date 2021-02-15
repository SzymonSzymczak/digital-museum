import * as THREE from 'three';
import { EqualStencilFunc, Euler, Quaternion } from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { movementModule } from '../modules/movementModule';
import { materialModule } from './materialsModule';
import { buildingModule } from './buildingModule';

export const objectModule = (function () {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 80);
	const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
	const loader = new THREE.TextureLoader();

	let savedMaterials = {};
	let savedStandMaterial = undefined;

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

	// BLOB STORAGE URL
	let storageURL = 'https://digitalmuseum.blob.core.windows.net/models/';

	const init = async function () {
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

		await buildingModule.spawnBuilding(scene);
		await movementModule.initializeMovement(camera, scene, renderer);

		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		}
		animate();
	};

	const spawnStand = function (position) {
		ObjLoader.load(
			require('../../assets/Stand/Round_Stand.obj'),
			(object) => {
				object.position.setX(position[0]);
				object.position.setY(position[1]);
				object.position.setZ(position[2]);

				if (!savedStandMaterial) {
					let tex = loader.load(require('../../assets/Stand/Round_Stand_tex_0.jpeg'));
					savedStandMaterial = new THREE.MeshLambertMaterial({ map: tex });
				}
				object.children[0].material = savedStandMaterial;
				object.children[0].castShadow = true;
				object.children[0].receiveShadow = true;
				scene.add(object);
			},
			undefined,
			function (error) {
				console.error(error);
			},
		);
	};

	const spawnObject = async function (data, separeteMeterials = false, rotationXYZ = [0, 0, 0], scaleXYZ = [1, 1, 1], postionXYZ = [0, 0, 0], interactable = false) {
		return new Promise((resolve, reject) => {
			ObjLoader.load(
				storageURL + data.name + '.obj',
				async function (object) {
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

					object.position.z = postionXYZ[2];

					if (data.with_stand) {
						object.position.y = postionXYZ[1] + 1.48;
						spawnStand(postionXYZ);
					} else {
						object.position.y = postionXYZ[1];
					}

					object.children[0].castShadow = true;
					object.children[0].receiveShadow = false;
					object.children[0].tag = [];

					object.children[0].isLookedAt = false;
					if (Number.isInteger(separeteMeterials)) {
						for (let i = 0; i < separeteMeterials; i++) {
							if (savedMaterials[`${storageURL}${data.name}_tex_${i}.jpeg`]) {
								object.children[0].material[i] = savedMaterials[`${storageURL}${data.name}_tex_${i}.jpeg`];
							} else {
								const texture = loader.load(`${storageURL}${data.name}_tex_${i}.jpeg`);
								let material = new THREE.MeshLambertMaterial({ map: texture });
								savedMaterials[`${storageURL}${data.name}_tex_${i}.jpeg`] = material;
								object.children[0].material[i] = material;
							}
						}
					} else {
						for (let i = 0; i < object.children.length; i++) {
							if (separeteMeterials) {
								if (savedMaterials[`${storageURL}${data.name}_tex_${i}.jpeg`]) {
									object.children[i].material = savedMaterials[`${storageURL}${data.name}_tex_${i}.jpeg`];
								} else {
									const texture = loader.load(`${storageURL}${data.name}_tex_${i}.jpeg`);
									let material = new THREE.MeshLambertMaterial({ map: texture });
									savedMaterials[`${storageURL}${data.name}_tex_${i}.jpeg`] = material;
									object.children[i].material = material;
								}
							} else {
								if (savedMaterials[`${storageURL}${data.name}_tex_0.jpeg`]) {
									object.children[i].material = savedMaterials[`${storageURL}${data.name}_tex_0.jpeg`];
								} else {
									const texture = loader.load(`${storageURL}${data.name}_tex_0.jpeg`);
									let material = new THREE.MeshLambertMaterial({ map: texture });
									savedMaterials[`${storageURL}${data.name}_tex_0.jpeg`] = material;
									object.children[i].material = material;
								}
							}
						}
					}
					resolve();
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
							// console.log(object);
							let domEle = document.querySelector('.sidetext');
							domEle.querySelector('.sidetext-title').innerHTML = data.title;
							domEle.querySelector('.sidetext-description').innerHTML = data.desc;
							domEle.querySelector('.sidetext-copyright').innerHTML = data.copyright;
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
					reject();
					// console.error(error);
				},
			);
		});
	};

	return { init: init, spawnObject: spawnObject };
})();
