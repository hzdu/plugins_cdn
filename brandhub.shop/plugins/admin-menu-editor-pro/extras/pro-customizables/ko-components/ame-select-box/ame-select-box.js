import { AmeChoiceControl } from '../ame-choice-control/ame-choice-control.js';
import { createControlComponentConfig } from '../control-base.js';
class AmeSelectBox extends AmeChoiceControl {
    constructor(params, $element) {
        super(params, $element);
    }
    get classes() {
        return ['ame-select-box-control', ...super.classes];
    }
}
export default createControlComponentConfig(AmeSelectBox, `
	<select data-bind="class: classString, value: valueProxy, options: options,
		optionsValue: 'value', optionsText: 'label', enable: isEnabled, attr: inputAttributes"></select>
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->	
`);
//# sourceMappingURL=ame-select-box.js.map