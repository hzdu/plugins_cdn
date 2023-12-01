function get_integration_api_message(type, msg) {
	this.connected = wp.i18n.__( 'Connected', 'wishlist-member' );
	this.notconnected = wp.i18n.__( 'Not Connected', 'wishlist-member' );
	this.notconnected2 = wp.i18n.__( 'Not Connected (Reason: __reason__)', 'wishlist-member' );
	this.notconfigured = wp.i18n.__( 'Not Configured', 'wishlist-member' );

	switch(type) {
		case 3:
			return this.notconfigured;
			break;
		case 2:
			if(msg) {
				return this.notconnected2.replace('__reason__', msg);
			} else {
				return this.notconnected;
			}
			break;
		default:
			return this.connected;
	}
}
var thirdparty_provider_fxns;
$(function () {
	$('body').trigger('wishlistmember-group-pro');
	if(!thirdparty_provider_fxns) {
		thirdparty_provider_fxns = {
			save : function($section, $button) {
				var $integration = $section.closest('.thirdparty-provider-container');
				var $provider = $integration.data('provider');

				if($section.closest('.form-group').length) {
					$section.closest('.form-group').addClass('-is-saving');
				}

				$('.modal-loader-overlay-holder').removeClass('d-none');

				switch($integration.data('type')) {
					case 'payment':
						thirdparty_provider_fxns.save_payment_provider($provider, $integration, $section, $button);
					break;
					case 'email':
						thirdparty_provider_fxns.save_email_provider($provider, $integration, $section, $button);
					break;
					case 'other':
						thirdparty_provider_fxns.save_other_provider($provider, $integration, $section, $button);
					break;
				}

				this.verify_saved_keys($provider, $section);
			},
			save_tyurl : function(field) {
				var $field = $(field);
				var $container = $field.closest('.form-group');
				var $integration = $field.closest('.thirdparty-provider-container');
				var $provider = $integration.data('provider');

				$data = {
					action: 'regurl_exists',
					data: {
						regurl: $field.first().val(),
						name: $field.attr('name')
					}
				}
				
				$.post(WLM3VARS.ajaxurl, $data, function(result) {
					if(!result) {
						$container.save_settings({
							data: {
								action : 'admin_actions',
								WishListMemberAction : 'save'
							},
							on_success: function(obj, result) {
								$.extend(WLM3ThirdPartyIntegration[$provider], result.data);
								obj.set_form_data(result.data);
								$('.wlm-message-holder').show_message(
									{type : 'success', message : wp.i18n.__( 'Saved', 'wishlist-member' )}
								);
								$container.addClass( 'has-success' );
								window.setTimeout( function( $container ) {
									$container.removeClass( 'has-success' );
								}, 2000, $container );
							},
							on_fail: function() {
								$('.wlm-message-holder').show_message(
									{type : 'danger', message : wp.i18n.__( 'Failed saving URL', 'wishlist-member' )}
								);
								$container.addClass( 'has-error' );
							},
						});
					} else {
						$('.wlm-message-holder').show_message(
							{type : 'danger', message : 'URL is already in use'}
						);
						$container.addClass( 'has-error' );
					}
				}, 'json');

			},
			save_payment_provider : function($provider, $integration, $section, $button) {
				var $data = {};

				var $buttons = $section.find('.save-button');
				$button = $($button);

				$validator = null;
				if (typeof integration_save_validators[$provider] == 'function') {
					$validator = integration_save_validators[$provider];
				}

				var data = {}
				if(!$section.find(':input[name="WishListMemberAction"]').length) data.WishListMemberAction = 'save_payment_provider';
				if(!$section.find(':input[name="action"]').length) data.action = 'admin_actions';

				$section.save_settings({
					data : data,
					validator: $validator,
					on_init: function() {
						if($buttons.length) {
							$buttons.attr('disabled', 'disabled');
						}
						if($button.length) {
							$button.disable_button({disable:true, icon:'update', class:''});
						}
					},
					on_success: function(obj, result) {
						if('fxn' in result.data) delete result.data.fxn; // make sure fxn is not set :)
						$.extend(true, WLM3ThirdPartyIntegration[$provider], result.data); // update data

						obj.set_form_data(result.data);
					},
					on_done: function(me, settings_data, result, textStatus) {
						$('.modal-loader-overlay-holder').addClass('d-none');
						if($button.length) {
							$button.disable_button({disable:false, icon:'save', class:''});
						}
						if($buttons.length) {
							$buttons.removeAttr('disabled');
						}
						if($button.hasClass('-close')) {
							$('.modal').modal('hide');
						}
						if(result.status || !('status' in result)) {
							$('.wlm-message-holder').show_message({
								type: 'success',
								message: wp.i18n.__( 'Saved', 'wishlist-member' )
							});
						} else {
							$('.wlm-message-holder').show_message({
								type: 'danger',
								message: result.message ? result.message : wp.i18n.__( 'Error Saving', 'wishlist-member' )
							});
						}

						$section.parent().find('.is-saving').removeClass('is-saving');

						if(!($provider in integration_modal_save)) return;
						if(typeof integration_modal_save[$provider] != 'function') return;
						integration_modal_save[$provider](me, settings_data, result, textStatus);
					}
				});
			},
			save_email_provider : function($provider, $integration, $section, $button) {

				var $buttons = $section.find('.btn');
				$button = $($button);

				$validator = null;
				if (typeof integration_save_validators[$provider] == 'function') {
					$validator = integration_save_validators[$provider];
				}

				var data = {}
				if(!$section.find(':input[name="WishListMemberAction"]').length) data.WishListMemberAction = 'save_autoresponder';
				if(!$section.find(':input[name="action"]').length) data.action = 'admin_actions';
				data.autoresponder_id = $provider;

				$section.save_settings({
					data : data,
					validator: $validator,
					on_init: function() {
						if($buttons.length) {
							$buttons.attr('disabled', 'disabled');
						}
						if($button.length) {
							$button.disable_button({disable:true, icon:'update', class:''});
						}
					},
					on_success: function(obj, result) {
						if('fxn' in result.data) delete result.data.fxn; // make sure fxn is not set :)
						$.extend(WLM3ThirdPartyIntegration[$provider], result.data); // update data

						obj.set_form_data(result.data);
					},
					on_done: function(me, settings_data, result, textStatus) {
						$('.modal-loader-overlay-holder').addClass('d-none');
						if($button.length) {
							$button.disable_button({disable:false, icon:'save', class:''});
						}
						if($buttons.length) {
							$buttons.removeAttr('disabled');
						}
						if($button.hasClass('-close')) {
							$('.modal').modal('hide');
						}
						$('.wlm-message-holder').show_message({
							type: 'success',
							message: wp.i18n.__( 'Saved', 'wishlist-member' ),
						});

						$section.parent().find('.is-saving').removeClass('is-saving');

						if(!($provider in integration_modal_save)) return;
						if(typeof integration_modal_save[$provider] != 'function') return;
						integration_modal_save[$provider](me, settings_data, result, textStatus);
					}
				});
			},
			save_other_provider : function($provider, $integration, $section, $button) {

				var $buttons = $section.find('.btn');
				$button = $($button);

				$validator = null;
				if (typeof integration_save_validators[$provider] == 'function') {
					$validator = integration_save_validators[$provider];
				}
				
				var data = {}
				if(!$section.find(':input[name="WishListMemberAction"]').length) data.WishListMemberAction = 'save_other_integration';
				if(!$section.find(':input[name="action"]').length) data.action = 'admin_actions';

				$section.save_settings({
					data : data,
					validator: $validator,
					on_init: function() {
						if($buttons.length) {
							$buttons.attr('disabled', 'disabled');
						}
						if($button.length) {
							$button.disable_button({disable:true, icon:'update', class:''});
						}
					},
					on_success: function(obj, result) {
						if('fxn' in result.data) delete result.data.fxn; // make sure fxn is not set :)
						$.extend(true, WLM3ThirdPartyIntegration[$provider], result.data); // update data

						obj.set_form_data(result.data);
					},
					on_done: function(me, settings_data, result, textStatus) {
						$('.modal-loader-overlay-holder').addClass('d-none');
						if($button.length) {
							$button.disable_button({disable:false, icon:'save', class:''});
						}
						if($buttons.length) {
							$buttons.removeAttr('disabled');
						}
						if($button.hasClass('-close')) {
							$('.modal').modal('hide');
						}
						$('.wlm-message-holder').show_message({
							type: ('success' in result) ? (result.success ? 'success' : 'error' ): 'success',
							message: result.data && result.data.msg || wp.i18n.__( 'Saved', 'wishlist-member' ),
						});

						$section.parent().find('.is-saving').removeClass('is-saving');

						if(!($provider in integration_modal_save)) return;
						if(typeof integration_modal_save[$provider] != 'function') return;
						integration_modal_save[$provider](me, settings_data, result, textStatus);
					}
				});
			},
			integration_show: function(integration) {
				var $integration = $(integration);
				var $provider = $integration.data('provider');
				var $link = $('a[data-provider="' + $provider + '"]');
				var $id = $provider.replace('.', "\\.");

				if ($link.closest('.integration-toggle-container').hasClass('no-settings')) {
					$integration.addClass('-no-settings').removeClass('-has-settings');
				} else {
					$integration.removeClass('-no-settings').addClass('-has-settings');
				}

				if ($link.closest('.integration-toggle-container').hasClass('active')) {
					$integration.addClass('-is-active').removeClass('-is-inactive');
					try {
						$($('ul.nav.nav-tabs li.active a').first()[0].hash).tab('show');
						$('ul.nav.nav-tabs li.active a').addClass('active');
					}catch(e){};
				} else {
					$integration.addClass('-is-inactive').removeClass('-is-active');
				}

				$('#wlm3-thirdparty-provider').data('provider', $provider);

				// set value of toggle
				var $val = activate_thirdparty_providers.indexOf(thirdparty_provider_index_format.replace('%s', $provider)) < 0 ? false : true;
				
				$('input[name=toggle-thirdparty-provider]').prop('checked', $val);

				// load scripts
				var before_open_called = false;
				// call init function if provided	
				if($integration.hasClass('-is-active') && !before_open_called) {
					if(typeof integration_before_open[$provider] == 'function') {
						integration_before_open[$provider]($integration[0]);
						before_open_called = true;
					}
				}
					
				// modals - we auto-process everyone that has 'data-process="modal"'
				$integration.find('[data-process="modal"]').each(function() {
					new wlm3_modal('#' + this.id);
					// always reset tabs when opening a modal.
					$('#' + this.dataset.id).on('show.bs.modal', function(e) {
						$(this).find('.nav.nav-tabs .nav-link:first').each(function() {
							$(this).click()
						});
					});
				});
				
				// transform forms and set form data
				$integration.transformers();
				$integration.set_form_data(WLM3ThirdPartyIntegration[$provider]);

				// .-url apply/cancel
				$integration.find('.-url-group .input-group input.-url').each(function() {
					$(this).click_to_edit().apply_cancel({
						style: 'padding-top: 30px;',
						require_change : false,
						show_feedback : false
					}).on('edit.click_to_edit', function() {
						$(this).data('initial', $(this).val());
						$(this).apply_cancel('show');
					}).on('apply.apply_cancel', function() {
						thirdparty_provider_fxns.save_tyurl(this);
						$(this).click_to_edit('close');
						$(this).apply_cancel('hide');
					}).on('cancel.apply_cancel', function() {
						$(this).click_to_edit('close');
						$(this).val($(this).data('initial'));
					});
				});

				// todo: overtaken handler todo
				$integration.removeClass('overtaken');
				$integration.find('.modal-takeover').hide();
			},
			integration_shown: function(integration) {
				var $integration = $(integration);
				if($integration.hasClass('-is-active')) {
					var provider = $integration.data('provider');
					// load integration's "after open" function
					try {
						// first try
						integration_after_open[provider]($integration[0]);
					} catch (err) {
						// try again after 1.5 seconds
						window.setTimeout(function() {
							try {
								integration_after_open[provider]($integration[0]);
							} catch(err) {}
						}, 1500);					
					}
				}
				// apply/cancel stuff
				$integration.find('input.applycancel').each(function() {
					$(this).data('initial', $(this).val());
				});
				$integration.find('input.applycancel').apply_cancel()
				.on('cancel.apply_cancel', function() {
					$(this).val($(this).data('initial'));
				})
				.on('apply.apply_cancel', function() {
					thirdparty_provider_fxns.save($(this).closest('.form-group'));
					var haserror = $(this).closest('.has-error').length;
					if(!haserror) {
						$(this).data('initial', $(this).val());
					}
				}).removeAttr('applycancel');
				
				
				// button handler to generate new api keys
				$('[data-action="gen-api-key"]').do_confirm( { confirm_message : wp.i18n.__( 'Generate New API Key?', 'wishlist-member' ) } )
				.on('yes.do_confirm', function() {
					var $target = $($(this).data('target'));
					$.post(
						WLM3VARS.ajaxurl,
						{
								action : 'wlm3_generate_api_key',
								key_name : $target.data('keyname'),
						},
						function(result) {
							if(result.success) {
								$target.val(result.key);
								$( '.wlm-message-holder' ).show_message( { message : wp.i18n.__( 'API Key changed', 'wishlist-member' ) } );
							} else {
								$( '.wlm-message-holder' ).show_message( { message : wp.i18n.__( 'Error changing API Key', 'wishlist-member' ), type : 'danger' } );
							}
						}
					)
				});
				
				window.scrollTo(0, 0);

			},
			verify_saved_keys: function($provider, $section) {
				if(!($provider in WLM3ThirdPartyIntegration)) return; // invalid provider
				if(!('fxn' in WLM3ThirdPartyIntegration[$provider])) return; // no functions
				if((typeof WLM3ThirdPartyIntegration[$provider].fxn.get_keys) != 'function') return; // no get_keys
				if((typeof WLM3ThirdPartyIntegration[$provider].fxn.test_keys) != 'function') return; // no test_keys

				if($section.hasClass('-integration-keys')) {
					$section = $section.parent();
				}
				if(!$section.find('.-integration-keys').length) return;

				var keys = $.extend({save : true},WLM3ThirdPartyIntegration[$provider].fxn.get_keys($section));
				WLM3ThirdPartyIntegration[$provider].fxn.test_keys(keys);
			},
		}

		$('body').off('.wlm3-integration');

		// save buttons handler
		$('body').on('click.wlm3-integration', '.save-button', function() {
			var $section = $(this).closest('.modal,.form,form');
			if(!$section.length) $section = $(this).closest('.thirdparty-provider-container');
			thirdparty_provider_fxns.save($section, this);
			return false;
		});

		$('body').on('change.wlm3-integration', '.is-toggle-switch[name]', function () {
			if($(this).closest('.modal').length) return;
			var $section = $(this).closest('div' + ('' + $(this).data('container')).replace(/^undefined$/, ''));
			thirdparty_provider_fxns.save($section);
		});
		$('body').on('change.wlm3-integration', 'select[name]', function () {
			if($(this).closest('.modal').length) return;
			var $section = $(this).closest('div' + ('' + $(this).data('container')).replace(/^undefined$/, ''));
			$section.addClass( '-is-saving' );
			thirdparty_provider_fxns.save($section);
		});

		// .-url change handler (usually used by payment providers but can be used for any url if needed)
		$('body').on('change.wlm3-integration', '.-url', function() {
			$(this).val($(this).val().replace(/[^A-Za-z0-9]/g, ''));
		});

		$('body').on('focus.wlm3-integration', '.-url', function() {
			$(this).closest('.form-group').removeClass('has-error has-success');
		});

		// integration on/off switch
		$('body').on('change.wlm3-integration', 'input[name=toggle-thirdparty-provider]', function() {
			// grab provider info
			var $provider = $(this).closest('.thirdparty-provider-container').data('provider');

			var row = $(this).closest('.row');

			wlm.is_saving(row, true, '.row');
			var $integration = $('#thirdparty-provider-container-' + $provider);

			// prepare form data
			var $data = {
				action: 'toggle_' + $integration.data('type') + '_provider',
				data: {
					provider: $provider,
					state: ($(this).prop('checked') ? 1 : 0)
				}
			}

			// activate/deactivate integration
			$.post(WLM3VARS.ajaxurl, $data, function(result) {
				if(typeof result == 'string') {
					result = wlm.json_parse(result);
				}

				wlm.is_saving(row, false, '.row');

				// update integration icons active status
				activate_thirdparty_providers = result.actives;
				$('.integration-toggle-container').removeClass('active');
				$.each(activate_thirdparty_providers, function(k, v) {
					v = v.replace('integration.shoppingcart.', '').replace('.php', '').replace('.', "\\.");
					try {
						$('#thirdparty-provider-' + v).addClass('active');
					} catch(e) {}
				});

				// hide/show interface based on integration status
				var $container = $('#thirdparty-provider-container-' + $provider);
				if($data.data.state) {
					$container.removeClass('-is-inactive').addClass('-is-active');

					// click first tab
					$($('ul.nav.nav-tabs li.active a').first()[0].hash).tab('show');
					$('ul.nav.nav-tabs li.active a').addClass('active');

					// call before_open function if set
					if(typeof integration_before_open[$provider] == 'function') {
						integration_before_open[$provider]($container[0]);
					}
					// call after_open function if set
					if(typeof integration_after_open[$provider] == 'function') {
						integration_after_open[$provider]($container[0]);
					}
				} else {
					$container.addClass('-is-inactive').removeClass('-is-active');
				}
			});
		});

		// todo: modal takeover handler
		$('body').on('click.wlm3-integration', '[data-show=modal-takeover]', function() {
			var $me = $(this);
			var $target = $($me.data('target'));
			var $modal = $me.closest('.modal');
			if(!$target.length || !$modal.length) return;
			var $provider = $modal.data('provider');

			if(typeof integration_takeover_save[$provider] == 'function') {
				$('.save-takeover-button').show();
			} else {
				$('.save-takeover-button').hide();
			}
			$modal.addClass('overtaken');
			$target.show();
			$target.appendTo($me.closest('.thirdparty-provider-container'));
			$modal.scrollTop(0);
		});

		// todo: modal takeover handler
		$('body').on('click.wlm3-integration', '[data-hide=modal-takeover]', function() {
			var $me = $(this);
			var $target = $me.closest('.modal-takeover');
			var $modal = $me.closest('.modal');
			if(!$target.length || !$modal.length) return;
			$modal.removeClass('overtaken');
			$target.hide();
			$modal.scrollTop(0);
		});

		// todo: modal takeover handler
		$('body').on('click.wlm3-integration', '.close-takeover-button', function() {
			var $me = $(this);
			var $modal = $me.closest('.modal');
			$modal.removeClass('overtaken');
			$modal.find('.modal-takeover').hide();
			$modal.scrollTop(0);
			return false;
		});

		$('body').on('click.wlm3-integration', 'a.hide-show', function() {
		    var t = $(this).attr('href');
		    $(t).toggleClass('d-none');
		    return false;
		});

		// todo: modal takeover handler
		$('body').on('click.wlm3-integration', '.save-takeover-button', function() {
			var $me = $(this);
			var $modal = $me.closest('.modal');
			var $provider = $modal.data('provider');
			if(typeof integration_takeover_save[$provider] == 'function') {
				integration_takeover_save[$provider]($modal);
			}
			return false;
		});

		$('body').on('change.wlm3-integration', '[data-mirror-value]', function() {
			var target = $(this).data('mirror-value');
			switch(this.type) {
				case 'checkbox':
					if(this.checked) {
						$(target).text(wp.i18n.__( 'Yes', 'wishlist-member' ));
					} else {
						$(target).text(wp.i18n.__( 'No', 'wishlist-member' ));
					}
					break;
				case 'select-one':
				case 'select-multiple':
					var value = [];
					$(this).find(':selected').each(function() {
						value.push($(this).text());
					});
					$(target).text(value.join(', '));
					break;
				default:
					var v = $(this).val();
					if($(this).hasClass('-amount')) {
						v = Number(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
					}
					$(target).text(v);
			}

		});

		// collapse event handlers
		$('body').on('show.bs.collapse', '#all-integrations-parent .collapse', function () {
			if($(this).data('provider')) thirdparty_provider_fxns.integration_show(this);
			$(this).addClass("show");
		}).on('shown.bs.collapse', '#all-integrations-parent .collapse', function() {
			if($(this).data('provider')) thirdparty_provider_fxns.integration_shown(this);

			if($(this).find('.-integration-keys').length) {
				setTimeout(function(obj) {
					var interval_id = setInterval(function(obj) {
						if($(obj).find('.-integration-keys .api-status .text-warning').length) return;
						clearInterval(interval_id);
						$(obj).find('[data-mirror-value]').trigger('change');
					}, 500, obj)
				}, 500, this);
			} else {
				$(this).find('[data-mirror-value]').trigger('change');
			}
		}).on('hide.bs.collapse', '#all-integrations-parent .collapse', function () {
			$(this).removeClass("show");
			formdata = {};
		});

		$('body').on('click.wlm3-integration', '.integration-toggle, .-return-button', function(e) {
			if(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return true;

			$( '.popover' ).popover( 'hide' );
			e.preventDefault();
			$('#the-screen').load_screen(this.href, document.title);
			wlm.pushState('#the-screen', document.title, this.href);
			return false;
		});
	}

	// modify tutorial tab links
	if(!(!wlm3_integration_config)) {
		if(parseInt(wlm3_integration_config.video_id)) {
			$('.nav-link[href$="_tutorial"]').html('<i class="wlm-icons md-20 align-middle">ondemand_video</i> Watch the Tutorial').parent().addClass('ml-auto');
		} else {
			var suffix = wlm3_integration_config.legacy ? 'legacy' : ( wlm3_integration_config.kb_slug ? wlm3_integration_config.kb_slug : wlm3_integration_config.id );
			$('.nav-link[href$="_tutorial"]').removeAttr('data-toggle').attr({target : '_blank', href : 'https://wishlistmember.com/docs/' + suffix}).html('<i class="wlm-icons md-20 align-middle">description</i> View the Documentation').parent().addClass('ml-auto');
		}
	}

	if(requested_integration != '*') {
		$('#thirdparty-provider-container-' + requested_integration).collapse('show');
	}
});