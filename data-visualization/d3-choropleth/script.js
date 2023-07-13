var body = d3.select("body");

body.append("svg");

body
  .append("text")
  .attr("id", "title")
  .text("US Educational Attainment Per County");

body
  .append("text")
  .attr("id", "description")
  .text(`Adults 25 or over with a bachelor's degree or higher (2010 - 2014)`);

var svg = d3.select("svg").attr("width", 960).attr("height", 700);

var path = d3.geoPath();

var tooltip = body.append("div").attr("id", "tooltip").attr("opacity", 0);

var legendScale = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

var colors = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeBlues[9]);

var legend = svg
  .append("g")
  .attr("id", "legend")
  .attr("transform", "translate(0,40)");

legend
  .selectAll("rect")
  .data(
    colors.range().map((d) => {
      d = colors.invertExtent(d);
      return d;
    })
  )
  .enter()
  .append("rect")
  .attr("height", 8)
  .attr("width", (d) =>
    d[0] && d[1] ? legendScale(d[1]) - legendScale(d[0]) : legendScale(null)
  )
  .attr("x", (d) => legendScale(d[0]))
  .attr("fill", (d) => colors(d[0]));

legend
  .call(
    d3
      .axisBottom(legendScale)
      .tickSize(10)
      .tickFormat((d) => Math.round(d) + "%")
      .tickValues(colors.domain())
  )
  .select(".domain")
  .remove();

const educationData =
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
  countyData =
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

Promise.all([d3.json(educationData), d3.json(countyData)])
  .then((data) => renderData(data[0], data[1]))
  .catch((err) => console.log(err));

function renderData(edu, map) {
  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(map, map.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("fill", (d) => {
      var match = edu.filter((o) => o.fips === d.id);
      if (match[0]) {
        return colors(match[0].bachelorsOrHigher);
      } else {
        console.log(`Data is missing for ${d.id} at fill.`);
        return 0;
      }
    })
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      var match = edu.filter((o) => o.fips === d.id);
      if (match[0]) {
        return match[0].bachelorsOrHigher;
      } else {
        console.log(`Data is missing for ${d.id} at data-education.`);
        return 0;
      }
    })
    .attr("d", path)
    .on("mouseover", (event, d) => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px")
        .style("opacity", 1)
        .attr("data-education", function () {
          var match = edu.filter((o) => o.fips === d.id);
          if (match[0]) {
            return match[0].bachelorsOrHigher;
          } else {
            console.log(
              `Data is missing for ${d.id} at tooltip data-education.`
            );
            return 0;
          }
        })
        .html(function () {
          var match = edu.filter((o) => o.fips === d.id);
          if (match[0]) {
            return `${match[0]["area_name"]}, ${match[0]["state"]}: ${match[0].bachelorsOrHigher}%`;
          } else {
            console.log(`Data is missing for ${d.id} at tooltip draw.`);
          }
        });
    })
    .on("mouseout", (event, d) => tooltip.style("opacity", 0));

  svg
    .append("path")
    .datum(topojson.mesh(map, map.objects.states, (a, b) => a !== b))
    .attr("d", path)
    .attr("stroke", "#fff")
    .attr("fill", "none");
}
