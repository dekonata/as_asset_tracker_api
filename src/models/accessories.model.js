const db = require('../services/knex.js');

const {queryParsedLocations} = require('../services/utils.js')

const TEST_EDIT = {
	accessory_id: 22,
	payload: {
		description: 'Roller Pad'
	}
}

async function getAllAccessories() {
	return await 
		db('accessory')
		.select(
			'accessory_id',
			db.raw(`CONCAT('ACC', TO_CHAR(accessory_id, 'FM00')) AS acc_id`),
			'accessory.accessory_type',
			'accessory.make',
			'accessory.description',
			'all_asset_locations.transfer_date',
			'accessory.asset_id',
			'all_asset_locations.location_id',
			db.raw(queryParsedLocations()),
			)
		.leftJoin('all_asset_locations', 'accessory.asset_id', 'all_asset_locations.asset_id')
		.leftJoin('all_locations', 'all_locations.location_id', 'all_asset_locations.location_id')
}

async function getOneAccessory(acc_id) {
	try {
		const accQuery = await
			db.select(
				'accessory.accessory_id',
				db.raw(`CONCAT('ACC', TO_CHAR(accessory_id, 'FM00')) AS parsed_id`),
				'accessory.asset_id',
				'accessory.accessory_type',
				'accessory.make',
				'accessory.description',
				db.raw(queryParsedLocations()),
			)
			.from('accessory')
			.leftJoin('all_asset_locations', 'accessory.asset_id', 'all_asset_locations.asset_id')
			.leftJoin('all_locations', 'all_locations.location_id', 'all_asset_locations.location_id')
			.where('accessory_id', acc_id );

		return accQuery[0];
	} catch (err) {
		throw err;
	}
}

async function editAccessory(edit_data) {
	try {
		return await db('accessory')
			.where('accessory_id', edit_data.accessory_id)
			.update(edit_data.payload, ['accessory_id'])
	} catch(err) {
		throw err
	}
}

async function test() {
	const acc = await editAccessory(TEST_EDIT);
	console.log(acc);
}

// test();

module.exports = {
	getAllAccessories,
	getOneAccessory,
	editAccessory
}