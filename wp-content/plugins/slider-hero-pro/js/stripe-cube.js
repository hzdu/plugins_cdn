var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Strut = {
  random: function random(e, t) {
    return Math.random() * (t - e) + e;
  },
  arrayRandom: function arrayRandom(e) {
    return e[Math.floor(Math.random() * e.length)];
  },
  interpolate: function interpolate(e, t, n) {
    return e * (1 - n) + t * n;
  },
  rangePosition: function rangePosition(e, t, n) {
    return (n - e) / (t - e);
  },
  clamp: function clamp(e, t, n) {
    return Math.max(Math.min(e, n), t);
  },
  queryArray: function queryArray(e, t) {
    return t || (t = document.body), Array.prototype.slice.call(t.querySelectorAll(e));
  },
  ready: function ready(e) {
    document.readyState == 'complete' ? e() : document.addEventListener('DOMContentLoaded', e);
  }
};
var reduceMotion = matchMedia("(prefers-reduced-motion)").matches;

{
  // =======
  // helpers
  // =======

  var setState = function setState(state, speed) {
    return directions.forEach(function (axis) {
      state[axis] += speed[axis];
      if (Math.abs(state[axis]) < 360) return;
      var max = Math.max(state[axis], 360);
      var min = max == 360 ? Math.abs(state[axis]) : 360;
      state[axis] = max - min;
    });
  };

  var cubeIsHidden = function cubeIsHidden(left) {
    return left > parentWidth + 30;
  };

  // =================
  // shared references
  // =================

  var headerIsHidden = false;

  var template = document.getElementById("qc-cube-template");

  var parent = document.getElementById("qc-header-hero");
  var getParentWidth = function getParentWidth() {
    return parent.getBoundingClientRect().width;
  };

  var parentWidth = getParentWidth();
  window.addEventListener("resize", function () {
    return parentWidth = getParentWidth();
  });

  
  
  var directions = ["x", "y"];

  var palette = {
    white: {
      color: [255, 255, 255],
      shading: [160, 190, 218]
    },
    orange: {
      color: [255, 250, 230],
      shading: [255, 120, 50]
    },
    green: {
      color: [205, 255, 204],
      shading: [0, 211, 136]
    }
  };

  // ==============
  // cube instances
  // ==============

  var setqc_cubestyles = function setqc_cubestyles(_ref) {
    var cube = _ref.cube,
        size = _ref.size,
        left = _ref.left,
        top = _ref.top;

    Object.assign(cube.style, {
      width: size + 'px',
      height: size + 'px',
      left: left + '%',
      top: top + '%'
    });

    Object.assign(cube.querySelector(".qc_shadow").style, {
      filter: 'blur(' + Math.round(size * .6) + 'px)',
      opacity: Math.min(size / 120, .4)
    });
  };

  var createCube = function createCube(size) {
    var fragment = document.importNode(template.content, true);
    var cube = fragment.querySelector(".qc_cube");

    var state = {
      x: 0,
      y: 0
    };

    var speed = directions.reduce(function (object, axis) {
      var max = size > sizes.m ? .3 : .6;
      object[axis] = Strut.random(-max, max);
      return object;
    }, {});

    var qc_sides = Strut.queryArray(".qc_sides div", cube).reduce(function (object, side) {
      object[side.className] = {
        side: side,
        hidden: false,
        rotate: {
          x: 0,
          y: 0
        }
      };
      return object;
    }, {});

    qc_sides.qc_top.rotate.x = 90;
    qc_sides.qc_bottom.rotate.x = -90;
    qc_sides.qc_left.rotate.y = -90;
    qc_sides.qc_right.rotate.y = 90;
    qc_sides.qc_back.rotate.y = -180;

    return { fragment: fragment, cube: cube, state: state, speed: speed, qc_sides: Object.values(qc_sides) };
  };

  var sizes = {
    xs: 15,
    s: 25,
    m: 40,
    l: 100,
    xl: 120
  };

  var qc_cubes = [{
    tint: palette.green,
    size: sizes.xs,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.white,
    size: sizes.s,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.white,
    size: sizes.xl,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.white,
    size: sizes.m,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.green,
    size: sizes.xs,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.orange,
    size: sizes.s,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.white,
    size: sizes.l,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.green,
    size: sizes.s,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.white,
    size: sizes.xl,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.orange,
    size: sizes.l,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }, {
    tint: palette.green,
    size: sizes.m,
    left: Math.floor(Math.random() * 70) + 10,
    top: Math.floor(Math.random() * 70) + 10
  }].map(function (object) {
    return Object.assign(createCube(object.size), object);
  });

  qc_cubes.forEach(setqc_cubestyles);

  // =======================
  // cube rotating animation
  // =======================

  var getDistance = function getDistance(state, rotate) {
    return directions.reduce(function (object, axis) {
      object[axis] = Math.abs(state[axis] + rotate[axis]);
      return object;
    }, {});
  };

  var getRotation = function getRotation(state, size, rotate) {
    var axis = rotate.x ? "Z" : "Y";
    var direction = rotate.x > 0 ? -1 : 1;

    return '\n      rotateX(' + (state.x + rotate.x) + 'deg)\n      rotate' + axis + '(' + direction * (state.y + rotate.y) + 'deg)\n      translateZ(' + size / 2 + 'px)\n    ';
  };

  var getShading = function getShading(tint, rotate, distance) {
    var darken = directions.reduce(function (object, axis) {
      var delta = distance[axis];
      var ratio = delta / 180;
      object[axis] = delta > 180 ? Math.abs(2 - ratio) : ratio;
      return object;
    }, {});

    if (rotate.x) darken.y = 0;else {
      var x = distance.x;

      if (x > 90 && x < 270) directions.forEach(function (axis) {
        return darken[axis] = 1 - darken[axis];
      });
    }

    var alpha = (darken.x + darken.y) / 2;
    var blend = function blend(value, index) {
      return Math.round(Strut.interpolate(value, tint.shading[index], alpha));
    };

    var _tint$color$map = tint.color.map(blend),
        _tint$color$map2 = _slicedToArray(_tint$color$map, 3),
        r = _tint$color$map2[0],
        g = _tint$color$map2[1],
        b = _tint$color$map2[2];

    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  };

  var shouldHide = function shouldHide(rotateX, x, y) {
    if (rotateX) return x > 90 && x < 270;
    if (x < 90) return y > 90 && y < 270;
    if (x < 270) return y < 90;
    return y > 90 && y < 270;
  };

  var updateqc_sides = function updateqc_sides(_ref2) {
    var state = _ref2.state,
        speed = _ref2.speed,
        size = _ref2.size,
        tint = _ref2.tint,
        qc_sides = _ref2.qc_sides,
        left = _ref2.left;

    if (headerIsHidden || cubeIsHidden(left)) return;

    var animate = function animate(object) {
      var side = object.side,
          rotate = object.rotate,
          hidden = object.hidden;

      var distance = getDistance(state, rotate);

      // don't animate hidden qc_sides
      if (shouldHide(rotate.x, distance.x, distance.y)) {
        if (!hidden) {
          side.hidden = true;
          object.hidden = true;
        }
        return;
      }

      if (hidden) {
        side.hidden = false;
        object.hidden = false;
      }

      side.style.transform = getRotation(state, size, rotate);
      side.style.backgroundColor = getShading(tint, rotate, distance);
    };

    setState(state, speed);
    qc_sides.forEach(animate);
  };

  var tick = function tick() {
    qc_cubes.forEach(updateqc_sides);
    if (reduceMotion) return;
    requestAnimationFrame(tick);
  };

  // ===============
  // parallax scroll
  // ===============

  // give it some extra space to account for the parallax and the qc_shadows of the qc_cubes
  var parallaxLimit = document.querySelector(".qc_main > .qc_header").getBoundingClientRect().height + 80;


  // ==========
  // initialize
  // ==========

  var container = document.createElement("div");
  container.className = "qc_cubes";
  qc_cubes.forEach(function (_ref4) {
    var fragment = _ref4.fragment;
    return container.appendChild(fragment);
  });

  var start = function start() {
    tick();
    parent.appendChild(container);
  };

  'requestIdleCallback' in window ? requestIdleCallback(start) : start();
}