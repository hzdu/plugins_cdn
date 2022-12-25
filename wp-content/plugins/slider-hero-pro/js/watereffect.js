jQuery(document).ready(function($){
if(watercolor == null){
	var watercolor = '#000';
}
if(water_mainId == null){
	water_mainId = mainId;
}

var mainArea = document.getElementById(water_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "watereffect");
	
	const q = (sel) => document.querySelector(sel);

const canvas = document.getElementById('watereffect');
const ctx = canvas.getContext('2d');
const PI2 = Math.PI * 2;

const w = $('#'+water_mainId).width();
const h = $('#'+water_mainId).height();

canvas.width = w;
canvas.height = h;

class Spring {
  constructor(index, x, y, k, damp, targetHeight, height) {
    this.index = index;
    this.x = x;
    this.y = y;

    this.k = k;
    this.damp = damp;

    this.targetHeight = targetHeight;
    this.height = height;

    this.acceleration = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    //ctx.fillstyle = this.color;
    //ctx.strokeStyle = this.color;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.toY);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.x, this.toY, 3, 0, PI2, false);
    ctx.fill();
    ctx.closePath();
  }

  // Hooke's law
  update() {
    const displacement = this.targetHeight - this.height;

    this.acceleration += this.k * displacement;
    this.acceleration *= this.damp;

    this.height += this.acceleration;
  }

  get toY() {
    return this.y - this.height;
  }

  get color() {
    //return Math.abs(this.acceleration) > 0.05 ? '#ff0000' : '#000';
  }
}

const springs = [];
const numSprings = 200;
const springSpacing = w / (numSprings - 1);
const springHeight = h * 0.5;
const springConstant = 0.025;
const springDamp = 0.9;
const waveSpread = 0.3;

const springY = h;
let springX = 0;

for (let i = 0; i < numSprings; i++) {

  const spring = new Spring(
    i,
    springX,
    springY,
    springConstant,
    springDamp,
    springHeight,
    springHeight
  );

  springs.push(spring);

  springX += springSpacing;
}

const clear = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const loop = () => {
  clear();

  springs.forEach((spring => {
    spring.update();
  }));

  const leftForces = [];
  const rightForces = [];

  for (let index = 1; index < springs.length - 1; index++) {
    const currentSpring = springs[index];
    const previousSpring = springs[index - 1];
    const nextSpring = springs[index + 1];

    leftForces[index] = waveSpread * (currentSpring.height - previousSpring.height);
    rightForces[index] = waveSpread * (currentSpring.height - nextSpring.height);
  }

  ctx.beginPath();
  ctx.moveTo(0, h);

  for (let index = 0; index < springs.length; index++) {
    const currentSpring = springs[index];

    if (index > 0) {
      springs[index - 1].height += leftForces[index] || 0;
      springs[index - 1].acceleration += leftForces[index] || 0;
    }

    if (index < springs.length - 1) {
      springs[index + 1].height += rightForces[index] || 0;
      springs[index + 1].acceleration += rightForces[index] || 0;
    }

    ctx.lineTo(currentSpring.x, currentSpring.toY);
  }

  ctx.lineTo(w, h);
  ctx.fillStyle=watercolor;
  ctx.fill();
  ctx.closePath();

  requestAnimationFrame(loop);
};

loop();


const onPointerMove = (e) => {
  const event = (e.touches && e.touches.length) ? e.touches[0] : e;
  const { target, clientX: pointerX } = event;
	
  const clickedX = pointerX - $('#watereffect').offset().left;
  const waveWidth = w / numSprings;
  const springIndex = Math.round(clickedX / waveWidth);

  springs[springIndex].acceleration = -h * 0.03;
};

canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('touchmove', onPointerMove);
})