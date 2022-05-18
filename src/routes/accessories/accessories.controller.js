const {
	getAllAccessories,
	getOneAccessory,
	editAccessory,
} = require('../../models/accessories.model.js');

const {
	getAccTransfers,
} = require('../../models/transfers.model.js');

async function httpGetAllAccessories(req, res) {
	return res.status(200).json(await getAllAccessories());
}

async function httpGetOneAccessory(req, res) {
	try {
		const accId = req.params.accid;
		const accDetails = await getOneAccessory(accId);

		if(!accDetails) {
			return res.status(400).json('Accessory not found');
		}
		
		const accTransfers = await getAccTransfers(accId);

		const accData = Object.assign({}, accDetails, {transfers: accTransfers});

		return res.status(200).json(accData);
	} catch(err) {
		res.status(400).json(err)
	}
}

async function httpEditAccessory(req, res) {
	try {
		const edit_data = req.body;
		console.log(req.data)
		const edit = await(editAccessory(edit_data));
		return res.status(200).json(`Accessory edit complete`);
	} catch (err) {
		res.status(400).json(err.toString());
	}
}

module.exports = {
	httpGetAllAccessories,
	httpGetOneAccessory,
	httpEditAccessory,
}
