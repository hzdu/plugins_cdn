jQuery(function ($) {
    /*** Pro ***/

    $(document).ready(function () {

		function parseVideo(url) {

			url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (RegExp.$3.indexOf('youtu') > -1) {
				var type = 'youtube';
			} else if (RegExp.$3.indexOf('vimeo') > -1) {
				var type = 'vimeo';
			}

			return {
				type: type,
				id: RegExp.$6
			};
		}
	
	
	
	$('.qcheroitem-add-url').on('change', function(e){
		e.preventDefault();		
		var video = parseVideo($(this).val());
		if(typeof(video.type)!='undefined'){
			$(this).val(video.id);
		}
	})
	$('#bg_video_youtube').on('change', function(e){
		e.preventDefault();
		var video = parseVideo($(this).val());
		if(typeof(video.type)!='undefined'){
			$(this).val(video.id);
		}
	})
	$('#bg_video_vimeo').on('change', function(e){
		e.preventDefault();
		var video = parseVideo($(this).val());
		if(typeof(video.type)!='undefined'){
			$(this).val(video.id);
		}
	})
	
	
        function initSave() {
            jQuery('input.text').each(function () {
                var val = jQuery(this).val();
                val = val.ReslideReplaceAll('"', '&#34;');
                val = val.ReslideReplaceAll("'", '&#39;');
                val = val.ReslideReplaceAll("\\", '');
                jQuery(this).val(val);
            })
        }
        initSave();
        jQuery('#qchero_sliders_list .delete').click(function () {
            var t = confirm("You are going to permanently delete this slider...");
            if (!t)
                return false;
        });

        jQuery('.qchero-nodisplay').submit(function () {
            return false;
        });
		jQuery('#qchero_slider_images_list').on('click','.qcheroitem .edit-image',function(){
			var $this = jQuery(this);
			var slideId = $this.parents('.qcheroitem').attr('id');
			open_media_window.apply($this,['image',{'slide_image':slideId}]);
			return false;

		});
        $('#qchero_slider_insert_popup select').change(function () {
            var id = $(this).find('option:selected').val();
            id = parseInt(id);
            if (id) {
                add_shortcode($(this).find('option:selected').val());
                jQuery('#R-slider option:first-child').attr('selected', 'selected');
            }
        });
		
//slide image upload script//		
jQuery('#qchero_slider_images_list').on('click','.qchero_slide_image_upload',function(e){
	e.preventDefault();
	
	var slideid = jQuery(this).attr('data-slide-id');
	
		var title = 'Slide Image Uploader';
		if(heroslider.type=='video'){
			title = 'Upload Video';
		}
        var image = wp.media({ 
            title: title,
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_image = image.state().get('selection').first();
            var image_url = uploaded_image.toJSON().url;
            // Let's assign the url value to the input field
			
			var parentid = 'qcheroitem_'+slideid;
			$('#'+parentid).find('.qcheroitem-add-url').val(image_url);
			
			if(heroslider.type=='video'){
				$('#'+parentid).find('.slide_image_container').html('<img data-slide-id="'+slideid+'" src="'+heroslider.video+'" style="width: 57px;" /><span class="qchero_slide_image_remove" data-slide-id="' + slideid + '">X</span>');
			}else{
				$('#'+parentid).find('.slide_image_container').html('<img data-slide-id="'+slideid+'" src="'+image_url+'" /><span class="qchero_slide_image_remove" data-slide-id="' + slideid + '">X</span>');
			}
			
			//jQuery('.qchero_save_all').click();
        });
})

//Cover image upload script//		
jQuery('#qchero_slider_images_list').on('click','.qchero_cover_image_upload',function(e){
	e.preventDefault();
	
	var slideid = jQuery(this).attr('data-slide-id');
	
		var title = 'Cover Image Uploader';
		if(heroslider.type=='video'){
			title = 'Upload Video';
		}
        var image = wp.media({ 
            title: title,
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_image = image.state().get('selection').first();
            var image_url = uploaded_image.toJSON().url;
            // Let's assign the url value to the input field
			
			var parentid = 'qcheroitem_'+slideid;
			$('#'+parentid).find('.qcheroitem-cover-image-url').val(image_url);
			
			$('#'+parentid).find('.cover_image_container').html('<img data-slide-id="'+slideid+'" src="'+image_url+'" /><span class="qchero_cover_image_remove" data-slide-id="' + slideid + '">X</span>');
			
			
			//jQuery('.qchero_save_all').click();
        });
})


//slide image remove script//

jQuery('#qchero_slider_images_list').on('click','.slide_image_container img',function(e){
	e.preventDefault();
	
	var slideid = jQuery(this).attr('data-slide-id');
        var image = wp.media({ 
            title: 'Slide Image Uploader',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
        .on('select', function(e){
            // This will return the selected image from the Media Uploader, the result is an object
            var uploaded_image = image.state().get('selection').first();
            var image_url = uploaded_image.toJSON().url;
            // Let's assign the url value to the input field
			
			var parentid = 'qcheroitem_'+slideid;
			$('#'+parentid).find('.qcheroitem-add-url').val(image_url);
			
			$('#'+parentid).find('.slide_image_container').html('<img data-slide-id="'+slideid+'" src="'+image_url+'" /><span class="qchero_slide_image_remove" data-slide-id="' + slideid + '">X</span>');
			
			//jQuery('.qchero_save_all').click();
        });
})


jQuery('#qchero_slider_images_list').on('click','.qchero_slide_image_remove',function(e){
	e.preventDefault();
	var slideid = jQuery(this).attr('data-slide-id');
	var parentid = 'qcheroitem_'+slideid;
	$('#'+parentid).find('.qcheroitem-add-url').val('');
	if(heroslider.type=='video'){
		$('#'+parentid).find('.slide_image_container').html('<button class="qchero_slide_image_upload" data-slide-id="' + slideid + '">Upload Video</button>');
	}else{
		$('#'+parentid).find('.slide_image_container').html('<button class="qchero_slide_image_upload" data-slide-id="' + slideid + '">Upload Image</button>');
	}
	
	
	//jQuery('.qchero_save_all').click();
})

jQuery('#qchero_slider_images_list').on('click','.qchero_cover_image_remove',function(e){
	e.preventDefault();
	var slideid = jQuery(this).attr('data-slide-id');
	var parentid = 'qcheroitem_'+slideid;
	$('#'+parentid).find('.qcheroitem-cover-image-url').val('');

	$('#'+parentid).find('.cover_image_container').html('<button class="qchero_cover_image_upload" data-slide-id="' + slideid + '">Upload Cover Image</button>');

	//jQuery('.qchero_save_all').click();
})
		
		
        jQuery('#add_image').on ("click", function(){

			
			ordering = jQuery('.qcheroitem').length;
			ordering++;
			 jQuery('#qchero_slider_images_list').prepend(['<li class="qcheroitem add">',
				'<form style="display:none;">',
				'<input type = "hidden" class="qcheroitem-add-title" value="">',
				'<textarea class="qcheroitem-edit-description">Description</textarea>',
				'<input type = "hidden" class="qcheroitem-add-url" value="">',
				'<input type = "hidden" class="qcheroitem-add-btn" value="" placeholder="Click To Add Button">',
				'<input type = "hidden" class="qcheroitem-add-ordering" value="' + (ordering) + '">',
				'</form>',
				'</li>'
			].join(""));
			jQuery('#qchero_slider_images_list .noimage').hide();
			
			// New Slide create function
			var allSlidesCount = jQuery('.qcheroitem').length, i = 0;
			jQuery('.qcheroitem').each(function () {
				jQuery(this).find('.qcheroitem-ordering').val(allSlidesCount - i);
				jQuery(this).find('.slide-order-number').html(allSlidesCount - i);
				i++;
			});
			
			getSlidesInput2();
		
		
		
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
		
		
		jQuery.ajax({
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
			
			
			
			
			//jQuery('.qchero_save_all').click();
		});
        

        /****    edit items ***/

        jQuery('#qchero_slider_images_list ').on('click', '.quick_edit', function () {
            var form = jQuery(this).parents('.qcheroitem').find('form');
            form.toggle(218);
            return false;
        })

        jQuery('#qchero_slider_images_list form').on('click', '.quick_edit', function () {
            var form = jQuery(this).parents('.qcheroitem').find('form');
            form.toggle(218);
            return false;
        })
		
		//code for default arrow style
		$('#arrow_style').on('change', function(e){
			if($(this).val()=='floating'){
				$('#hero_default_arrow').hide();
			}else{
				$('#hero_default_arrow').show();
			}
		})
		if($('#arrow_style').val()=='floating'){
			$('#hero_default_arrow').hide();
		}
    });

    /*** sortable ***/
	if(jQuery("#qchero_slider_images_list").length) {
		var minHeight = jQuery('#qchero_slider_images_list').height();
        if( jQuery("#qchero_slider_images_list li").length > 1 ){
            jQuery("#qchero_slider_images_list").sortable({
                start: function () {
                    jQuery('#qchero_slider_images_list').css('min-height', minHeight + 'px');
                },
                stop: function (event, ui) {
                    var allSlidesCount = jQuery('.qcheroitem').length, i = 0;
                    jQuery('.qcheroitem').each(function () {
                        jQuery(this).find('.qcheroitem-ordering').val(allSlidesCount - i);
                        i++;
						jQuery(this).find('.slide-order-number').html(i);
                    })
					
					textareaID = $(ui.item).find(' textarea').attr('id');
					textareaVal=tinyMCE.get(textareaID).getContent();

					editorID=$(ui.item).find('.mce-container').attr('id');

					$( "#"+editorID ).remove();

					$('#'+textareaID).show();
					$('#'+textareaID).val(textareaVal);

					tinymce.init({
						selector: '#'+textareaID,
						plugins: "textcolor lists advlist emoticons hr link code",
						toolbar: "undo redo forecolor backcolor | alignleft aligncenter alignright | bold italic underline | emoticons link code | fontsizeselect",
						menubar:false,
						statusbar: false,
						height : 150,
						resize: false,

						fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
						
					});
					
                },
                revert: true
            }); 
        }

	}

});
function open_media_window() {
    var type = '', ordering = 0;
	var globalArguments = arguments;
    arguments.indexOf = [].indexOf;
    if (arguments.indexOf("image") > -1)
        type = 'qchero_image';
    var t = _qchero();
    if (this.window === undefined) {
        this.window = wp.media({
            title: 'Insert a media',
            multiple: true,
            button: {text: 'Insert'}
        });

        var self = this; // Needed to retrieve our variable in the anonymous function below
		
        if (!type) {
			
            self.window.on('select', function () {
                var attachment = self.window.state().get('selection').toJSON();
                ordering = jQuery('.qcheroitem').length;
                attachment.forEach(function (item) {
					
                    if (item.type != 'video') {
                        ordering++;
                        jQuery('#qchero_slider_images_list').prepend(['<li class="qcheroitem add">',
                            '<a class="edit" href="?page=qcheror&amp;" onclick="return false;">',
                            '<img src="' + item.url + '">',
							'<span class="edit-image"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>',							
                            '<span class="title">' + item.title + '</span>',
                            '</a>&nbsp;</b>',
                            '<form style="display:none;">',
                            '<input type = "hidden" class="qcheroitem-add-title" value="' + item.title + '">',
                            '<input type = "hidden" class="qcheroitem-add-url" value="' + item.url + '">',
                            '<input type = "hidden" class="qcheroitem-add-type" value="">',
                            '<input type = "hidden" class="qcheroitem-add-ordering" value="' + (ordering) + '">',
                            '</form>',
                            '</li>'
                        ].join(""));
                        jQuery('#qchero_slider_images_list .noimage').hide();
						
						jQuery.post(
								ajaxurl,
								{
									action : 'qcld_slider_image_flip',
									imageurl: item.url
								}
								
							)						
                    }
                });
				
                jQuery('.qchero_save_all').click();
            });
        } else {
			
            var attachment = {};
            self.window = wp.media({
                title: 'Insert a media',
                multiple: false,
                button: {text: 'Insert'}
            });
            self.window.on('select', function () {
				attachment = self.window.state().get('selection').toJSON();
				if(typeof globalArguments[1] != 'object') {
					var currentimage = jQuery('#qchero-custom-stylings').attr('data');
					if (!currentimage) currentimage = 'img0';
					jQuery('#qchero_' + currentimage).attr('src', attachment[0]['url']);
					jQuery('#qchero_' + currentimage).attr('alt', attachment[0]['alt']);
					jQuery('#qchero_slider_' + currentimage + '_styling').find('#custom_src').val(attachment[0]['url']);
					jQuery('#qchero_slider_' + currentimage + '_styling').find('.qchero_content img').attr('src', attachment[0]['url']);
					jQuery('#qchero_slider_' + currentimage + '_styling').find('#custom_alt').val(attachment[0]['alt']);
					return attachment.url;
				}  else {
					jQuery('#qchero_slider_images_list #'+ globalArguments[1]['slide_image']+ ' img').attr('src',attachment[0]['url']);
					jQuery('#qchero_slider_images_list #'+ globalArguments[1]['slide_image']+ ' form .qcheroitem-edit-url').val(attachment[0]['url']);	
					jQuery('.qchero_save_all').click();
				}
            });
        }
        self.window.open();
    }
    else {
        if (this.window) {
            this.window.open();
        }
    }
    return false;
}
function getAddedImages() {
    var slides = {};
    var i = 0;
    jQuery('.qcheroitem.add form').each(function () {
        var slide = {};
        slide.title = jQuery(this).find('.qcheroitem-add-title').val();
        slide.url = jQuery(this).find('.qcheroitem-add-url').val();
        slide.type = jQuery(this).find('.qcheroitem-add-type').val();
        slide.ordering = jQuery(this).find('.qcheroitem-add-ordering').val();
        slides['slide' + i] = slide;
        i++;
    });
    if (i)
        return slides;
    return "none";
}
function getExistImagesId() {
    var ids = [];
    for (var slide in qcheror.slides) {
        ids.push(qcheror.slides[slide]['id']);
    }
    ids = ids.join();
    ids = "(" + ids + ")";
    return ids;
}

function getSlidesInput() {
    jQuery('#qchero_slider_images_list li.qcheroitem').not('.add').each(function () {
        var id = jQuery(this).attr('id'), type, title, description, image_link, url, ordering;
        id = id.replace('qcheroitem_', '');
        title = jQuery(this).find('.qcheroitem-edit-title').val();
        //description = jQuery(this).find('.qcheroitem-edit-description').val();
        //description = jQuery(this).find('.qcheroitem-edit-description').val();
        var getdesid = jQuery(this).find('.qcheroitem-edit-description').attr('id');
		description = tinyMCE.get(getdesid).getContent();
		//console.log(title);
		buttondata = jQuery(this).find('.qcheroitem-add-btn').val();
		buttondata2 = jQuery(this).find('.qcheroitem-btn2-hd').val();
        ordering = jQuery(this).find('.qcheroitem-ordering').val();
        url = jQuery(this).find('.qcheroitem-add-url').val();
		t_font = jQuery(this).find('.hero_title_gfont').val();
		d_font = jQuery(this).find('.hero_description_gfont').val();
		tl_space = jQuery(this).find('.hero_title_lspace').val();
		dl_space = jQuery(this).find('.hero_description_lspace').val();
		stomp = jQuery(this).find('.qcheroitem-stomp-value').val();
		draft = jQuery(this).find('.qcheroitem-draft-value').val();
		cover = jQuery(this).find('.qcheroitem-cover-image-url').val();
		slide_link = jQuery(this).find('.qchero_slide_link').val();
		
		
        qcheror['slides']['slide' + id]['title'] = title;
        qcheror['slides']['slide' + id]['description'] = description;  
        qcheror['slides']['slide' + id]['id'] = id;
        qcheror['slides']['slide' + id]['btn'] = buttondata;
        qcheror['slides']['slide' + id]['btn2'] = buttondata2;
       qcheror['slides']['slide' + id]['ordering'] = ordering;
	   qcheror['slides']['slide' + id]['image_link'] = url;
	   qcheror['slides']['slide' + id]['t_font'] = t_font;
	   qcheror['slides']['slide' + id]['d_font'] = d_font;
	   qcheror['slides']['slide' + id]['tl_space'] = tl_space;
	   qcheror['slides']['slide' + id]['dl_space'] = dl_space;
	   qcheror['slides']['slide' + id]['stomp'] = stomp;
	   qcheror['slides']['slide' + id]['draft'] = draft;
	   qcheror['slides']['slide' + id]['cover'] = cover;
	   qcheror['slides']['slide' + id]['slide_link'] = slide_link;
		
    })
	
}
function qchero_loading() {
	var popup = jQuery('#qchero_loading_overlay');
	if(arguments[0] === false)
		popup.css('display','none');
	else 
		popup.css('display','block');
}
function getSlidesInput2() {
	
    jQuery('#qchero_slider_images_list li.qcheroitem').not('.add').each(function () {
        var id = jQuery(this).attr('id'), type, title, description, image_link, url, ordering;
        id = id.replace('qcheroitem_', '');
        title = jQuery(this).find('.qcheroitem-edit-title').val();
        //description = jQuery(this).find('.qcheroitem-edit-description').val();
        //description = jQuery(this).find('.qcheroitem-edit-description').val();
        var getdesid = jQuery(this).find('.qcheroitem-edit-description').attr('id');
		description = tinyMCE.get(getdesid).getContent();
		//console.log(title);
		buttondata = jQuery(this).find('.qcheroitem-add-btn').val();
		buttondata2 = jQuery(this).find('.qcheroitem-btn2-hd').val();
        ordering = jQuery(this).find('.qcheroitem-ordering').val();
        url = jQuery(this).find('.qcheroitem-add-url').val();
		t_font = jQuery(this).find('.hero_title_gfont').val();
		d_font = jQuery(this).find('.hero_description_gfont').val();
		tl_space = jQuery(this).find('.hero_title_lspace').val();
		dl_space = jQuery(this).find('.hero_description_lspace').val();
		stomp = jQuery(this).find('.qcheroitem-stomp-value').val();
		cover = jQuery(this).find('.qcheroitem-cover-image-url').val();
		slide_link = jQuery(this).find('.qchero_slide_link').val();
		
		if(jQuery(this).hasClass("hero_draft_elem")){
			draft = '1';
		}else{
			draft = jQuery(this).find('.qcheroitem-draft-value').val();
		}
		
		
		
        qcheror['slides']['slide' + id]['title'] = title;
        qcheror['slides']['slide' + id]['description'] = description;  
        qcheror['slides']['slide' + id]['id'] = id;
        qcheror['slides']['slide' + id]['btn'] = buttondata;
        qcheror['slides']['slide' + id]['btn2'] = buttondata2;
       qcheror['slides']['slide' + id]['ordering'] = ordering;
	   qcheror['slides']['slide' + id]['image_link'] = url;
	   qcheror['slides']['slide' + id]['t_font'] = t_font;
	   qcheror['slides']['slide' + id]['d_font'] = d_font;
	   qcheror['slides']['slide' + id]['tl_space'] = tl_space;
	   qcheror['slides']['slide' + id]['dl_space'] = dl_space;
	   qcheror['slides']['slide' + id]['stomp'] = stomp;
	   qcheror['slides']['slide' + id]['draft'] = draft;
	   qcheror['slides']['slide' + id]['cover'] = cover;
	   qcheror['slides']['slide' + id]['slide_link'] = slide_link;
		
    })
	
}