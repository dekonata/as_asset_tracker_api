const express = require('express');

const {
	httpGetAssetTransfers,
	httpAddAssetTransfer
} = require('./transfers.controller');

const transfersRouter = express.Router();

transfersRouter.get('/asset/:serialnumber', httpGetAssetTransfers);
transfersRouter.post('/add', httpAddAssetTransfer);


module.exports = transfersRouter;