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
  var elementHTML = '<svg width="550" height="99">';
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  for (i = 0; i < 150; i++) {
    x0 = i * 3;
    x1 = (i + 1) * 3;
    y0 = 99.0 - 700.0 * buffer[(index+i) % bufferLength];
    y1 = 99.0 - 700.0 * buffer[(index+i+1) % bufferLength];
    elementHTML += '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y1+'" style="stroke:rgb(255,0,0);stroke-width:2" />';
  }
  elementHTML += "</svg>";

  divElement.innerHTML = elementHTML;
}


function LinePlotAnimate(t) {
  LinePlotDraw();
  getData();
  window.requestAnimationFrame(LinePlotAnimate);
}

var gg = 0;
function OnNewData(strain) {
  if (gg==0) { gg = 1; console.log("OnNewData()   " + performance.now()); }
  index = (index + 1) % bufferLength;
  buffer[index] = strain;
}
