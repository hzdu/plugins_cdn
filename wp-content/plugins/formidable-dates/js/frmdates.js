jQuery( function( $ ) {

	var frmdates = {
		normalizeSettings: function( fieldSettings ) {
			return $.extend(
				{},
				{ triggerID: fieldSettings.triggerID, repeating: -1 !== fieldSettings.triggerID.indexOf( '^' ), locale: fieldSettings.locale },
				{ datepickerOptions: fieldSettings.options },
				fieldSettings.formidable_dates
			);
		},

		getTargets: function( fieldConfig ) {
			var targets = [];

			$( fieldConfig.triggerID ).each(
				function() {
					if ( fieldConfig.repeating && fieldConfig.inline ) {
						targets.push( $( this ).siblings( '.frm_date_inline' ) );
					} else {
						targets.push( $( this ) );
					}
				}
			);

			return targets;
		},

		setupFields: function() {
			var hasSettings,
				dateSettings = window.__frmDatepicker;

			$.each(
				dateSettings,
				function() {
					if ( 'undefined' !== typeof this.formidable_dates && this.formidable_dates ) {

						// Trigger changes if any field in the form has extended settings.
						hasSettings = true;
					}
				}
			);

			if ( ! hasSettings ) {
				return;
			}

			$.each( dateSettings, function( index ) {
				var fieldConfig = frmdates.normalizeSettings( this ),
					hasConfig = 'undefined' !== typeof this.formidable_dates && this.formidable_dates;

				if ( 0 === $( fieldConfig.triggerID ).length ) {
					return;
				}

				if ( ! hasConfig ) {

					// Trigger changes in case other fields depend on it.
					window.__frmDatepicker[ index ].options.onSelect = $.proxy( frmdates.callbacks.onSelect, fieldConfig );
					return;
				}

				fieldConfig.datepickerOptions.beforeShowDay = $.proxy( frmdates.callbacks.beforeShowDay, fieldConfig );
				fieldConfig.datepickerOptions.onSelect      = $.proxy( frmdates.callbacks.onSelect, fieldConfig );
				fieldConfig.datepickerOptions.minDate       = ! fieldConfig.repeating ? frmdates.getMinOrMaxDate( 'minimum_date', fieldConfig ) : null;
				fieldConfig.datepickerOptions.maxDate       = ! fieldConfig.repeating ? frmdates.getMinOrMaxDate( 'maximum_date', fieldConfig ) : null;

				// Hijack global settings so our functions are called.
				window.__frmDatepicker[ index ].options = fieldConfig.datepickerOptions;

				$.each( frmdates.getTargets( fieldConfig ), function() {
					var altField, dateFormat,
						localConfig = fieldConfig.datepickerOptions;

					if ( fieldConfig.inline ) {
						altField = document.getElementById( this.attr( 'id' ) + '_alt' );
						if ( null !== altField && '' !== altField.value ) {
							dateFormat = this.datepicker( 'option', 'dateFormat' );

							if ( null !== dateFormat ) {
								localConfig.defaultDate = this.datepicker( 'getDate' );
							} else {
								localConfig.defaultDate = altField.value;
							}
						}

						//Calculating default date based on offset
						frmdates.defaultDateOffset( fieldConfig, localConfig );

					}

					if ( fieldConfig.repeating ) {

						// Min. or max. date might need to be computed based on the repeating container.
						localConfig = $.extend(
							localConfig,
							{
								minDate: frmdates.getMinOrMaxDate( 'minimum_date', fieldConfig, this ),
								maxDate: frmdates.getMinOrMaxDate( 'maximum_date', fieldConfig, this )
							}
						);
					}

					localConfig = frmdates.adjustYearRange( localConfig );

					// Handle localization.
					localConfig = $.extend(
						{}, $.datepicker.regional[ fieldConfig.locale ], localConfig
					);

					if ( this.data( 'frmdates_configured' ) || this.hasClass( 'hasDatepicker' ) ) {
						this.datepicker( 'option', localConfig );
					} else {
						this.datepicker( localConfig );
					}

					if ( ! localConfig.defaultDate && fieldConfig.inline ) {
						this.datepicker( 'setDate', null );
						this.find( '.ui-state-active' ).removeClass( 'ui-state-active ui-state-hover' ).parent().removeClass( 'ui-datepicker-current-day' );
					}

					this.data( 'frmdates_configured', true );

					if ( fieldConfig.repeating && fieldConfig.inline ) {
						altField = this.closest( '.frm_repeat_sec, .frm_repeat_inline, .frm_repeat_grid' ).find( 'input[id^="' + this.attr( 'id' ) + '"]' );
						if ( altField.length > 0 ) {
							this.datepicker( 'option', 'altField', altField );
						}
					}
				});
			});
		},

		getMinOrMaxDate: function( limit, field, $instance ) {
			var $container, $sourceField, condition, val,
				result = null;

			condition = field[ limit + '_cond' ];
			if ( ! condition ) {
				return null;
			}

			val = field[ limit + '_val' ];

			// Specific date.
			if ( 'date' === condition ) {
				return $.datepicker.parseDate( 'yy-mm-dd', val );
			}

			// Relative dates.
			if ( 'today' === condition ) {
				result = new Date();
			} else if ( 'field_' === condition.substr( 0, 6 ) ) {

				// First search for the condition field inside the same repeating container.
				if ( field.repeating && $instance ) {
					$container   = $instance.closest( '.frm_repeat_sec, .frm_repeat_inline, .frm_repeat_grid' );
					$sourceField = $container.find( '[id^="' + condition + '"].frm_date_inline' );
					$sourceField = ( 0 === $sourceField.length ) ? $container.find( 'input[id^="' + condition + '"]' ) : $sourceField;
				}

				$sourceField = ( ! $sourceField || 0 === $sourceField.length ) ? $( '#' + condition ) : $sourceField;

				if ( $sourceField && 1 === $sourceField.length ) {

					// The field might be on a different page and it's hidden now.
					if ( $sourceField.is( 'input[type="hidden"]' ) ) {

						// All date fields use the same dateFormat value, so we can re-use the one from `field`.
						result = $.datepicker.parseDate( field.datepickerOptions.dateFormat, $sourceField.val() );
					} else {
						result = $sourceField.datepicker( 'getDate' );
					}
				}

				if ( ! result ) {
					return null;
				}
			}

			result = this.applyDateOffset( result, val );
			return result;
		},

		adjustYearRange: function( localConfig ) {
			var parts = localConfig.yearRange.split( ':' ),
				start = parts[0],
				end = parts[1];

			if ( null !== localConfig.minDate ) {
				start = localConfig.minDate.getFullYear();
			}

			if ( null !== localConfig.maxDate ) {
				end = localConfig.maxDate.getFullYear();
			}

			return $.extend(
				localConfig,
				{
					yearRange: start + ':' + end
				}
			);
		},

		applyDateOffset: function( date, offset_ ) {
			var offset, matches, day,
				pattern = /([+\-]?[0-9]+)\s*(d|day|days|w|week|weeks|m|month|months|y|year|years)?/g;

			if ( ! offset_ ) {
				return date;
			}

			offset  = offset_.toLowerCase();
			matches = pattern.exec( offset );

			day = 0;

			while ( matches ) {
				switch ( matches[2]) {
					case 'd':
					case 'day':
					case 'days':
						day += parseInt( matches[1], 10 );
						break;
					case 'w':
					case 'week':
					case 'weeks':
						day += parseInt( matches[1], 10 ) * 7;
						break;
					case 'm':
					case 'month':
					case 'months':
						day += parseInt( matches[1], 10 ) * 30.42;
						break;
					case 'y':
					case 'year':
					case 'years':
						day += parseInt( matches[1], 10 ) * 365.25;
						break;
				}

				matches = pattern.exec( offset );
			}

			date.setDate( date.getDate() + day );
			date.setHours( 0 );
			date.setMinutes( 0 );
			date.setSeconds( 0 );
			date.setMilliseconds( 0 );

			return date;
		},

		init: function() {
			if ( 'undefined' === typeof window.__frmDatepicker || ! window.__frmDatepicker ) {
				return;
			}

			frmdates.setupFields();

			$( document ).on( 'frmPageChanged', frmdates.setupFields );
			$( document ).on( 'frmAfterAddRow frmAfterRemoveRow', frmdates.setupFields );
			$( document ).on( 'frmdates_date_changed', frmdates.callbacks.dateChanged );
		},

		defaultDateOffset: function( fieldConfig, localConfig ) {
			var isAllowed,
				defaultDate = fieldConfig.datepickerOptions.defaultDate,
				minDate = fieldConfig.datepickerOptions.minDate;

			if ( null === defaultDate || '' === defaultDate ) {
				return;
			}

			defaultDate = new Date( defaultDate );
			if ( minDate && defaultDate < minDate ) {
				defaultDate = minDate;
			}

			do {
				isAllowed = fieldConfig.datepickerOptions.beforeShowDay( defaultDate );
				isAllowed = isAllowed[0];

				if ( false === isAllowed ) {
					defaultDate = frmdates.defaultDate( defaultDate );
				}
			}
			while ( false === isAllowed );

			localConfig.defaultDate = defaultDate;
		},

		defaultDate: function( _date ) {
			_date.setDate( _date.getDate() + 1 );
			return _date;
		},

		callbacks: {
			beforeShowDay: function( date ) {
				var day, year, month, day_, dateISO, d, y, m,
					isAllowed = false;

				if ( ! date ) {
					return [ true, '' ];
				}

				day     = date.getDay();
				year    = date.getFullYear();
				month   = ( '0' + ( date.getMonth() + 1 ) ).slice( -2 );
				day_    = ( '0' + date.getDate() ).slice( -2 );
				dateISO = year + '-' + month + '-' + day_;

				y = year;
				d = date.getDate();
				m = date.getMonth() + 1;

				if ( -1 !== $.inArray( dateISO, this.datesEnabled ) ) {
					isAllowed = true;
				} else if ( -1 !== $.inArray( dateISO, this.datesDisabled ) ) {
					isAllowed = false;
				} else if ( -1 !== $.inArray( day, this.daysEnabled ) ) {
					isAllowed = true;
				}

				return [ isAllowed && eval( this.selectableResponse ), '' ];
			},

			onSelect: function( dateText, instance ) {
				var field, fieldId, mockEventObject;

				field = instance.input.get( 0 );
				fieldId = frmdates.getFieldIdFromField( field );
				mockEventObject = {
					currentTarget: field,
					type: 'change',
					target: field
				};

				$( document ).trigger( 'frmdates_date_changed', [ this, dateText, instance ]);
				$( document ).trigger( 'frmFieldChanged', [ field, fieldId, mockEventObject ]);
				instance.input.trigger( 'change' );
			},

			dateChanged: function() {
				frmdates.setupFields(); // TODO: For now, we refresh everything, but we should be more clever here.
			}
		},

		getFieldIdFromField: function( field ) {
			var $parentFormField, strippedFieldIdString, fieldIdParts;

			$parentFormField = jQuery( field ).closest( '.frm_form_field' );
			strippedFieldIdString = $parentFormField.attr( 'id' ).replace( 'frm_field_', '' ).replace( '_container', '' );
			fieldIdParts = strippedFieldIdString.split( '-' );

			return fieldIdParts[0];
		}
	};

    frmdates.init();

});
