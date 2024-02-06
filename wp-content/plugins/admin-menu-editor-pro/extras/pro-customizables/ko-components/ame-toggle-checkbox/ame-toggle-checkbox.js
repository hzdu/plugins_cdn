import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
class AmeToggleCheckbox extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.onValue = (typeof params.onValue !== 'undefined') ? params.onValue : true;
        this.offValue = (typeof params.offValue !== 'undefined') ? params.offValue : false;
        if (typeof this.settings['value'] === 'undefined') {
            this.isChecked = ko.pureComputed(() => false);
        }
        else {
            this.isChecked = ko.computed({
                read: () => {
                    return this.settings.value.value() === ko.unwrap(this.onValue);
                },
                write: (newValue) => {
                    this.settings.value.value(ko.unwrap(newValue ? this.onValue : this.offValue));
                },
                deferEvaluation: true
            });
        }
    }
    get classes() {
        return ['ame-toggle-checkbox-control', ...super.classes];
    }
}
//Unlike the HTML version of this control, the Knockout version doesn't have
//a second, hidden checkbox. This is because the component is entirely JS-based
//and doesn't need to be submitted as part of a form.
export default createControlComponentConfig(AmeToggleCheckbox, `
	<label data-bind="class: classString">
		<input type="checkbox" data-bind="checked: isChecked, attr: inputAttributes, 
			class: inputClassString, enable: isEnabled">
		<span data-bind="text: label"></span>
		<!-- ko if: (description) -->
			<!-- ko component: {name: 'ame-nested-description', params: {description: description}} --><!-- /ko -->
		<!-- /ko -->
	</label>	
`);
//# sourceMappingURL=ame-toggle-checkbox.js.map