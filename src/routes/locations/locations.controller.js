const {
	getAllLocationsList
} = require('../../models/locations.model.js');

async function httpGetAllLocationsList(req, res) {
	return res.status(200).json(await getAllLocationsList());
}

module.exports = {
	httpGetAllLocationsList,
}