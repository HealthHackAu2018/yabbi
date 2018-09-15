var ndx
var d = new Date()
var d1 = d3.timeHour.offset(d, 2)
var d2 = d3.timeHour.offset(d, 4)
var experiments = [{time: d, values: [0,1], x:1.318999999999999950,y:-3.967999999999999861,z:-8.551000000000000512},{time: d1, values: [0,1], x:4.208000000000000007,y:-6.014000000000000457,z:-8.095999999999999375},{time: d2, values: [1,1], x:7.074000000000000021,y:-9.483000000000000318,z:-7.501000000000000512}]
ndx = crossfilter(experiments)
var colorScale = d3.scaleOrdinal().range(['#FFC3C8', '#C49BEA', '#889DD4', '#FFD7D7', '#EAC8E7', '#C5C5C5', '#97DCF1', '#C8F1EB', ]);

/**
 * Helper function to get the min time of a dataset
 */
getMinMax = function (experiments) {
  let min = new Date();
  let max = new Date();
  for (var e in experiments) {
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
  let groupingIndex = 0
  let boxPlot = dc.boxPlot('#box-plot')
  let xDimension = ndx.dimension(function (d) {
      return d.x;
  })

  let valuesGroup = xDimension.group().reduce(
    function (p, v) {
      // Here choose which index to use for the values
      p.push(_.round(v.values[groupingIndex]));
      return p;
    },
    function (p, v) {
      p.splice(p.indexOf(_.round(v.values[groupingIndex])), 1);
      return p;
    },
    function () {
      return [];
    }
  );

  boxPlot
    .width(500)
    .height(600)
    .dimension(xDimension)
    .group(valuesGroup)
    .tickFormat(d3.format('.1f'))
    .renderDataPoints(true)
    .renderTitle(true)
    .dataOpacity(0.5)
    .margins({top: 30, right: 50, bottom: 50, left: 40})
    .dataWidthPortion(0.5)
    .yAxisLabel("Values")
    .xAxisLabel("Values Grouped", 100)
    .elasticY(true)
    .elasticX(true)
    .colors(colorScale)
}



/**
 * A Line chart
 */
makeLineChart = function (ndx, colorScale, min, max) {
  let groupingIndex = 0
  let lineChart = dc.lineChart('#line-chart')

  let timeDimension = ndx.dimension(function (d) {
      return d3.timeSecond(new Date(d.time))
  })

  /**
   * Here you are grouping based on a particular index value (i.e. the
   * index that corrosponds to stress).
   */
  let timeGroup = timeDimension.group().reduceCount(function (d) {
      return d.value[groupingIndex];
  })

  lineChart
    .width(500)
    .height(600)
    .margins({top: 20, right: 50, bottom: 50, left: 40})
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .renderDataPoints(true)
    .clipPadding(20)
    .dimension(timeDimension)
    .x(d3.scaleTime().domain([d3.timeSecond.offset(new Date(min), -2), d3.timeHour.offset(new Date(max), 2)]))
    .round(d3.timeSecond)
    .xUnits(d3.timeSeconds)
    .yAxisLabel("Muscle Stress")
    .xAxisLabel("Time", 100)
    .group(timeGroup)
    .colors(colorScale)
}

var extents = getMinMax(experiments)
var min = extents.min
var max = extents.max
makeBoxPlot(ndx, colorScale)
makeLineChart(ndx, colorScale, min, max)
dc.renderAll();
