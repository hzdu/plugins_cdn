import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
export class AmeUnitDropdown extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.dropdownData = params.optionData || {
            options: [],
            optionsText: 'text',
            optionsValue: 'value'
        };
        this.selectId = params.id || '';
    }
}
export default createControlComponentConfig(AmeUnitDropdown, `
	<select data-bind="options: dropdownData.options, optionsText: dropdownData.optionsText, 
		optionsValue: dropdownData.optionsValue, value: valueProxy, class: classString,
		attr: {id: selectId}"></select>
`);
//# sourceMappingURL=ame-unit-dropdown.js.map