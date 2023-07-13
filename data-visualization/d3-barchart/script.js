import * as d3 from "https://cdn.skypack.dev/d3@7.8.4";
let dataset = null;
const req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  true
);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  dataset = json.data;
  //document.getElementById("display").innerHTML = JSON.stringify(dataset);

  const h = 460;
  const w = 900;
  const p = 80;

  const parseDate = d3.timeParse("%Y-%m-%d");
  const formatQuarter = d3.timeFormat("%Y Q%q");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, (d) => parseDate(d[0])))
    .range([p, w - p]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - p, p]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const title = svg
    .append("text")
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .attr("x", w / 2)
    .attr("y", p)
    .attr("class", "graph-title")
    .text("United States GDP");

  const subtitle = svg
    .append("text")
    .attr("id", "subtitle")
    .attr("text-anchor", "middle")
    .attr("x", w / 2)
    .attr("y", p + 30)
    .attr("class", "graph-subtitle")
    .text("Data from Q1 1947 to Q3 2015");

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3.axisLeft(yScale);

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("opacity", 0);

  svg
    .append("g")
    .attr("transform", `translate(0, ${h - p})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", `translate(${p}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  const bars = svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => p + (i * (w - 2 * p)) / (dataset.length - 1))
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => h - yScale(d[1]) - p)
    .attr("width", (w - 2 * p) / (dataset.length - 1))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("class", "bar")
    .on("mouseover", (event, d) => {
      console.log(`${d[0]} ${d[1]} ${d3.pointer(d)}`);
      tooltip
        .style("opacity", 1)
        .style("left", d3.pointer(event)[0] + "px")
        .style("top", "400px")
        .attr("data-date", d[0])
        .html(
          `${formatQuarter(parseDate(d[0]))}<br>$${d[1].toFixed(1)} billion`
        );
    })
    .on("mouseout", (d) => tooltip.style("opacity", 0));
};
