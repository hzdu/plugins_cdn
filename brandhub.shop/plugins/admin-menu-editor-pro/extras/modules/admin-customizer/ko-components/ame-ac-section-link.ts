import {
	createComponentConfig,
	KoComponentParams,
	KoContainerViewModel
} from '../../../pro-customizables/ko-components/control-base.js';
import {AmeCustomizable} from '../../../pro-customizables/assets/customizable.js';
import Section = AmeCustomizable.Section;
import {AmeAcSection} from './ame-ac-section.js';

class AmeAcSectionLink extends KoContainerViewModel<Section> {
	public readonly targetElementId: string;
	public readonly elementId: string;

	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);
		//uiElement is required for this component.
		if (!this.uiElement) {
			throw new Error('The uiElement parameter is required for AmeAcSectionLink');
		}
		this.targetElementId = AmeAcSection.getSectionElementId(this.uiElement);
		this.elementId = AmeAcSection.getSectionLinkElementId(this.uiElement);
	}

	protected getExpectedUiElementType(): Constructor<AmeCustomizable.Section> | null {
		return Section;
	}
}

export default createComponentConfig(AmeAcSectionLink, `
	<li class="ame-ac-section-link" data-bind="attr: {'data-target-id' : targetElementId, 'id': elementId}">
		<h3 class="ame-ac-section-title" data-bind="text: title"></h3>
	</li>
`);