const DEFAULT_POINT_SIZE = 4;
const DIV_ELEMENT_ID = 'threedvis'; // The div for three.js to work in
const ORBIT_LOOKAT_COORD = new THREE.Vector3(0, 0, 5); // Where the camera points

var is3dVisInitialized = false;
var camera, controls, scene, renderer, points;

/** Update the position and color of 3d scatterplot points.
 * 
 * Parameters:
 * newData: The new data, where position can be accessed via
 *          newData["3ddata"][pointIndex].x          // x coordinate
 *          color????  */
update3dVis = function (newData) {
    // Don't access out of array bounds
    let arrayLength = (newData["3ddata"].length > points.length) ?
            points.length : newData["3ddata"].length;
    for (let i = 0; i < arrayLength; i++) {
        points[i].geometry.vertices[0].x = newData["3ddata"][i].x;
        points[i].geometry.vertices[0].y = newData["3ddata"][i].y;
        points[i].geometry.vertices[0].z = newData["3ddata"][i].z;
        let newColor = dataToColor(newData["3ddata"][i].values[0]);
        points[i].material.color.set(newData[0], newData[1], newData[2]);
    }
}

/** Convert a data value to rgb color array eg [0.2, 0.5, 1.0]
 *
 * Parameters:
 * value: The stress or strain etc. */
dataToColor = function (value) {
    let rangeLow = 0;
    let rangeHigh = 0.1;
    // Make sure value is in range
    let newValue = (value > rangeLow) ? value : rangeLow;
    newValue = (newValue < rangeHigh) ? newValue : rangeHigh;
    let greenAmount = (value - rangeLow) / (rangeHigh - rangeLow);
    let redAmount = 1.0 - greenAmount;
    return [redAmount, greenAmount, 0];
}

/** Initialise the scene, camera, points array etc 
 * 
 * Parameters:
 * data: The data where position is accessed as
         data["3ddata"][pointIndex].x        */
initialize3dVis = function (data) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera( 75, 
            window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.up.set(0,0,1); // Z axis is up instead of Y
    camera.position.set(25,25,10);
    renderer = new THREE.WebGLRenderer();
    var container = document.getElementById(DIV_ELEMENT_ID);
    let w = container.offsetWidth;
    let h = container.offsetHeight;
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
    points = initializePointCloud(scene, data);
    is3dVisInitialized = true;
    pointCloudAnimate();
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

    for (let i = 0; i < data["3ddata"].length; i++) {
        /** If performance is inadequate, try using THREE.BufferGeometry
         * instead of THREE.Geometry which is slower but friendlier */
        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(data["3ddata"][i].x,
                data["3ddata"][i].y, data["3ddata"][i].z));
        let pointColor = dataToColor(data["3ddata"][i].values[0]);
        let material = new THREE.PointsMaterial({size: DEFAULT_POINT_SIZE,
                color: new THREE.Color(pointColor[0], pointColor[1], pointColor[2])});
        let point = new THREE.Points(geometry, material);
        points.push(point);
        scene.add(point);
    }
    return points;
}

/** The main loop. */
function pointCloudAnimate() {
    requestAnimationFrame(pointCloudAnimate);
    render();
}

function render() {
    renderer.render(scene, camera);
}
