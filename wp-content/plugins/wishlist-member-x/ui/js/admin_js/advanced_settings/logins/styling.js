jQuery(function($) {
	$('body').off('.wlm3loginstyling');
	$(window).off('.wlm3loginstyling');

	// for toggles that have .auto-save
	$('body').on('change.wlm3loginstyling', '.auto-save', function() {
		$(this).closest('.row').save_settings({
			data : {
				WishListMemberAction : 'save',
				action : 'admin_actions'
			},
			on_success: function( obj, result ) {
				if('login_styling_enable_custom_template' in result.data) {
					$('.custom-styling-status').toggleClass('d-none');
				}
				$( '.wlm-message-holder' ).show_message( { message : result.msg, type : result.msg_type} );
			}
		});
	});

	$('body').on('click.wlm3loginstyling', '#save-custom-login-styling-btn', function() {
		var $btn = $(this);

		$btn.disable_button({icon: 'update'});
		// make sure we save whatever is in codemirror
		if(wlm3_cm_editor_login_custom_css) {
			wlm3_cm_editor_login_custom_css.save();
		}

		// triggger template selection change event to update the hidden textarea with the css code
		$('[name="login_styling_custom_template"]').change();

		$('#custom-login-styling-save-area').save_settings({
			data : {
				WishListMemberAction : 'save',
				action : 'admin_actions'
			},
			on_success: function( obj, result ) {
				$('.template-choices').removeClass('active-template');
				$('.template-choices.chosen-template').addClass('active-template');

				// set active template name
				$('#active-template').text($('.template-choices.active-template img').data('name'));

				$( '.wlm-message-holder' ).show_message( { message : result.msg, type : result.msg_type} );
			},
			on_done: function() {
				$btn.disable_button({disable: false, icon: 'save'});
			}
		});
	});

	// begin: css.php
	// reset to default
	$('.btn.reset-css-btn').do_confirm({confirm_message : wp.i18n.__( 'Reset Custom CSS to Default?', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", function(e) {
		// update codemirror with the new value
		wlm3_cm_editor_login_custom_css.setValue(WLM3VARS.custom_login_form_custom_css);

		// save by mimicking click on save button
		$('#save-custom-login-styling-btn').click();
	} );
	// end: css.php

	// begin: template.php
	// template selection
	$('body').on('change.wlm3loginstyling', '[name="login_styling_custom_template"]', function() {
		$select = $(this);
		$img = $('#login_styling_custom_template_screenshot');
		var screenshot = $select.val() ? $select.val() : 'default';
		screenshot += '.png';
		$img.attr('src', $img.data('base') + screenshot);
	});

	$('body').on('click.wlm3loginstyling', '.template-choices', function() {
		$('.template-choices').removeClass('chosen-template');
		$(this).addClass('chosen-template');
		$('[name="login_styling_custom_template"]').val($(this).data('template-name'));
	});

	// reset to default
	$('#save-and-reset-custom-login-styling-btn').do_confirm({confirm_message : wp.i18n.__( 'Switching templates will reset customizations to default. Continue?', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", function(e) {
		$('#loginform.tab-pane :input:not([name="login_styling_custom_logo"])').val('').change();
		$('#background.tab-pane :input').val('').change();
		$(':input.wlm3colorpicker').minicolors('value', '');
		// save by mimicking click on save button
		$('#save-custom-login-styling-btn').click();
	} );

	// set max-height of template list to make sure that the save button is always above the fold
	$(window).on('resize.wlm3loginstyling', function() {
		var h = $('#template-list').offset().top + $('.panel-footer').height() + 40;
		$('#template-list').css('max-height', 'calc(100vh - ' + h + 'px)');
	}).trigger('resize.wlm3loginstyling');
	// end: template.php

	// begin: background.php
	// update height and width of logo on change
	// reset to default
	$('.btn.reset-background-btn').do_confirm({confirm_message : wp.i18n.__( 'Reset Background to Default?', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", function(e) {
		$('#background.tab-pane :input').val('').change();
		$('#background.tab-pane :input.wlm3colorpicker').minicolors('value', '');
		// save by mimicking click on save button
		$('#save-custom-login-styling-btn').click();
	} );
	// end: background.php

	// begin: loginform.php
	// update height and width of logo on change
	$('body').on('change.wlm3loginstyling', '[name="login_styling_custom_logo"]', function() {
		$('[name="login_styling_custom_logo_height"]').val($(this).data('height'));
		$('[name="login_styling_custom_logo_width"]').val($(this).data('width'));
	});
	// reset to default
	$('.btn.reset-loginform-btn').do_confirm({confirm_message : wp.i18n.__( 'Reset Login Form to Default?', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", function(e) {
		// we might need to move this value somewhere else but here it is for now
		$('#loginform.tab-pane :input').val('').change();
		$('#loginform.tab-pane :input.wlm3colorpicker').minicolors('value', '');
		// save by mimicking click on save button
		$('#save-custom-login-styling-btn').click();
	} );
	// end: loginform.php
	
	$('body').on('click', '#custom-login-styling-nav-tabs a[data-toggle="tab"]', function() {
		$('.chosen-template').removeClass('chosen-template');
		$('.active-template').addClass('chosen-template');
	});
	$('body').on('shown.bs.tab', '#custom-login-styling-nav-tabs a[data-toggle="tab"]', function() {
		$('#custom-styling-section').attr('class', function(i, c) {
			return c.replace(/\bshowing-.+?-tab\b/, '');
		});
		$('#custom-styling-section').addClass('showing-' + this.hash.replace(/#/, '') + '-tab');
	});

	// set active template name and show it
	$('#active-template').text($('.template-choices.active-template img').data('name')).closest('div').removeClass('d-none');

	if(location.hash) {
		$('[href="' + location.hash + '"]').click();
	}
});
