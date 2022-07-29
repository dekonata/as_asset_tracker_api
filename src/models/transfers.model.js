const db = require('../services/knex.js');

const {queryParsedLocations} = require('../services/utils.js');


const TEST_TRANSFER = {
	asset_ids: [96, 105, 103],
	location_id: 49,
	transfer_date: '2022-07-21'
}

async function getAssetTransfers(serialnumber) {
	try {const transfersList =
			 await 
			 	db.select(
			 		'location_type',
					db.raw(queryParsedLocations()),
					'transfer_date', 
					'capture_time'
				)
				.from('all_assets')
				.rightJoin('asset_transfer', 'all_assets.asset_id', 'asset_transfer.asset_id')
				.leftJoin('all_locations', 'all_locations.location_id', 'asset_transfer.location_id')
				.where('all_assets.serialnumber', serialnumber)
				.orderBy('transfer_date', 'desc')
				.orderBy('capture_time', 'desc');


		return transfersList;
	} catch(err) {
		throw err;
	}
}

async function getAccTransfers(acc_id) {
	try {const transfersList =
			 await 
			 	db.select(
					db.raw(queryParsedLocations()),
					'transfer_date', 
					'capture_time'
				)
				.from('accessory')
				.rightJoin('asset_transfer', 'accessory.asset_id', 'asset_transfer.asset_id')
				.leftJoin('all_locations', 'all_locations.location_id', 'asset_transfer.location_id')
				.where('accessory.accessory_id', acc_id)
				.orderBy('transfer_date', 'desc')
				.orderBy('capture_time', 'desc');


		return transfersList;
	} catch(err) {
		throw err;
	}
}


async function getLastTransfer(asset_id) {
	try {
		const transferQuery = await
			db.select(
				'location_id',
				'transfer_date'
			)
			.from('all_asset_locations')
			.where('asset_id', asset_id);
		return transferQuery[0]; 
	} catch(err) {
		throw err
	}
} 


async function addAssetTransfer( transfer_data ) {
	try {
		await db.transaction(async trx => {
			const assetIds = transfer_data.asset_ids
			const {location_id, transfer_date} = transfer_data

			for(assetId of assetIds) {
				// Get date adn location of last transaction - returned as object
				const lastTr = await getLastTransfer(assetId);

				// If nothing is returned, asset_id provided was invalid
				if(!lastTr) {
					throw 'Invalide Asset ID';
				}

				// If last transaction was before transaction being added, throw error
				const lastTrDate = new Date(lastTr.transfer_date);
				const newTrDate = new Date(transfer_data.transfer_date);

				if(newTrDate.getTime() <= lastTrDate.getTime()) {
					throw('Error: Transfer date before last transaction');
				} 

				if(Number(lastTr.location_id) === Number(transfer_data.location_id)) {
					throw('Error: Transfer to current loction');
				}

				const insert = await trx('asset_transfer').insert({
					asset_id: assetId,
					location_id: location_id,
					transfer_date: transfer_date
					}, 'transfer_id');
				}
			return "transfer success"
		})
	} catch (error) {
		throw(error)
	}
}

async function test() {
	try {
		const dates = await addAssetTransfer(TEST_TRANSFER);
		console.log(dates)
	} catch (err) {
		console.log(err)
	}
}

// test()

module.exports = {
	addAssetTransfer,
	getAccTransfers,
	getAssetTransfers,
}