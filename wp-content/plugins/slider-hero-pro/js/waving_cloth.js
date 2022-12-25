jQuery(document).ready(function($){
	
if (typeof waving_cloth_mainId === 'undefined' || waving_cloth_mainId === null) {
    waving_cloth_mainId = mainId;
}
	
var mainArea = document.getElementById(waving_cloth_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_waving_cloth");

var PI_BY_180 = Math.PI / 180,
    PI2 = 2 * Math.PI,
    c = document.querySelector('#hero_waving_cloth'),
    ctx = c.getContext('2d'),
    dots = [],
    W = $('#'+waving_cloth_mainId).width(),
    H = $('#'+waving_cloth_mainId).height(),
    radius = 20;

c.width = W;
c.height = H;
var n = (W+200) / 80;

function Dot (cx, cy, radius, angle, size, i, j) {
  this.cx = cx;
  this.cy = cy;
  this.size = size;
  this.radius = radius;
  this.angle = angle;
  this.i = i;
  this.j = j;
}

Dot.prototype.draw = function () {
  // ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, PI2, false);
  // ctx.fill();
  ctx.closePath();
  return this;
}

Dot.prototype.update = function () {
  this.angle += 1.5;
  this.x = this.cx + this.radius * Math.cos(this.angle * PI_BY_180);
  this.y = this.cy + this.radius * Math.sin(this.angle * PI_BY_180);
  return this;
}

function animate() {
  ctx.clearRect (0, 0, W, H);
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  for (var i = 0; i < dots.length; i++) {
    for (var j = i; j < dots.length; j++) {
      drawLine(dots[i], dots[j]);
    }
  }
  ctx.stroke();
  
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  // ctx.beginPath();
  for (var i = 0; i < dots.length; i++) {
    dots[i].update();
    dots[i].draw();
  }
  // ctx.fill();
  // ctx.closePath();
  

  window.requestAnimationFrame ? requestAnimationFrame(animate) : mozRequestAnimationFrame(animate);
}

function random(a, b) { return a + Math.random() * (b-a); }

function drawLine (d1, d2) {
  if (Math.abs(d1.i - d2.i) >= 2 || Math.abs(d1.j - d2.j) >= 2) return;
  ctx.moveTo(d1.x, d1.y);
  ctx.lineTo(d2.x, d2.y);
}

for (var i = 0; i < n; i++) {
  var y = 20;
  for (var j = 0; j < n * 2.5; j++) {
    var cx = -100 + i * 80,
        cy = y;
    y += j;

    // draw the dots
    if (j > n/2) {
      var d = new Dot(cx + random(-30,30), cy + random(-10,10), radius, i * 20 + j * 20, 3 * (j/n), i, j);
      dots.push(d);
    }
  }
}

animate();
});