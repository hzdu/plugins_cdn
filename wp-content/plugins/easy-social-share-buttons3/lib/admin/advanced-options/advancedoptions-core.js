jQuery(document).ready(function($){
	"use strict";
	
	var aoRemoveCustomPosition = window.aoRemoveCustomPosition = function(position) {
		var remotePost = { 'position': position };

		swal({
			title: "Are you sure?",
			text: "If you are using this position anywhere inside content and delete it the design of share buttons will not show again.",
			icon: "warning",
			buttons: true,
			dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				  essbAdvancedOptions.post('remove_position', remotePost, function(data) {

					  	if (data) {
					  		ao_user_positions = JSON.parse(data);
					  		ao_user_positions_draw();
					  	}

						$.toast({
							    heading: 'The position is removed. The menu entries will disappear when you reload settings page.',
							    //text: 'If you are using a cache plugin, service or CDN do not forget to clear them.',
							    showHideTransition: 'fade',
							    icon: 'success',
							    position: 'bottom-right',
							    hideAfter: 5000
							});
						});
			  }
			});

	}
	
	if (typeof(essb_advancedopts_ajaxurl) == 'undefined') return;
	
	var essbAdvancedOptions = window.essbAdvancedOptions = {
		ajax_url: essb_advancedopts_ajaxurl || '',
		debug_mode: true,
		requireReload: false,
		settings: '',
		withoutSave: false
	}

	essbAdvancedOptions.post = function(action, options, callback) {
		if (!options) options = {};
		options['action'] = 'essb_advanced_options';
		options['cmd'] = action;
		// sending the nonce token via settings
		options['essb_advancedoptions_token'] = $('#essb_advancedoptions_token').length ? $('#essb_advancedoptions_token').val() : '';


		if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeIn(100);

		$.ajax({
            type: "POST",
            url: essbAdvancedOptions.ajax_url,
            data: options,
            success: function (data) {
            	if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeOut(100);
            	if (essbAdvancedOptions.debug_mode) console.log(data);

	            if (callback) callback(data);
            }
    	});
	}

	essbAdvancedOptions.read = function(action, options, callback) {
		if (!options) options = {};
		options['action'] = 'essb_advanced_options';
		options['cmd'] = action;
		// sending the nonce token via settings
		options['essb_advancedoptions_token'] = $('#essb_advancedoptions_token').length ? $('#essb_advancedoptions_token').val() : '';


		console.log(options);
		if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeIn(100);

		$.ajax({
            type: "GET",
            url: essbAdvancedOptions.ajax_url,
            data: options,
            success: function (data) {
            	if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeOut(100);

	            if (callback) callback(data);
            }
    	});
	}

	essbAdvancedOptions.correctWidthAndPosition = function(userWidth) {
		var baseWidth = 1200, wWidth = $(window).width(),
			wHeight = $(window).height(),
			winHeight = wHeight;
		
		// Providing option for passing an user width to the setup
		if (userWidth && Number(userWidth) && !isNaN(userWidth) && Number(userWidth) > 0) baseWidth = userWidth;
		
		winHeight -= ($('#wpadminbar').length) ? $('#wpadminbar').height() : 30; 

		if (wWidth < baseWidth) baseWidth = wWidth - 100;
		$('#essb-advancedoptions').css({'width': baseWidth + 'px', 'height': winHeight + 'px'});
		$('#essb-advancedoptions').centerWithAdminBar();
		$('#essb-advancedoptions').css({'left': 'auto', 'right': '0'});

		if ($('#essb-advancedoptions').find('.essb-helper-popup-content').length) {
			var contentHolder = $('#essb-advancedoptions').find('.essb-helper-popup-content'),
				contentHolderHeight = $(contentHolder).actual('height'),
				contentOffsetCorrection = 90;

			$('#essb-advancedoptions').find('.essb-helper-popup-content').css({height: (winHeight - contentOffsetCorrection)+'px'});
			$('#essb-advancedoptions').find('.essb-helper-popup-content').css({overflowY: 'auto'});

		}
	}

	/**
	 *
	 */
	essbAdvancedOptions.show = function(settings, reload, title, hideSave, loadingOptions, userWidth) {
		if (!userWidth) userWidth = '';
		
		essbAdvancedOptions.correctWidthAndPosition(userWidth);

		if (!settings) settings = '';
		essbAdvancedOptions.settings = settings;
		essbAdvancedOptions.requireReload = reload;
		essbAdvancedOptions.withoutSave = hideSave;

		if (!title) title = 'Additional Options';
		if (essbAdvancedOptions.withoutSave) {
			$('#essb-advancedoptions .advancedoptions-save').hide();
		}
		else{
			$('#essb-advancedoptions .advancedoptions-save').show();
		}

		$('#essb-advanced-options-form').html('');
		$('.advancedoptions-modal').fadeIn();
		$('#essb-advancedoptions').fadeIn();

		$('#advancedOptions-title').text(title);
		if (reload)
			$.toast({
			    heading: 'Saving of the options will reload the screen. If you have unsaved changes they will be lost.',
			    text: '',
			    showHideTransition: 'fade',
			    icon: 'info',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

		essbAdvancedOptions.read('get', { 'settings': settings, 'loadingOptions': loadingOptions  }, essbAdvancedOptions.load);
	}

	essbAdvancedOptions.close = function() {
		$('.advancedoptions-modal').fadeOut();
		$('#essb-advancedoptions').fadeOut(200);
	}

	essbAdvancedOptions.load = function(content) {
		if (!content) content = '';

		$('#essb-advanced-options-form').html(content);
		essbAdvancedOptions.assignAfterloadEvents();
		
		/**
		 * Assing the functions control events
		 */
		$('.features-deactivate .single-feature .activate-btn').on('click', function(e) {
			e.preventDefault();
			var rootElement = $(this).parent().parent(),
				rootType = $(rootElement).data('type') || '';

			$(rootElement).addClass('active');

			if (rootType == 'deactivation') $(rootElement).find('.feature-value').val('');
			else $(rootElement).find('.feature-value').val('true');
			updateFeaturesTags();
		});

		$('.features-deactivate .single-feature .deactivate-btn').on('click', function(e) {
			e.preventDefault();

			e.preventDefault();
			var rootElement = $(this).parent().parent(),
				rootType = $(rootElement).data('type') || '';

			$(rootElement).removeClass('active');

			if (rootType == 'deactivation') $(rootElement).find('.feature-value').val('true');
			else $(rootElement).find('.feature-value').val('');
			updateFeaturesTags();
		});
		
		function updateFeaturesTags() {
			$('.features-container .navigation a').each(function() {
				var tab = $(this).data('tab') || '', total = 0, active = 0;

				$('.features-container .content .tab-' + tab + ' .single-feature').each(function() {
					total++;

					if ($(this).hasClass('active')) active++;
				});

				$(this).find('span').html(active + '/' + total);				
			});
		}

		$('.features-container .navigation a').on('click', function(e) {
			e.preventDefault();
			var url = $(this).attr('href') || '';
			if ($(this).hasClass('help-link') && url != '') {
				window.open(url);
				return;
			}
						
			var tab = $(this).data('tab') || '';	
			$('.features-container .navigation a').removeClass('active');
			$(this).addClass('active');
			$('.features-container .content .content-tab').removeClass('active');
			$('.features-container .content .tab-' + tab).addClass('active');	
		});

		updateFeaturesTags();
		$('.features-container .navigation a').first().trigger('click');
	}

	essbAdvancedOptions.assignAfterloadEvents = function() {
		$('#essb-advancedoptions .essb-component-toggleselect .toggleselect-item').each(function() {
			$(this).on('click', function(e) {
				e.preventDefault();
				$(this).parent().find('.toggleselect-item').each(function(){
					if ($(this).hasClass('active'))
						$(this).removeClass('active');
				});

				$(this).addClass('active');

				var selectedValue = $(this).attr('data-value') || '';
				$(this).parent().find('.toggleselect-holder').val(selectedValue);

				$(this).parent().find('.toggleselect-holder').trigger('change');
			});
	 	});

		$('.input-colorselector').each(function() {
			$(this).wpColorPicker();
		});


		$('#essb-advancedoptions').find('.essb-portlet-switch').find('.onoffswitch-checkbox').each(function(){
			$(this).on('click', function(e) {

				var state_checkbox = $(this);
				if (!state_checkbox.length) return;

				var state = $(state_checkbox).is(':checked');


				var parent_heading = $(this).parent().parent().parent();

				// closed
				if (state) {
					$(parent_heading).removeClass('essb-portlet-heading-closed');
					var content = $(parent_heading).parent().find('.essb-portlet-content');
					if (content.length > 1) content = content[0];
					$(content).slideDown("fast", function() {
						$(content).removeClass('essb-portlet-content-closed');
					});

					$('.CodeMirror').each(function(i, el){
					    el.CodeMirror.refresh();
					});

					$(parent_heading).parent().find('.essb_image_radio').each(function() {
						var image = $(this).find('.checkbox-image img');
						if (image) {
							var width = image.width();
							width += 10;

							$(this).parent().find('.essb_radio_label').width(width);
						}
					});

					$(parent_heading).parent().find('.essb_image_checkbox').each(function() {
						var image = $(this).find('.checkbox-image img');
						if (image) {
							var width = image.width();
							width += 10;

							$(this).parent().find('.essb_checkbox_label').width(width);
						}
					});
				}
				else {
					$(parent_heading).addClass('essb-portlet-heading-closed');
					var content = $(parent_heading).parent().find('.essb-portlet-content');
					if (content.length > 1) content = content[0];
					$(content).slideUp("fast", function() {
						$(content).addClass('essb-portlet-content-closed');
					});

				}
			});
		});
		
		$('.ao-shortcode-type-select').on('change', function() {
			if (!$('.essb-floating-shortcodegenerator').length) return;
			
			var current = $(this).find(":selected"),
				code = $(current).data('set-shortcode') || '',
				content = $(current).data('set-content') || '';
			
			$('.essb-floating-shortcodegenerator').data('shortcode', code);
			$('.essb-floating-shortcodegenerator').data('content', content);
		});

		$('.ao-generate-shortcode-btn').on('click', function(e){
			e.preventDefault();
			
			if (!$('.essb-floating-shortcodegenerator').length) return;
			
			var shortcode = $('.essb-floating-shortcodegenerator').data('shortcode') || '',
				content = $('.essb-floating-shortcodegenerator').data('content') || '',
				options = [];
			
			$('.essb-floating-shortcodegenerator .shortcode-options input, .essb-floating-shortcodegenerator .shortcode-options textarea, .essb-floating-shortcodegenerator .shortcode-options select').each(function() {
				var value = $(this).val(), param = $(this).data('param') || '';
				
				if ($(this).hasClass('shortcode-ignore')) return;
				
				if (param == '' || value == '') return;				
				options[param] = value;
			});
			
			
			var code = '[' + shortcode;
			
			for (var param in options) {
				code += ' ' + param + '="' + options[param] + '"';
			}
			code += ']';
						
			if (content && content == true) code += 'Place your content here[/' + shortcode + ']';
			
			$('.essb-floating-shortcodegenerator .shortcode-result').fadeIn(200);
			$('.essb-floating-shortcodegenerator .shortcode-result').html(code);
			$('.essb-floating-shortcodegenerator .shortcode-result').attr('contenteditable', 'true');
			$('.essb-floating-shortcodegenerator .shortcode-result').focus();
			
			var element = document.querySelector('.essb-floating-shortcodegenerator .shortcode-result');
			if (document.body.createTextRange) {
				var range = document.body.createTextRange();
			    range.moveToElementText(element);
			    range.select();
			} else if (window.getSelection) {
				var selection = window.getSelection();        
			    var range = document.createRange();
			    range.selectNodeContents(element);
			    selection.removeAllRanges();
			    selection.addRange(range);
			}
			
			$.toast({
			    heading: 'Your shortcode is ready and selected. Copy the code and paste it anywhere in the content or site where the functionality should appear.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

		});
		
		$('.ao-validate-ig-token').on('click', function(e) {
			e.preventDefault();
			
			var token = $('#essb_options_token').val();
			
			if (token == '') {
				$.toast({
				    heading: 'No token key found',
				    showHideTransition: 'fade',
				    icon: 'error',
				    position: 'bottom-right',
				    hideAfter: 2000
				});
				
				return;
			}
			
			var validateIGUrl = 'https://graph.instagram.com/me?fields=id,username&access_token=' + token;
			$.ajax({
	            type: "GET",
	            url: validateIGUrl,
	            data: {},
	            success: function (data) {
	            	$('#essb_options_userid').val(data.id || '');
	            	$('#essb_options_username').val(data.username || '');
	            	
	            	$.toast({
					    heading: 'Token key validated successfully',
					    showHideTransition: 'fade',
					    icon: 'success',
					    position: 'bottom-right',
					    hideAfter: 2000
					});
	            },
	            error: function(data) {
	            	$.toast({
					    heading: 'The access token is not valid or it is expired',
					    showHideTransition: 'fade',
					    icon: 'error',
					    position: 'bottom-right',
					    hideAfter: 2000
					});
	            }
	    	});
		});
		
		if ($('.essb-advanced-options-form .essb-select2').length) {
			setTimeout(function() {
				$('.essb-advanced-options-form .essb-select2').each(function() {
					var currentValues = $(this).attr('data-values') || '';
					$(this).css('width', '100%');
					$(this).select2();
					$(this).val(currentValues.split(','));
					$(this).trigger('change');
				});
			}, 100);
		}
		
		/**
		 * Relations
		 */
		if (window.advancedRelations) {
			for (var field in window.advancedRelations) {
				var type = window.advancedRelations[field].type || '',
					connected = window.advancedRelations[field].fields || [];
				
				if (type == 'switch' && $('#essb_field_' + field).length && connected.length > 0) {
					$('#essb_field_' + field).attr('data-condition', field);
					$('#essb_field_' + field).on('change', function(e) {
						var conditionField = $(this).attr('data-condition') || '';
						
						if (conditionField == '' || !window.advancedRelations || !window.advancedRelations[conditionField]) return;
						
						var connected = window.advancedRelations[conditionField].fields || [];
						
						for (var i = 0; i < connected.length; i++) {
							var connectedID = connected[i] || '';
							if (!$('.settings-panel-' + connectedID).length) continue;							
							$('.settings-panel-' + connectedID).css('display', $(this).is(':checked') ? 'block': 'none');
							
							// execute connected relations for fields inside
							if ($('#essb_field_' + connectedID).length && ($('#essb_field_' + connectedID).attr('data-condition') || '') != '')
								$('#essb_field_' + connectedID).trigger('change');

							if ($('#essb_options_' + connectedID).length && ($('#essb_options_' + connectedID).attr('data-condition') || '') != '')
								$('#essb_options_' + connectedID).trigger('change');
						}
					});
					
					$('#essb_field_' + field).trigger('change');
				} // type == 'switch'
				
				if (type == 'value' && $('#essb_options_' + field).length) {
					$('#essb_options_' + field).attr('data-condition', field);
					$('#essb_options_' + field).on('change', function(e) {
						var conditionField = $(this).attr('data-condition') || '',
							currentValue = $(this).val();						
						if (conditionField == '' || !window.advancedRelations || !window.advancedRelations[conditionField]) return;						
						var valueList = window.advancedRelations[conditionField].fields || {};
						
						for (var possibleValue in valueList) {
							var connected = valueList[possibleValue];
							
							for (var i = 0; i < connected.length; i++) {
								var connectedID = connected[i] || '';
								if (!$('.settings-panel-' + connectedID).length) continue;							
								$('.settings-panel-' + connectedID).css('display', possibleValue == currentValue ? 'block': 'none');																
							}
						}
					});
					
					$('#essb_options_' + field).trigger('change');
				} // type == 'value'
			}
		}
		
		/**
		 * SVG Upload
		 */
		$('.ao-import-svg-icon').on('click', function(e) {
			e.preventDefault();
			
			var filePicker = $(this).data('picker') || '',
				contentFor = $(this).data('for') || '';		
			
			if (document.querySelector('#' + filePicker)) {
				
				document.querySelector('#' + filePicker).addEventListener('change', function (e) {
					var sender = e.target,
						contentFor = sender.getAttribute('data-for') || '',
						reader = new FileReader(),
						file = sender.files[0];
					
					reader.onload = function (e) {
	                    if (contentFor != '' && document.querySelector('#' + contentFor))
	                    	document.querySelector('#' + contentFor).value = reader.result;
	                }

	                reader.readAsText(file);
	                sender.value = '';				
	
	            });
				
				document.querySelector('#' + filePicker).setAttribute('data-for', contentFor);
				document.querySelector('#' + filePicker).click();
			}
		});
		
		/**
		 * NetworkID generation
		 */
		if ($('#essb_options_network_id').length && $('#essb_options_name').length) {
			$('#essb_options_name').on('change', function() {
				var name = $(this).val(),
					allowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0','1','2', '3', '4', '5', '6', '7','8', '9', '_'];
				if (name != '' && $('#essb_options_network_id').val() == '') {
					name = name.toLowerCase().replace(/ /g, '');
					var networkID = '', keys = name.split('');
					
					for (let i=0;i<keys.length;i++) {
						if (allowed.indexOf(keys[i]) > -1) networkID += keys[i];
					}
					
					$('#essb_options_network_id').val(networkID);
				}
			});
		}
		
		/**
		 * Import custom network button
		 */
		$('.ao-save-import-followcustom-button').on('click', function(e) {
			var network_code = $('#essb_options_input_profiles_network_code').val();
			if (!network_code || network_code == '') {
				swal("Error", "You did not provide a network import code!", "error");
				return;
			}
			
			var remotePost = { 'network_code': network_code};

			essbAdvancedOptions.post('import_profiles_network', remotePost, function(data) {
				$.toast({
				    heading: 'Finished importing the network code. Settings screen will reload. If everything is OK you will see the new network in the list.',
				    showHideTransition: 'fade',
				    icon: 'success',
				    position: 'bottom-right',
				    hideAfter: 5000
				});

				setTimeout(function(){
					if (!essb_advancedopts_reloadurl) return;
					var reload = essb_advancedopts_reloadurl,
						section = $('#section').val(),
						subsection = $('#subsection').val();

					window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
				}, 2000);
			});
		});
		
		$('.ao-save-import-sharecustom-button').on('click', function(e) {
			var network_code = $('#essb_options_input_share_network_code').val();
			if (!network_code || network_code == '') {
				swal("Error", "You did not provide a network import code!", "error");
				return;
			}
			
			var remotePost = { 'network_code': network_code};

			essbAdvancedOptions.post('import_share_network', remotePost, function(data) {
				$.toast({
				    heading: 'Finished importing the network code. Settings screen will reload. If everything is OK you will see the new network in the list.',
				    showHideTransition: 'fade',
				    icon: 'success',
				    position: 'bottom-right',
				    hideAfter: 5000
				});

				setTimeout(function(){
					if (!essb_advancedopts_reloadurl) return;
					var reload = essb_advancedopts_reloadurl,
						section = $('#section').val(),
						subsection = $('#subsection').val();

					window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
				}, 2000);
			});
		});		
		
		if ($('#essb_options_export_profiles_output_code').length) {
			$('#essb_options_export_profiles_output_code').focus();
			$('#essb_options_export_profiles_output_code').select();
		}
		
		if ($('#essb_options_export_share_output_code').length) {
			$('#essb_options_export_share_output_code').focus();
			$('#essb_options_export_share_output_code').select();
		}
		
		// end conditions
	}

	essbAdvancedOptions.removeFormDesign = function(design) {
		var remotePost = { 'design': design};

		essbAdvancedOptions.post('remove_form_design', remotePost, function(data) {
			$.toast({
			    heading: 'User design is removed! The settings screen will reload to update the values.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});
	}
	
	essbAdvancedOptions.removeInstagramAccount = function(account) {
		var remotePost = { 'account': account};

		essbAdvancedOptions.post('remove_instagram_account', remotePost, function(data) {
			$.toast({
			    heading: 'Account is removed! The settings screen will reload to update the values.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});
	}
	
	essbAdvancedOptions.updateInstagramToken = function(account, token) {
		var remotePost = { 'account': account, 'token': token };

		essbAdvancedOptions.post('update_instagram_token', remotePost, function(data) {
			$.toast({
			    heading: 'Instagram token is successfully updated!',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});
		});
	}
	
	essbAdvancedOptions.updateInstagramImages = function(account, username) {
		var remotePost = { 'account': account, 'username': username };	

		essbAdvancedOptions.post('update_instagram_images', remotePost, function(data) {
			$.toast({
			    heading: 'Instagram images are successfully updated!',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});
		});
	}
	
	essbAdvancedOptions.removeAllInstagramAccounts = function() {
		var remotePost = { };

		essbAdvancedOptions.post('remove_instagram_accounts', remotePost, function(data) {
			$.toast({
			    heading: 'All accounts are removed! The settings screen will reload to update the values.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});		
	}
	
	essbAdvancedOptions.removeCustomButton = function(network) {
		var remotePost = { 'network_id': network };
		essbAdvancedOptions.post('remove_custom_button', remotePost, function(data) {
			$.toast({
			    heading: 'Custom button is removed! The settings screen will reload to update the values.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});
	}
	
	essbAdvancedOptions.removeCustomFollowButton = function(network) {
		var remotePost = { 'network_id': network };
		essbAdvancedOptions.post('remove_custom_profile_button', remotePost, function(data) {
			$.toast({
			    heading: 'Custom button is removed! The settings screen will reload to update the values.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});
	}
	
	essbAdvancedOptions.removeAllCustomShareButtons = function() {
		var remotePost = { };
		essbAdvancedOptions.post('remove_all_custom_share_buttons', remotePost, function(data) {
			$.toast({
			    heading: 'All custom networks are removed. The settings screen will reload.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});
	}
	
	essbAdvancedOptions.removeAllCustomFollowButtons = function() {
		var remotePost = { };
		essbAdvancedOptions.post('remove_all_custom_profile_buttons', remotePost, function(data) {
			$.toast({
			    heading: 'All custom networks are removed. The settings screen will reload.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});
	}
	
	essbAdvancedOptions.clearSubscribeConversions = function() {
		var remotePost = { };

		essbAdvancedOptions.post('clear_subscribe_conversions', remotePost, function(data) {
			$.toast({
			    heading: 'Data is cleared successfully. The options screen will reload now.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});		
	}
	
	essbAdvancedOptions.clearShareConversions = function() {
		var remotePost = { };

		essbAdvancedOptions.post('clear_share_conversions', remotePost, function(data) {
			$.toast({
			    heading: 'Data is cleared successfully. The options screen will reload now.',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});

			setTimeout(function(){
				if (!essb_advancedopts_reloadurl) return;
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
			}, 2000);
		});		
	}

	essbAdvancedOptions.save = function() {
		var optGroup = $('#essb-advanced-group').val(), options = {},
			paths = ['#essb-advanced-options-form input', '#essb-advanced-options-form select', '#essb-advanced-options-form textarea'];

		for (var i = 0; i < paths.length; i++) {
			$(paths[i]).each(function(){
				var elementId = $(this).id || '',
					elementName = $(this).attr('name') || '',
					elementValue = $(this).val(),
					elementType = $(this).attr('type') || '';

				if (elementType == 'checkbox' || elementType == 'radio')
					elementValue = $(this).is(":checked") ? 'true': 'false';

				if (elementName == '' || elementName == 'essb-advanced-group') return;

				elementName = elementName.replace('essb_options', '').replace('[', '').replace(']', '').replace('managestyle_', '');
				
				// fixing the functions network name
				if (elementName == 'functions_networks[]') {
					elementName = 'functions_networks';
					elementValue = $(this).is(":checked") ? $(this).val(): '';
					if (!options[elementName]) options[elementName] = [];
					if (elementValue != '') options[elementName].push(elementValue);
				}
				else if (elementName == 'stylebuilder_css[]') {
					elementName = 'stylebuilder_css';
					elementValue = $(this).is(":checked") ? $(this).val(): '';
					if (!options[elementName]) options[elementName] = [];
					if (elementValue != '') options[elementName].push(elementValue);
				}
				else if (elementName == 'active_internal_counters_advanced_networks[]') {
					elementName = 'active_internal_counters_advanced_networks';
					options[elementName] = elementValue;
				}
				else {
					options[elementName] = elementValue;
				}
			});
		}

		console.log(options);
		console.log('group = ' + optGroup);

		var remotePost = {
			'group': optGroup,
			'advanced_options': options
		};

		essbAdvancedOptions.post('save', remotePost, function(data) {
			$.toast({
			    heading: 'Options are saved!' + (essbAdvancedOptions.requireReload ? ' The settings screen will reload to activate the new setup' : ''),
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});
			essbAdvancedOptions.close();

			if (essbAdvancedOptions.requireReload) {
				setTimeout(function(){
					if (!essb_advancedopts_reloadurl) return;
					var reload = essb_advancedopts_reloadurl,
						section = $('#section').val(),
						subsection = $('#subsection').val();

					window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
				}, 2000);
			}
		});
	}
	//-- actions assigned to components

	$('#essb-advancedoptions .advancedoptions-close').on('click', function(e) {
		e.preventDefault();
		essbAdvancedOptions.close();
	});

	$('#essb-advancedoptions .advancedoptions-save').on('click', function(e) {
		e.preventDefault();
		essbAdvancedOptions.save();
	});

	if ($('.essb-head-modesbtn').length) {
		$('.essb-head-modesbtn').on('click', function(e) {
			e.preventDefault();
			essbAdvancedOptions.show('mode', true, 'Switch Mode', false, {}, 500);
		});
	}

	if ($('.essb-head-featuresbtn').length) {
		$('.essb-head-featuresbtn').on('click', function(e) {
			e.preventDefault();
			essbAdvancedOptions.show('features', true, 'Manage Plugin Features', false, {});
		});
	}

	$('.ao-option-callback').on('click', function(e) {
		e.preventDefault();

		var action = $(this).data('option') || '',
			title = $(this).data('window-title') || '';

		if (action != '') essbAdvancedOptions.show(action, true, title, false, {});
	});

	$('.ao-form-userdesign').on('click', function(e){
		e.preventDefault();

		var design = $(this).data('design') || '',
			title = $(this).data('title') || '';

		design = design.replace('design-', '');

		essbAdvancedOptions.show('manage_subscribe_forms', true, title, false, { 'design': design });

	});

	$('.ao-form-removeuserdesign').on('click', function(e) {
		e.preventDefault();

		var design = $(this).data('design') || '',
			title = $(this).data('title') || '';

		design = design.replace('design-', '');

		swal({ title: "Are you sure?",
			  text: "Once deleted, you will not be able to recover this design!",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeFormDesign(design);
			  }
			});

	});
	
	$('.ao-form-igaccount').on('click', function(e){
		e.preventDefault();

		var account = $(this).data('account') || '',
			title = $(this).data('title') || '';

		account = account.replace('account-', '');

		essbAdvancedOptions.show('manage_instagram_accounts', true, title, false, { 'account': account }, 500);
	});

	$('.ao-form-removeigaccount').on('click', function(e) {
		e.preventDefault();

		var account = $(this).data('account') || '',
			title = $(this).data('title') || '';

		account = account.replace('account-', '');

		swal({ title: "Are you sure?",
			  text: "Please confirm you wish to remove this account from the list!",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeInstagramAccount(account);
			  }
			});

	});
	
	$('.ao-form-refreshtoken').on('click', function(e) {
		e.preventDefault();

		var account = $(this).data('account') || '',
			token = $(this).data('token') || '',
			baseURL = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' + token;

		account = account.replace('account-', '');
		
		
		$.ajax({
            type: "GET",
            url: baseURL,
            data: {},
            success: function (data) {
            	if (data && data.access_token) {
            		essbAdvancedOptions.updateInstagramToken(account, data.access_token);
            	}
            	else {
    				$.toast({
    				    heading: 'A problem with token refresh appears. Please, try again later and if it fails again complete the steps and obtain a new one.',
    				    showHideTransition: 'fade',
    				    icon: 'error',
    				    position: 'bottom-right',
    				    hideAfter: 5000
    				});
            	}
            },
            error: function(data) {
				$.toast({
				    heading: 'A problem with token refresh appears. Please, try again later and if it fails again complete the steps and obtain a new one.',
				    showHideTransition: 'fade',
				    icon: 'error',
				    position: 'bottom-right',
				    hideAfter: 5000
				});
            }
    	});
	});
	
	$('.ao-form-igupdate').on('click', function(e) {
		e.preventDefault();
		
		var account = $(this).data('account') || '',
			username = $(this).data('username') || '';
		
		essbAdvancedOptions.updateInstagramImages(account, username);
	});
	
	$('.ao-remove-igaccounts').on('click', function(e) {
		e.preventDefault();
		
		swal({ title: "Are you sure?",
			  text: "Please confirm you wish to remove all accounts!",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeAllInstagramAccounts();
			  }
			});

	});

	$('.ao-options-btn').on('click', function(e) {
		e.preventDefault();

		var action = $(this).data('option') || '',
			reload = $(this).data('reload') || '',
			title = $(this).data('title') || '',
			width = $(this).data('width') || '',
			hideSave = $(this).data('hidesave') || '';
		if (action != '') essbAdvancedOptions.show(action, (reload == 'yes' ? true : false), title, (hideSave == 'yes' ? true : false), {}, width);
	});
	
	$('.ao-options-btn-deactivate').on('click', function(e) {
		e.preventDefault();
		
		var deactivate_id = $(this).data('field') || '';
		if (deactivate_id == '') return;
		
		if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeIn(100);
		
		if ($('#section').length) $('#section').val('');
		if ($('#subsection').length) $('#subsection').val('');
		
		$('#essb_options_form').append('<input type="hidden" name="essb_options['+deactivate_id+']" id="essb_'+deactivate_id+'" value="true" />');
		essb_disable_ajax_submit = true;
		$('#essb_options_form').submit();
	});
	
	$('.ao-options-btn-activate').on('click', function(e) {
		e.preventDefault();
		
		var deactivate_id = $(this).data('field') || '',
			custom_deactivate_value = $(this).attr('data-uservalue') || '';
		
		if (deactivate_id == '') return;
		
		if (custom_deactivate_value == '' || !custom_deactivate_value) custom_deactivate_value = 'true'; 		
		if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeIn(100);
				
		$('#essb_options_form').append('<input type="hidden" name="essb_options['+deactivate_id+']" id="essb_'+deactivate_id+'" value="'+custom_deactivate_value+'" />');
		essb_disable_ajax_submit = true;
		$('#essb_options_form').submit();
	});

	$('.ao-remove-display-position').on('click', function(e) {
		e.preventDefault();

		var position = $(this).data('position') || '';
		if (!position || position == '') return;

		aoRemoveCustomPosition(position);
	});

	$('.ao-new-display-position').on('click', function(e) {
		e.preventDefault();
		swal("Enter position name:", { content: "input", buttons: {
		    cancel: true,
		    confirm: true,
		  }}).then((value) => {
			  if (!value) value = '';
			  
			  if (value == '') return;
			var remotePost = {
					'position_name': value
				};

			essbAdvancedOptions.post('create_position', remotePost, function(data) {

			  	if (data) {
			  		ao_user_positions = JSON.parse(data);
			  		ao_user_positions_draw();
			  	}


				$.toast({
					    heading: 'The new position is added. The new menu entries for this position will appear when you reload the settings page.',
					    showHideTransition: 'fade',
					    icon: 'success',
					    position: 'bottom-right',
					    hideAfter: 5000
					});
				});

		});
	});
	
	$('.essb-migrate-settings').on('click', function(e) {
		e.preventDefault();

		var migrate = $(this).data('migrate') || '',
			migrateClear = $(this).data('migrate-clear') || '';
		
		var remotePost = { 'function' : migrate != '' ? migrate : migrateClear };
		if (migrate != '') {
			essbAdvancedOptions.post('migrate', remotePost, function(data) {
				$.toast({
					    heading: 'Data migrated successfully. The screen will reload.',
					    showHideTransition: 'fade',
					    icon: 'success',
					    position: 'bottom-right',
					    hideAfter: 5000
					});
				});
		}
		else if (migrateClear != '') {
			var title = $(this).data('title') || '';
			
			swal({
				title: "Are you sure you wish to clear the old data for: "+ title +"?",
				text: "The function will completely remove any previous data used by the plugin in a legacy format. This operation cannot be undone (unless you restore a database backup).",
				icon: "warning",
				buttons: true,
				dangerMode: true,
				}).then((willDelete) => {
				  if (willDelete) {
					  essbAdvancedOptions.post('migrate_clear', remotePost, function(data) {
							$.toast({
								    heading: 'Reset of ' + title+ ' is completed!',
								    showHideTransition: 'fade',
								    icon: 'success',
								    position: 'bottom-right',
								    hideAfter: 5000
								});
							});
				  }
				});
		}
	});

	$('.essb-reset-settings').on('click', function(e) {
		e.preventDefault();

		var cmd = $(this).data('clear') || '',
			title = $(this).data('title') || '';

		var remotePost = { 'function': cmd };

		swal({
			title: "Are you sure you want to reset: "+ title +"?",
			text: "The reset will remove data or restore default data of plugin. This option cannot be undone.",
			icon: "warning",
			buttons: true,
			dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				  essbAdvancedOptions.post('reset_command', remotePost, function(data) {
						$.toast({
							    heading: 'Reset of ' + title+ ' is completed!',
							    showHideTransition: 'fade',
							    icon: 'success',
							    position: 'bottom-right',
							    hideAfter: 5000
							});
						});
				  
				  		if (cmd == 'resetsettings') {
				  			setTimeout(function(){
								if (!essb_advancedopts_reloadurl) return;
								var reload = essb_advancedopts_reloadurl,
									section = $('#section').val(),
									subsection = $('#subsection').val();

								window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
							}, 2000);
				  		}
			  }
			});
	});
	
	$('.deactivate-help-hint').on('click', function(e) {
		e.preventDefault();
		
		var remotePost = { 'key': 'deactivate_helphints' };
		essbAdvancedOptions.post('enable_option', remotePost, function(data) {
			$.toast({
				    heading: 'Help hints are deactivated. Settings screen will reload.',
				    showHideTransition: 'fade',
				    icon: 'success',
				    position: 'bottom-right',
				    hideAfter: 5000
			});
			var reload = essb_advancedopts_reloadurl,
				section = $('#section').val(),
				subsection = $('#subsection').val();

			window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
		});
	});
	
	$('.deactivate-styles-panel').on('click', function(e) {
		e.preventDefault();
		
		var remotePost = { 'key': 'deactivate_stylelibrary' };
		essbAdvancedOptions.post('enable_option', remotePost, function(data) {
			$.toast({
				    heading: 'Styles library is deactivated. Settings screen will reload.',
				    showHideTransition: 'fade',
				    icon: 'success',
				    position: 'bottom-right',
				    hideAfter: 5000
			});
			var reload = essb_advancedopts_reloadurl,
				section = $('#section').val(),
				subsection = $('#subsection').val();

			window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');
		});
	});
	
	$('.ao-new-sharecustom-button').on('click', function(e){
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';
		essbAdvancedOptions.show('manage-buttons', true, title, false, { 'network': network });

	});
	
	$('.ao-new-followcustom-button').on('click', function(e){
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';
		essbAdvancedOptions.show('manage-follow-buttons', true, title, false, { 'network': network });

	});
	
	//ao-import-followcustom-button
	$('.ao-import-followcustom-button').on('click', function(e){
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';
		essbAdvancedOptions.show('export-follow-buttons', false, title, true, { 'network': network, 'network_mode': 'import' }, 500);

	});
	$('.ao-export-followcustom-button').on('click', function(e){
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';
		essbAdvancedOptions.show('export-follow-buttons', false, title, true, { 'network': network, 'network_mode': 'export' }, 500);

	});
	
	$('.ao-export-sharecustom-button').on('click', function(e){
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';
		essbAdvancedOptions.show('export-share-buttons', false, title, true, { 'network': network, 'network_mode': 'export' }, 500);

	});
	
	$('.ao-import-sharecustom-button').on('click', function(e){
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';
		essbAdvancedOptions.show('export-share-buttons', false, title, true, { 'network': network, 'network_mode': 'import' }, 500);

	});

	$('.ao-remove-sharecustom-button').on('click', function(e) {
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';

		swal({ title: "Are you sure?",
			  text: "Once deleted, you will not be able to recover this button!",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeCustomButton(network);
			  }
			});

	});
	
	$('.ao-remove-followcustom-button').on('click', function(e) {
		e.preventDefault();

		var network = $(this).data('network') || '',
			title = $(this).data('title') || '';

		swal({ title: "Are you sure?",
			  text: "Once deleted, you will not be able to recover this button!",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeCustomFollowButton(network);
			  }
			});

	});
	
	$('.ao-deleteall-followcustom-button').on('click', function(e) {
		e.preventDefault();

		var title = $(this).data('title') || '';

		swal({ title: "Are you sure?",
			  text: "You are about to delete all custom profile networks. This action can't be undone and the only way to recover a network is to create it again.",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeAllCustomFollowButtons();
			  }
			});

	});
	
	$('.ao-deleteall-sharecustom-button').on('click', function(e) {
		e.preventDefault();

		var title = $(this).data('title') || '';

		swal({ title: "Are you sure?",
			  text: "You are about to delete all custom profile networks. This action can't be undone and the only way to recover a network is to create it again.",
			  icon: "warning",
			  buttons: true,
			  dangerMode: true,
			}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.removeAllCustomShareButtons();
			  }
			});

	});	
	
	$('.ao-clear-conversion-data-subscribe').on('click', function(e) {
		e.preventDefault();
		swal( { 
			title: "Confirm clearing data",		
			text: "Please confirm that you wish to clear all the conversion data. Once the process is completed you won't be able to recover it back.",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.clearSubscribeConversions();
			  }
		});
	});
	
	$('.ao-clear-conversion-data-share').on('click', function(e) {
		e.preventDefault();
		swal( { 
			title: "Confirm clearing data",		
			text: "Please confirm that you wish to clear all the conversion data. Once the process is completed you won't be able to recover it back.",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			  if (willDelete) {
				essbAdvancedOptions.clearShareConversions();
			  }
		});
	});

	/**
	 * Boarding widget functions and events
	 */
	
	var essbBoardingUpdateButtonState = function() {
		var totalSteps = $('.essb-customer-boarding').data('steps') || '',
			activeStep = $('.essb-customer-boarding .boarding-card.active').data('tab') || '';
		
		if (Number(activeStep || 0) < 2) $('.essb-customer-boarding .boarding-back').hide();
		else $('.essb-customer-boarding .boarding-back').show();
		
		if (Number(activeStep) == Number(totalSteps))
			$('.essb-customer-boarding .boarding-next').text('Close');
		else
			$('.essb-customer-boarding .boarding-next').text('Next');
		
		$('.essb-customer-boarding .boarding-card.active .lazyloading').each(function() {
			$(this).removeClass('lazyloading');
			$(this).attr('src', $(this).data('src') || '');		
			$('.essb-customer-boarding .boarding-card.active .content').addClass('scrollable');
		});
		
		$('.essb-customer-boarding .boarding-card.active .lightbox-zoom').each(function() {
			$(this).css({'cursor': 'pointer'});
			$(this).attr('title', 'Click on image to zoom at full screen');
			$(this).on('click', function(e) {
				e.preventDefault();
				$('.essb-boarding-modal #img01').attr('src', $(this).attr('src') || '');
				$('.essb-boarding-modal').show();
			});
		});
	}
	
	var essbBoardingCorrectHeight = function() {
		var height = $('.essb-customer-boarding .boarding-card.active .content').height();
		if (height > 300) {
			$('.essb-customer-boarding .boarding-card.active .content').addClass('scrollable');
		}
	}
	
	$('.essb-control-btn-onboarding1').on('click', function(e) {
		e.preventDefault();
		
		$('.essb-customer-boarding').fadeIn();
		$('body').addClass('essb-boarding-open');
		
		$('.essb-customer-boarding .boarding-card').removeClass('active');
		$('.essb-customer-boarding .boarding-card.boarding-1').addClass('active');
		
		essbBoardingUpdateButtonState();
		essbBoardingCorrectHeight();
	});
	
	$('.essb-customer-boarding .boarding-close').on('click', function(e) {
		e.preventDefault();
		
		$('.essb-customer-boarding').fadeOut();
		$('body').removeClass('essb-boarding-open');
	});
	
	$('.essb-customer-boarding .boarding-progress').on('click', function(e) {
		var totalSteps = $('.essb-customer-boarding').data('steps') || '',
			activeStep = $('.essb-customer-boarding .boarding-card.active').data('tab') || '',
			isNext = $(this).hasClass('boarding-next');
		
		e.preventDefault();
		
		if (Number(activeStep) == Number(totalSteps) && isNext) {
			$('.essb-customer-boarding .boarding-close').trigger('click');
			return;
		}
		
		$('.essb-customer-boarding .boarding-card').removeClass('active');
		activeStep = isNext ? Number(activeStep) + 1 : Number(activeStep) - 1;
		if (activeStep < 1) activeStep = 1;
					
		var nextStepHasRedirect = $('.essb-customer-boarding .boarding-card.boarding-' + activeStep.toString()).data('url') || '';
		
		if (nextStepHasRedirect == '') {
			$('.essb-customer-boarding .boarding-card.boarding-' + activeStep.toString()).addClass('active');
			essbBoardingCorrectHeight();
			essbBoardingUpdateButtonState();
		}
		else {
			if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeIn(100);
			window.location.href = nextStepHasRedirect;
		}
	});
	
	$('.essb-boarding-modal .close').on('click', function(e) {
		e.preventDefault();
		$('.essb-boarding-modal').fadeOut();
	});
	
	$('.essb-boarding-modal').on('click', function(e) {
		e.preventDefault();
		$('.essb-boarding-modal').fadeOut();
	});
	
	$('.essb-customer-boarding .ao-boarding-optimize-nocache').on('click', function(e) {
		e.preventDefault();

		$('#essb-container-optimization input, #essb-container-optimization select').each(function() {
			var type = $(this).attr('type') || '';
			
			if (type == 'checkbox') $(this).attr('checked', false);
			else $(this).val('');
		});
		
		$('#essb_field_use_minified_css').attr('checked', true);
		$('#essb_field_use_minified_js').attr('checked', true);
		$('#essb_field_precompiled_resources').attr('checked', true);
		$('#essb_options_precompiled_folder').val('uploads');
		$('#essb_field_precompiled_unique').attr('checked', true);
		$('#essb_field_precompiled_post').attr('checked', true);
		$('#essb_field_load_js_async').attr('checked', true);
		
		if ($('.essb-control-btn-save').length) $('.essb-control-btn-save').trigger('click');
	});
	
	$('.essb-customer-boarding .ao-boarding-optimize-cache').on('click', function(e) {
		e.preventDefault();
		
		$('#essb-container-optimization input, #essb-container-optimization select').each(function() {
			var type = $(this).attr('type') || '';
			
			if (type == 'checkbox') $(this).attr('checked', false);
			else $(this).val('');
		});
		
		$('#essb_field_use_minified_css').attr('checked', true);
		$('#essb_field_use_minified_js').attr('checked', true);
		$('#essb_field_load_js_async').attr('checked', true);
		if ($('.essb-control-btn-save').length) $('.essb-control-btn-save').trigger('click');
	});
	
	$('.essb-customer-boarding .ao-gethelp-btn').on('click', function(e) {
		e.preventDefault();
		
		window.open($(this).attr('href') || '');
	});
	
	/**
	 * Automations launch
	 */
	$('.ao-automation-action').on('click', function(e) {
		e.preventDefault();
		
		let component = $(this).data('automation') || '';
		if (component != '') {
			let remotePost = { 'automation': component };			
			essbAdvancedOptions.post('enable_automation', remotePost, function(data) {
				
				if (!essb_advancedopts_reloadurl) return;
				
				if ($('#advancedoptions-preloader').length) $('#advancedoptions-preloader').fadeIn(100);
				var reload = essb_advancedopts_reloadurl,
					section = $('#section').val(),
					subsection = $('#subsection').val();

				window.location.href = reload + (section != '' ? '&section='+section : '') + (subsection != '' ? '&subsection='+subsection : '');			
			});
		}
	});
	
	// Export custom positions
	
	$('#essb-advanced-export-custompositions').on('click', function(e) {
		e.preventDefault();
		
		essbAdvancedOptions.read('export_custom_positions', {}, function (data) {
			$('#essb-exporting-custompositions-area').val(data);
			$('#essb-exporting-custompositions-area').focus();
			$('#essb-exporting-custompositions-area').select();
		});
	});
	
	$('#essb-advanced-import-custompositions').on('click', function(e) {
		e.preventDefault();
		
		var value = $('#essb-importing-custompositions-area').val(),
			valueObj = {};
		
		if (value == '') {
        	$.toast({
			    heading: 'There is no content for import',
			    showHideTransition: 'fade',
			    icon: 'error',
			    position: 'bottom-right',
			    hideAfter: 2000
			});
        	return;
		}
		
		try {
			valueObj = JSON.parse(value || '{}');
		}
		catch (e) {
			valueObj = {};
		}
		
		if (Object.keys(valueObj).length == 0) {
        	$.toast({
			    heading: 'There is no content for import',
			    showHideTransition: 'fade',
			    icon: 'error',
			    position: 'bottom-right',
			    hideAfter: 2000
			});
        	return;
		}
		
		var remotePost = { 'data': value };

		essbAdvancedOptions.post('import_custom_positions', remotePost, function(data) {
			$.toast({
			    heading: 'Custom positions are imported',
			    showHideTransition: 'fade',
			    icon: 'success',
			    position: 'bottom-right',
			    hideAfter: 5000
			});
		});
				
	});
	
	/**
	 * Boarding Automatic Launch Detection
	 */
	
	var essbBoardingReopen = function() {
		try {
			var urlParams = new URLSearchParams(window.location.search);
			var boarding = urlParams.get('boarding');
			if (boarding && boarding != '') {
				$('.essb-customer-boarding').fadeIn();
				$('body').addClass('essb-boarding-open');
				
				$('.essb-customer-boarding .boarding-card').removeClass('active');
				$('.essb-customer-boarding .boarding-card.boarding-' + boarding).addClass('active');
				
				essbBoardingUpdateButtonState();
				essbBoardingCorrectHeight();
			}
		}
		catch (e) {
			
		}
	}
	
	setTimeout(essbBoardingReopen, 100);
	
	/**
	 * Help Beacon
	 */
	
	if ($('.ao-helpbeacon').length) {
		let winWidth = $(window).width();
		
		// Running only on a different than a mobile device
		if (winWidth > 1024) {		
			$(window).resize(function() {
				aoHelpBeaconUpdate();
			});
			
			let aoHelpBeaconUpdate = function() {
				let maxHeight = $(window).height(), panelHeight = 600;
				
				if (maxHeight < 700) panelHeight = maxHeight - 120;
				if (panelHeight > 600) panelHeight = 600;
				
				$('.ao-helpbeacon-frame ').css( {'maxHeight': panelHeight + 'px'});
			}
			
			let aoHelpBeaconLoadURL = window.aoHelpBeaconLoadURL = function(url) {
				$('.ao-helpbeacon-frame iframe').attr('src', url);
				
				if ($('.ao-helpbeacon-frame .support').hasClass('active')) {
					$('.ao-helpbeacon-frame iframe').show();
					$('.ao-helpbeacon-frame .support').hide();
					$('.ao-helpbeacon-frame .support').removeClass('active');
				}
			};
			
			let aoHelpBeaconOpen = window.aoHelpBeaconOpen = function(url) {
				$('.ao-helpbeacon').addClass('opened');
				$('.ao-helpbeacon .icon-help').addClass('help-button--close');
				$('.ao-helpbeacon .icon-help').removeClass('help-button--open');

				$('.ao-helpbeacon .icon-close').removeClass('help-button--close');
				$('.ao-helpbeacon .icon-close').addClass('help-button--open');
				
				if ($('.ao-helpbeacon-frame .support').hasClass('active')) {
					$('.ao-helpbeacon-frame iframe').show();
					$('.ao-helpbeacon-frame .support').hide();
					$('.ao-helpbeacon-frame .support').removeClass('active');
				}
				
				let blankURL = false;
				if (!url || url == '') {
					url = 'https://docs.socialsharingplugin.com/how-can-we-help-mobile/';
				}
				
				if (!$('.ao-helpbeacon-frame').length) {
					$('body').append('<div class="ao-helpbeacon-frame ao-helpbeacon-frame--opened"><div class="header"><div class="left col1-2"><a href="#" class="open-blank" title="Open in a new browser window"><i class="fa fa-external-link"></i> Open</a><a href="https://my.socialsharingplugin.com" target="_blank" class="open-support" title="Get Support"><i class="fa fa-comment-o"></i> Support</a></div><div class="col1-2 right"><a href="https://docs.socialsharingplugin.com" target="_blank" class="open-docs" title="Browse documentation"><i class="fa fa-sticky-note-o"></i> Documentation</a></div></div><iframe class="" src="'+url+'"></iframe><div class="support"></div></div>')
					
					$('.ao-helpbeacon-frame .open-blank').on('click', function(e) {
						e.preventDefault();
						
						if ($('.ao-helpbeacon-frame .support').hasClass('active')) {
							$('.ao-helpbeacon-frame iframe').show();
							$('.ao-helpbeacon-frame .support').hide();
							$('.ao-helpbeacon-frame .support').removeClass('active');
						}
						else {
							let url = $('.ao-helpbeacon-frame iframe').attr('src') || '';
							if (url != '') window.open(url);
						}
					});
					
					$('.ao-helpbeacon-frame .open-support').on('click', function(e) {
						/*e.preventDefault();
						
						$('.ao-helpbeacon-frame iframe').hide();
						$('.ao-helpbeacon-frame .support').show();
						$('.ao-helpbeacon-frame .support').addClass('active');
						$('.ao-helpbeacon-frame .support').html($('.ao-help-holder').html());
						
						$('.ao-helpbeacon-frame .support .support-inline').css({'width': ($('.ao-helpbeacon-frame .support').width() - 60) + 'px'});*/
					});
				}
				else {
					if ($('.ao-helpbeacon-frame').length) $('.ao-helpbeacon-frame').addClass('ao-helpbeacon-frame--opened');
					$('.ao-helpbeacon-frame iframe').attr('src', url);
				}
				
				aoHelpBeaconUpdate();
			};
			
			let aoHelpBeaconAvailable = window.aoHelpBeaconAvailable = function() {
				return $('.ao-helpbeacon').length ? true : false;
			};
			
			let aoHelpBeaconDispatch = window.aoHelpBeaconDispatch = function(url) {
				let beaconRunning = $('.ao-helpbeacon').hasClass('opened');
				
				if (!beaconRunning) aoHelpBeaconOpen(url);
				else aoHelpBeaconLoadURL(url);
			};
			
			setTimeout(function() {
				$('.ao-helpbeacon').show();
				$('.ao-helpbeacon').css({ 'opacity': '1'});
			}, 1000);
			
			$('.ao-helpbeacon').on('click', function(e) {
				e.preventDefault();
				
				let isRunning = $(this).hasClass('opened');
				
				if (isRunning) {
					$(this).removeClass('opened');
					$('.ao-helpbeacon .icon-help').removeClass('help-button--close');
					$('.ao-helpbeacon .icon-help').addClass('help-button--open');
	
					$('.ao-helpbeacon .icon-close').addClass('help-button--close');
					$('.ao-helpbeacon .icon-close').removeClass('help-button--open');
					
					if ($('.ao-helpbeacon-frame').length) $('.ao-helpbeacon-frame').removeClass('ao-helpbeacon-frame--opened');
				}
				else {
					aoHelpBeaconOpen();
				}
			});
			
			$('.help-hint a.ao-internal-help-hint').each(function() {
				$(this).on('click', function(e) {
					e.preventDefault();
					
					let url = $(this).attr('href') || '';
					if (url != '') {
						let beaconRunning = $('.ao-helpbeacon').hasClass('opened');
						
						if (!beaconRunning) aoHelpBeaconOpen(url);
						else aoHelpBeaconLoadURL(url);
					}
				});
			});
			
			$('.essb-help-hint a').each(function() {
				$(this).on('click', function(e) {
					e.preventDefault();
					
					let url = $(this).attr('href') || '';
					if (url != '') {
						let beaconRunning = $('.ao-helpbeacon').hasClass('opened');
						
						if (!beaconRunning) aoHelpBeaconOpen(url);
						else aoHelpBeaconLoadURL(url);
					}
				});
			});
			
			$('.essb-options-helprow .help-details .buttons .single-button a').each(function() {
				$(this).on('click', function(e) {
					e.preventDefault();
					
					let url = $(this).attr('href') || '';
					if (url != '') {
						let beaconRunning = $('.ao-helpbeacon').hasClass('opened');
						
						if (!beaconRunning) aoHelpBeaconOpen(url);
						else aoHelpBeaconLoadURL(url);
					}
				});
			});
			
			$('.essb-control-btn-help1').on('click', function(e) {
				e.preventDefault();
				
				let beaconRunning = $('.ao-helpbeacon').hasClass('opened');
				if (!beaconRunning) aoHelpBeaconOpen();
				
				$('.ao-helpbeacon-frame .open-support').trigger('click');
			});
			
			$('.essb-inner-menu .inner-help').each(function() {
				$(this).on('click', function(e) {
					e.preventDefault();
					
					let url = $(this).attr('href') || '';
					if (url != '') {
						let beaconRunning = $('.ao-helpbeacon').hasClass('opened');
						
						if (!beaconRunning) aoHelpBeaconOpen(url);
						else aoHelpBeaconLoadURL(url);
					}
				});
			});
			
			
			
		}
	}
	
});
