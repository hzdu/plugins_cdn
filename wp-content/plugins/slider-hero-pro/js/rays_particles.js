jQuery(document).ready(function($){



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if(rays_particles_bg == null){
	var rays_particles_bg = 'rgb(134, 101, 159)';
}
if(rays_particles_mainId == null){
	rays_particles_mainId = mainId;
}
if(ray_particles == null){
	ray_particles = 50;
}

var PI = Math.PI;
var TAU = 2 * PI;
var cos = function cos(n) {
	return Math.cos(n);
};
var sin = function sin(n) {
	return Math.sin(n);
};
var wave = function wave(t, a) {
	return Math.abs((t + a / 2) % a - a / 2);
};

var mainArea = document.getElementById(rays_particles_mainId);
var canvas = mainArea.appendChild(document.createElement('canvas'));
var ctx = canvas.getContext("2d");

var mouse = undefined,
    emitter = undefined;

var Mouse = function () {
	function Mouse(x, y) {
		var _this = this;

		_classCallCheck(this, Mouse);

		this.hover = false;
		this.targetPosition = new Vector2(0.5 * $('#'+rays_particles_mainId).width(), 0.6 * $('#'+rays_particles_mainId).height());
		this.position = new Vector2(0.5 * $('#'+rays_particles_mainId).width(), 0.4 * $('#'+rays_particles_mainId).height());
		window.onmousemove = function (e) {
			_this.targetPosition.x = e.clientX;
			_this.targetPosition.y = e.clientY;
			_this.hover = true;
		};

		window.onmouseout = function () {
			_this.targetPosition.x = 0.5 * $('#'+rays_particles_mainId).width();
			_this.targetPosition.y = 0.6 * $('#'+rays_particles_mainId).height();
			_this.hover = false;
		};
	}

	Mouse.prototype.update = function update() {
		this.position.lerp(this.targetPosition, 0.025);
	};

	return Mouse;
}();

var Ray = function () {
	function Ray() {
		_classCallCheck(this, Ray);

		this.init();
	}

	Ray.prototype.init = function init() {
		this.ttl = 200 * Math.random() + 100;
		this.life = 0;
		this.len = 0.35 * Math.round($('#'+rays_particles_mainId).width() * Math.random()) + 100;
		this.width = 3 * Math.random() + 0.5;
		this.velocity = 0.25 - Math.random() * 0.5;
		this.position = {};
		this.position.start = new Vector2($('#'+rays_particles_mainId).width() * Math.random(), $('#'+rays_particles_mainId).height() * 0.5);
		this.angle = this.position.start.angleTo(mouse.position);
		this.position.end = new Vector2(this.position.start.x + this.len * cos(this.angle), this.position.start.y + this.len * sin(this.angle));
		this.hue = Math.round(10 * Math.random() + 40).toString();
		this.saturation = Math.round(40 * Math.random() + 20).toString();
	};

	Ray.prototype.color = function color() {
		this.alpha = 0.005 * wave(this.life, this.ttl);

		var color1 = "hsla(50,100%,100%,0)",
		    color2 = "hsla(" + this.hue + "," + this.saturation + "%,70%," + this.alpha + ")",
		    color3 = "hsla(50,50%,50%,0)",
		    gradient = ctx.createLinearGradient(this.position.start.x, this.position.start.y, this.position.end.x, this.position.end.y);

		gradient.addColorStop(0, color1);
		gradient.addColorStop(0.15, color2);
		gradient.addColorStop(1, color3);

		return gradient;
	};

	Ray.prototype.update = function update() {
		this.life++;
		this.angle = mouse.position.angleTo(this.position.start);
		this.position.end.x = this.position.start.x + this.len * cos(this.angle);
		this.position.end.y = this.position.start.y + this.len * sin(this.angle);
		this.position.start.addScalarX(this.velocity);
		this.position.end.addScalarX(this.velocity);
		if (this.life > this.ttl) this.init();
	};

	Ray.prototype.draw = function draw() {
		ctx.save();
		ctx.shadowColor = "white";
		ctx.shadowBlur = 15;
		ctx.beginPath();
		ctx.strokeStyle = this.color();
		ctx.lineWidth = this.width;
		ctx.moveTo(this.position.start.x, this.position.start.y);
		ctx.lineTo(this.position.end.x, this.position.end.y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	};

	return Ray;
}();

var Particle = function () {
	function Particle() {
		_classCallCheck(this, Particle);

		this.life = Math.round(Math.random() * 200);
		this.init();
	}

	Particle.prototype.init = function init() {
		this.ttl = 300 * Math.random() + 100;
		this.radius = 3 * Math.random() + 3;
		this.position = new Vector2($('#'+rays_particles_mainId).width() * Math.random(), $('#'+rays_particles_mainId).height() * 0.5 + (15 - Math.random() * 30));
		this.velocity = new Vector2(0.25 - Math.random() * 0.5, 0.25 - Math.random() * 0.5);
		this.hue = Math.round(15 * Math.random() + 45).toString();
	};

	Particle.prototype.color = function color() {
		this.alpha = 0.005 * wave(this.life, this.ttl);
		return "hsla(" + this.hue + ",50%,70%," + this.alpha + ")";
	};

	Particle.prototype.update = function update() {
		this.life++;
		var nTheta = noise.simplex3(this.position.x * 0.0025, this.position.y * 0.0025, this.life * 0.0025) * TAU;
		this.velocity.lerp({
			x: cos(nTheta),
			y: sin(nTheta)
		}, 0.05);
		var mTheta = mouse.position.angleTo(this.position);
		this.velocity.lerp({
			x: cos(mTheta),
			y: sin(mTheta)
		}, 0.075);
		this.position.add(this.velocity);
		if (this.life > this.ttl) {
			this.life = 0;
			this.init();
		}
	};

	Particle.prototype.draw = function draw() {
		ctx.save();
		ctx.shadowColor = "white";
		ctx.shadowBlur = 15;
		ctx.beginPath();
		ctx.fillStyle = this.color();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, TAU);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	};

	return Particle;
}();

var Emitter = function () {
	function Emitter() {
		var _this2 = this;

		_classCallCheck(this, Emitter);

		this.rayCount = ray_particles;
		this.particleCount = ray_particles;  
		this.title = {
			element: document.querySelector('.title'),
			value: 'QuantumCloud'
		};
		this.input = {
			rays: {
				element: document.querySelector('#ray-input'),
				label: document.querySelector('.ray-count'),
				value: "Rays: " + this.rayCount
			},
			particles: {
				element: document.querySelector('#particle-input'),
				label: document.querySelector('.particle-count'),
				value: "Particles: " + this.particleCount
			}
		};

		this.init();
	}

	Emitter.prototype.init = function init() {
		this.objects = [];
		this.updateTitle();
		for (var i = 0; i < this.rayCount; i++) {
			this.objects.push(new Ray());
		}
		for (var i = 0; i < this.particleCount; i++) {
			this.objects.push(new Particle());
		}
	};

	Emitter.prototype.updateTitle = function updateTitle() {
		if (this.rayCount > 0 || this.particleCount > 0) {
			this.title.value = "\n\t\t\t\t" + (this.rayCount > 0 ? "Rays" : "") + "\n\t\t\t\t" + (this.rayCount > 0 && this.particleCount > 0 ? " & " : "") + "\n\t\t\t\t" + (this.particleCount > 0 ? "Particles" : "") + "\n\t\t\t";
		} else {
			this.title.value = "¯\\_(?)_/¯";
		}
	};

	

	Emitter.prototype.background = function background() {
		var color1 = "rgb(31,31,18)",
		    color2 = rays_particles_bg,
		    gradient = ctx.createLinearGradient(0.5 * canvas.width, 0, 0.5 * canvas.width, canvas.height);
		gradient.addColorStop(0, color1);
		gradient.addColorStop(0.5, color2);
		gradient.addColorStop(1, color1);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	Emitter.prototype.render = function render() {
		this.background();
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].update();
			this.objects[i].draw();
		}
		//this.showTitle();
	};

	return Emitter;
}();

function resize() {
	canvas.width = $('#'+rays_particles_mainId).width();
	canvas.height = $('#'+rays_particles_mainId).height();
	mouse.targetPosition.x = 0.5 * $('#'+rays_particles_mainId).width();
	mouse.targetPosition.y = 0.6 * $('#'+rays_particles_mainId).height();
}

function loop() {
	mouse.update();
	emitter.render();
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame = function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
}();

window.onresize = function () {
	return resize();
};


	noise.seed(Math.round(2000 * Math.random()));
	mouse = new Mouse();
	emitter = new Emitter();
	resize();
	loop();

})