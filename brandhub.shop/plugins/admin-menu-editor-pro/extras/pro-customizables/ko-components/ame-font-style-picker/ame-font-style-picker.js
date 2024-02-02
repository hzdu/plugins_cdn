import { createControlComponentConfig, KoStandaloneControl } from '../control-base.js';
//Note: Font style picker CSS is already included in the main 'controls.scss' file
//and won't be duplicated or included here. Instead, load that stylesheet when
//using any control components.
/**
 * Font style options that can be selected in the picker component.
 *
 * Regrettably, these are duplicated from the PHP version of the control.
 * Once browsers support importing JSON files, we can move this to a separate
 * file and use that file in both places.
 */
const fontStyleOptions = {
    "font-style": [
        {
            "value": null,
            "text": "Default font style",
            "label": "&mdash;"
        },
        {
            "value": "italic",
            "text": "Italic",
            "label": "<span class=\"dashicons dashicons-editor-italic\"></span>"
        }
    ],
    "text-transform": [
        {
            "value": null,
            "text": "Default letter case",
            "label": "&mdash;"
        },
        {
            "value": "uppercase",
            "text": "Uppercase",
            "label": {
                'text-transform': 'uppercase'
            }
        },
        {
            "value": "lowercase",
            "text": "Lowercase",
            "label": {
                'text-transform': 'lowercase'
            }
        },
        {
            "value": "capitalize",
            "text": "Capitalize each word",
            "label": {
                'text-transform': 'capitalize'
            }
        }
    ],
    "font-variant": [
        {
            "value": null,
            "text": "Default font variant",
            "label": "&mdash;"
        },
        {
            "value": "small-caps",
            "text": "Small caps",
            "label": {
                'font-variant': 'small-caps'
            }
        }
    ],
    "text-decoration": [
        {
            "value": null,
            "text": "Default text decoration",
            "label": "&mdash;"
        },
        {
            "value": "underline",
            "text": "Underline",
            "label": "<span class=\"dashicons dashicons-editor-underline\"></span>"
        },
        {
            "value": "line-through",
            "text": "Strikethrough",
            "label": "<span class=\"dashicons dashicons-editor-strikethrough\"></span>"
        }
    ]
};
//Generate label HTML for options that don't have it yet.
function makeFontSample(styles) {
    let styleString = '';
    for (const [property, value] of Object.entries(styles)) {
        styleString += `${property}: ${value};`;
    }
    return `<span class="ame-font-sample" style="${styleString}">ab</span>`;
}
let flattenedOptions = [];
for (const [property, options] of Object.entries(fontStyleOptions)) {
    options.forEach((option) => {
        //Skip null values. They're used to indicate the default option,
        //and we don't need those in the Knockout version of this control.
        if (option.value === null) {
            return;
        }
        let labelString;
        if (typeof option.label === 'object') {
            labelString = makeFontSample(option.label);
        }
        else {
            labelString = option.label;
        }
        flattenedOptions.push({
            'value': option.value,
            'text': option.text || '',
            'property': property,
            'label': labelString
        });
    });
}
class AmeFontStylePicker extends KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.options = flattenedOptions;
    }
    get classes() {
        return ['ame-font-style-control', ...super.classes];
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template, below.
    isOptionSelected(property, value) {
        if (this.settings.hasOwnProperty(property)) {
            return (this.settings[property].value() === value);
        }
        return false;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    toggleOption(property, value) {
        if (!this.settings.hasOwnProperty(property)) {
            return;
        }
        const targetSetting = this.settings[property];
        if (targetSetting.value() === value) {
            //When the user clicks on the currently selected option, reset it to the default.
            targetSetting.tryUpdate(null);
        }
        else {
            //Otherwise, set the new value.
            targetSetting.tryUpdate(value);
        }
    }
}
//Note: This weird spacing in the template string is intentional. It's used to
//remove whitespace nodes from the DOM, which would otherwise slightly change
//the layout of the control.
export default createControlComponentConfig(AmeFontStylePicker, `
	<fieldset data-ame-is-component="1" data-bind="class: classString, style: styles">
		<!-- 
		ko foreach: options 
		--><label class="ame-font-style-control-choice" data-bind="attr: {title: (text || '')}"><!-- 
			ko if: text 
			--><span class="screen-reader-text" data-bind="text: text"></span><!-- 
			/ko 
		--><span class="button button-secondary ame-font-style-control-choice-label" 
				data-bind="html: label, css: { 'active': $component.isOptionSelected(property, value) },
				click: $component.toggleOption.bind($component, property, value)"></span></label><!-- 
		/ko -->
	</fieldset>
`);
//# sourceMappingURL=ame-font-style-picker.js.map