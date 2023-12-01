WLM3ThirdPartyIntegration.learndash.fxn = {
	/**
	 * Clears the enroll existing members checkboxes and hides it
	 */
	clear_enroll_existing_checkboxes : function() {
		$('#thirdparty-provider-container-learndash .add-checkboxes .form-check').remove();
		$('#thirdparty-provider-container-learndash .add-checkboxes').addClass('d-none');
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
	get_data : function() {
		var c = $('#thirdparty-provider-container-learndash');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_learndash_get_data',
			},
			function(result) {
				if ( result.status ) {
					WLM3ThirdPartyIntegration.learndash.courses = result.courses;
					WLM3ThirdPartyIntegration.learndash.groups = result.groups;
					WLM3ThirdPartyIntegration.learndash.fxn.prep_options();
					c.find('.plugin-status').hide();
				} else {
					c.addClass('api-fail');
					c.find('.plugin-status').html('<div class="text-danger"><p>' + result.message + '</p></div>');
					c.find('.plugin-status').show();
				}
			},
			'json'
		);
	},
	prep_options : function( t ) {
		var courses = WLM3ThirdPartyIntegration.learndash.courses;
		var groups = WLM3ThirdPartyIntegration.learndash.groups;
		var levels = all_levels.__levels__ ? all_levels.__levels__ : [];

		$.each( groups, function(index, group) {
			WLM3ThirdPartyIntegration.learndash.groups_options += "<option value='" +index +"'>" +group +"</option>";
		});

		$.each( courses, function(index, course) {
			WLM3ThirdPartyIntegration.learndash.courses_options += "<option value='" +index +"'>" +course +"</option>";
		});

		$.each( levels, function(index, lvl) {
			WLM3ThirdPartyIntegration.learndash.levels_options += "<option value='" +index +"'>" +lvl.name +"</option>";
		});
	},
	set_options : function( t ) {
		var selects_groups = $(t).find('select.learndash-groups-select');
		selects_groups.html(WLM3ThirdPartyIntegration.learndash.groups_options);

		var selects_courses = $(t).find('select.learndash-courses-select');
		selects_courses.html(WLM3ThirdPartyIntegration.learndash.courses_options);

		var selects_levels = $(t).find('select.learndash-levels-select');
		selects_levels.html(WLM3ThirdPartyIntegration.learndash.levels_options);

		$('.modal-learndash-actions').set_form_data(WLM3ThirdPartyIntegration.learndash);

		selects_groups.select2({theme:"bootstrap"});
		selects_courses.select2({theme:"bootstrap"});
		selects_levels.select2({theme:"bootstrap"});
	}
}

integration_before_open['learndash'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-learndash');
	WLM3ThirdPartyIntegration.learndash.fxn.get_data();
	
	// event handler for enroll existing members checkbox
	$('body').off('.enroll-existing-members');
	$('body').on('select2:select.enroll-existing-members', 'select.add.apply-course', (e) => WLM3ThirdPartyIntegration.learndash.fxn.enroll_existing_checkboxes(e));
	$('body').on('select2:unselect.enroll-existing-members', 'select.add.apply-course', (e) => WLM3ThirdPartyIntegration.learndash.fxn.enroll_existing_checkboxes(e));

	$me.transformers();
}

$('body').on('show.bs.modal', function(e) {
	try {
		WLM3ThirdPartyIntegration.learndash.fxn.set_options(e.target);
	} catch(e) {}
});

integration_modal_save['learndash'] = function() {
	// clear enroll existing members checkbox on save
	WLM3ThirdPartyIntegration.learndash.fxn.clear_enroll_existing_checkboxes();
}