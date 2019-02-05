var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Pull data from CSV and parse from string to numbers

  d3.csv("assets/data/data.csv").then(function(Data) {
    Data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.obesity = +data.obesity;
      });
    console.log(Data)


var curX ="healthcare";
var curY ="poverty";
       
// create scale functions and axis
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Data, d => d[curX])])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Data, d => d[curY])])
      .range([height, 0]);

        
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // add axis to the chart

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);



      //create circles

  var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter();

   circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".5");

    //add states to circles

  circlesGroup.append("text")
    .attr("dx", d => xLinearScale(d.healthcare))
    .attr("dy", d => yLinearScale(d.poverty)+10/2.5)
    .attr("font-size", "8")
    .attr("class","stateText")
    .text(function(d){return d.abbr});

  ylabelsGroup=circlesGroup.append("g").selectAll(".aText");
  yLabels =[
            {"Name":"obesity","Label":"Obese (%)", IsActive:true},
            {"Name":"smokes","Label":"Smokes (%)", IsActive:false},
            {"Name":"healthcare","Label":"Lacks Healthcare (%)", IsActive:false}
    ]
  // Create axes labels
  ylabelsGroup.data(yLabels).enter()
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", function(d,i){return 0 - margin.left + 40 - 20*i;})
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("data-axis", "y")
  .attr("data-name", function(d){return d.Name})
  .attr("class",function(d){return "aText y "+ (d.IsActive?"active":"inactive");})
  .text(function(d){return d.Label});

  xlabelsGroup=circlesGroup.append("g").selectAll(".aText");
  xLabels =[
            {"Name":"poverty","Label":"In Poverty (%)", IsActive:true},
            {"Name":"age","Label":"Age (Median)", IsActive:false},
            {"Name":"income","Label":"Household Income (Median)", IsActive:false}
    ]
  // Create axes labels
  xlabelsGroup.data(xLabels).enter()
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("y", function(d,i){return 0 - 20*i;})
  .attr("data-axis", "x")
  .attr("data-name", function(d){return d.Name})
  .attr("class",function(d){return "aText x "+ (d.IsActive?"active":"inactive");})
  .text(function(d){return d.Label});

  d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);
    if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");
      var property ="c"+axis;
      var scaleFunction =null;
      if (axis === "x") {
        curX = name;
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[curX]), d3.max(Data, d => d[curX])])
        .range([0, width]);
        bottomAxis = d3.axisBottom(xLinearScale);
        svg.select(".xAxis").transition().duration(300).call(bottomAxis);
        scaleFunction = xLinearScale;
      }
      if (axis === "y") {
        curY = name;
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[curY]), d3.max(Data, d => d[curY])])
        .range([height, 0]);
        leftAxis = d3.axisBottom(yLinearScale);
        svg.select(".yAxis").transition().duration(300).call(leftAxis);
        scaleFunction = yLinearScale;
      }
      d3.selectAll("circle").each(function() {
        d3.select(this)
          .transition()
          .attr(property, function(d) {
             return scaleFunction(d[name]);
          })
          .duration(300);
      });
      d3.selectAll(".stateText").each(function() {
        d3.select(this)
          .transition()
          .attr("d"+axis, function(d) {
            return scaleFunction(d[name]) +((axis=="x")?0:10/2.5);
          })
          .duration(300);
      });
      labelChange(axis, self);
    }
  });
});

function labelChange(axis, clickedText) {
    
  // Switch the currently active to inactive.
  d3
    .selectAll(".aText")
    .filter("." + axis)
    .filter(".active")
    .classed("active", false)
    .classed("inactive", true);

  // Switch the text just clicked to active.
  clickedText.classed("inactive", false).classed("active", true);
}