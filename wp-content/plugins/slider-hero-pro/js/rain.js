jQuery(document).ready(function($){

if (typeof rain_mainId === 'undefined' || rain_mainId === null) {
    rain_mainId = mainId;
}
var colors = {
  pink: '#FF04AD',
  purple: '#BA03CC',
  periwinkle: '#8A04FF',
  ocean: '#4203DA',
  darkBlue: '#080280',
  white: '#FFFFFF'
};
var overRightScreenEdge = new THREE.Vector2(1.25, 0);
var overTopScreenEdge = new THREE.Vector2(0, 1.25);
var overBottomScreenEdge = new THREE.Vector2(0, -1.25);
var renderer = new THREE.WebGLRenderer();
var clock = new THREE.Clock();
var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
var raycaster = new THREE.Raycaster();
var scene = new THREE.Scene();
var matBackdrop = new THREE.MeshStandardMaterial({ color: colors.periwinkle });
var geoBackdrop = new THREE.BoxBufferGeometry(1000, 0.5, 1000);
var mshBackdrop = new THREE.Mesh(geoBackdrop, matBackdrop);
var ambient = new THREE.AmbientLight(colors.ocean, 0.1);
var spotLight = new THREE.SpotLight(colors.ocean, 1);
var spotLightIntensity = 80;
var rainDropSpawnInterval = 500;
var rainDrops = [];

function meshRainDropFactory(topEdge, rightEdge, bottomEdge) {
  var fallingTime = 1750;
  var nowMillisecconds = new Date().getMilliseconds();
  var innerFityPercentWidthWU = rightEdge.x * 0.4;
  var rainDropPosition = Math.sin(nowMillisecconds) * innerFityPercentWidthWU;
  var rainDropLength = Math.random() + 2.75;
  var matRainDrop = new THREE.MeshPhongMaterial({
    color: colors.pink,
    specular: colors.darkBlue,
    shininess: 10,
    vertexColors: THREE.NoColors,
    shading: THREE.FlatShading
  });
  var geoRainDrop = new THREE.BoxBufferGeometry(1, 1, rainDropLength);
  var meshRainDrop = new THREE.Mesh(geoRainDrop, matRainDrop);
  var startPostion = new THREE.Vector3(rainDropPosition, 0, topEdge.z);
  var endPostition = new THREE.Vector3(startPostion.x, startPostion.y, bottomEdge.z);

  meshRainDrop.position.copy(startPostion);
  meshRainDrop.castShadow = true;
  meshRainDrop.receiveShadow = true;

  var tween = new TWEEN.Tween(meshRainDrop.position).to(endPostition, fallingTime).start().onComplete(function () {
    scene.remove(meshRainDrop);
  });
  return meshRainDrop;
}

function init() {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  mshBackdrop.receiveShadow = true;
  camera.position.set(0, 40, 0);
  spotLight.rotation.x = 45;

  spotLight.castShadow = true;
  spotLight.angle = Math.PI / 9;
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.intensity = spotLightIntensity;
  spotLight.distance = $('#'+rain_mainId).width();
  spotLight.shadow.mapSize.width = 1024 / 4;
  spotLight.shadow.mapSize.height = 1024 / 4;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;
  ambient.intensity = 0.01;

  scene.add(camera);
  scene.add(mshBackdrop);
  scene.add(ambient);
  scene.add(spotLight);
  scene.add(spotLight.target);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.setSize($('#'+rain_mainId).width(), $('#'+rain_mainId).height());
  document.getElementById(rain_mainId).appendChild(renderer.domElement);
  window.addEventListener('resize', onResize, false);

  var _getSceneEdges = getSceneEdges();

  var topEdge = _getSceneEdges.topEdge;
  var rightEdge = _getSceneEdges.rightEdge;
  var bottomEdge = _getSceneEdges.bottomEdge;

  setInterval(function () {
    return scene.add(meshRainDropFactory(topEdge, rightEdge, bottomEdge));
  }, Math.random() * rainDropSpawnInterval);
  spotLight.position.set(rightEdge.x, 1, topEdge.z);
}

function getSceneEdges() {
  renderer.render(scene, camera);

  raycaster.setFromCamera(overRightScreenEdge, camera);
  var rightEdge = raycaster.intersectObject(mshBackdrop)[0].point;

  raycaster.setFromCamera(overTopScreenEdge, camera);
  var topEdge = raycaster.intersectObject(mshBackdrop)[0].point;

  raycaster.setFromCamera(overBottomScreenEdge, camera);
  var bottomEdge = raycaster.intersectObject(mshBackdrop)[0].point;

  return { rightEdge: rightEdge, topEdge: topEdge, bottomEdge: bottomEdge };
}

function onResize() {
  renderer.setSize($('#'+rain_mainId).width(), $('#'+rain_mainId).height());
  camera.aspect = $('#'+rain_mainId).width() / $('#'+rain_mainId).height();
  camera.updateProjectionMatrix();

  var _getSceneEdges2 = getSceneEdges();

  var rightEdge = _getSceneEdges2.rightEdge;
  var topEdge = _getSceneEdges2.topEdge;

  spotLight.position.set(rightEdge.x, 1, topEdge.z);
  spotLight.distance = $('#'+rain_mainId).width();
}

function render() {
  var time = 0;(function animationLoop() {
    requestAnimationFrame(animationLoop);
    time += clock.getDelta();
    var stormyAnimationCurve = Math.sin(Math.tan(time) * Math.pow(Math.sin(time), 10.0));
    spotLight.intensity = stormyAnimationCurve * spotLightIntensity;
    TWEEN.update();
    renderer.render(scene, camera);
  })();
}

init();
render();
})