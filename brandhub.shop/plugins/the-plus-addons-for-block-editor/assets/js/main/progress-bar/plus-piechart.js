document.addEventListener("DOMContentLoaded", function() {
	tpgbpichart(document)
})

function tpgbpichart(doc){
	let getPiechart = doc.querySelectorAll(".tpgb-progress-bar.tpgb-piechart");
	getPiechart.forEach(function(el) {
		new Waypoint({
			element: el,
			handler: function() {
				if(!el.classList.contains("done-progress")){
					setTimeout(function(){
						new CircleProgress({
							el: el,
							size: Number(el.getAttribute('data-size')),
							reverse: el.getAttribute('data-reverse'),
							startAngle: -Math.PI/4*2,
							thickness: Number(el.getAttribute('data-thickness')),
							value: el.getAttribute('data-value'), // 75% progress
							fill: JSON.parse(el.getAttribute('data-fill')),
							emptyFill:  el.getAttribute('data-emptyfill'),
							animation: {
								duration: 1200,
								easing: function(startValue, endValue, progress) {
									return startValue + (endValue - startValue) * progress;
								}
							}
						});
					}, 800);
					el.classList.add("done-progress");
				}
			},
			offset: "80%"
		});    
	});
}


window.addEventListener("load", function(){
    resizeProgressBar();
});

window.addEventListener("resize", function(){
    resizeProgressBar();
});

window.addEventListener("scroll", function(){
    resizeProgressBar();
});

function resizeProgressBar() {
    setTimeout(()=>{
        var progressBar = document.querySelectorAll(".tpgb-progress-bar.tpgb-piechart");
        if (progressBar) {
            progressBar.forEach(function(element) {
                var canvas = element.querySelector("canvas");
                if(canvas){
                    var height = canvas.offsetHeight;
                    var width = canvas.offsetWidth;
                    var pieCircle = element.querySelector(".tp-pie-circle");
                    pieCircle.style.height = height + "px";
                    pieCircle.style.width = width + "px";
                }
            });
        }
    }, 1300)
}