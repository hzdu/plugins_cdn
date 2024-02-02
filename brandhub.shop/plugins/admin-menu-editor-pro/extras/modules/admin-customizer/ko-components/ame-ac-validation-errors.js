import { createComponentConfig, KoStandaloneControl } from '../../../pro-customizables/ko-components/control-base.js';
class AmeAcValidationErrors extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        if (typeof params.errors !== 'undefined') {
            if (Array.isArray(params.errors)) {
                this.errors = params.errors;
            }
            else if (ko.isObservable(params.errors)) {
                this.errors = params.errors;
            }
            else {
                throw new Error('The "errors" parameter must be an array or an observable array.');
            }
        }
        else {
            console.log('Params:', params);
            throw new Error('The "errors" parameter is required for the AmeAcValidationErrors component.');
        }
    }
}
export default createComponentConfig(AmeAcValidationErrors, `
	<ul class="ame-ac-ve-list" data-bind="foreach: errors">
		<li class="notice notice-error ame-ac-validation-error">
			<span class="ame-ac-ve-message" data-bind="text: $data[1].message, attr: {title: $data[1].code}"></span>
		</li>
	</ul>
`);
//# sourceMappingURL=ame-ac-validation-errors.js.map