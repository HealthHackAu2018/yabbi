/**
 * Sends any updates to settings back to the server and GETS the new data.
 *
 * Sends on update
 */
 var interval = 20;  // 1000 = 1 second, 3000 = 3 seconds
var f = 0;
const getData = function () {
  $.ajax({
      type: 'POST',
      url: '/get_info',
      data: JSON.stringify({tmp: "nothing"}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
          // ToDo: something with the data
          // if (is3dVisInitialized === false) {
          //     initialize3dVis(data);
          // }
          //update3dVis(data);
          runSummaryVis(data)
      },
      error: function (err) {
       console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
     },
     complete: function (data) {
        // Schedule the next
        getData();
}
   });
}
setTimeout(getData, interval);


// const getPointTimeSeries = function (index) {
//   $.ajax({
//       type: 'POST',
//       url: '/get_point_time_series', //?i=' + index,
//       data: JSON.stringify({tmp: "nothing"}),
//       contentType: "application/json; charset=utf-8",
//       dataType: "json",
//       success: function(data) {
//           // ToDo: something with the data
//           if (is3dVisInitialized === false) {
//               initialize3dVis(data);
//           }
//           runSummaryVis(data);
//       },
//       error: function (err) {
//        console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
//      },
//      complete: function (data) {
//         // Schedule the next
//         // setTimeout(getData, interval);
// }
//    });
// }
// setTimeout(getPointTimeSeries, interval);
