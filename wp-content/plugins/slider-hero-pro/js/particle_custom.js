/*
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
(function($) {

	
	var fullwidth = window.innerWidth;
	var fullheight = window.innerHeight;
	var maindivcon = document.getElementById('particles-js');
	var getleft = getOffset(maindivcon);
	$('#particles-js').css({
		'width':fullwidth+'px',
		'height':fullheight+'px',
		'left':'-'+getleft.left+'px',
	});

	$(window).on('resize', function(){
			var fwidth = window.innerWidth;
			var fheight = window.innerHeight;
			
			$('#particles-js').css({
				'width':fwidth+'px',
				'height':fheight+'px',
				
			});	
		
	})
})(jQuery);*/