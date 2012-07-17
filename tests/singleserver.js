
var config = require('../singleserver.json');

var mongodb = require('mongodb');
var mongoConnect = require('../mongo-connect');

/*!
 * Module dependencies.
 */
var testCase = require('nodeunit').testCase,
	nodeunit = require('nodeunit'),
	Db = mongodb.Db,
	Cursor = mongodb.Cursor,
	Collection = mongodb.Collection,
	Server = mongodb.Server;

var client = null;
var numberOfTestsRun = 0;

var timers = [];
var begin = function (callback) {
	timers[numberOfTestsRun] = {start: +new Date};
	callback();
};

/**
 * Retrieve the server information for the current
 * instance of the db client
 *
 * @ignore
 */
exports.setUp = function(callback) {
	var self = exports;
	mongoConnect.connect(config, function (dbclient) {
		client = dbclient;
		if(numberOfTestsRun == 0) {
			// If first test drop the db
			client.dropDatabase(function(err, done) {
				begin(callback);
			});
		} else {
			begin(callback);
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

	//var ms = +new Date - timers[numberOfTestsRun].start;
	//console.log('  Test', numberOfTestsRun, 'took ' + ms + 'ms')

	numberOfTestsRun += 1;
	// Close connection
	callback();
	client.close();
}

/**
 * Should insert 1000 documents and then fetch it back around 10000 times to calculate performance
 *
 * @ignore
 */
exports.basicInsert = function(test) {

	client.collection('basicInsert', function (err, collection) {
		if (err) {
			console.log(err);
			return;
		};
		var payload = 'world #' + Math.floor(Math.random() * 1e5);
		collection.insert({'hello': payload}, {safe:true}, function (err, result) {
			if (err) {throw err;}
			test.equal(result[0].hello, payload, 'what goes in, should come out');
			test.done();
		});
	});
}

exports.can_do_many_inserts = function(test) {
	var numTries = 10000;
	var counter = 0;
	var insert = function (num) {
		client.collection('doManyInserts', function (err, collection) {
			if (err) { throw err; }
			var random = 'random#' + Math.floor(Math.random() * 1e5);
			collection.insert({'random': random, 'notrandom': num}, {safe: true},  function(err, res) {
				counter++;
				if (counter === numTries) {
					collection.count(function (err, count) {
						test.equal(numTries, count, 'expect every insert to work');
						test.done();
					})
				}
			});
		});
	};
	for (var i=0; i<numTries; i++) {
		insert(i);
	}

};

exports.can_do_many_searches = function(test) {
	var numTries = 10000;
	var counter = 0;
	var find = function (num) {
		client.collection('doManyInserts', function (err, collection) {
			if (err) { throw err; }
			var needle = counter;//Math.floor(Math.random() * 10000);
			collection.find({'notrandom': needle}).toArray(function(err, res) {
				counter++;
				if (numTries === counter) {
					test.ok('hello')
					test.done();
				}
			});
		});
	};
	for (var i=0; i<numTries; i++) {
		find(i);
	}

};

exports.shouldNotCrash = function(test) {
	test.done();
}


