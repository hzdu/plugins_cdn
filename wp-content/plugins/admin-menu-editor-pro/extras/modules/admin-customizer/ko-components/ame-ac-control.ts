import {
	createComponentConfig, KoComponentParams, KoControlViewModel
} from '../../../pro-customizables/ko-components/control-base.js';
import {AmeCustomizable} from '../../../pro-customizables/assets/customizable.js';
import Control = AmeCustomizable.Control;

class MissingComponentError extends Error {
	constructor(public readonly uiElement: Control) {
		super(`The UI element "${uiElement.label}" [${uiElement.id}] is missing a component name.`);
	}
}

class AmeAcControl extends KoControlViewModel<Control> {
	public readonly wrapperLabelEnabled: boolean;
	public readonly labelForId: string;

	constructor(params: KoComponentParams, $element: JQuery) {
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

	protected getExpectedUiElementType(): Constructor<AmeCustomizable.Control> | null {
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