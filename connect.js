var mysql = require('mysql');
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

var pool = mysql.createPool(
  {
  host : 'localhost',
  user : 'root',
  password : 'aativa',
  database : 'shayer'
  }
);

var getConnection = () => {
  return pool.getConnectionAsync().disposer((connection) => {
    return connection.destroy();
  });
};

var query = (command) => {
  return using(getConnection() , (connection) => {
    return connection.queryAsync(command);
  });
};

module.exports = {
  query
};


// var mysql = require('mysql');
//
// var con = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   password : 'aativa',
//   database: 'shayer'
// });
//
// con.connect((error) => {
//  if(error){
//    console.log('Error connecting to db');
//    return;
//  }
//    console.log('Successfully connected');
// });
//
// module.exports = {
//   con
// };
