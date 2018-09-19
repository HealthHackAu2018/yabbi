const DEFAULT_POINT_SIZE = 12;
const DIV_ELEMENT_ID = 'threedvis'; // The div for three.js to work in
const ORBIT_LOOKAT_COORD = new THREE.Vector3(0, 0, 5); // Where the camera points

var is3dVisInitialized = false;
var camera, controls, scene, renderer, pointCloud;
// The sprite that makes the dots a nice circle
var pointSprite = new THREE.TextureLoader().load( 'textures/disc.png' );
var cursor1 = new THREE.Geometry();
var cursor2 = new THREE.Geometry();
var cursor3 = new THREE.Geometry();
cursor1.vertices.push(new THREE.Vector3( -100, cursorY, cursorZ) );
cursor1.vertices.push(new THREE.Vector3( 100, cursorY, cursorZ) );
cursor2.vertices.push(new THREE.Vector3( cursorX, -100, cursorZ) );
cursor2.vertices.push(new THREE.Vector3( cursorX, 100, cursorZ) );
cursor3.vertices.push(new THREE.Vector3( cursorX, cursorY, -100) );
cursor3.vertices.push(new THREE.Vector3( cursorX, cursorY, 100) );
var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var line1 = new THREE.Line( cursor1, material );
var line2 = new THREE.Line( cursor2, material );
var line3 = new THREE.Line( cursor3, material );

line1.geometry.dynamic = true;
line2.geometry.dynamic = true;
line3.geometry.dynamic = true;

/** Update the position and color of 3d scatterplot points.
 *
 * Parameters:
 * newData: The new data, where position can be accessed via
 *          newData[pointIndex][0]          // x coordinate
 *          newData[pointIndex][3]          // strain value atm */
update3dVis = function (newData) {
    // Don't access out of array bounds
    let arrayLength = 2047;
    for (let i = 0; i < arrayLength; i++) {
        var j = 4*i;
        pointCloud.geometry.vertices[i].x = newData[j + 0];
        pointCloud.geometry.vertices[i].y = newData[j + 1];
        pointCloud.geometry.vertices[i].z = newData[j + 2];
        // Set the new color
        let newHue = dataToColor(newData[j + 3]);
        pointCloud.geometry.colors[i].r = newHue;// = new THREE.Color(newHue, 1.0-newHue, 0.6 - 0.2*newHue);
        pointCloud.geometry.colors[i].g = 1.0 - newHue;
        pointCloud.geometry.colors[i].b =  0.6 - 0.2*newHue;

        if (i == userSelectedIndex) setCursorPos(newData[j + 0], newData[j + 1], newData[j + 2]);
    }
    pointCloud.geometry.needsUpdate = true;
    pointCloud.geometry.verticesNeedUpdate = true;
    pointCloud.geometry.colorsNeedUpdate = true;
}

/** Convert a data value to a hue value 0 - 255
 *
 * Parameters:
 * value: The stress or strain etc. */
dataToColor = function (value) {
    let rangeLow = 0;
    let rangeHigh = 0.10;
    // Make sure value is in range
    let newValue = (value > rangeLow) ? value : rangeLow;
    newValue = (newValue < rangeHigh) ? newValue : rangeHigh;
    return ((newValue - rangeLow) / (rangeHigh - rangeLow));
}

var cursorX = 0;
var cursorY = 0;
var cursorZ = 0;
setCursorPos = function (x, y, z)
{
  cursorX = x;
  cursorY = y;
  cursorZ = z;
}

/** Initialise the scene, camera, points array etc
 *
 * Parameters:
 * data: The data where position is accessed as
 *       data[pointIndex][0] // x position
 *       data[pointIndex][3] // associated data value       */
initialize3dVis = function (data) {
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera( 75,
            window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.up.set(0,0,1); // Z axis is up instead of Y
    camera.position.set(25,25,10);
    renderer = new THREE.WebGLRenderer();
    var container = document.getElementById(DIV_ELEMENT_ID);
    let w = 800;//container.offsetWidth;
    let h = 600;//container.offsetHeight;
    renderer.setSize(w, h);
    container.appendChild( renderer.domElement );

    // Set up orbit
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 50000;
    controls.enablePan = false;
    controls.target = ORBIT_LOOKAT_COORD;

    // Create points and add to scene. points is an array of THREE.Points.
    initializePointCloud(scene, data);
    is3dVisInitialized = true;
    pointCloudAnimate();

    console.log("LOADED 3dvis.js!");
}

/** Return an array of Points objects which each contain a point. To access:
 * points[0].geometry.vertices[0] = new THREE.Vector3(x, y, z);
 * points[0].geometry.vertices[0].x = 1.1;
 * points[0].material = new THREE.PointsMaterial({size: 0.03, color: 0x00ff00});
 * points[0].material.color.set(0x00ff00);
 *
 * Parameters:
 * scene: The scene object points will be added to
 * data: array containing position and color information */
function initializePointCloud(scene, data) {
    var points = [];

    let geometry = new THREE.Geometry();
    for (let i = 0; i < 2047; i++) {
        /** If performance is inadequate, try using THREE.BufferGeometry
         * instead of THREE.Geometry which is slower but friendlier */
        var j = 4*i;
        var x = data[j + 0];
        var y = data[j + 1];
        var z = data[j + 2];
        geometry.vertices.push(new THREE.Vector3(x, y, z));
        geometry.colors.push(new THREE.Color(0xff00ff));
    }
    let material = new THREE.PointsMaterial({size: DEFAULT_POINT_SIZE,
      vertexColors: THREE.VertexColors,
      sizeAttenuation: false,
      map: pointSprite,
      alphaTest: 0.5,
      transparent: true});

    geometry.dynamic = true;
    pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    //if (showCursor)
    {
      scene.add(line1);
      scene.add(line2);
      scene.add(line3);
    }
}

/** The main loop. */
function pointCloudAnimate() {
    requestAnimationFrame(pointCloudAnimate);
    render();
}

function render() {

  line1.geometry.vertices[0] = new THREE.Vector3( -100, cursorY, cursorZ);
  line1.geometry.vertices[1] = new THREE.Vector3( 100, cursorY, cursorZ);
  line1.geometry.verticesNeedUpdate = true;
  line2.geometry.vertices[0] = new THREE.Vector3( cursorX, -100, cursorZ);
  line2.geometry.vertices[1] = new THREE.Vector3( cursorX, 100, cursorZ);
  line2.geometry.verticesNeedUpdate = true;
  line3.geometry.vertices[0] = new THREE.Vector3( cursorX, cursorY, -100);
  line3.geometry.vertices[1] = new THREE.Vector3( cursorX, cursorY, 100);
  line3.geometry.verticesNeedUpdate = true;

  renderer.render(scene, camera);
}
