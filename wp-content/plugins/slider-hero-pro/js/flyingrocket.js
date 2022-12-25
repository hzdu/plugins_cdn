jQuery(document).ready(function($){
	
if (typeof(flyingrocket_mainId) !== 'undefined') {
	
  var Cloud, Entity, Scene, Ship, Star,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Scene = (function() {
    Scene.prototype.scrollTop = 0;

    function Scene(container) {
      this.container = container;
      this.tick = bind(this.tick, this);
      this.entities = [];
      this.h = $(this.container).height();
      this.w = $(this.container).width();
      this.target = {
        x: 100,
        y: 200
      };
    }

    Scene.prototype.setup = function() {};

    Scene.prototype.run = function() {
      return setInterval(this.tick, 30);
    };

    Scene.prototype.update = function() {
      var entity, j, len, radius, ref, results, star, that, x, y, yellow;
      that = this;
      if (Math.random() > .005) {
        x = this.w + (100 * Math.random());
        y = this.h * Math.random();
        radius = 2 * Math.random();
        yellow = 255 * Math.random();
        star = new Star(that, x, y, radius, radius, 'star', yellow);
      }
      if (this.entities.length > 0) {
        ref = this.entities;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          entity = ref[j];
          if (entity) {
            results.push(entity.update());
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    Scene.prototype.tick = function() {
      return this.update();
    };

    return Scene;

  })();

  Entity = (function() {
    Entity.prototype.vx = 0;

    Entity.prototype.vy = 0;

    Entity.prototype.dirY = 1;

    Entity.prototype.dirX = 1;

    Entity.prototype.scrollTop = 0;

    function Entity(scene1, x1, y1, w1, h1, classname1) {
      var entity;
      this.scene = scene1;
      this.x = x1;
      this.y = y1;
      this.w = w1 != null ? w1 : 0;
      this.h = h1 != null ? h1 : 0;
      this.classname = classname1 != null ? classname1 : 'entity';
      entity = document.createElement('div');
      entity.className += this.classname;
      this.entity = entity;
      this.scene.container.appendChild(entity);
      this.scene.entities.push(this);
      if (this.scene.debug) {
        console.log('added ' + this.classname);
      }
    }

    Entity.prototype.update = function() {
      this.dx = this.x + this.vx * this.dirX;
      this.dy = this.y + this.vy * this.dirY;
      this.x = this.dx;
      this.y = this.dy + this.scene.scrollTop;
      return $(this.entity).css({
        'width': this.w + 'px',
        'height': this.h + 'px',
        'top': this.y + 'px',
        'left': this.x + 'px'
      });
    };

    Entity.prototype.draw = function() {};

    Entity.prototype.changeDir = function(direction) {
      if (direction == null) {
        direction = x;
      }
      if (direction === 'x') {
        return this.dirX = -this.dirX;
      } else if (direction === 'y') {
        return this.dirY = -this.dirY;
      } else {
        return console.log(direction + ' is not a valid direction');
      }
    };

    return Entity;

  })();

  Ship = (function(superClass) {
    extend(Ship, superClass);

    function Ship() {
      return Ship.__super__.constructor.apply(this, arguments);
    }

    Ship.prototype.speedX = 3;

    Ship.prototype.speedY = 3;

    Ship.prototype.update = function() {
      var cloudPoss, i, j;
      this.fly();
      Ship.__super__.update.apply(this, arguments);
      cloudPoss = Math.random();
      if (cloudPoss > .3) {
        for (i = j = 0; j <= 3; i = ++j) {
          this.createCloud();
        }
      }
      if (cloudPoss > .7) {
        this.createCloud();
      }
      if (cloudPoss > .9) {
        return this.createCloud();
      }
    };

    Ship.prototype.fly = function() {
      if (this.x < this.scene.target.x - 10) {
        this.vx = this.speedX;
      } else if (this.x > this.scene.target.x + 10) {
        this.vx = -this.speedX;
      } else if (this.x >= this.scene.target.x - 10 || this.x <= this.scene.target.x + 10) {
        this.vx = 0;
      }
      if (this.y < this.scene.target.y - 5) {
        return this.vy = this.speedY;
      } else if (this.y > this.scene.target.y + 5) {
        return this.vy = -this.speedY;
      } else if (this.y <= this.scene.target.y + 5 || this.y >= this.scene.target.y - 5) {
        return this.vy = 0;
      }
    };

    Ship.prototype.chanceOfChangeX = function(x) {
      var chance;
      chance = 0.001;
      if (x > this.scene.w * .7 || x < this.scene.w * .1) {
        chance = .1;
      }
      if (Math.random() < chance) {
        return true;
      }
      return false;
    };

    Ship.prototype.chanceOfChangeY = function(y) {
      var chance;
      chance = 0.05;
      if (y > this.scene.h * .8 || y < this.scene.h * .2) {
        chance = 0.3;
      }
      if (Math.random() < chance) {
        return true;
      }
      return false;
    };

    Ship.prototype.createCloud = function() {
      var cloud, opac, radius, y;
      opac = Math.random();
      if (Math.random() > .6) {
        radius = 60 * Math.random();
      } else {
        radius = 40 * Math.random();
      }
      y = this.y + this.h / 4;
      y += 20 * Math.random();
      if (Math.random() > .5) {
        y *= -1;
      }
      return cloud = new Cloud(this.scene, this.x, y, radius, radius, opac);
    };

    return Ship;

  })(Entity);

  Cloud = (function(superClass) {
    extend(Cloud, superClass);

    Cloud.prototype.vx = -5;

    function Cloud(scene, x, y, w, h, opacity) {
      this.opacity = opacity;
      Cloud.__super__.constructor.call(this, scene, x, y, w, h, 'cloud');
      $(this.entity).css('opacity', this.opacity);
      this.vx = this.vx * Math.random() - 3;
    }

    Cloud.prototype.update = function() {
      Cloud.__super__.update.apply(this, arguments);
      this.opacity -= .004;
      $(this.entity).css('opacity', this.opacity);
      if (this.opacity <= 0) {
        return this.kill();
      }
    };

    Cloud.prototype.kill = function() {
      var ref, t, that;
      that = this;
      if ((t = this.scene.entities.indexOf(that))) {
        [].splice.apply(this.scene.entities, [t, t - t + 1].concat(ref = [])), ref;
      }
      return $(this.entity).remove();
    };

    return Cloud;

  })(Entity);

  Star = (function(superClass) {
    extend(Star, superClass);

    Star.prototype.vx = -10;

    function Star(scene, x, y, w, h, classname, yellowBy) {
      var blue;
      this.yellowBy = yellowBy != null ? yellowBy : 0;
      Star.__super__.constructor.call(this, scene, x, y, w, h, 'star');
      blue = this.yellowBy;
      $(this.entity).css('background', 'rgb(255,255,' + blue + ')');
    }

    Star.prototype.update = function() {
      Star.__super__.update.apply(this, arguments);
      if (this.x < 0) {
        return this.kill();
      }
    };

    Star.prototype.kill = function() {
      var ref, t, that;
      that = this;
      if ((t = this.scene.entities.indexOf(that))) {
        [].splice.apply(this.scene.entities, [t, t - t + 1].concat(ref = [])), ref;
      }
      return $(this.entity).remove();
    };

    return Star;

  })(Entity);


    var cont, dScroll, i, j, radius, scene, scenes, scroll_amt, ship, star, title, titleTop, vh, x, y, yellow;
    scenes = [];
    title = $('h1');
    titleTop = 100;
    
    scroll_amt = 0;
    dScroll = 0;
    $('#'+flyingrocket_mainId).mousemove(function(e) {
      var mouseX, mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (scenes[0]) {
        return scenes[0].target = {
          x: mouseX - 130,
          y: mouseY - 120
        };
      }
    });
    $('#'+flyingrocket_mainId).mouseleave(function() {
      if (scenes[0]) {
        return scenes[0].target = {
          x: 200,
          y: 200
        };
      }
    });
    $(window).on('scroll', function() {
      var entity, j, len, opac, ref, results, scrollBy, scrollT;
      scrollT = $(this).scrollTop();
      dScroll = scrollT - scroll_amt;
      scroll_amt = scrollT;
      scrollBy = (scrollT * 1.5) + parseInt(titleTop);
      opac = 1.2 - (scrollBy / (title.parent().parent().outerHeight() - 50));
      title.css({
        'margin-top': scrollBy,
        'opacity': opac
      });
      if (scenes[0]) {
        ref = scenes[0].entities;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          entity = ref[j];
          if (entity.classname === 'star') {
            results.push(entity.y -= dScroll * (.5 * entity.w));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    });
    cont = document.getElementById(flyingrocket_mainId);
    scene = new Scene(cont);
    scenes.push(scene);
    scene.run();
    scene.target = {
      x: 400,
      y: 180
    };
    for (i = j = 1; j <= 200; i = ++j) {
      x = Math.random() * scene.w;
      y = Math.random() * scene.h;
      radius = 2 * Math.random();
      yellow = 255 * Math.random();
      star = new Star(scene, x, y, radius, radius, 'star', yellow);
    }
    ship = new Ship(scene, 150, 100, 220, 80, 'shippy');
    return setTimeout(function() {
      return scene.target.y = 90;
    }, 1000);

}
});