const express = require('express');

const {
	httpGetAllLocationsList,
	httpGetOneLocation,
} = require('./locations.controller.js');

const locationsRouter = express.Router();

locationsRouter.get('/all', httpGetAllLocationsList);
locationsRouter.get('/location/:locationsid', httpGetOneLocation);

module.exports = locationsRouter;