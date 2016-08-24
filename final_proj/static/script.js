
var dataset = []
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/all-country', true);
xhr.addEventListener("load", function (e){
  var docs  = JSON.parse(xhr.responseText);
  init(docs);
});
xhr.send(null);

var init = function (docs){
  //console.log(docs);
  var width = 900;
  var height = 600;
  var svg = d3.select("body").append("svg");
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
    .attr("x", function(d){return Math.random() * width;})
    .attr("y", function (d, i){return Math.random() * height;})
    .attr("color", "gray");
    ;
}
