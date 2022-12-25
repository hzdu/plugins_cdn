

(function () {
  function animateAlongPath(object, path) {
    var duration = arguments.length <= 2 || arguments[2] === undefined ? 7.5 : arguments[2];
    var delay = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    var counter = { value: 0 };
    TweenLite.to(counter, duration, {
      value: path.getTotalLength(),
      repeat: -1,
      ease: Linear.easeNone,
      delay: delay,
      onUpdate: function onUpdate() {
        var coords = path.getPointAtLength(counter.value);
        TweenLite.set(object, { x: coords.x, y: coords.y });
      },
      onComplete: animateAlongPath,
      onCompleteParams: [object, path, duration, delay]
    });
  }

  var svg = document.querySelector('#hero');

  // group-planets-1
  animateAlongPath(svg.querySelector('#group-planets-1'), svg.querySelector('#orbit-group-planets-1'));

  // group-planets-2
  animateAlongPath(svg.querySelector('#group-planets-2'), svg.querySelector('#orbit-group-planets-2'), 10);

  // big-planet, group-planets-4
  var bigPlanetDuration = 7.5;
  animateAlongPath(svg.querySelector('#big-planet'), svg.querySelector('#orbit-big-planet'), bigPlanetDuration);
  animateAlongPath(svg.querySelector('#group-planets-4'), svg.querySelector('#orbit-big-planet'), bigPlanetDuration, bigPlanetDuration / 2);

  // moon-5
  animateAlongPath(svg.querySelector('#moon-5'), svg.querySelector('#orbit-moons-5'), 45);

  // moon-1, moon-2
  animateAlongPath(svg.querySelector('#moon-1'), svg.querySelector('#orbit-moons-1'), 7.5);
  animateAlongPath(svg.querySelector('#moon-2'), svg.querySelector('#orbit-moons-1'), 7.5, 2.5);

  // moon-3, moon-4
  animateAlongPath(svg.querySelector('#moon-3'), svg.querySelector('#orbit-moons-3'), 150);
  animateAlongPath(svg.querySelector('#moon-4'), svg.querySelector('#orbit-moons-4'), 150);
})();

(function () {
  var viewportWidth = 1440;
  var viewportHeight = 540;
  var lineMinWidth = 100;
  var lineMaxWidth = 500;
  var colors = ['#0ADCF2', '#EC7376', '#FCD380', '#E1EAF6', '#8DC8DC', '#4DEBC3'];
  var speedTable = {
    get 1() {
      return getRandomInt(65, 70);
    },
    get 2() {
      return getRandomInt(50, 55);
    },
    get 3() {
      return getRandomInt(45, 50);
    },
    get 4() {
      return getRandomInt(35, 40);
    },
    get 5() {
      return getRandomInt(30, 35);
    },
    get 6() {
      return getRandomInt(1, 2);
    }
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function initialPosition(width, direction) {
    if (direction === 1) {
      return -width;
    } else {
      return viewportWidth;
    }
  }

  function lineHeight(width) {
    if (width < lineMaxWidth / 2) {
      return 1;
    } else {
      return 2;
    }
  }

  function resetLine(direction, width, i) {
    var color = randomColor();
    return {
      attr: {
        width: width,
        height: lineHeight(width)
      },
      stroke: color,
      fill: color,
      x: initialPosition(width, direction),
      y: getY(i)
    };
  }

  function getY(i) {
    var sectionHeight = viewportHeight / lines.length;
    var vPadding = 20;
    return getRandomInt(sectionHeight * i + vPadding, sectionHeight * i + sectionHeight - vPadding);
  }

  function randomDirection() {
    return Math.round(Math.random()) * 2 - 1;
  }

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getSpeed(width) {
    var scaleFactor = Math.floor(width / 75);
    return speedTable[scaleFactor];
  }

  function translateX(direction, elementWidth) {
    var sign = '+';
    if (direction < 0) sign = '-';
    return sign + '=' + (viewportWidth + elementWidth);
  }

  function animateLine(el, i) {
    var width = getRandomInt(lineMinWidth, lineMaxWidth);
    var direction = randomDirection();

    TweenLite.set(el, resetLine(direction, width, i));
    TweenLite.to(el, getSpeed(width), {
      x: translateX(direction, width),
      onComplete: animateLine,
      onCompleteParams: [el, i]
    });
  }

  var lines = document.querySelectorAll('#svg .Line');

  var _loop = function _loop(i) {
    setTimeout(function () {
      animateLine(lines[i], i);
    }, 800 * i);
  };

  for (var i = 0; i < lines.length; i++) {
    _loop(i);
  }
//window.CP.exitedLoop(1);
;
})();

(function () {
  var translations = {};
  var svg = document.getElementById('svg');

  function translateLayer(id, hDistance, vDistance, factor) {
    var hDistanceScaled = hDistance / factor;
    var vDistanceScaled = vDistance / factor;

    var counter = { value: 0 };
    var precision = 40.0;
    TweenLite.killTweensOf(id);

    var thisTranslations = translations[id] || {};
    var x = thisTranslations.x || 0;
    var y = thisTranslations.y || 0;
    var finalX = hDistanceScaled;
    var finalY = vDistanceScaled;
    var stepX = (finalX - x) / precision;
    var stepY = (finalY - y) / precision;

    TweenLite.to(counter, 0.8, {
      value: precision,
      onUpdate: function onUpdate() {
        var currentX = x + stepX * counter.value;
        var currentY = y + stepY * counter.value;
        svg.getElementById(id).setAttribute('transform', 'translate(' + currentX + ', ' + currentY + ')');
        translations[id] = { x: currentX, y: currentY };
      }
    });
  }

  function parallax(e) {
    var amountMovedX = e.pageX;
    var amountMovedY = e.pageY;
    var hDistance = window.innerWidth / 2 - amountMovedX;
    var vDistance = window.innerHeight / 2 - amountMovedY;

    translateLayer("lines", hDistance, vDistance, 85);
    translateLayer("distance-3x", hDistance, vDistance, 45);
    translateLayer("distance-2x", hDistance, vDistance, -65);
    translateLayer("distance-1x", hDistance, vDistance, 85);
  }

  if (svg) {
    svg.addEventListener("mousemove", parallax, false);
  }
})();