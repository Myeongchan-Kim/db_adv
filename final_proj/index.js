var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://125.209.194.219:27017/world';
//var url = 'mongodb://localhost:27017/'
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  database : 'world',
  user : 'guest',
  password : '1234'
});

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout:'main'}); //템플릿
var bodyparser = require('body-parser').urlencoded({extended:true}); //form 평문전달
var util = require('util');

app.use(bodyparser);
app.use('/static', express.static(__dirname + '/static'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(function (req, res){
  res.type('text/plain');
  res.status('404');
  res.send('404 - Page not found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status('500');
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function (){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
