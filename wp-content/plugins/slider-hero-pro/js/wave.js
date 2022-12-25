jQuery(document).ready(function($){
	

var Line = (function () {
    function Line(line) {
        this.x = line.x;
        this.y = line.y;
        this.id = line.id;
    }
    Line.prototype.setX = function (x) {
        this.x = x;
    };
    Line.prototype.setY = function (y) {
        this.y = y;
    };
    Line.prototype.toString = function () {
        return "L " + this.x + " " + this.y + " ";
    };
    return Line;
}());
var MoveTo = (function () {
    function MoveTo(move) {
        this.x = move.x;
        this.y = move.y;
        this.id = move.id;
    }
    MoveTo.prototype.setX = function (x) {
        this.x = x;
    };
    MoveTo.prototype.setY = function (y) {
        this.y = y;
    };
    MoveTo.prototype.toString = function () {
        return "M " + this.x + " " + this.y + " ";
    };
    return MoveTo;
}());
var Curves = (function () {
    function Curves(curve, nexts) {
        this.curve = curve;
        this.id = curve.id;
        this.nexts = nexts;
    }
    Curves.prototype.toString = function () {
        var curves = this.nexts.map(function (next) {
            return "T " + next.x + " " + next.y;
        }).join(' ');
        return "Q " + this.curve.x1 + " " + this.curve.y1 + " " + this.curve.x + " " + this.curve.y + " " + curves;
    };
    return Curves;
}());
var Path = (function ($) {
    function Path(element) {
        this.paths = [];
        this.element = element;
    }
    Path.prototype.moveTo = function (move) {
        var _move = new MoveTo(move);
        this.paths.push(_move);
    };
    Path.prototype.addCurve = function (curve, nexts) {
        var _curve = new Curves(curve, nexts);
        this.paths.push(_curve);
    };
    Path.prototype.addLine = function (line) {
        var _line = new Line(line);
        this.paths.push(_line);
    };
    Path.prototype.refresh = function () {
        var generated = this.paths.map(function (path) {
            return path.toString();
        }).join("");
        jQuery(this.element).attr('d', generated);
    };
    Path.prototype.getElement = function (name) {
        return this.paths.filter(function (path) { return path.id === name; })[0];
    };
    Path.prototype.clear = function () {
        this.paths = [];
    };
    return Path;
}());
var circleAnimation = (function () {
    function circleAnimation(baseX, baseY, radius, offset) {
        this.offset = 0;
        this.step = 0;
        this.steps = 100;
        this.baseX = baseX;
        this.baseY = baseY;
        this.radius = radius;
        this.step = offset | 0;
    }
    circleAnimation.prototype.calculation = function () {
        if (this.step > this.steps) {
            this.step = this.offset;
        }
        this.step++;
        this.x = (this.baseX + this.radius * Math.cos(2 * Math.PI * this.step / this.steps));
        this.y = (this.baseY + this.radius * Math.sin(2 * Math.PI * this.step / this.steps));
    };
    return circleAnimation;
}());
var Wave = (function () {
    function Wave(svg, options) {
        this.opt = options;
        this.path = new Path(svg);
        this.draw();
        this.animate();
        this.run();
    }
    Wave.prototype.animate = function () {
        this.curve = this.path.getElement('curve');
        this.animation = new circleAnimation(this.curve.curve.x1 - this.opt.animationRadius, this.curve.curve.y1 - this.opt.animationRadius, this.opt.animationRadius, this.opt.animationOffset);
    };
    Wave.prototype.draw = function () {
        this.path.moveTo({ x: this.opt.xOffset, y: this.opt.height });
        this.path.addLine({ x: this.opt.xOffset, y: this.opt.height - this.opt.yOffset });
        this.path.addCurve({
            id: 'curve',
            x1: this.opt.width / this.opt.bumps / 2 + this.opt.xOffset, y1: this.opt.height - this.opt.yOffset - this.opt.amplitude,
            x: this.opt.width / this.opt.bumps + this.opt.xOffset, y: this.opt.height - this.opt.yOffset
        }, this.getBumps());
        this.path.addLine({ x: this.opt.width / this.opt.bumps * (this.opt.bumps + 2) + this.opt.xOffset, y: this.opt.height });
    };
    Wave.prototype.getBumps = function () {
        var bumps = [];
        for (var i = 2; i < this.opt.bumps + 2; i++) {
            bumps.push({ x: this.opt.width / this.opt.bumps * i + this.opt.xOffset, y: this.opt.height - this.opt.yOffset });
        }
        return bumps;
    };
    Wave.prototype.refresh = function () {
        this.animate();
    };
    Wave.prototype.run = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.path.clear();
            _this.draw();
            _this.curve = _this.path.getElement('curve');
            _this.animation.radius = _this.opt.animationRadius;
            _this.animation.calculation();
            _this.curve.curve.x1 = _this.animation.x;
            _this.curve.curve.y1 = _this.animation.y;
            _this.path.refresh();
        }, 50);
    };
    Wave.prototype.stop = function () {
        clearInterval(interval);
    };
    return Wave;
}());

jQuery('#slider_hero_mySVG').width(jQuery('#slider_hero_mySVG').parent().width());
var wave1 = new Wave('#slider_hero_myPath', {
    width: jQuery('#slider_hero_mySVG').width(),
    height: 200,
    bumps: 8,
    xOffset: -100,
    yOffset: 50,
    amplitude: 20,
    animationRadius: 20,
    animationOffset: 100
});
var wave2 = new Wave('#slider_hero_myPath2', {
    width: jQuery('#slider_hero_mySVG').width(),
    height: 200,
    bumps: 9,
    xOffset: -200,
    yOffset: 50,
    amplitude: 20,
    animationRadius: 15,
    animationOffset: 150
});
var wave3 = new Wave('#slider_hero_myPath3', {
    width: jQuery('#slider_hero_mySVG').width(),
    height: 200,
    bumps: 8,
    xOffset: -60,
    yOffset: 50,
    amplitude: 20,
    animationRadius: 15,
    animationOffset: 50
});
});