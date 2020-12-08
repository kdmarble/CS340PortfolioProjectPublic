var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'classmysql.engr.oregonstate.edu',
  user : 'cs340_abatej',
  password : '5225',
  database : 'cs340_abatej'
});
module.exports.pool = pool;
