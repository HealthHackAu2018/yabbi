/**
 * Sends any updates to settings back to the server and GETS the new data.
 *
 * Sends on update
 */
 var interval = 1000;  // 1000 = 1 second, 3000 = 3 seconds

const getData = function () {
  $.ajax({
      type: 'POST',
      url: '/get_info',
      data: JSON.stringify({tmp: "nothing"}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
          // ToDo: something with the data
          // runSummaryVis(data)
          let threeD_attr = set_up_3D_attr()
          draw_3D_nodes(data["3ddata"], threeD_attr)
      },
      error: function (err) {
       console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
     },
     complete: function (data) {
        // Schedule the next
        // setTimeout(getData, interval);
}
   });
}
setTimeout(getData, interval);
