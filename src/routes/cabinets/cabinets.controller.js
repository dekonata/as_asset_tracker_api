const {
	getCabinetSuggestLists,
	addCabinet,
} = require('../../models/cabinets.model.js');

async function httpGetCabinetLists(req, res) {
	return res.status(200).json(await getCabinetSuggestLists());
}

async function httpAddCabinet(req, res) {
	const cabinet_data = req.body;
	try {
		const addedCabinet = await addCabinet(cabinet_data);
		return res.status(201).json(addedCabinet);
	} catch (err) {
		return res.status(400).json(err);
	}
}

module.exports = {
	httpGetCabinetLists,
	httpAddCabinet,
}