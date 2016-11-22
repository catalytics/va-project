
function updateMap(u1,u2){

  var userInput = {
        uni1: u1,
        uni2: u2
    };
    console.log("updateMap userInput:")
    console.log(userInput);

  d3.select("#map").selectAll("svg").remove(); // clear old gmap

  var width = 600,
      height = 270;

  var projection = d3.geo.mercator()
      .scale(200)
      .center([0,0])
      .rotate([0,0]);

  var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);

  var path = d3.geo.path()
      .projection(projection);

  var g = svg.append("g");

  // load and display the World
  d3.json("https://gist.githubusercontent.com/d3noob/5193723/raw/6e1434b2c2de24aedde9bcfe35f6a267bd2c04f5/world-110m2.json", function(error, topology) {
    da = topojson.object(topology, topology.objects.countries);

    d3.csv("data/location.csv", function(error, data) {
    //Data handling

        //small for-loop to set the read in value to proper types
        data.forEach(function(d){
          d.Lat = +d.Lat;
          d.Long = +d.Long; // '+' just to type cast to numeric
        });

        // Call initial map upon page load
        var circleSize = 1;
        var centerLong;
        var centerLat;
        var tempData;
          if(userInput.uni1 == "" && userInput.uni2 == ""){ 

            tempData = data;

            console.log("updateMap IF - tempData:") 
            //console.log(tempData);

          } else {

            var uni1Lat, uni1Long, uni2Lat, uni2Long;
            var tempData = data.filter(function(d) {
              return (d.University == userInput.uni1 ||  d.University == userInput.uni2)
            });
            console.log("updateMap ELSE - tempData:")
            //console.log(tempData);

            data.filter(function(d) {
              if(d.University == userInput.uni1){
                uni1Lat = d.Lat;
                uni1Long = d.Long;
                console.log(uni1Lat);
                console.log(uni1Long);
              };

              if(d.University == userInput.uni2){
                uni2Lat = d.Lat;
                uni2Long = d.Long;
                console.log(uni2Lat);
                console.log(uni2Long);
              };
            });
            // re-position center to the middle ground of both universities
            centerLat = (uni1Lat + uni2Lat)/2;
            centerLong = (uni1Long + uni2Long)/2;
            circleSize = 5;
            projection.center([centerLong,centerLat]).scale(200);

          };

        //  console.log(data);

        var tpcircle = g.selectAll("circle")
           .data(tempData)
           .enter()
           .append("a")
              .attr("xlink:href", function(d) {
                return "https://www.google.com/search?q="+d.University;}
              )
           .append("circle")
           .attr("cx", function(d) {
                   return projection([d.Long, d.Lat])[0];
           })
           .attr("cy", function(d) {
                   return projection([d.Long, d.Lat])[1];
           })
           .attr("r", circleSize+"px")
           .append("svg:title")
           .text(function(d){ return d.University;});

    });

    g.selectAll("path")
          .data(topojson.object(topology, topology.objects.countries).geometries)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill","#ffff99");
          
  });

  // zoom and pan
  var zoom = d3.behavior.zoom()
      .on("zoom",function() {
          g.attr("transform","translate("+
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
          g.selectAll("circle")
              .attr("d", path.projection(projection));
          g.selectAll("path")  
              .attr("d", path.projection(projection)); 

    });

  svg.call(zoom);

}

console.log("Hi! I am world map!");

// ============================================= Loads Initital Map =======================================

  d3.select("#map").selectAll("svg").remove(); // clear old gmap

  var width = 600,
      height = 270;

  var projection = d3.geo.mercator()
      .scale(200)
      .center([0,0])
      .rotate([0,0]);

  var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);

  var path = d3.geo.path()
      .projection(projection);

  var g = svg.append("g");

  // load and display the World
  d3.json("https://gist.githubusercontent.com/d3noob/5193723/raw/6e1434b2c2de24aedde9bcfe35f6a267bd2c04f5/world-110m2.json", function(error, topology) {
    da = topojson.object(topology, topology.objects.countries);

    d3.csv("data/location.csv", function(error, data) {
    //Data handling

        //small for-loop to set the read in value to proper types
        data.forEach(function(d){
          d.Lat = +d.Lat;
          d.Long = +d.Long; // '+' just to type cast to numeric
        });

        // Call initial map upon page load
       
        //  console.log(data);

        var tpcircle = g.selectAll("circle")
           .data(data)
           .enter()
           .append("a")
              .attr("xlink:href", function(d) {
                return "https://www.google.com/search?q="+d.University;}
              )
           .append("circle")
           .attr("cx", function(d) {
                   return projection([d.Long, d.Lat])[0];
           })
           .attr("cy", function(d) {
                   return projection([d.Long, d.Lat])[1];
           })
           .attr("r", "1px")
           .append("svg:title")
           .text(function(d){ return d.University;});

    });

    g.selectAll("path")
          .data(topojson.object(topology, topology.objects.countries).geometries)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill","#ffff99");
          
  });

  // zoom and pan
  var zoom = d3.behavior.zoom()
      .on("zoom",function() {
          g.attr("transform","translate("+
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
          g.selectAll("circle")
              .attr("d", path.projection(projection));
          g.selectAll("path")  
              .attr("d", path.projection(projection)); 

    });

  svg.call(zoom);
