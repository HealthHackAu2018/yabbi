/**
 * Sends any updates to settings back to the server and GETS the new data.
 *
 * Sends on update
 */
const getData = function (data) {
  $.ajax({
      type: 'POST',
      url: '/get_value',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
          console.log(data)
          // Do something with the data
          data = JSON.parse(data)
      },
      error: function (err) {
       console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
     }
   });
}
