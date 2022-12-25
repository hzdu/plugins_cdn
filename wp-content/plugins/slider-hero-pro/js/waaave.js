jQuery(document).ready(function($){


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var media = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAM1BMVEUAAAD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQD9vQCEzyW/AAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAShJREFUeAHt2uFq7CAQxfGj5kYz68bz/k97l9KWTTcupHikH+b3An8mIUFwcEXMtfGh1RyhEY1PTJLJ/CFjOOMLkzcElcJTBQMldiSMU9lRBYMoR9nYtWGUnV07Bgl8I2CMhW8sEyMe8YhHPOIRj3jEI8uZPDCy2s7r8nIu4FUojWPtW8LRv0aBesgYRQq+hDtlDJ9upLxSKJXxECkWARjFDIiUi8iUy6iUq2iUa+AEHrlkzouvlKtzPsZIuTjnBykfpUU8ZEqt+GDqh6WuGL4VarQVT1KlgAUcpW3nULcccCIs535z4I64iO8s6POIRzziEY94xCMeaTMidUakzLhgTuzbMcp9xqX/yq4E/SgV4yzsSPOXY/RrPqKKYbjceJT/+hKZYB3uPxidICnZQ31BAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABcCAMAAACvFeCmAAAAM1BMVEUAAADtQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3tQS3qGOtVAAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAk5JREFUeAHd2N2y2yoMBeDFDxgDRnr/pz374kzb3dh4YbkznX73mZXIchDCEh//5/FHxNKG/mL0khxe5Leup4494B2568QoHlauiN6p0R5B6IaqbaKs6vBIOHSBbHig6KLmsMh1XSYRS8LQJzIWJNFnKmhZH6v2DD7FnmFPSUowpgRRG6LH3FC7gLmuLxgOM5u+omEi6EsSrh36EnH2Yhn62Im+JxhOEOlfRO91nPJ64yjx5xR26I2IM7tO1YBvQuXbmHwizeODbzrjF1tL0oPDbcenoZcOjwv+0Euy9LIfDpfcsfLa73wGm1L5ask0Y9Ywwlcr4kakP1oMh2ll+6vzxeIL1vGdXiimsZl8JA4EpxcCNQc1UBo1txTbBJ2pYtdJtQz1akxzHSAdeqozIQ2kxoRMa2po4r8mJIGUDCERpKjn/tFnchivmZV5zzrT5xPU55ueA4n6Wym29orUM838gLYy4WbqqwgowhVCL2TTeoG8yA0Qhp472AFyw62NHYmSXhCPG17oYZi/l/H7BfJsI/5b6sJdK/O3GfYSmKleJ35LXboEofLbWG7nWldv2JJxIotO+PUtVE/4TeoPtgVR58Ye8EPYh87Fpws16Xv5shOLj05su8wC0Y9WlbiXWYkjBkGrREznVs2+FraubN/psECc11aZmTiNKgjVnPF6imFGt2fYU+wZhoX6hiVJdJkkLPJdF3WPdUV0gRQ84rv9ZxDiUMqIsMiDiMiwik2nWsQb3Nb1Qt8cXuPS3j8C9uTwuhBLKb33VkqJAbz/ANmIMSZWkWGiAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAQCAMAAADXjyqxAAAASFBMVEUAAAABAAIBAQMCAQUBAAIBAQMDAgZ+SP98R/99R/97Rv59R/97Rv58R/9/SP97Rv57Rv57Rv57Rv58R/97Rv57Rv57Rv57Rv5jZm49AAAAF3RSTlMAAAAAAQECEyMkMVRhY2aHr7/F0tTk84juFNUAAABRSURBVHja7dTJFYAgFEPRqDjgjArpv1NpIjkuvA1k8/9DNewXRfIxdqja+FCoLD3QTIVaW0C4qTZjpdyJRD3wH/ncSKKe5YQtz2jJiiWQltS/EgmMXd6s1GYAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABjCAMAAABaOVXeAAAAM1BMVEUAAAA+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvc+gvezXsREAAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAjxJREFUeAG1muGunCAQRgcQVESG93/apjetyU3vBA87Pb83qxyZ79vICiDuVx9faDuS/A9KG9/oexBnch//oLt4Eq7xI3cUN1IfBprFiX0Mmxr8VNncyU+VjRZ/VVwZV8WVcVVcGVfFlXFVXBlXxZVxVVwZV8WVcVVcGVfFlXFVXJm/KqaMqwLKgCr9TNn2QlVP8f5E2THmXEFEzmVloY05u3yRF5Vt+kaV/GFN2f5O1cM7ZfKN+lrVQ1Z4lUpUEWVVHgpT9XCC5Seiiir7K+DGqh5iGxPuRxZWBSa4yG86V0UGrD8LAapwVBQRuVgEcWVNJNAw5cqiZFoLXFmRk6riyqo0qoora9KxKq5MuCquTLgqrkzswFmhEl1R1jBWcvO8sjGGztjCzdPWbe2IIBQ70C/JZnRyktUVwSgq4VgRlcyoF4zV490urSyYOH7kFLF8VbeXC5u9SPWypZMbIEyUmCoZk4fbjU0BMbZpmGxvhjFws0ElTKOje5RKnYRg9SgVndxpdvC1Tb9DWUiCcIwvfL5n/lzLx6WS5hPNQhKEY5pPq3pUyfRG8odVUvmHuK3Ml2tj68YPjlcJ2YIGfARwSIJwBLGAw/HiAcerZOdRzW1F7pWHI69PG1Tfw5lkTK0nHUzUMifIhmU20AmrKMjrZSppHs6k725XWwbF1ZZB0OFFwu+SOI3/suEknHWcA7c158YFxNFIa46jyeF8mZyDgDNNQgvyjnAMDv+jVKw6OHoEQYRC6/gq1iV+ATaATiIKa4OvAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABsCAMAAACrb+cLAAAAM1BMVEUAAAAtqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8tqU8MEU6JAAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAY1JREFUeAHt2MGK8yAUQOGb2FjrX6vv/7Q/sxsY4RCOWQyTs9cPLqVyE3d3f6q9lMfVRupjjNe1xtbGV/lqgxVvsOINVrzBijdY8QYr3mDFG5Mey41JPa01hCKMxcq/MS5X6hiseIMVb3jFG6x4gxVvaAUMoYDRn/teulAmxvyuNFP2tcZcadtaQytgLFQKGCuUzAYr3mDFG6x4gxVvsOINVryhFTSEIgxWhAFK1YZQ2PDKwYZWUmfDKmx4JXW946TJBS9+CGuc6jW5Yo9vfWbIcQ550Czago3woCvK8Mvte/LL4Y2tnTIyDnyuVGnkCK+w8UPprFgjIpEiDFDKKYPPzZXMBk9AK2AIRRikCIMfyGwMPgYKGqjwG5n5H88qc2MLr3iDFW+wIoxJlRRhgLKx4ZW28TiXKGx4ZY+IAoZWxrt+2PCfndcasTVvLFPY8EqOsIowhAKGUMDwSmfDl7owvFKC8kqNWK+w4RU2vMKG72BjQZmNtUoLyitti8sVNrzyBkO3P8sRv7W7u7v/sSm7FcXgsvQAAAAASUVORK5CYII="].map(function (m) {
  return PIXI.Texture.fromImage(m);
});

if(density == null){
	var density = '50';
}
if (typeof density === 'undefined' || density === null) {
    density = '50';
}

if (typeof waaave_mainId === 'undefined' || waaave_mainId === null) {
    waaave_mainId = mainId;
}

var Waaave = function () {
  function Waaave() {
    _classCallCheck(this, Waaave);

    this.container = null;
    this.sprite = null;
    this.app = null;
    this.bunny = null;
    this.interval = null;
    this.particles = [];
    this.init();
  }

  Waaave.prototype.init = function init() {
    clearInterval(this.interval);
    this.particles = [];
    this.app = new PIXI.Application($('#'+waaave_mainId).width(), $('#'+waaave_mainId).height(), {
      antialias: true,
	  alpha:true,
      transparent: true
    });

    var amount = this.app.renderer instanceof PIXI.WebGLRenderer ? 100 : 5;
    if (amount == 5) {
      this.app.renderer.context.mozImageSmoothingEnabled = false;
      this.app.renderer.context.webkitImageSmoothingEnabled = false;
    }

    document.getElementById(waaave_mainId).appendChild(this.app.view);
    var container = new PIXI.Container();
    this.app.stage.addChild(container);
    this.app.view.style['transform'] = 'translatez(0)';

    this.interval = setInterval(function () {
      this.particles.push(new Particle(this.app, container, {
        speed: 1 + Math.random() * 5
      }));
    }.bind(this), density);
  };

  Waaave.prototype.update = function update() {
    this.particles = this.particles.filter(function (p) {
      return p.move();
    });
    requestAnimationFrame(this.update.bind(this));
  };

  Waaave.prototype.resize = function resize() {
    $("canvas").remove();
    this.init();
  };

  return Waaave;
}();

var Particle = function () {
  function Particle(app, container, options) {
    _classCallCheck(this, Particle);

    this.app = app;
    this.container = container;
    this.destroy = false;
    this.a = [0.5, 1, 2, 0.3, 3][Math.floor(Math.random() * 4)];
    this.steps = $('#'+waaave_mainId).width() / 8;
    this.rotation = Math.random() > 0.5 ? "-" : "+";
    this.scale = 0.5 * Math.random();
    this.siner = 100 * Math.random();
    this.speed = options.speed;
    this.progress = 0;
    this.texture = media[Math.floor(Math.random() * 5)];
    this.bounding = {
      x: $('#'+waaave_mainId).width(),
      y: $('#'+waaave_mainId).height()
    };

    this.behaviours();
    this.render();
  }

  Particle.prototype.behaviours = function behaviours() {
    $(window).on("resize", function () {
      this.destroy = true;
    }.bind(this));
  };

  Particle.prototype.render = function render() {
    var x = this.progress;
    var y = this.app.renderer.height / 2 + this.siner + this.a * Math.sin(this.progress / this.steps) * 60;
    // Create a 5x5 grid of bunnies
    this.bunny = new PIXI.Sprite(this.texture);
    this.bunny.anchor.set(0.5);
    this.bunny.x = -50 + x;
    this.bunny.y = y;
    this.container.addChild(this.bunny);
  };

  Particle.prototype.move = function move() {
    var x = this.progress;
    var y = this.app.renderer.height / 2 + this.siner + this.a * Math.sin(this.progress / this.steps) * 60;

    this.bunny.x = -50 + x;
    this.bunny.y = y;
    this.bunny.scale.x = this.scale;
    this.bunny.scale.y = this.scale;
    this.progress = this.progress + this.speed;
    this.bunny.rotation = this.rotation + this.radians(this.progress);
    //Destroy
    if (x > this.app.renderer.width + 100 || this.destroy == true) {
      this.container.removeChild(this.bunny);
      return false;
    } else {
      return true;
    }
  };

  Particle.prototype.radians = function radians(degrees) {
    return degrees * Math.PI / 180;
  };

  return Particle;
}();

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var wave = new Waaave();
wave.update();

setInterval(function(){
  $("canvas").remove();
  wave.init();
}, 1000 * 60);

$(window).on("resize", debounce(function () {
  wave.resize();
}.bind(undefined), 20))
});