var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://125.209.194.219:27017/world';
var url = 'mongodb://localhost:27017/world'
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
var collectionList =[];

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
          from: "_META_country",
          localField: "country_code",
          foreignField : "_id",
          as :"country"
        }
    },
    {
        $lookup : {
          from: "_META_indicator",
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
      var collection = db.collection('_META_country');
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
      var collection = db.collection('_META_indicator');
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
      var collection = db.collection('_META_country');
      collection.aggregate([{
          "$project" : { "country_name" : 1 , "region" : 1}
      }]).toArray(function(err, docs){
        callback(docs);
      });
    }); // auth
  }); //mongo connect
};

var findAllCategory = function(callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
      if(err) throw err;
      var collection = db.collections(function(err, docs){
        if(err) throw err;
        callback(docs)
      });
    }); // auth
  }); //mongo connect
}

var getAllValueOfIndicator = function (db, collectionName,indicator_id, indicator_name,callback){
    var id_obj = new ObjectId(indicator_id);
    console.log(collectionName);
    var newCollectionName = "_" + indicator_name.replace(/ |\(|\$\)/gi, '');
    db.collection(collectionName).aggregate([
      { $match : { indicator_code : id_obj } },
      { $out : newCollectionName }
    ]).toArray(function (err, docs){
      if(err) throw err;
      var country = db.collection('_META_country');
      country.aggregate([
        {
            $lookup :{
              from: newCollectionName,
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
        //console.log(collectionName+docs.length);
        if(docs == null || docs.length == 0) return;
        callback(docs);
      });
    }); // $out new temp collection
}

var getAllCollectionResultOfAllindicator = function (db, i,indicator_id, indicator_name,callback){
  if(i >= collectionList.length) return;
  collectionName = collectionList[i];
  var id_obj = new ObjectId(indicator_id);
  var newCollectionName = "_" + indicator_name.replace(/ |\(|\$\)/gi, '');
  db.collection(collectionName).aggregate([
    { $match : { indicator_code : id_obj } },
    { $out : newCollectionName }
  ]).toArray(function (err, docs){
    var country = db.collection('_META_country');
    country.aggregate([
      {
          $lookup :{
            from: newCollectionName,
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
      //console.log(collectionName+docs.length);
      if(docs[0].value.length == 0){
        getAllCollectionResultOfAllindicator(db, i+1, indicator_id, indicator_name, callback);
      }else{
        callback(docs);
      }
    });

  });
};

var loadIndicator = function (category, callback){
  MongoClient.connect(url, function(err, db){
    db.authenticate(mongoID, mongoPW, function (err, res){
      if(err) throw err;
      var collection = db.collection('_META_indicator');
      collection.find({ "topic" : { "$regex" : RegExp(category)}})
      .toArray(function(err, docs){
        callback(docs);
      });
    }); // auth
  }); //mongo connect
};

findAllCategory(function (docs){
  for(i in docs){
    var collection_name = docs[i].s.name;
    if(collection_name.substring(0,1) != "_" && !collection_name.includes("."))
      collectionList.push(collection_name);
  }
});


app.use(bodyparser);
app.use('/static', express.static(__dirname + '/static'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res){
  var default_index = {
    'x' : {
      group : "economy_growth",
      indicator_name : "GDP per capita (current US$)",
      min: 20,
      max:80000,
    },
    'y' : {
      group : "health",
      indicator_name : "Life expectancy at birth, total (years)",
      min:30,
      max:85,
    },
    'size' : {
      group : "health",
      indicator_name : "Population, total",
      min:1000,
      max: 2000000000,
    },
    // 'bright' :  {
    //   group : "education",
    //   indicator_name :  "Literacy rate, adult total ",
    // },
  };
  //console.log(collectionList);
  res.render('index', {indexObj : default_index, categoryList: collectionList});
});

app.get('/test', function(req, res){
  for(i in collectionList){
    if(i<5) continue;
    res.type('text/plain');
    res.send(i);
  }
});

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

app.get('/all-category', function(req, res){
  findAllCategory(function (docs){
    var collections = [];
    for(i in docs){
      var collection_name = docs[i].s.name;
      console.log(collection_name.substring(0,1));
      if(collection_name.substring(0,1) != "_" && !collection_name.includes("."))
        collections.push(collection_name);
    }
    res.type('text/plain');
    res.send(JSON.stringify(collections));
  });
})

app.get('/all-category/:indicator_name', function(req, res){
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('_META_indicator');
    var condition = {'name' : req.params.indicator_name };
    collection.findOne(condition, function (err, docs){
      if(err) throw err;
      // indicator  id : docs['_id']
      // indicator name : docs['name']
      if(docs == null) {
        console.log("[Data load fail] condition:"+JSON.stringify(condition));
        return;
      }
      getAllCollectionResultOfAllindicator(db, 0 ,docs['_id'], docs['name'], function(data){
        if(data == null) return;
        res.type('text/json');
        res.send(JSON.stringify(data));
      });
    });
  });
});

app.get('/indicator/:category', function(req, res){
  loadIndicator(req.params.category, function (docs){
    //console.log(req.params.category);
    res.type('text/plain');
    res.send(JSON.stringify(docs));
  });
});

app.get('/search/indicator/:query_string', function (req, res){
  res.type('text/plain');
  res.send(JSON.stringify(req.params.query_string));
})

app.get('/indicator/:category/:indicator_name', function(req, res){
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('_META_indicator');
    //var str = req.params.indicator_name.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    //console.log(str);
    var condition = {'name' : req.params.indicator_name };
    //var condition = {'name' : {$regex : new RegExp(str)} };
    collection.findOne(condition, function (err, docs){
      if(err) throw err;
      //console.log(docs);
      getAllValueOfIndicator(db, req.params.category, docs['_id'], docs['name'], function (docs){
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
