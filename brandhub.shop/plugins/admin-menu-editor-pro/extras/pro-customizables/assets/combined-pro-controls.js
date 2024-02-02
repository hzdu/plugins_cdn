'use strict';
///<reference path="../../../js/jquery.d.ts"/>
/*
 * To avoid loading many small files, simple controls are combined into this single file.
 */
jQuery(function ($) {
    //region Background position
    {
        //Update the output when the user selects a new position.
        $('.ame-background-position-control').find('input:radio').on('change', function () {
            const $this = $(this);
            if ($this.is(':checked')) {
                $this.closest('.ame-background-position-control')
                    .find('.ame-background-position-output code')
                    .text($this.val());
            }
        });
    }
    //endregion
    //region Box sides
    {
        //This unique marker is used to identify events triggered by this script
        //and prevent them from triggering more events (i.e. infinite loop).
        const ownChangeEventMarker = { 'isAmeBoxDimensionsChange': true };
        //When the "link" option is enabled and the user changes the value of one input,
        //update all other inputs.
        const inputChangeEvents = 'change.ameBoxDimensionsChange input.ameBoxDimensionsChange';
        $('.ame-box-dimensions-control').each(function () {
            const $control = $(this);
            if ($control.data('ameIsComponent')) {
                return; //This is a Knockout component.
            }
            const $linkButton = $control.find('.ame-box-dimensions-link-button').first();
            const $numberInputs = $control.find('input.ame-box-dimensions-input');
            let areInputsLinked = $linkButton.hasClass('active');
            function updateLinkedInputs($changedInput, eventType = 'change') {
                if (!areInputsLinked) {
                    return;
                }
                let value = $changedInput.val();
                //Convert non-empty strings to numbers, and invalid numbers to empty strings.
                if (typeof value === 'string') {
                    if (value !== '') {
                        value = parseFloat(value);
                        if (isNaN(value)) {
                            value = '';
                        }
                    }
                }
                else if (typeof value !== 'number') {
                    value = '';
                }
                const $otherInputs = $numberInputs.not($changedInput);
                $otherInputs.val(value);
                //Trigger the change event only after all inputs have been updated to avoid
                //a situation where link mode gets automatically disabled because some inputs
                //haven't been updated yet and the values don't match.
                $otherInputs.trigger(eventType, [value, ownChangeEventMarker]);
            }
            $numberInputs.on(inputChangeEvents, function (event, maybeValue, extraParam) {
                if (extraParam === ownChangeEventMarker) {
                    return; //This event was triggered by this script.
                }
                updateLinkedInputs($(event.target), 'adminMenuEditor:controlValueChanged');
            });
            $linkButton.on('click', function () {
                $linkButton.toggleClass('active');
                areInputsLinked = $linkButton.hasClass('active');
                if (areInputsLinked) {
                    //When enabling "link" mode, fill all inputs with the same value.
                    //Use the first non-empty value.
                    const $firstNonEmptyInput = $numberInputs.filter(function () {
                        const value = $(this).val();
                        return (value !== '') && (typeof value !== 'undefined');
                    }).first();
                    if ($firstNonEmptyInput.length > 0) {
                        updateLinkedInputs($firstNonEmptyInput, 'change');
                    }
                }
            });
            //When the underlying observables change and the inputs are no longer the same,
            //un-link them. Note that we don't automatically enable linking if the values
            //are the same. The user may have intentionally disabled it.
            let unlinkTestTimer = null;
            $numberInputs.on('adminMenuEditor:observableValueChanged', function () {
                if (unlinkTestTimer !== null) {
                    return;
                }
                //Multiple inputs may change at the same time when (re-)loading settings,
                //so we need to wait a bit before testing if the values still match.
                unlinkTestTimer = setTimeout(function () {
                    const firstValue = $numberInputs.first().val();
                    let shouldDisableLink = false;
                    $numberInputs.each(function () {
                        if ($(this).val() !== firstValue) {
                            shouldDisableLink = true;
                            return false;
                        }
                    });
                    if (shouldDisableLink) {
                        areInputsLinked = false;
                        $linkButton.removeClass('active');
                    }
                    unlinkTestTimer = null;
                }, 0);
            });
            /*//Update inputs when the underlying observable changes.
            $control.on('adminMenuEditor:observableValueChanged', function (event, newValue) {
                if (typeof newValue !== 'object') {
                    newValue = {};
                }
                console.log('Box sides control changed:', newValue);

                //Update unit selector.
                if (typeof newValue.unit === 'string') {
                    $unitSelector.val(newValue.unit);
                } else {
                    //Default to the first option.
                    $unitSelector.val($unitSelector.find('option').first().val());
                }

                //Update inputs.
                $numberInputs.each(function () {
                    const $input = $(this);
                    const side = $input.data('ameBoxSide');

                    let value = newValue.hasOwnProperty(side) ? newValue[side] : null;
                    //If a string somehow got written to the observable, convert it to a number.
                    if (typeof value === 'string') {
                        value = parseFloat(value);
                        if (isNaN(value)) {
                            value = null;
                        }
                    }

                    if (typeof value === 'number') {
                        $input.val(value);
                    } else {
                        $input.val('');
                    }
                });

                //If input values are not the same, un-link them.
                //Note that we don't automatically enable linking if they are the same.
                //The user may have intentionally disabled it.
                const firstValue = $numberInputs.first().val();
                let shouldDisableLink = false;
                $numberInputs.each(function () {
                    if ($(this).val() !== firstValue) {
                        shouldDisableLink = true;
                        return false;
                    }
                });
                if (shouldDisableLink) {
                    areInputsLinked = false;
                    $linkButton.removeClass('active');
                }
            });*/
        });
    }
    //endregion
    //region Font style picker
    {
        const ownChangeEventMarker = { 'isAmeFontStyleChange': true };
        function findInputsByCssProperty($control, cssProperty) {
            return $control.find('input').filter(function () {
                return $(this).data('ameFontProperty') === cssProperty;
            });
        }
        function uncheckOptions($inputs) {
            $inputs.prop('checked', false)
                .closest('label').find('.button').removeClass('active');
        }
        function setActiveOptionClass($input) {
            $input.closest('label').find('.button')
                .toggleClass('active', $input.prop('checked'));
        }
        $('.ame-font-style-control').each(function () {
            const $control = $(this);
            if ($control.data('ameIsComponent')) {
                return; //The KO component will handle this control.
            }
            const $nullInputsByProperty = {};
            $control.find('input.ame-font-style-null-input').each(function () {
                const $nullInput = $(this);
                const property = $nullInput.data('ameFontProperty');
                $nullInputsByProperty[property] = $nullInput;
                //Update the inputs when the associated observable changes.
                $nullInput.on('adminMenuEditor:observableValueChanged', function (e, newValue) {
                    const $inputs = findInputsByCssProperty($control, property);
                    //First, uncheck all inputs.
                    uncheckOptions($inputs);
                    //Check the input that corresponds to the new value.
                    const $newSelection = (newValue === null)
                        ? $nullInput
                        : $inputs.filter(function () {
                            return $(this).val() === newValue;
                        });
                    $newSelection.prop('checked', true);
                    setActiveOptionClass($newSelection);
                });
            });
            $control.on('change', 'input', function (event, extraParam) {
                const $thisInput = $(this);
                setActiveOptionClass($thisInput);
                //Don't update other inputs if this change was triggered by the control itself.
                if (extraParam === ownChangeEventMarker) {
                    return;
                }
                //When the user checks one option, uncheck all other options that have
                //the same CSS property. Likewise, when the user unchecks the only checked
                //option, check the empty/null option for that property.
                const cssProperty = $thisInput.data('ameFontProperty');
                const $control = $thisInput.closest('.ame-font-style-control');
                const $inputs = findInputsByCssProperty($control, cssProperty);
                const $nullInput = $nullInputsByProperty[cssProperty];
                if ($thisInput.is(':checked')) {
                    uncheckOptions($inputs.not($thisInput));
                    //Set the KO observable, if any.
                    if ($thisInput.is($nullInput)) {
                        $nullInput.trigger('adminMenuEditor:controlValueChanged', [null]);
                    }
                    else {
                        $nullInput.trigger('adminMenuEditor:controlValueChanged', [$thisInput.val()]);
                    }
                }
                else {
                    //Are any options checked for this CSS property?
                    const checkedOptionsExist = ($inputs.filter(':checked').length > 0);
                    if (!checkedOptionsExist) {
                        //Check the empty/null option.
                        $nullInput.prop('checked', true).trigger('change', [ownChangeEventMarker]);
                        //Set the KO observable to null.
                        $nullInput.trigger('adminMenuEditor:controlValueChanged', [null]);
                    }
                }
            });
        });
    }
    //endregion
    //region Box shadow setting collection
    {
        //When a user changes any of the box shadow settings, set the mode to "custom".
        //Note: This does not work in AC because all the controls are no longer inside
        //the same container. They're separate list items.
        $('.ame-box-shadow-mode-control').each(function () {
            const $modeControl = $(this);
            const $customBox = $modeControl.find('input[value="custom"]');
            //Controls associated with this mode selector will have
            //the same "ame-box-shadow-collection-N" class as the mode control.
            const collectionClass = $modeControl.attr('class').match(/\b(ame-box-shadow-collection-\d+)\b/);
            if (!collectionClass || ($customBox.length === 0)) {
                return;
            }
            const changeEvents = 'change input adminMenuEditor:controlValueChanged';
            const $controls = $('.' + collectionClass[1]).not($modeControl);
            //Optimization: When the "custom" option is already selected, there's
            //no need to listen for changes in the associated controls.
            function enableCustomMode() {
                if (!$customBox.prop('checked')) {
                    $customBox.prop('checked', true);
                    $customBox.trigger('adminMenuEditor:controlValueChanged', [$customBox.val()]);
                }
                toggleChangeListener();
            }
            let isListenerAdded = false;
            function toggleChangeListener() {
                if ($customBox.prop('checked')) {
                    $controls.off(changeEvents, enableCustomMode);
                    isListenerAdded = false;
                }
                else if (!isListenerAdded) {
                    $controls.on(changeEvents, enableCustomMode);
                    isListenerAdded = true;
                }
            }
            $modeControl.on('change adminMenuEditor:observableValueChanged', toggleChangeListener);
            toggleChangeListener();
        });
    }
    //endregion
});
//# sourceMappingURL=combined-pro-controls.js.map