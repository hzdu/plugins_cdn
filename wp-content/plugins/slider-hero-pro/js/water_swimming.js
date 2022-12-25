jQuery(document).ready(function($){

if(water_swimming_min == null){
	var water_swimming_min = 3;
}
if(water_swimming_max == null){
	var water_swimming_max = 30;
}

if(water_swimming_mainId == null){
	water_swimming_mainId = mainId;
}

var RENDERER = {
	PARTICLE_COUNT : 800,
	MAX_COUNT : 30,
	VELOCITY : {MIN : water_swimming_min, MAX : water_swimming_max},
	ACCELARATION_UP : -0.3,
	ACCELARATION_DOWN : 1,
	
	init : function(){
		this.setParameters();
		this.reconstructMethods();
		this.createParticles();
		this.bindEvent();
		this.render();
	},
	setParameters : function(){
		this.$window = $(window);
		this.$container = $('#'+water_swimming_mainId);
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.$canvas = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container);
		this.context = this.$canvas.get(0).getContext('2d',{alpha: true});
		this.x = 0;
		this.y = 0;
		this.nextX = 0;
		this.nextY = 0;
		this.count = 0;
		this.vz = -this.VELOCITY.MIN;
		this.isUp = false;
		this.particles = [];
	},
	reconstructMethods : function(){
		this.render = this.render.bind(this);
	},
	createParticles : function(){
		for(var i = 0, length = this.PARTICLE_COUNT; i < length; i++){
			this.particles.push(new PARTICLE(this));
		}
	},
	bindEvent : function(){
		this.$container.on('mousemove', this.controlPosition.bind(this));
		this.$container.on('mousedown', this.controlSpeed.bind(this, true));
		this.$container.on('mouseup mouseleave', this.controlSpeed.bind(this, false));
	},
	controlPosition : function(event){
		var containerOffset = this.$container.offset(),
			x = event.clientX - containerOffset.left + this.$window.scrollLeft() - this.width / 2,
			y = event.clientY - containerOffset.top + this.$window.scrollTop() - this.height / 2,
			offset = this.getOffset();
			
		this.x = offset.x;
		this.y = offset.y;
		this.nextX = x;
		this.nextY = y;
		this.count = this.MAX_COUNT;
	},
	controlSpeed : function(isUp){
		this.isUp = isUp;
	},
	getOffset : function(){
		var rate = Math.sin((this.MAX_COUNT - this.count) / this.MAX_COUNT * Math.PI / 2);
		
		return {
			x : this.x + (this.nextX - this.x) * rate,
			y : this.y + (this.nextY - this.y) * rate
		};
	},
	render : function(){
		requestAnimationFrame(this.render);
		
		var rate = -(this.vz + this.VELOCITY.MIN) / (this.VELOCITY.MAX - this.VELOCITY.MIN),
			skew = 1 - 0.3 * rate,
			offset = this.getOffset(),
			dx = this.width / 2 + Math.abs(offset.x),
			dy = this.height / 2 + Math.abs(offset.y),
			hue = 210 - 60 * offset.y / this.height,
			luminance = 30 * offset.y / this.height * (1 + rate),
			opacity = 1 - 0.5 * rate,
			gradient = this.context.createRadialGradient(this.width / 2 - offset.x, this.height / 2 - offset.y, 0, this.width / 2 - offset.x, this.height / 2 - offset.y, Math.sqrt(dx * dx, dy * dy));
			
		gradient.addColorStop(0, 'hsla(' + hue + ', 100%, ' + (35 + luminance) + '%, ' + opacity + ')');
		gradient.addColorStop(0.3, 'hsla(' + hue + ', 80%, ' + (35 + luminance * 0.5) + '%, ' + opacity + ')');
		gradient.addColorStop(1, 'hsla(' + hue + ', 60%, ' + (35 - luminance) + '%, ' + opacity + ')');
		
		
		this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
		//this.context.fillStyle = '#ddd';
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.clearRect(0, 0, this.width, this.height);
		
		this.particles.sort(function(particle1, particle2){
			return particle2.z - particle1.z;
		});
		for(var i = 0, length = this.particles.length; i < length; i++){
			this.particles[i].render(this.context, skew);
		}
		this.vz += this.isUp ? this.ACCELARATION_UP : this.ACCELARATION_DOWN;
		this.vz = Math.max(-this.VELOCITY.MAX, this.vz);
		this.vz = Math.min(-this.VELOCITY.MIN, this.vz);
		
		if(this.count > 0){
			this.count--;
			
			for(var i = 0, length = this.particles.length; i < length; i++){
				this.particles[i].controlPosition(offset.x, offset.y);
			}
		}else{
			this.x = this.nextX;
			this.y = this.nextY;
		}
	}
};
var PARTICLE = function(renderer){
	this.renderer = renderer;
	this.init();
};
PARTICLE.prototype = {
	FOCUS_POSITION : 600,
	FAR_LIMIT : 1500,
	RADIUS : 10,
	VELOCITY_R : {MIN : 0.5, MAX : 1.0},
	
	init : function(){
		this.setParameters();
		this.initPosition();
	},
	setParameters : function(){
		this.r = this.getRandomValue(0, 100);
		this.vr = this.getRandomValue(this.VELOCITY_R.MIN, this.VELOCITY_R.MAX);
		this.theta = this.getRandomValue(0, Math.PI * 2);
		this.z = this.FAR_LIMIT;
		
		var theta = this.getRandomValue(0, Math.PI * 2),
			radius = this.getRandomValue(this.RADIUS / 3, this.RADIUS),
			x = radius * Math.cos(theta),
			y = radius * Math.sin(theta);
			
		this.gradient = this.renderer.context.createRadialGradient(x, y, 0, x, y, this.RADIUS + radius);
		this.gradient.addColorStop(0, 'hsla(180, 60%, 100%, 1)');
		this.gradient.addColorStop(0.3, 'hsla(180, 40%, 80%, 0.8)');
		this.gradient.addColorStop(1, 'hsla(180, 30%, 80%, 0.2)');
	},
	initPosition : function(){
		var count = this.getRandomValue(0, -(this.FAR_LIMIT + this.FOCUS_POSITION) / this.renderer.vz) | 0;
		
		this.offsetX = 0;
		this.offsetY = 0;
		this.vtheta = 0;
		this.r += this.vr * count;
		this.theta += this.vtheta * count;
		this.z += this.renderer.vz * count;
	},
	getAxis : function(){
		var translateRate = this.FOCUS_POSITION / (this.z + this.FOCUS_POSITION),
			offsetRate = (this.FAR_LIMIT - this.z) / (this.FAR_LIMIT + this.FOCUS_POSITION);
			
		return {
			x : this.renderer.width / 2 + this.r * Math.cos(this.theta) * translateRate + this.offsetX * (offsetRate * 2 - 1),
			y : this.renderer.height / 2 - this.r * Math.sin(this.theta) * translateRate + this.offsetY * (offsetRate * 2 - 1),
			radius : Math.max(0, this.RADIUS * translateRate),
			translateRate : translateRate,
			offsetRate : offsetRate
		};
	},
	getRandomValue : function(min, max){
		return min + (max - min) * Math.random();
	},
	controlPosition : function(x, y){
		this.offsetX = x;
		this.offsetY = y;
		this.vtheta = -x / this.renderer.width / 50;
	},
	render : function(context, skew){
		var axis = this.getAxis();
		
		context.save();
		context.globalAlpha = axis.offsetRate;
		context.translate(axis.x, axis.y);
		context.rotate(-this.theta);
		context.scale(axis.translateRate, axis.translateRate * skew);
		context.fillStyle = this.gradient;
		context.beginPath();
		context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		this.r += this.vr;
		this.theta += this.vtheta;
		this.z += this.renderer.vz;
		
		if(axis.x < -axis.radius || axis.x > (this.renderer.width + axis.radius) || axis.y < -axis.radius || axis.y > (this.renderer.height + axis.radius) || this.z < -this.FOCUS_POSITION){
			this.setParameters();
		}
	}
};
$(function(){
	RENDERER.init();
});

});