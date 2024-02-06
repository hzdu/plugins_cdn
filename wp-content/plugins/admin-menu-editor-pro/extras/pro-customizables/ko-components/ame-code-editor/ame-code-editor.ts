'use strict';
import {createControlComponentConfig, KoComponentParams, KoStandaloneControl} from '../control-base.js';

/**
 * Code editor control with syntax highlighting.
 *
 * This control uses the custom Knockout binding "ameCodeMirror" to do the heavy
 * lifting. The binding is defined in ko-extensions.ts.
 *
 * Note: The user can disable syntax highlighting. In that case, this control
 * should behave like a normal textarea.
 */
class AmeCodeEditor extends KoStandaloneControl {
	protected readonly editorSettings: object | false;

	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);

		if ((typeof params.editorSettings === 'object') && (params.editorSettings !== null)) {
			this.editorSettings = params.editorSettings;
		} else {
			this.editorSettings = false;
		}
	}
}

export default createControlComponentConfig(AmeCodeEditor, `
	<div class="ame-code-editor-control-wrap">  
		<textarea data-bind="attr: inputAttributes, value: valueProxy, 
			class: inputClassString, ameCodeMirror: editorSettings" 
			class="large-text" cols="50" rows="10"></textarea>
	</div>
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->
`);