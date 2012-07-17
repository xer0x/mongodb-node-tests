
// Connect to MongoDB and share that connection.

var mongodb = require('mongodb');

var connect = function (config, callback) {
  var user = config.username;
  var password = config.password;
  var database = config.database || 'test';
  var serverOptions = {auto_reconnect: true, pool: 4};

  var server;
  if (config.servers) {
    var serverSet = config.servers.map(function(server) {
			return new mongodb.Server(server.host, server.port || 27017, serverOptions);
    });
    var replSetOptions = {
      rs_name: 'joyent',
      read_secondary: false, // default: false -- do we need to set slaveOk() to work?
      socketOptions: {timeout: 1 * 1000, keepAlive: 0, noDelay: true}
    };
    server = new mongodb.ReplSetServers(serverSet, replSetOptions);
  } else {
    server = new mongodb.Server(config.host || '127.0.0.1', config.port || 27017, serverOptions);
  } 
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
