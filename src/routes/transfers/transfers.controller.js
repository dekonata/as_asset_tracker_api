const {
	getAssetTransfers,
	getLastTransferLocation,
	addAssetTransfer,
} = require('../../models/transfers.model.js');

async function httpGetAssetTransfers(req, res) {
	const serialnumber = req.params.serialnumber;
	return res.status(200).json(await getAssetTransfers(serialnumber));
}

async function httpAddAssetTransfer(req, res) {
	const transfer_data = req.body;
	try {
		const addedTransfer = await addAssetTransfer(transfer_data);
		return res.status(201).json(addedTransfer);
	} catch(err) {
		return res.status(400).json(err);
	}
}

module.exports = {
	httpGetAssetTransfers,
	httpAddAssetTransfer
}