jQuery(document).ready(function($){
if (typeof physics_bug_mainId === 'undefined' || physics_bug_mainId === null) {
    physics_bug_mainId = mainId;
}

var mainArea = document.getElementById(physics_bug_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_physics");

var canvas = document.getElementById('hero_physics');
var canvasContext = canvas.getContext('2d');
canvasContext.canvas.width = jQuery('#'+physics_bug_mainId).width();
canvasContext.canvas.height = jQuery('#'+physics_bug_mainId).height();
var FPS = 60; // only used if requestAnimFrame fails

// variables you can (and should) play around with
var drawPoints = false;
var drawSprings = true;
var drawMesh = true;
var collisions = false; // true: points collide with screen edges
var intensityMod = 50; // random x/y offsets per point on init; 0 = no change
var slowdownEffect = 0.996; // lower values slowdown faster

// create gradient
var polyGradient = canvasContext.createLinearGradient(0, 0, 0, jQuery('#'+physics_bug_mainId).height());
polyGradient.addColorStop(1, "lightyellow");
polyGradient.addColorStop(0, "lightblue");

// entry point
main();

function main() {
  // soft body vars (I encourage you to play around with these also)
  var softBodyCoords = [];
  var springs = [];
  var rows = 10;
  var cols = 2;
  var x = canvas.width/2;
  var y = canvas.height/1.5;
  var spacing = 25;
  var springDistance = 25;
  var dampener = 0.08;
  var minDampener = 0.005;
  
  for (var r=0; r<rows; r++) {
    
    for (var c=0; c<cols; c++) {
      var bodyX = x + (c*spacing) + randomInt(-intensityMod, intensityMod);
      var bodyY = y + (r*spacing) + randomInt(-intensityMod, intensityMod);
      softBodyCoords.push(new BodyPoint(bodyX, bodyY));
      
      // Below is a large chunk of code relating to 
      // point and spring placement (lines that connect points)
      var bodyPointA;
      var bodyPointB;
      
      if (c != 0) {
        bodyPointA = softBodyCoords[softBodyCoords.length-2];
        bodyPointB = softBodyCoords[softBodyCoords.length-1];
        springs.push(new Spring(bodyPointA, bodyPointB, springDistance, dampener, minDampener));
        
        if (r > 0) {
          bodyPointA = softBodyCoords[softBodyCoords.length-cols-1];
          bodyPointB = softBodyCoords[softBodyCoords.length-1];
          springs.push(new Spring(bodyPointA, bodyPointB, springDistance, dampener, minDampener));
          
          bodyPointA = softBodyCoords[softBodyCoords.length-cols-2];
          bodyPointB = softBodyCoords[softBodyCoords.length-1];
          springs.push(new Spring(bodyPointA, bodyPointB, springDistance, dampener, minDampener));

          bodyPointA = softBodyCoords[softBodyCoords.length-2];
          bodyPointB = softBodyCoords[softBodyCoords.length-1-cols];
          springs.push(new Spring(bodyPointA, bodyPointB, springDistance, dampener, minDampener));
        }
      }
      else if (c == 0 && r>0) {
        bodyPointA = softBodyCoords[softBodyCoords.length - cols-1];
        bodyPointB = softBodyCoords[softBodyCoords.length - 1];
        springs.push(new Spring(bodyPointA, bodyPointB, springDistance, dampener, minDampener));
      }
      if (c==cols-1 && r>0) {
        bodyPointA = softBodyCoords[softBodyCoords.length - cols-1];
        bodyPointB = softBodyCoords[softBodyCoords.length - 1];
        springs.push(new Spring(bodyPointA, bodyPointB, springDistance, dampener, minDampener));
      }
    } // columns for loop
  } // rows for loop
  
  // Source of the magic
  var softBlock = new SoftBody(softBodyCoords, springs, rows, cols);
  
  update();
  
  // main loop
  function update() {
    // ensure the canvas is the size of the screen
    canvasContext.canvas.width = jQuery('#'+physics_bug_mainId).width();
    canvasContext.canvas.height = jQuery('#'+physics_bug_mainId).height();
    
    // update weird object
    softBlock.update();
    softBlock.draw();
    
    requestAnimFrame(update); // do it all again
  }
} // END main()

/* the SoftBody object(s) represent a whole deformable
   geometry. It uses BodyPoint objects to define verticies and
   Spring objects to connect the BodyPoints to each other (via magic).
*/
function SoftBody(coords, springsIn, rowCt, colCt) {
  var bodyPoints = coords;
  var springs = springsIn;
  this.x = 10;
  this.y = 10;
  
  SoftBody.prototype.update = function() {
    for (var i=0; i<springs.length; i++) {
      springs[i].update();
    }
    
    for (var i=0; i<bodyPoints.length; i++) {
      bodyPoints[i].y += 0.01;
      bodyPoints[i].update();
    }
  } // END SoftBody.prototype.update
  
  SoftBody.prototype.draw = function() {
    // Note: since I resize the canvas in the
    // main update function this isn't entirely necessary
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw polygon fill for the shape
    if (drawMesh) {
      canvasContext.moveTo(bodyPoints[0].x, bodyPoints[0].y);
      canvasContext.lineTo(bodyPoints[0].x, bodyPoints[0].y);
      canvasContext.beginPath();

      for (var c=0; c<colCt; c++) {
        canvasContext.lineTo(bodyPoints[c].x, bodyPoints[c].y);
      }
      for (var r=0; r<rowCt; r++) {
        var index = r*colCt + (c-1);
        canvasContext.lineTo(bodyPoints[index].x, bodyPoints[index].y);
      }
      for (c=colCt-1; c>0; c--) {
        var index = (r-1)*colCt + (c-1);
        canvasContext.lineTo(bodyPoints[index].x, bodyPoints[index].y);
      }
      for (r=rowCt-1; r>0; r--) {
        var index = r*colCt;
        canvasContext.lineTo(bodyPoints[index].x, bodyPoints[index].y);
      }

      canvasContext.fillStyle = polyGradient;
      canvasContext.fill();
      canvasContext.closePath();
      canvasContext.strokeStyle = "thistle";
      //canvasContext.stroke();
    }
    
    // draw lines (if you wanted them)
    if (drawSprings) {
      canvasContext.moveTo(bodyPoints[0].x, bodyPoints[0].y);

      for (var i=0; i<springs.length; i++) {
        // most of this should be in the springs draw function!!!
        canvasContext.beginPath();
        springs[i].draw();
        canvasContext.closePath();
        if (springs[i].goodDistance) {
          canvasContext.strokeStyle = "lightblue";
        }
        else {
          canvasContext.strokeStyle = "lightpink";
        }

        canvasContext.lineWidth = 1;
        canvasContext.stroke();
      }
    }
    
    // draw points (if you wanted them)
    if (drawPoints) {
      for (var i=0; i<bodyPoints.length; i++) {
        bodyPoints[i].draw();
      }
    }
  } // END SoftBody.prototype.draw
} // END SoftBody object

/* the BodyPoint object represents the vertex (dots)
   on the object(s)
*/
function BodyPoint(x, y) {
  this.velocity = {x: 0, y: 0};
  this.oldVelocity = {x: this.velocity.x, y: this.velocity.y};
  this.x = x;
  this.y = y;
  this.oldX = x;
  this.oldY = y;
  
  BodyPoint.prototype.update = function() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    
    this.checkCollisions();
    
    this.oldVelocity.x = this.velocity.x;
    this.oldVelocity.y = this.velocity.y;
    this.oldX = this.x;
    this.oldY = this.y;
  }
  
  BodyPoint.prototype.draw = function() {
    var pointRadius = 2;
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, pointRadius, 
                      0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'purple';
    canvasContext.fill();
    canvasContext.closePath();
  }
  
  BodyPoint.prototype.checkCollisions = function() {
    if (collisions) {
      if (this.x > canvas.width) {
        this.x = this.oldX;
      }
      else if (this.x < 0) {
        this.x = this.oldX;
      }
      if (this.y > canvas.height) {
        this.y = this.oldY;
      }
      else if (this.y < 0) {
        this.y = this.oldY;
      }
    }
  } // END _checkCollisions()
  
} // END BodyPoint object

/* the Spring object represents the spring (line)
   between each vertex (point) on an object. This is
   the source for most of the movement the SoftBody object
   demonstrates.
*/
function Spring(bodyPointA, bodyPointB, distance, dampener, minDampener) {
  this.pointA = bodyPointA;
  this.pointB = bodyPointB;
  this.desiredCoordDistance = distance;
  this.dampener = dampener;
  this.minDampener = minDampener;
  
  Spring.prototype.update = function() {
    var distance = getDistance(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);
    var angle = Math.atan2(this.pointB.y - this.pointA.y, this.pointB.x - this.pointA.x);
    
    var directionX = Math.cos(angle);
    var directionY = Math.sin(angle);
    
    //this.pointB.velocity.x = 0.5 * directionX;
    //this.pointB.velocity.y = 0.5 * directionY;
    
    // if string length isn't ideal...
    if (distance < this.desiredCoordDistance) {
      this.pointB.velocity.x += this.dampener * directionX;
      this.pointB.velocity.y += this.dampener * directionY;
    }
    else {
      this.pointB.velocity.x -= this.dampener * directionX;
      this.pointB.velocity.y -= this.dampener * directionY;
    }
    
    // damper the dampener? This is nuts
    this.dampener *= slowdownEffect;
    if (this.dampener < this.minDampener) {
      this.dampener = this.minDampener;
    }
  } // END Spring.update()
  
  Spring.prototype.draw = function() {
    canvasContext.moveTo(this.pointA.x, this.pointA.y);
    canvasContext.lineTo(this.pointB.x, this.pointB.y);
  }
}

/*
  gets the distance between two points:
  (x1, y1) and (x2, y2)
*/
function getDistance(x1, y1, x2, y2) {
  var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  distance = Math.abs(distance);
  return distance;
}

// get random integer in range min-max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// animation request with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / FPS);
          };
})();
})
