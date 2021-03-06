function wordsChain(){
  var bleed = 100,
  width = 960,
  height = 760;

  var pack = d3.layout.pack()
  .sort(null)
  .size([width, height + bleed * 2])
  .padding(2);

  var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(0," + -bleed + ")");

  d3.json("data.json", function(error, json) {
    if (error) throw error;

    var node = svg.selectAll(".node")
    .data(pack.nodes(flatten(json))
    .filter(function(d) { return !d.children; }))
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
    .attr("r", function(d) { return d.r; });

    node.append("text")
    .text(function(d) { return d.name; })
    .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
    .attr("dy", ".35em");
  });

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function flatten(root) {
    var nodes = [];

    function recurse(node) {
      if (node.children) node.children.forEach(recurse);
      else nodes.push({name: node.name, value: node.size});
    }

    recurse(root);
    return {children: nodes};
  }
}

function pie(){
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    $.getJSON('data.json', function(jsonData) { 
      data.addColumn('string', 'name');
      data.addColumn('number', 'followers');
      jsonData.children.forEach(function(child){
        data.addRows([[child.name, child.size]]);
      });

      // Set chart options
      var options = {'title':'Am I followed?','legend':'left','is3D':true,'width':1600,'height':1200};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    });
  }
}