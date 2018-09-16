var buffer = [];
var bufferLength = 0;
var index = 0;
var divElement;

function LinePlotLoad()
{
 bufferLength = 150;

 for (i = 0; i < bufferLength; i++) {
     buffer[i] = 0;
 }

 divElement = document.getElementById("line-chart");
}

function LinePlotDraw() {
  //
  // Generate SVG element
  //
  var elementHTML = '<svg width="550" height="99" style="stroke:rgb(255,0,0);stroke-width:2;fill:none;" >';
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  elementHTML += '<path d="M';
  for (i = 0; i < 150; i++) {
    x1 = (i + 1) * 3;
    y1 = 99.0 - 700.0 * buffer[(index+i+1) % bufferLength];
    elementHTML += x1 + ' ' + y1;
    if (i < 149) elementHTML += 'L';
    else elementHTML += '';
  }
  elementHTML += '"/>';
  elementHTML += "</svg>";

  divElement.innerHTML = elementHTML;
}


function LinePlotAnimate(t) {
  LinePlotDraw();
  getData();
  window.requestAnimationFrame(LinePlotAnimate);
}

function OnNewData(strain) {
  index = (index + 1) % bufferLength;
  buffer[index] = strain;
}
