jQuery(document).ready(function($){
	

if(colorful_particle_mainId == null){
	colorful_particle_mainId = mainId;
}

var mainArea = document.getElementById(colorful_particle_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_colorful_particle");

(function () {
  Math.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  Math.randomDec = function (min, max, decimals) {
    return (Math.random() * (max - min) + min).toFixed(decimals || 2);
  };
  Math.randomList = function (list) {
    return list[Math.randomInt(0, list.length)];
  };
})();
var c, ctx, w, h, particles, nextframe;


function init() {
  c = document.getElementById('hero_colorful_particle');
  c.width = w = $('#'+colorful_particle_mainId).width();
  c.height = h = $('#'+colorful_particle_mainId).height();
  ctx = c.getContext('2d');
  
  particles = [];
  for (var i = 0; i < 100; i++) {
    particles[i] = new Particle();
    particles[i].init();
  }
  
  loop();
}


function loop() {
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].isOut()) {
      particles[i].init();
    }
    particles[i].clear();
  }
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  
  nextframe = requestAnimationFrame(loop);
}


function Particle() {
  this.alive = false;
  
  this.init = function () {
    this.x = w/2;
    this.y = h/2;
    this.r = Math.randomInt(4, 8);
    this.a = Math.randomDec(0, 2*Math.PI);
    this.s = Math.randomDec(.2, 2);
    this.c = Math.randomList(['tomato', 'gray', 'orange']);
    this.alive = true;
  };
}

Particle.prototype.kill = function () {
  this.alive = false;
};

Particle.prototype.isOut = function () {
  return (this.x+this.r < 0
         || this.x-this.r > w
         || this.y+this.r < 0
         || this.y-this.r > h);
};

Particle.prototype.update = function () {
  this.x += Math.cos(this.a) * this.s;
  this.y += Math.sin(this.a) * this.s;
};

Particle.prototype.clear = function () {
  ctx.clearRect(this.x-this.r-1, this.y-this.r-1, 2*this.r+2, 2*this.r+2);
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
  ctx.fillStyle = this.c;
  ctx.fill();
};


init();


window.addEventListener('resize', function () {
  cancelAnimationFrame(nextframe);
  init();
});
})