import ameSiStructure from '../../pro-customizables/ko-components/ame-si-structure/ame-si-structure.js';
import ameSiSection from '../../pro-customizables/ko-components/ame-si-section/ame-si-section.js';
import {AmeCustomizable} from '../../pro-customizables/assets/customizable.js';

import ameNumberInput from '../../pro-customizables/ko-components/ame-number-input/ame-number-input.js';
import ameUnitDropdown from '../../pro-customizables/ko-components/ame-unit-dropdown/ame-unit-dropdown.js';
import ameSiControlGroup from '../../pro-customizables/ko-components/ame-si-control-group/ame-si-control-group.js';
import ameTextInput from '../../pro-customizables/ko-components/ame-text-input/ame-text-input.js';
import ameSiblingDescription
	from '../../pro-customizables/ko-components/ame-sibling-description/ame-sibling-description.js';
import ameNestedDescription
	from '../../pro-customizables/ko-components/ame-nested-description/ame-nested-description.js';
import ameToggleCheckbox from '../../pro-customizables/ko-components/ame-toggle-checkbox/ame-toggle-checkbox.js';
import ameSelectBox from '../../pro-customizables/ko-components/ame-select-box/ame-select-box.js';
import ameColorPicker from '../../pro-customizables/ko-components/ame-color-picker/ame-color-picker.js';
import ameFontStylePicker from '../../pro-customizables/ko-components/ame-font-style-picker/ame-font-style-picker.js';
import ameWpEditor from '../../pro-customizables/ko-components/ame-wp-editor/ame-wp-editor.js';
import ameImageSelector from '../../pro-customizables/ko-components/ame-image-selector/ame-image-selector.js';
import ameRadioGroup from '../../pro-customizables/ko-components/ame-radio-group/ame-radio-group.js';
import ameBoxDimensions from '../../pro-customizables/ko-components/ame-box-dimensions/ame-box-dimensions';
import ameRadioButtonBar from '../../pro-customizables/ko-components/ame-radio-button-bar/ame-radio-button-bar.js';
import ameStaticHtml from '../../pro-customizables/ko-components/ame-static-html/ame-static-html.js';

declare const wsAmeKoPrototypeData: AmeKoPrototyping.ScriptData;

namespace AmeKoPrototyping {
	import SettingDefinitionMap = AmeCustomizable.SettingDefinitionMap;
	import InterfaceStructureData = AmeCustomizable.InterfaceStructureData;
	import SettingCollection = AmeCustomizable.SettingCollection;
	import unserializeSettings = AmeCustomizable.unserializeSettingMap;
	import InterfaceStructure = AmeCustomizable.InterfaceStructure;
	import unserializeUiElement = AmeCustomizable.unserializeUiElement;

	import AnySpecificElementData = AmeCustomizable.AnySpecificElementData;

	export interface ScriptData {
		settings: SettingDefinitionMap;
		interfaceStructure: InterfaceStructureData;
	}

	ko.components.register('ame-si-structure', ameSiStructure);
	ko.components.register('ame-si-section', ameSiSection);
	ko.components.register('ame-si-control-group', ameSiControlGroup);
	ko.components.register('ame-number-input', ameNumberInput);
	ko.components.register('ame-unit-dropdown', ameUnitDropdown);

	ko.components.register('ame-text-input', ameTextInput);
	ko.components.register('ame-sibling-description', ameSiblingDescription);
	ko.components.register('ame-nested-description', ameNestedDescription);
	ko.components.register('ame-toggle-checkbox', ameToggleCheckbox);
	ko.components.register('ame-select-box', ameSelectBox);
	ko.components.register('ame-color-picker', ameColorPicker);
	ko.components.register('ame-font-style-picker', ameFontStylePicker);
	ko.components.register('ame-wp-editor', ameWpEditor);
	ko.components.register('ame-image-selector', ameImageSelector);
	ko.components.register('ame-radio-group', ameRadioGroup);
	ko.components.register('ame-box-dimensions', ameBoxDimensions);
	ko.components.register('ame-radio-button-bar', ameRadioButtonBar);
	ko.components.register('ame-static-html', ameStaticHtml);

	class SampleViewModel {
		public settings: SettingCollection;
		public interfaceStructure: InterfaceStructure;

		constructor(data: ScriptData) {
			this.settings = unserializeSettings(data.settings);
			this.interfaceStructure = unserializeUiElement(
				data.interfaceStructure,
				this.settings.get.bind(this.settings),
				//Assign the correct components to container elements.
				(data: AnySpecificElementData) => {
					switch (data.t) {
						case 'section':
							data.component = 'ame-si-section';
							break;
						case 'control-group':
							data.component = 'ame-si-control-group';
							break;
					}
				}
			);
		}
	}

	ko.applyBindings(
		new SampleViewModel(wsAmeKoPrototypeData),
		document.getElementById('ws-ame-ko-prototype-container')
	);
}