jQuery(document).ready(function($){


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */
if(liquid_landscape_bg == null){
	var liquid_landscape_bg = 0x8300b9;
}


if (typeof liquid_landscape_mainId === 'undefined' || liquid_landscape_mainId === null) {
    liquid_landscape_mainId = mainId;
}

var Grad = function () {
  function Grad(x, y, z) {
    _classCallCheck(this, Grad);

    this.x = x;this.y = y;this.z = z;
    this.dot2 = this.dot2.bind(this);
    this.dot3 = this.dot3.bind(this);
  }

  Grad.prototype.dot2 = function dot2(x, y) {
    var value = this.x * x + this.y * y;
    return value;
  };

  Grad.prototype.dot3 = function dot3(x, y, z) {
    var value = this.x * x + this.y * y + this.z * z;
    return value;
  };

  return Grad;
}();

var Generator = function () {
  function Generator(value) {
    _classCallCheck(this, Generator);

    this.grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
    this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
    // To remove the need for index wrapping, double the permutation table length
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.F2 = 0.5 * (Math.sqrt(3) - 1);
    this.G2 = (3 - Math.sqrt(3)) / 6;
    this.F3 = 1 / 3;
    this.G3 = 1 / 6;
    this.simplex3 = this.simplex3.bind(this);
    this.simplex2 = this.simplex2.bind(this);
    this.seedFunc = this.seedFunc.bind(this);

    this.seedFunc = this.seedFunc(value);
  }

  Generator.prototype.seedFunc = function seedFunc(value) {
    var seed = value;
    if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = ~ ~seed;
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (var i = 0; i < 256; i++) {
      var v = undefined;
      if (i & 1) {
        v = this.p[i] ^ seed & 255;
      } else {
        v = this.p[i] ^ seed >> 8 & 255;
      }

      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  };

  Generator.prototype.simplex2 = function simplex2(xin, yin) {
    var _ = 0;
    var n0 = _.n0;
    var n1 = _.n1;
    var n2 = _.n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in

    var s = (xin + yin) * this.F2; // Hairy factor for 2D
    var i = ~ ~(xin + s);
    var j = ~ ~(yin + s);
    var t = (i + j) * this.G2;
    var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin - j + t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var _2 = 0;
    var i1 = _2.i1;
    var j1 = _2.j1; // Offsets for second (middle) corner of simplex in (i,j) coords

    if (x0 > y0) {
      // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1 = 1;j1 = 0;
    } else {
      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1 = 0;j1 = 1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + this.G2;
    var x2 = x0 - 1 + 2 * this.G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * this.G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = this.gradP[i + this.perm[j]];
    var gi1 = this.gradP[i + i1 + this.perm[j + j1]];
    var gi2 = this.gradP[i + 1 + this.perm[j + 1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 64 * (n0 + n1 + n2);
  };

  // 3D simplex noise

  Generator.prototype.simplex3 = function simplex3(xin, yin, zin) {
    var _3 = 0;
    var n0 = _3.n0;
    var n1 = _3.n1;
    var n2 = _3.n2;
    var n3 = _3.n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in

    var s = (xin + yin + zin) * this.F3; // Hairy factor for 2D
    var i = ~ ~(xin + s);
    var j = ~ ~(yin + s);
    var k = ~ ~(zin + s);

    var t = (i + j + k) * this.G3;
    var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin - j + t;
    var z0 = zin - k + t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var _4 = 0;
    var i1 = _4.i1;
    var j1 = _4.j1;
    var k1 = _4.k1; // Offsets for second corner of simplex in (i,j,k) coords

    var _5 = 0;
    var i2 = _5.i2;
    var j2 = _5.j2;
    var k2 = _5.k2; // Offsets for third corner of simplex in (i,j,k) coords

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;j1 = 0;k1 = 0;i2 = 1;j2 = 1;k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;j1 = 0;k1 = 0;i2 = 1;j2 = 0;k2 = 1;
      } else {
        i1 = 0;j1 = 0;k1 = 1;i2 = 1;j2 = 0;k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;j1 = 0;k1 = 1;i2 = 0;j2 = 1;k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;j1 = 1;k1 = 0;i2 = 0;j2 = 1;k2 = 1;
      } else {
        i1 = 0;j1 = 1;k1 = 0;i2 = 1;j2 = 1;k2 = 0;
      }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + this.G3; // Offsets for second corner
    var y1 = y0 - j1 + this.G3;
    var z1 = z0 - k1 + this.G3;

    var x2 = x0 - i2 + 2 * this.G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * this.G3;
    var z2 = z0 - k2 + 2 * this.G3;

    var x3 = x0 - 1 + 3 * this.G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * this.G3;
    var z3 = z0 - 1 + 3 * this.G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = this.gradP[i + this.perm[j + this.perm[k]]];
    var gi1 = this.gradP[i + i1 + this.perm[j + j1 + this.perm[k + k1]]];
    var gi2 = this.gradP[i + i2 + this.perm[j + j2 + this.perm[k + k2]]];
    var gi3 = this.gradP[i + 1 + this.perm[j + 1 + this.perm[k + 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);
  };

  return Generator;
}();

;
// Render Class Object //

var Render = function Render() {
  var _this = this;

  _classCallCheck(this, Render);

  this.setOptions = function (options) {
    _this.strength = options.strength;
    _this.speed = options.speed * 2;
    _this.iteration = options.iteration * 0.002;
  };

  this.createGUI = function () {
    _this.options = {
      strength: 65,
      color: [0, 50, 200],
      mesh: [200, 50, 0],
      iteration: 50
    };
   // _this.gui = new dat.GUI();

   

    _this.setOptions(_this.options);
  };

  this.setRender = function () {
    // Set Render and Scene //
    _this.renderer = new THREE.WebGLRenderer();
    _this.renderer.setSize(_this.width, _this.height);
    _this.renderer.setPixelRatio(_this.devicePixelRatio);
    _this.renderer.shadowMapEnabled = true;
    document.getElementById(liquid_landscape_mainId).appendChild(_this.renderer.domElement);

    _this.scene = new THREE.Scene();
    _this.scene.fog = new THREE.FogExp2(_this.fog, 0.00185);
    _this.camera = new THREE.PerspectiveCamera(_this.viewAngle, _this.aspect, _this.near, _this.far);
    _this.scene.add(_this.camera);
    _this.cameraPosition = { x: -800, y: 300, z: -300 };
    _this.camera.position.set(_this.cameraPosition.x, _this.cameraPosition.y, _this.cameraPosition.z);
    _this.camera.lookAt(_this.scene.position);

    // Set AmbientLight //
    _this.ambient = new THREE.AmbientLight(0xff0000);
    _this.ambient.position.set(0, 0, 0);
    _this.scene.add(_this.ambient);

    _this.spotLight = new THREE.DirectionalLight(0x0990f9);
    _this.spotLight.position.set(0, 10, 0);
    _this.spotLight.castShadow = true;
    _this.scene.add(_this.spotLight);

    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
      color: _this.background,
      side: THREE.BackSide
    });

    _this.skybox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    _this.scene.add(_this.skybox);

    _this.meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x0033aa,
      side: THREE.DoubleSide
    });
    _this.meshMaterial.wrapS = _this.meshMaterial.wrapT = THREE.RepeatWrapping;

    _this.geometry = new THREE.PlaneBufferGeometry(_this.size, _this.size, _this.amount, _this.amount);
    _this.planeMesh = new THREE.Mesh(_this.geometry, _this.meshMaterial);

    _this.planeMesh.rotation.set(90 * Math.PI / 180, 0, 0);
    _this.planeMesh.position.set(0, 0, 0);
    _this.scene.add(_this.planeMesh);
  };

  this.camearAnimation = function () {
    var ht = _this.generator.simplex3(Math.abs((_this.size / 2 - _this.camera.position.x) / _this.amount), Math.abs((_this.size / 2 - _this.camera.position.z) / _this.amount) + _this.timeStop, 0);

    _this.camera.position.y = 425 + Math.sin(_this.timer + Math.PI / 180) * 350 + ht * (_this.strength / 2);
    _this.camera.position.x = Math.sin(_this.timer + Math.PI / 180) * 120;
    _this.camera.lookAt(_this.scene.position);
  };

  this.checkObjects = function () {
    _this.timer += 0.005;
    _this.time += 0.1;

    _this.timeStop = _this.time * _this.iteration;

    var offset = _this.size / 2;
    var vertices = _this.geometry.attributes.position.array;
    for (var y = 0; y < _this.amount + 1; y++) {
      for (var x = 0; x < _this.amount + 1; x++) {
        var vx = x * 3;
        var vy = y * ((_this.amount + 1) * 3);
        var noiseX = _this.generator.simplex3(x * _this.iteration, y * _this.iteration + _this.timeStop, _this.timer);
        vertices[vy + vx + 0] = -offset + x * _this.spacing;
        vertices[vy + vx + 1] = -offset + y * _this.spacing;
        vertices[vy + vx + 2] = noiseX * _this.strength;
      }
    }
    _this.geometry.attributes.position.needsUpdate = true;
    _this.geometry.computeVertexNormals();
  };

  this.rgbToHex = function (r, g, b) {
    var hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return "0x" + hex;
  };

  this.setViewport = function () {
    _this.width = $('#'+liquid_landscape_mainId).width();
    _this.height = $('#'+liquid_landscape_mainId).height();
    _this.aspect = _this.width / _this.height;
    _this.devicePixelRatio = window.devicePixelRatio;
  };

  this.resize = function () {
    _this.setViewport();
    _this.camera.updateProjectionMatrix();
    _this.renderer.setSize(_this.width, _this.height);
  };

  this.renderScene = function () {
    _this.renderer.render(_this.scene, _this.camera);
  };

  this.renderLoop = function () {
    _this.checkObjects();
    _this.camearAnimation();
    _this.renderScene();
    window.requestAnimationFrame(_this.renderLoop);
  };

  this.viewAngle = 55;
  this.near = 1;
  this.far = 10000;
  this.amount = 125;
  this.size = 1750;
  this.spacing = this.size / this.amount;
  this.timer = 0;
  this.time = 0;
  this.frame = 0;
  this.background = liquid_landscape_bg;
  this.fog = this.background; // 0x546300;
  this.generator = new Generator(10);
  window.addEventListener("resize", this.resize, true);
  this.createGUI();
  this.setViewport();
  this.setRender();
  this.renderLoop();
};

new Render();
})