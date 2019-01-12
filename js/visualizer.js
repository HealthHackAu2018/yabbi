var linePlot, renderer, composer, scene, camera, controls, cube, hudCanvas, hudPlane, cameraHUD, hudTexture, light, pointCloud;
var stats;
var gui;
var nPoints = 2048;
var mouse = new THREE.Vector2();
var params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0.3
};
if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

function startVisualiser() {
    init();
    animate();
    window.addEventListener( 'mousedown', onMouseDown, false );
}

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 0.0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
   // renderer.toneMapping = THREE.ReinhardToneMapping;

    document.body.appendChild( renderer.domElement );
    scene = new THREE.Scene();
    // Create camera and move it a bit further. Make it to look to origo.
    camera = new THREE.PerspectiveCamera( 45,  window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.y = 30;
    camera.position.z = 0;
    camera.position.x = 0;
    camera.lookAt(scene.position);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement, 100, 10000 );
    controls.minDistance = -100;
    controls.maxDistance = 50000;

    // create the Cube
    cube = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = -10;

    
//       scene.add(cube)

        // Let there be light!
    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 50, 50, 50 );
    scene.add(light);

    pointCloud = new PointCloud(nPoints);
    scene.add(pointCloud.points);

    window.addEventListener( 'resize', onWindowResize, false );

    stats = new Stats();
    document.body.appendChild( stats.dom );

    
    // We will use 2D canvas element to render our HUD.  
    hudCanvas = document.createElement('canvas');
    
    // Again, set dimensions to fit the screen.
    hudCanvas.width =  window.innerWidth;
    hudCanvas.height = window.innerHeight;
        
    // Create the camera and set the viewport to match the screen dimensions.
    cameraHUD = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0, 30 );

    // Create also a custom scene for HUD.
    sceneHUD = new THREE.Scene();

    // Create texture from rendered graphics.
    hudTexture = new THREE.Texture(hudCanvas) 
    hudTexture.needsUpdate = true;
    hudTexture.minFilter = THREE.LinearFilter

    // Create HUD material.
    var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
    material.transparent = true;

    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry(  window.innerWidth,  window.innerHeight );
    hudPlane = new THREE.Mesh( planeGeometry, material );
    sceneHUD.add( hudPlane );

    linePlot = new LinePlot(200);
//     linePlot.setScreenPosition(-100,-10,1,1);
    linePlot.setScreenPosition(0.5,0.3,0.95,0.5);
    sceneHUD.add(linePlot.plot);
    renderer.autoClear = false; 

    var renderScene = new THREE.RenderPass( sceneHUD, cameraHUD );
    var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    composer = new THREE.EffectComposer( renderer );
    composer.setSize( window.innerWidth, window.innerHeight );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );


    onWindowResize();
}
function sortIntersectsByDistanceToRay(intersects) {
    return _.sortBy(intersects, "distanceToRay");
}

function onMouseDown( event ) {

// calculate mouse position in normalized device coordinates
// (-1 to +1) for both components
    if(event.shiftKey) {
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;      
        var raycaster = new THREE.Raycaster(camera.position);
        raycaster.params.Points.threshold = 10;
        raycaster.setFromCamera(mouse, camera);
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObject( pointCloud.points);
        if(intersects[0]) {
            let sortedIntersects = sortIntersectsByDistanceToRay(intersects);
            let intersect = sortedIntersects[0];
            let index = intersect.index;
            pointCloud.setHighlighted(index);
        }
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraHUD.aspect = window.innerWidth / window.innerHeight;
    cameraHUD.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    updateVisualiser(data);
    stats.update();
    renderer.clear();
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    composer.render( scene, camera );
    renderer.clearDepth(); // important! clear the depth buffer
    renderer.render(scene, camera); 
    requestAnimationFrame( animate );
}

function updateVisualiser(vizData) {
    // Rotate cube.
//    cube.rotation.x += 0.01;
 //   cube.rotation.y -= 0.01;
  //  cube.rotation.z += 0.03;
    if(vizData.length && vizData[0].length) {
        pointCloud.setData(vizData);
        if(pointCloud.getHighlighted()) {
            var val = data[3][pointCloud.getHighlighted()];
            var color = new THREE.Color();
            color.setHSL( val, 1.0, 0.5 );
            linePlot.push(val)
        }
    }

}