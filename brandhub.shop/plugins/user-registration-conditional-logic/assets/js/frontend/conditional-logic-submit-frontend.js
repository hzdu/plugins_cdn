/**
 * URCLConditional JS Frontend
 */

(function($) {

    var URCLConditionalLogic = {
        data: {
            /**
             * Stores whether current form is multipart form or not.
             * @type bool
             */
            is_multipart_form: null,

            /**
             * Submit button object.
             * @type jQuery object
             */
            submitBtn: null,

            /**
             * State of Submit button.
             *
             * @type bool
             */
            submitBtnState: null,
        },

		/**
		 * Start the engine.
		 */
        init: function() {

            URCLConditionalLogic.data.show_and_conditions = [];
            URCLConditionalLogic.data.show_or_or_conditions = [];

            URCLConditionalLogic.data.hide_and_conditions = [];
            URCLConditionalLogic.data.hide_or_or_conditions = [];

            URCLConditionalLogic.data.disable_and_conditions = [];
            URCLConditionalLogic.data.disable_or_or_conditions = [];

            // Document ready
			$(document).ready(URCLConditionalLogic.ready);

			URCLConditionalLogic.bindUIActions();
		},

        ready: function() {
            URCLConditionalLogic.get_conditional_rules();

            // Evaluate conditions and show/hide/disable submit button.
            URCLConditionalLogic.applyLogic();
		},

		/**
		 * Element bindings.
		 *
		 */
		 bindUIActions: function() {
            $('.ur-frontend-field, .urwc-field-input').on('input change', function () {
                URCLConditionalLogic.applyLogic();
                URCLConditionalLogic.handleMultipart();
            });

            $('.ur-multipart-form').on( 'user_registration_multipart_part_changed', function( event, data ) {
               URCLConditionalLogic.handleMultipart();
            });

		},

        applyLogic: function() {
            let submitBtn = $('button.ur-submit-button[type="submit"]');
            URCLConditionalLogic.data.submitBtn = submitBtn;

            // For show.
            let showAnd = URCLConditionalLogic.evaluateCondition(URCLConditionalLogic.data.show_and_conditions, 'and', 'show'),
                showOr  = URCLConditionalLogic.evaluateCondition(URCLConditionalLogic.data.show_or_or_conditions, 'or', 'show');

            if( showAnd && showOr ) {
                URCLConditionalLogic.changeState( 'show' );
            } else if( showAnd || showOr ) {
                URCLConditionalLogic.changeState( 'show' );
            } else if ( '' === showAnd && '' === showOr ) {
                // do nothing
            } else {
                URCLConditionalLogic.changeState( 'hide' );
            }

            // For hide.
            let hideAnd = URCLConditionalLogic.evaluateCondition(URCLConditionalLogic.data.hide_and_conditions, 'and', 'hide'),
            hideOr  = URCLConditionalLogic.evaluateCondition(URCLConditionalLogic.data.hide_or_or_conditions, 'or', 'hide');

            if( hideAnd && hideOr ) {
                URCLConditionalLogic.changeState( 'hide' );
            } else if( hideAnd || hideOr ) {
                URCLConditionalLogic.changeState( 'hide' );
            } else if ( '' === hideAnd && '' === hideOr ) {
                // do nothing
            } else {
                URCLConditionalLogic.changeState( 'show' );
            }

            // For Disable.
            let disableAnd = URCLConditionalLogic.evaluateCondition(URCLConditionalLogic.data.disable_and_conditions, 'and', 'disable'),
                disableOr  = URCLConditionalLogic.evaluateCondition(URCLConditionalLogic.data.disable_or_or_conditions, 'or', 'disable');

            if( disableAnd && disableOr ) {
                submitBtn.prop('disabled', true);
            } else if( disableAnd || disableOr ) {
                submitBtn.prop('disabled', true);
            } else if ( '' === disableAnd && '' === disableOr ) {
                // do nothing
            } else {
                submitBtn.prop('disabled', false);
            }
        },

        /**
         * Change state of submit button.
         * Hides/Shows the submit button and sets the submit button state data.
         */
        changeState: function( action ) {
            switch (action) {
                case 'show':
                    URCLConditionalLogic.data.submitBtnState = 'show';

                    if ( ! URCLConditionalLogic.isMultipartForm() ) {
                        URCLConditionalLogic.data.submitBtn.show();
                    }
                    break;

                case 'hide':
                    URCLConditionalLogic.data.submitBtnState = 'hide';

                    if ( ! URCLConditionalLogic.isMultipartForm() ) {
                        URCLConditionalLogic.data.submitBtn.hide();
                    }
                    break;
            }
        },

        get_conditional_rules: function() {
            let submitBtn = $('button.ur-submit-button[type="submit"]'),
                rules     = submitBtn.attr('conditional_rules');

            if( undefined === rules ) {
                return;
            }

            rules = JSON.parse(rules);

            $.each(rules, function(index, rule) {
                if (rule.conditions) {
                    $.each(rule.conditions, function(i, condition) {
                        const cond = condition.map(item => item.field_value);

                        if( 'show' === rule.action) {
                            URCLConditionalLogic.data.show_and_conditions.push(cond);
                        } else if('hide' === rule.action) {
                            URCLConditionalLogic.data.hide_and_conditions.push(cond);
                        } else if('disable' === rule.action) {
                            URCLConditionalLogic.data.disable_and_conditions.push(cond);
                        }
                    });
                }

                if (rule.or_conditions) {
                    URCLConditionalLogic.data.show_or_or_conditions = [];
                    URCLConditionalLogic.data.hide_or_or_conditions = [];
                    URCLConditionalLogic.data.disable_or_or_conditions = [];

                    $.each(rule.or_conditions, function(i, orCondition) {
                        $.each(orCondition, function(j, andCondition) {
                            const cond = andCondition.map(item => item.field_value);

                            if( 'show' === rule.action) {
                                URCLConditionalLogic.data.show_or_or_conditions[i] = URCLConditionalLogic.data.show_or_or_conditions[i] || [];
                                URCLConditionalLogic.data.show_or_or_conditions[i].push( cond );
                            } else if ('hide' === rule.action) {
                                URCLConditionalLogic.data.hide_or_or_conditions[i] = URCLConditionalLogic.data.hide_or_or_conditions[i] || [];
                                URCLConditionalLogic.data.hide_or_or_conditions[i].push( cond );
                            } else if('disable' === rule.action) {
                                URCLConditionalLogic.data.disable_or_or_conditions[i] = URCLConditionalLogic.data.disable_or_or_conditions[i] || [];
                                URCLConditionalLogic.data.disable_or_or_conditions[i].push( cond );
                            }
                        });
                    });
                }
            });
        },

        evaluateCondition: function(conditions, conjunction, action) {

            if (!conditions || conditions.length === 0) {
                return '';
            }

            const evaluateOperator = URCLConditionalLogic.evaluateOperator;

            if (conjunction === 'and') {
                return conditions.every(condition => evaluateOperator(condition, action));
            }

            $statuses = conditions.map((condition)=>{
                return condition.every(cond => evaluateOperator(cond, action));
            })

            return $statuses.some(status => status);
        },

        evaluateOperator: function(condition, action) {
            const form = $('.user-registration.ur-frontend-form form');
            const [fieldKey, operatorValue, fieldValue] = condition;
            const fldVal = URCLConditionalLogic.getFieldValue(fieldKey, form);
            const isArrayFldVal = Array.isArray(fldVal);
            let result;

            switch (operatorValue) {
                case 'is':
                    result = isArrayFldVal ? fldVal.includes(fieldValue) : fieldValue === fldVal;
                    break;
                case 'is_not':
                    result = isArrayFldVal ? !fldVal.includes(fieldValue) : fieldValue !== fldVal;
                    break;
                case 'empty':
                    result = isArrayFldVal ? fldVal.length === 0 : fldVal === '';
                    break;
                case 'not_empty':
                    result = isArrayFldVal ? fldVal.length !== 0 : fldVal !== '';
                    break;
                case 'greater_than':
                    result = isArrayFldVal ? fldVal.some(val => parseFloat(val) > parseFloat(fieldValue)) : parseFloat(fldVal) > parseFloat(fieldValue);
                    break;
                case 'less_than':
                    result = isArrayFldVal ? fldVal.some(val => parseFloat(val) < parseFloat(fieldValue)) : parseFloat(fldVal) < parseFloat(fieldValue);
                    break;
                default:
                    result = isArrayFldVal ? fldVal.includes(fieldValue) : fieldValue === fldVal;
                    break;
            }

            return result;
        },

        getFieldValue: function(fieldId, $form) {
            var $field = $form.find('.ur-field-item[data-field-id="' + fieldId + '"]');
            var $inputElement = $field.find('.ur-frontend-field, .urwc-field-input');

            if( 'radio' == $inputElement.attr('type')) {
                return $field.find('input[type="radio"]:checked').val();
            }

            if ($inputElement.hasClass('urwc-field-input')) {
              return $inputElement.is(':checked') ? 'checked' : 'unchecked';
            }

            if ($inputElement.is(':checkbox')) {
              return $inputElement.filter(':checked').map(function() {
                return $(this).val();
              }).get();
            }

            return $inputElement.val();
        },

        /**
         * Returns if the form is multipart or not.
         */
        isMultipartForm: function() {
            if ( URCLConditionalLogic.data.is_multipart_form === null ) {
                if ( $( '.user-registration.ur-frontend-form.ur-multipart-form').length ) {
                    URCLConditionalLogic.data.is_multipart_form = true;
                } else {
                    URCLConditionalLogic.data.is_multipart_form = false;
                }
            }

            return URCLConditionalLogic.data.is_multipart_form
        },

        /**
         * Handle Hide/Show submit button for Multipart forms.
         */
        handleMultipart: function() {
            if ( URCLConditionalLogic.isMultipartForm() ) {
                var $indicator = $( '.user-registration-multi-part-indicator' ),
                current_part = parseInt(
                    $indicator.attr("data-current-part")
                ),
                total_part = parseInt($indicator.attr("data-total"));

                // Only run for the last part.
                if ( current_part === total_part ) {
                    switch (URCLConditionalLogic.data.submitBtnState) {
                        case 'show':
                            URCLConditionalLogic.data.submitBtn.show();
                            break;

                        case 'hide':
                            URCLConditionalLogic.data.submitBtn.hide();
                            break;
                    }
                }
            };
        }
    }
	URCLConditionalLogic.init();
})(jQuery);