var express = require('express');
var app = express();
var handlebars = require('express-handlebars')
.create({ defaultLayout:'main'}); //템플릿
var bodyparser = require('body-parser').urlencoded({extended:true}); //form 평문전달
var util = require('util');
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  database : 'food',
  user : 'guest',
  password : '1234'
});
app.use(bodyparser);
app.use('/static', express.static(__dirname + '/static'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  var query = util.format("select * from store_list where store_name like \"%%%s%%\";", req.query.user_input);
  console.log(req.query);
  pool.query(query, function(err, rows, fields) {
    if (err) throw err;
    console.log((rows));
    res.render('index', {data: rows});
  });
});

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
