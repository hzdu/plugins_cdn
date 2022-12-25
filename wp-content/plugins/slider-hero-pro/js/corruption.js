jQuery(document).ready(function($){


if (typeof corruption_mainId === 'undefined' || corruption_mainId === null) {
    corruption_mainId = mainId;
}

if(dotsize == null){
	var dotsize = 56;
}
if(dotspeed == null){
	var dotspeed = '0.2';
}

var mainArea = document.getElementById(corruption_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "target");	
createCanvas.getContext("experimental-webgl", { alpha: true });
// configurable:
var dotSize = dotsize, blurLevels=9, speed=dotspeed, particleScale=0.33;

// globals:
var c = createjs, stage, t=0, count=0, w, h, max, min;
var spriteSheet, helixes=[];

/* Objects */
function HelixParticle(spriteSheet) {
	this.Sprite_constructor(spriteSheet);
	this.t = 0;
	this.speed = 1;
	this.size = 1;
	this.altAmp = 1;
	this.altPer = 1;
}
c.extend(HelixParticle, c.Sprite);
c.promote(HelixParticle, "Sprite");


function Helix(particleCount) {
	this.Container_constructor();
	this.particleCount = particleCount||1000;
	this.set({});
	this.particles = [];
	this.createParticles();
}
var p = c.extend(Helix, c.Container);
p.set = function(o) {
	this.overscan = o.overscan==null?0.2:o.overscan;
	this.particleScale = o.particleScale||1;
	this.speed = o.speed||1;
	this.amplitude = o.amplitude==null?0.5:o.amplitude;
	this.altAmplitude = o.altAmplitude==null?0.5:o.altAmplitude;
	this.startRotation = o.startRotation||0;
	this.rotations = o.rotations==null?2:o.rotations;
}
p.createParticles = function() {
	var dots = this.particles, l=this.particleCount;
	while (l-- > 0) {
		var seed = rnd(1);
		dot = new HelixParticle(spriteSheet);
		dot.t = rnd(Math.PI);
		dot.speed = Math.pow(seed*0.5+0.5,3);
		dot.size = 1-dot.speed;
		dot.altAmp = rnd(0.1,0.6)*rnd(0,dot.speed)*(rnd(1)<0.5?-1:1);
		dot.altPer = rnd(0.3,2);
		dot.altStart = rnd(Math.PI*2);
		dot.gotoAndStop(seed*blurLevels|0);
		dots.push(dot);
		this.addChild(dot);
	}
}
p.tick = function(delta) {
	var fov = min, dots = this.particles, a0=this.amplitude*0.5, a1=this.altAmplitude*0.5, pScale=this.particleScale*particleScale;
	var rotations = this.rotations*Math.PI*2, startRotation=this.startRotation*Math.PI*2;
	var adjW = w*(1+this.overscan*2);
	for (var i=0, l=dots.length; i<l; i++) {
		var dot = dots[i], altPer=dot.altPer*Math.PI*2;
		var t = (dot.t += delta*0.0001*this.speed*speed*dot.speed)%1;
		
		// base helix shape:
		if (t < 0) { t = 1+t; }
		var x = t*adjW-adjW/2;
		
		t = x/adjW;
		var y = Math.sin(t*rotations+startRotation)*min*a0;
		var z = Math.cos(t*rotations+startRotation)*min*a0;
		
		// introduce variation:
		y += Math.sin(t*altPer+dot.altStart)*min*dot.altAmp*a1;
		z += Math.cos(t*altPer+dot.altStart)*min*dot.altAmp*a1;
		
		var s = fov/(z+fov);
		dot.x = x*s; // disable perspective on the particle positions
		dot.y = y*s;
		dot.scaleX = dot.scaleY = Math.pow(s*(1+dot.size),2)*pScale;
		dot.alpha = s-0.6;
	}
}
p.clone = function(particleCount) {
	var o = new Helix(particleCount||this.particleCount);
	this._cloneProps(o);
	o.set(this);
	return o;
}
c.promote(Helix, "Container");


/* global methods */
setup();
function setup() {
	stage = new c.StageGL("target");
	stage.tickChildren = false;
	stage.setClearColor(0x000000, 0); // #206699
	
	window.addEventListener("resize", onResize);
	onResize();
	
	spriteSheet = generateSpriteSheet();
	
	for (var i=0; i<12; i++) {
		var helix = stage.addChild(new Helix(i*80+100));
		helix.x = w/2;
		helix.y = h/2;
		helix.particleScale = 1000/helix.particleCount*0.5;
		helix.speed = rnd(0.15,3-helix.particleScale)*(rnd()<0.5?1:-1);
		helix.alpha = rnd(0.1, Math.min(0.3/helix.particleScale,1));
		helix.amplitude = rnd(0.1, 0.7);
		helix.altAmplitude = rnd(0.2, 2-helix.amplitude);
		helix.rotations = rnd(0.5, 4);
		helix.rotation = rnd(90);
		helix.startRotation = rnd(3.14);
		helixes.push(helix);
	}
	
	c.Ticker.timingMode = c.Ticker.RAF;
	c.Ticker.on("tick", tick);
}

function generateSpriteSheet() {
	// generates a 4x4 sheet of dots at different blur levels.
	var holder = new c.Container(), shape = holder.addChild(new c.Shape()), g=shape.graphics;
	var pow = Math.ceil(Math.log(dotSize*2.2)/Math.log(2)), size2 = Math.pow(2,pow);
	var rect = new c.Rectangle(-size2/2, -size2/2, size2, size2);
	var builder = new c.SpriteSheetBuilder();
	builder.padding = 0;
	builder.maxWidth = Math.ceil(Math.sqrt(blurLevels))*size2;
	for (var i=0; i<blurLevels; i++) { builder.addFrame(holder, rect, 1, prepFrame, i); }
	return builder.build();
}

function prepFrame(holder, i) {
	var shape = holder.getChildAt(0);
  var g=shape.graphics, m=i/blurLevels, r=dotSize/2*Math.pow(2-m,1.2), x=0*(1-m)*0.2*r;
	g.c().rf(["hsla(0,100%,10%,1)","hsla(15,80%,0%,0)"],[m*0.8+0.1,1],x,0,0,x,0,r).dc(0,0,r);
	shape.alpha = 0.3+0.7*m;
}

function tick(evt) {
	var d = evt.delta;
	for (var i=0,l=helixes.length; i<l; i++) { helixes[i].tick(d); }
	stage.update();
}

function rnd(min, max) {
	if (min === undefined) { min = 1; }
	if (max === undefined) { max=min; min=0; }
	return Math.random()*(max-min)+min;
}

function onResize() {
	w = $('#'+corruption_mainId).width();
	h = $('#'+corruption_mainId).height();
	max = Math.max(w,h);
	min = Math.min(w,h);
	target.width = w;
	target.height = h;
	stage.updateViewport(w,h);
	for (var i=0; i<helixes.length; i++) {
		helixes[i].x = w/2;
		helixes[i].y = h/2;
	}
	particleScale = min/1000*0.3;
	stage.update();
}
});
