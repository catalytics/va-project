
function updateData2(u1,u2,year){
  
    var output = {
        uni1: u1,
        uni2: u2,
        yearChoice: year
    };

    console.log(output);

//  Main Source = http://bl.ocks.org/biovisualize/4348024 

    var colorscale = d3.scale.category10();

    var uniArray =[];
    var forSlopeGraph = [];
    // ====== Import data from csv =======
    // =================================================== Draw slopegraph first ====================================================
    d3.csv("data/timesData_0711.csv", function(error,data) {
      if(error) throw error;

        data.forEach(function(d){ 
            d.LearningEnvironment = +d.LearningEnvironment;
            d.Research = +d.Research;
            d.CitationInfluence = +d.CitationInfluence;
            d.InternationalOutlook = +d.InternationalOutlook;
            d.IndustryIncome = +d.IndustryIncome;
        });

     var userInput = output;

     
      forSlopeGraph = data.filter(function(d) {
        return ( ( d.UniversityName == userInput.uni1 ||  d.UniversityName == userInput.uni2) && (d.Year == userInput.yearChoice)
             ) 
        }); 

      //console.log(forSlopeGraph);

      uniArray = forSlopeGraph;

      // ====== changes format to key-value relations =======
      var i = 0;
      var objArray = [];
      var tempData = []

      for(i = 0; i < forSlopeGraph.length; i++){

        for(key in forSlopeGraph[i]){
          var tempObj = {};
          tempObj.name = key;
          tempObj.score = forSlopeGraph[i][key];
          objArray.push(tempObj);
        }; 

        tempData.push(objArray);
        objArray = [];
      };

      //console.log(tempData);

      // ====== Finds index of each key indicators in dataset =======
      var indexIntOutlook = tempData[0].map(function(d){ return d.name;}).indexOf("InternationalOutlook");
      var indexCitation = tempData[0].map(function(d){ return d.name;}).indexOf("CitationInfluence");
      var indexLearnEnviron = tempData[0].map(function(d){ return d.name;}).indexOf("LearningEnvironment");
      var indexIndIncome = tempData[0].map(function(d){ return d.name;}).indexOf("IndustryIncome");
      var indexResearch = tempData[0].map(function(d){ return d.name;}).indexOf("Research");

      // ===== Based on index found above, chooses key indicators from csv columns ======
      var slopeIndicators = [];
      var j = 0;

      for(j = 0; j < tempData.length; j++){

        var tempObj = [];
        tempObj.push(tempData[j][indexCitation]);
        tempObj.push(tempData[j][indexResearch]);
        tempObj.push(tempData[j][indexIndIncome]);
        tempObj.push(tempData[j][indexLearnEnviron]);
        tempObj.push(tempData[j][indexIntOutlook]);
        
        slopeIndicators.push(tempObj);
      }

      console.log(slopeIndicators); // checker for slopeIndicators

      // ======== Gets data into SlopeGraph Data Format ========

      // Goal to get data into format of:
      // data: [[SMU_citaton,NTU_citation],[SMU_research,NTU_research], ... ]
      // label: [SMU,NTU]

      var mappedScore1 = slopeIndicators[0].map((function(d){return d.score;})); // Array of Harvard Scores by (citation,research,IndustryIncome,LE,InternationalOutlook)
      var mappedScore2 = slopeIndicators[1].map((function(d){return d.score;})); // Array of Nottingham Scores by (citation,research,IndustryIncome,LE,InternationalOutlook)
      //var mappedScore3 = slopeIndicators[2].map((function(d){return d.score;}));

      var slopeData = [];
      for(var i = 0; i < mappedScore1.length; i++){
        var tempArray = [];
        tempArray.push(mappedScore1[i]);
        tempArray.push(mappedScore2[i]);
       // tempArray.push(mappedScore3[i]);
        slopeData.push(tempArray);
      };

      //console.log(slopeData);

      var slopeLabel = [["U1","U2"]];

      //console.log(slopeLabel);

      var data = {};
      data.data = slopeData;
      data.label = slopeLabel;

      console.log(data);

    // ================ start of SlopeGraph Function ===================
        
        d3.custom = {};
       // var color_scale = d3.scale.category10();

        d3.custom.slopegraph = function() {

          var opts = {
              width: 550,
              height: 200,
              margin: {top: 30, right: 15, bottom: 30, left: 30},
              labelLength: 45,
              adjustText: 55,
              adjustLine: 0,
              tooltipX: 22,
              tooltipY: 8,
              background:"#f3f3f3",
              color: "#444"
          };


            d3.select("#chart2").selectAll("svg.chart-root").data([0]).remove(); // Removes old slope graph.

            function exports(selection) {
                  selection.each(function (dataset) {
                      var chartHeight = opts.height - opts.margin.top - opts.margin.bottom;

                      var chartWidth = opts.width - opts.margin.right - opts.margin.left;

                      var parent = d3.select("#chart2");
                      console.log(parent);

                      var svgSlope = parent.selectAll("svg.chart-root").data([0]);
                   
                      svgSlope.enter()
                              .append("svg")
                              .attr("id","slope")
                              .attr("class", "chart-root")
                              .append("g")
                              .attr("class", "chart-group");
                              
                      svgSlope.attr({
                                width: opts.width,
                                height: opts.height,
                                background: opts.background,
                                color: opts.color
                              });
                       
                      //svgSlope.exit().remove();

                      console.log(svgSlope);
                      var chartSvg = svgSlope.select('.chart-group');                  

                      var data = d3.transpose(dataset.data);

                      //console.log("transposed data = " + data);

                      var scale = d3.scale.linear().domain(d3.extent(d3.merge(data))).range([chartHeight, 0]);

                     // ========================Over function to be called on mouseover=======================

                      function over(d, i) {
                        chartSvg.selectAll("line").filter(function(e, j) {return j == i;})
                       //     console.log("I am mouseover!");

                            d3.select(this).transition()
                                 .attr('stroke', colorscale)
                                 .attr("stroke-width", 4)
                                 .attr('opacity', 1)
                      };

                      // ===================Out function to be called on mouseout===========================
                      function out(d, i) {
                        chartSvg.selectAll("line").filter(function(e, j) { return j == i;})
                       //   console.log("I am mouseout!");

                          d3.select(this).transition()
                              .attr('stroke', colorscale)
                              .attr("stroke-width", 2)
                              .attr('opacity', 1)
                      };

                      // ====================================Append Lines===================================
                      // Creates sets of "g" within chartSvg and places line elements within.
                      
                      var groupedLines = chartSvg.selectAll("g")
                          .data(data)
                          .enter().append("g")
                          .attr("id", function(d,i){return i;})
                          .attr("class","line")
                          .attr("stroke-width", 2)
                          .attr('stroke-linecap', 'round')
                          .attr("stroke", colorscale)
                          .on("mouseover",over)
                          .on("mouseout",out);

                      //groupedLines.exit().remove();
                                           
                      var line1 = groupedLines.append("line")
                          .attr({
                              x1: opts.margin.left + opts.labelLength + opts.adjustLine,
                              x2: opts.margin.left + opts.labelLength + opts.adjustText - opts.adjustLine,
                              y1: function(d) { return opts.margin.top + scale(d[0]); }, // scale(d[0]) extracts transposed data
                              y2: function(d) { return opts.margin.top + scale(d[1]); }, // i.e. (0.998, 0.99, 0.452, 0.836, 0.772 ... )
    
                          });

                      var line2 = groupedLines.append("line")
                          .attr({
                              x1: opts.margin.left + 2*opts.labelLength + opts.adjustText + opts.adjustLine,                     
                              x2: opts.margin.left + 2*opts.labelLength + 2*opts.adjustText - opts.adjustLine,
                              y1: function(d) { return opts.margin.top + scale(d[1]); },
                              y2: function(d) { return opts.margin.top + scale(d[2]); }
                          });

                      var line3 = groupedLines.append("line")
                          .attr({
                              x1: opts.margin.left + 3*opts.labelLength + 2*opts.adjustText + opts.adjustLine,                     
                              x2: opts.margin.left + 3*opts.labelLength + 3*opts.adjustText - opts.adjustLine,
                              y1: function(d) { return opts.margin.top + scale(d[2]); },
                              y2: function(d) { return opts.margin.top + scale(d[3]); }
                          });

                      var line4 = groupedLines.append("line")
                          .attr({
                              x1: opts.margin.left + 4*opts.labelLength + 3*opts.adjustText + opts.adjustLine,                     
                              x2: opts.margin.left + 4*opts.labelLength + 4*opts.adjustText - opts.adjustLine,
                              y1: function(d) { return opts.margin.top + scale(d[3]); },
                              y2: function(d) { return opts.margin.top + scale(d[4]); }
                          }); 

                      // ========================================Appending text===========================================

                      // Text for Tooltip              
                      var tooltip = chartSvg.append('text')   
                        .style('opacity', 0)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '11px'); 

                      var tooltip2 = chartSvg.append('text')   
                        .style('opacity', 0)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '11px'); 

                      // ========================================="Axis" Labels==========================================
                      // Appending Axis Labels
                      // ============================================Top Axes========================================

                      var citeAxis = chartSvg.append("text")
                        .attr({
                          x: opts.margin.left + 0.7*opts.labelLength,
                          y: 1.5*opts.tooltipY,
                          "text-anchor" : "middle",
                          //"font-weight" : "bold"
                        })
                        .style('opacity', 1)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '10px')
                        .text("Citation Influence (30%)"); 

                      var IntOutlookAxis = chartSvg.append("text")
                        .attr({
                          x: opts.margin.left + 5.2*opts.labelLength,
                          y: 1.5*opts.tooltipY,
                          "text-anchor" : "middle",
                          //"font-weight" : "bold"
                        })
                        .style('opacity', 1)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '10px')
                        .text("Industry Income (2.5%)"); 

                      var IndIncomeAxis = chartSvg.append("text")
                        .attr({
                          x: opts.margin.left + 9.2*opts.labelLength,
                          y: 1.5*opts.tooltipY,
                          "text-anchor" : "middle",
                          //"font-weight" : "bold"
                        })
                        .style('opacity', 1)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '10px')
                        .text("International Outlook (7.5%)"); 

                    // ============================================Bottom Axes========================================

                      var ResearchAxis = chartSvg.append("text")
                        .attr({
                          x: opts.margin.left + 2.7*opts.labelLength,
                          y: opts.height - opts.tooltipY,
                          "text-anchor" : "middle",
                          //"font-weight" : "bold"
                        })
                        .style('opacity', 1)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '10px')
                        .text("Research (30%)"); 

                      var LEAxis = chartSvg.append("text")
                        .attr({
                          x: opts.margin.left + 7.2*opts.labelLength,
                          y: opts.height - opts.tooltipY,
                          "text-anchor" : "middle",
                          //"font-weight" : "bold"
                        })
                        .style('opacity', 1)
                        .style('font-family', 'sans-serif')
                        .style('font-size', '10px')
                        .text("Learning Environment (30%)");

                      // Appends each text
                      //===========================================Label 1==================================================

                      var label1 = chartSvg.selectAll('text.label1')
                          .data(data)
                          .enter().append('text')
                          .attr({
                              class: 'label1 slope-label',
                              x: opts.margin.left + 0.4*opts.labelLength,
                              y: function(d,i) { return opts.margin.top + scale(d[0]); }, // Finds y axis position on svg
                              dy: '.35em',
                              'text-anchor': 'middle'})
                          .text(function(d,i) { return dataset.label[0][i] }) // Returns the label of the text
                          .on("mouseover", function(d){ 
                                // creates tooltip for coordinates under the same axis
                                var x1 = opts.margin.left + opts.labelLength - opts.tooltipX;
                                var y1 = opts.margin.top + scale(dataset.data[0][0]) - opts.tooltipY; // scales value domain into range

                                var x2 = opts.margin.left + opts.labelLength - opts.tooltipX;
                                var y2 = opts.margin.top + scale(dataset.data[0][1]) - opts.tooltipY;

                              //console.log(x1 + " " + y1);
                               // console.log(x2 + " " + y2);

                                tooltip
                                  .attr('x', x1)
                                  .attr('y', y1)
                                  .text(d3.format(",.1%")(dataset.data[0][0])) // formats to 1dp
                                  .transition(200)
                                  .style('opacity', 1);

                                tooltip2
                                  .attr('x', x2)
                                  .attr('y', y2)
                                  .text(d3.format(",.1%")(dataset.data[0][1]))
                                  .transition(200)
                                  .style('opacity', 1);
                            })
                          .on('mouseout', function(){
                                tooltip
                                  .transition(200)
                                  .style('opacity', 0);

                                tooltip2
                                  .transition(200)
                                  .style('opacity', 0);
                            });

                      //===========================================Label 2===================================================

                      var label2 = chartSvg.selectAll('text.label2')
                          .data(data)
                          .enter().append('text')
                          .attr({
                              class: 'label2 slope-label',
                              x: opts.width - opts.margin.right - 4*opts.labelLength - 3.7*opts.adjustText,
                              y: function(d,i) { return opts.margin.top + scale(d[1]); },
                              dy: '.35em',
                              'text-anchor': 'middle'})
                          .text(function(d,i) { return dataset.label[0][i] })
                          .on("mouseover", function(d){ 
                                
                                var x1 = opts.width - opts.margin.right - 4*opts.labelLength - 3.2*opts.adjustText - opts.tooltipX;
                                var y1 = opts.margin.top + scale(dataset.data[1][0]) - opts.tooltipY;

                                var x2 = opts.width - opts.margin.right - 4*opts.labelLength - 3.2*opts.adjustText - opts.tooltipX;
                                var y2 = opts.margin.top + scale(dataset.data[1][1]) - opts.tooltipY;

                             //   console.log(x1 + " " + y1);
                             //   console.log(x2 + " " + y2);

                                tooltip
                                  .attr('x', x1)
                                  .attr('y', y1)
                                  .text(d3.format(",.1%")(dataset.data[1][0]))
                                  .transition(200)
                                  .style('opacity', 1);

                                tooltip2
                                  .attr('x', x2)
                                  .attr('y', y2)
                                  .text(d3.format(",.1%")(dataset.data[1][1]))
                                  .transition(200)
                                  .style('opacity', 1);
                            })
                          .on('mouseout', function(){
                                tooltip
                                  .transition(200)
                                  .style('opacity', 0);

                                tooltip2
                                  .transition(200)
                                  .style('opacity', 0);
                            });

                      //================================================Label 3=============================================

                      var label3 = chartSvg.selectAll('text.label3')
                          .data(data)
                          .enter().append('text')
                          .attr({
                              class: 'label3 slope-label',
                              x: opts.width - opts.margin.right - 3*opts.labelLength - 2.7*opts.adjustText,
                              y: function(d,i) { return opts.margin.top + scale(d[2]); },
                              dy: '.35em',
                              'text-anchor': 'middle'})
                          .text(function(d,i) { return dataset.label[0][i] })
                          .on("mouseover", function(d){ 
                                
                                var x1 = opts.width - opts.margin.right - 3*opts.labelLength - 2.2*opts.adjustText - opts.tooltipX;
                                var y1 = opts.margin.top + scale(dataset.data[2][0]) - opts.tooltipY;

                                var x2 = opts.width - opts.margin.right - 3*opts.labelLength - 2.2*opts.adjustText - opts.tooltipX;
                                var y2 = opts.margin.top + scale(dataset.data[2][1]) - opts.tooltipY;

                             //   console.log(x1 + " " + y1);
                              //  console.log(x2 + " " + y2);

                                tooltip
                                  .attr('x', x1)
                                  .attr('y', y1)
                                  .text(d3.format(",.1%")(dataset.data[2][0]))
                                  .transition(200)
                                  .style('opacity', 1);

                                tooltip2
                                  .attr('x', x2)
                                  .attr('y', y2)
                                  .text(d3.format(",.1%")(dataset.data[2][1]))
                                  .transition(200)
                                  .style('opacity', 1);
                            })
                          .on('mouseout', function(){
                                tooltip
                                  .transition(200)
                                  .style('opacity', 0);

                                tooltip2
                                  .transition(200)
                                  .style('opacity', 0);
                            });
                     
                      //================================================Label 4===============================================

                      var label4 = chartSvg.selectAll('text.label4')
                          .data(data)
                          .enter().append('text')
                          .attr({
                              class: 'label4 slope-label',
                              x: opts.width - opts.margin.right - 2*opts.labelLength - 1.7*opts.adjustText,
                              y: function(d,i) { return opts.margin.top + scale(d[3]); },
                              dy: '.35em',
                              'text-anchor': 'middle'})
                          .text(function(d,i) { return dataset.label[0][i] })
                          .on("mouseover", function(d){ 
                                
                                var x1 = opts.width - opts.margin.right - 2*opts.labelLength - 1.2*opts.adjustText - opts.tooltipX;
                                var y1 = opts.margin.top + scale(dataset.data[3][0]) - opts.tooltipY;

                                var x2 = opts.width - opts.margin.right - 2*opts.labelLength - 1.2*opts.adjustText - opts.tooltipX;
                                var y2 = opts.margin.top + scale(dataset.data[3][1]) - opts.tooltipY;

                             //   console.log(x1 + " " + y1);
                             //   console.log(x2 + " " + y2);

                                tooltip
                                  .attr('x', x1)
                                  .attr('y', y1)
                                  .text(d3.format(",.1%")(dataset.data[3][0]))
                                  .transition(200)
                                  .style('opacity', 1);

                                tooltip2
                                  .attr('x', x2)
                                  .attr('y', y2)
                                  .text(d3.format(",.1%")(dataset.data[3][1]))
                                  .transition(200)
                                  .style('opacity', 1);
                            })
                          .on('mouseout', function(){
                                tooltip
                                  .transition(200)
                                  .style('opacity', 0);

                                tooltip2
                                  .transition(200)
                                  .style('opacity', 0);
                            });
                      
                      //=================================================Label 5=============================================

                      var label5 = chartSvg.selectAll('text.label5')
                          .data(data)
                          .enter().append('text')
                          .attr({
                              class: 'label5 slope-label',
                              x: opts.width - opts.margin.right - 2*opts.labelLength,
                              y: function(d,i) { return opts.margin.top + scale(d[4]); },
                              dy: '.35em',
                              'text-anchor': 'middle'})
                          .text(function(d,i) { return dataset.label[0][i] })
                          .on("mouseover", function(d){ 
                                
                                var x1 = opts.width - opts.margin.right - 1.3*opts.labelLength - opts.tooltipX;
                                var y1 = opts.margin.top + scale(dataset.data[4][0]) - opts.tooltipY;

                                var x2 = opts.width - opts.margin.right - 1.3*opts.labelLength - opts.tooltipX;
                                var y2 = opts.margin.top + scale(dataset.data[4][1]) - opts.tooltipY;

                             //   console.log(x1 + " " + y1);
                             //   console.log(x2 + " " + y2);

                                tooltip
                                  .attr('x', x1)
                                  .attr('y', y1)
                                  .text(d3.format(",.1%")(dataset.data[4][0]))
                                  .transition(200)
                                  .style('opacity', 1);

                                tooltip2
                                  .attr('x', x2)
                                  .attr('y', y2)
                                  .text(d3.format(",.1%")(dataset.data[4][1]))
                                  .transition(200)
                                  .style('opacity', 1);
                            })
                          .on('mouseout', function(){
                                tooltip
                                  .transition(200)
                                  .style('opacity', 0);

                                tooltip2
                                  .transition(200)
                                  .style('opacity', 0);
                            });
                  });
            }

           exports.opts = opts;
           createAccessors(exports);

           return exports;
        };

        createAccessors = function(visExport) {
            for (var n in visExport.opts) {
                if (!visExport.opts.hasOwnProperty(n)) continue;
                visExport[n] = (function(n) {
                    return function(v) {
                        return arguments.length ? (visExport.opts[n] = v, this) : visExport.opts[n];
                    }
                })(n);
            }
        };

      // ======== Call SlopeGraph Function ========
        
        var slopeGraph = d3.custom.slopegraph();

        d3.select('body')
            .datum(data)
            .call(slopeGraph);

        console.log("I drew the Slopegraph!");

    // ============================================ Start of Draw Glyph ========================================================
        
        var i = 0;
        var objArray = [];
        var d = []

        for(i = 0; i < uniArray.length; i++){

            for(key in uniArray[i]){
              var tempObj = {};
              tempObj.axis = key;
              tempObj.value = uniArray[i][key];
              objArray.push(tempObj);
            }; 

            d.push(objArray);
            objArray = [];
        };

        console.log(d); // checker for d 

        // Finds the index of "ProporResearch", "InternationalOutlook" etc. to be used later when choosing what variables to present in Glyph

        var indexIntOutlook = d[0].map(function(d){ return d.axis;}).indexOf("InternationalOutlook");
        var indexCitation = d[0].map(function(d){ return d.axis;}).indexOf("CitationInfluence");
        var indexLearnEnviron = d[0].map(function(d){ return d.axis;}).indexOf("LearningEnvironment");
        var indexIndIncome = d[0].map(function(d){ return d.axis;}).indexOf("IndustryIncome");
        var indexResearch = d[0].map(function(d){ return d.axis;}).indexOf("Research");

        // Chooses only the indicators wanted for the Glyph.
        var glyphIndicators = [];
        var j = 0;

        for(j = 0; j < d.length; j++){

            var tempObj = [];
            tempObj.push(d[j][indexCitation]);
            tempObj.push(d[j][indexResearch]);
            tempObj.push(d[j][indexIndIncome]);
            tempObj.push(d[j][indexLearnEnviron]);
            tempObj.push(d[j][indexIntOutlook]);
            
            glyphIndicators.push(tempObj);
        }

        console.log(glyphIndicators); // checker for glyphIndicators

            //Options for the Radar chart, other than default
        var mycfg = {
          w: 300,
          h: 300,
          maxValue: 1.2,
          levels: 6,
          ExtraWidthX: 160,
          ExtraWidthY: 70
        }

        //Call function to draw the Radar chart
        //Will expect that data is in %'s
        RadarChart.draw("#chart", glyphIndicators, mycfg);
        console.log("I drew the Glyph!");

        ////////////////////////////////////////////
        /////////// Initiate legend ////////////////
        ////////////////////////////////////////////

        //Legend titles. Loop through initial user input and extract out the "university names"
        var legendOptions = [];
        var color_scale = d3.scale.category10();
        var k = 0;

            for(k = 0; k < uniArray.length; k++){
                
                legendOptions.push(uniArray[k].Year + " - " +uniArray[k].UniversityName);
            };

        console.log(legendOptions); // checks if university names are correct

        function hideElem(obj) {
            console.log("I am hideElem!");
            document.getElementById(obj).style.visibility = "hidden";     
        };

        function showElem(obj) {
            console.log("I am showElem!")
            document.getElementById(obj).style.visibility = "visible";
        };

        hideElem("slope");

        var tooltip;

        d3.select("#legend").selectAll("svg").data([0]).remove();

        var svgLegend = d3.select("#legend")
            .append("svg")
            .attr("width", 300)
            .attr("height", 60);


        //Create the title for the legend
        var text = svgLegend.append("text")
            .attr("class", "title")
            .attr("transform", "translate(90,0)") 
            .attr("x", - 70)
            .attr("y", 10)
            .attr("font-size", "12px")
            .attr("fill", "#404040")
            .text("University Names");
                
        //Initiate Legend   
        var legend = svgLegend.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .attr("transform", "translate(90,20)");

        //Create colour squares
         legend.selectAll("rect")
          .data(legendOptions)
          .enter()
          .append("rect")
          .attr("class","rect")
          .attr("x", - 65)
          .attr("y", function(d, i){ return i * 20;})
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function(d, i){ return color_scale(i);})
          .style("fill-opacity", 1)
          .on('mouseover', function (d){

                z = "rect."+d3.select(this).attr("class");
                    legend.select("rect")
                          .transition(200)
                          .style("fill-opacity", .1);
                    
                    legend.selectAll(z)
                          .transition(200)
                          .style("fill-opacity", 0.5);
                    
              }) // end mouseover

          .on('mouseout', function(){
                        tooltip
                            .transition(200)
                            .style('opacity', 0);
                        legend.selectAll("rect")
                            .transition(200)
                            .style("fill-opacity", 1);

                      }) 
          .append("svg:title")  //appends the tooltip of uni name and year
          .text(function(d){return d});  

        legend.on("click", function(){
                var active = d.active ? false : true;
                active ? showElem("slope") : hideElem("slope");
                d.active = active;  
        });

        //Create text next to squares
        legend.selectAll("text")
          .data(legendOptions)
          .enter()
          .append("text")
          .attr("x", - 52)
          .attr("y", function(d, i){ return i * 20 + 9;})
          .attr("font-size", "11px")
          .attr("fill", "#737373")
          .text(function(d) {return d;});

        tooltip = legend.append('text')     
          .style('opacity', 0)
          .style('font-family', 'sans-serif')
          .style('font-size', '13px');

        //console.log("I reached the end of updateData!");
    });

    //update map
    updateMap(output.uni1,output.uni2);
};

