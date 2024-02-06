import {KoStandaloneControl} from '../control-base.js';

export interface ChoiceOptionData {
	value: any;
	label: string;
	description?: string;
	enabled?: boolean;
	icon?: string;
}

export class ChoiceControlOption {
	public readonly value: any;
	public readonly label: string;
	public readonly description: string;
	public readonly enabled: boolean;
	public readonly icon: string;

	constructor(data: ChoiceOptionData) {
		this.value = data.value;
		this.label = data.label;
		this.description = data.description || '';
		this.enabled = (typeof data.enabled === 'undefined') || data.enabled;
		this.icon = data.icon || '';
	}
}

export abstract class AmeChoiceControl extends KoStandaloneControl {
	public readonly options: KnockoutObservableArray<ChoiceControlOption>;

	protected constructor(params: any, $element: JQuery) {
		super(params, $element);

		this.options = ko.observableArray<ChoiceControlOption>([]);
		if ((typeof params['options'] !== 'undefined') && Array.isArray(params.options)) {
			this.options(params.options.map((optionData: ChoiceOptionData) => new ChoiceControlOption(optionData)));
		}
	}
}