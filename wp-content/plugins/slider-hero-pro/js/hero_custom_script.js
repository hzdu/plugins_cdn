/*
* Hero background video resize
*/

function controlHeight_custom(){

	if(jQuery('.qc_hero_vid').height()<1){
		return;
	}

	if(jQuery('.sh_bg_video').parent().height() > jQuery('.qc_hero_vid').height()){
		jQuery('.sh_bg_video').width(parseFloat(jQuery('.sh_bg_video').width())+10);
		controlHeight_custom();
	}
	
	if((jQuery('.sh_bg_video').parent().height()+50) < jQuery('.qc_hero_vid').height()){
		if((jQuery('.sh_bg_video').width()-2) > jQuery('.sh_bg_video').parent().width()){
			jQuery('.sh_bg_video').width(parseFloat(jQuery('.sh_bg_video').width())-2);
			controlHeight_custom();
		}
	}
	
	jQuery('.sh_bg_video_fluid').css('padding-top', (jQuery('.sh_bg_video').height())+'px');
	setTimeout(function(){
		if(jQuery('.sh_bg_video').width() < jQuery('.sh_bg_video').parent().width()){
			jQuery('.sh_bg_video').width(jQuery('.sh_bg_video').parent().width());
			controlHeight_custom();
		}else{			
			var difference = (jQuery('.sh_bg_video').width() - jQuery('.sh_bg_video').parent().width())/2;
			jQuery('.sh_bg_video').css('left', '-'+difference+'px');			
		}
	}, 500)
	
}

function controlHeight(){
	
	//console.log(jQuery('.sh_bg_video_fluid_y').outerHeight()+' '+jQuery('.sh_bg_video_y').parent().height());
	//jQuery('.sh_bg_video_fluid_y').css('padding-top', (jQuery('.sh_bg_video_fluid_y').outerHeight())+'px');
	
	/*if(jQuery('.sh_bg_video_fluid_y').outerHeight() < jQuery('.sh_bg_video_y').parent().height()){
		jQuery('.sh_bg_video_y').width(parseFloat(jQuery('.sh_bg_video_y').width())+2);
		controlHeight();
	}*/
}

jQuery(window).on('load', function() {
	
	if(jQuery(".qc_hero_vid").length > 0){
		controlHeight_custom();
	}
	if(jQuery(".sh_bg_video_fluid_y").length > 0){
		//controlHeight();
	}
	
})

jQuery(window).resize(function() {
	
	jQuery('.sh_bg_video').width(parseFloat(jQuery('.sh_bg_video').parent().width())+2);
	
	setTimeout(function(){
		if(jQuery(".qc_hero_vid").length > 0){
			controlHeight_custom();
		}
		
		if(jQuery(".sh_bg_video_fluid_y").length > 0){
			if(jQuery('.sh_bg_video_y').width() < jQuery('.sh_bg_video_y').parent().width()){
				jQuery('.sh_bg_video_y').css('width','100%');
			}
			controlHeight();
		}
	}, 700);
});