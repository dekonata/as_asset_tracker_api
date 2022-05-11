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
	const lastTransferLocation = await getLastTransferLocation(transfer_data.asset_id);
	const newTransferLocation = Number(transfer_data.location_id);

	if(newTransferLocation === lastTransferLocation) {
		return res.status(400).json('Cannot transfer to current location');
	} 

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