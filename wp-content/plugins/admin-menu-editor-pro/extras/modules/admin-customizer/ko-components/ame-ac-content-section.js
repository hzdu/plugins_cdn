import { AmeAcSection } from './ame-ac-section.js';
import { createComponentConfig } from '../../../pro-customizables/ko-components/control-base.js';
class AmeAcContentSection extends AmeAcSection {
    constructor(params, $element) {
        super(params, $element);
        if ((typeof params.parentSectionLevel === 'function') && ko.isObservable(params.parentSectionLevel)) {
            this.parentSectionLevel = params.parentSectionLevel;
        }
        else {
            this.parentSectionLevel = null;
        }
        this.contentSectionLevel = ko.pureComputed(() => {
            let parentLevel = 0;
            if (this.parentSectionLevel !== null) {
                parentLevel = this.parentSectionLevel();
            }
            return parentLevel + 1;
        });
        //Tell child sections about our section level.
        this.childComponents().forEach((child) => {
            if (child.name === 'ame-ac-content-section') {
                child.params.parentSectionLevel = this.contentSectionLevel;
            }
        });
        this.sectionLevelClass = ko.pureComputed(() => {
            const level = this.contentSectionLevel();
            return 'ame-ac-content-section-' + level;
        });
    }
}
export default createComponentConfig(AmeAcContentSection, `
	<li class="ame-ac-control ame-ac-content-section" data-bind="class: sectionLevelClass">
		<h4 class="ame-ac-control-label ame-ac-content-section-title" data-bind="text: title"></h4>	
	</li>	
	<!-- ko foreach: childComponents -->
		<!-- ko component: $data --><!-- /ko -->
	<!-- /ko -->	
`);
//# sourceMappingURL=ame-ac-content-section.js.map