    LinePlot = function(npoints) {
				this.type = 'LinePlot';
                this.npoints = npoints !== undefined ? npoints : 100;
                this.xscale = 1;
                this.yscale = 1;
                this.colors = [];
				this.positions = [];
				this.plot = new THREE.Group();
				this.x = {};
				this.x.axis = true;
				this.x.axislength = [1,1,0];
				this.x.ylim = [0,0.08];
				this.x.axisLabels = ['x', 'y', ''];

                var geometry = new THREE.LineGeometry();

                for(var i=0; i < this.npoints; ++i) {
					this.positions.push(i/npoints*this.x.axislength[0], 0, 0);
					this.colors.push(1, 0.3, 0 )
                }

				geometry.setPositions( this.positions );
				geometry.setColors(this.colors);
				geometry.dynamic = true;

				var matLine = new THREE.LineMaterial( {

					color: 0xffffff,
					linewidth: 2, // in pixels
					vertexColors: THREE.VertexColors,
					//resolution:  // to be set by renderer, eventually
					dashed: false

				} );
                matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport
				this.line = new THREE.Line2( geometry, matLine);
				this.line.computeLineDistances();
				this.pos = 0;				
				
				this.plot.add(this.line)
				this.plot.scale.set( 1, 1, 1 );
			

				this.setScreenPosition = function setScreenPosition(x0,y0,x1,y1) {

					var width = Math.abs(x1-x0);
					var height =  Math.abs(y1-y0);
					this.plot.scale.set( width* window.innerWidth /2.0, height * window.innerHeight /2.0, 1 )
					this.plot.position.x = x0* window.innerWidth /2.0;
					this.plot.position.y = y0* window.innerHeight /2.0 ;
					this.plot.position.z = 0;
					
				}


				// helper function to add text to 'object'
				function addText(object, string, scale, x, y, z, color)
				{
					var log2 = function(x) {return Math.log(x) / Math.log(2);}; 
					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');
					scale = scale / 4;
					context.fillStyle = "#" + color.getHexString();
					context.textAlign = 'center';
					context.font = fontaxis;
					var size = Math.max(64, Math.pow(2, Math.ceil(log2(context.measureText(string).width))));
					canvas.width = size;
					canvas.height = size;
					scale = scale * (size / 128);
					context = canvas.getContext('2d');
					context.fillStyle = "#" + color.getHexString();
					context.textAlign = 'center';
					context.textBaseline = 'middle';
					context.font = fontaxis;
					context.fillText(string, size / 2, size / 2);
					var amap = new THREE.Texture(canvas);
					amap.needsUpdate = true;
					var mat = new THREE.SpriteMaterial({
						map: amap,
						transparent: true,
						color: 0xffffff });
					sp = new THREE.Sprite(mat);
					sp.scale.set( scale, scale, scale );
					sp.position.x = x;
					sp.position.y = y;
					sp.position.z = z;
					object.add(sp);
				}

				function v(x,y,z){ return new THREE.Vector3(x,y,z); }
				if(this.x.axis)
				{
					var axisColor = 0xFFFFFF;
					var xAxisGeo = new THREE.Geometry();
					var yAxisGeo = new THREE.Geometry();
					var zAxisGeo = new THREE.Geometry();
					xAxisGeo.vertices.push(v(-0.05*this.x.axislength[0],0, 0), v(this.x.axislength[0], 0, 0));
					yAxisGeo.vertices.push(v(0, -this.x.axislength[1], 0), v(0, this.x.axislength[1], 0));
					zAxisGeo.vertices.push(v(0, 0, 0), v(0, 0, this.x.axislength[2]));
					var xAxis = new THREE.Line(xAxisGeo, new THREE.LineBasicMaterial({color: axisColor, linewidth: 1}));
					var yAxis = new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({color: axisColor, linewidth: 1}));
					var zAxis = new THREE.Line(zAxisGeo, new THREE.LineBasicMaterial({color: axisColor, linewidth: 1}));
					xAxis.type = THREE.Lines;
					yAxis.type = THREE.Lines;
					zAxis.type = THREE.Lines;
					this.plot.add(xAxis);
					this.plot.add(yAxis);
					this.plot.add(zAxis);
		//			if(x.axisLabels)
	//				{
//						var dropOff = -0.08;
//						addText(this.plot, this.x.axisLabels[0], cexlab, x.axislength[0] + .1, dropOff, dropOff, axisColor)
//						addText(this.plot, this.x.axisLabels[1], cexlab, 0, x.axislength[1] + .1, 0, axisColor)
//						addText(this.plot, this.x.axisLabels[2], cexlab, dropOff, dropOff, x.axislength[2] + .1, axisColor)
//					}
				}

                this.push = function push(yvalue, color) {
                    this.positions[this.pos*3 + 1] =   yvalue / this.x.axislength[1] / this.x.ylim[1];
					this.pos=(++this.pos)%this.npoints;
					this.line.geometry.setPositions(this.positions);
	
					if(color !== undefined) {
						this.colors[this.pos*3] = color.r;
						this.colors[this.pos*3+1] = color.b;
						this.colors[this.pos*3+2] = color.g;
						this.line.geometry.setColors(this.colors);
                    };
					this.line.computeLineDistances();
				}
				                
            }