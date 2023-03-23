jQuery( function( $ ) {

	var frmdatesAdmin = {
		init: function() {
			var $form = $( '#new_fields' );
			var originalCallback;

			if ( 0 === $form.length ) {
				return;
			}

			$form.on( 'click', '.frmdates_add_blackout_date_link', $.proxy( this.addBlackOutDatesHandler, this ) );
			$form.on( 'click', '.frmdates_add_exception_link', $.proxy( this.addExceptionHandler, this ) );
			$form.on( 'click', '.frmdates_date_list .frmdates_remove_item', $.proxy( this.removeDateHandler, this ) );
			$form.on( 'click', '.frmdates_date_list .frmdates_show_all_placeholder', $.proxy( this.showAllHandler, this ) );
			$form.on( 'change', '.frmdates_days_of_the_week input[type="checkbox"]', $.proxy( this.daysOfTheWeekChangeHandler, this ) );
			$form.on( 'change', '.frmdates_days_of_the_week_toggle input[type="checkbox"]', $.proxy( this.daysOfTheWeekToggleHandler, this ) );
			$form.on( 'change', '.frm_date_show', $.proxy( this.showHide, this ) );

			// Hack jQuery UI Datepicker to prevent closing of the dialog when a date is selected (only inside our
			// datepickers).
			originalCallback = $.datepicker._hideDatepicker;
			$.datepicker._hideDatepicker = function() {
				var inst = this._curInst;
				var target = this._curInst.input[0];
				var wasDateSelected = ( 'undefined' !== typeof inst.frmDatesDateSelected && inst.frmDatesDateSelected );

				if ( wasDateSelected ) {
					inst.frmDatesDateSelected = false;
					$( target ).datepicker( 'refresh' );

					return;
				}

				return originalCallback.apply( this, arguments );
			};
		},

		showCalendar: function( fieldID, dateType ) {
			var $container, $field;
			var t = this;

			$container = $( '#frmdates_' + dateType + '_' + fieldID );
			if ( 0 === $container.length ) {
				return;
			}

			// Setup date picker for field (if needed).
			$field = $container.find( '.frmdates_datepicker' );
			if ( 0 === $field.length ) {
				return;
			}

			if ( ! $field.hasClass( 'hasDatepicker' ) ) {
				$field.datepicker({
					dateFormat: 'yy-mm-dd',
					changeMonth: true,
					changeYear: true,
					beforeShow: function() {
					},
					onSelect: function( date, inst ) {
						t.toggleDateInList( fieldID, dateType, date );
						inst.frmDatesDateSelected = true;
					},
					showButtonPanel: true,
					beforeShowDay: function( d ) {
						return t.beforeShowDayHandler( fieldID, dateType, d );
					}
				});
			}
			$field.datepicker(
				'option',
				'yearRange',
				$( 'input[name="field_options[start_year_' + fieldID + '][]"]' ).val() + ':' + $( 'input[name="field_options[end_year_' + fieldID + ']"]' ).val()
			);

			$field.datepicker( 'show' );
		},

		getDaysOfTheWeek: function( fieldID ) {
			var $checked = $( 'input[name="field_options[days_of_the_week_' + fieldID + '][]"]:checked' );
			if ( $checked.length > 0 ) {
				return $checked.map(
					function() {
						return parseInt( $( this ).val(), 10 );
					}
				).get();
			}

			return [];
		},

		getDatesInList: function( fieldID, dateType ) {
			var $items = $( '#frmdates_' + dateType + '_' + fieldID + ' .frmdates_date_list_item' );
			var result = [];

			$items.each(
				function() {
					result.push( $( this ).data( 'date' ) );
				}
			);

			return result;
		},

		addDateToList: function( fieldID, dateType, date ) {
			var $container, $list, $items, $item, $nextItems;
			var dateObj;
			var html;

			$container = $( '#frmdates_' + dateType + '_' + fieldID );
			if ( 0 === $container.length ) {
				return;
			}

			$list = $container.find( '.frmdates_date_list' );
			$items = $list.find( '.frmdates_date_list_item' );

			// Check if item already exists.
			if ( $items.filter( '[data-date="' + date + '"]' ).length > 0 ) {
				return;
			}

			// Parse date for future reference.
			dateObj = null;
			try {
				dateObj = $.datepicker.parseDate( 'yy-mm-dd', date );
			} catch ( err ) {
				return;
			}

			html = window.frmdates_admin_js.itemTemplate;
			html = html.replace( /%DATE%/g, date );
			html = html.replace( /%DATE_WITH_FORMAT%/g, $.datepicker.formatDate( window.frmdates_admin_js.dateFormat, dateObj ) );
			html = html.replace( /%DATE_TYPE%/g, dateType );
			html = html.replace( /%FIELD_ID%/g, fieldID );

			$item = $( html );

			// Insert the item at the correct position (maintains order).
			$nextItems = $items.filter(
				function() {
					return $( this ).data( 'date' ) > date;
				}
			);

			if ( $nextItems.length > 0 ) {
				$item.insertBefore( $nextItems.first() );
			} else {
				$list.append( $item );
			}

			// Show everything.
			$list.find( '.frmdates_show_all_placeholder' ).hide();
			$items.removeClass( 'frm_hidden' );
			$item.effect( 'highlight', 'slow' );
		},

		removeDateFromList: function( fieldID, dateType, date ) {
			var $item, $list, $items, $placeholder;
			var itemCount;

			$list = $( '#frmdates_' + dateType + '_' + fieldID + ' .frmdates_date_list' );
			$item = $list.find( '.frmdates_date_list_item[data-date="' + date + '"]' );

			if ( 0 === $item.length ) {
				return false;
			}

			$item.remove();

			$items = $list.find( '.frmdates_date_list_item' );
			$items.filter( ':lt(5)' ).removeClass( 'frm_hidden' );

			// Update count for placeholder or hide it completely.
			itemCount = $items.length;
			$placeholder = $list.find( '.frmdates_show_all_placeholder' );
			if ( itemCount <= 5 ) {
				$placeholder.hide();
			} else {
				$placeholder.find( '.count' ).text( itemCount - 5 );
			}

			return true;
		},

		toggleDateInList: function( fieldID, dateType, date ) {
			if ( -1 === $.inArray( date, this.getDatesInList( fieldID, dateType ) ) ) {
				return this.addDateToList( fieldID, dateType, date );
			} else {
				return this.removeDateFromList( fieldID, dateType, date );
			}
		},

		addBlackOutDatesHandler: function( e ) {
			var $link = $( e.target );
			var fieldID = $link.data( 'field-id' );

			e.preventDefault();

			this.showCalendar( fieldID, 'blackout_dates' );
		},

		addExceptionHandler: function( e ) {
			var $link = $( e.target );
			var fieldID = $link.data( 'field-id' );

			e.preventDefault();

			this.showCalendar( fieldID, 'excepted_dates' );
		},

		removeDateHandler: function( e ) {
			var $link, $item, $list;

			e.preventDefault();

			$link = $( e.target );
			$item = $link.parents( '.frmdates_date_list_item' );
			$list = $item.parents( '.frmdates_date_list' );

			this.removeDateFromList( $list.data( 'field-id' ), $list.data( 'date-type' ), $item.data( 'date' ) );
		},

		showAllHandler: function( e ) {
			var $target = $( e.target );
			var $li     = $target.is( 'li' ) ? $target : $target.parents( 'li' );
			var $list   = $li.parents( '.frmdates_date_list' );
			var $items = $list.find( '.frmdates_date_list_item' );

			e.preventDefault();

			$li.hide();
			$items.removeClass( 'frm_hidden' );
		},

		daysOfTheWeekChangeHandler: function( e ) {
			var $target = $( e.target );
			var fieldID = $target.parents( '.frm_field_box' ).data( 'fid' );
			var $exceptionsRow = $( '#frmdates_excepted_dates_row_' + fieldID );
			var $allDaysToggle = $( '#frmdates_days_of_the_week_toggle_' + fieldID );
			var $days = $( '#frmdates_days_of_the_week_' + fieldID );
			var days = this.getDaysOfTheWeek( fieldID );

			if ( 7 === days.length ) {
				$exceptionsRow.hide();
				$allDaysToggle.prop( 'checked', true );
				$allDaysToggle.parent().show();
				$days.hide();
			} else {
				$exceptionsRow.show();
			}
		},

		daysOfTheWeekToggleHandler: function( e ) {
			var $target = $( e.target );
			var fieldID = $target.parents( '.frm_field_box, .frm-single-settings' ).data( 'fid' );
			var $days = $( 'input[name="field_options[days_of_the_week_' + fieldID + '][]"]' );
			var checked = $target.prop( 'checked' );

			if ( checked ) {
				$days.prop( 'checked', true );
				$target.parent().show();
			} else {
				$target.parent().hide();
				$( '#frmdates_days_of_the_week_' + fieldID ).show();
			}
		},

		beforeShowDayHandler: function( fieldID, dateType, d ) {
			var enabled  = true;
			var cssClass = '';
			var dateISO  = d.getFullYear() + '-' + ( '0' + ( d.getMonth() + 1 ) ).slice( -2 ) + '-' + ( '0' + d.getDate() ).slice( -2 );
			var inDaysOfTheWeek = ( -1 < $.inArray( d.getDay(), this.getDaysOfTheWeek( fieldID ) ) );

			if ( ( 'blackout_dates' === dateType && ! inDaysOfTheWeek ) || ( 'excepted_dates' === dateType && inDaysOfTheWeek ) ) {
				enabled = false;
			}

			if ( enabled ) {
				if ( 0 <= $.inArray( dateISO, this.getDatesInList( fieldID, dateType ) ) ) {
					cssClass = 'frm-selected-date';
				}
			}

			return [ enabled, cssClass ];
		},

		showHide: function( e ) {
			var showDiv = '',
				hideDiv = '',
				$target = $( e.target ),
				toShow = $target.data( 'show' ),
				toHide = $target.data( 'hide' ),
				requiredVal = $target.data( 'value' ),
				value = $target.val();

			if ( $target.is( ':checkbox' ) && ! $target.is( ':checked' ) ) {
				value = '';
			}

			if ( 'undefined' !== typeof toShow ) {
				showDiv = $target.closest( 'td' ).find( '.' + toShow );
			}

			if ( 'undefined' !== typeof toHide ) {
				hideDiv = $target.closest( 'td' ).find( '.' + toHide );
			}

			if ( value.toString() === requiredVal.toString() ) {
				this.showNow( showDiv, $target.data( 'default' ), value );

				if ( '' !== hideDiv ) {
					hideDiv.fadeOut();
				}
			} else {
				if ( '' !== showDiv ) {
					showDiv.fadeOut();
				}

				this.showNow( hideDiv, $target.data( 'default' ), value );
			}
		},

		showNow: function( showDiv, defaultVal, value ) {
			if ( '' !== showDiv ) {
				showDiv.fadeIn();
				defaultVal = this.getDefaultValue( defaultVal, value );
				if ( '' !== defaultVal ) {
					showDiv.attr( 'placeholder', defaultVal );
				}
			}
		},

		getDefaultValue: function( defaultVal, value ) {
			var opts, valueOpt, i;

			if ( 'undefined' !== typeof defaultVal ) {
				opts = defaultVal.split( '|' );
				for ( i = 0; i < opts.length ; i++ ) {
					valueOpt = opts[i].split( ':' );
					if ( valueOpt[0] === value || valueOpt[0] === '' ) {
						return valueOpt[1];
					}
				}
			}
		}
	};

	frmdatesAdmin.init();

});

