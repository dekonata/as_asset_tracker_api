const express = require('express');

const {
	httpGetStaffLists,
	httpAddStaff,
} = require('./staff.controller.js');

const staffRouter = express.Router();

staffRouter.get('/stafflists/', httpGetStaffLists);
staffRouter.post('/add', httpAddStaff);

module.exports = staffRouter;