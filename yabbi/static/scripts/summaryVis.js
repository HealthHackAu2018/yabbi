// var focusChart = dc.seriesChart("#stress");
// var overviewChart = dc.seriesChart("#stress-overview");
var ndx, runDimension, runGroup, overviewRunDimension, overviewRunGroup;
var experiments = [{x:1.318999999999999950,y:-3.967999999999999861,z:-8.551000000000000512},{x:1.208000000000000007,y:-6.014000000000000457,z:-8.095999999999999375},{x:1.074000000000000021,y:-9.483000000000000318,z:-7.501000000000000512}]
  ndx = crossfilter(experiments);
  runDimension = ndx.dimension(function(d) {return [+d.x, +d.y]; });
  overviewRunDimension = ndx.dimension(function(d) {return [+d.x, +d.y]; });
  runGroup = runDimension.group().reduceSum(function(d) { return +d.z; });
  overviewRunGroup = overviewRunDimension.group().reduceSum(function(d) { return +d.z; });
  //
  // focusChart
  //   .width(768)
  //   .height(480)
  //   .chart(function(c) { return dc.lineChart(c).curve(d3.curveCardinal).evadeDomainFilter(true); })
  //   .x(d3.scaleLinear().domain([-10, 10]))
  //   .brushOn(false)
  //   .yAxisLabel("A label")
  //   .yAxisPadding("5%")
  //   .xAxisLabel("Run")
  //   .elasticY(true)
  //   .dimension(runDimension)
  //   .group(runGroup)
  //   .mouseZoomable(true)
  //   .rangeChart(overviewChart)
  //   .seriesAccessor(function(d) {
  //     return "Expt: " + d.key[0];
  //   })
  //   .keyAccessor(function(d) {
  //     return +d.key[1];
  //   })
  //   .valueAccessor(function(d) {
  //     return +d.value;
  //   })
  //   .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
  // focusChart.margins().left += 40;
  //
  // overviewChart
  //   .width(768)
  //   .height(100)
  //   .chart(function(c) { return dc.lineChart(c).curve(d3.curveCardinal); })
  //   .x(d3.scaleLinear().domain([-10,10]))
  //   .brushOn(true)
  //   .xAxisLabel("Run")
  //   .clipPadding(10)
  //   .dimension(runDimension)
  //   .group(runGroup)
  //   .seriesAccessor(function(d) {
  //     return "Expt: " + d.key[0];
  //   })
  //   .keyAccessor(function(d) {
  //     return +d.key[1];
  //   })
  //   .valueAccessor(function(d) {
  //     return +d.value;
  //   });


  var barChart = dc.barChart("#bar-chart");
    barChart
      .width(768)
      .height(480)
      .x(d3.scaleLinear().domain([6,20]))
      .brushOn(false)
      .xAxisLabel("Run")
      .yAxisLabel("This is the Y Axis!")
      .dimension(runDimension)
      .group(runGroup)
      .on('renderlet', function(chart) {
          chart.selectAll('rect').on("click", function(d) {
              console.log("click!", d);
          });
      });
  barChart.render();
