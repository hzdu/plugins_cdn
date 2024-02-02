'use strict';
import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
import { LazyPopupSliderAdapter } from '../lazy-popup-slider-adapter.js';
const allDimensionKeys = [
    'top', 'bottom', 'left', 'right',
    'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
];
function isDimensionKey(key) {
    return allDimensionKeys.includes(key);
}
const DefaultDimensionsInOrder = [
    ['top', 'Top'],
    ['bottom', 'Bottom'],
    ['left', 'Left'],
    ['right', 'Right'],
];
const SideDimensions = ['top', 'bottom', 'left', 'right'];
const SymmetricDimensionMap = {
    'vertical': ['top', 'bottom'],
    'horizontal': ['left', 'right'],
};
function isSymmetricDimensionKey(key) {
    return SymmetricDimensionMap.hasOwnProperty(key);
}
let nextId = 0;
class AmeBoxDimensions extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.inputIdPrefix = '_ame-box-dimensions-c-input-' + (nextId++);
        this.unitElementId = '_ame-box-dimensions-c-unit-' + (nextId++);
        this.wrapperAttributes = {};
        if ((typeof params.id === 'string') && (params.id !== '')) {
            this.wrapperAttributes['id'] = '_ame-box-dimensions-w-' + params.id;
        }
        if ((typeof params['dimensionNames'] !== 'undefined') && Array.isArray(params['dimensionNames'])) {
            this.dimensionsInOrder = params['dimensionNames'];
        }
        else {
            this.dimensionsInOrder = DefaultDimensionsInOrder;
        }
        //Make observable proxies for the individual dimension settings.
        const temp = {};
        for (const [dimensionKey, dimensionName] of this.dimensionsInOrder) {
            const setting = this.settings['value.' + dimensionKey];
            if (!setting || (typeof setting !== 'object')) {
                throw new Error(`Missing setting for the "${dimensionName}" side.`);
            }
            temp[dimensionKey] = ko.computed({
                read: () => {
                    return setting.value();
                },
                write: (newValue) => {
                    if (newValue === '') {
                        newValue = null;
                    }
                    setting.value(newValue);
                },
                deferEvaluation: true,
            }).extend({ 'ameNumericInput': true });
        }
        this.dimensions = temp;
        //Similarly, make an observable for the unit setting.
        const unitSetting = this.settings['value.unit'];
        if (!unitSetting || (typeof unitSetting !== 'object')) {
            throw new Error('Missing setting for the unit.');
        }
        this.unitSetting = unitSetting;
        const defaultDropdownOptions = {
            options: [],
            optionsText: 'text',
            optionsValue: 'value'
        };
        if (params.unitDropdownOptions && (typeof params.unitDropdownOptions === 'object')) {
            const unitDropdownOptions = params.unitDropdownOptions;
            this.unitDropdownOptions = {
                options: unitDropdownOptions['options'] || defaultDropdownOptions.options,
                optionsText: unitDropdownOptions['optionsText'] || defaultDropdownOptions.optionsText,
                optionsValue: unitDropdownOptions['optionsValue'] || defaultDropdownOptions.optionsValue,
            };
        }
        else {
            this.unitDropdownOptions = defaultDropdownOptions;
        }
        this.isLinkActive = ko.observable(false);
        //Enable the link button by default if all dimensions are equal. Exception: null values.
        //Dimensions can have different defaults, so null doesn't necessarily mean that they
        //are actually equal.
        const firstKey = Object.keys(this.dimensions)[0];
        const firstValue = this.dimensions[firstKey]();
        if ((firstValue !== null) && (firstValue !== '')) {
            let areAllDimensionsEqual = true;
            for (const [dimensionKey] of this.dimensionsInOrder) {
                if (this.dimensions[dimensionKey]() !== firstValue) {
                    areAllDimensionsEqual = false;
                    break;
                }
            }
            this.isLinkActive(areAllDimensionsEqual);
        }
        //When "link" mode is enabled, keep all dimensions in sync.
        let isUpdatingAllDimensions = false; //Prevent infinite loops.
        const updateAllDimensions = (newValue) => {
            if (!isUpdatingAllDimensions && this.isLinkActive()) {
                isUpdatingAllDimensions = true;
                newValue = this.normalizeValue(newValue);
                for (const observable of Object.values(this.dimensions)) {
                    observable(newValue);
                }
                isUpdatingAllDimensions = false;
            }
        };
        for (const dimensionKey of Object.keys(this.dimensions)) {
            this.dimensions[dimensionKey].subscribe(updateAllDimensions);
        }
        //In "symmetric" mode, the top/bottom and left/right dimensions are always equal.
        //The control will only show "vertical" and "horizontal" inputs.
        this.symmetricModeEnabled = ko.observable(this.decideSymmetricMode(params));
        //Create computed observables for the "vertical" and "horizontal" dimensions.
        this.symmetricValues = {};
        for (const name in SymmetricDimensionMap) {
            if (!isSymmetricDimensionKey(name) || !SymmetricDimensionMap.hasOwnProperty(name)) {
                continue;
            }
            const sides = SymmetricDimensionMap[name];
            this.symmetricValues[name] = ko.computed({
                read: () => {
                    if (this.symmetricModeEnabled()) {
                        return this.dimensions[sides[0]]();
                    }
                    else {
                        return null;
                    }
                },
                write: (newValue) => {
                    if (this.symmetricModeEnabled()) {
                        newValue = this.normalizeValue(newValue);
                        for (const side of sides) {
                            this.dimensions[side](newValue);
                        }
                    }
                },
                deferEvaluation: true
            }).extend({ 'ameNumericInput': true });
        }
        //The control displays a different set of inputs depending on the current mode.
        this.inputsInOrder = ko.pureComputed(() => {
            let result;
            if (this.symmetricModeEnabled()) {
                result = [
                    ['vertical', 'Vertical'],
                    ['horizontal', 'Horizontal'],
                ];
            }
            else {
                result = this.dimensionsInOrder;
            }
            return result;
        });
        let sliderOptions = {
            'positionParentSelector': '.ame-single-box-dimension',
            'verticalOffset': -2,
        };
        if (typeof params.popupSliderWithin === 'string') {
            sliderOptions.positionWithinClosest = params.popupSliderWithin;
        }
        this.sliderAdapter = new LazyPopupSliderAdapter(params.sliderRanges ? params.sliderRanges : null, '.ame-box-dimensions-control', 'input.ame-box-dimensions-input', sliderOptions);
    }
    get classes() {
        return ['ame-box-dimensions-control', ...super.classes];
    }
    //noinspection JSUnusedGlobalSymbols -- Used in the template.
    /**
     * Get an observable for a specific dimension or a pair of dimensions.
     *
     * Unfortunately, Knockout doesn't seem to support nested indexed accessors
     * like "dimensions[$data[0]]", so we have to use a method instead.
     */
    getInputObservable(key) {
        if (this.symmetricModeEnabled() && isSymmetricDimensionKey(key)) {
            return this.symmetricValues[key];
        }
        if (isDimensionKey(key)) {
            return this.dimensions[key];
        }
        throw new Error('Invalid input key for the current mode: ' + key);
    }
    getInputIdFor(key) {
        return this.inputIdPrefix + '-' + key;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    getInputAttributes(key) {
        return {
            id: this.getInputIdFor(key),
            'data-unit-element-id': this.unitElementId,
            'data-ame-box-dimension': key,
        };
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    getSettingFor(key) {
        const settingName = 'value.' + key;
        if (settingName in this.settings) {
            return this.settings[settingName];
        }
        if (this.symmetricModeEnabled() && isSymmetricDimensionKey(key)) {
            for (const dimension of SymmetricDimensionMap[key]) {
                //Since both symmetric dimensions are always equal, we can use
                //either of the two settings.
                const settingName = 'value.' + dimension;
                if (settingName in this.settings) {
                    return this.settings[dimension];
                }
            }
        }
        return null;
    }
    // noinspection JSUnusedGlobalSymbols -- Actually used in the template.
    toggleLink() {
        this.isLinkActive(!this.isLinkActive());
        //When enabling "link" mode, fill all inputs with the same value.
        //Use the first non-empty value.
        if (this.isLinkActive()) {
            let firstValue = null;
            for (const dimensionObservable of Object.values(this.dimensions)) {
                const value = dimensionObservable();
                if ((value !== null) && (value !== '')) {
                    firstValue = value;
                    break;
                }
            }
            if (firstValue !== null) {
                firstValue = this.normalizeValue(firstValue);
                for (const dimensionObservable of Object.values(this.dimensions)) {
                    dimensionObservable(firstValue);
                }
            }
        }
    }
    normalizeValue(value) {
        if (value === null) {
            return null;
        }
        //Convert strings to numbers, and invalid strings to null.
        if (typeof value === 'string') {
            value = parseFloat(value);
            if (isNaN(value)) {
                return null;
            }
        }
        return value;
    }
    /**
     * Determine whether the control should be in "symmetric" mode.
     */
    decideSymmetricMode(componentParams) {
        //This mode is off by default and can be enabled by setting the "symmetricMode" parameter.
        let enableMode = (typeof componentParams['symmetricMode'] !== 'undefined')
            ? (!!componentParams['symmetricMode'])
            : false;
        if (!enableMode) {
            return false;
        }
        //Symmetric mode can't be enabled if the control doesn't have all side dimensions.
        const hasAllSideDimensions = SideDimensions.every((key) => {
            return (key in this.dimensions);
        });
        if (!hasAllSideDimensions) {
            return false;
        }
        //It also can only be enabled if top/bottom and left/right dimensions are equal.
        return ((this.dimensions['top']() === this.dimensions['bottom']())
            && (this.dimensions['left']() === this.dimensions['right']()));
    }
}
export default createControlComponentConfig(AmeBoxDimensions, `
	<fieldset data-bind="class: classString, enable: isEnabled, style: styles, attr: wrapperAttributes"
	          data-ame-is-component="1">
		<!-- ko foreach: inputsInOrder -->
			<div data-bind="class: ('ame-single-box-dimension ame-box-dimension-' + $data[0])">
				<input type="text" inputmode="numeric" maxlength="20" pattern="\\s*-?[0-9]+(?:[.,]\\d*)?\\s*" 
					data-bind="value: $parent.getInputObservable($data[0]), valueUpdate: 'input',
					attr: $component.getInputAttributes($data[0]),
					class: ('ame-small-number-input ame-box-dimensions-input ame-box-dimensions-input-' + $data[0]),
					enable: $component.isEnabled,
					click: $component.sliderAdapter.handleKoClickEvent,
					ameValidationErrorClass: $component.getSettingFor($data[0])" />				
				<label data-bind="attr: {'for': $component.getInputIdFor($data[0])}" 
					class="ame-box-dimension-label"><span
					data-bind="text: $data[1]" class="ame-box-dimension-label-text"></span></label>
			</div>
		<!-- /ko -->
		<ame-unit-dropdown params="optionData: unitDropdownOptions, settings: {value: unitSetting},
			classes: ['ame-box-dimensions-unit-selector'],
			id: unitElementId"></ame-unit-dropdown>
		<button class="button button-secondary ame-box-dimensions-link-button hide-if-no-js"
			title="Link values" data-bind="enable: isEnabled, css: {'active': isLinkActive}, 
				click: $component.toggleLink.bind($component)"><span class="dashicons dashicons-admin-links"></span></button>
	</fieldset>
`);
//# sourceMappingURL=ame-box-dimensions.js.map