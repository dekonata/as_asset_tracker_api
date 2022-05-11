const db = require('../services/knex.js');

const TEST_TRANSFER = {
	asset_id: 33,
	location_id: 6,
	transfer_date: '2022-04-28'
}

async function getAssetTransfers(serialnumber) {
	try {const transfersList =
			 await 
			 	db.select(
					db.raw(`	
						CASE 
							WHEN location_type='cabinet' 
								THEN CONCAT(
									'CAB', 
									TO_CHAR(all_locations.location_id, 'FM00'), 
									': ', 
									all_locations.located)
								WHEN location_type='shelf' 
									THEN CONCAT(
										'SHE', 
										TO_CHAR(all_locations.location_id, 'FM00'), 
										': ', 
										all_locations.located)	
								WHEN location_type='staff' 
									THEN CONCAT(
										'STAFF', 
										TO_CHAR(all_locations.location_id, 'FM00'), 
										': ', 
										all_locations.firstname,
										' ',
										all_locations.lastname)	
							ELSE 'UNKOWN' 
						END AS "location"`
						),
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

async function getLastTransferLocation(asset_id) {
	try {	getLocationID = await 
		db.select('location_id')
			.from('asset_transfer')
			.where('asset_id', asset_id)
			.orderBy('transfer_date', 'desc')
			.orderBy('capture_time', 'desc')
			.limit(1);

		return getLocationID[0].location_id
	} catch(err) {
		throw err
	}
}

async function getLastTransferDate(asset_id) {
	const getDate = await db.select('transfer_date')
				.from('asset_transfer')
				.where('asset_id', asset_id)
				.orderBy('transfer_date', 'desc')
				.orderBy('capture_time', 'desc')
				.limit(1);
	return getDate[0]
}

async function addAssetTransfer( transfer_data ) {
	// Get date of last transaction - returned as object
	const lastTrDateObj = await getLastTransferDate(transfer_data.asset_id);

	// If nothing is returned, asset_id provided was invalid
	if(!lastTrDateObj) {
		throw 'Invalide Asset ID'
	}

	// If last transaction was before transaction being added, throw error
	const lastTrDate = new Date(lastTrDateObj.transfer_date);
	const newTrDate = new Date(transfer_data.transfer_date);

	if(newTrDate.getTime() <= lastTrDate.getTime()) {
		throw('Error: Transfer date before last transaction')
	}

	try {
		return await 
				db('asset_transfer')
					.insert(transfer_data, 'transfer_id')
	} catch(err) {
		if(Number(err.code) === 23503) {
			throw 'Asset ID does not exist'
		} else {
			throw err
		}
	}
}

async function test() {
	try {
		const dates = await getAssetTransfers('TQ5PTS92311')
		console.log(dates)
	} catch (err) {
		console.log(err)
	}
}

// test()

module.exports = {
	addAssetTransfer,
	getLastTransferLocation,
	getAssetTransfers,
}