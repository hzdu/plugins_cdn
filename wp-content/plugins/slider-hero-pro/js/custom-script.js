(function( $ ) {
	
	
	
	$('#sh_video').on('change', function(e){
		e.preventDefault();
		$('#sh_custom_video').hide();
		$('#sh_custom_video2').hide();
		$('#sh_youtube_video').hide();
		$('#sh_vimeo_video').hide();
		$('#sh_video_loop').hide();
		$('#sh_video_mute').hide();
		$('#sh_video_overlay').hide();
		$('#sh_video_overlay_color').hide();
		$('#sh_video_overlay_opacity').hide();
		
		if($(this).val()=='custom'){
			$('#sh_custom_video').show();
			$('#sh_custom_video2').show();
			$('#sh_video_loop').show();
			$('#sh_video_mute').show();
			$('#sh_video_overlay').show();
			$('#sh_video_overlay_color').show();
			$('#sh_video_overlay_opacity').show();
		}
		if($(this).val()=='youtube'){
			$('#sh_youtube_video').show();
			$('#sh_video_loop').show();
			$('#sh_video_mute').show();
			$('#sh_video_overlay').show();
			$('#sh_video_overlay_color').show();
			$('#sh_video_overlay_opacity').show();
		}
		if($(this).val()=='vimeo'){
			$('#sh_vimeo_video').show();
			$('#sh_video_loop').show();
			$('#sh_video_mute').show();
			$('#sh_video_overlay').show();
			$('#sh_video_overlay_color').show();
			$('#sh_video_overlay_opacity').show();
		}
		

	})
	
	
	function qchero_loading() {
		var popup = jQuery('#qchero_loading_overlay');
		if(arguments[0] === false)
			popup.css('display','none');
		else 
			popup.css('display','block');
	}
	function qchero_loading1() {
		var popup = jQuery('#qchero_loading_overlay');
		if(arguments[0] === false)
			popup.css('display','none');
		else 
			popup.css('display','block');
	}
	//Slider Preview Option//
	$('.qchero_preview').on ("click", function(e){
		e.preventDefault();
		jQuery(".qchero_save_all").click();
		id = $(this).data('id');
		setTimeout(
					function() {
					$.post(
						ajaxurl,
						{
							action : 'qcld_show_preview_items',
							sid : id,
							
						},
						function(data){
							
							$('#wpwrap').append(data);
							
						}
					)
		}, 1000);

	})
	
	//Slider Preview Option 2 for p5 library//
	$('.qchero_preview_p5').on ("click", function(e){
		e.preventDefault();
		jQuery(".qchero_save_all").click();
		id = $(this).data('id');
		
		setTimeout(
					function() {
					$.post(
						ajaxurl,
						{
							action : 'qcld_show_preview_items2',
							sid : id,
							
						},
						function(data){
							
							$('#slider_hero_pop_modal_content').append(data);
							$('#slider_hero_pop_modal').show();
							
						}
					)
		}, 1000);

	})
$(document).on('click', '.slider_hero_pop_modal_close', function(){
	$('#slider_hero_pop_modal_content').html('');
	$('#slider_hero_pop_modal').hide();
})
    // Add Color Picker to all inputs that have 'color-field' class
	
    $(function() {
        $('.color-field').wpColorPicker();
		//$( '.alpha-color-picker' ).alphaColorPicker();
    });
	

	
	$('#qchero-fullwidth').on("click", function(){
		 $('#qchero-fullscreen').removeAttr('checked');
	})
	
	$('#qchero-fullscreen').on("click", function(){
		 $('#qchero-fullwidth').removeAttr('checked');
	})
	
	$(document).on( 'click', '.modal-content .close', function(){
        $(this).parent().parent().remove();
    });
	$(document).on( 'click', '.botmclose', function(){
        $(this).parent().parent().parent().remove();
    });
	
/*	$('.myElements').each(function() {
	var elem = $(this);

	   // Save current value of element
	   elem.data('oldVal', elem.val());

	   // Look for changes in the value
	   elem.bind("propertychange change click keyup input paste", function(event){
		  // If value has changed...
		  if (elem.data('oldVal') != elem.val()) {
		   
			$('#preview_qchero').attr('needsave','1');   
		   
		   
		 }
	   });
	 });*/
//==============================================//	

//code for google font title//
	$(document).on( 'click', '.hero_title_gfont', function(){
		var selfelem = 'hero_title_gfont';
		var parelem = $(this).closest("li").prop("id");
		var slidid = $(this).closest("li").data("sid");
		var existdata = $(this).val();
		qchero_loading();
		$.post(
			ajaxurl,
			
			{
				action : 'qcld_show_google_font_model',
				elem : parelem,
				slidid: slidid,
				selfelem:selfelem,
				exists: existdata,
			},
			function(data){
				qchero_loading(false);
				if($('#sm-modal').length==0){
					$('#wpwrap').append(data);
				}
				
			}
		)
		
	 })
	 //code for google font Description//
	$(document).on( 'click', '.hero_description_gfont', function(){
		var selfelem = 'hero_description_gfont';
		var parelem = $(this).closest("li").prop("id");
		var slidid = $(this).closest("li").data("sid");
		var existdata = $(this).val();
		qchero_loading();
		$.post(
			ajaxurl,
			
			{
				action : 'qcld_show_google_font_model',
				elem : parelem,
				slidid: slidid,
				selfelem: selfelem,
				exists: existdata,
			},
			function(data){
				qchero_loading(false);
				if($('#sm-modal').length==0){
					$('#wpwrap').append(data);
				}
				
			}
		)
		
	 })
	 $(document).on( 'change', '.modal-content #hero_font_variant', function(){
		 //alert('hello');
		 fontname = $('#hero_font_family').val();
		 if($('#hero_font_variant').val()!==''){
			$("head").append("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family="+fontname+":"+$('#hero_font_variant').val()+"' media='all'>");
			
		}else{
			$("head").append("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family="+fontname+"' media='all'>");
			
		}
		$("#hero_font_preview").css("font-family", fontname);		
					
	 })
	 
	 $(document).on( 'change', '.modal-content #hero_font_family', function(){
		//$('#'+$('.modal-content').data('elem')+' .'+$('.modal-content').data('selfelem')).val($(this).attr('data'));
		if($('#hero_font_family').val()!==''){
			qchero_loading();
			$.post(
				ajaxurl,
				{
					action : 'qcld_show_google_font_variants',
					fontname:$('#hero_font_family').val(),
				},
				function(data){
					qchero_loading(false);
					if(data!==''){
						$('#hero_font_variant').html(data);
					}else{
						$('#hero_font_variant').html('<option value="">None</option>');
					}
					
					if($('#hero_font_variant').val()!==''){
						$("head").append("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family="+$('#hero_font_family').val()+":"+$('#hero_font_variant').val()+"' media='all'>");
					}else{
						$("head").append("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family="+$('#hero_font_family').val()+"' media='all'>");
					}
					
					$("#hero_font_preview").css("font-family", $('#hero_font_family').val());
				}
			)
		}
		//$(this).parent().parent().parent().parent().remove();
    });
	
	// Hero intro animation google font preview setting
	$(document).on( 'change', '.modal-content #hero_intro_font_family', function(){
		if($('#hero_intro_font_family').val()!==''){
			
			$("head").append("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family="+$('#hero_intro_font_family').val()+"' media='all'>");
			$("#hero_text_preview_animation").css("font-family", $('#hero_intro_font_family').val());
		}
	})
	
	// Hero Button google font preview setting
	$(document).on( 'change', '.modal-content #hero_btn_font_family', function(){
		if($('#hero_btn_font_family').val()!==''){
			
			$("head").append("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family="+$('#hero_btn_font_family').val()+"' media='all'>");
			$("#hero_text_preview_animation").css("font-family", $('#hero_btn_font_family').val());
		}
	})
	
	$(document).on( 'click', '.modal-content #add_the_font', function(){
		var data='';
		if($('#hero_font_family').val()==''){
			alert('please select a font');
			return;
		}else{
			data += $('#hero_font_family').val();
		}
		if($('#hero_font_variant').val()==''){
			alert('please select a Variant');
			return;
		}else{
			data += ':'+$('#hero_font_variant').val();
		}
		
		$('#'+$('.modal-content').data('elem')+' .'+$('.modal-content').data('selfelem')).val(data);
		$(this).parent().parent().parent().parent().remove();
	})
	
	$(document).on( 'click', '.modal-content #hero_reset_font', function(){
		$('#'+$('.modal-content').data('elem')+' .'+$('.modal-content').data('selfelem')).val('');
		$(this).parent().parent().parent().parent().remove();
    });


//code for stomp slide configuration

	$(document).on( 'click', '.qcheroitem-stomp-config', function(){
		var ordering = $(this).attr('data-ordering');
		var selfelem = 'qcheroitem-stomp-value';
		var parelem = $(this).closest("li").prop("id");
		var slidid = $(this).closest("li").data("sid");
		var exdata = $('#'+parelem+' .qcheroitem-stomp-value').val();
		qchero_loading();
		$.post(
			ajaxurl,
			
			{
				action : 'qcld_show_stomp_config',
				elem : parelem,
				selfelem : selfelem,
				slidid: slidid,
				btnval: exdata,
				ordering: ordering
				
			},
			function(data){
				qchero_loading(false);
				if($('#sm-modal').length==0){
					$('#wpwrap').append(data);
					$('.color-field').wpColorPicker();
				}
				
			}
		)
		
	})
	 
	
	$(document).on( 'click', '.modal-content #add_configuration', function(){
		
		var hero_stomp_animation = $('#hero_stomp_animation').val();
		
		var hero_stomp_delay = $('#hero_stomp_delay').val();
		var hero_stomp_fontsize = $('#hero_stomp_fontsize').val();
		var hero_stomp_font_weight = $('#hero_stomp_font_weight').val();
		var hero_stomp_letter_spacing = $('#hero_stomp_letter_spacing').val();
		var hero_stomp_text_color = $('#hero_stomp_text_color').val();
		var hero_stomp_background_color = $('#hero_stomp_background_color').val();
		var hero_intro_font_family = $('#hero_intro_font_family').val();

		
		var data = {
			hero_stomp_animation : hero_stomp_animation,
			hero_stomp_delay : hero_stomp_delay,
			hero_stomp_fontsize : hero_stomp_fontsize,
			hero_stomp_font_weight : hero_stomp_font_weight,
			hero_stomp_letter_spacing : hero_stomp_letter_spacing,
			hero_stomp_text_color : hero_stomp_text_color,
			hero_stomp_background_color : hero_stomp_background_color,
			hero_intro_font_family : hero_intro_font_family
		}
	
		var d = JSON.stringify(data)
		
		
		
		
		var customHtml = '';
		if(hero_stomp_animation !== null && typeof hero_stomp_animation !== 'undefined' && hero_stomp_animation!==''){
			customHtml += '<div class="hero_config_item" style="margin-right: 3px;"><p><span>Animation: </span>'+hero_stomp_animation+'</p></div>';
		}
		if(hero_stomp_delay !== null && typeof hero_stomp_delay !== 'undefined' && hero_stomp_delay!==''){
			customHtml += '<div class="hero_config_item" style="margin-right: 3px;"><p><span>Delay: </span>'+hero_stomp_delay+'</p></div>';
		}
		if(hero_stomp_fontsize !== null && typeof hero_stomp_fontsize !== 'undefined' && hero_stomp_fontsize!==''){
			customHtml += '<div class="hero_config_item" style="margin-right: 3px;"><p><span>Font Size: </span>'+hero_stomp_fontsize+'</p></div>';
		}
		
		if(hero_stomp_text_color !== null && typeof hero_stomp_text_color !== 'undefined' && hero_stomp_text_color!==''){
			customHtml += '<div class="hero_config_item" style="margin-right: 3px;color:'+hero_stomp_text_color+'"><p><span>Font</span></p></div>';
		}
		if(hero_stomp_background_color !== null && typeof hero_stomp_background_color !== 'undefined' && hero_stomp_background_color!==''){
			customHtml += '<div class="hero_config_item" style="margin-right: 3px;color:'+hero_stomp_background_color+'"><p><span>Background</span></p></div>';
		}
		
		
		
		
		
		$('#'+$('.modal-content').data('elem')+' .'+$('.modal-content').data('self')).val(d);
		$('#'+$('.modal-content').data('elem')+' .hero_configuration_info').html(customHtml);
		
		btn = 'qcheroitem-stomp-config';
		$('#'+$('.modal-content').data('elem')+' .'+btn).val('Edit Configuration');
		
		$(this).parent().parent().parent().remove();

	})
	
	$(document).on('change','#hero_stomp_animation',function(e){
		e.preventDefault();
		var classname = $(this).val();
		if(classname!='none'){
			$('#hero_text_preview_animation').removeClass();
			$('#hero_text_preview_animation').addClass("animated "+classname);
		}else{
			$('#hero_text_preview_animation').removeClass();
		}
	})
	$(document).on('change','#hero_stomp_animation_out',function(e){
		e.preventDefault();
		var classname = $(this).val();
		if(classname!='none'){
			$('#hero_text_preview_animation2').removeClass();
			$('#hero_text_preview_animation2').addClass("animated "+classname);
		}else{
			$('#hero_text_preview_animation2').removeClass();
		}
	})
	 
//code for create button 1//
	$(document).on( 'click', '.qcheroitem-add-btn1', function(){
		var selfelem = 'qcheroitem-add-btn';
		var parelem = $(this).closest("li").prop("id");
		var slidid = $(this).closest("li").data("sid");
		var exdata = $('#'+parelem+' .qcheroitem-add-btn').val();
		qchero_loading();
		$.post(
			ajaxurl,
			
			{
				action : 'qcld_show_arrow_items',
				elem : parelem,
				selfelem : selfelem,
				slidid: slidid,
				btnval: exdata
				
			},
			function(data){
				qchero_loading(false);
				if($('#sm-modal').length==0){
					$('#wpwrap').append(data);
					$('.color-field').wpColorPicker();
				}
				
			}
		)
		
	 })
	 //code for button two
	 	$(document).on( 'click', '.qcheroitem-btn2-sw', function(){
		var selfelem = 'qcheroitem-btn2-hd';
		var parelem = $(this).closest("li").prop("id");
		var slidid = $(this).closest("li").data("sid");
		var exdata = $('#'+parelem+' .qcheroitem-btn2-hd').val();
		qchero_loading();
		$.post(
			ajaxurl,
			
			{
				action : 'qcld_show_arrow_items',
				elem : parelem,
				selfelem : selfelem,
				slidid: slidid,
				btnval: exdata
				
			},
			function(data){
				qchero_loading(false);
				
				if($('#sm-modal').length==0){
					$('#wpwrap').append(data);
					$('.color-field').wpColorPicker();
				}
			}
		)
		
	 })
	//code for shortcode
	$(document).on( 'click', '.modal-content #hero_button_shortcode', function(){
		
		var dc = $('#hero_button_shortcode:checkbox:checked').length;
		if(dc=='1'){
			
			if($('.modal-content').data('self')=='qcheroitem-add-btn'){
				var shortcode = "[hero-button type=1 id="+$('.modal-content').data('sid')+"]";
			}else{
				var shortcode = "[hero-button type=2 id="+$('.modal-content').data('sid')+"]";
			}
			$('#add_short_code').show();
			$('#hero_button_shortcode_value').val(shortcode);
		}else{
			$('#hero_button_shortcode_value').val('');
			$('#add_short_code').hide();
		}
	})

	//code for cancel button
	$(document).on( 'click', '.modal-content #add_short_code', function(){
		
		if($('.modal-content').data('self')=='qcheroitem-add-btn'){
			var shortcode = "[hero-button type=1 id="+$('.modal-content').data('sid')+"]";
		}else{
			var shortcode = "[hero-button type=2 id="+$('.modal-content').data('sid')+"]";
		}
		
		var tinyid = $('#'+$('.modal-content').data('elem')).find('textarea').attr('id');
		
		var ed = tinymce.get(tinyid)
		// get all Textnodes from lastchild, calc length
		var textnodes = getTextNodes(ed.getBody().lastChild);

		// set Cursor to last position
		ed.selection.setCursorLocation(textnodes[textnodes.length-1], textnodes[textnodes.length-1].textContent.length );
		tinymce.get(tinyid).execCommand('mceInsertContent', false, shortcode);
		$(this).parent().parent().parent().remove();
		//jQuery('.qchero_save_all').click();
		
	})
	$(document).on( 'click', '.modal-content #cancel_the_button', function(){
		
		$('#'+$('.modal-content').data('elem')+' .'+$('.modal-content').data('self')).val('');
		var btn = '';
		if($('.modal-content').data('self')=='qcheroitem-add-btn'){
			btn = 'qcheroitem-add-btn1';
		}else{
			btn = 'qcheroitem-btn2-sw';
		}
		$('#'+$('.modal-content').data('elem')+' .'+btn).val('Add A Button');
		//alert($('.modal-content').data('self'));
		$(this).parent().parent().parent().remove();
		//jQuery('.qchero_save_all').click();
	})
	//code for add or update button
	$(document).on( 'click', '.modal-content #add_the_button', function(){
		
		var btntxt = $('#hero_button_text').val();
		var btnurl = $('#hero_button_url').val();
		var tgt = $('#hero_button_target').val();
		var btnbdr = $('input[name=hero_button_border]:checked').val();
		var btnstyle = $('input[name=hero_button_style]:checked').val();
		var btneffect = $('input[name=hero_button_effect]:checked').val();
		var btnfontweight = $('#hero_button_font_weight').val();
		var btnfontsize = $('#hero_button_font_size').val();
		var btnletterspacing = $('#hero_button_letter_spacing').val();
		var btntcolor = $('#hero_button_text_color').val();
		var btnthovercolor = $('#hero_button_text_hover_color').val();
		var btnbgcolor = $('#hero_button_bg_color').val();
		var btnbghovercolor = $('#hero_button_bg_hover_color').val();
		var hero_btn_font_family = $('#hero_btn_font_family').val();
		
		var hero_button_shortcode = '';
		if($('#hero_button_shortcode:checkbox:checked').length>0){
			
			hero_button_shortcode = $('#hero_button_shortcode').val();
		}
		var hero_button_shortcode_value = $('#hero_button_shortcode_value').val();
		
		var data = {
			button_text : btntxt,
			button_url : btnurl,
			button_target : tgt,
			button_border : btnbdr,
			button_style : btnstyle,
			button_effect : btneffect,
			button_font_weight : btnfontweight,
			button_font_size : btnfontsize,
			button_letter_spacing : btnletterspacing,
			button_color : btntcolor,
			button_hover_color : btnthovercolor,
			button_background_color : btnbgcolor,
			hero_button_shortcode : hero_button_shortcode,
			hero_button_shortcode_value : hero_button_shortcode_value,
			button_background_hover_color : btnbghovercolor,
			hero_btn_font_family : hero_btn_font_family
			
		}
	
		var d = JSON.stringify(data)
		console.log(d);
		if(btntxt==''){
			alert('Need A button\'s text!');
			$('#hero_button_text').focus();
		}else{
			$('#'+$('.modal-content').data('elem')+' .'+$('.modal-content').data('self')).val(d);
			
			if($('.modal-content').data('self')=='qcheroitem-add-btn'){
				btn = 'qcheroitem-add-btn1';
			}else{
				btn = 'qcheroitem-btn2-sw';
			}
			$('#'+$('.modal-content').data('elem')+' .'+btn).val('Edit Button');
			
			$(this).parent().parent().parent().remove();
			//jQuery('.qchero_save_all').click();
		}
		
	})


	 
//code for arrow selection
$('#arrowselect').on ("click", function(event){
		
		$.post(
			ajaxurl,
			
			{
				action : 'qcld_hero_show_arrow_items'
				
			},
			function(data){
				
				$('#wpwrap').append(data);
				
			}
		)
		
	 })
	 $('.arrow_style').on ("click", function(){
		 
	 })
	$(document).on( 'click', '.modal-content .arrow_style', function(){
		$('#arrowselect').val($(this).attr('data'));
		$(this).parent().parent().parent().remove();
    });
	 
		tinymce.init({
			selector: '.qcheroitem-edit-description',
			plugins: "textcolor lists advlist emoticons hr link code",
			toolbar: "undo redo forecolor backcolor | alignleft aligncenter alignright | bold italic underline | emoticons link code | fontsizeselect",
			menubar:false,
			statusbar: false,
			height : 150,
			resize: false,
			fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt"
			
			
		});
	
	
})( jQuery );
function getTextNodes(node, nodeType, result){

    var children = node.childNodes;
    var nodeType = nodeType ? nodeType : 3;

    var result = !result ? [] : result;
    if (node.nodeType == nodeType) {
        result.push(node);
    }

    for (var i=0; i<children.length; i++) {
        result = this.getTextNodes(children[i], nodeType, result)
    }

    return result;
};

jQuery(window).scroll(function() {
    if (jQuery(this).scrollTop()) {
        jQuery('.hero_bottom_save_button').fadeIn();
    } else {
        jQuery('.hero_bottom_save_button').fadeOut();
    }
});



