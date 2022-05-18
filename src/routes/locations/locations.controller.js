const {
	getAllLocationsList,
	getOneLocation,
	getLocationAssets,
	getLocationAccessories
} = require('../../models/locations.model.js');

async function httpGetAllLocationsList(req, res) {
	return res.status(200).json(await getAllLocationsList());
}

async function httpGetOneLocation(req, res) {
	const location_id = Number(req.params.locationsid);
	console.log(location_id)
	try {
		const location = await getOneLocation(location_id);
		const assets = await getLocationAssets(location_id);
		const accessories = await getLocationAccessories(location_id);

		const location_data = Object.assign({}, location, {assets:assets}, {accessories:accessories})

		return res.status(200).json(location_data);
	} catch (err) {
		console.log(err)
		return res.status(400).json(err);
	}
}

module.exports = {
	httpGetAllLocationsList,
	httpGetOneLocation
}