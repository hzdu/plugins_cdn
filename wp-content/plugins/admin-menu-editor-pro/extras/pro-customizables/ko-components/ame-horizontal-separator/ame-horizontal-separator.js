import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
class AmeHorizontalSeparator extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
    }
}
export default createControlComponentConfig(AmeHorizontalSeparator, `
	<div class="ame-horizontal-separator"></div>
`);
//# sourceMappingURL=ame-horizontal-separator.js.map