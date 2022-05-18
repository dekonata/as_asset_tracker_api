const express = require('express');

const {
	httpGetStaffLists,
	httpAddStaff,
	httpGetOneStaff,
	httpEditStaff
} = require('./staff.controller.js');

const staffRouter = express.Router();

staffRouter.get('/stafflists/', httpGetStaffLists);
staffRouter.get('/one/:staffid', httpGetOneStaff);
staffRouter.post('/add', httpAddStaff);
staffRouter.put('/edit', httpEditStaff);

module.exports = staffRouter;