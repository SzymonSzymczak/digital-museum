import * as THREE from 'three';
export const materialModule = (function () {
	const loader = new THREE.TextureLoader();
	// const Amenemhat_iii_0 = (() => {
	// 	const texture = loader.load(require('../../assets/Amenemhat_iii/tex_0.jpeg'));
	// 	return new THREE.MeshLambertMaterial({ map: texture });
	// })();
	// const Amenemhat_iii_1 = (() => {
	// 	const texture = loader.load(require('../../assets/Amenemhat_iii/tex_1.jpeg'));
	// 	return new THREE.MeshLambertMaterial({ map: texture });
	// })();

	const floorMaterial = () => {
		const texture = loader.load(require('../../assets/Building/tile_tile_0054_01_tiled.jpg'));
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(25, 8);
		return new THREE.MeshPhongMaterial({ map: texture, color: '#CFCFC6' });
	};

	const wallMaterial = (x, y) => {
		const texture = loader.load(require('../../assets/Building/slate13.jpg'));
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(x, y);
		return new THREE.MeshPhongMaterial({ map: texture, color: '#fff' });
	};
	const ceilingMaterial = (x, y) => {
		const texture = loader.load(require('../../assets/Building/slate13.jpg'));
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(x, y);
		return new THREE.MeshLambertMaterial({ map: texture });
	};
	// const columnMaterial = (() => {
	// 	const texture = loader.load(require('../../assets/Ionic_Column/texture/column_AO.jpeg'));
	// 	return new THREE.MeshLambertMaterial({ map: texture });
	// })();

	return { floorMaterial: floorMaterial, wallMaterial: wallMaterial, ceilingMaterial: ceilingMaterial };
})();
