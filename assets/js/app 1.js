var svgWidth = 960;
var svgHeight = 500;

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

  d3.csv("assets/data/data.csv")
  .then(function(Data) {
    Data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
    console.log(Data)
    
  
// create scale functions and axis
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Data, d => d.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Data, d => d.poverty)])
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
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".5");

    //add states to circles

  circlesGroup.append("text")
    .attr("dx", d => xLinearScale(d.healthcare))
    .attr("dy", d => yLinearScale(d.poverty)+10/2.5)
    .text(function(d){return d.abbr})
    .attr("font-size", "8")
    .attr("class","stateText");
  });