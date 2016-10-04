var width = 900;
var height = 600;
var xPadding = 30;
var yPadding = 20;
var num_attr = 3;
var trasitionTime = 1000;
var layout = {
  'x' : [xPadding, width-xPadding],
  'y' : [height - yPadding, yPadding],
  'size' : [5, 70],
}
var dataset = {
  'country_name' : [],
  'x' : [],
  'y' :[],
  'size' :[],
  'color' :[],
  'scale' :{
    'x': d3.scaleLog().domain([20, 80000]).range(layout['x']),
    'y': d3.scaleLinear().domain([30, 85]).range(layout['y']),
    'size' : d3.scaleSqrt().domain([1000, 2000000000]).range(layout['size']),
  },
};
var selected_country = ["Korea, Rep.","Korea, Dem. People's Rep.", "Afghanistan", "United States", "Vietnam", "United Kingdom", "Sweden", "Japan", "Cuba", "China", "OECD members", "World", "South Asia","East Asia & Pacific", "Sub-Saharan Africa (all income levels)"];
var group_filter_word = ["&","countries","World","Asia","income","Euro","situations","Sub-Saharan","mall states", "OECD", "North America"];
var selectedIdList = {};
var playEvent = {};

var init = function (){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', window.location.origin + '/all-country', true);
  xhr.addEventListener("load", function (e){
    var docs  = JSON.parse(xhr.responseText);
    dataset['country_name'] = docs.map(function(ele){return ele['country_name'];});

    var svg = d3.select("#screen").append("svg");
    svg.attr("width", width).attr("height", height);

    var xAxis = d3.axisBottom(dataset.scale['x']).ticks(20, ",.0f");
    var xAxisSpr = svg.append("g").call(xAxis).attr("class", "x axis").attr("transform", "translate(0,"+(height - yPadding)+")");
    var yAxis = d3.axisLeft(dataset.scale['y']).ticks(20, ",.1f");
    var yAxisSpr = svg.append("g").call(yAxis).attr("class", "y axis").attr("transform", "translate("+(xPadding)+",0)");

    var elementEnter = svg.selectAll("circle").data(dataset['country_name']).enter();

    var circles = elementEnter.append("circle");
    circles.text(function(d){return d;})
    .attr("cx", 0)
    .attr("cy", height)
    .attr("r", "2px")
    .attr("fill", function (d, i){
      var red = Math.floor(Math.random()*255);
      var green =Math.floor(Math.random()*255);
      var blue = Math.floor(255*3/2) - red - green;
      return "rgba("+red+","+green+","+blue+","+0.6+")";
    })
    .attr("display", filterGroup)
    .on("click", toggleLabelList);

    var labels = elementEnter.append("text");
    labels.text(filterLabel)
    .attr("dx", -100)
    .attr("dy", -100)
    .attr("display",filterGroup)
    .on("click", toggleLabelList)
    ;

  }); //xhr
  xhr.send(null);
} // init

var toggleLabelList = function(d, i){
  selectedIdList[i] = !selectedIdList[i];
  var svg = d3.select("#screen svg");
  var labels = svg.selectAll("svg>text")
  .text(function(d, i){
    if(selectedIdList[i])
      return dataset['country_name'][i];
    else
      return "";
  });
}

var filter = {
  'nations' : function(d, i){
    for(group_id in group_filter_word){
      if( dataset['country_name'][i].includes(group_filter_word[group_id]) ){
        return "none";
      }
    }
    return "inline";
  }, // nation

  'groups' : function(d, i){
    for(group_id in group_filter_word){
      if( dataset['country_name'][i].includes(group_filter_word[group_id]) )
        return "inline";
    }
    return "none";
  }, // groups
  'all' : function(d){ return 'inline';  },
  'none' :function(d){ return 'none';},
};
var filterGroup = filter['nations'];

var filterLabel = function(d, i){
  if(selected_country.indexOf(dataset['country_name'][i]) >= 0){
    selectedIdList[i] = true;
    return dataset['country_name'][i];
  }
  else{
    selectedIdList[i] = false;
    return "";
  }
}

var xhrReq = function ( attribute, address, callback){

  var xhr = new XMLHttpRequest();
  //var address = '/indicator/economy_growth/GDP%20per%20capita%20%5C(current%20US%5C%24%5C)'
  xhr.open('GET', window.location.origin + address, true);
  xhr.addEventListener("load", function (e){
    var docs  = JSON.parse(xhr.responseText);
    callback(attribute, docs);

    num_attr -= 1;
    if(num_attr == 0) changeCicle();
  });
  xhr.send(null);
}

var click_event = function (e){
  //console.log(e.target.tagName);
  if(e.target.tagName == "BUTTON" && e.target.id === "changeButton"){
    changeCicle();
    return;
  }

  if(e.target.tagName == "BUTTON" && e.target.id === "playButton"){
    playEvent = setInterval(function(){
      var year = document.getElementById("year_input");
      year.value = Number(year.value) + 1;
      changeCicle();
      if(year.value >= 2014) {
        var year = document.getElementById("year_input");
        year.value = 1960;
        clearInterval(playEvent)
      };
    }, 1200);
    console.log("start:"+playEvent);
    return;
  }

  if(e.target.tagName == "BUTTON" && e.target.id === "stopButton"){
    console.log("stop:"+playEvent);
    clearInterval(playEvent);
    return;
  }

  if(e.target.tagName == "BUTTON" && e.target.id === "loadData"){
    console.log("Load Data");

    num_attr = 3;
    var attr_list = document.querySelectorAll("div.index_div");
    for(var i = 0; i < num_attr; i++){
      var groupName = attr_list[i].dataset.group + "/";
      var addr = encodeURI('/indicator/' + groupName + attr_list[i].dataset.val);
      console.log(addr);
      xhrReq(attr_list[i].dataset.attrName, addr, set_data);
    }
    return;
  }

  var postpix_apply_button = "_apply_button";
  if(e.target.tagName == "BUTTON" && e.target.id.substring(e.target.id.length - postpix_apply_button.length, e.target.id.length) === postpix_apply_button){
    for( index in layout){
      if(index+postpix_apply_button == e.target.id){
        var max_input = document.querySelector("#"+index+"_max_input");
        var min_input = document.querySelector("#"+index+"_min_input");
        applyScale(index, min_input.value, max_input.value);
      }//if
    }//for
    applyAxis();
    changeCicle();
    return;
  }//if button.id

  if(e.target.tagName == "INPUT" && e.target.className.includes("filter_checkbox")){
    changeFilter();
    changeCicle();
    return;
  }

  if(e.target.tagName == "BUTTON" && e.target.id.includes("_attr_change_button")){
    for( index in layout){
      if(e.target.id.includes(index)){
        console.log(index);
        show_dialog(index+"_search_dialog");
      }
    }//for
    return;
  }

  if(e.target.tagName == "BUTTON" && e.target.className.includes("close")){
    for( index in layout){
      if(e.target.id.includes(index)){
        console.log(index);
        closeDialog(index+"_search_dialog");
      }//if
    }//for
  }
}

var show_dialog = function(id){
  var dialog = document.querySelector('dialog#'+id);
  console.log(dialog.showModal);
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.showModal();
}

var closeDialog = function(id){
  var dialog = document.querySelector('dialog#'+id);
  dialog.close();
}

var set_data = function( index, data){
  dataset[index] = data.map(function(ele){return ele['value'];});
  var max = d3.max(dataset[index], function(d){
    return d3.max(d, function (row){return Number(row.value);});
  });
  var min = d3.min(dataset[index], function(d){
    return d3.min(d, function (row){return Number(row.value);});
  });
  console.log("max:"+ max);
  console.log("min:"+ min);

  applyScale(index, min, max);
  applyAxis();
}

var applyAxis = function(){
    var svg = d3.select("#screen svg");
    var xAxis = d3.axisBottom(dataset.scale['x']).ticks(20, ",.0f");
    var xAxisSpr = svg.selectAll("g.x.axis").call(xAxis).attr("transform", "translate(0,"+(height - yPadding)+")");
    var yAxis = d3.axisLeft(dataset.scale['y']).ticks(20, ",.1f");
    var yAxisSpr = svg.selectAll("g.y.axis").call(yAxis).attr("transform", "translate("+(xPadding)+",0)");
}

var applyScale = function(index, min, max){
  var max_input = document.querySelector("#"+index+"_max_input");
  max_input.value = max;
  var min_input = document.querySelector("#"+index+"_min_input");
  min_input.value = min;

  var selectEle = document.getElementById(index+"_scale_type");
  var scale_type = selectEle.options[selectEle.selectedIndex].value;
  console.log(scale_type);
  if(scale_type == "linear")
    dataset.scale[index] = d3.scaleLinear().domain([min, max]).range(layout[index]);
  else if(scale_type == "log")
    dataset.scale[index] = d3.scaleLog().domain([min, max]).range(layout[index]);
  else if(scale_type == "sqrt")
    dataset.scale[index] = d3.scaleSqrt().domain([min, max]).range(layout[index]);
  else
    console.log("scale not found");
}

var changeFilter = function(){
  var nation_checkbox = document.querySelector("div.country_filter input.nations");
  var group_checkbox = document.querySelector("div.country_filter input.groups");

  var isNationSelectd = nation_checkbox.checked;
  var isGroupSelected = group_checkbox.checked;

  console.log("nation:"+isNationSelectd+" group:"+isGroupSelected);
  if(isNationSelectd && isGroupSelected)
    filterGroup = filter['all'];
  else if (isNationSelectd)
    filterGroup = filter['nations'];
  else if (isGroupSelected)
    filterGroup = filter['groups'];
  else
    filterGroup = filter['none'];
}

var changeCicle = function(){
  var year = document.getElementById("year_input");
  console.log(year.value);
  make_circle(Number(year.value));
}

var make_circle = function (year){
  var yearData = [];
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

  //change circle
  var svg = d3.select("svg");
  var circles = svg.selectAll("circle").transition().duration(trasitionTime);
  circles
    .attr("cx", function (d, i){
      if(yearData[i]['x'])
        return dataset.scale['x'](Number(yearData[i]['x']));
      else
        return d['x'];
      })
    .attr("cy", function (d, i){
      if(yearData[i]['y'])
        return dataset.scale['y'](yearData[i]['y']);
      else
        return d['y'];
    })
    .attr("r", function(d,i){
      if(yearData[i]['size'])
        return "" + dataset.scale['size'](yearData[i]['size']) +"px";
      else
        return d['r'];
    })
    .attr("display", filterGroup)
    ;

  var labels = svg.selectAll("svg>text").transition().duration(trasitionTime);
  labels
  .attr("dx", function (d, i){
    if(yearData[i]['x'])
      return dataset.scale['x'](Number(yearData[i]['x']));
    else
      return d['x'];
    })
  .attr("dy", function (d, i){
    if(yearData[i]['y'])
      return dataset.scale['y'](yearData[i]['y']);
    else
      return d['y'];
  })
  .attr("display",filterGroup)
  ;
};

document.addEventListener("click", click_event);
init();
