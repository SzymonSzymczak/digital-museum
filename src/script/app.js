import * as THREE from 'three';
import { objectModule } from './modules/objectModule.js';
import { materialModule } from './modules/materialsModule';
objectModule.init();

// objectModule.spawnObject(
// 	require('../assets/Amenemhat_iii/Amenemhat_iii.obj'),
// 	(object) => {
// 		object.children[0].material = [materialModule.Amenemhat_iii_0, materialModule.Amenemhat_iii_1];
// 	},
// 	[0, 1.8, 0],
// 	[1, 1, 1],
// 	[-2, 0, -6],
// );

for (let i = 0; i < 9; i++) {
	objectModule.spawnObject(
		require('../assets/Amenemhat_iii/Amenemhat_iii.obj'),
		(object) => {
			object.children[0].material = [materialModule.Amenemhat_iii_0, materialModule.Amenemhat_iii_1];
		},
		[0, 1.8, 0],
		[1, 1, 1],
		[i * -5, 0, -6],
		true,
	);
}
console.log('loaded');
const event = new Event('renderFrame');
document.dispatchEvent(event);
// setTimeout(() => {
// 	console.log('start');
// 	const event = new Event('renderFrame');
// 	document.dispatchEvent(event);
// }, 500);
