jQuery(document).ready(function($){

if(hexalen == null){
	var hexalen = '20';
}

if(neno_hexagon_mainId == null){
	neno_hexagon_mainId = mainId;
}

var mainArea = document.getElementById(neno_hexagon_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_neon_hexagon");

var c = document.getElementById('hero_neon_hexagon');
var w = c.width = $('#'+neno_hexagon_mainId).width()
	,	h = c.height = $('#'+neno_hexagon_mainId).height()
	, ctx = c.getContext( '2d' )
	,	particles = []
	,	dirs = [
		{ x: Math.cos( Math.PI * 2 / 6 ), y: Math.sin( Math.PI * 2 / 6 ) },
		{ x: Math.cos( Math.PI * 2 / 6 * 2 ), y: Math.sin( Math.PI * 2 / 6 * 2 ) },
		{ x: Math.cos( Math.PI * 2 / 6 * 3 ), y: Math.sin( Math.PI * 2 / 6 * 3 ) },
		{ x: Math.cos( Math.PI * 2 / 6 * 4 ), y: Math.sin( Math.PI * 2 / 6 * 4 ) },
		{ x: Math.cos( Math.PI * 2 / 6 * 5 ), y: Math.sin( Math.PI * 2 / 6 * 5 ) },
		{ x: Math.cos( Math.PI * 2 / 6 * 6 ), y: Math.sin( Math.PI * 2 / 6 * 6 ) },
	],
	len = hexalen;

var tick = 0;
function anim(){
	
	window.requestAnimationFrame( anim );
	
	tick += .1;
	
	ctx.shadowBlur = 0;
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'rgba(0,0,0,.04)';
	ctx.fillRect( 0, 0, w, h );
	
	ctx.shadowBlur = 3;
	ctx.globalCompositeOperation = 'lighter';
	
	if( particles.length < 100 && Math.random() < .5 )
		particles.push({
			tick: tick,
			sx: w/2,
			sy: h/2,
			x: 0,
			y: 0,
			dir: ( Math.random() * 3 |0 ) * 2,
			askDir: false,
			time: 0
		});
	
	particles.map(function( particle ){
		if( particle.askDir ){
			particle.dir = Math.random() < .5 ?
				( particle.dir + 1 ) % 6 :
				( particle.dir + 5 ) % 6;
			particle.askDir = false;
		}
		
		++particle.time;
		
		var dir = dirs[particle.dir];
		particle.x += dir.x * 1.5;
		particle.y += dir.y * 1.5;
		
		if( particle.x*particle.x + particle.y*particle.y >= len*len ){
			particle.sx += dir.x * len;
			particle.sy += dir.y * len;
			
			particle.x = particle.y = 0;
			particle.askDir = true;
			
			if( Math.random() < .05 ){
				particle.sx = w/2;
				particle.sy = h/2;
				particle.dir = ( Math.random() * 3 |0 ) * 2;
				particle.askDir = false;
				particle.tick = tick;
			}
		}
		
		var color = 'hsla(hue,80%,50%,.8)'.replace( 'hue', particle.tick );
		ctx.shadowColor = ctx.fillStyle = color;
		var x = particle.sx + particle.x
			,	y = particle.sy + particle.y
		ctx.fillRect( x, y, 2.5, 2.5 );
		
		for( var i = .5; i < Math.random(); i += .1 ){
			ctx.fillRect( x + ( Math.random() -.5 ) * 20, y + ( Math.random() - .5 ) * 20, 1.5, 1.5 );
		}
	})
}

ctx.fillStyle = '#111';
ctx.fillRect( 0, 0, w, h );
anim();

window.addEventListener( 'resize', function(){
	w = c.width = $('#'+neno_hexagon_mainId).width();
	h = c.height = $('#'+neno_hexagon_mainId).height();
	particles.length = 0;
	ctx.fillStyle = '#111';
	ctx.fillRect( 0, 0, w, h );
});
});