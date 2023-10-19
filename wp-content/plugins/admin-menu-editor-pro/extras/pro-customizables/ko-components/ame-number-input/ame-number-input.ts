/// <reference path="../../../../customizables/assets/popup-slider.d.ts" />

import {createControlComponentConfig, KoDependentControl} from '../control-base.js';
import {AmeCustomizable} from '../../assets/customizable.js';
import Control = AmeCustomizable.Control;
import {UnitDropdownData} from '../ame-unit-dropdown/ame-unit-dropdown.js';

export class AmeNumberInput extends KoDependentControl {
	public readonly hasUnitDropdown: boolean;
	public readonly unitText: string;

	public readonly unitElementId: string;
	public readonly unitDropdownOptions: null | UnitDropdownData;

	public readonly min: number | null;
	public readonly max: number | null;
	public readonly step: number | null;

	protected readonly sliderRanges: AmePopupSliderRanges | null = null;
	protected readonly popupSliderWithin: string | null;

	protected slider: AmePopupSlider | null = null;

	public readonly numericValue: KnockoutObservable<any>;

	constructor(params: any, $element: JQuery) {
		super(params, $element);

		this.numericValue = this.valueProxy.extend({'ameNumericInput': true});

		this.unitText = params.unitText || '';
		this.hasUnitDropdown = params.hasUnitDropdown || false;
		this.unitElementId = params.unitElementId || '';

		if (this.hasUnitDropdown && params.unitDropdownOptions) {
			this.unitDropdownOptions = {
				options: params.unitDropdownOptions.options || [],
				optionsText: params.unitDropdownOptions.optionsText || 'text',
				optionsValue: params.unitDropdownOptions.optionsValue || 'value'
			};
		} else {
			this.unitDropdownOptions = null;
		}

		this.min = params.min || null;
		this.max = params.max || null;
		this.step = params.step || null;

		if (params.sliderRanges) {
			this.sliderRanges = params.sliderRanges;
		}
		this.popupSliderWithin = (typeof params.popupSliderWithin === 'string') ? params.popupSliderWithin : null;

		this.inputClasses.unshift('ame-input-with-popup-slider', 'ame-number-input');
	}

	get classes(): string[] {
		const classes = ['ame-number-input-control'];
		if (this.sliderRanges !== null) {
			classes.push('ame-container-with-popup-slider');
		}
		classes.push(...super.classes);
		return classes;
	}

	get inputClasses(): string[] {
		const classes = ['ame-input-with-popup-slider', 'ame-number-input'];
		classes.push(...super.inputClasses);
		return classes;
	}

	protected getAdditionalInputAttributes(): Record<string, string> {
		let attributes = super.getAdditionalInputAttributes();

		if (this.min !== null) {
			attributes['min'] = this.min.toString();
		}
		if (this.max !== null) {
			attributes['max'] = this.max.toString();
		}
		if (this.step !== null) {
			attributes['step'] = this.step.toString();
		}

		if (this.unitElementId) {
			attributes['data-unit-element-id'] = this.unitElementId;
		}

		return attributes;
	}

	// noinspection JSUnusedGlobalSymbols -- Used in the Knockout template in this same file.
	public showPopupSlider($data: any, event: Event): void {
		if ((this.sliderRanges === null) || (typeof AmePopupSlider === 'undefined')) {
			return;
		}

		//Some sanity checks.
		if (!event.target) {
			return;
		}
		const $input = jQuery(event.target);
		if ($input.is(':disabled') || !$input.is('input')) {
			return;
		}
		const $container = $input.closest('.ame-container-with-popup-slider');
		if ($container.length < 1) {
			return;
		}

		//Initialize the slider if it's not already initialized.
		if (!this.slider) {
			let sliderOptions: AmePopupSliderOptions = {};
			if (this.popupSliderWithin) {
				sliderOptions.positionWithinClosest = this.popupSliderWithin;
			}

			//In HTML, we would pass the range data as a "data-slider-ranges" attribute,
			//but here we can just set the data directly.
			$input.data('slider-ranges', this.sliderRanges);
			this.slider = AmePopupSlider.createSlider($container, sliderOptions);
		}

		this.slider.showForInput($input);
	}

	protected getExpectedUiElementType(): Constructor<AmeCustomizable.Control> | null {
		return Control;
	}
}

export default createControlComponentConfig(AmeNumberInput, `
	<fieldset data-bind="class: classString, enable: isEnabled">
		<div data-bind="class: (hasUnitDropdown ? 'ame-input-group' : '')">
			<input type="text" inputmode="numeric" maxlength="20" pattern="\\s*-?[0-9]+(?:[.,]\\d*)?\\s*"
				   data-bind="attr: inputAttributes, value: numericValue, valueUpdate: 'input', 
				   class: inputClassString, enable: isEnabled, click: showPopupSlider.bind($component),
				   ameValidationErrorClass: settings.value">
			
			<!-- ko if: hasUnitDropdown -->
				<ame-unit-dropdown params="optionData: unitDropdownOptions, settings: {value: settings.unit},
					classes: ['ame-input-group-secondary', 'ame-number-input-unit'],
					id: unitElementId"></ame-unit-dropdown>
			<!-- /ko -->
			<!-- ko if: (!hasUnitDropdown && unitText) -->
				<span class="ame-number-input-unit" 
					  data-bind="text: unitText, attr: {id: unitElementId, 'data-number-unit': unitText}"></span>
			<!-- /ko -->
		</div>
	</fieldset>	
`);