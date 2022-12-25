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
    $.fn.changeWords = function(options) {
        var settings = $.extend({
            time: 1200,
            animate: "zoomIn",
            selector: "span",
            repeat: true
        }, options);

      //  var animations = ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'ceIn', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'flip', 'flipInX', 'flipInY', 'lightSpeedIn', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'hinge', 'rollIn' ];

        var wordCount = $(settings.selector, this).size();
        var words = $(settings.selector, this);
		
       
		
		var delayTime = 1200;
		var fontarray = [];
		words.each(function(){
			if($(this).attr('data-fontsize')!==''){
				$(this).css("font-size",$(this).attr('data-fontsize'));
			}
			if($(this).attr('data-fontweight')!==''){
				$(this).css("font-weight",$(this).attr('data-fontweight'));
			}
			if($(this).attr('data-letterspacing')!==''){
				$(this).css("letter-spacing",$(this).attr('data-letterspacing'));
			}
			if($(this).attr('data-color')!==''){
				$(this).css("color",$(this).attr('data-color'));
			}
			
			if($(this).attr("data-id") == "1"){
				delayTime = $(this).attr("data-delay");
			}
			
			if($(this).attr('data-fontfamily')!==''){
				if(jQuery.inArray($(this).attr('data-fontfamily'),fontarray)<0){
					fontarray.push($(this).attr('data-fontfamily'));
					$("head").append("<link rel='stylesheet' href='http://fonts.googleapis.com/css?family="+$(this).attr('data-fontfamily')+"' media='all'>");
					$(this).css("font-family", $(this).attr('data-fontfamily'));
				}else{
					$(this).css("font-family", $(this).attr('data-fontfamily'));
				}
				
			}
		})
		var changeThisWord;
        var count = 0;
		
        
		
		var slider = $(this);
		var slider_id = slider.attr('id');
		
		
		if(settings.fullScreen){
			
			var fullwidth = $("body").prop("clientWidth"); 
			var fullheight = window.innerHeight;
			var maindivcon = document.getElementById(settings.mainId);
			var getleft = getOffset(maindivcon);
			slider.css({
				'width':fullwidth+'px',
				'height':fullheight+'px',
				'left':'-'+getleft.left+'px',
			});
			
			
		}else if(settings.fullWidth){
			
			var fullwidth = $("body").prop("clientWidth"); 
			var maindivcon = document.getElementById(settings.mainId);
			var getleft = getOffset(maindivcon);
			slider.css({
				'width':fullwidth+'px',
				'height':settings.sliderHeight+'px',
				'left':'-'+(getleft.left)+'px',
			});
					
		}else if(settings.Screenauto){
			slider.css({
				'max-width':'100%',
				'height':settings.sliderHeight+'px',
				
			});			
		}
		else{
			slider.css({
				'max-width':settings.sliderWidth+'px',
				'height':settings.sliderHeight+'px',
				
			});
						
		}
		//Code for restarting Intro effects
		$('#hero_restart_button').on('click',function(e){
			clearInterval(changeThisWord);
			count = 0;
			doAnim();
			$('#hero_play_button').hide();
			$('#hero_pause_button').show();
			if(jQuery('#hero_audio').length>0){
				jQuery('#hero_audio')[0].pause();
				jQuery('#hero_audio')[0].currentTime = 0
				setTimeout(function(){
					jQuery('#hero_audio')[0].play();
				},1000)
				
				jQuery('#hero_control_pause').show();
				jQuery('#hero_control_play').hide();
			}
		})
		
		// pause intro effect
		$('#hero_pause_button').on('click',function(e){
			
			clearInterval(changeThisWord);
			$('#hero_play_button').show();
			$(this).hide();
			if(jQuery('#hero_audio').length>0){
				jQuery('#hero_audio')[0].pause();
				jQuery('#hero_control_pause').hide();
				jQuery('#hero_control_play').show();
			}
		}) 
		
		//Play intro effect
		$('#hero_play_button').on('click', function(e){
			doAnim();
			$(this).hide();
			$('#hero_pause_button').show();
			if(jQuery('#hero_audio').length>0){
				jQuery('#hero_audio')[0].play();
				jQuery('#hero_control_pause').show();
				jQuery('#hero_control_play').hide();
			}
		})
		
        function doAnim() {
			
            changeThisWord = setInterval(function() {
                ++count;

                var currentSelector = $('#'+slider_id+ ' ' + settings.selector + '[data-id="' + count + '"]');
                var animtype = currentSelector.attr('data-animtype');
                delayTime = parseInt(currentSelector.attr('data-delay'));
                //delayTime = parseInt(delayTime * 100);
                var wordOrder = count;

                words.filter(function() {
                    return $(this).attr("data-id") == wordOrder
                }).addClass("animated " + animtype).css("display", "flex");


                words.filter(function() {
                    return $(this).attr("data-id") != wordOrder
                }).css("display", "none").removeClass("animated " + animtype);


                //alert(delayTime);

                if (count == wordCount) {
                    count = 0;
                }
				
				
				
				
                if (count == 0 && settings.repeat != true) {
                    clearInterval(changeThisWord);
					

					
					if(parseFloat(settings.loadnewslider)>0){
					
					redirectdelay = (settings.redirectdelay==''?2000:settings.redirectdelay);
						setTimeout(function(){
							$('#'+slider_id).remove();

							$('.second_div_hero').fadeIn().attr('style', '');
							jQuery('#particles-js'+settings.loadnewslider).sliderX();
							
							if(jQuery('#hero_audio').length>0){
								audioControl();
							}
							
							jQuery('#particles-js'+settings.loadnewslider+' canvas').width(jQuery('#particles-js'+settings.loadnewslider).width());
							jQuery('#particles-js'+settings.loadnewslider+' canvas').height(jQuery('#particles-js'+settings.loadnewslider).height());
						},redirectdelay)
					}
					
					
					
					if(settings.redirecturl!==''){
						redirectdelay = (settings.redirectdelay==''?1000:settings.redirectdelay);
						setTimeout(function(){
							window.location.replace(settings.redirecturl);
						},redirectdelay)
					}
					
					
				}
				else {
                    clearInterval(changeThisWord);
                    doAnim()
                }
            }, delayTime);
        }
		
		//jQuery(window).load(function(){
			doAnim();
		//})
        


    }
}(jQuery));