
// container for all environments
var environments = {}

// staging default env
environments.staging = {
	'port': 3000,
	'envName': 'staging'
}

// production env
environments.production = {
	'port': 5000,
	'envName': 'production'
}

// Determine current env
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : null;

var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = environmentToExport