jQuery(document).ready(function($){
	

var Thing = {};


if (typeof electric_clock_mainId === 'undefined' || electric_clock_mainId === null) {
    electric_clock_mainId = mainId;
}


Thing.setup = function() {
  // Create some canvas
  var can = document.createElement('canvas');
  document.getElementById(electric_clock_mainId).appendChild(can);
  this.ctx = can.getContext('2d');
  this.width = can.width = jQuery('#'+electric_clock_mainId).width();
  this.height = can.height = jQuery('#'+electric_clock_mainId).height();

  // Canvas options
  this.ctx.shadowBlur = 10;
  this.ctx.shadowColor = 'white';
  
  // Various vars (hahahaha)
  this.stepCount = 0;
  this.triangle = {
    x: this.width / 2,
    y: this.height / 2,
    ang: 0,
    xSpeed: 1,
    ySpeed: 1,
    angSpeed: 0,
    size: 10
  };
  this.userExtraInputAngleSpeed = 0;
};
Thing.evolve = function() {
  this.stepCount++;
  Thing.move();
  Thing.draw();
};
Thing.move = function() {
  // Increase triangle size
  if (this.triangle.size < 0.25 * this.height) this.triangle.size += 1;
  
  // Manage its periodical angular speed
  this.triangle.angSpeed = 0.01 + Math.max(0, 0.15 * Math.sin(this.stepCount / 20)) + this.userExtraInputAngleSpeed;
  this.triangle.ang += this.triangle.angSpeed;
  
  // Naturally decrease user inputted extra speed
  if (this.userExtraInputAngleSpeed > 0) this.userExtraInputAngleSpeed -= 0.01;
};
Thing.draw = function() {
  // Clear canvas
  this.ctx.clearRect(0, 0, this.width, this.height);
  
  this.ctx.beginPath();
  // Move to triangle center
  var x = this.triangle.x,
      y = this.triangle.y,
      size = this.triangle.size,
      ang = this.triangle.ang,
      angSpeed = this.triangle.angSpeed;
  
  // Randomly rotate ang by a further 2/3*PI rads
  // This one controls the triangle's inner clock
  var rand = this.stepCount / 20;//Math.random();
  ang += Math.floor(3 * rand) * Math.PI * 2/3;
  
  // Then draw all edges
  this.ctx.moveTo(x, y);
  this.ctx.lineTo(x + size * Math.cos(ang), y + size * Math.sin(ang));
  ang += Math.PI * 2/3;
  this.ctx.lineTo(x + size * Math.cos(ang), y + size * Math.sin(ang));
  ang += Math.PI * 2/3;
  this.ctx.lineTo(x + size * Math.cos(ang), y + size * Math.sin(ang));
  ang += Math.PI * 2/3;
  this.ctx.lineTo(x + size * Math.cos(ang), y + size * Math.sin(ang));
  
  this.ctx.lineWidth = Math.ceil(size / 100);
  this.ctx.strokeStyle = 'white';
  this.ctx.stroke();
  
  // Randomly stroke between triangle vertex and canvas edges
  // The faster the rotation, the higher the bolt probability
  if (Math.random() < 10 * angSpeed * angSpeed) {
    var rand = Math.random();
    if (rand < 1/8) {
      this.ctx.lineTo(0, 0);
      this.ctx.lineTo(this.width, this.height / 2);
    } else if (rand < 2/8) {
      this.ctx.lineTo(this.width / 2, 0);
      this.ctx.lineTo(this.width, this.height);
    } else if (rand < 3/8) {
      this.ctx.lineTo(this.width, 0);
      this.ctx.lineTo(this.width / 2, this.height);
    } else if (rand < 4/8) {
      this.ctx.lineTo(this.width, this.height / 2);
      this.ctx.lineTo(0, this.height);
    } else if (rand < 5/8) {
      this.ctx.lineTo(this.width, this.height);
      this.ctx.lineTo(0, this.height / 2);
    } else if (rand < 6/8) {
      this.ctx.lineTo(this.width / 2, this.height);
      this.ctx.lineTo(0, 0);
    } else if (rand < 7/8) {
      this.ctx.lineTo(0, this.height);
      this.ctx.lineTo(this.width / 2, 0);
    } else {
      this.ctx.lineTo(0, this.height / 2);
      this.ctx.lineTo(this.width, 0);
    }
    
    // Regargless of where the bolt goes, draw it!
    this.ctx.stroke();
  }
};

// Start this thing!

  Thing.setup();
  
  Thing.frame = function() {
    Thing.evolve();
    window.requestAnimationFrame(Thing.frame);
  };
  Thing.frame();


// Userrrr input.
document.addEventListener('mousemove', function() {
  Thing.userExtraInputAngleSpeed += 0.01;
});

})


