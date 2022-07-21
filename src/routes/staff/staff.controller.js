const {
	getOneStaff,
	getStaffSuggestLists,
	addStaff,
	editStaff
} = require('../../models/staff.model.js');

const {
	getLocationAssets,
	getLocationAccessories,
} = require('../../models/locations.model.js');

async function httpGetStaffLists(req, res) {
	return res.status(200).json(await getStaffSuggestLists());
}

async function httpAddStaff(req, res) {

	try {
		const staff_data = req.body;
		staff_data['email'] = staff_data['email'].toLowerCase();

		const addedStaff = await addStaff(staff_data);
		return res.status(201).json(addedStaff);
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function httpGetOneStaff(req, res) {
	try {

		const staff_id = req.params.staffid;
		const staffDetail = await getOneStaff(staff_id);
		const locationId = await staffDetail?.location_id;
		const assetList = await getLocationAssets(locationId);
		const accList = await getLocationAccessories(locationId);

		const staffData = Object.assign({}, staffDetail, {assets: assetList}, {acc: accList});

		return res.status(200).json(staffData);
	} catch(err) {
		console.log(err);
		return res.status(400).json('Error Getting Staff Data');
	}
}

async function httpEditStaff(req, res) {
	try {
		const edit_data = req.body;
		const edit = await editStaff(edit_data);
		return res.status(200).json('Staff edit complete');
	} catch(err) {
		return res.status(400).json(err);
	}
}

module.exports = {
	httpGetStaffLists,
	httpAddStaff,
	httpGetOneStaff,
	httpEditStaff
}