PointCloud = function(nPoints) {

    this.type = 'PointCloud';
    this.npoints = nPoints;
    var colorMap = 'rainbow';
    var numberOfColors = 1000;
    this.lut = new THREE.Lut( colorMap, numberOfColors );
    this.lut.setMax( 0.08 );
    this.lut.setMin( 0 );
    var pointSprite = new THREE.TextureLoader().load( 'textures/disc.png' );
    let geometry = new THREE.Geometry();
    this.highlighted = null;
    for(let i=0; i < this.npoints; ++i) {
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.colors.push(new THREE.Color(this.lut.getColor()));
    }
    let material = new THREE.PointsMaterial({
        size: 12,
        vertexColors: THREE.VertexColors,
        sizeAttenuation: false,
        size: 10,
        map: pointSprite,
        alphaTest: 0.5,
        transparent: true});

    geometry.dynamic = true;
    this.points = new THREE.Points(geometry, material);

    this.points.scale.set(0.1,0.1,0.1);
    this.setData = function setData(data) {
        for (let i = 0; i < data[0].length; i++) {
            this.points.geometry.vertices[i].x = data[0][i];
            this.points.geometry.vertices[i].y = data[1][i];
            this.points.geometry.vertices[i].z = data[2][i];
            // Set the new color
            var color = this.lut.getColor(data[3][i]);
            this.points.geometry.colors[i] = new THREE.Color(color);
        }
        if(this.highlighted) {
            this.points.geometry.colors[this.highlighted] = new THREE.Color(0xffffff);
        }
        this.points.geometry.needsUpdate = true;
        this.points.geometry.verticesNeedUpdate = true;
        this.points.geometry.colorsNeedUpdate = true;
    }
    this.setHighlighted = function setHighlighted(index) {
        this.highlighted = index;
    }

    this.getHighlighted = function getHighlighted() {
        return this.highlighted;
    }

}