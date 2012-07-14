
// Connect to MongoDB and share that connection.

// FIXME: the runCallbacks & connection sharing stuff here is useless
//        {pool: 4} does the job better.

var mongodb = require('mongodb');

var connect = function (config, callback) {
  var host = config.host || '127.0.0.1';
  var user = config.username;
  var password = config.password;
  var port = config.port || 27017;
  var database = config.database || 'test';

  var server = new mongodb.Server(host, port, {auto_reconnect: true, pool: 4});
  db = new mongodb.Db(database, server, {});

  db.open(function (error, clientref) {
    if (error) throw error;
    if (user && password) {
console.log('user: ' + user);
console.log('pass: ' + password);
console.log('database: ' + database);
      clientref.authenticate(user, password, function (error, result) {
        if (error) { console.warn(error); return; }
        if (result == false) { console.warn(result); return; }
        callback(clientref);
      });
    } else {
      callback(clientref);
    }
  });
};


module.exports = {
  connect: connect
};
