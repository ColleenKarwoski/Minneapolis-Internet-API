

// Function to open the selected tab
function init() {
  // Call the default graph function
  drawIncomeGraph();
}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

function getData(tab) {
  //Clear prior graph
  let metahtml = d3.select("#graph-container")
  metahtml.text("")

  // Call the appropriate graph function based on the selected tab
  if (tab === "Income") {
    drawIncomeGraph();
  } else if (tab === "Race") {
    drawRaceGraph();
  } else if (tab === "Redline Grade") {
    drawRedlineGraph();
  }
}

function openTab(evt, tabName) {
  // Get all elements with class="tabcontent" and hide them
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  let tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  
  // Call the getData function with the selected tab name
  getData(tabName);
}

// Attach event listeners to the tab buttons
d3.select("#income-tab").on("click", function() {
  getData("Income");
});
d3.select("#race-tab").on("click", function() {
  getData("Race");
});
d3.select("#redline-tab").on("click", function() {
  getData("Redline Grade");
});



// Function to draw the default graph
function drawRaceGraph(){
  const url = "http://127.0.0.1:5000/";
  
  // Fetch the JSON data
  d3.json(url).then(function(data) {
    // Process the data
    const nestedData = d3.nest()
      .key(d => d.speed_down_bins)
      .key(d => d.race_quantile)
      .rollup(values => values.length)
      .entries(data);
  
    const customOrder= ["more white", "most white", "less white", "least"]
  
    // Compute the stacked data
    const stackedData = d3.stack()
      .keys(nestedData[0].values.map(d => d.key))
      .value((d, key) => (d.values.find(v => v.key === key) || { value: 0 }).value)
      .order(d3.stackOrderDescending)
      .offset(d3.stackOffsetNone)
      (nestedData);
  
      // Rearrange the order of the keys in the stackedData array
    const keys = ['most white', 'more white', 'less white', 'least white'];
    const stackedDataModified = keys.map(key => stackedData.find(d => d.key === key));
  
    // Define the margin, width, and height of the chart
    const margin = { top: 20, right: 70, bottom: 70, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    // Create the SVG element
    const svg = d3.select("#graph-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Define the x and y scales
    const x = d3.scaleBand()
      .domain(['Blazing (≥200)', 'Fast (100-199)', 'Medium (25-99)', 'Slow (<25 Mbps)'])
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .range([height, 0]);
  
    // Define the color scale
    const color = d3.scaleOrdinal()
      .domain(stackedData.map(d => d.key))
      .range(["#238b45", "#74c476", "#addd8e","#e5f5e0"]);
    
      // Define the tooltip  
  let tooltip = d3.select("#graph-container")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("tooltip");  

      // Add the bars
    svg.selectAll(".bar")
      .data(stackedDataModified)
      .enter().append("g")
      .attr("class", "bar")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("x", d => x(d.data.key))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function(d) {
        let total = d3.sum(d.data.values, v => v.value);
        let percentage = ((d[1] - d[0]) / total * 100).toFixed(2);
        tooltip.text(percentage + "%");
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function() {
        tooltip.style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });
  
    // Add the x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .style("font-size", "16px");
    
    // Add the x-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 12)
      .text("Download Speeds")
      .style("text-anchor", "middle")
      .style("font-size", "20px");   
 
  
  
    // Add the y-axis
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));

    // 
    // Add the y-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 14)
      .attr("transform", "rotate(-90)")
      .text("Number of Households")
      .style("text-anchor", "middle")
      .style("font-size", "20px");

  
    // Define the legend
  const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - 120}, 10)`)
  .selectAll("g")
  .data(stackedDataModified.map(d => d.key))
  .enter().append("g")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);
  
  // Add the legend rectangles
  legend.append("rect")
  .attr("x", 0)
  .attr("width", 18)
  .attr("height", 18)
  .attr("fill", color);
  
  // Add the legend text
  legend.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text(d => d)
  .style("font-size", "16px")
  })};

  // Call the plotly function to create the graph
  //Plotly.newPlot("pie", data, layout);


  function drawIncomeGraph() {
    const url = "http://127.0.0.1:5000/";
    
    // Fetch the JSON data
    d3.json(url).then(function(data) {
      // Process the data
      let nestedDataInc = d3.nest()
        .key(d => d.speed_down_bins)
        .key(d => d.income_level)
        .rollup(values => values.length)
        .entries(data);
  
  
      // Compute the stacked data
      let IncstackedData = d3.stack()
        .keys(nestedDataInc[0].values.map(d => d.key))
        .value((d, key) => (d.values.find(v => v.key === key) || { value: 0 }).value)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
        (nestedDataInc);
  
      // Rearrange the order of the keys in the stackedData array
      let Inckeys = ['Low', 'Middle-Lower', 'Middle-Upper', 'Upper Income'];
      let IncstackedDataModified = Inckeys.map(key => IncstackedData.find(d => d.key === key));
  
      // Define the margin, width, and height of the chart
      const margin = { top: 20, right: 70, bottom: 70, left: 70 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
  
      // Create the SVG element
      let incsvg = d3.select("#graph-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      // Define the x and y scales
      let x = d3.scaleBand()
        .domain(['Blazing (≥200)', 'Fast (100-199)', 'Medium (25-99)', 'Slow (<25 Mbps)'])
        .range([0, width])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(IncstackedDataModified, d => d3.max(d, d => d[1]))])
        .range([height, 0]);
  
      // Define the color scale
      const color = d3.scaleOrdinal()
        .domain(IncstackedDataModified.map(d => d.key))
        .range(["#0570b0", "#bdc9e1", "#74a9cf","#f1eef6"]);
        
      
        let inctooltip = d3.select("#graph-container")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("tooltip");   
  

      // Add the bars
      incsvg.selectAll(".bar")
        .data(IncstackedDataModified)
        .enter().append("g")
        .attr("class", "bar")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.key))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", function(d) {
          let total = d3.sum(d.data.values, v => v.value);
          let percentage = ((d[1] - d[0]) / total * 100).toFixed(2);
          inctooltip.text(percentage + "%");
          inctooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
          inctooltip.style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          inctooltip.style("visibility", "hidden");
        });
     
      // Add the x-axis
      incsvg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "16px");
    
      // Add the x-axis label
      incsvg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 12)
        .text("Download Speeds")
        .style("text-anchor", "middle")
        .style("font-size", "20px");   
  
      // Add the y-axis
      incsvg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

      incsvg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 14)
        .attr("transform", "rotate(-90)")
        .text("Number of Households")
        .style("text-anchor", "middle")
        .style("font-size", "20px");  

       
      // Define the legend
      let inclegend = incsvg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 120}, 10)`)
      .selectAll("g")
      .data(Inckeys.reverse())
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);
  
      // Add the legend rectangles
      inclegend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color);
  
      // Add the legend text
      inclegend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(d => d)  
      .style("font-size", "16px");
      });  
  
  }

// Function to draw redline graph
function drawRedlineGraph(){
  const url = "http://127.0.0.1:5000/";
  
// Fetch the JSON data
d3.json(url).then(function(data) {
  // Process the data
  let nestedDataRL = d3.nest()
    .key(d => d.speed_down_bins)
    .key(d => d.redlining_grade)
    .rollup(values => values.length)
    .entries(data);

    nestedDataRL.forEach(function(d) {
      d.values = d.values.filter(function(v) {
        return ['A', 'B', 'C', 'D'].indexOf(v.key) !== -1;
      });
    });  


  // Compute the stacked data
  let RLstackedData = d3.stack()
    .keys(nestedDataRL[0].values.map(d => d.key))
    .value((d, key) => (d.values.find(v => v.key === key) || { value: 0 }).value)
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetNone)
    (nestedDataRL);

  // Rearrange the order of the keys in the stackedData array
  let RLkeys = ['A', 'B', 'C', 'D'];
  let RLstackedDataModified = RLkeys.map(key => RLstackedData.find(d => d.key === key));

  // Define the margin, width, and height of the chart
  const margin = { top: 20, right: 70, bottom: 70, left: 70 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create the SVG element
  let RLsvg = d3.select("#graph-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Define the x and y scales
  let x = d3.scaleBand()
    .domain(['Blazing (≥200)', 'Fast (100-199)', 'Medium (25-99)', 'Slow (<25 Mbps)'])
    .range([0, width])
    .padding(0.1);

  let y = d3.scaleLinear()
    .domain([0, d3.max(RLstackedData, d => d3.max(d, d => d[1]))])
    .range([height, 0]);

  // Define the color scale
  let color = d3.scaleOrdinal()
    .domain(RLstackedData.map(d => d.key))
    .range(["#54278f", "#756bb1", "#9e9ac8","#cbc9e2"]);

  // Define the tooltip  
  let RLtooltip = d3.select("#graph-container")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("tooltip");

  // Add the bars
  RLsvg.selectAll(".bar")
    .data(RLstackedDataModified)
    .enter().append("g")
    .attr("class", "bar")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", d => x(d.data.key))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .on("mouseover", function(d) {
      let total = d3.sum(d.data.values, v => v.value);
      let percentage = ((d[1] - d[0]) / total * 100).toFixed(2);
      RLtooltip.text(percentage + "%");
      RLtooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      RLtooltip.style("top", (d3.event.pageY - 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      RLtooltip.style("visibility", "hidden");
    });
    

  
  // Add the x-axis
  RLsvg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .style("font-size", "16px");

  // Add the x-axis label
  RLsvg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 12)
    .text("Download Speeds")
    .style("text-anchor", "middle")
    .style("font-size", "20px");  

  // Add the y-axis
  RLsvg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

  RLsvg.append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 14)
    .attr("transform", "rotate(-90)")
    .text("Number of Households")
    .style("text-anchor", "middle")
    .style("font-size", "20px");  

  // Define the legend
  let RLlegend = RLsvg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - 120}, 10)`)
  .selectAll("g")
  .data(RLstackedDataModified.map(d => d.key))
  .enter().append("g")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  // Add the legend rectangles
  RLlegend.append("rect")
  .attr("x", 0)
  .attr("width", 18)
  .attr("height", 18)
  .attr("fill", color);

  // Add the legend text
  RLlegend.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text(d => d)
  .style("font-size", "16px");  
  });  

  

}

// Call the init function to display the default graph on page load
init();











