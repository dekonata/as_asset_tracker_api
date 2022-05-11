const fs = require('fs');
var stream = require('stream');

const {
	getLocationAssetsReport
} = require('../../models/reports.model.js');

async function httpGetLocationAssetsReport(req, res) {
	const reportObj = await getLocationAssetsReport()
	const reportJSON = JSON.stringify(reportObj)
	// const writer = fs.createWriteStream('test.txt')
	// writer.write(reportJSON);
	// writer.end();
	// res.status(200).download('test.txt');
	// var fileContents = Buffer.from(reportObj, "base64");

	// var readStream = new stream.PassThrough();
	// readStream.end(fileContents);

	res.set('Content-disposition', 'attachment; filename=' + 'TESTFILE.txt');
	res.set('Content-Type', 'text/plain');

  	res.status(200).send(reportObj); 
}

module.exports = {
	httpGetLocationAssetsReport
}