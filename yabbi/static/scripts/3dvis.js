const DEFAULT_POINT_SIZE = 0.03;

var camera, controls, scene, renderer, points;

init();
animate();

/** Return an array of Points objects which each contain a point. To access:
 * points[0].geometry.vertices[0] = new THREE.Vector3(x, y, z);
 * points[0].geometry.vertices[0].x = 1.1;
 * points[0].material = new THREE.PointsMaterial({size: 0.03, color: 0x00ff00});
 * points[0].material.color.set(0x00ff00);
 *
 * Parameters:
 * scene: The scene object points will be added to
 * arraySize: the size of the point array to return. */
function initializePointCloud(scene, arraySize) {
    var points = [];

    for (var x = 0; x < arraySize; x++) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0, x * 0.01));
        var material = new THREE.PointsMaterial({size: DEFAULT_POINT_SIZE, 
                color: 0x0000ff});
        var point = new THREE.Points(geometry, material);
        points.push(point);
        scene.add(point);
    }
    return points;
}

/** Initialise the scene, camera, points array etc */
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera( 75, 
            window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer();
    var container = document.getElementById('threedvis');
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    renderer.setSize(w, h);
    container.appendChild( renderer.domElement );
    
    // Set up orbit
    /*controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 50;
    controls.enablePan = false;*/

    // Create points and add to scene. points is an array of THREE.Points.
    points = initializePointCloud(scene, 1000);

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}
