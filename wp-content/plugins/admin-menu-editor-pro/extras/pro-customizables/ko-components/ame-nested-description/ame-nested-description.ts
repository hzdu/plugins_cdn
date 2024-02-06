import {createComponentConfig} from '../control-base.js';
import {AmeDescriptionComponent} from '../ame-description/ame-description.js';

/**
 * A simple component that displays the description of a UI element.
 *
 * Like AmeSiblingDescription, but intended to be rendered inside
 * the parent control or container, not as a sibling.
 */
class AmeNestedDescription extends AmeDescriptionComponent {
}

export default createComponentConfig(AmeNestedDescription, `
	<br><span class="description" data-bind="html: description"></span>	
`);

