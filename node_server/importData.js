
var util = require('util');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://next:1234@125.209.194.219:27017/world';
//var url = 'mongodb://localhost:27017/'
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  database : 'world',
  user : 'guest',
  password : '1234'
});
console.log("Mysql Connected.");

MongoClient.connect(url, function(err, db){
  if(err) throw err;
  console.log("Mongo Connection success.");
});
