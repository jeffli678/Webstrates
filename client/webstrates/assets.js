'use strict';
const coreEvents = require('./coreEvents');
const coreUtils = require('./coreUtils');
const coreWebsocket = require('./coreWebsocket');
const globalObject = require('./globalObject');

const assetsModule = {};

// Create internal event that other modules may subscribe to
coreEvents.createEvent('asset');

// Create event in userland.
globalObject.createEvent('asset');

let assets;

const websocket = coreWebsocket.copy((event) => event.data.startsWith('{"wa":'));

websocket.onjsonmessage = (message) => {
	switch (message.wa) {
		case 'assets':
			assets = message.assets;
			break;
		case 'asset':
			assets.push(message.asset);
			coreEvents.triggerEvent('asset', message.asset);
			globalObject.triggerEvent('asset', message.asset);
			break;
	}
};

/**
 * Get a list of all assets. Returns a frozen copy, so users won't (accidentally) modify it.
 * @return {obj} List of assets.
 * @public
 */
globalObject.publicObject.assets = Object.freeze(coreUtils.objectClone(assets));

/**
 * Makes it possible to select and upload files .
 * @param  {Function} callback Callback with two arguments, error and response. First argument will
 *                             be null on success.
 * @public
 */
globalObject.publicObject.uploadAsset = (callback = () => {}) => {
	const input = document.createElement('input');
	input.setAttribute('multiple', true);
	input.setAttribute('type', 'file');

	input.addEventListener('change', event => {
		const formData = new FormData();
		for (let i=0; i < input.files.length; i++) {
			formData.append('file[]', input.files.item(i));
		}
		fetch('', {
			method: 'post',
			credentials: 'include',
			headers: 'multipart/form-data',
			body: formData
		})
		.then(res => callback(null, res))
		.catch(err => callback(err));
	});

	input.click();
};

module.exports = assetsModule;