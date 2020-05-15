// dependencies
const http = require('http')

// setup server response
var server = http.createServer(function (req, res) {
	res.end('Hello World');
});

// start server and listen on port 3000
server.listen(3000, function () {
	console.log('server listening on port 3000');
})
