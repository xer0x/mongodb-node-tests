var mongodb = process.env['TEST_NATIVE'] != null ? require('mongodb').native() : require('mongodb').pure();
var useSSL = process.env['USE_SSL'] != null ? true : false;
var native_parser = (process.env['TEST_NATIVE'] != null);

/*!
 * Module dependencies.
 */
var testCase = require('nodeunit').testCase,
	nodeunit = require('nodeunit'),
	Db = mongodb.Db,
	Cursor = mongodb.Cursor,
	Collection = mongodb.Collection,
	Server = mongodb.Server;

var MONGODB = 'stability_tests';
var client = null;
var numberOfTestsRun = 0;

/**
 * Retrieve the server information for the current
 * instance of the db client
 *
 * @ignore
 */
exports.setUp = function(callback) {
	var self = exports;
	client = new Db(MONGODB, new Server("127.0.0.1", 27017, {auto_reconnect: true, poolSize: 4, ssl:useSSL}), {native_parser: (process.env['TEST_NATIVE'] != null)});
	client.open(function(err, db_p) {
		if(numberOfTestsRun == 0) {
			// If first test drop the db
			client.dropDatabase(function(err, done) {
				callback();
			});
		} else {
			return callback();
		}
	});
}

/**
 * Retrieve the server information for the current
 * instance of the db client
 *
 * @ignore
 */
exports.tearDown = function(callback) {
	var self = this;
	numberOfTestsRun += 1;
	// Close connection
	client.close();
	callback();
}

/**
 * Should insert 1000 documents and then fetch it back around 10000 times to calculate performance
 *
 * @ignore
 */
exports.basicInsert = function(test) {

	test.done();
}

exports.shouldNotCrash = function(test) {
	test.done();
}





