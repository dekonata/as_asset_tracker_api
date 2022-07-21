const http = require('http');
const fs = require('fs');
const path = require('path')

require('dotenv').config();


const app = require('./app');

const PORT = process.env.PORT;

// const server = https.createServer({
// 	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
// 	cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
// },app);

const server = http.createServer(app)

server.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`)
});