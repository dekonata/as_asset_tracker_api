const { 
	getAllAssets,
	getAllTypeAssets,
	getOneAsset,
	getAssetSuggestLists,
	addAsset,
	addMultipleAssets,
	editAsset,
	addAssetNote,
	editAssetNote,
	getAssetNotes,
	delAssetNote,
	 } = require('../../models/assets.model.js');

async function httpGetAllAssets(req, res) {
	return res.status(200).json(await getAllAssets());
}

async function httpGetAllTypeAssets(req, res) {
	const asset_type = req.params.asset_type;
	try {
		return res.status(200).json(await getAllTypeAssets(asset_type));
	} catch(err) {
		return res.status(400).json(err);
	}
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

// Expects boyd with lists of assets in format for direct database insert query
async function httpAddMultipleAssets(req, res) {
	const {asset_list} = req.body;
	try {
		const addedAssets = await addMultipleAssets(asset_list);
		return res.status(201).json(addedAssets);
	} catch (err) {
		return res.status(400).json(err);
	}
}	

async function httpEditAsset(req, res) {
	const edit_data = req.body;
	try {
		const edit = await editAsset(edit_data);
		return res.status(200).json(edit);
	} catch(err) {
		return res.status(400).json(err);
	}
}

async function httpAddAssetNote(req, res) {
	const note_data = req.body;
	try {
		const addNote = await addAssetNote(note_data);
		return res.status(200).json(addNote);
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function httpEditAssetNote(req, res) {
	const edit_data = req.body;
	try {
		const edit = await editAssetNote(edit_data);
		if(edit) { console.log('edit')}
		return !edit.length ?  res.status(400).json('Note ID does not exist') : res.status(200).json(edit)
	} catch (err) {
		return res.status(400).json(err);
	}
};

async function httpGetAssetNotes(req, res) {
	const asset_id = req.params.asset_id
	try {
		return res.status(200).json(await getAssetNotes(asset_id));
	} catch(err) {
		return res.status(400).json(err);
	}
}

async function httpDelAssetNote(req, res) {
	const note_id = req.params.note_id
	console.log(note_id)
	try {
		return res.status(200).json(await delAssetNote(note_id));
	} catch(err) {
		return res.status(400).json(err);
	}
}


module.exports = {
	httpGetAllAssets,
	httpGetAllTypeAssets,
	httpGetOneAsset,
	httpGetAssetLists,
	httpAddAsset,
	httpAddMultipleAssets,
	httpEditAsset,
	httpAddAssetNote,
	httpEditAssetNote,
	httpGetAssetNotes,
	httpDelAssetNote,
};