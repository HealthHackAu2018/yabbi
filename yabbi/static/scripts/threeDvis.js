/**
 * Script for creating a three D visualisatino of the nodes.
 * Modeified a scatterplot implementaion using D3 and three.JS from
 * http://bl.ocks.org/phil-pedruco/9852362.
 */

// from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) { //TODO rewrite with vector output
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var set_up_3D_attr = function () {
    document.getElementById('threedvis').innerHTML = "";
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    var w = 500;
    var h = 400;
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 0);

    document.getElementById('threedvis').appendChild(renderer.domElement);

    // PerspectiveCamera inputs: VIEW_ANGLE, ASPECT, NEAR, FAR
    var camera = new THREE.PerspectiveCamera(45, w / h, 1, 100000);
    camera.position.z = 120;
    camera.position.x = 60;
    camera.position.y = 60;


    var scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xff0000 );

    var vis = new THREE.Object3D();
    scene.add(vis);

    vis.rotation.y = 0;

    var format = d3.format("+.3f");

    var threeD_attr = {};
    threeD_attr['camera'] = camera;
    threeD_attr['renderer'] = renderer;
    threeD_attr['scene'] = scene;
    threeD_attr['vis'] = vis;
    threeD_attr['format'] = format;
    return threeD_attr;
}

function v(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

var add_vis_to_scene = function(threeD_attr) {
    threeD_attr.vis = new THREE.Object3D();
    threeD_attr.scene.add(threeD_attr.vis);

    threeD_attr.vis.rotation.y = 0;

}

/**
 * Renders the 3D nodes.
 */
var draw_3D_nodes = function (data, threeD_attr) {
  // ToDo: let the user select which value
  let userSelectedField = 0;

    while (threeD_attr.scene.children.length > 0) {
        threeD_attr.scene.remove(threeD_attr.scene.children[0]);
    }
    add_vis_to_scene(threeD_attr);

    let userSelectedFieldExtent = d3.extent(data, function (d) {
        return d.values[userSelectedField];
    });

    color = d3.scaleLinear().domain(userSelectedFieldExtent)
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

    var unfiltered = [],
            lowPass = [],
            highPass = [];

    for (var i in data) {
        var d = data[i];
        unfiltered[i] = {
            x: +d.x,
            y: +d.y,
            z: +d.z,
            colour: color(d.values[userSelectedField])
        };
    }

    var xExent = d3.extent(unfiltered, function (d) {
        return d.x;
    }),
    yExent = d3.extent(unfiltered, function (d) {
        return d.y;
    }),
    zExent = d3.extent(unfiltered, function (d) {
        return d.z;
    });

    var vpts = {
        xMax: xExent[1],
        xCen: (xExent[1] + xExent[0]) / 2,
        xMin: xExent[0],
        yMax: yExent[1],
        yCen: (yExent[1] + yExent[0]) / 2,
        yMin: yExent[0],
        zMax: zExent[1],
        zCen: (zExent[1] + zExent[0]) / 2,
        zMin: zExent[0]
    }

    var xScale = d3.scaleLinear()
            .domain(xExent)
            .range([-50, 50]);
    var yScale = d3.scaleLinear()
            .domain(yExent)
            .range([-50, 50]);
    var zScale = d3.scaleLinear()
            .domain(zExent)
            .range([-50, 50]);

// calc_line_points(data, threeD_attr, xScale, yScale, zScale);

    var mat = new THREE.ParticleBasicMaterial({
        vertexColors: true,
        size: 10
    });

    var pointCount = unfiltered.length;

    var pointGeo = new THREE.Geometry();

    for (var i = 0; i < pointCount; i++) {
      if (i % 2 == 0) {
        var x = -xScale(unfiltered[i].x);
        var y = -yScale(unfiltered[i].y);
        var z = zScale(unfiltered[i].z);
        var geometry = new THREE.SphereGeometry(3, 20, 30, 0, Math.PI * 2, 0, Math.PI * 2);
        var material = new THREE.MeshBasicMaterial({
          color: unfiltered[i].colour
        } );

        var cube = new THREE.Mesh(geometry, material);

        threeD_attr.vis.add(cube);
        cube.position.set(x, y, z);
      }
  }
//        pointGeo.vertices.push(new THREE.Vector3(x, y, z));
//
//        //pointGeo.vertices[i].angle = Math.atan2(z, x);
//        //pointGeo.vertices[i].radius = Math.sqrt(x * x + z * z);
//        //pointGeo.vertices[i].speed = (z / 100) * (x / 100);
//
//        pointGeo.colors.push(new THREE.Color().setRGB(
//                hexToRgb(unfiltered[i].colour).r / 255,
//                hexToRgb(unfiltered[i].colour).g / 255,
//                hexToRgb(unfiltered[i].colour).b / 255
//                ));

   // var points = new THREE.ParticleSystem(pointGeo, mat);
   // threeD_attr.vis.add(points);

    threeD_attr.renderer.render(threeD_attr.scene, threeD_attr.camera);

    var paused = false;
    var last = new Date().getTime();
    var down = false;
    var sx = 0,
            sy = 0;

    window.onmousedown = function (ev) {
        down = true;
        sx = ev.clientX;
        sy = ev.clientY;
    };

    window.onmouseup = function () {
        down = false;
    };

    window.onmousemove = function (ev) {
        if (down) {
            var dx = ev.clientX - sx;
            var dy = ev.clientY - sy;
            threeD_attr.vis.rotation.y += dx * 0.01;
            threeD_attr.camera.position.y += dy;
            sx += dx;
            sy += dy;
        }
    }

    var animating = false;
    window.ondblclick = function () {
        animating = !animating;
    };

    function animate(t) {
        if (!paused) {
            last = t;
            if (animating) {
                var v = pointGeo.vertices;
                for (var i = 0; i < v.length; i++) {
                    var u = v[i];
                    console.log(u)
                    u.angle += u.speed * 0.01;
                    u.x = Math.cos(u.angle) * u.radius;
                    u.z = Math.sin(u.angle) * u.radius;
                }
                pointGeo.__dirtyVertices = true;
            }
            threeD_attr.renderer.clear();
            threeD_attr.camera.lookAt(threeD_attr.scene.position);
            threeD_attr.renderer.render(threeD_attr.scene, threeD_attr.camera);
        }
        window.requestAnimationFrame(animate, threeD_attr.renderer.domElement);
    }
    ;
    animate(new Date().getTime());
    onmessage = function (ev) {
        paused = (ev.data == 'pause');
    }
    ;
}
