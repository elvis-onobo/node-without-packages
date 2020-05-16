var fs = require('fs')
var path = require('path')

// container for the module
var lib = {}

// base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/')

// write data to a file
lib.create = function (dir, file, data, callback) {
	// open the file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			//convert the data to json string
			var stringData = JSON.stringify(data)

			// write to file and close the file
			fs.writeFile(fileDescriptor, stringData, function (err) {
				if (!err) {
					fs.close(fileDescriptor, function (err) {
						if (!err) {
							callback(false)
						} else {
							callback('Error closing new file')
						}
					})
				} else {
					callback('Error writing to new file')
				}
			})
		} else {
			callback('could not create new file, it may already exist')
		}
	})
}

// create function to read data from the file
lib.read = function (dir, file, callback) {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {
		callback(err, data)
	})
}

// write function to update the data in a file
lib.update = function (dir, file, data, callback) {
	// open the file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// convert data to string
			var stringData = JSON.stringify(data)

			// truncate the file, enables editing
			fs.truncate(lib.baseDir + dir + '/' + file + '.json', function (err) {
				if (!err) {
					// write to file and close it
					fs.writeFile(lib.baseDir + dir + '/' + file + '.json', stringData, function (err) {
						if (!err) {
							fs.close(fileDescriptor, stringData, function (err) {
								if (!err) {
									callback('false')
								} else {
									callback('Error closing file')
								}
							})
						} else {
							callback('Error writing to file')
						}
					})
				} else {
					callback('error truncating file')
				}
			})
		} else {
			callback('Could not open file for editing, may already exist')
		}
	})
}

//delete a file
lib.delete = function (dir, file, callback) {
	// unlink the file
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
		if (!err) {
			callback(false)
		} else {
			callback('Error deleting file')
		}
	})
}

// export the module
module.exports = lib