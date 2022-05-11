const express = require('express');

const { 
	httpGetAllAssets, 
	httpGetOneAsset,
	httpAddAsset,
	httpGetAssetLists,
	httpEditAsset,
		} = require('./assets.controller');

const assetsRouter = express.Router();

assetsRouter.get('/all', httpGetAllAssets);
assetsRouter.get('/asset/:serialnumber', httpGetOneAsset);
assetsRouter.get('/assetlists', httpGetAssetLists);
assetsRouter.post('/add', httpAddAsset);
assetsRouter.put('/edit', httpEditAsset);

module.exports = assetsRouter