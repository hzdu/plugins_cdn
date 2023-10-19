import { createRendererComponentConfig, KoRendererViewModel } from '../control-base.js';
if ((typeof AME_IS_PRODUCTION === 'undefined') || !AME_IS_PRODUCTION) {
    //Add the stylesheet directly to the page.
    let styleUrl = new URL('./ame-si-structure.css', new URL(import.meta.url));
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = styleUrl.toString();
    document.head.appendChild(styleLink);
}
else {
    //@ts-ignore -- Only for Webpack. Not a real JS import.
    import('./ame-si-structure.css');
}
class AmeSiStructure extends KoRendererViewModel {
    constructor(params, $element) {
        super(params, $element);
    }
}
export default createRendererComponentConfig(AmeSiStructure, `
	<!-- ko foreach: structure.children -->
		<!-- Does the component have a "component" property? -->
		<!-- If so, render it. Otherwise, render a placeholder. -->
		<!-- ko if: $data.component -->
				<!-- ko component: { name: $data.component, params: $data.getComponentParams() } --><!-- /ko -->					
		<!-- /ko -->
		<!-- ko ifnot: $data.component -->
			<div class="ame-si-structure-placeholder">
				<span class="ame-si-structure-placeholder-text">
					UI element without a component. <br>
					<!-- ko if: $data.label --> 
						Label: <strong data-bind="text: $data.label"></strong>
					<!-- /ko -->
					<!-- ko if: $data.title -->
					Title: <strong data-bind="text: $data.title"></strong>
					<!-- /ko -->
				</span>
			</div>
		<!-- /ko -->
	<!-- /ko -->
`);
//# sourceMappingURL=ame-si-structure.js.map