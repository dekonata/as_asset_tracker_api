const db = require('../services/knex.js');

const { getUnusedIds } = require('../services/utils.js');

const LOCATION_TYPE = 'shelf';
const ID_RANGE = 100;

const TEST_STORAGE = {
	description: 'Cabinet agains wall in Unit 4',
	located: 'AS Offices, Unit 4'
}

async function getShelfSuggestLists() {
	const usedIds = 
		await db.table('shelf')
			.pluck('shelf_id')
			.distinct('shelf_id');

	const unusedIds = getUnusedIds(ID_RANGE, usedIds )

	const locatedList = 
		await db.table('shelf')
			.pluck('located')
			.distinct('located');
	return {usedIds, unusedIds ,locatedList};
}

async function getOneShelfId(location_type_id) {
	try {
		const getLocationIdQuery = 
			await db.select('location_id')
				.from('shelf')
				.where('shelf_id', location_type_id);

		return getLocationIdQuery[0].location_id;
	} catch(err) {
		throw(err);
	}
}

async function addShelf(storage_data) {
	try {
		return await db.transaction(async trx => {
			const transfer_location = 
				await trx('transfer_location')
					.insert({
						location_type: LOCATION_TYPE
					}, 'location_id');

			const insert_data = Object.assign({}, storage_data, transfer_location[0]);

			const addStorage = 
				await trx('shelf')
					.insert(
						insert_data, 'shelf_id');

			return await addStorage;
		});
	} catch(err) {
		throw err;
	}


}

async function test() {
	const newStorage = await getShelfSuggestLists();
	console.log(newStorage)
}

// test();

module.exports = {
	getShelfSuggestLists,
	getOneShelfId,
	addShelf,
}