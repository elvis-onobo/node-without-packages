// node dependencies
var http = require('http')
var https = require('https')
var url = require('url')
var stringDecoder = require('string_decoder').StringDecoder
var fs = require('fs')

// local files
var config = require('./config')
var _data = require('./lib/data')
dfsdgfgh
// testing _data.create
_data.update('test', 'newFile', { 'Elvis': 'Onobo' }, function (err) {
	console.log('There was an error', err)
})

// Instantiate HTTP server
var httpServer = http.createServer(function (req, res) {
	unifiedServer(req, res)
});

// start server
httpServer.listen(config.httpPort, function () {
	console.log(`server listening on port ${config.httpPort}`);
})

// Instantiate HTTPS server
var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
}

var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
	unifiedServer(req, res)
});

// start HTTPS server
httpsServer.listen(config.httpsPort, function () {
	console.log(`server listening on port ${config.httpsPort}`);
})

// Unify both http and https login
var unifiedServer = function (req, res) {
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
}

// define the handlers
var handlers = {}

// ping handler
handlers.ping = function (data, callback) {
	callback(200)
}

handlers.notFound = function (data, callback) {
	callback(404)
}

var router = {
	'ping': handlers.ping
}