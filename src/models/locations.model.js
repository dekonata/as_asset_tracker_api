// To Do: Create single access point for all Storage Types (cabinets, shelves, etc)

const db = require('../services/knex.js');

const { getUnusedIds } = require('../services/utils.js');

const LOCATION_TYPE = 'cabinet';
const ID_RANGE = 100;

const TEST_STORAGE = {
	location_type: 'cabinet2',
	description: 'Unit 5 Against wall',
	located: 'AS Offices, Unit 5'
};


async function getAllLocationsList(storage_type) {
	const allLocations = await 
		db.select(
				'location_type_id',
				'location_type',
				'location_id',
				db.raw(`TRIM(CONCAT(firstname, ' ', lastname, located)) as "location_detail"`),
			)
			.from('all_locations');

	return allLocations;
}



// Delete when complete
async function test() {
	const newStorage = await getAllLocationsList();
	console.log(newStorage)
}

// test();


module.exports = {
	getAllLocationsList,
}