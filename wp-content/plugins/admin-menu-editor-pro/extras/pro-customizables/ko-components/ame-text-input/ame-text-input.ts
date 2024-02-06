import {createControlComponentConfig, KoDependentControl} from '../control-base.js';

export class AmeTextInput extends KoDependentControl {
	public readonly isCode: boolean;
	public readonly inputType: string = 'text';

	constructor(params: any, $element: JQuery) {
		super(params, $element);
		this.isCode = params.isCode || false;
		this.inputType = params.inputType || 'text';
	}

	get inputClasses(): string[] {
		const classes = ['regular-text'];
		if (this.isCode) {
			classes.push('code');
		}
		classes.push('ame-text-input-control', ...super.inputClasses);
		return classes;
	}

	protected getAdditionalInputAttributes(): Record<string, string> {
		return {
			'type': this.inputType,
			...super.getAdditionalInputAttributes()
		};
	}
}

export default createControlComponentConfig(AmeTextInput, `
	<input data-bind="value: valueProxy, attr: inputAttributes, class: inputClassString">
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->	
`);

