var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout:'main'}); //템플릿
var bodyparser = require('body-parser').urlencoded({extended:true}); //form 평문전달
var util = require('util');
var sql = require('mssql');
var config = {
    user: 'next',
    password: 'next!@#!@#',
    server: '127.0.0.1',
    database: 'test',
    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
};

app.use(bodyparser);
app.use('/static', express.static(__dirname + '/static'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  var query = util.format("SELECT * FROM test.dbo.book2 WHERE title LIKE '%%%s%%';", req.query.user_input);
  console.log(query);
  if(req.query.user_input){
    sql.connect(config, function(err) {
      console.log("Connection success");
      new sql.Request().query(query, function(err, recordset) {
          console.dir(recordset);
          res.render('book', {data:recordset});
      });
    });
    sql.on('error', function(err) {
    	console.log("Connection err.");
    });
  }
  else {
    res.render('book');
  }
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
