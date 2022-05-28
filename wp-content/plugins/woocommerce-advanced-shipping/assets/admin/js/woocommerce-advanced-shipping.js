jQuery( function( $ ) {

	// Toggle list table rows on small screens
	$('#advanced_shipping_shipping_methods').on('click', '.toggle-row', function() {
		$(this).closest('tr').toggleClass('is-expanded');
	});


	/**************************************************************
	 * Sortable Advanced Shipping Rates (legacy)
	 *************************************************************/
	$('.wpc-conditions-post-table tbody').sortable({
		items:					'tr',
		handle:					'.sort',
		cursor:					'move',
		axis:					'y',
		scrollSensitivity:		40,
		forcePlaceholderSize: 	true,
		helper: 				'clone',
		opacity: 				0.65,
		placeholder: 			'wc-metabox-sortable-placeholder',
		start:function(event,ui){
			ui.item.css('background-color','#f6f6f6');
		},
		stop:function(event,ui){
			ui.item.removeAttr('style');
		},
		update: function(event, ui) {

			var $table = $(this).closest('table');
			$table.block({ message: null, overlayCSS: { background: '#fff', opacity: 0.6 } });
			// Update fee order
			var data = {
				action:	wpc2.action_prefix + 'save_post_order',
				form: 	$(this).closest('form').serialize(),
				nonce: 	wpc.nonce
			};

			$.post(ajaxurl, data, function(response) {
				$('.wpc-conditions-post-table tbody tr:even').addClass('alternate');
				$('.wpc-conditions-post-table tbody tr:odd').removeClass('alternate');
				$table.unblock();
			});
		}
	});


	/**************************************************************
	 * Condition validation
	 *************************************************************/
	$('.wpc-condition-groups').on('change validate-conditions', '.wpc-condition-group', function() {

		$(this).find('.condition-error, .condition-warning').unbind('hover').removeClass('condition-error condition-warning');

		$(this).each(function(i) {
			var $rows = $(this).find('.wpc-condition-wrap');
			var $conditions = $.map($rows, function(elem) {
				return {
					key: $(elem).find('.wpc-condition option:selected').val(),
					operator: $(elem).find('.wpc-operator option:selected').val()
				}
			});

			// Duplicate conditions that are not possible
			$.each(['city', 'state', 'country', 'role'], function(index, key) {
				var checkConditions = $conditions.filter(function(condition) { return condition.key == key && condition.operator == '==' });
				if (checkConditions.length >= 2) {
					var errorConditions = $rows.find('.wpc-condition option[value=' + key + ']:selected').not(':first').parents('.wpc-condition');
					errorConditions.addClass('condition-error');
					errorConditions.attr('data-tip', 'Having two of these conditions with the \'Equal to\' operator in one condition group will give a conflict.');
				}
			});

			// 2+ category conditions
			var checkConditions = $conditions.filter(function(condition) { return condition.key == 'category' && condition.operator == '==' });
			if (checkConditions.length >= 2) {
				var warningConditions = $rows.find('.wpc-condition option[value=category]:selected').not(':first').parents('.wpc-condition');
				warningConditions.addClass('condition-warning');
				warningConditions.attr('data-tip', 'The \'category\' condition requires ALL products to have the given category. Having two or more required categories is a unusual scenario.');
			}

			$('.condition-warning, .condition-error').tipTip({ 'attribute': 'data-tip', 'fadeIn': 50, 'fadeOut': 50, 'delay': 200 });

		});

	});
	$('.wpc-condition-group').trigger('validate-conditions');


	// Price field input
	$(document.body).on('change keyup', '.was_input_decimal[type=text]', function() {
		var regex = new RegExp('[^\-0-9\%\\\.\,]+', 'gi');
		var error = 'i18n_decimal_error';
		var value    = $(this).val();
		var newvalue = value.replace(regex, '');

		if (value !== newvalue) {
			$(this).val(newvalue);
			$(document.body).triggerHandler('wc_add_error_tip', [ $(this), error ]);
		} else {
			$(document.body).triggerHandler('wc_remove_error_tip', [ $(this), error ]);
		}
	});


	// Migration submit
	$('.migrate').on('click', function(event) {
		if ( $('#migrate_zone').val().length == 0 ) {
			return;
		}

		var data = {
			action:  'was_migrate_to_zone',
			zone: 	 $('#migrate_zone').val(),
			rate_id: was.rate_id,
			nonce: 	 was.nonce
		};

		// Loading icon
		$('#was_migrate').block({ message: null, overlayCSS: { background: '#fff', opacity: 0.6 } });

		// Replace value field
		$.post( ajaxurl, data, function( response ) {
			if ( response.error ) {
				console.error(response);
			}

			if ( response.redirect ) {
				location.href = response.redirect;
			}
		});

	});

});
