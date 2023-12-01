WLM3ThirdPartyIntegration.buddyboss.fxn = {

	check_plugin : function() {
		var c = $('#thirdparty-provider-container-buddyboss');
		c.find('.plugin-status').html('<div class="text-warning"><p><em>Checking BuddyBoss Platform plugin...</em></p></div>');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_buddyboss_check_plugin',
			},
			function(result) {
				if ( result.status ) {
					c.removeClass('api-fail');
					c.find('.plugin-status').html('<div class="text-success"><p>' +result.message +'</p></div>');

					WLM3ThirdPartyIntegration.buddyboss.member_type = result.member_type;
					WLM3ThirdPartyIntegration.buddyboss.groups = result.groups;
					WLM3ThirdPartyIntegration.buddyboss.fxn.prep_options();
					c.find('.plugin-status').hide();
				} else {
					c.addClass('api-fail');
					c.find('.plugin-status').html('<div class="text-danger"><p>' + result.message + '</p></div>');
				}
			},
			'json'
		);
	},
	prep_options : function( t ) {
		var member_type = WLM3ThirdPartyIntegration.buddyboss.member_type;
		var groups = WLM3ThirdPartyIntegration.buddyboss.groups;
		var levels = all_levels.__levels__ ? all_levels.__levels__ : [];

		WLM3ThirdPartyIntegration.buddyboss.groups_options = '';
		$.each( groups, function(index, group) {
			WLM3ThirdPartyIntegration.buddyboss.groups_options += "<option value='" +index +"'>" +group +"</option>";
		});

		WLM3ThirdPartyIntegration.buddyboss.types_options = '';
		$.each( member_type, function(index, forum) {
			WLM3ThirdPartyIntegration.buddyboss.types_options += "<option value='" +index +"'>" +forum +"</option>";
		});

		WLM3ThirdPartyIntegration.buddyboss.levels_options = '';
		$.each( levels, function(index, lvl) {
			WLM3ThirdPartyIntegration.buddyboss.levels_options += "<option value='" +index +"'>" +lvl.name +"</option>";
		});
	},
	set_options : function( t ) {
		var selects_groups = $(t).find('select.buddyboss-groups-select');
		selects_groups.html(WLM3ThirdPartyIntegration.buddyboss.groups_options);

		var selects_types = $(t).find('select.buddyboss-types-select');
		selects_types.html(WLM3ThirdPartyIntegration.buddyboss.types_options);

		var selects_levels = $(t).find('select.buddyboss-levels-select');
		selects_levels.html(WLM3ThirdPartyIntegration.buddyboss.levels_options);

		$(t).find('.modal-buddyboss-actions').set_form_data(WLM3ThirdPartyIntegration.buddyboss);

		selects_groups.select2({theme:"bootstrap"});
		selects_types.select2({theme:"bootstrap"});
		selects_levels.select2({theme:"bootstrap"});
	}
}

integration_before_open['buddyboss'] = function(obj) {
	var $me = $('#thirdparty-provider-container-buddyboss');
	WLM3ThirdPartyIntegration.buddyboss.fxn.check_plugin();
	$me.addClass('api-fail');
	$me.transformers();
}

integration_after_open['buddyboss'] = function(obj) {
	WLM3ThirdPartyIntegration.buddyboss.fxn.check_plugin();
}

$('body').on('show.bs.modal', function(e) {
	try {
		WLM3ThirdPartyIntegration.buddyboss.fxn.set_options(e.target);
	} catch(e) {}
});