// dependencies
var http = require('http')
var url = require('url')

// setup server response
var server = http.createServer(function (req, res) {

	// get the url and parse it
	var parsedUrl = url.parse(req.url, true)

	// get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, "");

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// get the HTTP method from req object
	var method = req.method.toLowerCase();

	//send the response
	res.end('Hello World');

	// log the request path
	console.log('Request path ' + trimmedPath + ' method ' + method + ' query string param: ', queryStringObject);
});

// start server and listen on port 3000
server.listen(3000, function () {
	console.log('server listening on port 3000');
})
