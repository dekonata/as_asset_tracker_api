const express = require('express');

const { 
	httpGetAllAssets, 
	httpGetAllTypeAssets,
	httpGetOneAsset,
	httpAddAsset,
	httpGetAssetLists,
	httpEditAsset,
		} = require('./assets.controller');

const assetsRouter = express.Router();

assetsRouter.get('/all', httpGetAllAssets);
assetsRouter.get('/alltype/:asset_type', httpGetAllTypeAssets);
assetsRouter.get('/asset/:serialnumber', httpGetOneAsset);
assetsRouter.get('/assetlists', httpGetAssetLists);
assetsRouter.post('/add', httpAddAsset);
assetsRouter.put('/edit', httpEditAsset);

module.exports = assetsRouter