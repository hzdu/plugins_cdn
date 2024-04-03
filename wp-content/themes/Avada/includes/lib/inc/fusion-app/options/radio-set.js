var FusionPageBuilder = FusionPageBuilder || {};
FusionPageBuilder.options = FusionPageBuilder.options || {};

FusionPageBuilder.options.radioButtonSet = {
	optionRadioButtonSet: function( $element ) {
		var $radiobuttonsets, $radiobuttonset, $radiosetcontainer, optionId, $subGroup, $subgroupWrapper,
			self = this;

		$element         = $element || this.$el;
		$radiobuttonsets = $element.find( '.fusion-form-radio-button-set' );
		const $tabs = $element.parent();

		if ( $radiobuttonsets.length ) {
			$radiobuttonsets.each( function() {
				$radiobuttonset = jQuery( this );
				optionId        = $radiobuttonset.closest( '.fusion-builder-option' ).attr( 'data-option-id' );

				if ( 'color_scheme' !== optionId && 'scheme_type' !== optionId ) {
					$radiobuttonset.find( 'a' ).on( 'click', function( event ) {
						event.preventDefault();
						$radiosetcontainer = jQuery( this ).closest( '.fusion-form-radio-button-set' );
						$subGroup          = $radiosetcontainer.closest( '.fusion-builder-option.subgroup' );
						optionId           = $subGroup.attr( 'data-option-id' );

						$radiosetcontainer.find( '.ui-state-active' ).removeClass( 'ui-state-active' );
						jQuery( this ).addClass( 'ui-state-active' );
						$radiosetcontainer.find( '.button-set-value' ).val( $radiosetcontainer.find( '.ui-state-active' ).data( 'value' ) ).trigger( 'change' );
						jQuery( this ).blur();

						if ( $subGroup.length ) {
							$subgroupWrapper = $subGroup.parent();
							$subgroupWrapper.find( '.fusion-subgroup-content[data-group="' + optionId + '"]' ).removeClass( 'active' );
							$subgroupWrapper.find( '.fusion-subgroup-' + $radiosetcontainer.find( '.ui-state-active' ).data( 'value' ) + '[data-group="' + optionId + '"]' ).addClass( 'active' );
						}
					} );
				} else {
					$radiobuttonset.find( 'a' ).on( 'click', function( event ) {
						event.preventDefault();
						if ( 'function' === typeof self.colorSchemeImport ) {
							self.colorSchemeImport( jQuery( event.currentTarget ), jQuery( event.currentTarget ).closest( '.fusion-builder-option' ) );
						}
					} );
				}

				// Radio buttons soft dependencies. for now its check single dependency support == and != operators only.
				if ( $radiobuttonset.find( 'a[data-dependency]' ).length ) {
					$radiobuttonset.find( 'a[data-dependency]' ).each( function() {
						const prop = jQuery( this ).data( 'dependency' );
						const value = jQuery( this ).data( 'dependency-value' );
						const operator = jQuery( this ).data( 'dependency-operator' ) || '==';

						const currentValue = $tabs.find( `input#${prop}` ).val();

						if ( '==' === operator ) {
							if ( currentValue == value ) {
								jQuery( this ).show();
							} else {
								jQuery( this ).hide();
							}
						}

						if ( '!=' === operator ) {
							if ( currentValue != value ) {
								jQuery( this ).show();
							} else {
								jQuery( this ).hide();
							}
						}

					} );

				}

			} );
		}

		if ( $tabs.find( '.fusion-form-radio-button-set a[data-dependency]' ).length ) {
			$tabs.find( '.fusion-form-radio-button-set a[data-dependency]' ).each( function() {
				const $btn = jQuery( this );
				const prop = jQuery( this ).data( 'dependency' );
				const value = jQuery( this ).data( 'dependency-value' );
				const operator = jQuery( this ).data( 'dependency-operator' ) || '==';

				$tabs.find( 'input#' + prop ).on( 'change', function() {
					const currentValue = jQuery( this ).val();

					if ( '==' === operator ) {
						if ( currentValue == value ) {
							$btn.show();
						} else {
							$btn.hide();
						}
					}

					if ( '!=' === operator ) {
						if ( currentValue != value ) {
							$btn.show();
						} else {
							$btn.hide();
						}
					}
				} );
			} );
		}

	}
};
