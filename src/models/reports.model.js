const db = require('../services/knex.js');
const fs = require('fs')

async function getLocationAssetsReport() {
	return await 
		db.select(
			'asset_transfer.location_id',
			'transfer_id',
			'location_type_id',
			db.raw(`TRIM(CONCAT(firstname, ' ', lastname, located)) as "location_detail"`),
			'asset_type',
			'all_assets.serialnumber',
			db.raw(`TRIM(CONCAT(make, ': ', model)) as "asset_detail"`),
			'asset_condition',
			)
		.distinctOn('asset_transfer.asset_id')
		.from('all_locations')
		.rightJoin('asset_transfer', 'asset_transfer.location_id', 'all_locations.location_id')
		.rightJoin('all_assets', 'asset_transfer.asset_id', 'all_assets.asset_id')
		.orderBy(['asset_transfer.asset_id', {column: 'transfer_date', order: 'desc'}])


}

async function test() {
	const insert = await getLocationAssetsReport();
	console.log(insert)
}

// test()

module.exports = {
	getLocationAssetsReport,
}
