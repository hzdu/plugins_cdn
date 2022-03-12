'use strict';

jQuery(function ($) {

	/**
  * Initializes fields visibility and events registration
  */
	MPSUM.premium_init = function () {
		this.__logger_additional_options_visibility();
		this.__register_logger_selection_event();
		this.__set_cron_related_fields_visibility($('.eum_cron_schedule').val());
		this.__register_cron_schedule();
		this.__register_cron_schedule_change();
		this.__register_enable_auto_backup_event();
		this.__register_disable_auto_backup_event();
		this.__register_anonymize_updates();
		this.__register_export_settings();
		this.__register_import_settings();
		this.__register_delay_updates();
		this.__register_save_log_settings();
		this.__register_check_plugins();
		this.__register_disable_safe_mode_event();
		this.__register_enable_safe_mode_event();
		this.__register_enable_webhook();
		this.__register_disable_webhook();
		this.__register_enable_version_control_protection();
		this.__register_disable_version_control_protection();
		this.__register_copy_webhook();
		this.__register_whitelist_save();
		this.__register_whitelist_reset();
		this.__register_disable_unmaintained_plugins_event();
		this.__register_enable_unmaintained_plugins_event();
	};

	/**
  * Toggle loggers additional options visibility such as url field.
  *
  * @private
  */
	MPSUM.__logger_additional_options_visibility = function () {
		var loggers = $('.eum_logger_type');
		loggers.each(function (index, logger) {
			if (true === $('input', logger)[0].checked) {
				$('.eum_logger_additional_options', logger).show();
			} else {
				$('.eum_logger_additional_options', logger).hide();
			}
		});
	};

	/**
  * Checks plugins if they are active in the directory or not
  *
  * @private
  */
	MPSUM.__register_check_plugins = function () {
		var _this = this;

		$('#eum-check-plugins').on('click', function (e) {
			e.preventDefault();
			var force_check = false;
			if ($('#eum-check-plugins-force').is(':checked')) {
				force_check = true;
			}
			jQuery('#eum-check-plugins-status').css('display', 'none');
			_this.send_command('check_plugins', { data: { force: force_check } }, function (response) {
				var $message = jQuery('#eum-check-plugins-status');
				$('#eum-check-plugins-force').prop('checked', false);
				if (response.errors) {
					$message.css('display', 'block').removeClass('mpsum-notice').addClass('mpsum-error mpsum-bold').html(response.message);
				} else {
					$message.css('display', 'block').removeClass('mpsum-error').addClass('mpsum-notice mpsum-bold').html(response.message);
				}
				_this.__unblockUI();
			});
		});
	};

	/**
  * Register logger selection event, checkbox input field click event
  *
  * @private
  */
	MPSUM.__register_logger_selection_event = function () {
		$('.eum_logger_type').on('click', 'input[type="checkbox"]', function (e) {
			var $logger_container = $(e.currentTarget).closest('.eum_logger_type');
			if (true === e.currentTarget.checked) {
				$logger_container.find('.eum_logger_additional_options').show();
			} else {
				$logger_container.find('.eum_logger_additional_options').hide();
			}
		});
	};

	/**
  * Registers save cron schedule click event
  *
  * @private
  */
	MPSUM.__register_cron_schedule = function () {
		var _this2 = this;

		$('#save-cron-schedule').on('click', function (e) {
			e.preventDefault();
			_this2.send_command('save_cron_schedule', { data: _this2.gather_settings('string') }, function (response) {
				$('#eum-next-cron-schedule').html('' + response.time);
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response.message + '</p></div>').delay(5000).slideUp(2000);
				_this2.__unblockUI();
			});
		});
	};

	/**
  * Registers cron schedule type change event
  *
  * @private
  */
	MPSUM.__register_cron_schedule_change = function () {
		var _this3 = this;

		$('.eum_cron_schedule').change(function (e) {
			_this3.__set_cron_related_fields_visibility($(e.currentTarget).val());
		});
	};

	/**
  * Toggles time field visibility based on cron schedule selection
  *
  * @param {String} value - Selected cron schedule
  */
	MPSUM.__set_cron_related_fields_visibility = function (value) {
		var $time_field = $('.eum_cron_time');
		var $week_number_field = $('.eum_week_number');
		var $week_day_field = $('.eum_week_days');
		var $day_number_field = $('.eum_day_number_wrapper');

		switch (value) {
			case 'twicedaily':
			case 'daily':
				$week_day_field.hide();
				$week_number_field.hide();
				$day_number_field.css('display', 'none');
				break;
			case 'weekly':
				$week_day_field.show();
				$week_number_field.hide();
				$day_number_field.css('display', 'none');
				break;
			case 'fortnightly':
				$week_day_field.show();
				$week_number_field.show();
				$day_number_field.css('display', 'none');
				break;
			case 'monthly':
				$week_day_field.hide();
				$week_number_field.hide();
				$day_number_field.css('display', 'inline-block');
		}
	};

	MPSUM.__register_delay_updates = function () {
		var _this4 = this;

		$('#save-delay-updates').on('click', function (e) {
			e.preventDefault();
			var delay_updates = parseInt($('#delay-updates').val());
			if (Number.isInteger(delay_updates) && delay_updates >= 0) {
				_this4.send_command('save_delay_updates', { data: _this4.gather_settings('string') }, function (response) {
					$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
					_this4.__unblockUI();
				});
			} else {
				$('#result').css('display', 'block').html('<div class="warning"><p>' + mpsum.not_valid_number + '</p></div>').delay(5000).slideUp(2000);
			}
		});
	};

	/**
  * Registers save button click event
  *
  * @private
  */
	MPSUM.__register_save_log_settings = function () {
		var _this5 = this;

		$('#save-logs-settings').on('click', function (e) {
			e.preventDefault();
			var scheduled_days = parseInt($('#logs-clearing').val());
			console.log(scheduled_days);
			if (Number.isInteger(scheduled_days) && scheduled_days >= 0) {
				_this5.send_command('save_logs_settings', { data: _this5.gather_settings('string') }, function (response) {
					$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
					_this5.__unblockUI();
				});
			} else {
				$('#result').css('display', 'block').html('<div class="warning"><p>' + mpsum.not_valid_number + '</p></div>').delay(5000).slideUp(2000);
			}
		});
	};

	MPSUM.__register_anonymize_updates = function () {
		var _this6 = this;

		$('#save-anonymize-update-option').on('click', function (e) {
			e.preventDefault();
			_this6.send_command('save_anonymize_updates', { data: _this6.gather_settings('string') }, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
				_this6.__unblockUI();
			});
		});
	};

	// Only one field at this moment, kept for future
	var $time_fields = $('input[type="time"]');

	// Use time picker when input[type="time"] not supported
	$time_fields.each(function (index, element) {
		if (!Modernizr.inputtypes.time) {
			$(element).timepicker({ 'timeFormat': 'H:i' });
			$(element).addClass('no_date_time_support');
			$(element).on('changeTime', function (e) {
				$(e.currentTarget).timepicker('hide');
			});
			$(element).on('keypress', function (e) {
				e.preventDefault();
				return false;
			});
		}
	});

	$time_fields.on('focus', function () {
		var element = $(this).get(0);
		if (!Modernizr.inputtypes.time) {
			$(element).timepicker({ 'timeFormat': 'H:i' });
			$(element).on('changeTime', function (e) {
				$(e.currentTarget).timepicker('hide');
			});
			$(element).on('keypress', function (e) {
				e.preventDefault();
				return false;
			});
		}
	});

	/**
  * Registers enabling auto backup
  *
  * @private
  */
	MPSUM.__register_enable_auto_backup_event = function () {
		var _this7 = this;

		$('#eum-auto-backup').on('click', '#eum_ud_enable_auto_backup', function (e) {
			e.preventDefault();
			_this7.send_command('enable_auto_backup', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
				_this7.__unblockUI();
				var $auto_backup_button = $('#eum_ud_enable_auto_backup');
				$('#eum-auto-backup-description').removeClass().addClass('mpsum-notice mpsum-bold').text(mpsum.enabled_auto_backup_description);
				$auto_backup_button.prop('id', 'eum_ud_disable_auto_backup');
				$auto_backup_button.val(mpsum.disable_auto_backup);
			});
		});
	};

	/**
  * Registers export settings button click event
  */
	MPSUM.__register_export_settings = function () {
		var _this8 = this;

		$('#eum-settings-export').click(function (e) {
			e.preventDefault();
			_this8.send_command('export_settings', {}, function (response) {
				_this8.__unblockUI();
				// Attach this data to an anchor on page
				var link = document.body.appendChild(document.createElement('a'));
				link.setAttribute('download', mpsum.export_settings_filename);
				link.setAttribute('style', "display:none;");
				link.setAttribute('href', 'data:text/json' + ';charset=UTF-8,' + encodeURIComponent(response));
				link.click();
			});
		});
	};

	/**
  * Register import settings
  */
	MPSUM.__register_import_settings = function () {
		var _this9 = this;

		$('#eum-settings-import').click(function () {
			_this9.__blockUI();
			var eum_import_file_input = document.getElementById('import_settings');
			if (eum_import_file_input.files.length == 0) {
				alert(mpsum.import_select_file);
				_this9.__unblockUI();
				return;
			}
			var eum_import_file_file = eum_import_file_input.files[0];
			var eum_import_file_reader = new FileReader();
			eum_import_file_reader.onload = function () {
				var result = MPSUM.parse_json(this.result);
				if (mpsum.site_url !== result.meta.site_url) {
					var confirmImport = confirm(mpsum.import_confirmation);
					if (!confirmImport) {
						MPSUM.__unblockUI();
						return;
					}
				}
				MPSUM.send_command('import_settings', { data: result.data }, function (response) {
					$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000, function () {
						window.location.reload();
					});
					MPSUM.__unblockUI();
				}, { json_parse: false });
			};
			eum_import_file_reader.readAsText(eum_import_file_file);
		});
	};

	/**
  * Registers disabling auto backup
  *
  * @private
  */
	MPSUM.__register_disable_auto_backup_event = function () {
		var _this10 = this;

		$('#eum-auto-backup').on('click', '#eum_ud_disable_auto_backup', function (e) {
			e.preventDefault();
			_this10.send_command('disable_auto_backup', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
				_this10.__unblockUI();
				var $auto_backup_button = $('#eum_ud_disable_auto_backup');
				$('#eum-auto-backup-description').removeClass().addClass('mpsum-error mpsum-bold').text(mpsum.disabled_auto_backup_description);
				$auto_backup_button.prop('id', 'eum_ud_enable_auto_backup');
				$auto_backup_button.val(mpsum.enable_auto_backup);
			});
		});
	};

	/**
  * Registers enabling safe mode
  *
  * @private
  */
	MPSUM.__register_enable_safe_mode_event = function (e) {
		var _this11 = this;

		$('#safe-mode').on('click', '#enable-safe-mode', function (e) {
			e.preventDefault();
			_this11.send_command('enable_safe_mode', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
				$('#enable-safe-mode').val(mpsum.disable_safe_mode);
				$('#enable-safe-mode').attr('id', 'disable-safe-mode');
				_this11.__unblockUI();
			});
		});
	};

	/**
  * Registers disabling safe mode
  *
  * @private
  */
	MPSUM.__register_disable_safe_mode_event = function (e) {
		var _this12 = this;

		$('#safe-mode').on('click', '#disable-safe-mode', function (e) {
			e.preventDefault();
			_this12.send_command('disable_safe_mode', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(5000).slideUp(2000);
				$('#disable-safe-mode').val(mpsum.enable_safe_mode);
				$('#disable-safe-mode').attr('id', 'enable-safe-mode');
				_this12.__unblockUI();
			});
		});
	};

	/**
  * Registers a webhook
  *
  * @private
  */
	MPSUM.__register_enable_webhook = function () {
		var _this13 = this;

		$('#webhooks').on('click', '#enable-webhook,#refresh-webhook', function (e) {
			e.preventDefault();
			_this13.send_command('enable_webhook', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response.message + '</p></div>').delay(2000).slideUp(2000);
				$('#eum-webhook-url').val(response.hook_url);
				$('#eum-webhook-url-wrapper').removeClass('eum-hidden');
				$('#eum-webhook-copy').html(mpsum.webhook_copy);
				var $enableButton = $('#enable-webhook');
				$enableButton.attr('id', 'disable-webhook');
				$enableButton.val(mpsum.webhook_disable);
				_this13.__unblockUI();
			});
		});
	};

	/**
  * De-Registers a webhook
  *
  * @private
  */
	MPSUM.__register_disable_webhook = function () {
		var _this14 = this;

		$('#webhooks').on('click', '#disable-webhook', function (e) {
			e.preventDefault();
			_this14.send_command('disable_webhook', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(2000).slideUp(2000);
				$('#eum-webhook-url-wrapper').addClass('eum-hidden');
				$('#eum-webhook-url').val('');
				var $disableButton = $('#disable-webhook');
				$disableButton.attr('id', 'enable-webhook');
				$disableButton.val(mpsum.webhook_enable);
				_this14.__unblockUI();
			});
		});
	};

	/**
  * Enables version control protection
  *
  * @private
  */
	MPSUM.__register_enable_version_control_protection = function () {
		var _this15 = this;

		$('#version-control-protection').on('click', '#enable-version-control', function (e) {
			e.preventDefault();
			_this15.send_command('enable_version_control_protection', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(2000).slideUp(2000);
				var $enableButton = $('#enable-version-control');
				$enableButton.attr('id', 'disable-version-control');
				$enableButton.val(mpsum.version_control_disable);
				_this15.__unblockUI();
			});
		});
	};

	/**
  * Disables version control protection
  *
  * @private
  */
	MPSUM.__register_disable_version_control_protection = function () {
		var _this16 = this;

		$('#version-control-protection').on('click', '#disable-version-control', function (e) {
			e.preventDefault();
			_this16.send_command('disable_version_control_protection', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(2000).slideUp(2000);
				var $disableButton = $('#disable-version-control');
				$disableButton.attr('id', 'enable-version-control');
				$disableButton.val(mpsum.version_control_enable);
				_this16.__unblockUI();
			});
		});
	};

	/**
  * Enables Unmaintained plugins check
  *
  * @private
  */
	MPSUM.__register_enable_unmaintained_plugins_event = function () {
		var _this17 = this;

		$('.unmaintained-plugins').on('click', '#enable-unmaintained-plugins-check', function (e) {
			e.preventDefault();
			_this17.send_command('enable_unmaintained_plugins', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(2000).slideUp(2000);
				var $enableButton = $('#enable-unmaintained-plugins-check');
				$enableButton.attr('id', 'disable-unmaintained-plugins-check');
				$enableButton.val(mpsum.disable_unmaintained_plugins);
				_this17.__unblockUI();
			});
		});
	};

	/**
  * Disables Unmaintained plugins check
  *
  * @private
  */
	MPSUM.__register_disable_unmaintained_plugins_event = function () {
		var _this18 = this;

		$('.unmaintained-plugins').on('click', '#disable-unmaintained-plugins-check', function (e) {
			e.preventDefault();
			_this18.send_command('disable_unmaintained_plugins', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(2000).slideUp(2000);
				var $disableButton = $('#disable-unmaintained-plugins-check');
				$disableButton.attr('id', 'enable-unmaintained-plugins-check');
				$disableButton.val(mpsum.enable_unmaintained_plugins);
				_this18.__unblockUI();
			});
		});
	};

	/**
  * Registers a webhook
  *
  * @private
  */
	MPSUM.__register_enable_webhook = function () {
		var _this19 = this;

		$('#webhooks').on('click', '#enable-webhook,#refresh-webhook', function (e) {
			e.preventDefault();
			_this19.send_command('enable_webhook', {}, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response.message + '</p></div>').delay(2000).slideUp(2000);
				$('#eum-webhook-url').val(response.hook_url);
				$('#eum-webhook-url-wrapper').removeClass('eum-hidden');
				$('#eum-webhook-copy').html(mpsum.webhook_copy);
				var $enableButton = $('#enable-webhook');
				$enableButton.attr('id', 'disable-webhook');
				$enableButton.val(mpsum.webhook_disable);
				_this19.__unblockUI();
			});
		});
	};

	/**
  * Copies a webhook
  *
  * @private
  */
	MPSUM.__register_copy_webhook = function () {
		$('#webhooks').on('click', '#eum-webhook-copy', function (e) {
			e.preventDefault();
			var copyText = document.getElementById('eum-webhook-url');
			copyText.select();
			document.execCommand('copy');
			$('#eum-webhook-copy').html(mpsum.webhook_copied);
		});
	};

	/**
  * Enables or disables admin notices and whitelists the plugin name
  *
  * @private
  */
	MPSUM.__register_whitelist_save = function () {
		var _this20 = this;

		$('#eum-whitelabel').on('click', '#whitelist-save', function (e) {
			e.preventDefault();
			var data = {
				'plugin_name': $('#eum-whitelabel-text').val(),
				'plugin_author': $('#eum-whitelabel-author').val(),
				'plugin_url': $('#eum-whitelabel-url').val(),
				'notices': $('#whitelist-notices').is(':checked')
			};
			_this20.send_command('whitelist_save', { data: data }, function (response) {
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response + '</p></div>').delay(2000).slideUp(2000);
				_this20.__unblockUI();
			});
		});
	};

	MPSUM.__register_whitelist_reset = function () {
		var _this21 = this;

		$('#eum-whitelabel').on('click', '#whitelist-reset', function (e) {
			e.preventDefault();
			_this21.send_command('whitelist_reset', {}, function (response) {
				$('#eum-whitelabel-text').val(response.name);
				$('#eum-whitelabel-author').val(response.author);
				$('#eum-whitelabel-url').val(response.url);
				$('#whitelist-notices').prop('checked', true);
				$('#result').css('display', 'block').html('<div class="updated"><p>' + response.message + '</p></div>').delay(2000).slideUp(2000);
				_this21.__unblockUI();
			});
		});
	};

	MPSUM.premium_init();
});