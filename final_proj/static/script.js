var width = 900;
var height = 600;

var init = function (){
  var dataset = []
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/all-country', true);
  xhr.addEventListener("load", function (e){
    var docs  = JSON.parse(xhr.responseText);
    make_circle(docs);
  });
  xhr.send(null);
}

var click_event = function (e){
  if(e.target.tagName == "BUTTON"){
    changeCircleRandom();
  }
}

var changeCircleRandom = function(){
  var svg = d3.select("svg");
  var circles = svg.selectAll("circle").transition()
  .attr("cx", function (d){return Math.random() * width; })
  .attr("cy", function (d){return Math.random() * height; });
}

var make_circle = function (docs){
  //console.log(docs);
  var svg = d3.select("#screen").append("svg");
  svg.attr("width", width).attr("height", height);
  var circles = svg.selectAll("circle").data(docs).enter().append("circle");
  circles
    .attr("cx", function (d, i){return Math.random() * width; })
    .attr("cy", function (d, i){return Math.random() * height;})
    .attr("r", "20px")
    .attr("fill","blue")
    .attr("stroke", "orange")
    .attr("stroke-width", "3px");

  var labels = svg.selectAll("text").data(docs).enter().append("text");
  labels.text(function(d){ return d['country_name'];})
    .attr("x", function(d){ return Math.random() * width;})
    .attr("y", function (d, i){ return Math.random() * height;});
    ;
}

document.addEventListener("click", click_event);
init();
