jQuery(document).ready(function($){

if(helix_color == null){
	var helix_color = "#201624";
}

if(helix_mainId == null){
	helix_mainId = mainId;
}

if(helixmaxdot == null){
	var helixmaxdot = '1000';
}

if(helixspeed == null){
	var helixspeed = '2.5';
}

var mainArea = document.getElementById(helix_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "target");
createCanvas.getContext("experimental-webgl", { alpha: true });
var c = createjs, stage = new c.StageGL("target"), t=0, count=0, w, h, max, min;
// configurable:
var dotR = 8, amp0Amt=1, amp1Amt=0.2, maxDots=helixmaxdot, speed=helixspeed;
c.Ticker.timingMode = c.Ticker.RAF;
c.Ticker.on("tick", tick);
stage.setClearColor(0x000000, 0);

var dotTemplate, dots=[];

while (dots.length < maxDots) {
	getDot();
}

function tick(evt) {
	var d = evt.delta;

	var fov = min*1;
	for (var i=0, l=dots.length; i<l; i++) {
		var dot = dots[i];
		var t = (dot.t += d*0.0001*speed*dot.speed);
		var x = t%1*w-w/2;
		x += Math.cos(t*dot.p1)*min*dot.a1*amp1Amt;
		var y = Math.sin(t*Math.PI*4+Math.PI)*min*dot.r*0.25;
		y += Math.sin(t*dot.p1)*min*dot.a1*amp1Amt
		var z = Math.cos(t*Math.PI*4+Math.PI)*min*dot.r*0.25;
		z += Math.cos(t*dot.p1)*min*dot.a1*amp1Amt;
		
		var s = fov/(z+fov);
		x *= s;
		y *= s;
		
		dot.x = x+w/2;
		dot.y = y+h/2;
		dot.getChildAt(1).alpha = 1-s;
		
		dot.scaleX = dot.scaleY = Math.pow(s*(1+dot.size),2)*0.3;
	}
	
	stage.update();
}

function getDot() {
	if (!dotTemplate) {
		var dotShape = new c.Shape(), blurShape = new c.Shape(), g=dotShape.graphics;
		g.f("#fff").dc(0,0,dotR);
		var pow = Math.ceil(Math.log(dotR)/Math.log(2)), base2R = Math.pow(2,pow);
		dotShape.cache(-base2R,-base2R,base2R*2,base2R*2);
		dotTemplate = new c.Bitmap(dotShape.cacheCanvas);
		var g = blurShape.graphics;
		g.c().rf(["hsla(0,0%,100%,0.4)","hsla(180,100%,75%,0)"],[0,1],0,0,0,0,0,dotR).dc(0,0,dotR);
		blurShape.cache(-base2R,-base2R,base2R*2,base2R*2);
		blurTemplate = new c.Bitmap(blurShape.cacheCanvas);
		blurTemplate.scaleX = blurTemplate.scaleY = 2;
		blurTemplate.x = blurTemplate.y = -base2R;
		blurTemplate.alpha = 1;
	}
	dot = new c.Container();
	dot.alpha = 0.8;
	dot.addChild(blurTemplate.clone(), dotTemplate.clone());
	dot.t = rnd(Math.PI);
	dot.speed = Math.pow(rnd(0.5,1),3);
	dot.size = 1-dot.speed;
	dot.a1 = rnd(0,0.7)*rnd(0,dot.speed)*(rnd(1)<0.5?-1:1);
	dot.r = 1;//rnd(0.5,1);
	dot.p1 = rnd(0.3,0.7);
	dots.push(dot);
	stage.addChild(dot);
	return dot;
}

function rnd(min, max) {
	if (max === undefined) { max=min; min=0; }
	return Math.random()*(max-min)+min;
}

function onResize() {
	w = $('#'+helix_mainId).width();
	h = $('#'+helix_mainId).height();
	max = Math.max(w,h);
	min = Math.min(w,h);
	target.width = w;
	target.height = h;
	stage.updateViewport(w,h);
	stage.update();
}

window.addEventListener("resize", onResize);
onResize();
});