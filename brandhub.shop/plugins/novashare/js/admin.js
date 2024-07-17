(function($) {

	//add constant for translations
	const { __ } = wp.i18n;

	$(document).ready(function() {

		//sortable social networks
		$(function() {
		    $(".novashare-sortable").sortable({
		    	delay: 150 //prevent dragging when clicking
		    });
		});

		$('.novashare-social-networks.novashare-sortable li input[type="checkbox"]').click(function() {
			$label = $(this).closest('label');
			if($label.hasClass('active')) {
				$label.removeClass('active');
			}
			else {
				$label.addClass('active');
			}
		});

		//color picker input
		$(function() {
			$('.novashare-color-picker').wpColorPicker();
		});

		//menu toggle
		var menuToggle = document.getElementById('novashare-menu-toggle');
		if(menuToggle) {
			menuToggle.addEventListener('click', function(e) {
				e.preventDefault();
				var header = document.getElementById('novashare-menu');
				if(!header.classList.contains('novashare-menu-expanded')) {
					header.classList.add('novashare-menu-expanded');
				}
				else {
					header.classList.remove('novashare-menu-expanded');
				}
			});
		}

		//tab-content display
		$('#novashare-menu > a').click(function(e) {
			//e.preventDefault();

			$('.novashare-button-message').hide();


			var active_tab = $(this).closest('#novashare-menu').find('a.active');	
			var selected = $(this).attr('rel');

			active_tab.removeClass('active');
			$('#' + active_tab.attr('rel')).removeClass('active');
						
			$(this).addClass('active');
			$('#' + selected).addClass('active');

			$('#novashare-options-form').attr('data-ns-option', selected.split('-')[0]);
			
			$('#novashare-admin .CodeMirror').each(function(i, el) {
			    el.CodeMirror.refresh();
			});
		});

		//tooltip display
		$(".novashare-tooltip").hover(function() {
		    $(this).closest("tr").find(".novashare-tooltip-text").fadeIn(100);
		}, function() {
		    $(this).closest("tr").find(".novashare-tooltip-text").fadeOut(100);
		});

		//validate input
		$("#novashare-admin [novashare_validate]").keypress(function(e) {

			//grab input and pattern
			var code = e.which;
			var character = String.fromCharCode(code);
			var pattern = $(this).attr('novashare_validate');

			//prevent input if character is invalid
			if(!character.match(pattern)) {
				e.preventDefault();
			}
		});

		//input display control
		$('.novashare-input-controller input, .novashare-input-controller select').change(function() {

			var controller = $(this);

			var inputID = $(this).attr('id');

			var nestedControllers = [];

			$('.' + inputID).each(function() {

				var skipFlag = true;
				var forceHide = false;
				var forceShow = false;
				var optionSelected = false;

				if($(this).hasClass('novashare-input-controller')) {
					nestedControllers.push($(this).find('input, select').attr('id'));
				}

				var currentInputContainer = this;

				$.each(nestedControllers, function(index, value) {
					var currentController = $('#' + value);

					if(currentController.is('input')) {

						var controlChecked = $('#' + value).is(':checked');
						var controlReverse = $('#' + value).closest('.novashare-input-controller').hasClass('novashare-input-controller-reverse');

			  			if($(currentInputContainer).hasClass(value) && (controlChecked == controlReverse)) {
			  				skipFlag = false;
			  				return false;
			  			}
			  		}
			  		else if(currentController.is('select')) {
			  			var classNames = currentInputContainer.className.match(/novashare-select-control-([^\s]*)/g);

			  			if(classNames) {
							var foundClass = ($.inArray('novashare-select-control-' + $('#' + value).val(), classNames)) >= 0;
							if(!foundClass) {
								forceHide = true;
							}
						}

						//clear value of nested selected controller and trigger change event
						if(controller.is('input') && !controller.is(':checked')) {
							currentController.val('').change();
						}
			  		}
				});

				if(controller.is('select')) {
					var classNames = this.className.match(/novashare-select-control-([^\s]*)/g);

					var foundClass = ($.inArray('novashare-select-control-' + controller.val(), classNames)) >= 0;

					if(classNames && (foundClass != $(this).hasClass('novashare-control-reverse'))) {
						forceShow = true;
					}
					else {
						forceHide = true;
					}

					var classParts = this.className.split('novashare-select-control-');
					var controllerClassNames = classParts[0].match(/([^\s]+)/g);
					$(controllerClassNames).each(function() {
						var controller = $('#' + this);
						if(controller.val() == classParts[1]) {
							forceShow = true;
							forceHide = false;
						}
					});
				}

				if(skipFlag) {
					if(($(this).hasClass('hidden') || forceShow) && !forceHide) {
						$(this).removeClass('hidden');
					}
					else {
						$(this).addClass('hidden');
					}
				}

			});
		});

		//hide alignment for column layouts
		$('#novashare-admin #inline-layout').change(function() {
			var $alignmentContainer = $('#novashare-admin #inline-alignment').closest('tr');
			if($(this).val()) {
				$alignmentContainer.addClass('hidden');
			}
			else {
				$alignmentContainer.removeClass('hidden');
			}
		});

	    //image upload input
		$('.novashare-image-upload-button').click(function() {

			var file_frame;
			var buttonVal = $(this).attr('value');
			var fieldID = '#' + buttonVal;

			//if the media frame already exists, reopen it
			if(file_frame) {
				file_frame.open();
			  	return;
			}

			//create the media frame
			file_frame = wp.media.frames.file_frame = wp.media({
		  		title: $(this).attr("frame_title"),
			  	library: {
		      		type: 'image'
			   	},
			  	multiple: false
			});

			//when an image is selected, run a callback
			file_frame.on('select', function() {

			  attachment = file_frame.state().get('selection').first().toJSON();

			  $(fieldID).val(attachment.id);
			  $(fieldID + '_url').val(attachment.url);

			  var $preview = $(fieldID).closest('.novashare-image-upload').find('.novashare-image-upload-preview');

			  var $previewLink = $preview.find('a');

			  if($previewLink && attachment.sizes.thumbnail.url) {
			  	$previewLink.find('img').remove();
			  	$previewLink.append("<img src='" + attachment.sizes.thumbnail.url + "' />");
			  	$preview.removeClass('hidden');
			  }
			});

			//open the modal
			file_frame.open();
		});

		//remove image thumbnail
		$('.novashare-image-upload-preview a').click(function(e) {
			e.preventDefault();

			var $container = $(this).closest('.novashare-image-upload');

			$container.find('.novashare-image-upload-preview').addClass('hidden');
			$container.find('.novashare-image-upload-preview a img').remove();
			$container.find('.novashare-image-upload-input input').val('');
		});

		//pinterest hidden images upload
		$('#novashare-pinterest-hidden-images-upload').click(function() {

			var file_frame;

			//if the media frame already exists, reopen it
			if(file_frame) {
				file_frame.open();
			  	return;
			}

			//create the media frame
			file_frame = wp.media.frames.file_frame = wp.media({
		  		title: $(this).attr("frame_title"),
			  	library: {
		      		type: 'image'
			   	},
			  	multiple: true
			});

			//when an image is selected, run a callback
			file_frame.on('select', function() {

				var attachments = file_frame.state().get('selection').map( 
	                function(attachment) {
	                    attachment.toJSON();
	                    return attachment;
	            });

	            var $container = $('#novashare-pinterest-hidden-images-container');

				attachments.forEach(function(attachment) {

					//check for existing image
					if($('#novashare-pinterest-hidden-image-' + attachment.id).length) {
				        return;
				    }

				    //make sure thumbnail is available
				    if(!attachment.attributes.sizes.thumbnail) {
				    	return;
				    }

				    var output = '<div id="novashare-pinterest-hidden-image-' + attachment.id + '" class="novashare-pinterest-hidden-image">';
						output+= '<img src="' + attachment.attributes.sizes.thumbnail.url + '" >';
						output+= '<input type="hidden" name="novashare[pinterest_hidden_images][]"  value="' + attachment.id + '">';
						output+= '<span class="dashicons dashicons-no"></span>';
					output+= '</div>';

					$container.append(output);
				});

			});

			//open the modal
			file_frame.open();
		});

		//remove pinterest hidden image thumbnail
		$('#novashare-pinterest-hidden-images-container').on('click', '.novashare-pinterest-hidden-image .dashicons-no', function(e) {
			$(this).closest('.novashare-pinterest-hidden-image').remove();
		});

		//calculate and display details character counts on load
		$('.novashare-details-char-count').each(function() {
			novashareUpdateDetailsCharCount($(this));
		});

		//update details character counts on keyup
		$('.novashare-details-char-count input, .novashare-details-char-count textarea').keyup(function() {
			var $container = $(this).closest('.novashare-details-char-count');
			if($container) {
				novashareUpdateDetailsCharCount($container);
			}
		});

		//refresh share counts button click
		$('#novashare-refresh-share-counts').click(function(e) {

			e.preventDefault();

			$button = $(this);

			if($button.hasClass('disabled')) {
				return false;
			}

			//disable the button
			$button.addClass('disabled' );

			//show spinner
			$button.siblings('.spinner').addClass('is-active');

			//data to pass
			var data = {
				action 	: 'novashare_refresh_post_share_counts',
				nonce  	: $button.siblings('#novashare_refresh_post_share_counts').val(),
				post_id	: parseInt($('#post_ID').val())
			}

			//run ajax function
			$.post(ajaxurl, data, function(response) {
				$button.siblings('.spinner').removeClass('is-active');
				$button.siblings('.dashicons-yes').fadeIn().css('display', 'inline-block');
				setTimeout(function() { $button.siblings('.dashicons-yes').fadeOut(); }, 1000);
				$button.removeClass('disabled');
			});
		});

		//add new post recovery url
		$('#novashare-add-recovery-url').on('click', function(ev) {
			ev.preventDefault();

			var recoveryURLCount = $(this).prop('rel');

			recoveryURLCount++;
			
			$('#novashare-post-recovery-urls').append("<div class='novashare-post-recovery-url'><input type='text' id='novashare-recovery-url-" + recoveryURLCount + "' name='novashare[recovery_urls][]' value='' placeholder='https://domain.com/sample-post/' /><a href='#' class='button button-secondary novashare-delete-recovery-url' title='" + __("Remove", 'novashare') + "'>" + __("Remove", 'novashare') + "</a></div>");

			$(this).prop('rel', recoveryURLCount);
			if(recoveryURLCount > 4) {
				$('#novashare-add-recovery-url').hide();
				$('#novashare-post-recovery-max').show();
			}
		});

		//remove post recovery url
		$('#novashare-post-recovery-urls').on('click', '.novashare-delete-recovery-url', function(ev) {

			ev.preventDefault();

			var siblings = $(this).closest('div').siblings();
			
			$(this).closest('div').remove();

			siblings.each(function(i) {

				var url = $(this).find('input');

				url.attr('id', 'novashare-recovery-url-' + i);
			});

			var recoveryURLCount = $('#novashare-add-recovery-url').prop('rel') - 1;
			$('#novashare-add-recovery-url').prop('rel', recoveryURLCount);
			if(recoveryURLCount < 5) {
				$('#novashare-add-recovery-url').show();
				$('#novashare-post-recovery-max').hide();
			}

		});

		//initialize codemirror textareas
		var $codemirror = $('.novashare-codemirror');
		if($codemirror.length) {
			wp.codeEditor.initialize($codemirror, cm_settings);
		}

		//close cta
		$('#novashare-cta-close').click(function(e) {
			
			e.preventDefault();

			$('#novashare-cta').hide();

			 //ajax request
			$.ajax({
		        type: "POST",
		        url: NOVASHARE.ajaxurl,
		        data: {
		        	action: 'novashare_close_cta',
		        	nonce: NOVASHARE.nonce
		        }
		    });
		});
	});

	//function to update details character count
	function novashareUpdateDetailsCharCount(e) {

		var $label = e.find('label');
		var $input = e.find('input, textarea');

		if($label && $input) {

			var maxLength = $input.prop('maxlength');

			if(maxLength) {

				var currLength = $input.val().length;

				var remainingChars = maxLength - currLength;

				var characterText = __("Characters", 'novashare');

				if(remainingChars == 1) {
					characterText = __("Character", 'novashare');
				}

				$label.find('span').remove();
				$label.append("<span>" + remainingChars + " " + characterText + " " + __("Remaining", 'novashare') + "</span>");
			}
		}
	}

	//validate settings input
	function novashareValidateInput(input, pattern) {

		var code = input.which;
		var character = String.fromCharCode(code);

		if(!character.match(pattern)) {
			input.preventDefault();
		}
	}

}(jQuery));

jQuery(function($) {

	var nsActionButtonTimeouts = [];

	//action button press
	$('button[data-ns-action]').click(function(e) {

		e.preventDefault();

		//confirmation dialog
		var confirmation = $(this).attr('data-ns-confirmation');
		if(confirmation && !confirm(confirmation)) {
			return;
		}

		//assign variables
		var action = $(this).attr('data-ns-action');
		var button = $(this);
		var container = $(this).closest('.novashare-button-container');
		var text = container.find('.novashare-button-text');
		var spinner = container.find('.novashare-button-spinner');
		var message = container.find('.novashare-button-message');

		//reset message
		message.html('');
		message.removeClass('novashare-error');
	 	clearTimeout(nsActionButtonTimeouts[action]);

	 	//switch to spinner
	    $(this).attr('disabled', true);
	    text.hide();
	    spinner.css('display', 'block');

	    //setup form data
	    var formData = new FormData();
	    formData.append('action', 'novashare_' + action);
	    formData.append('nonce', NOVASHARE.nonce);

	    //additional setup
	    if(action == 'import_settings') {
    		formData.append('novashare_import_settings_file', document.getElementById('novashare-import-settings-file').files[0]);
	    }
	    else {
	    	var form = $(this).closest('form');
	    	form.find('.CodeMirror').each(function() {
			    this.CodeMirror.save();
			});
	    	formData.append('form', form.serialize());
	    }

	    //ajax request
		$.ajax({
	        type: "POST",
	        url: NOVASHARE.ajaxurl,
	        data: formData,
	        processData: false,
       		contentType: false
	    })
	    .done(function(r) {

	    	//add message error class
	    	if(!r.success) {
	    		message.addClass('novashare-error');
	    	}

	    	//export settings
	    	if(action == 'export_settings' && r.data.export) {
	    		var blob = new Blob([r.data.export], {
			        type: 'application/json'
		      	});
			    var link = document.createElement('a');
			    link.href = window.URL.createObjectURL(blob);

			    var d = new Date();
				var month = d.getMonth()+1;
				var day = d.getDate();
				var dateString = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;

			    link.download = 'novashare-settings-export-' + dateString + '.json';
			    link.click();
	    	}
		})
		.fail(function(r) {
			message.addClass('novashare-error');
			message.html(NOVASHARE.strings.failed);
		})
		.always(function(r) {
			
			//show response message
			if(r.data && r.data.message) {
				message.html(r.data.message);
			}
			message.fadeIn();
			clearTimeout(nsActionButtonTimeouts[action]);
			nsActionButtonTimeouts[action] = setTimeout(function() {
				message.fadeOut();
			}, 2500);

			//re-enable button
			button.attr('disabled', false);
			text.show();
	       	spinner.css('display', 'none');

	       	//reload page
	       	if(r.data && r.data.reload) {
	       		location.reload();
	       	}
		})
	});
});