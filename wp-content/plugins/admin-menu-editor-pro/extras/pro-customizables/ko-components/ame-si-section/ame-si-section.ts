import {
	createComponentConfig,
	KoContainerViewModel
} from '../control-base.js';

import {AmeCustomizable} from '../../assets/customizable.js';
import Section = AmeCustomizable.Section;
import UiElement = AmeCustomizable.UiElement;
import ControlGroup = AmeCustomizable.ControlGroup;
import Control = AmeCustomizable.Control;

class AmeSiSection extends KoContainerViewModel<Section> {
	private readonly createdGroups: WeakMap<UiElement, ControlGroup>;

	public readonly mappedChildren: KnockoutComputed<UiElement[]>;

	constructor(params: any, $element: JQuery) {
		super(params, $element);
		this.createdGroups = new WeakMap<UiElement, ControlGroup>();

		//Put ungrouped child controls into control groups.
		this.mappedChildren = ko.pureComputed(() => {
			const children = ko.unwrap(this.inputChildren);
			const result: UiElement[] = [];
			for (const child of children) {
				if (child instanceof ControlGroup) {
					result.push(child);
				} else if (child instanceof Control) {
					let group = this.createdGroups.get(child);
					if (!group) {
						group = new ControlGroup(
							{
								t: 'control-group',
								title: child.getAutoGroupTitle(),
								component: 'ame-si-control-group',
							},
							[child],
							child.enabled
						);
						this.createdGroups.set(child, group);
					}
					result.push(group);
				} else {
					result.push(child);
				}
			}
			return result;
		});
	}

	protected getExpectedUiElementType(): Constructor<AmeCustomizable.Section> | null {
		return Section;
	}
}

export default createComponentConfig(AmeSiSection, `
	<div class="ame-si-section">
		<h3 data-bind="text: uiElement.title"></h3>
		<!-- ko foreach: mappedChildren -->
			<!-- ko if: $data.component -->
					<!-- ko component: { name: $data.component, params: $data.getComponentParams() } --><!-- /ko -->					
			<!-- /ko -->
			<!-- ko ifnot: $data.component -->
				<div class="ame-si-structure-placeholder">
					<span class="ame-si-structure-placeholder-text">
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
`);
