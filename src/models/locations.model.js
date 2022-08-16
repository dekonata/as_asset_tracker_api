// To Do: Create single access point for all Storage Types (cabinets, shelves, etc)
const db = require('../services/knex.js');

const { getUnusedIds } = require('../services/utils.js');
const {queryParsedLocations} = require('../services/utils.js');

const LOCATION_TYPE = 'cabinet';
const ID_RANGE = 100;

const DISPOSAL = {
	location: "DISPOSAL", 
	location_type_id: 1, 
	location_type: "disposal", 
	location_id: 99, 
	location_detail: "DISPOSAL"
}

const TEST_STORAGE = {
	location_type: 'cabinet2',
	description: 'Unit 5 Against wall',
	located: 'AS Offices, Unit 5'
};


async function getAllLocationsList() {
	const allLocations = await 
		db.select(
				db.raw(queryParsedLocations()),				
				'location_type_id',
				'location_type',
				'location_id',
				db.raw(`TRIM(CONCAT(firstname, ' ', lastname, located)) as "location_detail"`),
			)
			.from('all_locations');

	return allLocations;
}

async function getLocationIDByTypeID(location_type, location_type_id) {
	try {
		const locationIDQuery = await
			db.pluck('location_id')
				.from('all_locations')
				.where({
					location_type,
					location_type_id
				});

	return locationIDQuery[0];
	} catch(err) {
		throw(err);
	}

}

async function getLocationSuggestlists() {
	const locationsQuery = await
		db.select(
			'location_id',
			db.raw(queryParsedLocations()),	
		)
		.from('all_locations')
		.whereNot('location_type', 'staff')

	const allLocations = locationsQuery.map(location => [location.location, location.location_id]);

	return allLocations
}

async function getOneLocation(location_id) {
	try {
		const locationQuery = await 
			db.select(
				'location_type_id',
				'location_type',
				'located',
				'description'
				)
				.from('all_locations')
				.where('location_id', location_id)



		return locationQuery[0]
	} catch(err) {
		throw(err)
	}
}

async function getLocationAssets(location_id) {
	try {
		const locAssetQuery = await
			db.select(
				'all_asset_locations.asset_id',
				'all_asset_locations.transfer_date',
				'all_assets.asset_type',
				'all_assets.serialnumber',
				db.raw(`CONCAT(make, ': ', model) AS model`),
				'all_assets.asset_condition'
			) 
			.from('all_assets')
			.leftJoin('all_asset_locations', 'all_assets.asset_id', 'all_asset_locations.asset_id')
			.where('location_id', location_id)

		return locAssetQuery;
	} catch (err) {
		throw err
	}
}

async function getLocationAccessories(location_id) {
	try {
		const locAccQuery = await
			db.select(
				'all_asset_locations.location_id',
				'accessory.asset_id',
				'all_asset_locations.transfer_date',
				'accessory.accessory_id',
				db.raw(`CONCAT('ACC', TO_CHAR(accessory.accessory_id, 'FM00')) as parsedid`),
				'accessory.accessory_type',
				'accessory.make',
				'accessory.description'
			) 
			.from('accessory')
			.leftJoin('all_asset_locations', 'accessory.asset_id', 'all_asset_locations.asset_id')
			.where('location_id', location_id)


		return locAccQuery
	} catch (err) {
		throw err
	}
}




// Delete when complete
async function test() {
	const newStorage = await getAllLocationsList('staff', 01);
	console.log(newStorage)
}

// test();


module.exports = {
	getAllLocationsList,
	getLocationIDByTypeID,
	getLocationSuggestlists,
	getOneLocation,
	getLocationAssets,
	getLocationAccessories,
}