jQuery(document).ready(function($){


if (typeof matrix_mainId === 'undefined' || matrix_mainId === null) {
    matrix_mainId = mainId;
}

var mainArea = document.getElementById(matrix_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_matrix");

if(heromatrixcolor == null){
	var heromatrixcolor = '#0f0';
}


eventWindowLoaded();

function eventWindowLoaded () {
  canvasApp(); 
}
function canvasSupport (e) {
  
	  return !!e.getContext;

}
function canvasApp () {
  var canvas = document.getElementById('hero_matrix');

  if (!canvasSupport(hero_matrix)) {
	  return; 
	}
  
  var ctx = canvas.getContext('2d');
  var w = canvas.width = $('#'+matrix_mainId).width();
	var h = canvas.height = $('#'+matrix_mainId).height();
	var yPositions = Array(300).join(0).split('');
  
  function runMatrix() {
	  if (typeof Game_Interval != 'undefined') clearInterval(Game_interval);
		Game_Interval = setInterval(drawScreen, 33);
	}

  function drawScreen () {
    ctx.fillStyle = 'rgba(0,0,0,.05)';
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = heromatrixcolor;
		ctx.font = '10px Georgia';
		yPositions.map(function(y, index){
		  text = String.fromCharCode(1e2 + Math.random() * 33);
			x = (index * 10) + 10;
			ctx.fillText(text, x, y);
			if (y > 100 + Math.random() * 1e4) {
			  yPositions[index] = 0;
			} else {
			  yPositions[index] = y + 10;
			}
		})
  }
  
  runMatrix();
  window.addEventListener("resize", runMatrix);
 
}
	
})