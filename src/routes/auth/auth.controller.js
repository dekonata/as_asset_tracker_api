const { getOneStaff } = require('../../models/staff.model.js')

async function httpAuth(req, res) {
	const staff_id = req.session.passport.user
	const user = await getOneStaff(staff_id)
    res.status(200).json(user)
};

module.exports = {
	httpAuth,
}
