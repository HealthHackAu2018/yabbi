const DEFAULT_POINT_SIZE = 0.03;

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
        geometry.vertices.push(new THREE.Vector3(0,0,0));
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
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, 
            window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    camera.position.z = 5;

    // points is an array of THREE.Points
    var points = initializePointCloud(scene, 1000);
}
