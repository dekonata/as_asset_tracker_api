const db = require('../services/knex.js');

const { getUnusedIds } = require('../services/utils.js');

const LOCATION_TYPE = 'cabinet';
const ID_RANGE = 100;

const TEST_STORAGE = {
	description: 'Second Cabinet',
	located: 'AS Offices, Unit 5'
};


async function getCabinetSuggestLists() {
	const usedIds = 
		await db.table('cabinet')
			.pluck('cabinet_id')
			.distinct('cabinet_id');

	const unusedIds = getUnusedIds(ID_RANGE, usedIds )

	const locatedList = 
		await db.table('cabinet')
			.pluck('located')
			.distinct('located');
	return {usedIds, unusedIds ,locatedList};
}


async function addCabinet(storage_data) {
	try {
		return await db.transaction(async trx => {
			const transfer_location = 
				await trx('transfer_location')
					.insert({
						location_type: LOCATION_TYPE
					}, 'location_id');

			const insert_data = Object.assign({}, storage_data, transfer_location[0]);

			const addStorage = 
				await trx('cabinet')
					.insert(
						insert_data, 'cabinet_id');

			return await addStorage;
		});
	} catch(err) {
		throw err;
	}
}

// Delete when complete
async function test() {
	const newStorage = await addCabinet(TEST_STORAGE);
	console.log(newStorage)
}

// test();

module.exports = {
	getCabinetSuggestLists,
	addCabinet,
}