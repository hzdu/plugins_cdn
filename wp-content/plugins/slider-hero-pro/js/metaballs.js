jQuery(document).ready(function($){
if (typeof metaballs_mainId === 'undefined' || metaballs_mainId === null) {
    metaballs_mainId = mainId;
}
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var circle = '<svg viewBox="0 0 67.4 67.4"><circle class="hero_circle" cx="33.7" cy="33.7" r="33.7"/></svg>';

var Particle = function () {
  function Particle(svg, coordinates, friction) {
    _classCallCheck(this, Particle);

    this.svg = svg;
    this.steps = jQuery('#'+metaballs_mainId).height() / 2;
    this.item = null;
    this.friction = friction;
    this.coordinates = coordinates;
    this.position = this.coordinates.y;
    this.dimensions = this.render();
    this.move();
    this.rotation = Math.random() > 0.5 ? "-" : "+";
    this.scale = 0.4 + Math.random() * 2;
    this.siner = jQuery('#'+metaballs_mainId).width() / 2.5 * Math.random();
  }

  Particle.prototype.destroy = function destroy() {
    this.item.remove();
  };

  Particle.prototype.move = function move() {
    this.position = this.position - this.friction;
    var top = this.position;
    var left = this.coordinates.x + Math.sin(this.position * Math.PI / this.steps) * this.siner;
    this.item.css({
      transform: "translateX(" + left + "px) translateY(" + top + "px) scale(" + this.scale + ") rotate(" + this.rotation + (this.position + this.dimensions.height) + "deg)"
    });

    if (this.position < -this.dimensions.height) {
      this.destroy();
      return false;
    } else {
      return true;
    }
  };

  Particle.prototype.render = function render() {
    this.item = jQuery(this.svg, {
      css: {
        transform: "translateX(" + this.coordinates.x + "px) translateY(" + this.coordinates.y + "px)"
      }
    });
    jQuery('#slider_hero_particles').append(this.item);
    return {
      width: 10,
      height: 10
    };
  };

  return Particle;
}();

var isPaused = false;
window.onblur = function () {
  isPaused = true;
}.bind(undefined);
window.onfocus = function () {
  isPaused = false;
}.bind(undefined);

//-------------------------------
var particles = [];

setInterval(function () {
  if (!isPaused) {
    particles.push(new Particle(circle, {
      "x": Math.random() * jQuery('#'+metaballs_mainId).width(),
      "y": jQuery('#'+metaballs_mainId).height() + 100
    }, 1 + Math.random()));
  }
}, 180);

function update() {
  particles = particles.filter(function (p) {
    return p.move();
  });
  requestAnimationFrame(update.bind(this));
}
update();
});