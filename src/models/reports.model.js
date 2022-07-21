const db = require('../services/knex.js');
const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify')
const { pipeline } = require('stream/promises')

const writer = fs.createWriteStream(path.join(__dirname, '.','test.csv'))

const options = {
	delimiter: ',',
	columns: [
		{key: 'asset_type'}, 
		{key: 'location_id'}, 
		{key: 'transfer_id'}, 
		{key: 'location_type_id'}, 
		{key: 'location_detail'}, 
		{key: 'asset_type'}
	],
	header: true

}
const stringifier = stringify(options)  

async function getAssetLocationsReportStream() {
	try {
		const stream = await
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
			.stream()

		return stream
	} catch(err) {
		throw err
	}

}

async function test() {
	return await pipeline(
		await getAssetLocationsReportStream(),
		stringifier,
		writer
		);
	}
	// console.log(insert)



// test().catch(console.error)

module.exports = {
	getAssetLocationsReportStream,
}


