
// Connect to MongoDB and share that connection.

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
      var authsrc = user === 'admin' ? clientref.admin() : clientref; // TODO: is this neeeded?
      authsrc.authenticate(user, password, function (error, result) {
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
