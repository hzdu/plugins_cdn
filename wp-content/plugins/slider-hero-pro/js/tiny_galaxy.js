jQuery(document).ready(function($){


if (typeof tiny_galaxy_mainId === 'undefined' || tiny_galaxy_mainId === null) {
    tiny_galaxy_mainId = mainId;
}

if (typeof herometerialcolor === 'undefined' || herometerialcolor === null) {
    herometerialcolor = 0xa7a100;
}	

var mainArea = document.getElementById(tiny_galaxy_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_galaxy");
canvas = document.getElementById('hero_galaxy');
var renderer = new THREE.WebGLRenderer({canvas: canvas,alpha: true});
renderer.setClearColor( 0x000000, 0 );
var scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera(45, $('#'+tiny_galaxy_mainId).width()/$('#'+tiny_galaxy_mainId).height(), 1, 50000);

function GalaxyFactory() {
  this.create = function(radius, height, count) {
    var geometry = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
      color: herometerialcolor,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
                                                
    for (var i = 0; i < count; i++) {
      var x = Math.random() * Math.PI * 2;
      var y = -Math.PI / 2 + Math.random() * Math.PI;
      
      var randRadius = Math.random() * radius;
      
      var point = new THREE.Vector3();
      point.x = Math.cos(x) * Math.cos(y) * randRadius;
      point.y = Math.sin(y) * Math.random() * height;
      point.z = Math.sin(x) * Math.cos(y) * randRadius;
      
      geometry.vertices.push(point);
    }
    
    var cloud = new THREE.PointCloud(geometry, material);
    //cloud.sortParticles = true; // SLOWS THINGS DOWN, SON
    return cloud;
  }
}

var galaxyFactory = new GalaxyFactory();
var galaxy = galaxyFactory.create(500, 50, 100000);

scene.add(galaxy);

var tickNum = 0;
function tick() {
  tickNum++;
  
  camera.position.z = Math.sin(tickNum / 500) * 500;
  camera.position.x = Math.cos(tickNum / 500) * 500;
  camera.position.y = 50 + Math.sin(tickNum / 100) * 100;
  
  camera.lookAt({x:0, y: 0, z: 0});
 
  
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

function onResize() {
  renderer.setSize($('#'+tiny_galaxy_mainId).width(), $('#'+tiny_galaxy_mainId).height())
}
onResize();
});