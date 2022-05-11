const { 
	getAllAssets,
	getOneAsset,
	getAssetSuggestLists,
	addAsset,
	editAsset,
	 } = require('../../models/assets.model.js');

async function httpGetAllAssets(req, res) {
	return res.status(200).json(await getAllAssets());
}

async function httpGetOneAsset(req, res) {
	const serialnumber = req.params.serialnumber;
	try {
		const asset = await getOneAsset(serialnumber);
		return res.status(200).json(await asset);
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function httpGetAssetLists(req, res) {
	// console.log('check')
	return res.status(200).json(await getAssetSuggestLists());
}	

async function httpAddAsset(req, res) {
	const asset_data = req.body;
	try {
		const addedAsset = await addAsset(asset_data);
		return res.status(201).json(addedAsset);
	} catch (err) {
		return res.status(400).json(err);
	}
}	

async function httpEditAsset(req, res) {
	const edit_data = req.body;
	console.log('hit')
	try {
		const edit = await editAsset(edit_data)
		return res.status(200).json(edit)
	} catch(err) {
		return res.status(400).json(err)
	}
}



module.exports = {
	httpGetAllAssets,
	httpGetOneAsset,
	httpGetAssetLists,
	httpAddAsset,
	httpEditAsset,
};