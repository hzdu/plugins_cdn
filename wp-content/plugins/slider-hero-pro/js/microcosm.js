jQuery(document).ready(function($){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var max_particles = 1000;

if(microcosmbgcolor == null){
	var microcosmbgcolor = '#000155';
}

if(microcosm_mainId == null){
	microcosm_mainId = mainId;
}

var tela = document.createElement('canvas');
tela.width = $('#'+microcosm_mainId).width();
tela.height = $('#'+microcosm_mainId).height();
$("#"+microcosm_mainId).append(tela);

var canvas = tela.getContext('2d');

var Particle = function () {
  function Particle(canvas, progress) {
    _classCallCheck(this, Particle);

    var random = Math.random();
    this.progress = 0;
    this.canvas = canvas;

    this.x = $('#'+microcosm_mainId).width() / 2 + (Math.random() * 200 - Math.random() * 200);
    this.y = $('#'+microcosm_mainId).height() / 2 + (Math.random() * 200 - Math.random() * 200);

    this.w = $('#'+microcosm_mainId).width();
    this.h = $('#'+microcosm_mainId).height();
    this.radius = random > .1 ? Math.random() * 0.8 : Math.random() * 1.8;
    this.radius = random > .9 ? Math.random() * 2 : this.radius;
    this.color = random > .1 ? "#f981fe" : "#64f9ff";
    this.color = random > .9 ? "#FFFFFF" : this.color;

    // this.color  = random > .1 ? "#ffae00" : "#f0ff00" // Alien
    this.variantx1 = Math.random() * 100;
    this.variantx2 = Math.random() * 100;
    this.varianty1 = Math.random() * 100;
    this.varianty2 = Math.random() * 100;
  }

  Particle.prototype.render = function render() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.lineWidth = 2;
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  };

  Particle.prototype.move = function move() {
    this.x += Math.sin(this.progress / this.variantx1) * Math.cos(this.progress / this.variantx2);
    this.y += Math.sin(this.progress / this.varianty1) * Math.cos(this.progress / this.varianty2);

    if (this.x < 0 || this.x > this.w - this.radius) {
      return false;
    }

    if (this.y < 0 || this.y > this.h - this.radius) {
      return false;
    }
    this.render();
    this.progress++;
    return true;
  };

  return Particle;
}();

var particles = [];
var init_num = popolate(max_particles);
function popolate(num) {
  for (var i = 0; i < num; i++) {
    setTimeout(function () {
      particles.push(new Particle(canvas, i));
    }.bind(this), i * 20);
  }
  return particles.length;
}

function clear() {
  canvas.globalAlpha = 0.05;
  canvas.fillStyle = microcosmbgcolor;
  // canvas.fillStyle='#0d0c14'; // Alien
  canvas.fillRect(0, 0, tela.width, tela.height);
  canvas.globalAlpha = 1;
}

function update() {
  particles = particles.filter(function (p) {
    return p.move();
  });
  if (particles.length < init_num) {
    popolate(1);
  }
  clear();
  requestAnimationFrame(update.bind(this));
}
update();
});