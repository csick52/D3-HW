// Establish chart width, height, and margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom

// Create SVG wrapper, append SVG group that will hold chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the data
d3.csv("./assets/data/data.csv")
    .then(function(stateData) {

        // Parse data, cast numbers
        stateData.forEach(function(data) {
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
        });

        // Create scale function
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(stateData, data => data.smokes)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([20, d3.max(stateData, data => data.obesity)])
            .range([height, 0]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append axes to the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Create circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx", data => xLinearScale(data.smokes))
            .attr("cy", data => yLinearScale(data.obesity))
            .attr("r", 10)
            .attr("fill", "orange")
            .attr("opacity", "0.5");

        // Add text to circles
        circlesGroup.selectAll("text")
            .data(stateData)
            .enter()
            .append("text")
            .text(function(data) {
                return data.abbr
            })
            .attr("x", data => xLinearScale(data.smokes))
            .attr("y", data => yLinearScale(data.obesity))
            .attr("font_family", "sans-serif")  // Font type
            .attr("font-size", "11px")  // Font size
            .attr("fill", "darkgreen");   // Font color;

        // Initialize tool tip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(data) {
                return (`${data.state}<br>Smokes: ${data.smokes}<br>Obesity: ${data.obesity}`);
            });

        // Create tool tip in chart
        chartGroup.call(toolTip);

        // Create event listeners to make tool tips interactive
        circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
        }).on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("% Population Who Is Obese");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("% Population Who Smokes");
    });