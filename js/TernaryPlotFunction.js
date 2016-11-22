
	var rawData00 = [];

// test set:
//updateTernary("Harvard University","University of Edinburgh")
	
function updateTernary(u1,u2){
	console.log("I am updateTernary!");

	d3.select("#graph99").remove(); // clear old graph
	d3.select("#replacedTernary").remove();

	d3.select("#ternaryplot99").append("div").attr("id","replacedTernary");

	var modData = d3.nest().key(function(d){return d.UniversityName;}).entries(rawData99); 

	var rawDatanew = modData.filter(function(d){return (d.key == u1)});

	var firstChoice = rawDatanew.map(function(d) { return d.values; })
	                .reduce(function(a, b) { return a.concat(b); });

	rawDatanew = modData.filter(function(d){return (d.key == u2)}); // Re-assign rawDatanew

	var secondChoice = rawDatanew.map(function(d) { return d.values; })
	                .reduce(function(a, b) { return a.concat(b); });

	var replacedTernary = [];
		for(var i = 0; i < firstChoice.length; i++){
			replacedTernary.push(firstChoice[i]);
		};

		for(var i = 0; i < secondChoice.length; i++){
			replacedTernary.push(secondChoice[i]);
		};
	console.log(replacedTernary);

	function makeAxis(title, tickangle) {
        return {
	          title: title,
	          titlefont: { size: 16 },
	          tickangle: tickangle,
	          tickfont: { size: 12 },
	          tickcolor: 'rgba(0,0,0,0)',
	          ticklen: 5,
	          showline: true,
	          showgrid: true
        };
    }; 

	Plotly.plot('replacedTernary', [{ type: 'scatterternary', 
	 						mode: 'markers', 
	 						a: replacedTernary.map(function(d) { return d.InternationalStudents; }),
	  						b: replacedTernary.map(function(d) { return d.StudentStaff; }), 
	  						c: replacedTernary.map(function(d) { return d.MaleFemale; }), 
	  						text: replacedTernary.map(function(d) { return d.UniversityName + '<br>' + d.RankYear; }), 
	  						marker: { symbol: 90, color: '#1E90FF', size: 4, line: { width: 0 } },}], 
	  						{ ternary: { sum: 100, 
	  							aaxis: makeAxis('A: International Students Ratio', 0), 
	  							baxis: makeAxis('<br>B: Student Staff Ratio', 45), 
	  							caxis: makeAxis('<br>C: Male Female Ratio', -45), 
	  							bgcolor: '#F4F4F4' 
	  						}, 
	  						/*annotations: [{ showarrow: false, 
	  										text: 'Times Higher Education University Rankings', 
	  										x: 0.5, y: 1.3, 
	  										font: { size: 24 } }],*/ 
	  						paper_bgcolor: '#F4F4F4',});

};