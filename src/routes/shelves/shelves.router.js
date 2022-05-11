const express = require('express');

const {
	httpGetShelfLists,
	httpAddShelf,
} = require('./shelves.controller.js');

const shelvesRouter = express.Router();

shelvesRouter.get('/shelflists/', httpGetShelfLists);
shelvesRouter.post('/add', httpAddShelf);

module.exports = shelvesRouter;