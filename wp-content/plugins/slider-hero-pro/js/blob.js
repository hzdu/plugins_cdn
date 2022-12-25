jQuery(document).ready(function($){
	
if (typeof blob_mainId === 'undefined' || blob_mainId === null) {
    blob_mainId = mainId;
}
var scene = new THREE.Scene();
	
	
	var mainArea = document.getElementById(blob_mainId);
	var createCanvas = mainArea.appendChild(document.createElement('canvas'));
	createCanvas.setAttribute("id", "hero_blob");	
	
	var canvas = document.getElementById('hero_blob'),
		renderer = new THREE.WebGLRenderer({canvas : canvas, alpha: true}),
		WIDTH = $('#'+blob_mainId).width(),
	    HEIGHT = $('#'+blob_mainId).height();

	var shapes = [],
		population = {x: 38, z: 38},
		perlin = new ClassicalNoise(),
		iteration = 0,
		params = {
			speed: 1,
			perlinVariation: .3,
			perlinAmp: 2,
		};

	var c1 = 255,
		c1S = 1,
		c2 = 255,
		c2S = 1,
		c3 = 255,
		c3S = 1;


		
	
	renderer.setSize(WIDTH, HEIGHT);

	/* 
	=======================
	Camera
	=======================
	*/
	var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, .1, 100);

	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 10;

	scene.add(camera);



	/* 
	=======================
	Points
	=======================
	*/

	function Point(id, x, z) {
		this.id = id;
		this.speed = Math.floor(Math.random()*100)/100;
		this.geometry = new THREE.Geometry();
		this.geometry.vertices.push(new THREE.Vector3( 0, 0, 0));
		this.material = new THREE.PointsMaterial( { size: .02, sizeAttenuation: true } );
		this.point = new THREE.Points( this.geometry, this.material );
		this.dist = 1.8;

		this.u = Math.random();
		this.v = Math.random();
		var theta = 2 * Math.PI * this.u;
		var phi = Math.acos(2 * this.v - 1);

	   this.point.position.x = this.dist * Math.sin(phi) * Math.cos(theta);
	   this.point.position.y = this.dist * Math.sin(phi) * Math.sin(theta);
	   this.point.position.z = this.dist * Math.cos(phi);
	}

	Point.prototype.move = function() {
		this.dist = 1.8 + perlin.noise(iteration/100*params.speed,  this.point.position.y*params.perlinVariation, this.point.position.z*params.perlinVariation) * params.perlinAmp;
		var theta = 2 * Math.PI * this.u;
		var phi = Math.acos(2 * this.v - 1);

	   this.point.position.x = this.dist * Math.sin(phi) * Math.cos(theta);
	   this.point.position.y = this.dist * Math.sin(phi) * Math.sin(theta);
	   this.point.position.z = this.dist * Math.cos(phi);

	   this.point.material.color.setRGB(c1/255, c2/255, c3/255);

	};

	for (var i = population.x*-.5; i <= population.x/2; i++) {
		for (var u = population.z*-.5; u <= population.z/2; u++) {
			shapes[shapes.length] = new Point(shapes.length, i, u);
			scene.add( shapes[shapes.length-1].point );
		}
	}


	/* 
	=======================
	Logic
	=======================
	*/
	camera.lookAt( scene );
	renderer.render(scene, camera);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = .25;
	controls.enableZoom = true;
  controls.autoRotate = true;
	controls.autoRotateSpeed = 2.0;
  controls.minDistance = 4;
  controls.maxDistance = 20;

	function animate() {
		iteration++;
		changeColor();
		requestAnimationFrame( animate );

    controls.update();
		for (var i in shapes) {
			shapes[i].move();
		}

		renderer.render(scene, camera);
	}
	animate();

	window.addEventListener('resize', function() {
		WIDTH = $('#'+blob_mainId).width();
		HEIGHT = $('#'+blob_mainId).height();
		renderer.setSize(WIDTH,HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});

	function degToRad(deg) {
		return deg * Math.PI / 180;
	}

	function changeColor(){
		if (c1 <= 150 || c1 == 255) c1S *= -1;
		if (c2 <= 120 || c2 == 255) c2S *= -1;
		if (c3 <= 100 || c3 == 255) c3S *= -1;
		c1 += 1*c1S;
		c2 += 1*c2S;
		c3 += 1*c3S;
	}
})