WLM3ThirdPartyIntegration.wpcourseware.fxn = {
	/**
	 * Clears the enroll existing members checkboxes and hides it
	 */
	clear_enroll_existing_checkboxes : function() {
		$('#thirdparty-provider-container-wpcourseware .add-checkboxes .form-check').remove();
		$('#thirdparty-provider-container-wpcourseware .add-checkboxes').addClass('d-none');
	},
	/**
	 * Adds/removes checkboxes for newly selected items for Levels -> When Added -> Enroll in a Course
	 * Triggered by select2:select and select2:unselect
	 * @param  object e Event object
	 */
	enroll_existing_checkboxes : function(e) {
		var container = $(e.target).closest('.tab-pane').find('.add-checkboxes');
		var id = e.params.data.id
		if(e.type == 'select2:select') {
			var html = '<div class="form-check form-check-inline" id="add-checkboxes-container-' + id + '">';
		  html += '<input type="checkbox" name="enroll-existing-members[]" value="' + e.params.data.id + '" class="form-check-input" id="add-checkboxes-' + id + '">';
		  html += '<label class="form-check-label" for="add-checkboxes-' + id + '">' + e.params.data.text + '</label>';
		  html += '</div>';
			container.append(html);
			container.removeClass('d-none');
		} else {
			container.find('#add-checkboxes-container-' + e.params.data.id).remove();
			if(!container.find('.form-check').length) {
				container.addClass('d-none');
			}
		}
	},
	check_plugin : function() {
		var c = $('#thirdparty-provider-container-wpcourseware');
		c.find('.plugin-status').html('<div class="text-warning"><p><em>Checking WP Courseware plugin...</em></p></div>');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_wpcourseware_check_plugin',
			},
			function(result) {
				if ( result.status ) {
					c.removeClass('api-fail');
					c.find('.plugin-status').html('<div class="text-success"><p>' +result.message +'</p></div>');

					WLM3ThirdPartyIntegration.wpcourseware.courses = result.courses;
					WLM3ThirdPartyIntegration.wpcourseware.fxn.set_options();
					c.find('.plugin-status').hide();
				} else {
					c.addClass('api-fail');
					c.find('.plugin-status').html('<div class="text-danger"><p>' + result.message + '</p></div>');
				}
			},
			'json'
		);
	},
	set_options : function() {
		var courses = WLM3ThirdPartyIntegration.wpcourseware.courses;
		var levels = all_levels.__levels__ ? all_levels.__levels__ : [];

		var selects = $('select.wpcourseware-courses-select');
		selects.empty();
		$.each( courses, function(index, course) {
			selects.append($('<option/>', {value : index, text : course}));
		});

		var selects = $('select.wpcourseware-levels-select');
		selects.empty();
		$.each( levels, function(index, lvl) {
			selects.append($('<option/>', {value : index, text : lvl.name}));
		});

		$('.modal-wpcourseware-actions').set_form_data(WLM3ThirdPartyIntegration.wpcourseware);
	}
}

integration_before_open['wpcourseware'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-wpcourseware');

	fxn.save_keys = function(){
		WLM3ThirdPartyIntegration.wpcourseware.fxn.check_plugin();
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	// event handler for enroll existing members checkbox
	$('body').off('.enroll-existing-members');
	$('body').on('select2:select.enroll-existing-members', 'select.add.apply-course', (e) => WLM3ThirdPartyIntegration.wpcourseware.fxn.enroll_existing_checkboxes(e));
	$('body').on('select2:unselect.enroll-existing-members', 'select.add.apply-course', (e) => WLM3ThirdPartyIntegration.wpcourseware.fxn.enroll_existing_checkboxes(e));
	
	$me.addClass('api-fail');
	$me.transformers();
}

integration_after_open['wpcourseware'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	WLM3ThirdPartyIntegration.wpcourseware.fxn.check_plugin();
}

integration_modal_save['wpcourseware'] = function() {
	// clear enroll existing members checkbox on save
	WLM3ThirdPartyIntegration.wpcourseware.fxn.clear_enroll_existing_checkboxes();
}