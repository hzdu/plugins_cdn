import {createControlComponentConfig, KoStandaloneControl} from '../control-base.js';

export class AmeUnitDropdown extends KoStandaloneControl {
	public readonly dropdownData: UnitDropdownData;
	public readonly selectId: string;

	constructor(params: any, $element: JQuery) {
		super(params, $element);

		this.dropdownData = params.optionData || {
			options: [],
			optionsText: 'text',
			optionsValue: 'value'
		};

		this.selectId = params.id || '';
	}
}

export interface UnitDropdownData {
	options: Record<string, any>[],
	optionsText: string,
	optionsValue: string
}

export default createControlComponentConfig(AmeUnitDropdown, `
	<select data-bind="options: dropdownData.options, optionsText: dropdownData.optionsText, 
		optionsValue: dropdownData.optionsValue, value: valueProxy, class: classString,
		attr: {id: selectId}"></select>
`);