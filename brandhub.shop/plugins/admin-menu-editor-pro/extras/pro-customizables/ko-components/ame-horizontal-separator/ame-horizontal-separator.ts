import {createControlComponentConfig, KoComponentParams, KoStandaloneControl} from '../control-base.js';

class AmeHorizontalSeparator extends KoStandaloneControl {
	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);
	}
}

export default createControlComponentConfig(AmeHorizontalSeparator, `
	<div class="ame-horizontal-separator"></div>
`);