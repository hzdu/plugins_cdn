/**
 * @typedef {object} ConditionRule
 * @property {string} condition
 * @property {string} field
 * @property {string} value
 */

/** @typedef {('and'|'or')} ConditionOperator */
/** @typedef {('show'|'hide')} ConditionAction */

/**
 * @typedef {object} FCFFieldCondition
 * @property {string} conditional_logic_fields
 * @property {ConditionAction} conditional_logic_fields_action
 * @property {ConditionOperator} conditional_logic_fields_operator
 * @property {ConditionRule[]} conditional_logic_fields_rules
 */
/**
 * @typedef {object} FCFShippingCondition
 * @property conditional_logic_shipping_fields
 * @property conditional_logic_shipping_rules
 * @property conditional_logic_shipping_fields_rules
 * @property {ConditionAction} conditional_logic_shipping_fields_action
 */

( function ( $ ) {

	const fcfConditions         = /** @type {FCFFieldCondition} */ ( window.fcf_conditions )
	const fcfShippingConditions = /** @type {FCFShippingCondition} */ ( window.fcf_shipping_conditions )

	/** @type {boolean} */
	let conditionValueChanged = false;

	/** @return {boolean} */
	function hasConditionValueChanged() {
		return !! conditionValueChanged;
	}

	function fieldExists( field ) {
		return $( field ).length > 0;
	}

	function hideField( field_to_hide ) {
		$( field_to_hide ).hide();
		$( field_to_hide ).removeClass( 'validate-required' );
		$( field_to_hide ).find( 'input,textarea,select' ).attr( 'disabled', true );
		$( field_to_hide ).addClass( 'fcf-hidden' );
	}

	function displayField( field_to_hide ) {
		$( field_to_hide ).show();
		$( field_to_hide ).find( 'input,textarea,select' ).attr( 'disabled', false );
		$( field_to_hide ).removeClass( 'fcf-hidden' );
	}

	var is_manual_event_disabled = false;

	function fcf_fields_conditions( is_manual_event = false ) {
		if ( is_manual_event_disabled ) {
			is_manual_event = false;
		}

		conditionValueChanged = false;
		$.each( fcfConditions, function ( condition, conditionDefinition ) {
			let field_to_hide = $( '#' + condition + '_field' );
			if ( ! fieldExists( field_to_hide ) ) {
				return
			}

			let user_chosen_shipping_method                    = '';
			let conditional_logic_logic_shipping_fields_action = '';
			let fcf_selected_shipping_method                   = '';
			let fcf_selected_shipping_method_no_zone           = '';
			let conditional_logic_shipping_fields              = '';

			$.each( fcfShippingConditions, function ( _, shippingConditionDefinition ) {
				conditional_logic_shipping_fields              = shippingConditionDefinition.conditional_logic_shipping_fields;
				conditional_logic_logic_shipping_fields_action = shippingConditionDefinition.conditional_logic_shipping_fields_action;
				var fcf_shipping_rules                         = shippingConditionDefinition.conditional_logic_shipping_fields_rules;

				if ( fcf_shipping_rules.length !== 0 ) {
					$.each( fcf_shipping_rules, function ( _, value_rule ) {
						fcf_selected_shipping_method         = value_rule.value;
						fcf_selected_shipping_method_no_zone = value_rule.no_zone_value;

						$.each( $( 'input[name^="shipping_method"]:checked' ), function () {
							user_chosen_shipping_method = $( this ).val();
						} );
						if ( user_chosen_shipping_method.toLowerCase().indexOf( ':fallback' ) >= 0 ) {
							user_chosen_shipping_method = user_chosen_shipping_method.split( ':fallback' )[ 0 ];
						}
					} );
				}
			} );

			let conditionFulfilled = false;
			if ( conditionDefinition.conditional_logic_fields_operator === 'and' ) {
				conditionFulfilled = true;
			}
			$.each( conditionDefinition.conditional_logic_fields_rules, function ( _, conditionRule ) {
				conditionFulfilled = isConditionFulfilled(
					conditionFulfilled,
					conditionRule,
					conditionDefinition.conditional_logic_fields_operator
				);
			} );

			var hidden        = conditional_logic_fields_show_or_hide(
				user_chosen_shipping_method,
				fcf_selected_shipping_method,
				conditional_logic_logic_shipping_fields_action,
				conditionDefinition,
				conditionFulfilled
			);

			/**
			 * @param field
			 * @return {boolean}
			 */
			function fieldRequiresChange( field ) {
				return $( field ).is( ':hidden' ) !== hidden;
			}

			if ( fieldRequiresChange( field_to_hide ) ) {
				if ( hidden ) {
					hideField( field_to_hide );
				} else {
					displayField( field_to_hide );
				}

				$( field_to_hide ).trigger( 'change' );

				conditionValueChanged = true
			}
		} );

		if ( is_manual_event && hasConditionValueChanged() ) {
			$( 'body' ).trigger( 'update_checkout' );
		}
	}

	/**
	 *
	 * @param {ConditionOperator} operator
	 * @param {boolean} match
	 * @param {boolean} field_matched
	 * @return {boolean}
	 */
	function conditional_logic_fields_operator_value(
		operator,
		match,
		field_matched
	) {
		if ( field_matched === true && operator === 'or' ) {
			return true;
		}
		if ( field_matched !== true && operator === 'and' ) {
			return false;
		}

		return match = match || false;
	}

	/**
	 * @param {boolean} initial
	 * @param {ConditionRule} conditionRule
	 * @param {ConditionOperator} operator
	 * @return {boolean}
	 */
	function isConditionFulfilled( initial, conditionRule, operator ) {
		let match       = initial;
		let field_value = fcf_field_value( conditionRule.field );
		if ( conditionRule.condition === 'is' ) {
			if ( field_value === conditionRule.value ) {
				match = conditional_logic_fields_operator_value( operator, match, true );
			} else {
				match = conditional_logic_fields_operator_value( operator, match, false );
			}
		}

		return match;
	}

	/**
	 *
	 * @param {string} user_chosen_shipping_method
	 * @param {string} fcf_selected_shipping_method
	 * @param {ConditionAction|''} conditional_logic_logic_shipping_fields_action
	 * @param {FCFFieldCondition} conditionDefinition
	 * @param {boolean} conditionFulfilled
	 * @return {boolean}
	 */
	function conditional_logic_fields_show_or_hide(
		user_chosen_shipping_method,
		fcf_selected_shipping_method,
		conditional_logic_logic_shipping_fields_action,
		conditionDefinition,
		conditionFulfilled
	) {

		let hidden = true;

		if ( user_chosen_shipping_method.match( fcf_selected_shipping_method ) && conditional_logic_logic_shipping_fields_action === 'hide' ) {
			if ( conditionDefinition.conditional_logic_fields_action === 'hide' ) {
				hidden = conditionFulfilled;
			}
		}
		if ( user_chosen_shipping_method.match( fcf_selected_shipping_method ) && conditional_logic_logic_shipping_fields_action === 'show' ) {
			if ( conditionDefinition.conditional_logic_fields_action === 'show' ) {
				hidden = ! conditionFulfilled;
			}
		}

		if ( conditionDefinition.conditional_logic_fields_action === 'hide' ) {
			hidden = conditionFulfilled;
		}
		if ( conditionDefinition.conditional_logic_fields_action === 'show' ) {
			hidden = ! conditionFulfilled;
		}


		return hidden;
	}

	$( document ).on( 'change', 'input', function ( e ) {
		fcf_fields_conditions( true );
	} );
	$( document ).on( 'change', 'select', function () {
		fcf_fields_conditions( true );
	} );
	$( 'body' ).on( 'update_checkout', function () {
		is_manual_event_disabled = true;
	} );
	$( 'body' ).on( 'updated_checkout', function () {
		fcf_fields_conditions();
		is_manual_event_disabled = false;
	} );

	fcf_fields_conditions( true );
} )( jQuery );


/**
 * Returns field value.
 * Hidden fields has empty value.
 *
 * @param {string} field_name
 * @returns {string}
 */
function fcf_field_value( field_name ) {
	let field_value  = '';
	let input_field  = jQuery( 'input[name=' + field_name + ']' );
	let select_field = jQuery( 'select[name=' + field_name + ']' );
	if ( jQuery( input_field ).attr( 'type' ) === 'radio' ) {
		field_value = jQuery( 'input[name=' + field_name + ']:checked' ).val();
	} else if ( jQuery( input_field ).attr( 'type' ) === 'checkbox' ) {
		field_value = 'unchecked';
		if ( jQuery( input_field ).is( ':checked' ) ) {
			field_value = 'checked';
		}
	} else {
		field_value = jQuery( input_field ).val();
		if ( typeof field_value === 'undefined' ) {
			field_value = jQuery( select_field ).val();
		}
	}
	return field_value;
}
