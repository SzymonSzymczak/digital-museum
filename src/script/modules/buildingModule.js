import * as THREE from 'three';
import { materialModule } from './materialsModule';
import { objectModule } from './objectModule';

export const buildingModule = (function () {
	const spawnBuilding = function (scene) {
		// FLOOR
		var geometry = new THREE.PlaneBufferGeometry(50, 16, 1, 1);
		var floor = new THREE.Mesh(geometry, materialModule.floorMaterial());
		floor.position.x = -20;
		// floor.material.side = THREE.DoubleSide;
		floor.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 1.5708);
		floor.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 1.5708 * 2);
		floor.receiveShadow = true;
		floor.name = 'floor';
		// floor.castShadow = true;
		scene.add(floor);

		// WALLS
		var geometryWall1 = new THREE.PlaneBufferGeometry(50, 8, 1, 1);
		var wall1 = new THREE.Mesh(geometryWall1, materialModule.wallMaterial(20, 2));
		wall1.position.y = 4;
		wall1.position.z = 8;
		wall1.position.x = -20;
		wall1.material.side = THREE.DoubleSide;
		wall1.receiveShadow = true;
		wall1.name = 'wall1';
		// wall1.castShadow = true;
		scene.add(wall1);

		var geometryWall2 = new THREE.PlaneBufferGeometry(50, 8, 1, 1);
		var wall2 = new THREE.Mesh(geometryWall2, materialModule.wallMaterial(20, 2));
		wall2.position.y = 4;
		wall2.position.z = -8;
		wall2.position.x = -20;
		wall2.material.side = THREE.DoubleSide;
		wall2.receiveShadow = true;
		wall2.name = 'wall2';
		// wall2.castShadow = true;
		scene.add(wall2);

		var geometryWall3 = new THREE.PlaneBufferGeometry(16, 8, 1, 1);
		var wall3 = new THREE.Mesh(geometryWall3, materialModule.wallMaterial(6, 2));
		wall3.position.y = 4;
		wall3.position.z = 0;
		wall3.position.x = 5;
		wall3.material.side = THREE.DoubleSide;
		wall3.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 1.5708);
		wall3.receiveShadow = true;
		wall3.name = 'wall3';
		// wall3.castShadow = true;
		scene.add(wall3);

		var geometryWall4 = new THREE.PlaneBufferGeometry(16, 8, 1, 1);
		var wall4 = new THREE.Mesh(geometryWall4, materialModule.wallMaterial(6, 2));
		wall4.position.y = 4;
		wall4.position.z = 0;
		wall4.position.x = -45;
		wall4.material.side = THREE.DoubleSide;
		wall4.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 1.5708);
		wall4.receiveShadow = true;
		wall4.name = 'wall4';
		// wall4.castShadow = true;
		scene.add(wall4);

		// CEILING
		var geometry = new THREE.PlaneBufferGeometry(50, 16, 1, 1);
		// var ceilingMaterial = new THREE.MeshBasicMaterial({ color: '#BDC3C7' });
		var ceiling = new THREE.Mesh(geometry, materialModule.ceilingMaterial(40, 6));
		// ceiling.material.side = THREE.DoubleSide;
		ceiling.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 1.5708);
		ceiling.position.y = 7;
		ceiling.position.x = -20;
		// ceiling.receiveShadow = true;
		ceiling.name = 'ceiling';
		// ceiling.castShadow = true;
		scene.add(ceiling);

		// CEILING DECORATIONS
		for (let i = 0; i < 4; i++) {
			var supportGeo = new THREE.BoxBufferGeometry(16, 1, 1);
			var support = new THREE.Mesh(supportGeo, materialModule.ceilingMaterial(12, 1));
			support.position.y = 6.75;
			support.position.z = 0;
			support.position.x = i * -10 - 7.5;
			support.material.side = THREE.DoubleSide;
			support.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 1.5708);
			// support.receiveShadow = true;
			support.name = 'wall4';
			// support.castShadow = true;
			scene.add(support);
		}
		for (let i = 0; i < 2; i++) {
			var supportGeo = new THREE.BoxBufferGeometry(50, 1, 1);
			var support = new THREE.Mesh(supportGeo, materialModule.ceilingMaterial(50, 1));
			support.position.y = 6.75;
			support.position.z = i * 10 - 5;
			support.position.x = -20;
			support.rotateY(1.5708);
			support.rotateY;
			support.material.side = THREE.DoubleSide;
			support.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 1.5708);
			// support.receiveShadow = true;
			support.name = 'wall4';
			// support.castShadow = true;
			scene.add(support);
		}

		// COLUMNS
		for (let z = 0; z < 2; z++) {
			for (let i = 0; i < 4; i++) {
				objectModule.spawnObject(
					require('../../assets/Ionic_Column/Ionic_Column.obj'),
					(obj) => {
						for (let child of obj.children) {
							child.material = materialModule.columnMaterial;
						}
					},
					[0, 0, 0],
					[11, 11, 11],
					[i * -10 - 7.5, -0.1, z * 10 - 5],
				);
			}
		}
	};

	return {
		spawnBuilding: spawnBuilding,
	};
})();
