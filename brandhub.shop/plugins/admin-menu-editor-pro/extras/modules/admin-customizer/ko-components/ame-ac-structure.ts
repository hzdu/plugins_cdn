import {
	createRendererComponentConfig,
	KoComponentParams,
	KoRendererViewModel
} from '../../../pro-customizables/ko-components/control-base.js';
import {AmeCustomizable} from '../../../pro-customizables/assets/customizable.js';
import Section = AmeCustomizable.Section;

class AmeAcStructure extends KoRendererViewModel {
	public readonly allNavigationSections: Section[] = [];

	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);

		const rootSection = new Section(
			{
				t: 'section',
				id: 'structure-root',
				title: this.structure.title ?? 'Root',
			},
			this.structure.children
		);

		//Recursively collect all navigable sections. Don't include content
		//sections: their parents will output them, not this component.
		function collectChildSections(section: Section, accumulator: Section[] = []) {
			if (section.preferredRole === 'navigation') {
				accumulator.push(section);
			}
			for (const child of section.children) {
				if (child instanceof Section) {
					collectChildSections(child, accumulator);
				}
			}
			return accumulator;
		}

		this.allNavigationSections = collectChildSections(rootSection);

		//Give the breadcrumb list to each section, if available.
		if (typeof params.breadcrumbs !== 'undefined') {
			for (const section of this.allNavigationSections) {
				section.componentParams.breadcrumbs = params.breadcrumbs;
			}
		}
	}
}

export default createRendererComponentConfig(AmeAcStructure, `
	<!-- ko foreach: allNavigationSections -->
		<!-- ko component: {name: 'ame-ac-section', params: $data.getComponentParams()} --><!-- /ko -->
	<!-- /ko -->
`);