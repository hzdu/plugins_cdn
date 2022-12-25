jQuery(document).ready(function($){
if (typeof orbital_mainId === 'undefined' || orbital_mainId === null) {
    orbital_mainId = mainId;
}
var mainArea = document.getElementById(orbital_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "slider_hero_stage");


	window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

//*** VARIABLES ***
var _stageContext, _stageWidth, _stageHeight, _halfStageWidth, _halfStageHeight;
var _orbitalArray = [];
var _orbitalCount = 200;
var _colorArray = ['11adc6','e8f5f3','e79852','97dae7','f5d8a5','94633c','86ac97','006478','537a68','e2b788','b1c7b4'];

//*** INIT ***
function init() {
  var stage = document.getElementById('slider_hero_stage');
  _stageWidth = stage.width = $('#'+orbital_mainId).width();
  _stageHeight = stage.height = $('#'+orbital_mainId).height();
  _halfStageWidth = _stageWidth/2;
  _halfStageHeight = _stageHeight/2;
  _stageContext = stage.getContext('2d');
}

//*** METHODS ***

function createOrbitals() {
	var i=0;
  var orbital;
  var pId;
  _orbitalArray = [];
  for(i=0; i<_orbitalCount; i++) {
    pId = i;
		if(i > _orbitalCount * 0.1){ 
      pId = Math.floor(Math.random() * i);
    }
    orbital = new Orbital(i, pId);
    _orbitalArray.push(orbital);
  } 
}

function drawStage() {
  var i = 0;
 	var j = 0;
  for(j=0;j<10;j++){
  for(i=0;i<_orbitalCount;i++){
    _orbitalArray[i].orbit();
  }
  for(i=0;i<_orbitalCount;i++){
    _orbitalArray[i].draw();
  }
  }
}

function initOrbitals() {
  var i = 0;
  for(i=0; i<_orbitalCount; i++) {
    _orbitalArray[i].init(); 
  }
}
//*** EVENTS ***
function onEnterFrame() {
	drawStage(); 
	window.requestAnimFrame(onEnterFrame, 60);
}

/*** i - the array position we refer to
  * pId - the object we want to orbit
**/
var Orbital = function(i, pId) {
  this.i = i;
  this.pId = pId;
  this.depth = 0;
  this.radius = 0;
  this.t = 0;
  this.tv = 0;
  this.x = _halfStageWidth;
  this.y = _halfStageHeight;
  this.width = 0.5;
  this.height = 0.5;
  this.color = this.getColor();
}

Orbital.prototype.init = function() {
	if(this.i !== this.pId) { 
    this.depth = _orbitalArray[this.pId].depth + 1;
    this.radius = 1 + (Math.random() * (_halfStageWidth/this.depth));
    this.tv = 0.0001 + Math.random() * 0.02/(this.depth+1);
    if(Math.random() > .5) this.tv *= -1;
  }
}

Orbital.prototype.draw = function() {
	var fzx = -0.22 + Math.random() * 0.22;
  var fzy = -0.22 + Math.random() * 0.22;
  var holdX = this.x + fzx;
	var holdY = this.y + fzy;
  var o;
  _stageContext.save();
  _stageContext.fillStyle = this.color;
  _stageContext.globalAlpha = 0.3;
  _stageContext.fillRect(holdX, holdY, this.width, this.height);
  _stageContext.restore();
  if(this.sumTV() < 1.00001) {
    o = Math.random() * (Math.PI/2);
    fzx = _orbitalArray[this.pId].x + this.radius * Math.cos(o);
    fzy = _orbitalArray[this.pId].y + this.radius * Math.sin(o);
    _stageContext.save();
    _stageContext.globalAlpha = .02;
    _stageContext.fillRect(fzx,fzy,this.width,this.height);
    _stageContext.restore();
    
    //draw parent
    o = Math.random();
    fzx = this.x + o * (_orbitalArray[this.pId].x - this.x);
    fzy = this.y + o * (_orbitalArray[this.pId].y - this.y);
    _stageContext.save();
    _stageContext.globalAlpha = .03;
    _stageContext.fillStyle = "#111111";
		_stageContext.fillRect(fzx,fzy,this.width,this.height);
		_stageContext.restore();
  }
}

Orbital.prototype.orbit = function() {
  this.t += this.tv;
  this.x = _orbitalArray[this.pId].x + this.radius * Math.cos(this.t);
  this.y = _orbitalArray[this.pId].y + this.radius * Math.sin(this.t);
  //slow down time
  this.tv *= 0.99942;
}

Orbital.prototype.getColor = function() {
  return '#' + _colorArray[Math.floor(Math.random()*_colorArray.length)];
}

Orbital.prototype.sumTV = function() {
  if (this.pId !== this.i) {
    return (_orbitalArray[this.pId].sumTV() + this.tv);
  } else { 
    return this.tv + 1;
  }
}
 
init();
createOrbitals();
initOrbitals();   
onEnterFrame();

})