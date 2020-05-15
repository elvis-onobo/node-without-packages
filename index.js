// dependencies
var http = require('http')
var url = require('url')
var stringDecoder = require('string_decoder').StringDecoder

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

	// get the headers as an object
	var headers = req.headers;

	// get payload there's if any
	var decoder = new stringDecoder('utf-8')
	var buffer = ""
	req.on('data', function (data) {
		buffer += decoder.write(data)
	})
	req.on('end', function () {
		buffer += decoder.end();

		// choose the handler the request should go to
		var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

		// construct the data object to send to handler
		var data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'headers': headers,
			'payload': buffer
		}

		// route the request to the handler specified in the router
		chosenHandler(data, function (statusCode, payload) {
			// use handler statusCode or 200
			statusCode = typeof (statusCode) == 'number' ? statusCode : 200

			// use handler payload or default to empty object
			payload = typeof (payload) == 'object' ? payload : {}

			// convert payload to string
			var payloadString = JSON.stringify(payload)

			// return the resource
			res.setHeader('Content-Type', 'application/json')
			res.writeHead(statusCode)
			res.end(payloadString)

			// log the request path
			console.log('Returning :', statusCode, payloadString)
		})

		// send the response
		//send the response
		// res.end('Hello World');

		// log the request path
		// console.log('Request received with payload ', buffer)
		// console.log('Request received with headers ', headers)
		// console.log('Request path ' + trimmedPath + ' method ' + method + ' query string param: ', queryStringObject);
	})
});

// start server and listen on port 3000
server.listen(3000, function () {
	console.log('server listening on port 3000');
})

// define the handlers
var handlers = {}

// sample handler
handlers.sample = function (data, callback) {
	// callback HTTP status code and payload object
	callback(406, { 'name': 'sample handler' })
}

handlers.notFound = function (data, callback) {
	callback(404)
}

var router = {
	'sample': handlers.sample
}