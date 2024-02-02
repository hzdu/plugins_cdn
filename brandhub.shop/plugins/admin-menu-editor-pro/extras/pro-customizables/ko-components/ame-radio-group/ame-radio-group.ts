'use strict';
import {createControlComponentConfig, KoComponentParams} from '../control-base.js';
import {AmeChoiceControl, ChoiceControlOption} from '../ame-choice-control/ame-choice-control.js';
import {AmeCustomizable} from '../../assets/customizable.js';
import UiElement = AmeCustomizable.UiElement;

// noinspection JSUnusedGlobalSymbols -- Enum keys like "Paragraph" are used when serializing wrapStyle in PHP.
enum WrapStyle {
	LineBreak = 'br',
	Paragraph = 'p',
	None = '',
}

function isWrapStyle(value: unknown): value is keyof typeof WrapStyle {
	if (typeof value !== 'string') {
		return false;
	}
	return (typeof (WrapStyle as Record<string,any>)[value] === 'string');
}

let nextRadioGroupId = 1;

class AmeRadioGroup extends AmeChoiceControl {
	public readonly wrapStyle: WrapStyle = WrapStyle.None;

	protected readonly childByValue: Map<any, UiElement> = new Map();
	protected readonly radioInputPrefix: string;

	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);

		if ((typeof params['valueChildIndexes'] === 'object') && Array.isArray(params.valueChildIndexes)) {
			const children = ko.unwrap(this.inputChildren);
			for (const [value, index] of params.valueChildIndexes) {
				if (!children || !children[index]) {
					throw new Error(
						'The "' + this.label + '" radio group has no children, but its valueChildIndexes'
						+ ' requires child #' + index + ' to be associated with value "' + value + '".'
					);
				}
				this.childByValue.set(value, children[index]);
			}
		}

		this.wrapStyle = isWrapStyle(params.wrapStyle) ? WrapStyle[params.wrapStyle] : WrapStyle.None;
		if (this.childByValue.size > 0) {
			this.wrapStyle = WrapStyle.None;
		}

		this.radioInputPrefix = (typeof params.radioInputPrefix === 'string')
			? params.radioInputPrefix
			: ('ame-rg-input-' + nextRadioGroupId++ + '-');
	}

	get classes(): string[] {
		const result = ['ame-radio-group-component', ...super.classes];
		if (this.childByValue.size > 0) {
			result.push('ame-rg-has-nested-controls');
		}
		return result;
	}

	// noinspection JSUnusedGlobalSymbols -- Used in the template below.
	getChoiceChild(value: any): UiElement | null {
		return this.childByValue.get(value) || null;
	}

	// noinspection JSUnusedGlobalSymbols -- Used in the template.
	/**
	 * Get the ID attribute for a radio input.
	 *
	 * Note: This must match the algorithm used by the PHP version of this control
	 * to work correctly with the BorderStyleSelector control that adds style samples
	 * to each choice and uses the ID to link them to the inputs (so that clicking
	 * the sample selects the option).
	 */
	getRadioInputId(choice: ChoiceControlOption): string {
		let sanitizedValue = (choice.value !== null) ? choice.value.toString() : '';
		//Emulate the sanitize_key() function from WordPress core.
		sanitizedValue = sanitizedValue.toLowerCase().replace(/[^a-z0-9_\-]/gi, '');
		return this.radioInputPrefix + sanitizedValue;
	}
}

const choiceTemplate = `
	<label data-bind="class: 'ame-rg-option-label',
		css: {'ame-rg-has-choice-child' : ($component.getChoiceChild(value) !== null)}">
		<input type="radio" data-bind="class: $component.inputClassString, 
			checked: $component.valueProxy, checkedValue: value, enable: $component.isEnabled,
			attr: {id: $component.getRadioInputId($data)}">
		<span data-bind="html: label"></span>
		<!-- ko if: description -->
			<!-- ko component: {name: 'ame-nested-description', params: {description: description}} --><!-- /ko -->
		<!-- /ko -->
	</label>
`;

export default createControlComponentConfig(AmeRadioGroup, `
	<fieldset data-bind="class: classString, enable: isEnabled, style: styles">
		<!-- ko foreach: options -->
			<!-- ko if: $component.wrapStyle === 'br' -->
				${choiceTemplate} <br>
			<!-- /ko -->
			<!-- ko if: $component.wrapStyle === 'p' -->
				<p>${choiceTemplate}</p>
			<!-- /ko -->
			<!-- ko if: $component.wrapStyle === '' -->
				${choiceTemplate}
			<!-- /ko -->
			<!-- ko with: $component.getChoiceChild(value) -->
			<span class="ame-rg-nested-control" 
				data-bind="component: {name: component, params: getComponentParams()}"></span>
			<!-- /ko -->
		<!-- /ko -->
	</fieldset>
`);