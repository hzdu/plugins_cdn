import {
	createComponentConfig,
	KoContainerViewModel
} from '../control-base.js';

import {AmeCustomizable} from '../../assets/customizable.js';

class AmeSiControlGroup extends KoContainerViewModel<AmeCustomizable.ControlGroup> {
	public readonly labelFor: string|null;

	constructor(params: any, $element: JQuery) {
		super(params, $element);
		this.labelFor = params.labelFor || (this.uiElement?.labelFor) || null;
	}

	protected getExpectedUiElementType(): Constructor<AmeCustomizable.ControlGroup> | null {
		return AmeCustomizable.ControlGroup;
	}

	get classes(): string[] {
		return ['ame-si-control-group', ...super.classes];
	}
}

export default createComponentConfig(AmeSiControlGroup, `
	<div data-bind="class: classString">
		<h4>
			<!-- ko if: title -->
				<!-- ko if: labelFor -->
					<label data-bind="attr: {for: labelFor}, text: title"></label>
				<!-- /ko -->
				<!-- ko ifnot: labelFor -->
					<span data-bind="text: title"></span>
				<!-- /ko -->
			<!-- /ko -->
		</h4>
		<div class="ame-si-control-group-children">
		<!-- ko foreach: inputChildren -->
			<!-- ko if: $data.component -->
					<!-- ko component: { name: $data.component, params: $data.getComponentParams() } --><!-- /ko -->					
			<!-- /ko -->
			<!-- ko ifnot: $data.component -->
				<div class="ame-si-cg-placeholder">
					<span class="ame-si-cg-placeholder-text">
						UI element without a component. <br>
						<!-- ko if: $data.label --> 
						Label: <strong data-bind="text: $data.label"></strong>
						<!-- /ko -->
						<!-- ko if: $data.title -->
						Title: <strong data-bind="text: $data.title"></strong>
						<!-- /ko -->
					</span>
				</div>
			<!-- /ko -->
		<!-- /ko -->
		</div>
	</div>	
`);
