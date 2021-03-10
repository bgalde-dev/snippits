
var us = convertToPercentages(Object.values(data.us));
var uk = convertToPercentages(Object.values(data.uk));
var canada = convertToPercentages(Object.values(data.canada));

var colMatrix = [us, uk, canada];
console.log(colMatrix);

// Create an array of music provider labels and countries
var countries = Object.keys(data);
var providers = Object.keys(data.us);

// Display the default plot
function init() {
  d3.select("#usCheck").property('checked',true);
  getData();
}

  // // On change to the DOM, call getData()
  d3.selectAll("#selDataset").on("change", getData);
  d3.select("#usCheck").on("change",getData);
  d3.select("#ukCheck").on("change",getData);
  d3.select("#caCheck").on("change",getData);
  d3.select("#pivotData").on("change",getData);
			
  // Function called by DOM changes
  function getData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var chartType = dropdownMenu.property("value");
    // Get the checkbox status
    var usChecked = d3.select("#usCheck").property("checked");
    var ukChecked = d3.select("#ukCheck").property("checked");
    var caChecked = d3.select("#caCheck").property("checked");

    var pivotData = d3.select("#pivotData").property("checked");

    if (pivotData) {
      d3.select("#usCheck").property('checked',true);
      d3.select("#ukCheck").property('checked',true);
      d3.select("#caCheck").property('checked',true);
    }

    var dataMatrix = pivotData ? colMatrix[0].map((_, colIndex) => colMatrix.map(row => row[colIndex])) : colMatrix;
    
    var data = [];

    for (let i = 0; i < (pivotData?4:3); i++) {
      data.push( {
        x: pivotData?countries:providers,
        y: dataMatrix[i],
        name: pivotData?providers[i]:countries[i],
        marker: { color: "blue" },
        type: 'bar'
      });
    }
    console.log(data);
    var colors = ['#b2e2e2','#66c2a4','#2ca25f','#006d2c'].reverse();
    if (pivotData) {
      for (let i = 0; i < data.length; i++) {
        data[i].visible = true;
        data[i].marker.color = colors[i];                 
      }
    } else {
      data[0].visible = usChecked ? true : "legendonly";
      data[0].marker.color = colors[0];
      data[1].visible = ukChecked ? true : "legendonly";
      data[1].marker.color = colors[1];
      data[2].visible = caChecked ? true : "legendonly";
      data[2].marker.color = colors[2];
        
    }
    
    var layout = {
      title: "Bar Chart",
      xaxis: { title: (pivotData?"County":"Provider") },
      yaxis: { title: "By Percentage by Country"},
      barmode: chartType,
      height: 600,
      width: 800
    };

    Plotly.newPlot('chart', data, layout);  // Call function to update the chart

  }
  function convertToPercentages(arr) {
    var total = arr.reduce((a, b) => a + b, 0);
    return arr.map(function (d) { return d / total * 100; });
  }

  init();



