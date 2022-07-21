const {
	getAllLocationsList,
	getLocationSuggestlists,
	getOneLocation,
	getLocationAssets,
	getLocationAccessories
} = require('../../models/locations.model.js');

const { getOneCabinetId } = require('../../models/cabinets.model.js');
const { getOneShelfId } = require('../../models/shelf.model.js');

async function httpGetAllLocationsList(req, res) {
	return res.status(200).json(await getAllLocationsList());
}

async function httpGetLocationSuggestlists(req, res) {
		return res.status(200).json(await getLocationSuggestlists());
}

async function httpGetOneLocation(req, res) {
	try {
		// Id in frontend location type id formatted as CAB01 or SHE01 
		const parsed_id = req.params.locationsid;
		const location_type = parsed_id.substr(0,3);
		const location_type_id = Number(parsed_id.substr(4,5));

		let location_id

		switch(location_type) {
			case 'CAB':
				location_id = await getOneCabinetId(location_type_id);
				break
			case 'SHE':
				location_id = await getOneCabinetId(location_type_id);
				break
			default:
				return res.status(400).json('Invalide Location id');
		}

		console.log(location_id)

		const location = await getOneLocation(location_id);
		const assets = await getLocationAssets(location_id);
		const accessories = await getLocationAccessories(location_id);

		const location_data = Object.assign({}, location, {assets:assets}, {accessories:accessories})

		return res.status(200).json(location_data);
	} catch (err) {
		return res.status(400).json(err);
	}
}

module.exports = {
	httpGetAllLocationsList,
	httpGetLocationSuggestlists,
	httpGetOneLocation,
}