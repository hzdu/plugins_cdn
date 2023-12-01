WLM3ThirdPartyIntegration.webhooks.fxn = {
	incoming_modal : function(id) {

		var $modal = $('#webhooks-incoming-modal');

		$modal.find(':input').val(['']);

		$url = $modal.find('#wlm-webhook-url').first();
		$url.val($url.data('prefix').replace('__wlm_webhook__', id));

		var name = 'webhooks_settings[incoming][' + id + ']';
		$modal.find(':input[data-name]').each(function() {
			$(this).attr('name', name + $(this).data('name'));
			if( $(this).attr('type') != 'checkbox' ) {
				$(this).val('');
			}
		});

		$modal.on('show.bs.modal', function() {
			// empty values.
			$(this).find(':input:not([readonly])').each(function() {
				if( $(this).attr('type') != 'checkbox' ) {
					$(this).val('');
				}
			});
			// $(this).find(':input:not([readonly])').val('').change();
			// set values.
			$(this).set_form_data(WLM3ThirdPartyIntegration.webhooks);
			// select first tab.
			$(this).find('.nav-tabs li:first a').click();
		});

		
		// open modal
		$modal.modal('show');
	},
	load_webhooks : function() {
		// outgoing webhooks table template
		$('#webhooks-outgoing-table').empty();
		$.each(all_levels, function(k,v) {
			var data = {
				outgoing : WLM3ThirdPartyIntegration.webhooks.webhooks_settings.outgoing,
				label    : post_types[k].labels.name,
				type     : k,
				levels   : v,
			}
			var html = _.template($('script#wlm-webhooks-outoing-template').html(), {variable: 'data'})(data);
			$('#webhooks-outgoing-table').append(html.trim());
		})

		// incoming webhooks table template
		var data = {
			incoming : WLM3ThirdPartyIntegration.webhooks.webhooks_settings.incoming,
			levels : all_levels.__levels__,
			merge_level_names : function (prefix, suffix, levels, wpm_levels) {
				var lnames = [];
				_.each(levels, function(level) {
					if(level in wpm_levels) {
						lnames.push(wpm_levels[level].name)
					}
				});
				var output = lnames.join(', ').trim();
				if(output) {
					output = prefix + output + suffix;
				}
				return output;
			}
		}
		var html = _.template($('script#wlm-webhooks-incoming-template').html(), {variable: 'data'})(data);
		$('#wlm-webhooks-incoming tbody').html(html.trim());

		// turn off our event handlers
		$('body').off('.wlm-webhooks');

		// new webhook modal event handler
		$('body').on('click.wlm-webhooks', 'a.-add-webhook-btn', function(e) {
			e.preventDefault();
			// update field names for our webhook url key
			do {
				id = parseInt(Math.random()*100000000000000000, 10).toString(36);
				id = id + '-' + parseInt(Math.random()*100000000000000000, 10).toString(36);
				id = id + '-' + parseInt(Math.random()*100000000000000000, 10).toString(36);
			} while(id in WLM3ThirdPartyIntegration.webhooks.webhooks_settings.incoming);
			WLM3ThirdPartyIntegration.webhooks.fxn.incoming_modal(id);
		});

		// username format toggle
		$('body').on('click.wlm-webhooks', 'a.toggle-username-format', function(e) {
			e.preventDefault();
			$('.username-format').slideToggle();
			return false;
		});
		$('body').on('show.bs.modal.wlm-webhooks', function() {
			$('.username-format').hide();
		});

		// edit modal event handler
		$('body').on('click.wlm-webhooks', 'a.webhooks-incoming-modal', function(e) {
			e.preventDefault();
			// update field names for our webhook url key
			var id = $(this).closest('tr').data('id');
			WLM3ThirdPartyIntegration.webhooks.fxn.incoming_modal(id);
		});

		// delete webbook event handler
		$('#thirdparty-provider-container-webhooks .-del-webhook-btn')
		.do_confirm( { confirm_message : wp.i18n.__( 'Delete this WebHook?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ) } )
		.on('yes.do_confirm', function() {
			var tr = $(this).closest('tr');
			$.post(
				WLM3VARS.ajaxurl,
				{
					action : 'wlm3_delete_incoming_webhook',
					id : tr.data('id'),
				},
				function(result) {
					if(result.success) {
						WLM3ThirdPartyIntegration.webhooks.webhooks_settings = result.data.webhooks_settings;
						WLM3ThirdPartyIntegration.webhooks.fxn.load_webhooks();
					}
				},
				'json'
			);
		});

	},

	outgoing_modal: function() {
		$('#webhooks-outgoing-modal').on('show.bs.modal', function(e) {
			// row.
			var $tr = $(e.relatedTarget).closest('tr');
			// modal.
			var $modal = $(this);

			// set modal title.
			$modal.find('.modal-title').attr('data-name', $tr.data('name'));
			// select first tab.
			$modal.find('.nav-tabs li:first a').click();
			// hide/show tabs specific to membership levels.
			$modal.find('.levels-only').toggle('__levels__' === $tr.data('type'));
			// set field names.
			$modal.find(':input[name^="webhooks_settings[outgoing]"]').each(function() {
				this.name = this.name.replace( /(webhooks_settings\[outgoing\]\[).*?(\].+)/, '$1' + $tr.data('id') + '$2')
			});
			$modal.set_form_data(WLM3ThirdPartyIntegration.webhooks);

		});
	}
}

integration_after_open['webhooks'] = function(obj) {
	WLM3ThirdPartyIntegration.webhooks.fxn.load_webhooks();
	WLM3ThirdPartyIntegration.webhooks.fxn.outgoing_modal();
	var $me = $('#thirdparty-provider-container-webhooks');
	$me.off('.wlm3-webhooks');
}

integration_modal_save['webhooks'] = function(me, settings_data, result, textStatus) {
	if(result.success) {
		WLM3ThirdPartyIntegration.webhooks.webhooks_settings = $.extend(true, {}, WLM3ThirdPartyIntegration.webhooks.webhooks_settings, result.data.webhooks_settings);
		WLM3ThirdPartyIntegration.webhooks.fxn.load_webhooks();
	}
}
