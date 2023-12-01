WLM3ThirdPartyIntegration.activecampaign.fxn = {
	test_keys : function(x) {
		var c = $('#thirdparty-provider-container-activecampaign');
		c.find('.api-status').html('<div class="text-warning"><p><em>Checking...</em></p></div>');
		var b = c.find('.save-keys').first();
		if(x.save) {
			b.text(b.data('saving'));
		}
		b.addClass('disabled');
		$.post(
			WLM3VARS.ajaxurl, {
				action: 'wlm3_activecampaign_test_keys',
				data: x
			},
			function(result) {
				if(result.status) {
					c.removeClass('api-fail');
					c.find('.api-status').html('<div class="text-success"><p>' + get_integration_api_message(1, 'ActiveCampaign') + '</p></div>');
					WLM3ThirdPartyIntegration.activecampaign.lists = result.lists;
					WLM3ThirdPartyIntegration.activecampaign.tags = result.tags;
					WLM3ThirdPartyIntegration.activecampaign.fxn.load_lists();

					WLM3ThirdPartyIntegration.activecampaign.fxn.set_list_options();
					WLM3ThirdPartyIntegration.activecampaign.fxn.load_tags_table();
				} else {
					c.addClass('api-fail');
					var msg = (x.api_url.trim() && x.api_key.trim()) ? get_integration_api_message(2, result.message) : get_integration_api_message(3);
					c.find('.api-status').html('<div class="text-danger"><p>' + msg + '</p></div>');
				}
				if(x.save) {
					b.text(b.data('saved'));
				}
				b.removeClass('disabled');
			},
			'json'
		);
	},
	get_keys : function(obj) {
		var x = {};
		obj.find('.-integration-keys :input').each(function(i,v) {
			x[v.name] = v.value;
		});
		return x;
	},
	load_lists : function() {
		var $me = $('#thirdparty-provider-container-activecampaign');
		$('select.activecampaign-lists').select2({"data" : WLM3ThirdPartyIntegration.activecampaign.lists}, true);
		$me.set_form_data(WLM3ThirdPartyIntegration.activecampaign);
	},
	set_list_options: function() {
		var $me = $('#thirdparty-provider-container-activecampaign');

		// set list dropdown options
		var selects = $me.find('.activecampaign-lists-select');
		selects.empty();
		$.each(WLM3ThirdPartyIntegration.activecampaign.lists, function(index, option) {
			selects.append($('<option />', {
				value: index,
				text: option.name
			}));
		});

		// set tags dropdown options
		var selects = $me.find('.activecampaign-tags-select');
		selects.empty();
		$.each(WLM3ThirdPartyIntegration.activecampaign.tags, function(index, option) {
			selects.append($('<option />', {
				value: index,
				text: option.name
			}));
		});

		// set tags dropdown options
		var selects = $me.find('.activecampaign-tag-actions-select');
		selects.empty();
		$.each(WLM3ThirdPartyIntegration.activecampaign.tags, function(index, option) {
			selects.append($('<option />', option));
		});

		// set level dropdown options
		var selects = $me.find('.activecampaign-levels-select');
		selects.empty();
		$.each(all_levels.__levels__ ? all_levels.__levels__ : [], function(index, lvl) {
			selects.append($('<option />', {
				value: index,
				text: lvl.name
			}));
		});

		// set payperpost dropdown options
		var selected_ppps = [];
		$.each(WLM3ThirdPartyIntegration.activecampaign.tag_actions, function(x, o) {
			selected_ppps = _.uniq(
				selected_ppps.concat(o.add.add_ppp).concat(o.add.remove_ppp).concat(o.remove.add_ppp).concat(o.remove.remove_ppp)
			);
		});
		var selects = $me.find('.activecampaign-levels-select-ppp');
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
		$me.find('select.activecampaign-levels-select-ppp').select2({
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
		$('#thirdparty-provider-container-activecampaign').set_form_data(WLM3ThirdPartyIntegration.activecampaign);
	},

	set_event_handlers: function() {
		this.tag_action_events();
	},

	tag_action_events: function() {
		var t = $('#activecampaign-tag-table');

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
					action: 'wishlistmember_activecampaign_delete_tag_action',
					tag_id: tag_id
				},
				(r) => {
					if (r.success) {
						delete WLM3ThirdPartyIntegration.activecampaign.tag_actions[tag_id];
						WLM3ThirdPartyIntegration.activecampaign.fxn.load_tags_table();
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
		$('body').off('.activecampaign-tag-events');

		/**
		 * show actions on tag select change
		 * @param  object e Event object
		 */
		$('body').on('change.activecampaign-tag-events', '#activecampaign-tag-id-select', (e) => {
			$('#activecampaign-tag-actions').show();
			$('#activecampaign-tag-modal').data('tag-id', $(e.target).val());
		});

		/**
		 * populate fields and set values on show of tag action modal
		 * @param  object e Event object
		 */
		$('body').on('show.bs.modal.activecampaign-tag-events', (e) => {
			if (!e.target.id.match(/^activecampaign/)) {
				return;
			}
			var modal = $(e.target);
			modal.find('.nav.nav-tabs').each(function() {
				$(this).find('li.nav-item:first a').trigger('click');
			});
			if ($(e.target)[0].id == 'activecampaign-tag-modal') {
				// populate tag action modal values
				this.set_list_options();
				var tag_id = $(e.relatedTarget).data('tag-id');
				modal.data('tag-id', tag_id);
				var is_new = tag_id == 'new';
				var tag_id_select = modal.find('#activecampaign-tag-id-select').first();
				if (is_new) {
					tag_id_select.find('option').each((x, o) => {
						try {
							if (o.value in WLM3ThirdPartyIntegration.activecampaign.tag_actions) {
								$(o).remove();
							}
						} catch (e) {}
					});
				}
				tag_id_select.val(tag_id).prop('disabled', !is_new).trigger('change');
				if (!tag_id_select.val()) {
					$('#activecampaign-tag-actions').hide();
				}
				this.set_tag_action_values();
			}
		});
	},

	/**
	 * Load the tag actions table
	 */
	load_tags_table: function() {
		var tmpl = _.template($('script#activecampaign-tag-template').html(), {
			variable: 'data'
		});
		var data = {
			tags: WLM3ThirdPartyIntegration.activecampaign.tags,
			tag_ids: Object.keys(WLM3ThirdPartyIntegration.activecampaign.tag_actions || []),
			tag_settings: WLM3ThirdPartyIntegration.activecampaign.tag_actions || [],
		}
		$('#activecampaign-tag-table table tbody').empty().append(tmpl(data).trim());
		WLM3ThirdPartyIntegration.activecampaign.fxn && WLM3ThirdPartyIntegration.activecampaign.fxn.tag_action_events();
	},

	/**
	 * set values for fields inside of tag action modal
	 */
	set_tag_action_values: function() {
		try {
			$('#activecampaign-tag-actions').set_form_data(WLM3ThirdPartyIntegration.activecampaign.tag_actions[$('#activecampaign-tag-modal').data('tag-id')]);
		} catch (e) {}
	}
}
integration_before_open['activecampaign'] = function(obj) {
	var fxn = this;
	obj = $(obj);
	var $me = $('#thirdparty-provider-container-activecampaign');

	fxn.save_keys = function(){
		var x = $.extend({save : true},WLM3ThirdPartyIntegration.activecampaign.fxn.get_keys(obj));
		WLM3ThirdPartyIntegration.activecampaign.fxn.test_keys(x);
	};

	$me.off('click', '.save-keys', fxn.save_keys);
	$me.on('click', '.save-keys', fxn.save_keys);

	$me.addClass('api-fail');
}
integration_after_open['activecampaign'] = function(obj) {
	var fxn = this;
	obj = $(obj);

	WLM3ThirdPartyIntegration.activecampaign.fxn.test_keys(
		WLM3ThirdPartyIntegration.activecampaign.fxn.get_keys(obj)
	);

	// set event handlers
	WLM3ThirdPartyIntegration.activecampaign.fxn.set_event_handlers();
}

/**
 * run stuff when an integration modal is saved
 * @param object obj modal DOM object
 */
integration_modal_save['activecampaign'] = (obj) => {
	// tag actions modal
	if (obj[0].id == 'activecampaign-tag-modal') {
		WLM3ThirdPartyIntegration.activecampaign.fxn.load_tags_table(); // reload table
		WLM3ThirdPartyIntegration.activecampaign.fxn.set_tag_action_values(); // reload modal values
		$('#activecampaign-tag-id-select').prop('disabled', true).trigger('change'); // disable the tag dropdown
	}
}
