var d = new Date()
var d1 = d3.timeHour.offset(d, 2)
var d2 = d3.timeHour.offset(d, 4)
var experiments = [{time: d, values: [0,1], x:1.318999999999999950,y:-3.967999999999999861,z:-8.551000000000000512},{time: d1, values: [0,1], x:4.208000000000000007,y:-6.014000000000000457,z:-8.095999999999999375},{time: d2, values: [1,1], x:7.074000000000000021,y:-9.483000000000000318,z:-7.501000000000000512}]

let allData = []
let initialised = false
var colorScale = d3.scaleOrdinal().range(['#FFC3C8', '#C49BEA', '#889DD4', '#FFD7D7', '#EAC8E7', '#C5C5C5', '#97DCF1', '#C8F1EB', ]);

var curentDate = new Date()
// The index of the point that the user has chosen
let userSelectedIndex = 100
let userSelectedField = "strain"

runSummaryVis = function (data) {
  //let currentPoint = data["3ddata"][userSelectedIndex]["values"][0];
  //console.log(currentPoint);
  //console.log(data);
  //console.log(data[0]);
  var currentPoint = 10;
  var strain = data[currentPoint][3];
  //console.log(data[currentPoint]);
  OnNewData(strain);
  //getPointTimeSeries(0);
  //getData();
}

/**
 * Helper function to get the min time of a dataset
 */
getMinMax = function (allData) {
  let min = new Date();
  let max = new Date();
  for (var e in allData) {
    if (e.time < min) {
      min = e.time
    }
    if (e.time > max) {
      max = e.time
    }
  }
  return {min: min, max: max}
}


/**
 * A Box plot function that uses the values of the experiments.
 */
makeBoxPlot = function (ndx, colorScale) {
}



/**
 * A Line chart
 */
makeLineChart = function (ndx, colorScale, min, max) {
}
