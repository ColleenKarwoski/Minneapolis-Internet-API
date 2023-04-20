const url = "http://127.0.0.1:5000/";

// Use d3.json() to make an API call and get the JSON data
d3.json(url).then(function(data) {
  // Use the data here
  const fiberCounts = {"Low":0, "Middle-Lower":0, "Middle-Upper": 0, "Upper Income": 0 };
const nonFiberCounts = { "Low":0, "Middle-Lower":0, "Middle-Upper": 0, "Upper Income": 0 };

// Loop through the data and count the number of each income level for each technology type
for (const row of data) {
  const incomeLevel = row.income_level;
  const technology = row.technology;

  if (technology === "Fiber") {
    fiberCounts[incomeLevel]++;
  } else {
    nonFiberCounts[incomeLevel]++;
  }
}

// Filter out NaN values from the series arrays
const fiberSeries = Object.values(fiberCounts).filter(value => !isNaN(value));
const nonFiberSeries = Object.values(nonFiberCounts).filter(value => !isNaN(value));

// Create the fiber pie chart
const fiberChart = new ApexCharts(document.querySelector("#chart1"), {
  series: fiberSeries,
  labels: Object.keys(fiberCounts),
  chart: {
    width: 380,
    type: "pie",
  },
  title: {
    text: "Income Levels for Fiber Technology",
    align: "center",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
});

fiberChart.render();

// Create the non-fiber pie chart
const nonFiberChart = new ApexCharts(document.querySelector("#chart2"), {
  series: nonFiberSeries,
  labels: Object.keys(nonFiberCounts),
  chart: {
    width: 380,
    type: "pie",
  },
  title: {
    text: "Income Levels for Non-Fiber Technology",
    align: "center",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
});

nonFiberChart.render()
});
