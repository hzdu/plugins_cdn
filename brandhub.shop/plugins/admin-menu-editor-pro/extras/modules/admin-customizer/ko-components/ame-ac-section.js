import { ComponentBindingOptions, createComponentConfig, KoContainerViewModel } from '../../../pro-customizables/ko-components/control-base.js';
import { AmeCustomizable } from '../../../pro-customizables/assets/customizable.js';
var Section = AmeCustomizable.Section;
var Control = AmeCustomizable.Control;
var ControlGroup = AmeCustomizable.ControlGroup;
export class AmeAcSection extends KoContainerViewModel {
    constructor(params, $element) {
        super(params, $element);
        //Must have an uiElement.
        if (this.uiElement === null) {
            throw new Error('AmeAcSection must have an uiElement.');
        }
        this.elementId = AmeAcSection.getSectionElementId(this.uiElement);
        if ((typeof params.breadcrumbs !== 'undefined') && ko.isObservable(params.breadcrumbs)) {
            this.breadcrumbs = params.breadcrumbs;
        }
        else {
            this.breadcrumbs = null;
        }
        //To keep the header text alignment consistent when navigating between sections,
        //let's show something even if there are no breadcrumbs.
        const defaultEmptyBreadcrumbText = 'Admin Menu Editor Pro';
        //Let other modules change the default text.
        let filteredEmptyBreadcrumbText = null;
        if (wp && wp.hooks && wp.hooks.applyFilters) {
            filteredEmptyBreadcrumbText = wp.hooks.applyFilters('adminMenuEditor.ac.emptyBreadcrumbText', defaultEmptyBreadcrumbText);
        }
        const emptyBreadcrumbText = ((typeof filteredEmptyBreadcrumbText === 'string')
            ? filteredEmptyBreadcrumbText
            : defaultEmptyBreadcrumbText);
        this.breadcrumbText = ko.pureComputed(() => {
            if (this.breadcrumbs === null) {
                return emptyBreadcrumbText;
            }
            const breadcrumbs = this.breadcrumbs();
            if (breadcrumbs.length < 1) {
                return emptyBreadcrumbText;
            }
            let titles = breadcrumbs.map(crumb => crumb.title);
            //Show the root section differently, "Admin Customizer" is too long.
            //Not sure about what text to use here, could matching the Theme Customizer be confusing?
            //Alternatives: 🛠️🎨, use \uFE0E to render the emoji without colors (only works for some).
            //Alternatives: ⋯ and …
            titles[0] = 'Customizing';
            //Due to space constraints, show only the last 2 breadcrumbs.
            if (titles.length > 2) {
                titles = titles.slice(titles.length - 2);
            }
            return titles.join(' \u25B8 ');
        });
    }
    getExpectedUiElementType() {
        return Section;
    }
    mapChildToComponentBinding(child) {
        if (child instanceof Section) {
            if (child.preferredRole === 'content') {
                return ComponentBindingOptions.fromElement(child, 'ame-ac-content-section');
            }
            else {
                return ComponentBindingOptions.fromElement(child, 'ame-ac-section-link');
            }
        }
        else if (child instanceof ControlGroup) {
            return ComponentBindingOptions.fromElement(child, 'ame-ac-control-group');
        }
        else if ((child instanceof Control)
            && (['ame-ac-separator', 'ame-horizontal-separator'].indexOf(child.component) < 0)) {
            //Wrap each control in a control group if it's not already in one.
            //Separators are an exception because they're cosmetic and need different styling.
            const controlGroup = child.createControlGroup();
            return this.mapChildToComponentBinding(controlGroup);
        }
        else {
            return ComponentBindingOptions.fromElement(child);
        }
    }
    static getSectionElementId(section) {
        return AmeAcSection.generateSectionElementId(section, 'ame-ac-section-');
    }
    static getSectionLinkElementId(section) {
        return AmeAcSection.generateSectionElementId(section, 'ame-ac-slink-');
    }
    static generateSectionElementId(section, prefix) {
        if (section.id) {
            return prefix + section.id;
        }
        const slug = section.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (slug !== '') {
            return prefix + slug;
        }
        throw new Error('Cannot generate a section element ID because the section does not have an ID or a title.');
    }
    dispose() {
        super.dispose();
        this.childComponents.dispose();
    }
}
export default createComponentConfig(AmeAcSection, `
	<ul class="ame-ac-section" data-bind="attr: {id: elementId}">
		<li class="ame-ac-section-meta">
			<div class="ame-ac-section-header">
				<button class="ame-ac-section-back-button">
					<span class="screen-reader-text">Back</span>
				</button>
				<h3 class="ame-ac-section-title" data-bind="css: {'ame-ac-has-breadcrumbs': (breadcrumbText() !== '')}">
				    <!-- ko if: breadcrumbText -->
						<span class="ame-ac-section-breadcrumbs" data-bind="text: breadcrumbText"></span>
					<!-- /ko -->
					<span class="ame-ac-section-own-title" data-bind="text: title"></span>				
				</h3>
			</div>
		</li>
		<!-- ko foreach: childComponents -->
			<!-- ko component: $data --><!-- /ko -->
		<!-- /ko -->
	</ul>
`);
//# sourceMappingURL=ame-ac-section.js.map