'use strict';
import {createControlComponentConfig, KoComponentParams, KoStandaloneControl} from '../control-base.js';
import {AmeChoiceControl} from '../ame-choice-control/ame-choice-control.js';
import {AmeCustomizable} from '../../assets/customizable.js';
import UiElement = AmeCustomizable.UiElement;


class AmeRadioButtonBar extends AmeChoiceControl {
	constructor(params: KoComponentParams, $element: JQuery) {
		super(params, $element);
	}

	get classes(): string[] {
		return ['ame-radio-button-bar-control', ...super.classes];
	}
}

export default createControlComponentConfig(AmeRadioButtonBar, `
	<fieldset data-bind="class: classString, enable: isEnabled, style: styles" data-ame-is-component="1">
		<!-- ko foreach: options -->
		<label data-bind="attr: {title: description}" class="ame-radio-bar-item">
			<input type="radio" data-bind="class: $component.inputClassString,
				checked: $component.valueProxy, checkedValue: value, enable: $component.isEnabled,
				ameObservableChangeEvents: true">
			<span class="button ame-radio-bar-button" data-bind="css: {'ame-rb-has-label' : label}">
				<!-- ko if: (icon && (icon.indexOf('dashicons-') >= 0)) -->
					<span data-bind="class: 'dashicons ' + icon"></span>
				<!-- /ko -->
				<!-- ko if: label -->
					<span class="ame-rb-label" data-bind="text: label"></span>
				<!-- /ko -->
			</span>
		</label>
		<!-- /ko -->
	</fieldset>
`);