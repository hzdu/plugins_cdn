
let canvas, ctx;
let particles = [];
let count = directionalparticles;

let forceDistance;
let forceStrength;
let preForces = [];

if(directionalparticles == null){
	var directionalparticles = '1000';
}

if(directional_mainId == null){
	directional_mainId = mainId;
}

function setup() {
	canvas = createCanvas(jQuery('#'+directional_mainId).width(), jQuery('#'+directional_mainId).height());
	canvas.parent(directional_mainId);
	ctx = canvas.drawingContext;
	
	forceDistance = createVector(225, 0).rotate(QUARTER_PI);
	forceStrength = createVector(0.15, 0);
	preForces = [
			[ forceDistance.copy().rotate(PI), forceStrength.copy().rotate(HALF_PI) ],
			[ forceDistance.copy().rotate(HALF_PI), forceStrength.copy() ],
			[ forceDistance.copy(), forceStrength.copy().rotate(-HALF_PI) ],
			[ forceDistance.copy().rotate(-HALF_PI), forceStrength.copy().rotate(PI) ]
		];
	
	for(let i = 0; i < count; i++) {
		addParticle();
	}
}

function addParticle() {
	let particle = new Particle();
	particle.randomize();
	particles.push(particle);
	return particle;
}

function draw() {
	ctx.clearRect(0, 0, width, height);
	// background(0);
	// fill(0, 128);
	// noStroke();
	// rect(0, 0, width, height);
	
	// stroke(255);
	noFill();
	// noStroke();
	// fill(255);
	
	let center = createVector(width / 2, height / 2);
	
	let t = frameCount / 60;
	let forceTLPos = center.copy().add(preForces[0][0]);
	let forceBLPos = center.copy().add(preForces[1][0]);
	let forceBRPos = center.copy().add(preForces[2][0]);
	let forceTRPos = center.copy().add(preForces[3][0]);
	let forceRotForce = createVector(0.25, 0).rotate(t);
	let forces = [
			[ forceTLPos, 100, preForces[0][1] ],
			[ forceBLPos, 100, preForces[1][1] ],
			[ forceBRPos, 100, preForces[2][1] ],
			[ forceTRPos, 100, preForces[3][1] ],
			[ center, map(cos(t / 2), -1, 1, 100, 200), forceStrength.copy().rotate(t + QUARTER_PI) ],
			[ forceTLPos.copy().add(createVector(150, 0).rotate(t)), 50, forceRotForce],
			[ forceBLPos.copy().add(createVector(150, 0).rotate(t + HALF_PI)), 50, forceRotForce],
			[ forceBRPos.copy().add(createVector(150, 0).rotate(t + PI)), 50, forceRotForce],
			[ forceTRPos.copy().add(createVector(150, 0).rotate(t - HALF_PI)), 50, forceRotForce]
		];
	
	stroke(255, 0, 0, 64);
	
	forces.forEach(force => {
		ellipse(force[0].x, force[0].y, force[1] * 2);
		let dir = force[2].copy().setMag(force[1]).add(force[0]);
		line(
			force[0].x,
			force[0].y,
			dir.x,
			dir.y
		);
	});
	
	let z = frameCount / 1000;
	particles.forEach((n, j) => {
		
		let noiseInfluence = noise(n.pos.x / 300, n.pos.y / 300, z);
		let force = map(noiseInfluence, 0.3, 0.7, 0, TAU);
		let f = p5.Vector.fromAngle(force).setMag(0.035);
		n.applyForce(f);
		
		let inForce = false;
		
		forces.forEach(force => {
			if(pointInCircle(n.pos, force[0], force[1])) {
				inForce = true;
				// n.reset();
				// n.randomize();
				n.applyForce(force[2]);
			}
		});
		
		if(inForce) {
			stroke(192, 255, 64);
			
			// let pAcc = n.pos.copy().add(n.acc.copy().mult(100));
			// line(n.pos.x, n.pos.y, pAcc.x, pAcc.y);
		}
		else {
			stroke(0, 255, 255);
		}
		
		// n.show();
		
		// stroke(0, 255, 255);
		
		n.showVel();
		
		n.applyForce(p5.Vector.sub(center, n.pos).limit(0.1));
		
		n.update();
		// n.edges();
	});
}

function pointInCircle(p, c, r) {
	return	p.x > c.x - r &&
			p.x < c.x + r &&
			p.y > c.y - r &&
			p.y < c.y + r &&
			p.dist(c) < r;
}

function windowResized() {
	resizeCanvas(jQuery('#'+directional_mainId).width(), jQuery('#'+directional_mainId).height());
}

class Particle {
	constructor() {
		this.reset();
	}
	applyForce(...force) {
		this.acc.add(...force);
	}
	reset() {
		this.pos = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.vel = createVector(0, 0);
	}
	randomize() {
		this.pos.set(random(width), random(height));
	}
	update() {
		this.vel.add(this.acc);
		this.acc.mult(0);
		// this.vel.mult(0.99);
		this.pos.add(this.vel);
		this.vel.mult(0.99);
	}
	edges() {
		if(this.pos.x < 0) this.pos.x += width;
		else if(this.pos.x > width) this.pos.x -= width;
		if(this.pos.y < 0) this.pos.y += height;
		else if(this.pos.y > height) this.pos.y -= height;
	}
	show(i = 0) {
		ellipse(this.pos.x, this.pos.y, 2);
	}
	showVel() {
		let pVel = this.pos.copy().add(this.vel);
		line(this.pos.x, this.pos.y, pVel.x, pVel.y);
	}
}

