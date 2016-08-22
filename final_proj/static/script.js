
var dataset = [];
for(var i = 0; i < 25; i++){
  var newNumber = Math.random() * 30;
  dataset.push(newNumber);
}


d3.select("body").selectAll("div").data(dataset).enter()
.append("div").attr("class", "bar").style("height", function (d) {return d * 10+"px";});

var svg = d3.select("body").append("svg");
svg.attr("width", 500).attr("height", 50);
