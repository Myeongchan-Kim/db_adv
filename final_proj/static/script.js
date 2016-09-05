var width = 900;
var height = 600;
var callNum = 3;
var dataset = {
  'country_name' : [],
  'x' : [],
  'y' :[],
  'size' :[],
  'color' :[],
  'maxX' : 0,
  'maxY' : 0,
  'minX' : 987654321,
  'minY' : 987654321,
};
var selected_country = ["Korea, Rep."];


var init = function (){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/all-country', true);
  xhr.addEventListener("load", function (e){
    var docs  = JSON.parse(xhr.responseText);
    dataset['country_name'] = docs.map(function(ele){return ele['country_name'];});
    var svg = d3.select("#screen").append("svg");
    svg.attr("width", width).attr("height", height);
    var elementEnter = svg.selectAll("circle").data(dataset['country_name']).enter();

    var labels = elementEnter.append("text");
    labels
    .attr("dx", 100)
    .attr("dy", 100)
    .text(function(d){
      if(selected_country.indexOf(d) >= 0)
        return d;
      else "";
    });

    var circles = elementEnter.append("circle");
    circles.text(function(d){return d;})
    .attr("cx", 0)
    .attr("cy", height)
    .attr("r", "2px")
    .attr("fill", function (d, i){
      return "rgba("+Math.floor(Math.random()*255)+","
      +Math.floor(Math.random()*255)+","
      +Math.floor(Math.random()*255)+","
      +0.6+")";
    })
    .attr("stroke", "orange")
    .attr("stroke-width", "2px");

  });
  xhr.send(null);
}

var click_event = function (e){
  //console.log(e.target.tagName);
  if(e.target.tagName == "BUTTON" && e.target.id === "changeButton"){
    changeCicle();
  }
  if(e.target.tagName == "BUTTON" && e.target.id === "playButton"){
    var itervalEvent = setInterval(function(){
      var year = document.getElementById("year_input");
      year.value = Number(year.value) + 1;
      changeCicle();
      if(year.value >= 2014) {
        var year = document.getElementById("year_input");
        year.value = 1960;
        clearInterval(itervalEvent)};
    }, 1200);
  }
  if(e.target.tagName == "BUTTON" && e.target.id === "loadData"){
    console.log("Load Data");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/indicator/economy_growth/GDP%20per%20capita%20%5C(current%20US%5C%24%5C)', true);
    xhr.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr.responseText);
      console.log("GDP-per-capita Load");
      load_gdbPerCapita(docs);
      callNum -= 1;
      if(callNum == 0) changeCicle();
    });
    xhr.send(null);

    //life_expect
    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'http://localhost:3000/indicator/health/Life%20expectancy%20at%20birth,%20total', true);
    xhr2.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr2.responseText);
      console.log("life_expect Load");
      load_life_expect(docs);
      callNum -= 1;
      if(callNum == 0) changeCicle();
    });
    xhr2.send(null);

    //life_expect
    var xhr3 = new XMLHttpRequest();
    xhr3.open('GET', 'http://localhost:3000/indicator/health/Population%2C%20total', true);
    xhr3.addEventListener("load", function (e){
      var docs  = JSON.parse(xhr3.responseText);
      console.log("Population Load");
      load_population(docs);
      callNum -= 1;
      if(callNum == 0) changeCicle();
    });
    xhr3.send(null);
  }
  if(e.target.tagName == "circle"){
    //console.log("circle!!");
  }
}

var load_gdbPerCapita = function(data){
  dataset['x'] = data.map(function(ele){return ele['value'];});
}

var load_life_expect = function(data){
  dataset['y'] = data.map(function(ele){return ele['value'];});
};

var load_population = function(data){
  dataset['size'] = data.map(function(ele){return ele['value'];});
};

var changeCircleRandom = function(){
  var svg = d3.select("svg");
  var circles = svg.selectAll("circle").transition()
  .attr("cx", function (d){return Math.random() * width; })
  .attr("cy", function (d){return Math.random() * height; });
}

var changeCicle = function(){
  var year = document.getElementById("year_input");
  console.log(year.value);
  make_circle(Number(year.value));
}

var make_circle = function (year){
  var yearData = [];
  dataset['maxX'] = 0;
  dataset['maxY'] = 0;
  dataset['minX'] = 987654321;
  dataset['minY'] = 987654321;
  for( i in dataset['country_name'])
  {
    var obj = {};
    obj['country_name'] = dataset['country_name'][i];
    for( j in dataset['x'][i]){
      if(parseInt(dataset['x'][i][j]['year']) == year){
        obj['x'] = Number(dataset['x'][i][j]['value']);
        break;
      }
    }
    for( j in dataset['y'][i]){
      if(parseInt(dataset['y'][i][j]['year']) == year){
        obj['y'] = Number(dataset['y'][i][j]['value']);
        break;
      }
    }
    for( j in dataset['size'][i]){
      if(parseInt(dataset['size'][i][j]['year']) == year){
        obj['size'] = Number(dataset['size'][i][j]['value']);
        break;
      }
    }
    //console.log(obj['country_name'] + " " +obj['x'] + " " + obj['y']);
    yearData.push(obj);
  }
  var scaleX = d3.scaleLog().domain([20, 80000]).range([0, width]);
  var scaleY = d3.scaleLinear().domain([30, 80]).range([height, 0]);
  var scaleSize = d3.scaleLog().domain([1000, 2000000000]).range([1, 30]);

  //change circle
  console.log(yearData[i]);
  var svg = d3.select("svg");
  var circles = svg.selectAll("circle").transition();
  circles
    .attr("cx", function (d, i){
      if(yearData[i]['x'])
        return scaleX(Number(yearData[i]['x']));
      else
        return d['x'];
      })
    .attr("cy", function (d, i){
      if(yearData[i]['y'])
        return scaleY(yearData[i]['y']);
      else
        return d['y'];
    })
    .attr("r", function(d,i){
      if(yearData[i]['size'])
        return "" + scaleSize(yearData[i]['size']) +"px";
      else
        return d['r'];
    });
  var labels = svg.selectAll("text").transition();
  labels
  .attr("dx", function (d, i){
    if(yearData[i]['x'])
      return scaleX(Number(yearData[i]['x']));
    else
      return d['x'];
    })
  .attr("dy", function (d, i){
    if(yearData[i]['y'])
      return scaleY(yearData[i]['y']);
    else
      return d['y'];
  })
}

var make_random_circle = function (dataset){
  //console.log(dataset);
  var svg = d3.select("#screen").append("svg");
  svg.attr("width", width).attr("height", height);
  var circles = svg.selectAll("circle").data(dataset).enter().append("circle");
  circles
    .attr("cx", function (d, i){return Math.random() * width; })
    .attr("cy", function (d, i){return Math.random() * height;})
    .attr("r", "20px")
    .attr("fill", function (d, i){
      return "rgb("+Math.floor(Math.random()*255)+","
      +Math.floor(Math.random()*255)+","
      +Math.floor(Math.random()*255)+")";
    })
    .attr("stroke", "orange")
    .attr("stroke-width", "3px");

  var labels = svg.selectAll("text").data(dataset).enter().append("text");
  labels.text(function(d){ return d['country_name'];})
    .attr("x", function(d){ return Math.random() * width;})
    .attr("y", function (d, i){ return Math.random() * height;});
    ;
}

document.addEventListener("click", click_event);
init();
