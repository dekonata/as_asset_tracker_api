const express = require('express');

const {
	httpGetAllLocationsList,
} = require('./locations.controller.js');

const locationsRouter = express.Router();

locationsRouter.get('/all', httpGetAllLocationsList);

module.exports = locationsRouter;