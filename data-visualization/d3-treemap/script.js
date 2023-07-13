var width = 960,
  height = 570;

var body = d3.select("body");

var tooltip = d3.select("#tooltip");

var svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var legend = d3
  .select("#container")
  .append("svg")
  .attr("id", "legend")
  .attr("y", height)
  .attr("width", width);

var color = (color = d3.scaleOrdinal(d3.schemeCategory10));

var format = d3.format(",d");

var customSplit = (str) => {
  let arr = [],
    regex = /((?:\S+\s)\S+|-\s|\S+-\s|\S+:\s)/g,
    match;

  while ((match = regex.exec(str)) !== null) {
    arr.push(match[0].trim());
  }

  let remainder = str.match(/\S+(?=\s*$)/);
  let remainderItem = remainder && remainder.length > 0 ? remainder[0] : null;

  let lastTerm = arr.slice(-1).toString();

  let lastWord = lastTerm.match(/\S+(?=\s*$)/);
  let lastWordItem = lastWord && lastWord.length > 0 ? lastWord[0] : null;

  console.log(
    `STRING\n${str}\nREMAINDER\ntypeof: ${typeof remainder} value: ${remainder}\nLASTTERM\ntypeof: ${typeof lastTerm} value: ${lastTerm}\nLASTWORD\ntypeof: ${typeof lastWord} value: ${lastWord}\nREMAINDER == (or ===) LASTWORD? ${
      remainder == lastWord
    } ${remainderItem === lastWordItem}`
  );

  if (remainderItem !== lastWordItem) {
    arr.push(remainderItem);
  }

  return arr;
};

d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  (err, data) => {
    var treemap = d3.treemap().size([width, height]).paddingInner(1);

    var root = d3
      .hierarchy(data)
      .eachBefore((d) => {
        d.data.id = `${d.parent ? d.parent.data.id + "." : ""}${d.data.name}`;
      })
      .sum((d) => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    var cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    cell
      .append("rect")
      .attr("class", "tile")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr("fill", (d) => color(d.data.category))
      .on("mousemove", (d) => {
        tooltip
          .html(
            `<span class='name'>${d.data.name}</span>
             <span class='description'>$${format(d.data.value)} - ${
              d.data.category
            }</span>`
          )
          .attr("data-value", d.data.value)
          .style("opacity", 1)
          .style("left", `${d3.event.pageX}px`)
          .style("top", `${d3.event.pageY - 63}px`);
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0);
      });

    cell
      .append("text")
      .selectAll("tspan")
      .data((d) => customSplit(d.data.name))
      .enter()
      .append("tspan")
      .attr("x", 2)
      .attr("y", (d, i) => 10 + i * 12)
      .style("font-size", "8px")
      .style("font-family", "sans-serif")
      .style("pointer-events", "none")
      .text((d) => d);

    var legendCategories = root
      .leaves()
      .map((nodes) => nodes.data.category)
      .filter((category, index, self) => self.indexOf(category) === index);

    console.log(legendCategories);

    legend
      .append("g")
      .selectAll("rect")
      .data(legendCategories)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("x", (d, i) => i * 120)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d) => color(d));

    legend
      .append("g")
      .selectAll("text")
      .data(legendCategories)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * 120 + 25)
      .attr("y", 15)
      .text((d) => d)
      .style("font-size", "15px")
      .style("font-family", "sans-serif");
  }
);
