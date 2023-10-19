import { createControlComponentConfig, KoDependentControl } from '../control-base.js';
export class AmeTextInput extends KoDependentControl {
    constructor(params, $element) {
        super(params, $element);
        this.inputType = 'text';
        this.isCode = params.isCode || false;
        this.inputType = params.inputType || 'text';
    }
    get inputClasses() {
        const classes = ['regular-text'];
        if (this.isCode) {
            classes.push('code');
        }
        classes.push('ame-text-input-control', ...super.inputClasses);
        return classes;
    }
    getAdditionalInputAttributes() {
        return Object.assign({ 'type': this.inputType }, super.getAdditionalInputAttributes());
    }
}
export default createControlComponentConfig(AmeTextInput, `
	<input data-bind="value: valueProxy, attr: inputAttributes, class: inputClassString">
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->	
`);
//# sourceMappingURL=ame-text-input.js.map