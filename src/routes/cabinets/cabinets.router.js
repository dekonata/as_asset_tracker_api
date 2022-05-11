const express = require('express');

const {
	httpGetCabinetLists,
	httpAddCabinet,
} = require('./cabinets.controller.js');

const cabinetsRouter = express.Router();

cabinetsRouter.get('/cabinetLists/', httpGetCabinetLists);
cabinetsRouter.post('/add', httpAddCabinet);

module.exports = cabinetsRouter;