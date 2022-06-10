/**
 * Negate a vector.
 * @param A
 */
/**
 * Add vectors.
 * @param A
 * @param B
 */

function add(A, B) {
  return [A[0] + B[0], A[1] + B[1]];
}
/**
 * Subtract vectors.
 * @param A
 * @param B
 */

function sub(A, B) {
  return [A[0] - B[0], A[1] - B[1]];
}
/**
 * Get the vector from vectors A to B.
 * @param A
 * @param B
 */

function vec(A, B) {
  // A, B as vectors get the vector from A to B
  return [B[0] - A[0], B[1] - A[1]];
}
/**
 * Vector multiplication by scalar
 * @param A
 * @param n
 */

function mul(A, n) {
  return [A[0] * n, A[1] * n];
}
/**
 * Vector division by scalar.
 * @param A
 * @param n
 */

function div(A, n) {
  return [A[0] / n, A[1] / n];
}
/**
 * Perpendicular rotation of a vector A
 * @param A
 */

function per(A) {
  return [A[1], -A[0]];
}
/**
 * Dot product
 * @param A
 * @param B
 */

function dpr(A, B) {
  return A[0] * B[0] + A[1] * B[1];
}
/**
 * Length of the vector
 * @param A
 */

function len(A) {
  return Math.hypot(A[0], A[1]);
}
/**
 * Length of the vector squared
 * @param A
 */

function len2(A) {
  return A[0] * A[0] + A[1] * A[1];
}
/**
 * Dist length from A to B squared.
 * @param A
 * @param B
 */

function dist2(A, B) {
  return len2(sub(A, B));
}
/**
 * Get normalized / unit vector.
 * @param A
 */

function uni(A) {
  return div(A, len(A));
}
/**
 * Dist length from A to B
 * @param A
 * @param B
 */

function dist(A, B) {
  return Math.hypot(A[1] - B[1], A[0] - B[0]);
}
/**
 * Rotate a vector around another vector by r (radians)
 * @param A vector
 * @param C center
 * @param r rotation in radians
 */

function rotAround(A, C, r) {
  var s = Math.sin(r);
  var c = Math.cos(r);
  var px = A[0] - C[0];
  var py = A[1] - C[1];
  var nx = px * c - py * s;
  var ny = px * s + py * c;
  return [nx + C[0], ny + C[1]];
}
/**
 * Interpolate vector A to B with a scalar t
 * @param A
 * @param B
 * @param t scalar
 */

function lrp(A, B, t) {
  return add(A, mul(vec(A, B), t));
} //  isLeft: >0 for counterclockwise
function isEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function lerp(y1, y2, mu) {
  return y1 * (1 - mu) + y2 * mu;
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
/**
 * Convert an array of points to the correct format ([x, y, radius])
 * @param points
 * @returns
 */

function toPointsArray(points) {
  if (Array.isArray(points[0])) {
    return points.map(function (_ref) {
      var x = _ref[0],
          y = _ref[1],
          _ref$ = _ref[2],
          pressure = _ref$ === void 0 ? 0.5 : _ref$;
      return [x, y, pressure];
    });
  } else {
    return points.map(function (_ref2) {
      var x = _ref2.x,
          y = _ref2.y,
          _ref2$pressure = _ref2.pressure,
          pressure = _ref2$pressure === void 0 ? 0.5 : _ref2$pressure;
      return [x, y, pressure];
    });
  }
}
/**
 * Compute a radius based on the pressure.
 * @param size
 * @param thinning
 * @param easing
 * @param pressure
 * @returns
 */

function getStrokeRadius(size, thinning, easing, pressure) {
  if (pressure === void 0) {
    pressure = 0.5;
  }

  if (!thinning) return size / 2;
  pressure = clamp(easing(pressure), 0, 1);
  return (thinning < 0 ? lerp(size, size + size * clamp(thinning, -0.95, -0.05), pressure) : lerp(size - size * clamp(thinning, 0.05, 0.95), size, pressure)) / 2;
}

var min = Math.min,
    PI = Math.PI;
/**
 * ## getStrokePoints
 * @description Get points for a stroke.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param streamline How much to streamline the stroke.
 * @param size The stroke's size.
 */

function getStrokePoints(points, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$simulatePres = _options.simulatePressure,
      simulatePressure = _options$simulatePres === void 0 ? true : _options$simulatePres,
      _options$streamline = _options.streamline,
      streamline = _options$streamline === void 0 ? 0.5 : _options$streamline,
      _options$size = _options.size,
      size = _options$size === void 0 ? 8 : _options$size;
  streamline /= 2;

  if (!simulatePressure) {
    streamline /= 2;
  }

  var pts = toPointsArray(points);
  var len = pts.length;
  if (len === 0) return [];
  if (len === 1) pts.push(add(pts[0], [1, 0]));
  var strokePoints = [{
    point: [pts[0][0], pts[0][1]],
    pressure: pts[0][2],
    vector: [0, 0],
    distance: 0,
    runningLength: 0
  }];

  for (var i = 1, j = 0, curr = pts[i], prev = strokePoints[j]; i < len; i++, curr = pts[i], prev = strokePoints[j]) {
    var point = lrp(prev.point, curr, 1 - streamline);
    if (isEqual(prev.point, point)) continue;
    var pressure = curr[2];
    var vector = uni(vec(point, prev.point));
    var distance = dist(point, prev.point);
    var runningLength = prev.runningLength + distance;
    strokePoints.push({
      point: point,
      pressure: pressure,
      vector: vector,
      distance: distance,
      runningLength: runningLength
    });
    j += 1; // only increment j if we add an item to strokePoints
  }
  /*
    Align vectors at the end of the line
       Starting from the last point, work back until we've traveled more than
    half of the line's size (width). Take the current point's vector and then
    work forward, setting all remaining points' vectors to this vector. This
    removes the "noise" at the end of the line and allows for a better-facing
    end cap.
  */
  // Update the length to the length of the strokePoints array.


  len = strokePoints.length;
  var totalLength = strokePoints[len - 1].runningLength;

  for (var _i = len - 2; _i > 1; _i--) {
    var _strokePoints$_i = strokePoints[_i],
        _runningLength = _strokePoints$_i.runningLength,
        _vector = _strokePoints$_i.vector;
    var dpr$1 = dpr(strokePoints[_i - 1].vector, strokePoints[_i].vector);

    if (totalLength - _runningLength > size / 2 || dpr$1 < 0.8) {
      for (var _j = _i; _j < len; _j++) {
        strokePoints[_j].vector = _vector;
      }

      break;
    }
  }

  return strokePoints;
}
/**
 * ## getStrokeOutlinePoints
 * @description Get an array of points (as `[x, y]`) representing the outline of a stroke.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param options An (optional) object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Tapering and easing function for the start of the line.
 * @param options.end Tapering and easing function for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */

function getStrokeOutlinePoints(points, options) {
  if (options === void 0) {
    options = {};
  }

  var _options2 = options,
      _options2$size = _options2.size,
      size = _options2$size === void 0 ? 8 : _options2$size,
      _options2$thinning = _options2.thinning,
      thinning = _options2$thinning === void 0 ? 0.5 : _options2$thinning,
      _options2$smoothing = _options2.smoothing,
      smoothing = _options2$smoothing === void 0 ? 0.5 : _options2$smoothing,
      _options2$simulatePre = _options2.simulatePressure,
      simulatePressure = _options2$simulatePre === void 0 ? true : _options2$simulatePre,
      _options2$easing = _options2.easing,
      easing = _options2$easing === void 0 ? function (t) {
    return t;
  } : _options2$easing,
      _options2$start = _options2.start,
      start = _options2$start === void 0 ? {} : _options2$start,
      _options2$end = _options2.end,
      end = _options2$end === void 0 ? {} : _options2$end,
      _options2$last = _options2.last,
      isComplete = _options2$last === void 0 ? false : _options2$last;
  var _options3 = options,
      _options3$streamline = _options3.streamline,
      streamline = _options3$streamline === void 0 ? 0.5 : _options3$streamline;
  streamline /= 2;
  var _start$taper = start.taper,
      taperStart = _start$taper === void 0 ? 0 : _start$taper,
      _start$easing = start.easing,
      taperStartEase = _start$easing === void 0 ? function (t) {
    return t * (2 - t);
  } : _start$easing;
  var _end$taper = end.taper,
      taperEnd = _end$taper === void 0 ? 0 : _end$taper,
      _end$easing = end.easing,
      taperEndEase = _end$easing === void 0 ? function (t) {
    return --t * t * t + 1;
  } : _end$easing; // The number of points in the array

  var len = points.length; // We can't do anything with an empty array.

  if (len === 0) return []; // The total length of the line

  var totalLength = points[len - 1].runningLength; // Our collected left and right points

  var leftPts = [];
  var rightPts = []; // Previous pressure (start with average of first five pressures)

  var prevPressure = points.slice(0, 5).reduce(function (acc, cur) {
    return (acc + cur.pressure) / 2;
  }, points[0].pressure); // The current radius

  var radius = getStrokeRadius(size, thinning, easing, points[len - 1].pressure); // Previous vector

  var prevVector = points[0].vector; // Previous left and right points

  var pl = points[0].point;
  var pr = pl; // Temporary left and right points

  var tl = pl;
  var tr = pr;
  /*
    Find the outline's left and right points
      Iterating through the points and populate the rightPts and leftPts arrays,
   skipping the first and last pointsm, which will get caps later on.
  */

  for (var i = 1; i < len - 1; i++) {
    var _points$i = points[i],
        point = _points$i.point,
        pressure = _points$i.pressure,
        vector = _points$i.vector,
        distance = _points$i.distance,
        runningLength = _points$i.runningLength;
    /*
      Calculate the radius
           If not thinning, the current point's radius will be half the size; or
      otherwise, the size will be based on the current (real or simulated)
      pressure.
    */

    if (thinning) {
      if (simulatePressure) {
        var rp = min(1, 1 - distance / size);
        var sp = min(1, distance / size);
        pressure = min(1, prevPressure + (rp - prevPressure) * (sp / 2));
      }

      radius = getStrokeRadius(size, thinning, easing, pressure);
    } else {
      radius = size / 2;
    }
    /*
      Apply tapering
           If the current length is within the taper distance at either the
      start or the end, calculate the taper strengths. Apply the smaller
      of the two taper strengths to the radius.
    */


    var ts = runningLength < taperStart ? taperStartEase(runningLength / taperStart) : 1;
    var te = totalLength - runningLength < taperEnd ? taperEndEase((totalLength - runningLength) / taperEnd) : 1;
    radius *= Math.min(ts, te);
    /*
      Handle sharp corners
           Find the difference (dot product) between the current and next vector.
      If the next vector is at more than a right angle to the current vector,
      draw a cap at the current point.
    */

    var nextVector = points[i + 1].vector;
    var dpr$1 = dpr(vector, nextVector);

    if (dpr$1 < 0) {
      var _offset = mul(per(prevVector), radius);

      for (var t = 0; t < 1; t += 0.2) {
        tr = rotAround(add(point, _offset), point, PI * -t);
        tl = rotAround(sub(point, _offset), point, PI * t);
        rightPts.push(tr);
        leftPts.push(tl);
      }

      pl = tl;
      pr = tr;
      continue;
    }
    /*
      Add regular points
           Project points to either side of the current point, using the
      calculated size as a distance. If a point's distance to the
      previous point on that side greater than the minimum distance
      (or if the corner is kinda sharp), add the points to the side's
      points array.
    */


    var offset = mul(per(lrp(nextVector, vector, dpr$1)), radius);
    tl = sub(point, offset);
    tr = add(point, offset);
    var alwaysAdd = i === 1 || dpr$1 < 0.25;
    var minDistance = Math.pow((runningLength > size ? size : size / 2) * smoothing, 2);

    if (alwaysAdd || dist2(pl, tl) > minDistance) {
      leftPts.push(lrp(pl, tl, streamline));
      pl = tl;
    }

    if (alwaysAdd || dist2(pr, tr) > minDistance) {
      rightPts.push(lrp(pr, tr, streamline));
      pr = tr;
    } // Set variables for next iteration


    prevPressure = pressure;
    prevVector = vector;
  }
  /*
    Drawing caps
    
    Now that we have our points on either side of the line, we need to
    draw caps at the start and end. Tapered lines don't have caps, but
    may have dots for very short lines.
  */


  var firstPoint = points[0];
  var lastPoint = points[len - 1];
  var isVeryShort = rightPts.length < 2 || leftPts.length < 2;
  /*
    Draw a dot for very short or completed strokes
    
    If the line is too short to gather left or right points and if the line is
    not tapered on either side, draw a dot. If the line is tapered, then only
    draw a dot if the line is both very short and complete. If we draw a dot,
    we can just return those points.
  */

  if (isVeryShort && (!(taperStart || taperEnd) || isComplete)) {
    var ir = 0;

    for (var _i2 = 0; _i2 < len; _i2++) {
      var _points$_i = points[_i2],
          _pressure = _points$_i.pressure,
          _runningLength2 = _points$_i.runningLength;

      if (_runningLength2 > size) {
        ir = getStrokeRadius(size, thinning, easing, _pressure);
        break;
      }
    }

    var _start = sub(firstPoint.point, mul(per(uni(vec(lastPoint.point, firstPoint.point))), ir || radius));

    var dotPts = [];

    for (var _t = 0, step = 0.1; _t <= 1; _t += step) {
      dotPts.push(rotAround(_start, firstPoint.point, PI * 2 * _t));
    }

    return dotPts;
  }
  /*
    Draw a start cap
       Unless the line has a tapered start, or unless the line has a tapered end
    and the line is very short, draw a start cap around the first point. Use
    the distance between the second left and right point for the cap's radius.
    Finally remove the first left and right points. :psyduck:
  */


  var startCap = [];

  if (!taperStart && !(taperEnd && isVeryShort)) {
    tr = rightPts[1];

    for (var _i3 = 1; _i3 < leftPts.length; _i3++) {
      if (!isEqual(tr, leftPts[_i3])) {
        tl = leftPts[_i3];
        break;
      }
    }

    if (!isEqual(tr, tl)) {
      var _start2 = sub(firstPoint.point, mul(uni(vec(tr, tl)), dist(tr, tl) / 2));

      for (var _t2 = 0, _step = 0.2; _t2 <= 1; _t2 += _step) {
        startCap.push(rotAround(_start2, firstPoint.point, PI * _t2));
      }

      leftPts.shift();
      rightPts.shift();
    }
  }
  /*
    Draw an end cap
       If the line does not have a tapered end, and unless the line has a tapered
    start and the line is very short, draw a cap around the last point. Finally,
    remove the last left and right points. Otherwise, add the last point. Note
    that This cap is a full-turn-and-a-half: this prevents incorrect caps on
    sharp end turns.
  */


  var endCap = [];

  if (!taperEnd && !(taperStart && isVeryShort)) {
    var _start3 = sub(lastPoint.point, mul(per(lastPoint.vector), radius));

    for (var _t3 = 0, _step2 = 0.1; _t3 <= 1; _t3 += _step2) {
      endCap.push(rotAround(_start3, lastPoint.point, PI * 3 * _t3));
    }
  } else {
    endCap.push(lastPoint.point);
  }
  /*
    Return the points in the correct windind order: begin on the left side, then
    continue around the end cap, then come back along the right side, and finally
    complete the start cap.
  */


  return leftPts.concat(endCap, rightPts.reverse(), startCap);
}
/**
 * ## getStroke
 * @description Returns a stroke as an array of outline points.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param options An (optional) object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Tapering and easing function for the start of the line.
 * @param options.end Tapering and easing function for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */

function getStroke(points, options) {
  if (options === void 0) {
    options = {};
  }

  return getStrokeOutlinePoints(getStrokePoints(points, options), options);
}

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return ""

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ["M", ...stroke[0], "Q"]
  )

  d.push("Z")
  return d.join(" ")
}

PerfectFreehand = {
	getStroke: getStroke,
	getStrokeOutlinePoints: getStrokeOutlinePoints,
	getStrokePoints: getStrokePoints,
	getSvgPathFromStroke: getSvgPathFromStroke,
};