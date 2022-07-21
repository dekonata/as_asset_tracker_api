const fs = require('fs');
const path = require('path')
const { stringify } = require('csv-stringify')
const { pipeline } = require('stream/promises')



const {
	getAssetLocationsReportStream
} = require('../../models/reports.model.js');

async function httpGetLocationAssetsReport(req, res) {
	res.set('Content-disposition', 'attachment; filename=' + 'TESTFILE.csv')
	try {	
		const options = {
		delimiter: ',',
		columns: [
			{key: 'asset_type'}, 
			{key: 'location_id'}, 
			{key: 'transfer_id'}, 
			{key: 'location_type_id'}, 
			{key: 'location_detail'}, 
			{key: 'asset_type'}
		],
		header: true
		}
		const stringifier = stringify(options) 	

		return await pipeline(
			await getAssetLocationsReportStream(),
			stringifier,
			res
		)

	} catch(err) {
		console.log(err)
		res.status(400).json('Could not generate report')
	}
}


module.exports = {
	httpGetLocationAssetsReport
}