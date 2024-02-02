import { KoStandaloneControl } from '../control-base.js';
export class ChoiceControlOption {
    constructor(data) {
        this.value = data.value;
        this.label = data.label;
        this.description = data.description || '';
        this.enabled = (typeof data.enabled === 'undefined') || data.enabled;
        this.icon = data.icon || '';
    }
}
export class AmeChoiceControl extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.options = ko.observableArray([]);
        if ((typeof params['options'] !== 'undefined') && Array.isArray(params.options)) {
            this.options(params.options.map((optionData) => new ChoiceControlOption(optionData)));
        }
    }
}
//# sourceMappingURL=ame-choice-control.js.map