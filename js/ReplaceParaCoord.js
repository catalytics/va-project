function replaceParaCoord(u1,u2){

	var choice = {
        uni1: u1,
        uni2: u2
    };

    console.log(choice);

    d3.select("#chart-space").selectAll("svg").remove(); // clear old graph

    var margin = {top: 30, right: 20, bottom: 70, left: 50},
        width = 600 - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%Y").parse;
    var setFormat = d3.time.format("%Y");

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var universityLine = d3.svg.line()   
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.worldRank); });
        
    // Adds the svg canvas
    var svgLines = d3.select("#chart-space")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // tooltips
    var tooltip = svgLines.append('text')   
        .style('opacity', 0)
        .style('font-family', 'Century')
        .style('font-size', '12px')
        .attr("x", 200)
        .attr("y", -10)
        .attr("text-anchor","left");

    //Div for tooltip            
    var div = svgLines.append("text")   
        .attr("class", "tooltip")               
        .style("opacity", 0)
        .attr("text-anchor","left");

    // Axis Labels
    var aLabel = d3.select("svg")
        .append("text")
        .attr("x",10)
        .attr("y",20)
        .text("World Rank")
        .style('opacity', 1)
        .style('font-family', 'Century')
        .style('font-size', '14px')

    // Extra axes
    var axis13 = d3.select("svg")
        .append("line")
        .attr("x1", width/3 + 6)
        .attr("y1", margin.top)
        .attr("x2", width/3 + 6)
        .attr("y2", height + 30)
        .style("stroke","grey")
        .style("stroke-width", "0.9px")
        .style("opacity", 1)
        .style("shape-rendering", "crispEdges");

    var axis14 = d3.select("svg")
        .append("line")
        .attr("x1", width/2 + 50.5)
        .attr("y1", margin.top)
        .attr("x2", width/2 + 50.5)
        .attr("y2", height + 30)
        .style("stroke","grey")
        .style("stroke-width", "1px")
        .style("opacity", 1)
        .style("shape-rendering", "crispEdges");

    var axis15 = d3.select("svg")
        .append("line")
        .attr("x1", width - 82.5)
        .attr("y1", margin.top)
        .attr("x2", width - 82.5)
        .attr("y2", height + 30)
        .style("stroke","grey")
        .style("stroke-width", "1px")
        .style("opacity", 1)
        .style("shape-rendering", "crispEdges");

    var axis16 = d3.select("svg")
        .append("line")
        .attr("x1", width + 49.5)
        .attr("y1", margin.top)
        .attr("x2", width + 49.5)
        .attr("y2", height + 30)
        .style("stroke","grey")
        .style("stroke-width", "1px")
        .style("opacity", 1)
        .style("shape-rendering", "crispEdges");

    // Append dropbx box 

    var uniList1 = d3.select("#u1").attr("onchange","menuChanged(event)");
    var uniList2 = d3.select("#u2").attr("onchange","menuChanged(event)");
    var yearList = d3.select("#year");

    // Get the data
    d3.csv("data/timesData_0711.csv", function(error, data) {

        var dataFilter = data.filter(function(d){
            return ((d.Year != "2011") && (d.UniversityName == choice.uni1 || d.UniversityName == choice.uni2));
        });

        dataFilter.forEach(function(d) {
            d.WorldRank = +d.WorldRank;
            d.UniversityName = d.UniversityName;
            d.Year = parseDate(d.Year);

        });

        //console.log(dataFilter);

        var mappedWorldRank = dataFilter.map(function(d){ return d.WorldRank;});
        var mappedUniversityName = dataFilter.map(function(d){ return d.UniversityName;});
        var mappedYear = dataFilter.map(function(d){ return d.Year;});

        // Gets data into Key-Value Relations
        var i = 0;
        var tempData = [];

        for(i = 0; i < mappedWorldRank.length; i++){
            var tempObj = {};
            tempObj.worldRank = mappedWorldRank[i];
            tempObj.universityName = mappedUniversityName[i];
            tempObj.year = mappedYear[i];
            tempData.push(tempObj);
        };

        //console.log(tempData);

        // Scale the range of the data
        x.domain(d3.extent(tempData, function(d) { return d.year; }));
        y.domain([d3.max(mappedWorldRank, function(d) { return d;}),d3.min(mappedWorldRank, function(d){ return d;})]);
        //y.domain already coded above

        // Nest the entries by University Names
        var dataNest = d3.nest()
            .key(function(d) {return d.universityName;})
            .entries(tempData);

        console.log(dataNest);

        // Map Uni and Year into dropdown boxes
        var dd1 = uniList1.selectAll("option")
            .data(dataNest)
            .enter()
            .append("option")
            .text(function(d){ return d.key;})
            .attr("placeholder","Search University Name");

        var dd2 = uniList2.selectAll("option")
            .data(dataNest)
            .enter()
            .append("option")
            .text(function(d){ return d.key;})
            .attr("value", function(d){ return d.key;})
            .attr("placeholder","Search University Name");

        var dd3 = yearList.selectAll("option")
            .data(["2012","2013","2014","2015","2016"])
            .enter()
            .append("option")
            .text(function(d){ return d;})
            .attr("value", function(d){ return d;});

        var color = d3.scale.category10();   // set the colour scale

        // Loop through each symbol / key
        dataNest.forEach(function(d,i) { 

           var lines = svgLines.append("path")
                .attr("class", "line")
                .style("stroke", function() { // Add the colours dynamically
                    return d.color = color(d.key); })
                .style("opacity", 0.6)
                .style("stroke-width", 3)
                .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
                .attr("d", universityLine(d.values));

                lines
                .on("mouseover", function(){
                        lines
                            //.selectAll(z)
                            .style("opacity", 1)
                            .style("stroke-width", 5);

                        tooltip
                            .transition()  
                            .style("opacity", 1)      
                            .text(d.key);
                })
                .on("mouseout", function() {
                        lines
                            .style("opacity", 0.6)
                            .style("stroke-width", 3);   

                        tooltip
                            .transition()        
                            .duration(500)      
                            .style("opacity", 0); 
                });

             var dots = svgLines.selectAll("dot")
                        .data(tempData)
                        .enter().append("circle")
                        .attr("r", 5)
                        .style("fill", "black")
                        .style("fill-opacity", 0.9) 
                        .attr("cx", function(d) { return x(d.year); })
                        .attr("cy", function(d) { return y(d.worldRank); })
                        .append("svg:title")
                        .text(function(d){ return d.universityName + " World Rank: " + d.worldRank;});
                
        });

        // Add the X Axis
        svgLines.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svgLines.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    });
};