const db = require('../services/knex.js');

const { getUnusedIds } = require('../services/utils.js');

const LOCATION_TYPE = 'Staff'
const ID_RANGE = 100

const TEST_STAFF = {
	firstname: "Cabby",
	lastname: "Packs",
};

async function getStaffSuggestLists() {
	const usedIds = 
		await db.table('staff')
			.pluck('staff_id')
			.distinct('staff_id');

	const unusedIds = getUnusedIds(ID_RANGE, [...usedIds, 0 ]);

	return {usedIds, unusedIds};
}

async function addStaff(staff_data) {
	try {
		return await db.transaction(async trx => {
			const transfer_location = 
				await trx('transfer_location')
					.insert({
						location_type: LOCATION_TYPE
					}, 'location_id');

			const insert_data = Object.assign({}, staff_data, transfer_location[0]);

			const staff = 
				await trx('staff')
					.insert(insert_data, 'staff_id');

			return await staff;
		});
	} catch(err) {
		throw err;
	}
}

async function test() {
	const newStaff = await getStaffSuggestLists(TEST_STAFF);
	console.log(newStaff)
}

// test();

module.exports = {
	getStaffSuggestLists,
	addStaff,
}