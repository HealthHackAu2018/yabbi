/**
 * Sends any updates to settings back to the server and GETS the new data.
 *
 * Sends on update
 */

 function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function _base64ToArrayBuffer2(binary_string) {
   var len = binary_string.length;
   var bytes = new Uint8Array( len );
   for (var i = 0; i < len; i++)        {
       bytes[i] = binary_string.charCodeAt(i);
   }
   console.log(bytes[0]);
   return bytes.buffer;
}

var myTimer = 0;
const connectToSim = function () {

  //var exampleSocket = new WebSocket("ws://0.0.0.0:8000/get_info");
  var exampleSocket = new WebSocket("ws://localhost:8000/");

  exampleSocket.onmessage = function (event) {

    var blob = event.data;

    var reader = new FileReader();

    reader.addEventListener("loadend", function() {
      var iter = 0;

      var tf = new Int32Array(reader.result, iter, 1);
      myTimer = tf[0];
      iter += tf.byteLength;

      var nFrames = new Int32Array(reader.result, iter, 1);
      iter += nFrames.byteLength;
      //console.log(nFrames);

      for (var i = 0; i < nFrames[0]; ++i)
      {
        var nPoints = new Int32Array(reader.result, iter, 1);
        iter += nPoints.byteLength;
        //console.log(nPoints);

        var frameData = new Float32Array(reader.result, iter, 4*nPoints[0]);
        iter += frameData.byteLength;

        on_frame_data(frameData);
      }
    });
    reader.readAsArrayBuffer(blob);

    exampleSocket.send(myTimer);
  }

  exampleSocket.onopen = function (event) {
    exampleSocket.send(myTimer);
  };
}


var lpi = 0;
const on_frame_data = function (data) {

  if (lpi == 0) {
    LinePlotLoad();
    initialize3dVis(data);
    lpi = 1;
  }

  update3dVis(data);
  runSummaryVis(data);


  LinePlotDraw();
}
