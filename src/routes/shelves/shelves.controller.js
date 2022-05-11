const {
	addShelf,
	getShelfSuggestLists
} = require('../../models/shelf.model.js');

async function httpGetShelfLists(req, res) {
	return res.status(200).json(await getShelfSuggestLists());
}

async function httpAddShelf(req, res) {
	const data = req.body;
	try {
		const added = await addShelf(data);
		return res.status(201).json(added);
	} catch(err) {
		return res.status(400).json(err);
	}
}

module.exports = {
	httpAddShelf,
	httpGetShelfLists,
}