/* global wp, _wpCustomizeBackground, _tgwcCustomizeControlsL10n */
( function( $, api, data ) {
	'use strict';

	var $resetBtn = $( `<button class="button button-secondary tgwc-customizer-reset" style="float: right; margin-top: 9px">${ data.resetText }</button>` ),
		$customizeHeaderActions = $( '#customize-header-actions' );

	// Modify customize info.
	api.bind( 'ready', function() {
		$( '#customize-info' ).find( '.panel-title.site-title' ).text( data.panelTitle );
		$( '#customize-info' ).find( '.customize-panel-description:first' ).text( data.panelDescription );
		api.section( 'custom_css' ).active( false );

		$customizeHeaderActions.append( $resetBtn );
		$customizeHeaderActions.append( '<style>.tgwc-customizer-reset.updating-message:before { color: #2271b1 !important; }</style>' );

		$resetBtn.on( 'click', function(e) {
			e.preventDefault();
			if ( confirm( data.resetConfirm ) ) {
				$.ajax( {
					type: 'POST',
					url: ajaxurl,
					data: {
						action: 'tgwc_customizer_reset',
						security: data.nonce,
					},
					beforeSend: function() {
						$resetBtn.addClass( 'updating-message' );
					},
				} ).done( function() {
					api.state( 'saved' ).set( true );
					location.reload();
				} ).always( function() {
					$resetBtn.removeClass( 'updating-message' );
				} );
			}
		} );
	} );

	/**
	 * A toggle switch control.
	 *
	 * @class    wp.customize.ToggleControl
	 * @augments wp.customize.Control
	 */
	api.ToggleControl = api.Control.extend( {

		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function() {
			var control = this;

			control.container.on( 'change', 'input:checkbox', function() {
				var value = !!this.checked;
				control.setting.set( value );
			} );
		}
	});

	/**
	 * A range slider control.
	 *
	 * @class    wp.customize.SliderControl
	 * @augments wp.customize.Class
	 */
	api.SliderControl = api.Control.extend( {

		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control    = this,
				$container = control.container,
				$slider    = $container.find( '.everest-forms-slider' ),
				$input     = $container.find( '.everest-forms-slider-input input[type="number"]' ),
				min        = Number( $input.attr( 'min' ) ),
				max        = Number( $input.attr( 'max' ) ),
				step       = Number( $input.attr( 'step' ) );

			$slider.slider( {
				range : 'min',
				min   : min,
				max   : max,
				value : $input.val(),
				step  : step,
				slide: function ( event, ui ) {
					// Trigger keyup in input.
					$input.val( ui.value ).keyup();
				},
				change: function ( event, ui ) {
					control.setting.set( ui.value );
				}
			} );

			control.container.on( 'click', '.reset', function(e) {
				e.preventDefault();
				$slider.slider( 'option', 'value', control.params.default );
			} );

			control.container.on( 'change keyup input', 'input.slider-input', function(e) {
				if ( ( 'keyup' === e.type || 'input' === e.type ) && '' === $( this ).val() ) {
					return;
				}
				$slider.slider( 'option', 'value', $( this ).val() );
			} );
		}
	} );

	/**
	 * A enhanced select2 control.
	 *
	 * @class    wp.customize.Select2Control
	 * @augments wp.customize.Class
	 */
	api.Select2Control = api.Control.extend( {

		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control    = this,
			$container = control.container,
			$select_input = $container.find( '.tgwc-select2' );

			// Enhanced Select2.
			$select_input.select2({
				minimumResultsForSearch: 10,
				allowClear:  !!$select_input.data('allow_clear'),
				placeholder: $select_input.data( 'placeholder' )
			});
		}
	} );

	/**
	 * A dimension control.
	 *
	 * @class    wp.customize.DimensionControl
	 * @augments wp.customize.Class
	 */
	api.DimensionControl = api.Control.extend( {

		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function() {
			var control    = this,
				$container = control.container,
				$inputs    = $container.find( '.dimension-input' );

			// Hide except first responsive item
			control.container.find('.responsive-tabs li:not(:first)').hide();

			control.container.on( 'keyup input', '.dimension-input', function () {
				var this_input = $( this ),
					key        = this_input.attr('name'),
					min        = parseInt( this_input.attr('min') ),
					max        = parseInt( this_input.attr('max') );

				// Number validation for min or max value.
				if( this_input.val() < min ) {
					this_input.val( this_input.attr('min') );
				}
				if( this_input.val() > max ) {
					this_input.val( this_input.attr('max') );
				}
				if( control.is_anchor() ){
					$inputs.each( function(index, input) {
						$( input ).val( this_input.val() );
						control.saveValue( $( input ).attr('name'), this_input.val() );
					} );
				} else {
					control.saveValue( key, this_input.val() );
				}
			} );

			control.container.on( 'change', '.dimension-unit-item input[type="radio"]', function() {
				control.saveValue( 'unit', $( this ).val() );
			} );

			control.container.on( 'change', '.dimension-anchor', function() {
				if( $( this ).is( ':checked' ) ) {
					$( this ).parent( 'label' ).removeClass( 'unlinked' ).addClass( 'linked' );
					$inputs.first().trigger( 'keyup' );
				}else{
					$( this ).parent( 'label' ).removeClass( 'linked' ).addClass( 'unlinked' );
				}
			} );

			control.container.on( 'change', '.responsive-tab-item input[type="radio"]', function() {
				var value = control.get_value();
				var this_value = $(this).val();

				if ( value[this_value] !== undefined ) {
					$inputs.each( function( index, input ) {
						$( input ).val( value[this_value][$( input ).attr('name')] );
					} );
					control.container.find( '.dimension-unit-item input[value="' + value[this_value].unit + '"]' ).attr( 'checked', 'checked' );
				} else{
					$inputs.val( '' );
				}
				control.saveValue( 'top', $container.find( 'input[name="top"]' ).val() );
			} );

			// Hide show buttons.
			control.container.on( 'click', '.responsive-tab-item input[type="radio"]', function() {
				var $this = $( this );
				var current_tab = $this.val();
				var $all_responsive_tabs = $('#customize-controls').find('.responsive-tab-item input[type="radio"][value="' + current_tab + '"]').prop('checked', true);
				$all_responsive_tabs.each(function(index, element) {
					var $tab_item = $( element ).closest( '.responsive-tab-item' ).closest('li');
					if( $tab_item.index() === 0 ){
						$tab_item.siblings().toggle();
					}
				} );
				// Set the toggled device.
				api.previewedDevice.set( current_tab );
			} );
		},

		/**
		 * Returns anchor status.
		 */
		is_anchor: function() {
			return $( this.container ).find( '.dimension-anchor' ).is(':checked');
		},

		/**
		 * Returns responsive selected.
		 */
		selected_responsive: function() {
			return $( this.container ).find( '.responsive-tab-item input[type="radio"]:checked' ).val();
		},

		/**
		 * Returns Unit selected.
		 */
		selected_unit: function() {
			return $( this.container ).find( '.dimension-unit-item input[type="radio"]:checked' ).val();
		},

		/**
		 * Returns Value Object.
		 */
		get_value: function() {
			return Object.assign({}, this.setting._value);
		},

		/**
		 * Saves the value.
		 */
		saveValue: function ( property, value ) {
			var control = this,
				input   = control.container.find('.dimension-hidden-value' ),
				val     = control.get_value();

			if ( control.params.responsive === true ) {
				if ( undefined === val[control.selected_responsive()] ) {
					val[control.selected_responsive()] = {};
				}

				val[control.selected_responsive()][property] = value;
				if ( control.params.unit_choices.length > 0 ) {
					val[control.selected_responsive()].unit = control.selected_unit();
				}
			} else{
				val[property] = value;
				if( Object.keys(control.params.unit_choices).length > 0 ) {
					val.unit = control.selected_unit();
				}
			}

			jQuery( input ).val( JSON.stringify( val ) ).trigger( 'change' );
			control.setting.set( val );
		}
	} );

	/**
	 * An image checkbox control.
	 *
	 * @class    wp.customize.ImageCheckboxControl
	 * @augments wp.customize.Class
	 */
	api.ImageCheckboxControl = api.Control.extend( {

		/**
		 * Initialize behaviors.
		 *
		 * @returns {void}
		 */
		ready: function ready() {
			var control    = this,
				$container = control.container;

			$container.on('change', 'input[type="checkbox"]', function() {
				control.saveValue( $( this ).val(), $( this ).is( ':checked' ) );
			} );
		},

		/**
		 * Saves the value.
		 */
		saveValue: function ( property, value ) {
			var control = this,
				input   = control.container.find('.image-checkbox-hidden-value' ),
				val     = control.params.value;

			val[property] = value;
			val = Object.assign({}, val);

			jQuery( input ).val( JSON.stringify( val ) ).trigger( 'change' );
			control.setting.set( val );
		}
	} );

	api.controlConstructor = $.extend(
		api.controlConstructor, {
			'tgwc-color': api.ColorControl,
			'tgwc-toggle': api.ToggleControl,
			'tgwc-slider': api.SliderControl,
			'tgwc-select2': api.Select2Control,
			'tgwc-dimension': api.DimensionControl,
			'tgwc-background': api.BackgroundControl,
			'tgwc-image_checkbox': api.ImageCheckboxControl,
			'tgwc-background_image': api.BackgroundImageControl,
		}
	);
} )( jQuery, wp.customize, _tgwcControlsData );


/**
 * Custom js for control.
 */
;jQuery( function( $ ) {
	var api     = wp.customize,
		setting = 'tgwc_customize';

	/**
	 * Wrapper: Navigation Style.
	 */
	api.control( setting + '[wrapper][menu_style]', function( control ) {
		var sidebarPositionControl   = api.control( setting + '[wrapper][sidebar_position]' ),
			navWrapperPaddingControl = api.control( setting + '[navigation][general][wrapper_padding]' ),
			navWrapperMarginControl  = api.control( setting + '[navigation][general][wrapper_margin]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'sidebar' === value;
			sidebarPositionControl.active(active);
			navWrapperPaddingControl.active(active);
			navWrapperMarginControl.active(!active);
		} );
	} );

	/**
	 * Navigation -> normal: Border.
	 */
	api.control( setting + '[navigation][normal][border_style]', function( control ) {
		var borderWidthControl = api.control( setting + '[navigation][normal][border_width]' ),
			borderColorControl = api.control( setting + '[navigation][normal][border_color]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'none' !== value;
			borderWidthControl.active(active);
			borderColorControl.active(active);
		} );
	} );

	/**
	 * Navigation -> hover: Border.
	 */
	api.control( setting + '[navigation][hover][border_style]', function( control ) {
		var borderWidthControl = api.control( setting + '[navigation][hover][border_width]' ),
			borderColorControl = api.control( setting + '[navigation][hover][border_color]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'none' !== value;
			borderWidthControl.active(active);
			borderColorControl.active(active);
		} );
	} );

	/**
	 * Input Field -> Normal: Border
	 */
	api.control( setting + '[input_field][normal][border_style]', function( control ) {
		var borderWidthControl = api.control( setting + '[input_field][normal][border_width]' ),
			borderColorControl = api.control( setting + '[input_field][normal][border_color]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'none' !== value;
			borderWidthControl.active(active);
			borderColorControl.active(active);
		} );
	} );

	/**
	 * Input Field -> Focus : Border
	 */
	api.control( setting + '[input_field][focus][border_style]', function( control ) {
		var borderWidthControl = api.control( setting + '[input_field][focus][border_width]' ),
			borderColorControl = api.control( setting + '[input_field][focus][border_color]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'none' !== value;
			borderWidthControl.active(active);
			borderColorControl.active(active);
		} );
	} );

	/**
	 * Buttons -> Normal: Border
	 */
	api.control( setting + '[button][normal][border_style]', function( control ) {
		var borderWidthControl = api.control( setting + '[button][normal][border_width]' ),
			borderColorControl = api.control( setting + '[button][normal][border_color]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'none' !== value;
			borderWidthControl.active(active);
			borderColorControl.active(active);
		} );
	} );

	/**
	 * Buttons -> Focus : Border
	 */
	api.control( setting + '[button][hover][border_style]', function( control ) {
		var borderWidthControl = api.control( setting + '[button][hover][border_width]' ),
			borderColorControl = api.control( setting + '[button][hover][border_color]' );

		control.setting.bind( 'change', function( value ) {
			var active = 'none' !== value;
			borderWidthControl.active(active);
			borderColorControl.active(active);
		} );
	} );
} );


