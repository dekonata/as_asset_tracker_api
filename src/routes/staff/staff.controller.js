const {
	getStaffSuggestLists,
	addStaff,
} = require('../../models/staff.model.js');

async function httpGetStaffLists(req, res) {
	return res.status(200).json(await getStaffSuggestLists());
}

async function httpAddStaff(req, res) {
	const staff_data = req.body;
	try {
		const addedStaff = await addStaff(staff_data);
		return res.status(201).json(addedStaff);
	} catch (err) {
		return res.status(400).json(err);
	}
}

module.exports = {
	httpGetStaffLists,
	httpAddStaff,
}