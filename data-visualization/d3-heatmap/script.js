var width = 1400,
  height = 800,
  padding = 150,
  legendWidth = width - padding * 4,
  legendHeight = padding / 2,
  legendBarHeight = 30;

var graph = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var legend = graph
  .append("g")
  .attr("id", "legend")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("transform", `translate(${padding * 2},${height - padding})`);

var tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((data) => {
    var dataset = data.monthlyVariance;
    var baseTemp = data.baseTemperature;

    dataset.forEach((d) => {
      d.month--;
      d.temperature = baseTemp + d.variance;
    });

    var barWidth = (12 * (width - padding * 2)) / (dataset.length - 1);

    var tempArray = dataset.map((d) => d.temperature);

    var tempRange = d3.extent(tempArray),
      tempMin = tempRange[0],
      tempMax = tempRange[1],
      tempDiff = tempMax - tempMin;

    var stepCount = 10;
    var legendStep = tempDiff / stepCount;

    var legendValues = [];

    for (let i = 0; i <= stepCount; i++)
      legendValues.push(tempMin + legendStep * i);

    console.log(
      `min: ${tempMin} max: ${tempMax} step: ${legendStep} values: ${legendValues}`
    );

    var colorScale = d3
      .scaleLinear()
      .domain([tempMin, ((tempMin + tempMax) / 2) * 1.05, tempMax])
      .range(["#1825c8", "#fff5a7", "#b63636"])
      .interpolate(d3.interpolateRgb);

    var legendScale = d3
      .scaleBand()
      .domain(legendValues)
      .range([0, legendWidth]);

    var xScale = d3
      .scaleLinear()
      .domain([1753, 2016])
      .range([padding, width - padding]);

    var yScale = d3
      .scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      .range([padding, height - padding]);

    var legendAxis = d3.axisBottom(legendScale).tickFormat(d3.format(".1f"));

    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    var yAxis = d3.axisLeft(yScale).tickFormat((m) => {
      var date = new Date(2000, m);
      return date.toLocaleString("default", { month: "long" });
    });

    d3.select("body")
      .append("text")
      .attr("id", "title")
      .html("Monthly Global Land-Surface Temperature");

    d3.select("body")
      .append("text")
      .attr("id", "description")
      .html("Base temperature: 8.66℃");
    //
    legend
      .append("g")
      .attr("id", "legend-axis")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);

    graph
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    graph
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    legend
      .selectAll("rect")
      .data(legendValues)
      .enter()
      .append("rect")
      .attr("width", legendScale.bandwidth())
      .attr("height", `${legendBarHeight}`)
      .attr("x", (d, i) => legendScale.bandwidth() * i)
      .attr("y", `${legendHeight - legendBarHeight}`)
      .attr("fill", (d) => colorScale(d));

    graph
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => d.month)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => d.temperature)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month))
      .attr("width", barWidth)
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.temperature))
      .on("mouseover", (event, d) => {
        var dataDate = new Date(d.year, d.month),
          tooltipDate = dataDate.toLocaleString("default", {
            year: "numeric",
            month: "long"
          });
        tooltip
          .style("opacity", 1)
          .style("top", `${yScale(d.month) - 100}px`)
          .style("left", `${xScale(d.year) - 75}px`)
          .attr("data-year", d.year)
          .attr("id", "tooltip").html(`
        <span class="tooltip-text">${tooltipDate}</span>
        <span class="tooltip-text">Temperature: ${d.temperature.toFixed(
          1
        )}℃</span>
        <span class="tooltip-text">Variance: ${d.variance.toFixed(1)}℃</span>`);
      })
      .on("mouseout", (event) => tooltip.style("opacity", 0));
  })
  .catch((err) => console.error(`${err.stack}`));
