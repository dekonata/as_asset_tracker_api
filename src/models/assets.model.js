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

const TEST_EDIT = {
	asset_type: 'laptop',
	serialnumber: 'T9001',
	payload: {
		make: 'Asus'
	}

}

async function getAllAssets() {
	return await db.select('*').from('all_assets');
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



async function editAsset(edit_data) {
	try {
		return await db(edit_data.asset_type)
			.where('serialnumber', edit_data.serialnumber)
			.update(edit_data.payload, ['asset_id'])
	} catch(err) {
		throw err
	}
}

async function test() {
	try {
		const insert = await getOneAsset('TESTPHONE')
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
	editAsset
}