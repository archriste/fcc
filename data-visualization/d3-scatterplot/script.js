const redColor = "rgba(255,50,59,0.7)";
const greenColor = "rgba(97,198,155,0.7)";

var width = 900,
  height = 600,
  padding = 50;

var svgContainer = d3
  .select("body")
  .append("svg")  
  .attr("id", "container")
  .attr("width", width + "px")
  .attr("height", height + "px");

var tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", "0");

var legend = d3.select("body").append("div").attr("id", "legend").html(`
      <div class='legend-item'>
        <span class='legend-label'>Accused of doping</span>
        <div class='legend-color red'></div>
      </div>
      <div class='legend-item'>
        <span class='legend-label'>Not accused of doping</span>
        <div class='legend-color green'></div>
      </div>
    `);

const formatMinSec = d3.timeFormat("%M:%S");

const formatYear = d3.timeFormat("%Y");

var xScale = d3.scaleTime().range([padding, width - padding]);

var yScale = d3.scaleTime().range([padding, height - padding]);

var xAxis = d3.axisBottom(xScale).tickFormat(formatYear);

var yAxis = d3.axisLeft(yScale).tickFormat(formatMinSec);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((data) => {
    data.forEach(function (d) {
      d.Year = new Date(d.Year, 0);
      var splitTime = d.Time.split(":");
      d.Time = new Date(2000, 0, 0, 0, splitTime[0], splitTime[1]);
      d.Doping ? (d.Doping = `\n\n${d.Doping}`) : null;
    });

    var xExtent = d3.extent(data, (d) => d.Year.getFullYear());

    console.log(xExtent);
  
    var xMin = new Date(xExtent[0] - 1, 0);
    var xMax = new Date(xExtent[1], 0);

    var yExtent = d3.extent(data, (d) => d.Time);

    var yMin = yExtent[0];
    var yMax = new Date(yExtent[1].getTime() + 5000);

    xScale.domain([xMin, xMax]);

    yScale.domain([yMin, yMax]);

    svgContainer
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year.getFullYear())
      .attr("data-yvalue", (d) => d.Time)
      .attr("r", "5px")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("fill", (d) => (d.Doping ? redColor : greenColor))
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", "1")
          .attr("data-year", d.Year.getFullYear())
          .style("left", `${xScale(d.Year)}px`)
          .style("top", `${yScale(d.Time)}px`)
          .html(`
        <span class='tooltip-text'>
        ${d.Name}: ${d.Nationality}
        </span>
        <span class='tooltip-text'>
        Year: ${formatYear(d.Year)}, Time: ${formatMinSec(d.Time)}
        </span>
        <span class='tooltip-text'>
        ${d.Doping}
        </span>
        
      `);
      })
      .on("mouseout", (e) => tooltip.style("opacity", "0"));

    svgContainer
      .append("text")
      .text("Doping in Professional Bicycle Racing")
      .attr("id", "title")
      .attr("x", "450px")
      .attr("y", "40px")
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "28px");

    svgContainer
      .append("text")
      .text("Time (minutes)")
      .attr("x", "-300px")
      .attr("y", "30px")
      .attr("transform", "rotate(-90deg)");

    svgContainer
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svgContainer
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);
  })
  .catch((err) => console.log(err));
