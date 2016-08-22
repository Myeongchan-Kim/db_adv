
var dataLength = 25;

var dataset = [];
for(var i = 0; i < dataLength; i++){
  var newNumber = Math.random() * 30;
  dataset.push(newNumber);
}

var red = [];
for(var i = 0; i < dataLength; i++){
  var newNumber = Math.random() * 255;
  red.push(newNumber);
}
var blue = [];
for(var i = 0; i < dataLength; i++){
  var newNumber = Math.random() * 255;
  blue.push(newNumber);
}
var green = [];
for(var i = 0; i < dataLength; i++){
  var newNumber = Math.random() * 255;
  green.push(newNumber);
}

var height = [];
for(var i = 0; i < dataLength; i++){
  var newNumber = Math.random() * 25 * 25;
  height.push(newNumber);
}

d3.select("body").selectAll("div").data(dataset).enter()
.append("div").attr("class", "bar").style("height", function (d) {return d * 10+"px";});

w = dataset.length * 25;
h = dataset.length * 25;
var svg = d3.select("body").append("svg");
svg.attr("width", w).attr("height", h);

var circles = svg.selectAll("circle").data(dataset).enter().append("circle");
circles
  .attr("cx", function (d, i){return i*22 + 10; })
  .attr("cy", function (d, i){return height[i];})
  .attr("r", function(d){return d*2;})
  .attr("fill", function (d, i){return "rgb("+Math.floor(red[i])+","+Math.floor(green[i])+","+Math.floor(blue[i])+")";})
  .attr("stroke", "orange")
  .attr("stroke-width", function(d){return d/5;})

var texts = svg.selectAll("text").data(dataset).enter().append("text");
texts
  .attr("x",  function (d, i){return i*22 + 2; } )
  .attr("y", function(d, i){return height[i] + 10;})
  .text(function(d){return Math.round(d);});
