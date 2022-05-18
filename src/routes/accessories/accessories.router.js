const express = require('express');

const { 
	httpGetAllAccessories,
	httpGetOneAccessory,
	httpEditAccessory,
		} = require('./accessories.controller.js');

const accessoriesRouter = express.Router();

accessoriesRouter.get('/all', httpGetAllAccessories);
accessoriesRouter.get('/one/:accid', httpGetOneAccessory);
accessoriesRouter.put('/edit', httpEditAccessory);

module.exports = accessoriesRouter;