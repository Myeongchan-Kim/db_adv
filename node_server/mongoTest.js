var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://125.209.194.219:27017/company';
//var url = 'mongodb://localhost:27017/'

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

var mongoSearch = function( url, collectionName, condition, callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate('next', '12345678', function (err, res){
      if(err) throw err;
      var collection = db.collection(collectionName);
      collection.find(condition).toArray(function(err, docs){
        if(err) throw err;
        //console.log(docs);
        db.close();
        callback(docs);
      });
    });
  });
}

app.get('/', function(req, res){
  mongoSearch(url,'employee', null, function (docs){
    res.render('employee', {data: docs});
  });
});

app.post('/', function(req, res){
  var condition = {name:{$regex:req.body.user_input}};
  mongoSearch(url,'employee', condition, function (docs){
    res.render('employee', {data: docs});
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
