// The index of the point that the user has chosen
let userSelectedIndex = 100


runSummaryVis = function (data) {
  //var strain = data[userSelectedIndex][3];
  //setCursorPos(data[userSelectedIndex][0], data[userSelectedIndex][1], data[userSelectedIndex][2]);
  var i = 4*userSelectedIndex;
  var x = data[i + 0];
  var y = data[i + 1];
  var z = data[i + 2];
  var strain = data[i + 3];
  OnNewData(strain);
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



setInspectNode = function (v) {
  userSelectedIndex = parseInt(v);
  ResetData();
}
