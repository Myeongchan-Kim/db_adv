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
  password : mongoPW
});

var mongoID = "next";
var mongoPW = "1234";

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
  var index = {
    'x' : /Life expectancy at birth, total \(years\)/,
    'y' : /GDP per capita \(current US\$\)/,
    'size' : /GDP \(current US\$\)/,
    'color' :  /Literacy rate, adult total /,
  };
  res.render('index', {indexObj : index, data:docs});
});

var findValue = function(db, id, callback ){
  console.log("result:"+JSON.stringify(id));
  db.collection('education').aggregate([
    {
        $match: {
            year : 1990,
            "country_code" : id
        }//match
    },
    {
        $lookup : {
          from: "country",
          localField: "country_code",
          foreignField : "_id",
          as :"country"
        }
    },
    {
        $lookup : {
          from: "indicator",
          localField: "indicator_code",
          foreignField : "_id",
          as :"indicator"
        }
    },
  ]).toArray(function(err, docs){
    console.log(docs);
    callback(docs);
  });// aggregate
};

var findMongoTest = function (country_name, callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
      if(err) throw err;
      var collection = db.collection('country');
      //console.log(collection);
      var country = {'country_name' : country_name};
      collection.findOne(country, function (err, docs){
        if(err) throw err;
        console.log(docs['_id']);
        var id = docs['_id'];
        findValue(db, id, callback);
      });
    }); // db auth
  }); //mongo connect
};

var findByIndicator = function (cond, callback){
//Rural land area where elevation is below 5 meters (% of total land area)
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
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

var findAllCountry = function (callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
      if(err) throw err;
      var collection = db.collection('country');
      collection.aggregate([{
          "$project" : { "country_name" : 1 , "region" : 1}
      }]).toArray(function(err, docs){
        callback(docs);
      });
    }); // auth
  }); //mongo connect
};

var getAllValueOfIndicator = function (collectionName,indicator_id, indicator_name,callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
      if(err) throw err;
      //make new table;
      var id_obj = new ObjectId(indicator_id);
      db.collection(collectionName).aggregate([
        { $match : { indicator_code : id_obj } },
        { $out : "_"+indicator_name }
      ]).toArray(function (err, docs){
        if(err) throw err;
        var country = db.collection('country');
        country.aggregate([
          {
              $lookup :{
                from: "_"+indicator_name,
                localField: "_id",
                foreignField : "country_code",
                as :"value"
              }
          },
          {
              $project :{
                  country_name : 1,
                  value :{
                      year : 1,
                      value : 1
                  }
              }
          }
        ]).toArray(function(err, docs){
          callback(docs);
        });
      });
    }); // auth
  }); //mongo connect
}

var loadIndicator = function (category, callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
      if(err) throw err;
      var collection = db.collection('indicator');
      collection.find({ "topic" : { "$regex" : RegExp(category)}})
      .toArray(function(err, docs){
        callback(docs);
      });
    }); // auth
  }); //mongo connect
};


app.get('/data-req', function(req, res){
  var condition = {
    indicator_name : 'Rural land area where elevation is below 5 meters (% of total land area)',
    year : 1990,
  }
  // findMongoTest('Argentina', function (docs){
  //   res.type('text/plain');
  //   res.send(JSON.stringify(docs));
  // });
  findByIndicator(condition, function (docs){
    res.type('text/plain');
    res.send(JSON.stringify(docs));
  });
});

app.get('/all-country', function(req, res){
  findAllCountry(function (docs){
    res.type('text/plain');
    res.send(JSON.stringify(docs));
  });
});

app.get('/indicator/:category', function(req, res){
  loadIndicator(req.params.category, function (docs){
    //console.log(req.params.category);
    res.type('text/plain');
    res.send(JSON.stringify(docs));
  });
});

app.get('/indicator/:category/:indicator_name', function(req, res){
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('indicator');
    //console.log(collection);
    var condition = {'name' : {$regex : new RegExp(req.params.indicator_name)} };
    collection.findOne(condition, function (err, docs){
      getAllValueOfIndicator(req.params.category, docs['_id'], docs['name'], function (docs){
        res.type('text/json');
        res.send(JSON.stringify(docs));
      });
    });
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
