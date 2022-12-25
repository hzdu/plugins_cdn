(function( $ ) {
 $(function() {
	 
	 $('.lfxtitlein input[type="checkbox"]').on('click', function() {
		 
		 var maindata = $('#lfxtitlein').val();
		 
		 if ($(this).is(':checked')) {
			 
			 if(maindata===''){
				var newdata = [$(this).val()].join(" ");
			 }else{
				var maindataarray = maindata.split(" ");
				var newdata = jQuery.merge(maindataarray,[$(this).val()]).join(" ");
			 }
			 $('#lfxtitlein').val(newdata);
			 
		 }else{
			
			var maindataarray = maindata.split(" ");
			
			var index = maindataarray.indexOf($(this).val());
			if(index > -1){
				maindataarray.splice(index, 1);
			}
			$('#lfxtitlein').val(maindataarray.join(" "));
			
		 }
	 })
	 
	 
	 $('.lfxtitleout input[type="checkbox"]').on('click', function() {
		 
		 var maindata = $('#lfxtitleout').val();
		 
		 if ($(this).is(':checked')) {
			 
			 if(maindata===''){
				var newdata = [$(this).val()].join(" ");
			 }else{
				var maindataarray = maindata.split(" ");
				var newdata = jQuery.merge(maindataarray,[$(this).val()]).join(" ");
			 }
			 $('#lfxtitleout').val(newdata);
			 
		 }else{
			
			var maindataarray = maindata.split(" ");
			
			var index = maindataarray.indexOf($(this).val());
			if(index > -1){
				maindataarray.splice(index, 1);
			}
			$('#lfxtitleout').val(maindataarray.join(" "));
			
		 }
	 })
	 
	 $('.lfxdesin input[type="checkbox"]').on('click', function() {
		 
		 var maindata = $('#lfxdesin').val();
		 
		 if ($(this).is(':checked')) {
			 
			 if(maindata===''){
				var newdata = [$(this).val()].join(" ");
			 }else{
				var maindataarray = maindata.split(" ");
				var newdata = jQuery.merge(maindataarray,[$(this).val()]).join(" ");
			 }
			 $('#lfxdesin').val(newdata);
			 
		 }else{
			
			var maindataarray = maindata.split(" ");
			
			var index = maindataarray.indexOf($(this).val());
			if(index > -1){
				maindataarray.splice(index, 1);
			}
			$('#lfxdesin').val(maindataarray.join(" "));
			
		 }
	 })
	 
	 $('.lfxdesout input[type="checkbox"]').on('click', function() {
		 
		 var maindata = $('#lfxdesout').val();
		 
		 if ($(this).is(':checked')) {
			 
			 if(maindata===''){
				var newdata = [$(this).val()].join(" ");
			 }else{
				var maindataarray = maindata.split(" ");
				var newdata = jQuery.merge(maindataarray,[$(this).val()]).join(" ");
			 }
			 $('#lfxdesout').val(newdata);
			 
		 }else{
			
			var maindataarray = maindata.split(" ");
			
			var index = maindataarray.indexOf($(this).val());
			if(index > -1){
				maindataarray.splice(index, 1);
			}
			$('#lfxdesout').val(maindataarray.join(" "));
			
		 }
	 })
	 
	 
	
	 
	function qchero_loading() {
		var popup = jQuery('#qchero_loading_overlay');
		if(arguments[0] === false)
			popup.css('display','none');
		else 
			popup.css('display','block');
	}
	
	jQuery('.qchero_save_all2').on('click', function(e){
		jQuery('.qchero_save_all').click();
	})
	
	jQuery('.qchero_save_all').on('click',function(e){
		
		$('#preview_qchero').removeAttr('needsave');
		
		var allSlidesCount = jQuery('.qcheroitem').length, i = 0;
		jQuery('.qcheroitem').each(function () {
			jQuery(this).find('.qcheroitem-ordering').val(allSlidesCount - i);
			i++;
			jQuery(this).find('.slide-order-number').html(i);
		});
		jQuery("#save_slider").click();
        if(jQuery('input#qcheror-name').val() == ''){
            alert(qchero_ajax_object.emptyNameAlert);
            return false;
        }
		/*if(!_qchero._('.qcheroitem').length) {
			alert(qchero_ajax_object.noImageAlert);
			return false;
		}*/		
		//jQuery('#qchero_preview').click();
		
		qcheroGetSliderParams('custom');
		qcheroGetSliderMainOptions();
		qcheroGetSliderParams();
		qcheroGetSliderStyles();
		
		var data = {
			'action': 'qcld_sliderhero_actions',
			'qchero_do' : 'qchero_save_all',
			'nonce' : qchero_ajax_object.saveAllNonce
		};
		var allData = _qchero.parseJSON(qcheror);
		
		data = Object.assign(allData,data);
		console.log(allData);
		$.ajax({
			url: qchero_ajax_object.ajax_url,
			data:data, method:'POST',
			beforeSend: function(){
			   //qchero_loading();
		   }
		});
		
		return false;
	});
//background image upload configuration//


	$(document).on('click', '#cover-upload-btn', function(e){
		
        e.preventDefault();
        var image = wp.media({ 
            title: 'Upload Background Image',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_image = image.state().get('selection').first();
            // We convert uploaded_image to a JSON object to make accessing it easier
            // Output to the console uploaded_image
            //console.log(uploaded_image);
            var image_url = uploaded_image.toJSON().url;
			
            // Let's assign the url value to the input field
            $('#cover_image_url').val(image_url);
			var html = ['<span class="remove_bg_image remove_cover_image">X</span>',
				'<img src="'+image_url+'" alt="" />'
			].join("");
			
			$('.cover_preview_image').html(html);
        });
    });


	$(document).on('click', '#bg-upload-btn', function(e){
		console.log('safads asdfasdf');
        e.preventDefault();
        var image = wp.media({ 
            title: 'Upload Background Image',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_image = image.state().get('selection').first();
            // We convert uploaded_image to a JSON object to make accessing it easier
            // Output to the console uploaded_image
            //console.log(uploaded_image);
            var image_url = uploaded_image.toJSON().url;
            // Let's assign the url value to the input field
            $('#bg_image_url').val(image_url);
			var html = ['<span class="remove_bg_image">X</span>',
				'<img src="'+image_url+'" alt="" />'
			].join("");
			$('#bg_preview_img').html(html);
        });
    });
//image remove function//
$(document).on( 'click', '.remove_bg_image', function(){
	
	$('#bg_preview_img').html('');
	$('#bg_image_url').val('');
})

$(document).on( 'click', '.remove_cover_image', function(){
	$('.cover_preview_image').html('');
	$('#cover_image_url').val('');
})

//audio configuration//
    $('#bg-audio-upload-btn').click(function(e) {
        e.preventDefault();
        var image = wp.media({ 
            title: 'Upload Music',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_music = image.state().get('selection').first();
            
            var image_url = uploaded_music.toJSON().url;
            // Let's assign the url value to the input field
            $('#bg_audio_url').val(image_url);
			var html = ['<span class="remove_bg_audio">X</span>',
				'<img src="'+audio.url+'" alt="" />'
			].join("");
			$('#bg_preview_audio').html(html);
        });
    });
	//Video configuration//
    $('#bg-video-upload-btn').click(function(e) {
        e.preventDefault();
        var image = wp.media({ 
            title: 'Upload Video (MP4)',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_music = image.state().get('selection').first();
            
            var image_url = uploaded_music.toJSON().url;
            // Let's assign the url value to the input field
            $('#bg_video').val(image_url);
			var html = ['<span class="remove_bg_video">X</span>',
				'<img src="'+audio.video+'" alt="" />'
			].join("");
			$('#bg_preview_video').html(html);
        });
    });
	//Video configuration2//
    $('#bg-video-upload-btn2').click(function(e) {
        e.preventDefault();
        var image = wp.media({ 
            title: 'Upload Video (webm)',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_music = image.state().get('selection').first();
            
            var image_url = uploaded_music.toJSON().url;
            // Let's assign the url value to the input field
            $('#bg_video2').val(image_url);
			var html = ['<span class="remove_bg_video2">X</span>',
				'<img src="'+audio.video+'" alt="" />'
			].join("");
			$('#bg_preview_video2').html(html);
        });
    });
	
//Audio remove function//
$(document).on( 'click', '.remove_bg_audio', function(){
	
	$('#bg_preview_audio').html('');
	$('#bg_audio_url').val('');
})
//Video remove function//
$(document).on( 'click', '.remove_bg_video', function(){
	
	$('#bg_preview_video').html('');
	$('#bg_video').val('');
})
//Video 2 remove function//
$(document).on( 'click', '.remove_bg_video2', function(){
	
	$('#bg_preview_video2').html('');
	$('#bg_video2').val('');
})



	/***  add images on slider ***/
	jQuery('#save_slider').on('click', function (e) {
		if (!_qchero._('.qcheroitem').length) {
			return false;
		}
		getSlidesInput();
		
		var data = {
			'action': 'qcld_sliderhero_actions',
			'nonce': qchero_ajax_object.saveImagesNonce,
			'qchero_do': 'qchero_save_images',
			'id': qcheror.id,
			'existitems': getExistImagesId(),
			'slides': qcheror['slides']
		};
		var allImages = {'images': (getAddedImages())};
		var data = Object.assign(allImages, data);
		
		
		$.ajax({
			url: qchero_ajax_object.ajax_url, data: (data), method: 'POST', beforeSend: function () {
				qchero_loading();
			},
			complete: function () {
				qchero_loading(false);
			}, success: function (result) {
				
				var newresult = JSON.parse(result);
				
				if (newresult.error) {
					alert(newresult.error);
					return false;
				}
				qcheror.slides = {};
				var result = JSON.parse(result);
				//console.log(result);
				var appendHTML = '', published = ' value="0" ';
				var i = 0, j = 0;
				for (var res in result) {
					result[res] = JSON.parse(result[res]);
				}
				qcheror['slides'] = result;

				result = qcheror['slides'];
				var delay_cnt = 0;
				for (var res in result) {
					i++;
					if (result[res]['published'] == '1') {
						j++;
					}
					var html;
					qcheror['slides'][res] = result[res];
					var condhtml = '';
					if(heroslider.type!='youtube_video' && heroslider.type!='vimeo_video'){
						if(result[res]["image_link"]!=''){
							
							if(heroslider.type=='video'){
								condhtml = '<div class="qcheroitem-image"><div class="slide_image_container"><img data-slide-id="'+result[res]["id"]+'" src="'+heroslider.video+'" style="width:57px" /><span class="qchero_slide_image_remove" data-slide-id="' + result[res]["id"] + '">X</span></div></div>';
							}else{
								condhtml = '<div class="qcheroitem-image"><div class="slide_image_container"><img data-slide-id="'+result[res]["id"]+'" src="'+result[res]["image_link"]+'" /><span class="qchero_slide_image_remove" data-slide-id="' + result[res]["id"] + '">X</span></div></div>';
							}
							
						}else{
							
							if(heroslider.type=='video'){
								condhtml = '<div class="qcheroitem-image"><div class="slide_image_container"><button class="qchero_slide_image_upload" data-slide-id="' + result[res]["id"] + '">Upload Video</button></div></div>';
								
							}else{
								condhtml = '<div class="qcheroitem-image"><div class="slide_image_container"><button class="qchero_slide_image_upload" data-slide-id="' + result[res]["id"] + '">Upload Image</button></div></div>';
							}
							
						}
					}
					
					if(heroslider.type=='video'){
						if(result[res]["cover"]!=''){
							condhtml += '<div class="qcheroitem-image-cover" style="margin-top: 64px;"><div class="cover_image_container"><img data-slide-id="'+result[res]["id"]+'" src="'+result[res]["cover"]+'"><span class="qchero_cover_image_remove" data-slide-id="'+result[res]["id"]+'">X</span></div></div>';
						}else{
							condhtml += '<div class="qcheroitem-image-cover" style="margin-top: 64px;"><div class="cover_image_container"><button class="qchero_cover_image_upload" data-slide-id="' + result[res]["id"] + '">Upload Cover Image</button></div></div>';
						}
					}
					
					if(heroslider.type=='vimeo_video'){
						condhtml += '<input type="text" class="qcheroitem-add-url" value="' + result[res]["image_link"] + '" placeholder="Vimeo Video ID">';
						
						if(result[res]["cover"]!=''){
							
							condhtml += '<div class="qcheroitem-image-cover"><div class="cover_image_container"><img data-slide-id="'+result[res]["id"]+'" src="'+result[res]["cover"]+'"><span class="qchero_cover_image_remove" data-slide-id="'+result[res]["id"]+'">X</span></div></div>';
							
						}else{
							condhtml += '<div class="qcheroitem-image-cover"><div class="cover_image_container"><button class="qchero_cover_image_upload" data-slide-id="' + result[res]["id"] + '">Upload Cover Image</button></div></div>';
						}
						
					}
					if(heroslider.type=='youtube_video'){
						condhtml += '<input type="text" class="qcheroitem-add-url" value="' + result[res]["image_link"] + '" placeholder="Youtube Video ID">';
						
						if(result[res]["cover"]!=''){
							
							condhtml += '<div class="qcheroitem-image-cover"><div class="cover_image_container"><img data-slide-id="'+result[res]["id"]+'" src="'+result[res]["cover"]+'"><span class="qchero_cover_image_remove" data-slide-id="'+result[res]["id"]+'">X</span></div></div>';
							
						}else{
							condhtml += '<div class="qcheroitem-image-cover"><div class="cover_image_container"><button class="qchero_cover_image_upload" data-slide-id="' + result[res]["id"] + '">Upload Cover Image</button></div></div>';
						}

					}
					
					if(result[res]["stomp"] !== null && typeof result[res]["stomp"] !== 'undefined' && result[res]["stomp"] !== ''){
						var config = JSON.parse(result[res]["stomp"].replace(/&quot;/g,'"'));
					}else{
						var config = {};
					}
					
					
					var customHtml = '<div class="hero_configuration_info">';
					if(config.hero_stomp_animation !== null && typeof config.hero_stomp_animation !== 'undefined' && config.hero_stomp_animation !== ''){
						customHtml += '<div class="hero_config_item" style="margin-right: 3px;"><p><span>Animation: </span>'+config.hero_stomp_animation+'</p></div>';
					}
					if(config.hero_stomp_delay !== null && typeof config.hero_stomp_delay !== 'undefined' && config.hero_stomp_delay !== ''){
						delay_cnt = parseFloat(delay_cnt) + parseFloat(config.hero_stomp_delay);
						customHtml += '<div class="hero_config_item" style="margin-right: 3px;"><p><span>Delay: </span>'+config.hero_stomp_delay+'</p></div>';
					}
					if(config.hero_stomp_fontsize !== null && typeof config.hero_stomp_fontsize !== 'undefined' && config.hero_stomp_fontsize !== ''){
						customHtml += '<div class="hero_config_item" style="margin-right: 3px;"><p><span>Font Size: </span>'+config.hero_stomp_fontsize+'</p></div>';
					}
					
					if(config.hero_stomp_text_color !== null && typeof config.hero_stomp_text_color !== 'undefined' && config.hero_stomp_text_color !== ''){
						customHtml += '<div class="hero_config_item" style="margin-right: 3px;color:'+config.hero_stomp_text_color+'"><p><span>Font</span></p></div>';
					}
					if(config.hero_stomp_background_color !== null && typeof config.hero_stomp_background_color !== 'undefined' && config.hero_stomp_background_color !== ''){
						customHtml += '<div class="hero_config_item" style="color:'+config.hero_stomp_background_color+'"><p><span>Background</span></p></div>';
					}
					customHtml +='</div>';
					
					var slide_link_html = '<input type="hidden" class="qchero_slide_link" value="' + result[res]["slide_link"] + '" placeholder="URL for linking entire slide" />';
					if(heroslider.type=='no_effect'){
						slide_link_html = '<input type="text" class="qchero_slide_link" value="' + result[res]["slide_link"] + '" placeholder="URL for linking entire slide" />';
					}
					
					html = ['<li id="qcheroitem_' + result[res]["id"] + '" data-sid="'+result[res]["id"]+'" class="qcheroitem '+ (result[res]['draft']=='1'?'hero_draft_elem':'') +'">',
						'<div class="qcheroitem-img-container">',
							condhtml,
							'<div class="slider-hero-slide-number"><span class="slide-number-title">Slide</span><span class="slide-order-number">'+ i +'</span>'+ (result[res]['draft']=='1'?'<span class="hero_draft_style">Draft</span>':'') +'</div>',
							'<div class="qcheroitem-properties">',
								'<b title="Collapse"><a href="#" class="quick_edit" data-slide-id="' + result[res]["id"] + '"><i class="fa fa-compress" aria-hidden="true"></i></a></b>',
								'<b title="Remove"><a href="#" class="qchero_remove_image" data-slide-id="' + result[res]["id"] + '"><i class="fa fa-remove" aria-hidden="true"></i></a></b>',
								'<b title="Published"><label href="#" class="qchero_on_off_image"><input style="margin-top: 0px;" value="' + result[res]["published"] + '"' + ((parseInt(result[res]["published"])) && ' checked') + ' data-slide-id="' + result[res]["id"] + '" class="slide-checkbox" type="checkbox"></label></b>',
								'<b style="cursor:move" title="Order using drag and drop"><i class="fa fa-arrows" aria-hidden="true"></i></b>',
								'<div>',
								'</div>',
							'</div>',
							'<form class="qchero-nodisplay">',
								
								
								'<input type="text" class="qcheroitem-edit-title" value="' + result[res]["title"] + '" placeholder="Default Title">',
								'<textarea class="qcheroitem-edit-description">' + result[res]["description"] + '</textarea>',
								'<input type="hidden" class="qcheroitem-add-btn" placeholder="Add Button" value="'+ result[res]["btn"] +'">',
								customHtml,
								'<div class="hero_slide_inputs"><input type="text" class="hero_title_gfont" value="'+result[res]["t_font"]+'" placeholder="Title Font" /><input type="text" class="hero_description_gfont" value="'+result[res]["d_font"]+'" placeholder="Description Font" /><input type="text" value="'+result[res]["tl_space"]+'" class="hero_title_lspace" placeholder="Title Letter Spacing(px)" /><input type="text" class="hero_description_lspace" value="'+result[res]["dl_space"]+'" placeholder="Desc Letter Spacing(px)" /></div>',
								'<input type="button" class="qcheroitem-add-btn1" style="width: 49%;border: 1px solid #ddd;float:left;" value="'+((result[res]['btn'].length>10)?'Edit Button':'Add A Button')+'" />',
								'<input type="hidden" class="qcheroitem-btn2-hd" placeholder="Add Button" value="'+ result[res]["btn2"] +'">',
								'<input type="button" class="qcheroitem-btn2-sw" style="width: 49%;border: 1px solid #ddd;" value="'+((result[res]['btn2'].length>10)?'Edit Button':'Add A Button')+'" />',
								
								'<input type="button" data-ordering="'+result[res]["ordering"]+'" class="qcheroitem-stomp-config" style="width: 99%;border: 1px solid #ddd;" value="'+((result[res]['stomp'].length>10)?'Edit Configuration':'Add Configuration')+'" />',
								
								'<input type="hidden" class="qcheroitem-stomp-value" value="'+ result[res]["stomp"] +'" />',
								'<input type="hidden" class="qcheroitem-draft-value" value="0" />',
								
								'<input type="hidden" class="qcheroitem-edit-type" value="">',
								(heroslider.type!='youtube_video' && heroslider.type!='vimeo_video'?'<input type="hidden" class="qcheroitem-add-url" value="'+result[res]["image_link"]+'">':''),
								'<input type="hidden" class="qcheroitem-cover-image-url" value="'+result[res]["cover"]+'">',
								'<input type="hidden" class="qcheroitem-ordering" value="' + result[res]["ordering"] + '">',
								slide_link_html,
							'</form>',
						'</div>',
						'</li>'].join("");
					appendHTML += html;
					
				}
				
				jQuery('.total_delay_time').html(delay_cnt);
				jQuery('#qchero_slider_images_list .qcheroitem.add').remove();
				jQuery('#qchero_slider_images_list').html('');
				jQuery('#qchero_slider_images_list').prepend(appendHTML);
				
				qcheror.length = i;
				qcheror.count = j;
				
				tinymce.init({
					selector: '.qcheroitem-edit-description',
					plugins: "textcolor lists advlist emoticons hr link code",
					toolbar: "undo redo forecolor backcolor | alignleft aligncenter alignright | bold italic underline | emoticons link code | fontsizeselect",
					menubar:false,
					statusbar: false,
					height : 150,
					resize: false,
					fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
					
				});
			}
		});
		return false;
	});

	 jQuery('#save_custom_slide').on('click', function (e) {
		 var slide = 'slide' + getparamsFromUrl('slideid', location.href);

		 qcheroGetSlideParams(slide);
		 var data = {
			 'action': 'qcld_sliderhero_actions',
			 'nonce': qchero_ajax_object.saveImageNonce,
			 'qchero_do': 'qchero_save_image',
			 'id': qcheror.id,
			 'custom': _qchero.parseJSON(qcheror['slides'][slide])['custom'],
			 'title': qcheror['slides'][slide]['title'],
			 'description': qcheror['slides'][slide]['description'],
			 'image_link': qcheror['slides'][slide]['image_link'],
			 'image_link_new_tab': qcheror['slides'][slide]['image_link_new_tab'],
			 'slide': getparamsFromUrl('slideid', location.href)
		 };
		 $.ajax({
			 url: qchero_ajax_object.ajax_url,
			 data: (data),
			 method: 'POST',
			 beforeSend: function () {
				 qchero_loading();
			 },
			 success: function (result) {
				 qchero_loading(false);
			 }
		 });
		 return false;
	 });
	
	/***  remove images from slider ***/
	jQuery('#qchero_slider_images_list').on('click','.qchero_remove_image',function(e){
		var t = confirm("Are you sure you want to delete this item?");
			if(!t)
					return false;		
		var slideid = jQuery(this).attr('data-slide-id');
		var data = {
			'action': 'qcld_sliderhero_actions',
			'nonce' : qchero_ajax_object.removeImageNonce,
			'qchero_do' : 'qchero_remove_image',
			'id' : qcheror.id,
			'slide' : slideid	
		};
		$.ajax({
			url: qchero_ajax_object.ajax_url,
			data:data,
			method:'POST',
			dataType: 'json',
			beforeSend: function () {
				qchero_loading();
			},
			complete: function () {
				qchero_loading(false);
				// Handle the complete event
			},
			success: function (result) {
				if (result.error) {
					console.log(result.error);
					return false;
				}
				jQuery('#qcheroitem_' + result.slide).remove();
				if (!jQuery('#qchero_slider_images_list .qcheroitem').length)
					jQuery('#qchero_slider_images_list .noimage').show();
				delete qcheror['slides']['slide' + result.slide];
				qcheror.length--;
			}
		});
		return false;
	
	
	});
	jQuery('#qchero_slider_images_list').on('change','.slide-checkbox',function(e){

		( jQuery(this).prop("checked") ) ? ( jQuery(this).val(1) ) : ( jQuery(this).val(0) );

		function AllSlidesUnPublished() {
			var sumPublishSlides = 0;
				jQuery('.slide-checkbox').each(function(){
					if( parseInt( jQuery(this).val() ) ) sumPublishSlides++;
				});
			return 	sumPublishSlides;
		} 
		if(!AllSlidesUnPublished()) {
			jQuery(this).attr('checked','checked');
			alert('Slider must contain minimum one published slide...');
			qcheror.count = 1;
			return false;
		}
		qcheror.count = AllSlidesUnPublished();	
		var slideid = jQuery(this).attr('data-slide-id');
		var published = (jQuery(this).val());
		var data = {
			'action': 'qcld_sliderhero_actions',
			'nonce' : qchero_ajax_object.onImageNonce,
			'qchero_do' : 'qchero_on_image',
			'id' : qcheror.id,
			'slide' : slideid,
			'published' : published	
		}
		$.ajax({url: qchero_ajax_object.ajax_url,data:data, method:'POST',  beforeSend: function(){
			qchero_loading();
   },
   complete: function(){
		qchero_loading(false);
   }, success: function(result){
			var newresult = JSON.parse(result);
			if(newresult.error) {
				alert(newresult.error);
				return false;
			}	   
			 //qcheror['slides']['slide'+result]['published'] = +published;
		}});
		return false;
	
	
	});	
	
$('input[name="style[fullwidth]"]').click(function(){
    
   if($('input:radio[name="style[fullwidth]"]:checked').val()==0){
	   $("#qcslide-width").prop("readonly", false); 
	   $("#qcslide-height").prop("readonly", false); 
   }
   if($('input:radio[name="style[fullwidth]"]:checked').val()==1){
	  
	  $("#qcslide-width").prop("readonly", true);
	  $("#qcslide-height").prop("readonly", false); 
   }
   if($('input:radio[name="style[fullwidth]"]:checked').val()==2){
	  
	  $("#qcslide-width").prop("readonly", true);
	  
	  $("#qcslide-height").prop("readonly", true);
   }
   if($('input:radio[name="style[fullwidth]"]:checked').val()==3){
	  
	  $("#qcslide-width").prop("readonly", true);
	  $("#qcslide-height").prop("readonly", false); 
   }
});

   if($('input:radio[name="style[fullwidth]"]:checked').val()==0){
	   $("#qcslide-width").prop("readonly", false); 
	   $("#qcslide-height").prop("readonly", false); 
   }
   if($('input:radio[name="style[fullwidth]"]:checked').val()==1){
	  
	  $("#qcslide-width").prop("readonly", true);
	  $("#qcslide-height").prop("readonly", false); 
   }
   if($('input:radio[name="style[fullwidth]"]:checked').val()==2){
	  
	  $("#qcslide-width").prop("readonly", true);
	  
	  $("#qcslide-height").prop("readonly", true);
   }
   if($('input:radio[name="style[fullwidth]"]:checked').val()==3){
	  
	  $("#qcslide-width").prop("readonly", true);
	  $("#qcslide-height").prop("readonly", false); 
   }


})




})( jQuery );


