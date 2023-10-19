import {
	ComponentBindingOptions,
	createComponentConfig,
	KoComponentParams,
	KoContainerViewModel
} from '../../../pro-customizables/ko-components/control-base.js';
import {AmeCustomizable} from '../../../pro-customizables/assets/customizable.js';
import ControlGroup = AmeCustomizable.ControlGroup;

class AmeAcControlGroup extends KoContainerViewModel<ControlGroup> {
	public readonly labelFor: string|null;
	public readonly titleDisabled: boolean;

	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);
		this.labelFor = (this.uiElement?.labelFor) ?? null;
		this.titleDisabled = (typeof params.titleDisabled !== 'undefined') ? (!!params.titleDisabled) : false;
	}

	protected getExpectedUiElementType(): Constructor<AmeCustomizable.ControlGroup> | null {
		return ControlGroup;
	}

	protected mapChildToComponentBinding(child: AmeCustomizable.UiElement): ComponentBindingOptions | null {
		if (child.component) {
			return ComponentBindingOptions.fromElement(child);
		}
		return super.mapChildToComponentBinding(child);
	}
}

export default createComponentConfig(AmeAcControlGroup, `
	<li class="ame-ac-control ame-ac-control-group">
		<!-- ko if: title() && !titleDisabled -->
			<!-- ko if: labelFor -->
			<label class="ame-ac-control-label ame-ac-group-title" 
				data-bind="text: title, attr: {for: labelFor}"></label>
			<!-- /ko -->
			<!-- ko ifnot: labelFor -->
			<span class="ame-ac-control-label ame-ac-group-title" 
				data-bind="text: title"></span>
			<!-- /ko -->
		<!-- /ko -->
		<ul data-bind="foreach: childComponents">
			<li class="ame-ac-control">
				<!-- ko if: (
					$data.uiElement 
					&& $data.uiElement.settingValidationErrors
					&& ($data.uiElement.settingValidationErrors().length > 0)
				) -->
					<ame-ac-validation-errors params='errors: $data.uiElement.settingValidationErrors'></ame-ac-validation-errors>
				<!-- /ko -->
				<!-- ko component: $data --><!-- /ko -->
			</li>		
		</ul>
	</li>
`);