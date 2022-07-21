const db = require('../services/knex.js');

const {queryParsedLocations} = require('../services/utils.js');


const TEST_TRANSFER = {
	asset_id: 99,
	location_id: 15,
	transfer_date: '2022-05-19'
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
	// Get date adn location of last transaction - returned as object
	const lastTr = await getLastTransfer(transfer_data.asset_id);

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

	try {
		return await 
				db('asset_transfer')
					.insert(transfer_data, 'transfer_id');
	} catch(err) {
		if(Number(err.code) === 23503) {
			throw 'Asset ID does not exist';
		} else {
			throw err;
		}
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