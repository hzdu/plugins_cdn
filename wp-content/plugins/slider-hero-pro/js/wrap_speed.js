jQuery(document).ready(function($){
	
var camera = undefined,
    scene = undefined,
    renderer = undefined;
var planeMesh = undefined;
var stars = [];
var colors = ["#0952BD", "#A5BFF0", "#118CD6", "#1AAEE8", "#ffffff"];



if (typeof warp_speed_mainId === 'undefined' || warp_speed_mainId === null) {
    warp_speed_mainId = mainId;
}

if(stars_count == null){
	var stars_count = 500;
}

function init() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x000000, 0.015, 72);

	camera = new THREE.PerspectiveCamera(75, $('#'+warp_speed_mainId).width() / $('#'+warp_speed_mainId).height(), 0.1, 1000);
	renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: true });
	renderer.sortObjects = false;
	renderer.autoClearColor = false;

	// Scene initialization
	camera.position.z = 55;

	renderer.setClearColor("#000", 1);
	renderer.setSize($('#'+warp_speed_mainId).width(), $('#'+warp_speed_mainId).height());
	renderer.setPixelRatio(document.getElementById(warp_speed_mainId).devicePixelRatio);

	document.getElementById(warp_speed_mainId).appendChild(renderer.domElement);

	for (var i = 0; i < stars_count; i++) {
		var geometry = new THREE.SphereBufferGeometry(0.12 * Math.random(), 10, 10);
		var material = new THREE.MeshBasicMaterial({
			color: colors[Math.floor(Math.random() * colors.length)],
			shading: THREE.FlatShading
		});

		var star = new THREE.Mesh(geometry, material);

		star.position.x = Math.random() * 100 - 50;
		star.position.y = Math.random() * 100 - 50;
		star.position.z = Math.random() * 50 - 25;

		scene.add(star);
		stars.push(star);
	}

	var planeGeometry = new THREE.PlaneGeometry(1000, 500, 1, 1);
	var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1 });

	planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

	scene.add(planeMesh);
}

function render() {

	requestAnimationFrame(render);
	renderer.render(scene, camera);

	for (var i = 0; i < stars.length; i++) {
		stars[i].position.z += 0.09;

		if (stars[i].position.z >= 60) {
			stars[i].position.x = Math.random() * 100 - 50;
			stars[i].position.y = Math.random() * 100 - 50;
			stars[i].position.z = 5;
		}
	}

	if (activated == true) {
		planeMesh.material.opacity = 0.01;
	} else {
		if (planeMesh.material.opacity < 1) {
			planeMesh.material.opacity += 0.01;
		}
	}
}

init();
render();

var activated = false;

document.getElementById(warp_speed_mainId).addEventListener("mousedown", function (event) {
	activated = true;
});

document.getElementById(warp_speed_mainId).addEventListener("mouseup", function (event) {
	activated = false;
});

window.addEventListener("resize", function () {
	camera.aspect = $('#'+warp_speed_mainId).width() / $('#'+warp_speed_mainId).height();
	camera.updateProjectionMatrix();
	renderer.setSize($('#'+warp_speed_mainId).width(), $('#'+warp_speed_mainId).height());
});

document.getElementById(warp_speed_mainId).addEventListener("touchstart", function () {
	activated = true;
});

window.addEventListener("touchend", function () {
	activated = false;
});


})