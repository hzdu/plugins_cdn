WLM3ThirdPartyIntegration.fluentcrm.fxn = {
	/**
	 * check if fluentcrm plugin exists
	 */
	check_plugin: function() {
		var c = $('#thirdparty-provider-container-fluentcrm');
		c.find('.plugin-status').html('<div class="text-warning"><p><em>Checking FluentCRM Platform plugin...</em></p></div>');
		$.post(
			WLM3VARS.ajaxurl, {
				action: 'wlm3_fluentcrm_check_plugin',
			},
			function(result) {
				if (result.status) {
					c.removeClass('api-fail');
					c.find('.plugin-status').html('<div class="text-success"><p>' + result.message + '</p></div>');

					WLM3ThirdPartyIntegration.fluentcrm.lists = result.lists;
					WLM3ThirdPartyIntegration.fluentcrm.tags = result.tags;
					WLM3ThirdPartyIntegration.fluentcrm.fxn.prep_options();
					c.find('.plugin-status').hide();
				} else {
					c.addClass('api-fail');
					c.find('.plugin-status').html('<div class="text-danger"><p>' + result.message + '</p></div>');
				}
			},
			'json'
		);
	},
	/**
	 * prepare dropdown options
	 */
	prep_options: function() {
		var lists = WLM3ThirdPartyIntegration.fluentcrm.lists;
		var tags = WLM3ThirdPartyIntegration.fluentcrm.tags;
		var levels = all_levels.__levels__ ? all_levels.__levels__ : [];

		WLM3ThirdPartyIntegration.fluentcrm.tags_options = '';
		$.each(tags, function(index, tag) {
			WLM3ThirdPartyIntegration.fluentcrm.tags_options += '<option value="' + index + '">' + tag + '</option>';
		});

		WLM3ThirdPartyIntegration.fluentcrm.lists_options = '';
		$.each(lists, function(index, list) {
			WLM3ThirdPartyIntegration.fluentcrm.lists_options += '<option value="' + index + '">' + list + '</option>';
		});

		WLM3ThirdPartyIntegration.fluentcrm.levels_options = '';
		$.each(levels, function(index, lvl) {
			WLM3ThirdPartyIntegration.fluentcrm.levels_options += '<option value="' + index + '">' + lvl.name + '</option>';
		});
	},
	/**
	 * Set dropdown options
	 * @param  object t DOM object
	 */
	set_options: function(t) {
		var selects_tags = $(t).find('select.fluentcrm-tags-select');
		selects_tags.html(WLM3ThirdPartyIntegration.fluentcrm.tags_options);

		var selects_types = $(t).find('select.fluentcrm-lists-select');
		selects_types.html(WLM3ThirdPartyIntegration.fluentcrm.lists_options);

		var selects_levels = $(t).find('select.fluentcrm-levels-select');
		selects_levels.html(WLM3ThirdPartyIntegration.fluentcrm.levels_options);

		$(t).set_form_data(WLM3ThirdPartyIntegration.fluentcrm);

		selects_tags.select2({theme: 'bootstrap' });
		selects_types.select2({theme: 'bootstrap' });
		selects_levels.select2({theme: 'bootstrap' });

		var selects = $(t).find('.fluentcrm-levels-select-ppp');
		selects.empty();
		$.each(all_levels, function(index, lvls) {
			if (index != '__levels__') {
				$.each(lvls, function(index, lvl) {
						selects.append($('<option />', {
							value: lvl.ID,
							text: lvl.name
						}));
				});
			}
		});

		$(t).find('select.fluentcrm-levels-select-ppp').select2({
			ajax: {
				url: WLM3VARS.ajaxurl,
				dataType: 'json',
				delay: 500,
				type: 'POST',
				data: function(params) {
					return {
						search: params.term || '',
						page: params.page || 0,
						page_limit: 16,
						action: 'admin_actions',
						WishListMemberAction: 'payperpost_search',
					};
				},
				processResults: function(data) {
					var arr = []
					$.each(data.posts, function(index, value) {
						arr.push({
							id: value.ID,
							text: value.post_title
						})
					})
					var more = (data.page * data.page_limit) < data.total;
					return {
						results: arr,
						pagination: {
							more: more
						}
					};
				},
				cache: true
			},
			minimumInputLength: 1,
			placeholder: wp.i18n.__( 'Search for Pay Per Post Content', 'wishlist-member' ),
			theme: 'bootstrap',
		});
	},
	/**
	 * set all event handlers
	 */
	set_event_handlers: function() {
		this.tag_action_events();
	},
	/**
	 * set events for tag actions
	 */
  tag_action_events: function() {
		var t = $('#fluentcrm-tag-table');

    // tag action delete button
		$(t).find('.popover.-confirm-popover').remove();
    $(t).find('.-del-tag-btn').removeClass('do-confirm-set');
    $(t).find('.-del-tag-btn').do_confirm({
      confirm_message: wp.i18n.__( 'Delete tag action?', 'wishlist-member' ),
      yes_button: wp.i18n.__( 'Delete', 'wishlist-member' )
    }).on('yes.do_confirm', {
      that: this
    }, (e) => {
			var tag_id = $(e.target).data('tag-id');
			$.post(
				WLM3VARS.ajaxurl,
				{
					action: 'wishlistmember_fluentcrm_delete_tag_action',
					tag_id: tag_id
				},
				(r) => {
					if(r.success) {
						delete WLM3ThirdPartyIntegration.fluentcrm.fluentcrm_settings.tag[tag_id];
						fluentcrm_load_tags_table();
					} else {
						$('.wlm-message-holder').show_message({
	            type: 'error',
	            message: wp.i18n.__( 'An error occured trying to delete the action.', 'wishlist-member' )
	          });
					}
				}
			);
		} );
		
		// turn off events for our namespace to prevent duplicate event handlers from being set
		$('body').off('.fluentcrm-tag-events');
		
		/**
		 * show actions on tag select change
		 * @param  object e Event object
		 */
		$('body').on('change.fluentcrm-tag-events', '#fluentcrm-tag-id-select', (e) => {
			$('#fluentcrm-tag-actions').show();
			$('#fluentcrm-tag-modal').data('tag-id', $(e.target).val());
		} );
		
		/**
		 * populate fields and set values on show of tag action modal
		 * @param  object e Event object
		 */
		$('body').on('show.bs.modal.fluentcrm-tag-events', (e) => {
			if( !e.target.id.match( /^fluentcrm/ ) ) {
				return;
			}
			if( $(e.target)[0].id == 'fluentcrm-tag-modal' ) {
				// populate tag action modal values
				this.set_options(e.target);
				var modal = $(e.target);
				var tag_id = $(e.relatedTarget).data('tag-id');
				modal.data('tag-id', tag_id);
				var is_new = tag_id == 'new';
				var tag_id_select = modal.find('#fluentcrm-tag-id-select').first();
				if(is_new) {
					tag_id_select.find('option').each((x,o) => {
						try {
							if(o.value in WLM3ThirdPartyIntegration.fluentcrm.fluentcrm_settings.tag) {
								$(o).remove();
							}
						} catch(e) {}
					});
				}
				tag_id_select.val(tag_id).prop('disabled', !is_new).trigger('change');
				if(!tag_id_select.val()) {
					$('#fluentcrm-tag-actions').hide();
				}
				this.set_tag_action_values();
			} else {
				// other modals
				this.set_options(e.target);
			}
		} );
	},
	
	/**
	 * set values for fields inside of tag action modal
	 */
	set_tag_action_values: function() {
		try {
			$('#fluentcrm-tag-actions').set_form_data(WLM3ThirdPartyIntegration.fluentcrm.fluentcrm_settings.tag[$('#fluentcrm-tag-modal').data('tag-id')]);
		} catch(e) {}
	}
	
}

/**
 * run stuff before the integration screen is opened
 * @param object obj integration screen DOM object
 */
integration_before_open['fluentcrm'] = (obj) => {
	WLM3ThirdPartyIntegration.fluentcrm.fxn.check_plugin();
	$(obj).addClass('api-fail');
	$(obj).transformers();
}

/**
 * run stuff after the integration screen is opened
 * @param object obj integration screen DOM object
 */
integration_after_open['fluentcrm'] = (obj) => {
	WLM3ThirdPartyIntegration.fluentcrm.fxn.check_plugin();
	WLM3ThirdPartyIntegration.fluentcrm.fxn.set_event_handlers();
}

/**
 * run stuff when an integration modal is saved
 * @param object obj modal DOM object
 */
integration_modal_save['fluentcrm'] = (obj) => {
	// tag actions modal
	if(obj[0].id == 'fluentcrm-tag-modal') {
		fluentcrm_load_tags_table(); // reload table
		WLM3ThirdPartyIntegration.fluentcrm.fxn.set_tag_action_values(); // reload modal values
		$('#fluentcrm-tag-id-select').prop('disabled', true).trigger('change'); // disable the tag dropdown
	}
}