import {
	createComponentConfig,
	KoComponentParams,
	KoStandaloneControl
} from '../../../pro-customizables/ko-components/control-base.js';

class AmeAcSeparator extends KoStandaloneControl {

	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);
	}
}

export default createComponentConfig(AmeAcSeparator, `
	<li class="ame-ac-control ame-ac-separator"></li>
`);