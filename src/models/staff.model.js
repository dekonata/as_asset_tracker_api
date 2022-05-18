const db = require('../services/knex.js');

const { getUnusedIds } = require('../services/utils.js');

const LOCATION_TYPE = 'Staff'
const ID_RANGE = 30

const TEST_STAFF = {
	firstname: "Cabby",
	lastname: "Packs",
};

const TEST_EDIT_STAFF = {
	staff_id: 5,
	payload: {
		firstname: 'Bemeny'
	}
};



async function getOneStaff(staff_id) {
	try {
		const oneStaffQuery = 
			await db.select(
				'staff_id',
				db.raw(`CONCAT('STAFF', TO_CHAR(staff_id, 'FM00')) AS parsed_id`),
				'location_id',
				'firstname',
				'lastname',
				)
				.from('staff')
				.where('staff_id', staff_id);
	
		return oneStaffQuery[0];
	} catch(err) {
		throw err;
	}
}


async function getStaffSuggestLists() {
	const staff = 
		await db.select(
			db.raw(`CONCAT('STAFF', TO_CHAR(staff_id, 'FM00'), ': ', firstname, ' ', lastname) AS name`),
			db.raw(`CONCAT('STAFF', TO_CHAR(staff_id, 'FM00')) AS id`),
			'staff_id'
			)
			.from('staff');

	const usedNumbIds = staff.map(staff => staff.staff_id);
	const staffList = staff.map(staff => staff.name);
	const usedIds = staff.map(staff => staff.id);
	const unusedIds = getUnusedIds(ID_RANGE, [...usedNumbIds, 0 ])
						.map(idnum => `STAFF${idnum.toString().padStart(2, '0')}`);

	return {staffList, usedIds, unusedIds};
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


async function editStaff(edit_data) {
	try {
		return await db('staff')
			.where('staff_id', edit_data.staff_id)
			.update(edit_data.payload, ['location_id']);
	} catch(err) {
		throw err;
	}
}


async function test() {
	const newStaff = await getOneStaff(5);
	console.log(newStaff)
}

// test();

module.exports = {
	getOneStaff,
	getStaffSuggestLists,
	addStaff,
	editStaff,
}