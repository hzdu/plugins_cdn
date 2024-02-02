import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
/**
 * A wrapper for the WordPress color picker.
 *
 * Note that the custom 'ameColorPicker' binding must be available when this component
 * is used. You must enqueue the 'ame-ko-extensions' script for this to work.
 */
class AmeColorPicker extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
    }
    koDescendantsComplete(node) {
        //Make the color picker input visible. Its visibility is set to hidden by default.
        if (node.nodeType === Node.COMMENT_NODE) {
            //The component was bound to a comment node. The real element
            //should be the next non-comment sibling.
            let nextElement;
            do {
                nextElement = node.nextElementSibling;
            } while (nextElement && (nextElement.nodeType === Node.COMMENT_NODE));
            if (!nextElement) {
                return; //This should never happen.
            }
            node = nextElement;
        }
        if (!node || (node.nodeType !== Node.ELEMENT_NODE)) {
            return; //This should never happen.
        }
        const $picker = jQuery(node);
        //This should be a .wp-picker-container element that contains an input.
        const $input = $picker.find('input.ame-color-picker');
        if ($input.length > 0) {
            $input.css('visibility', 'visible');
        }
    }
    get classes() {
        return ['ame-color-picker', 'ame-color-picker-component', ...super.classes];
    }
}
export default createControlComponentConfig(AmeColorPicker, `
	<input type="text" style="visibility: hidden" data-bind="ameColorPicker: valueProxy, 
		class: classString, attr: inputAttributes">
`);
//# sourceMappingURL=ame-color-picker.js.map