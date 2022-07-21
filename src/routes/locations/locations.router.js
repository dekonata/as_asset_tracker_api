const express = require('express');

const {
	httpGetAllLocationsList,
	httpGetLocationSuggestlists,
	httpGetOneLocation,
} = require('./locations.controller.js');

const locationsRouter = express.Router();

locationsRouter.get('/all', httpGetAllLocationsList);
locationsRouter.get('/locationslists', httpGetLocationSuggestlists);
locationsRouter.get('/:locationsid', httpGetOneLocation);

module.exports = locationsRouter;