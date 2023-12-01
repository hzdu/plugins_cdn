WLM3ThirdPartyIntegration.convertkit.fxn = {
	test_keys: function(x) {
		var c = $('#thirdparty-provider-container-convertkit');
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if (x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl, {
				action: 'wlm3_convertkit_test_keys',
				data: x
			},
			function(result) {
				var msg;
				if (result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'ConvertKit') + '</p></div>');
					WLM3ThirdPartyIntegration.convertkit.tags = result.tags;
					WLM3ThirdPartyIntegration.convertkit.lists = result.lists;

					WLM3ThirdPartyIntegration.convertkit.fxn.set_list_options();
					WLM3ThirdPartyIntegration.convertkit.fxn.load_tags_table();

				} else {
					c.addClass('api-fail');
					var msg = x.ckapi.trim() ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
					c.find('.api-status').html('<div class="text-danger"><p>' + msg + '</p></div>');
				}
				if (x.save) {
					b.text(b.data('saved'));
				}
				b.removeClass('disabled');
			},
			'json'
		);
	},
	get_keys: function(obj) {
		var x = {};
		obj.find('.-integration-keys :input').each(function(i, v) {
			x[v.name] = v.value;
		});
		return x;
	},
	set_list_options: function() {
		var $me = $('#thirdparty-provider-container-convertkit');

		// set list dropdown options
		var selects = $me.find('.convertkit-lists-select');
		selects.empty().append('<option/>');
		$.each(WLM3ThirdPartyIntegration.convertkit.lists, function(index, option) {
			selects.append($('<option />', option));
		});

		// set tags dropdown options
		var selects = $me.find('.convertkit-tags-select');
		selects.empty();
		$.each(WLM3ThirdPartyIntegration.convertkit.tags, function(index, option) {
			selects.append($('<option />', option));
		});

		// set level dropdown options
		var selects = $me.find('.convertkit-levels-select');
		selects.empty();
		$.each(all_levels.__levels__ ? all_levels.__levels__ : [], function(index, lvl) {
			selects.append($('<option />', {
				value: index,
				text: lvl.name
			}));
		});

		// set payperpost dropdown options
		var selected_ppps = [];
		$.each(WLM3ThirdPartyIntegration.convertkit.tag_actions, function(x, o) {
			selected_ppps = _.uniq(
				selected_ppps.concat(o.add.add_ppp).concat(o.add.remove_ppp).concat(o.remove.add_ppp).concat(o.remove.remove_ppp)
			);
		});
		var selects = $me.find('.convertkit-levels-select-ppp');
		selects.empty();
		$.each(all_levels, function(index, lvls) {
			if (index != '__levels__') {
				$.each(lvls, function(index, lvl) {
					if (selected_ppps.includes(lvl.ID)) {
						selects.append($('<option />', {
							value: lvl.ID,
							text: lvl.name
						}));
					}
				});
			}
		});

		// search for payperpost dropdown options
		$me.find('select.convertkit-levels-select-ppp').select2({
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

		// set form data
		$('#thirdparty-provider-container-convertkit').set_form_data(WLM3ThirdPartyIntegration.convertkit);
	},

	set_event_handlers: function() {
		this.tag_action_events();
	},

	tag_action_events: function() {
		var t = $('#convertkit-tag-table');

		// tag action delete button
		$(t).find('.popover.-confirm-popover').remove();
		$(t).find('.-del-tag-btn').removeClass('do-confirm-set');
		$(t).find('.-del-tag-btn').do_confirm({
			confirm_message: wp.i18n.__( 'Delete tag action?', 'wishlist-member' ),
			yes_button: wp.i18n.__( 'Delete', 'wishlist-member' )
		}).on('yes.do_confirm', {
			that: this
		}, (e) => {
			// set row opacity to 70%
			var tr = $(e.target).closest('tr');
			tr.css('opacity', 0.5);

			var tag_id = $(e.target).data('tag-id');
			$.post(
				WLM3VARS.ajaxurl, {
					action: 'wishlistmember_convertkit_delete_tag_action',
					tag_id: tag_id
				},
				(r) => {
					if (r.success) {
						delete WLM3ThirdPartyIntegration.convertkit.tag_actions[tag_id];
						WLM3ThirdPartyIntegration.convertkit.fxn.load_tags_table();
					} else {
						// restore row opacity
						tr.css('opacity', '');
						$('.wlm-message-holder').show_message({
							type: 'error',
							message: wp.i18n.__( 'An error occured trying to delete the action.', 'wishlist-member' )
						});
					}
				}
			);
		});

		// turn off events for our namespace to prevent duplicate event handlers from being set
		$('body').off('.convertkit-tag-events');

		/**
		 * show actions on tag select change
		 * @param  object e Event object
		 */
		$('body').on('change.convertkit-tag-events', '#convertkit-tag-id-select', (e) => {
			$('#convertkit-tag-actions').show();
			$('#convertkit-tag-modal').data('tag-id', $(e.target).val());
		});

		/**
		 * populate fields and set values on show of tag action modal
		 * @param  object e Event object
		 */
		$('body').on('show.bs.modal.convertkit-tag-events', (e) => {
			if (!e.target.id.match(/^convertkit/)) {
				return;
			}
			var modal = $(e.target);
			modal.find('.nav.nav-tabs').each(function() {
				$(this).find('li.nav-item:first a').trigger('click');
			});
			if ($(e.target)[0].id == 'convertkit-tag-modal') {
				// populate tag action modal values
				this.set_list_options();
				var tag_id = $(e.relatedTarget).data('tag-id');
				modal.data('tag-id', tag_id);
				var is_new = tag_id == 'new';
				var tag_id_select = modal.find('#convertkit-tag-id-select').first();
				if (is_new) {
					tag_id_select.find('option').each((x, o) => {
						try {
							if (o.value in WLM3ThirdPartyIntegration.convertkit.tag_actions) {
								$(o).remove();
							}
						} catch (e) {}
					});
				}
				tag_id_select.val(tag_id).prop('disabled', !is_new).trigger('change');
				if (!tag_id_select.val()) {
					$('#convertkit-tag-actions').hide();
				}
				this.set_tag_action_values();
			}
		});
	},

	/**
	 * Load the tag actions table
	 */
	load_tags_table: function() {
		var tmpl = _.template($('script#convertkit-tag-template').html(), {
			variable: 'data'
		});
		// Check if there are Tag IDs stored by WLM that has been deleted on ConvertKit's end.
		var tag_ids_check = Object.keys(WLM3ThirdPartyIntegration.convertkit.tag_actions);
		var tags_check = Object.keys(WLM3ThirdPartyIntegration.convertkit.tags);
		try {
			tag_ids_check.forEach(function(item,index){
				var tag_found = tags_check.includes(item);
				if ( ! tag_found ) {
					// If WLM tag is not found in ConvertKit's end, return the filtered array without the said tag. 
					tag_ids_check = tag_ids_check.filter(function(currentChar) { 
						return currentChar !== item;
					});
				}
			});
		} catch (e) {}
		var data = {
			tags: WLM3ThirdPartyIntegration.convertkit.tags,
			tag_ids: tag_ids_check || [],
			tag_settings: WLM3ThirdPartyIntegration.convertkit.tag_actions || [],
		}
		$('#convertkit-tag-table table tbody').empty().append(tmpl(data).trim());
		WLM3ThirdPartyIntegration.convertkit.fxn && WLM3ThirdPartyIntegration.convertkit.fxn.tag_action_events();
	},

	/**
	 * set values for fields inside of tag action modal
	 */
	set_tag_action_values: function() {
		try {
			$('#convertkit-tag-actions').set_form_data(WLM3ThirdPartyIntegration.convertkit.tag_actions[$('#convertkit-tag-modal').data('tag-id')]);
		} catch (e) {}
	}
}
integration_before_open['convertkit'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-convertkit');

	fxn.save_keys = function() {
		var x = $.extend({
			save: true
		}, WLM3ThirdPartyIntegration.convertkit.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.convertkit.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail');
}
integration_after_open['convertkit'] = (obj) => {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.convertkit.fxn.test_keys(
		WLM3ThirdPartyIntegration.convertkit.fxn.get_keys(obj)
	);

	// set event handlers
	WLM3ThirdPartyIntegration.convertkit.fxn.set_event_handlers();
}

/**
 * run stuff when an integration modal is saved
 * @param object obj modal DOM object
 */
integration_modal_save['convertkit'] = (obj) => {
	// tag actions modal
	if (obj[0].id == 'convertkit-tag-modal') {
		WLM3ThirdPartyIntegration.convertkit.fxn.load_tags_table(); // reload table
		WLM3ThirdPartyIntegration.convertkit.fxn.set_tag_action_values(); // reload modal values
		$('#convertkit-tag-id-select').prop('disabled', true).trigger('change'); // disable the tag dropdown
	}
}