import { createComponentConfig } from '../control-base.js';
import { AmeDescriptionComponent } from '../ame-description/ame-description.js';
/**
 * A simple component that displays the description of a UI element.
 *
 * This should be rendered as a sibling of the UI element's component,
 * typically immediately after it.
 *
 * Caution: HTML is allowed in the description.
 */
class AmeSiblingDescription extends AmeDescriptionComponent {
}
export default createComponentConfig(AmeSiblingDescription, `
	<p class="description" data-bind="html: description"></p>	
`);
//# sourceMappingURL=ame-sibling-description.js.map