jQuery(document).ready(function($){

	// window load event makes sure image is // loaded before running animation
	
	var tl = new TimelineMax({repeat:-1});
	tl.to("#hero_just_clouds", 30, {
		backgroundPosition: "-2247px 0px",
		//autoRound:false,
		ease: Linear.easeNone
	});

	
})