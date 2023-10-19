import { createComponentConfig, KoControlViewModel } from '../../../pro-customizables/ko-components/control-base.js';
import { AmeCustomizable } from '../../../pro-customizables/assets/customizable.js';
var Control = AmeCustomizable.Control;
class MissingComponentError extends Error {
    constructor(uiElement) {
        super(`The UI element "${uiElement.label}" [${uiElement.id}] is missing a component name.`);
        this.uiElement = uiElement;
    }
}
class AmeAcControl extends KoControlViewModel {
    constructor(params, $element) {
        super(params, $element);
        //uiElement is required for this component.
        if (!this.uiElement) {
            throw new Error('The uiElement parameter is required for AmeAcControl');
        }
        this.wrapperLabelEnabled = (this.uiElement.label !== '') && (!this.uiElement.includesOwnLabel);
        this.labelForId = this.uiElement.labelTargetId;
        if (!this.uiElement.component) {
            throw new MissingComponentError(this.uiElement);
        }
    }
    getExpectedUiElementType() {
        return Control;
    }
}
export default createComponentConfig(AmeAcControl, `
	<li class="ame-ac-control">
		<!-- ko if: wrapperLabelEnabled -->
			<!-- ko if: labelForId -->
			<label class="ame-ac-control-label" data-bind="text: label, attr: {for: labelForId}"></label>
			<!-- /ko -->
			<!-- ko ifnot: labelForId -->
			<span class="ame-ac-control-label" data-bind="text: label"></span>
			<!-- /ko -->
		<!-- /ko -->
		<!-- ko component: {name: uiElement.component, params: uiElement.getComponentParams()} --><!-- /ko -->
	</li>
`);
//# sourceMappingURL=ame-ac-control.js.map