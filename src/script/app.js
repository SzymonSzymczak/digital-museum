import * as THREE from 'three';
import { objectModule } from './modules/objectModule.js';
import { materialModule } from './modules/materialsModule';
import 'regenerator-runtime/runtime';
import data from '../data.json';

const start = async function () {
	await objectModule.init();
	for (let i = 0; i < data.length; i++) {
		if (i <= 7) {
			await objectModule.spawnObject(data[i], data[i].separate_materials, [0, 1.5708, 0], [1, 1, 1], [i * -5, 0, -6], true);
		} else if (i <= 15) {
			await objectModule.spawnObject(data[i], data[i].separate_materials, [0, -1.5708, 0], [1, 1, 1], [i * -5 - 8 * -5, 0, 6], true);
		}
	}
	console.log('loaded');
	const event = new Event('renderFrame');
	document.dispatchEvent(event);
	console.log('start');
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	document.querySelector('.controls').classList.remove('isHidden');

	for (let button of document.querySelectorAll('.js-button')) {
		button.addEventListener('touchstart', () => {
			let keycode = button.getAttribute('keycode');
			let event = new KeyboardEvent('keydown', { keyCode: keycode });
			document.dispatchEvent(event);
		});
		button.addEventListener('touchend', () => {
			let keycode = button.getAttribute('keycode');
			let event = new KeyboardEvent('keyup', { keyCode: keycode });
			document.dispatchEvent(event);
		});
	}
}

start();
