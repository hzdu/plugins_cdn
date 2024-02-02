import { createRendererComponentConfig, KoRendererViewModel } from '../../../pro-customizables/ko-components/control-base.js';
import { AmeCustomizable } from '../../../pro-customizables/assets/customizable.js';
var Section = AmeCustomizable.Section;
class AmeAcStructure extends KoRendererViewModel {
    constructor(params, $element) {
        var _a;
        super(params, $element);
        this.allNavigationSections = [];
        const rootSection = new Section({
            t: 'section',
            id: 'structure-root',
            title: (_a = this.structure.title) !== null && _a !== void 0 ? _a : 'Root',
        }, this.structure.children);
        //Recursively collect all navigable sections. Don't include content
        //sections: their parents will output them, not this component.
        function collectChildSections(section, accumulator = []) {
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
//# sourceMappingURL=ame-ac-structure.js.map