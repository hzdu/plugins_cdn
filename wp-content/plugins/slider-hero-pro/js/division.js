jQuery(document).ready(function($){


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof division_mainId === 'undefined' || division_mainId === null) {
    division_mainId = mainId;
}
// Configuration
var SIM_ITERATIONS = 14;

var Vector2 = function () {
	function Vector2() {
		var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
		var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		_classCallCheck(this, Vector2);

		this.x = x;
		this.y = y;
	}

	Vector2.prototype.clone = function clone() {
		return new Vector2(this.x, this.y);
	};

	Vector2.prototype.add = function add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};

	Vector2.prototype.subtract = function subtract(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	};

	Vector2.prototype.multiply = function multiply(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	};

	Vector2.prototype.multiplyScalar = function multiplyScalar(s) {
		this.x *= s;
		this.y *= s;
		return this;
	};

	Vector2.fromScalar = function fromScalar(s) {
		return new Vector2(s, s);
	};

	return Vector2;
}();

var Rectangle = function () {
	function Rectangle(position, size) {
		_classCallCheck(this, Rectangle);

		this.position = position;
		this.size = size;
	}

	Rectangle.prototype.getSurfaceSize = function getSurfaceSize() {
		return this.size.x * this.size.y;
	};

	Rectangle.prototype.cut = function cut(position) {
		var orientation = Math.random() < .5 ? 'x' : 'y';
		var positionInv = 1 - position;

		var positionA = this.position.clone();
		var sizeA = this.size.clone();
		sizeA[orientation] *= position;

		var positionB = this.position.clone();
		var sizeB = this.size.clone();
		positionB[orientation] += sizeA[orientation];
		sizeB[orientation] -= sizeA[orientation];

		return [new Rectangle(positionA, sizeA), new Rectangle(positionB, sizeB)];
	};

	Rectangle.prototype.render = function render(context) {
		var scale = arguments.length <= 1 || arguments[1] === undefined ? Vector2.fromScalar(1) : arguments[1];

		var position = this.position.clone().multiply(scale);

		var size = this.size.clone().multiply(scale);

		context.fillRect(position.x, position.y, size.x, size.y);
	};

	return Rectangle;
}();

var Simulation = function () {
	function Simulation(interationsMAx) {
		_classCallCheck(this, Simulation);

		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.scale = Vector2.fromScalar(1);
		this.rectangles = [];

		this.loop = this.animate.bind(this);
		this.loopInterval = null;

		this.iterationsMax = interationsMAx;

		this.reset();
	}

	Simulation.prototype.setSize = function setSize(width, height) {
		this.canvas.height = height;
		this.canvas.width = width;

		this.scale.x = width;
		this.scale.y = height;
	};

	Simulation.prototype.reset = function reset() {
		if (this.loopInterval) {
			this.loopInterval = cancelAnimationFrame(this.loopInterval);
			this.loopInterval = null;
		}

		this.iteration = 0;

		this.rectangles = [new Rectangle(Vector2.fromScalar(0), Vector2.fromScalar(1))];

		this.animate();
	};

	Simulation.prototype.animate = function animate() {
		if (++this.iteration <= this.iterationsMax) {
			this.loopInterval = requestAnimationFrame(this.loop);
		}

		this.update();
		this.render();
	};

	Simulation.prototype.update = function update() {
		var newRectangles = [];
		var cutMin = .1;
		var cutMax = .9;

		this.rectangles.forEach(function (rectangle, index) {
			var cut = cutMin + (cutMax - cutMin) * Math.random();
			var segments = rectangle.cut(cut);
			newRectangles.push.apply(newRectangles, segments);
		});

		this.rectangles = newRectangles;
	};

	Simulation.prototype.getColor = function getColor(rectangle) {
		var shadeMin = .25;
		var shadeMax = .75;

		var hue = rectangle.position.x;
		var shade = shadeMin + (shadeMax - shadeMin) * (1 - rectangle.position.y);

		return 'hsl(' + hue * 360 + ', 80%, ' + shade * 100 + '%)';
	};

	Simulation.prototype.render = function render() {
		var _this = this;

		this.context.fillStyle = 'rgba(255, 255, 255, .5)';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.rectangles.forEach(function (rectangle, index) {
			_this.context.fillStyle = _this.getColor(rectangle);
			rectangle.render(_this.context, _this.scale);
		});
	};

	return Simulation;
}();

var sim = new Simulation(SIM_ITERATIONS);
sim.setSize($('#'+mainId).width(), $('#'+division_mainId).height());

document.getElementById(division_mainId).appendChild(sim.canvas);

window.addEventListener('click', function () {
	return sim.reset();
});
window.addEventListener('resize', function () {
	sim.setSize($('#'+division_mainId).width(), $('#'+division_mainId).height());
	sim.render();
});
})
