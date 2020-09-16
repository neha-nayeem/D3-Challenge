// Create a function to make a responsive chart
// ============================================

function makeResponsive() {

    // Select the SVG area
    var svgArea = d3.select("body").select("svg");

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Set up the chart
    // ================================

    // SVG dimensions
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight / 1.5;

    // Margins
    var margin = {
        top: 50,
        right: 110,
        bottom: 120,
        left: 150
    };

    // Chart dimensions
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Create svg container
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append a chart group to the SVG and move it to the top left 
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import data from the data.csv file
    // =================================

    d3.csv("assets/data/data.csv").then(censusData => {

        // Parse the data to convert to numerical values
        // =================================

        censusData.forEach(data => {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
        });

        // Initial chart x,y parameters
        // ============================================

        var xAxisFactor = "poverty";
        var yAxisFactor = "healthcare";

        // Initial active information card
        // ============================================
        var activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
        activeCard.style("display", "block");


        // Create x,y scales
        // ============================================

        var xScale = d3.scaleLinear().range([0, chartWidth]);
        var yScale = d3.scaleLinear().range([chartHeight, 0]);

        xScale.domain(domainX(censusData, xAxisFactor));
        yScale.domain(domainY(censusData, yAxisFactor));

        // Create Axes
        // =============================================

        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // Append the axes to the chartGroup
        // ==============================================

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // Create labels for x,y axes
        // ==============================

        var yAxesLabels = chartGroup.append("g");
        var xAxesLabels = chartGroup.append("g");

        // All yaxis labels
        var healthcare = yAxesLabels.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", margin.top - chartHeight / 2 - 20)
            .attr("y", 115 - margin.left)
            .attr("class", "aText active yaxis-label")
            .attr("value", "healthcare")
            .text("Lacks Healthcare (%)");

        var smokes = yAxesLabels.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", margin.top - chartHeight / 2 - 20)
            .attr("y", 90 - margin.left)
            .attr("class", "aText inactive yaxis-label")
            .attr("value", "smokes")
            .text("Smokes (%)");

        var obese = yAxesLabels.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", margin.top - chartHeight / 2 - 20)
            .attr("y", 65 - margin.left)
            .attr("class", "aText inactive yaxis-label")
            .attr("value", "obesity")
            .text("Obese (%)");

        // All xaxis labels
        var poverty = xAxesLabels.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
            .attr("class", "aText active xaxis-label")
            .attr("value", "poverty")
            .text("In Poverty (%)");

        var age = xAxesLabels.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 15})`)
            .attr("class", "aText inactive xaxis-label")
            .attr("value", "age")
            .text("Age (Median)");

        var income = xAxesLabels.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 40})`)
            .attr("class", "aText inactive xaxis-label")
            .attr("value", "income")
            .text("Household Income (Median)");

        // Append circles to data points
        // ===============================
        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[xAxisFactor]))
            .attr("cy", d => yScale(d[yAxisFactor]))
            .attr("r", "10")
            .attr("opacity", "0.6")
            .classed("stateCircle", true);

        // State labels in circles
        // ========================= 
        var stateLabels = chartGroup.append("g")
            .selectAll("text")
            .data(censusData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d[xAxisFactor]))
            .attr("y", d => yScale(d[yAxisFactor]) + 3.5)
            .classed("stateText", true)
            .text(d => d.abbr)

        // Call the updateTooltip function to create toolTip
        // ====================================================
        updateTooltip(xAxisFactor, yAxisFactor, circlesGroup, stateLabels);

        // Event listeners for axes changes
        // =================================

        // on clicking X axis labels
        xAxesLabels.selectAll("text").on("click", function() {

            // Store the value clicked
            var xAxisValue = d3.select(this).attr("value");

            // If the value is different from the the one drawn by default
            if (xAxisValue !== xAxisFactor) {

                // Hide current info card
                activeCard.style("display", "none");

                // Assign new value to xAxisFactor
                xAxisFactor = xAxisValue;

                // Create new xScale domain
                xScale.domain(domainX(censusData, xAxisFactor));

                // Update xAxis with new scale
                updateXAxis(xScale, xAxis);

                // Update circles, state labels and tooltip
                updatePlot(circlesGroup, stateLabels, xScale, yScale, xAxisFactor, yAxisFactor);
                updateTooltip(xAxisFactor, yAxisFactor, circlesGroup, stateLabels);


                // switch statement for updating clicked label to active and others to inactive
                switch (xAxisFactor) {
                    case "poverty":
                        poverty.attr("class", "active");
                        age.attr("class", "inactive");
                        income.attr("class", "inactive");
                        // make relevant info card visible
                        activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
                        activeCard.style("display", "block");
                        break;
                    case "age":
                        age.attr("class", "active");
                        income.attr("class", "inactive");
                        poverty.attr("class", "inactive");
                        // make relevant info card visible
                        activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
                        activeCard.style("display", "block");
                        break;
                    case "income":
                        income.attr("class", "active");
                        poverty.attr("class", "inactive");
                        age.attr("class", "inactive");
                        // make relevant info card visible
                        activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
                        activeCard.style("display", "block");
                        break;
                    default:
                        break;
                }; // switch statement

            }; // if statement

        }); // close "on click" function for x axis

        // on clicking Y axis labels
        yAxesLabels.selectAll("text").on("click", function() {

            // Store the value clicked           
            var yAxisValue = d3.select(this).attr("value");

            // If the value is different from the one drawn by default
            if (yAxisValue !== yAxisFactor) {

                // hide current info card
                activeCard.style("display", "none");

                // Assign new value to yAxisFactor
                yAxisFactor = yAxisValue;

                // Create new yScale domain
                yScale.domain(domainY(censusData, yAxisFactor));

                // Update yAxis with new scale
                updateYAxis(yScale, yAxis);

                // update circles, state labels and tooltip
                updatePlot(circlesGroup, stateLabels, xScale, yScale, xAxisFactor, yAxisFactor);
                updateTooltip(xAxisFactor, yAxisFactor, circlesGroup, stateLabels);

                // switch statement to update clicked label to active and others to inactive
                switch (yAxisFactor) {
                    case "healthcare":
                        healthcare.attr("class", "active");
                        smokes.attr("class", "inactive");
                        obese.attr("class", "inactive");

                        // make relevant info card visible
                        activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
                        activeCard.style("display", "block");
                        break;
                    case "smokes":
                        smokes.attr("class", "active");
                        healthcare.attr("class", "inactive");
                        obese.attr("class", "inactive");

                        // make relevant info card visible
                        activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
                        activeCard.style("display", "block");
                        break;
                    case "obesity":
                        obese.attr("class", "active");
                        smokes.attr("class", "inactive");
                        healthcare.attr("class", "inactive");

                        // make relevant info card visible
                        activeCard = d3.select(`#${xAxisFactor}-${yAxisFactor}`);
                        activeCard.style("display", "block");
                        break;
                    default:
                        break;
                }; // switch statement

            }; // if statement

        }); // close "on click" function for y axis       


    }).catch(function(error) {
        console.log(error);
    });

}; // close responsiveChart() 


// Functions to determine x,y domains for scaling 
// ==================================================  
function domainX(dataset, factor) {
    var domain = d3.extent(dataset, data => data[factor]);
    return domain;
};

function domainY(dataset, factor) {
    var maxValue = d3.max(dataset, data => data[factor]);
    var domain = [0, maxValue];
    return domain;
};

// Functions to update axes transitions
// =====================================
function updateXAxis(xScale, xAxis) {
    var newXAxis = d3.axisBottom(xScale);

    // transition to change old xAxis to newXAxis
    xAxis.transition()
        .duration(1000)
        .call(newXAxis);
};

function updateYAxis(yScale, yAxis) {
    var newYAxis = d3.axisLeft(yScale);

    // transition to change old yAxis to newYAxis
    yAxis.transition()
        .duration(1000)
        .call(newYAxis);

};

// Function to update scatter plot (circles and text labels)
// ================================================================
function updatePlot(circlesGroup, stateLabels, xScale, yScale, xAxisFactor, yAxisFactor) {

    // transition new circlesGroup by changing their posiitons according to new values
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xScale(d[xAxisFactor]))
        .attr("cy", d => yScale(d[yAxisFactor]));

    // transition new state labels by changing their posiitons according to new values   
    stateLabels.transition()
        .duration(1000)
        .attr("x", d => xScale(d[xAxisFactor]))
        .attr("y", d => yScale(d[yAxisFactor]) + 3.5)

};

// Function to update Tooltip
// ================================================================
function updateTooltip(xAxisFactor, yAxisFactor, circlesGroup, stateLabels) {

    // create variables for displaying labels in tooltip
    var tooltipX = "";
    var tooltipY = "";
    var unitX = "";
    var unitY = "%";

    // switch statement for xAxis value/label
    switch (xAxisFactor) {
        case "poverty":
            tooltipX = "Poverty";
            unitX = "%";
            break;
        case "age":
            tooltipX = "Age";
            break;
        case "income":
            tooltipX = "Household Income";
            break;
        default:
            break;
    };

    // switch statement for yAxis value/label
    switch (yAxisFactor) {
        case "healthcare":
            tooltipY = "Lacks Healthcare";
            unit = "%"
            break;
        case "smokes":
            tooltipY = "Smokes";
            unit = "%"
            break;
        case "obesity":
            tooltipY = "Obesity";
            unit = "%"
            break;
        default:
            break;
    };

    // Initialize D3 tooltip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([40, -80])
        .html(function(d) {
            return (`<strong>${d.state}</strong><br>${tooltipX}: ${d[xAxisFactor]}${unitX}<br>${tooltipY}: ${d[yAxisFactor]}${unitY}`);
        });

    // Create tooltip in the chart for both circles and state label groups
    // =======================================================================
    circlesGroup.call(toolTip);
    stateLabels.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", d => {
            toolTip.show(d, this)
        })
        .on("mouseout", d => {
            toolTip.hide(d);
        });

    stateLabels.on("mouseover", d => {
            toolTip.show(d, this)
        })
        .on("mouseout", d => {
            toolTip.hide(d);
        });
};

makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);