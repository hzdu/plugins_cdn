jQuery(document).ready(function($){
	
if (typeof floatrain_mainId === 'undefined' || floatrain_mainId === null) {
    floatrain_mainId = mainId;
}
if(jQuery('#qcld_slider_hero_main_canvas').length>0){
var renderer = new THREE.WebGLRenderer({canvas:document.getElementById('qcld_slider_hero_main_canvas'),antialiasing:true,alpha: true});
renderer.setClearColor( 0x000000, 0 );
$(window).resize(function() {
	renderer.setSize($('#'+floatrain_mainId).width(),$('#'+floatrain_mainId).height());
});
renderer.setSize($('#'+mainId).width(),$('#'+mainId).height());

// Camera
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 5000 );
camera.position.z = 400;

// Scene
var scene = new THREE.Scene();
scene.rotation.x = 45;

// Light
var light = new THREE.AmbientLight(0xffffff,0.1);
var light1 = new THREE.PointLight(0xffffff,1);

scene.add(light);
scene.add(light1);

// Create + init position mesh
var ammount = 200;
var ammountLines = 250;
var dimension = 40;
var gridAmmount = ammount/10;
var gridX = 0;
var gridY = 0;
var cubes = [];
var lines = [];

for (var i = 0; i < ammountLines; i++) {
  var geometryLines = new THREE.BoxGeometry( 4,2,200* Math.random());
  var materialLines = new THREE.MeshPhongMaterial( { color:0xffffff,shininess :500} );
  var line = new THREE.Mesh( geometryLines, materialLines );
  scene.add( line );
  lines.push( line );	
  line.rotation.z = Math.random() * 360;
  line.position.x = Math.random() * (dimension * 15) - (dimension / 2 * 15);
  line.position.y = Math.random() * (dimension * 15) - (dimension / 2 * 15);
  line.position.z = (-600 * Math.random()) + 150;
  line.modifier = Math.random();

}

for (var i = 0; i < ammount; i++) {
  var geometry = new THREE.BoxGeometry( dimension/2,dimension/2,dimension/2);
  var material = new THREE.MeshPhongMaterial( { color:0xffffff,shininess :500} );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cubes.push( cube );	

  cube.position.x = (gridX * ( gridAmmount/ ammount)) * (dimension * 10) - (dimension / 2 * 20);
  cube.position.y = (gridY * ( gridAmmount/ ammount)) * (dimension * 10) - (dimension / 2 * 10);
  cube.position.z = Math.random() * (dimension * 10) - (dimension / 2 * 10);
  cube.modifier = -Math.random();
  cube.material.transparent = true;
  cube.material.opacity = 0.3;
  gridX++;

  if(gridX==ammount/10){
    gridY+=1;
    gridX=0;
  }
}

// Render
var counter = 0
function render(){
  counter+=0.01;
  for (var i = lines.length - 1; i >= 0; i--) {
    lines[i].position.z += 10* lines[i].modifier;
    if(lines[i].position.z >600){
      lines[i].position.z = -600;
    }
  }
  for (var i = cubes.length - 1; i >= 0; i--) {
    cubes[i].position.z += Math.sin(1 * cubes[i].modifier *counter);
    cubes[i].rotation.z += 0.02*cubes[i].modifier;	
  }
  scene.rotation.x += 0.0001;
  scene.rotation.z += 0.001;
  camera.lookAt(scene.position)

  renderer.render(scene,camera);
  window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
}
});