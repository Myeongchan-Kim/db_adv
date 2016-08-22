var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://125.209.194.219:27017/world';
//var url = 'mongodb://localhost:27017/'
var ObjectId = require('mongodb').ObjectId;
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

app.get('/', function (req, res){
  res.render('index', {});
});

var findMongoTest = function (callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate('next', '1234', function (err, res){
      if(err) throw err;
      var collection = db.collection('country');
      //console.log(collection);
      var country = {'country_name' : 'Aruba'};
      collection.findOne(country, function (err, docs){
        console.log(docs);
        var condition = ({year:1980, country_code:docs['_id']});
        console.log(condition);

        db.collection('education_new').find(condition).toArray(function(err, docs){
          if(err) throw err;
          db.close();
          callback(docs);
        });
      }); //find condition
    }); // db auth
  }); //mongo connect
};

var findByIndicator = function (cond, callback){
//Rural land area where elevation is below 5 meters (% of total land area)
  MongoClient.connect(url, function(err, db){
    db.authenticate('next', '1234', function (err, res){
      if(err) throw err;
      var collection = db.collection('indicator');
      //console.log(collection);
      var indicator = {'name' : cond.indicator_name };
      console.log(indicator);
      collection.findOne(indicator, function (err, docs){
        console.log(docs);
        var condition = ({year:cond.year, indicator_code:docs['_id']});
        console.log(condition);
        db.collection('environment_new').find(condition).toArray(function(err, docs){
          if(err) throw err;
          db.close();
          callback(docs);
        });
      }); //find condition
    }); // db auth
  }); //mongo connect
};


app.get('/data-req', function(req, res){;
  var condition = {
    indicator_name : 'Rural land area where elevation is below 5 meters (% of total land area)',
    year : 1990,
  }
  findByIndicator( condition, function (docs){
    res.type('text/plain');
    res.send(JSON.stringify(docs));
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