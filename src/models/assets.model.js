const db = require('../services/knex.js');

const {queryParsedLocations} = require('../services/utils.js');

const DEFAULT_LOCATION_ID = '1';

const TEST_ASSET = {    
	asset_type: 'accessory',                                                                                                                                                   
  asset: {
		make: 'Microsoft', 
		accessory_type: 'Mouse',
		description: 'Bluetooth Mouse',
	},                                                                                                                        
  transfer_date: '2022-02-25'                                                                                                                                   
}   

const TEST_ASSET_LIST = [
	{
		asset_type: 'laptop',                                                                                                                                                   
  		asset: {
			make: 'Lenovo', 
			model: 'E50',
			asset_condition: 'new',
			serialnumber: 'F80DF'
		},                                                                                                                        
  		transfer_date: '2022-07-25' 
	},
	{
		asset_type: 'accessory',                                                                                                                                                   
  		asset: {
			make: 'Lenovo', 
			accessory_type: 'Power Supply',
			description: 'Lenovo E50 PSU',
		},                                                                                                                        
  		transfer_date: '2022-02-25' 
	},

] ;


const TEST_EDIT = {
	asset_type: 'laptop',
	serialnumber: 'T9001',
	payload: {
		make: 'Asus'
	}

}

const TEST_NOTE = {
	asset_id: 127,
	note: "Damaged by Brad while he was travelling because he was drunk"
}

async function getAllAssets() {
	return await db.select('*').from('all_assets');
}

const TEST_EDIT_NOTE = {
	note_id: 3,
	note: "Damaged by Brad while he was travelling because he was drunk-ish"

}

async function getAllTypeAssets(asset_type) {
	try {
		return await 
			db(asset_type)
			.distinctOn(`${asset_type}.serialnumber`)
			.select(
					'serialnumber',
					db.raw(`CONCAT(make, ': ', model) AS model`),
					db.raw(queryParsedLocations()),
					'asset_condition'
				)
				.leftJoin('asset_transfer', 'asset_transfer.asset_id',`${asset_type}.asset_id`)
				.leftJoin('all_locations', 'all_locations.location_id', 'asset_transfer.location_id')
			.orderBy(`${asset_type}.serialnumber`)
			.orderBy('asset_transfer.transfer_date', 'desc');
		} catch (err) {
			throw err
		}
}

async function getOneAsset(serial_number) {
	try {
		const asset = await 
			db.select(
					'all_assets.asset_type',
					'all_assets.asset_id',
					'all_assets.serialnumber',
					'all_assets.make',
					'all_assets.model',
					'all_assets.asset_condition',
					db.raw(queryParsedLocations()),
				)
				.from('all_assets')
				.leftJoin('all_asset_locations', 'all_assets.asset_id', 'all_asset_locations.asset_id')
				.leftJoin('all_locations', 'all_locations.location_id', 'all_asset_locations.location_id')
				.where({'all_assets.serialnumber': serial_number})
		return asset[0]
	} catch (err) {
		throw err
	}
}
// Get lists for each field to be used in frontend suggestbox
async function getAssetTypeSuggestList(asset_type) {
	const serialList = 
		await db.table(asset_type)
			.pluck('serialnumber')
			.distinct('serialnumber')
	const modelList = 
		await db.table(asset_type)
			.pluck('model')
			.distinct('model')
	const makeList = 
		await db.table(asset_type)
			.pluck('make')
			.distinct('make')
	const conditionList =
		await db.table(asset_type)
			.pluck('asset_condition')
			.distinct('asset_condition')
	return { serialList, makeList, modelList, conditionList }
}

// Create seperate suggestlest for accessories which have different field from other assets
async function getAccessorySuggestlist() {
	const makeList = 
		await db.table('accessory')
			.pluck('make')
			.distinct('make');
	const typeList = 
		await db.table('accessory')
			.pluck('accessory_type')
			.distinct('accessory_type');
	return {makeList, typeList};
}

// Combine asset suggestlists
async function getAssetSuggestLists() {
	const assetTypeList = 
		await db.table('transfer_id')
			.pluck('asset_type')
			.distinct('asset_type')

	const laptop = await getAssetTypeSuggestList('laptop');
	const monitor = await getAssetTypeSuggestList('monitor');
	const modem = await getAssetTypeSuggestList('modem');
	const cellphone = await getAssetTypeSuggestList('cellphone');
	const pc = await getAssetTypeSuggestList('pc');
	const tablet = await getAssetTypeSuggestList('tablet');
	const misc = await getAssetTypeSuggestList('misc');
	const acc = await getAccessorySuggestlist();

	return {assetTypeList, laptop, monitor, modem, cellphone, pc, tablet, misc, acc}
}


async function addAsset(asset_data) {
	const {asset_type, asset, transfer_date} = asset_data;
	try {
		return await db.transaction(async trx => {
			// Generate trasnfer_id for asset
			const addTransferAsset = 
				await trx('transfer_id')
					.insert({asset_type: asset_type}, 'asset_id');

			// Add new Asset Transfer ID to asset insert data
			const insertData = Object.assign({}, asset, addTransferAsset[0]); 

			const insertAsset =
				await trx(asset_type)
					.insert( insertData, 'asset_id');

			// Transfer new item to default location in transfer table
			const addToTransferLog =
				await trx('asset_transfer')
					.insert({
						asset_id: addTransferAsset[0].asset_id,
						location_id: DEFAULT_LOCATION_ID,
						transfer_date: transfer_date,
					}, 'transfer_id');

			return await insertAsset;
		})
	} catch(err) {
		throw err;
	}
}

async function addMultipleAssets(asset_list) {
	try {
		return await db.transaction(async trx => {
			for(asset_data of asset_list) {
				const {asset_type, asset, transfer_date} = asset_data;
				// Generate trasnfer_id for asset	
				const addTransferAsset = 
				await trx('transfer_id')
					.insert({asset_type: asset_type}, 'asset_id');

				// Add new Asset Transfer ID to asset data for inserting in asset table
				const insertData = Object.assign({}, asset, addTransferAsset[0]); 

				const insertAsset =
					await trx(asset_type)
						.insert( insertData, 'asset_id');

				// Transfer new item to default location in transfer table				
				const addToTransferLog =
					await trx('asset_transfer')
						.insert({
							asset_id: addTransferAsset[0].asset_id,
							location_id: DEFAULT_LOCATION_ID,
							transfer_date: transfer_date,
						}, 'transfer_id');
			}

			return "Insert Complete";
		})
	} catch(err) {
		throw err;
	}
}


async function editAsset(edit_data) {
	try {
		return await db(edit_data.asset_type)
			.where('serialnumber', edit_data.serialnumber)
			.update(edit_data.payload, ['asset_id']);
	} catch(err) {
		throw err;
	}
}

async function addAssetNote(note_data) {
	const {asset_id, note} = note_data;
	try {
		return await db('asset_note')
			.insert({
				asset_id,
				note
			}, ['note_id']);
	} catch(err) {
		throw err;
	}
}

async function editAssetNote(edit_data) {
	const {note_id, note} = edit_data;
	try {
		return await db('asset_note')
			.where('note_id', note_id)
			.update('note', note, ['note_id']);
	} catch(err) {
		throw err;
	}
}

async function getAssetNotes(asset_id) {
	try {
		return await db('asset_note')
			.where('asset_id', asset_id);
	} catch(err) {
		throw(err);
	}
}

async function delAssetNote(note_id) {
	try {
		return await db('asset_note')
			.where('note_id', note_id)
			.del();
	} catch(err) {
		throw(err);
	}
}

async function test() {
	try {
		const insert = await editAssetNote(TEST_EDIT_NOTE);
		console.log(insert)
	} catch(err) {
		console.log(err)
	}
}
// test();


module.exports = {
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
}