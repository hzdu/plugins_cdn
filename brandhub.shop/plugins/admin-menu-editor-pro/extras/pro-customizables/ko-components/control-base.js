import { AmeCustomizable } from '../assets/customizable.js';
var Setting = AmeCustomizable.Setting;
var InterfaceStructure = AmeCustomizable.InterfaceStructure;
var Control = AmeCustomizable.Control;
export class KoComponentViewModel {
    constructor(params, $element) {
        var _a;
        this.params = params;
        this.$element = $element;
        this.isBoundToComment = ($element[0]) && ($element[0].nodeType === Node.COMMENT_NODE);
        this.uiElement = null;
        const expectedType = this.getExpectedUiElementType();
        if (expectedType !== null) {
            if ((typeof params.uiElement !== 'undefined')
                && (params.uiElement instanceof expectedType)) {
                this.uiElement = params.uiElement;
            }
            else {
                throw new Error('uiElement is not a ' + expectedType.name + ' instance.');
            }
        }
        else if ((typeof params.uiElement !== 'undefined') && !(this instanceof KoStandaloneControl)) {
            console.warn('Unexpected "uiElement" parameter for ' + this.constructor.name
                + ' that did not expect an UI element. Did you forget to override getExpectedUiElementType() ?', params.uiElement);
        }
        if (typeof params.children !== 'undefined') {
            if (Array.isArray(params.children) || this.isObservableArray(params.children)) {
                this.inputChildren = params.children;
            }
            else {
                throw new Error('Invalid "children" parameter: expected an array or an observable array.');
            }
        }
        else {
            this.inputChildren = [];
        }
        this.customClasses = ((typeof params.classes === 'object') && Array.isArray(params.classes)) ? params.classes : [];
        this.customStyles = ((typeof params.styles === 'object') && (params.styles !== null)) ? params.styles : {};
        if (typeof params.enabled !== 'undefined') {
            if (ko.isObservable(params.enabled)) {
                this.isEnabled = params.enabled;
            }
            else {
                this.isEnabled = ko.pureComputed(() => !!params.enabled);
            }
        }
        else {
            this.isEnabled = ko.pureComputed(() => true);
        }
        //Get the description either from the "description" parameter or from the UI element.
        this.description = params.description
            ? ko.unwrap(params.description.toString())
            : (((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.description) || '');
    }
    dispose() {
        //Does nothing by default.
    }
    getExpectedUiElementType() {
        return null;
    }
    get classes() {
        return [].concat(this.customClasses);
    }
    // noinspection JSUnusedGlobalSymbols -- Used in Knockout templates.
    get classString() {
        return this.classes.join(' ');
    }
    get styles() {
        return Object.assign({}, this.customStyles);
    }
    findChild(selector, allowSiblingSearch = null) {
        if (allowSiblingSearch === null) {
            //Enable only if the component is bound to a comment (i.e. "<!-- ko component: ... -->").
            allowSiblingSearch = this.isBoundToComment;
        }
        if (this.isBoundToComment) {
            if (allowSiblingSearch) {
                return this.$element.nextAll(selector).first();
            }
            else {
                //We would never find anything because a comment node has no children.
                return jQuery();
            }
        }
        return this.$element.find(selector);
    }
    isObservableArray(value) {
        return (typeof value === 'object')
            && (value !== null)
            && (typeof value.slice === 'function')
            && (typeof value.indexOf === 'function')
            && (ko.isObservable(value));
    }
}
function makeCreateVmFunctionForComponent(ctor) {
    return function (params, componentInfo) {
        const $element = jQuery(componentInfo.element);
        return new ctor(params, $element);
    };
}
export function createComponentConfig(ctor, templateString) {
    return {
        viewModel: {
            createViewModel: makeCreateVmFunctionForComponent(ctor),
        },
        template: templateString,
    };
}
//endregion
//region Container
export class ComponentBindingOptions {
    // noinspection JSUnusedGlobalSymbols -- the uiElement property is used in the KO template of AC control groups.
    constructor(name, params, uiElement) {
        this.name = name;
        this.params = params;
        this.uiElement = uiElement;
        if (name === '') {
            throw new Error('Component name cannot be empty.');
        }
    }
    static fromElement(element, overrideComponentName = null) {
        if (!element.component && (overrideComponentName === null)) {
            throw new Error(`Cannot create component binding options for UI element "${element.id}" without a component name.`);
        }
        return new ComponentBindingOptions(overrideComponentName || element.component, element.getComponentParams(), element);
    }
}
export class KoContainerViewModel extends KoComponentViewModel {
    constructor(params, $element) {
        if (typeof params.children === 'undefined') {
            throw new Error('Missing "children" parameter.');
        }
        super(params, $element);
        this.title = ko.pureComputed(() => {
            if (typeof params.title !== 'undefined') {
                let title = ko.unwrap(params.title);
                if ((title !== null) && (typeof title !== 'undefined')) {
                    return title.toString();
                }
            }
            if (this.uiElement) {
                return this.uiElement.title;
            }
            return '';
        });
        this.childComponents = ko.pureComputed(() => {
            const result = ko.unwrap(this.inputChildren)
                .map(child => this.mapChildToComponentBinding(child))
                .filter(binding => binding !== null);
            //TypeScript does not recognize that the filter() call above removes
            //all null values, so we need an explicit cast.
            return result;
        });
    }
    mapChildToComponentBinding(child) {
        //Does not map any children by default.
        return null;
    }
    dispose() {
        super.dispose();
        this.childComponents.dispose();
    }
}
//endregion
//region Control
export class KoControlViewModel extends KoComponentViewModel {
    constructor(params, $element) {
        var _a;
        super(params, $element);
        this.settings =
            ((typeof params.settings === 'object') && isSettingMap(params.settings))
                ? params.settings
                : {};
        if (typeof this.settings.value !== 'undefined') {
            this.valueProxy = this.settings.value.value;
        }
        else {
            this.valueProxy = ko.pureComputed(() => {
                console.error('Missing "value" setting for a control component.', this.settings, params);
                return '';
            });
        }
        //Input ID will be provided by the server if applicable.
        this.primaryInputId = (typeof params.primaryInputId === 'string') ? params.primaryInputId : null;
        this.inputAttributes = ko.pureComputed(() => {
            var _a;
            const attributes = ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.inputAttributes) || {};
            const inputId = this.getPrimaryInputId();
            if ((inputId !== null) && (inputId !== '')) {
                attributes.id = inputId;
            }
            //Note: The "name" field is not used because these controls are entirely JS-driven.
            const additionalAttributes = this.getAdditionalInputAttributes();
            for (const key in additionalAttributes) {
                if (!additionalAttributes.hasOwnProperty(key)) {
                    continue;
                }
                attributes[key] = additionalAttributes[key];
            }
            return attributes;
        });
        if ((typeof params.label !== 'undefined') && (params.label !== null)) {
            const unwrappedLabel = ko.unwrap(params.label);
            this.label = (typeof unwrappedLabel === 'undefined') ? '' : unwrappedLabel.toString();
        }
        else {
            this.label = ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.label) || '';
        }
    }
    get inputClasses() {
        var _a;
        return ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.inputClasses) || [];
    }
    // noinspection JSUnusedGlobalSymbols -- Used in Knockout templates.
    get inputClassString() {
        return this.inputClasses.join(' ');
    }
    getAdditionalInputAttributes() {
        return {};
    }
    getPrimaryInputId() {
        return this.primaryInputId;
    }
}
function isSettingMap(value) {
    if (value === null) {
        return false;
    }
    if (typeof value !== 'object') {
        return false;
    }
    const valueAsRecord = value;
    for (const key in valueAsRecord) {
        if (!valueAsRecord.hasOwnProperty(key)) {
            continue;
        }
        if (!(valueAsRecord[key] instanceof Setting)) {
            return false;
        }
    }
    return true;
}
/**
 * A control that doesn't use or need a UI element instance, but can still have
 * settings and other parameters typically associated with controls.
 */
export class KoStandaloneControl extends KoControlViewModel {
}
/**
 * A control that requires a UI element of the "Control" class.
 */
export class KoDependentControl extends KoControlViewModel {
    getExpectedUiElementType() {
        return Control;
    }
}
export function createControlComponentConfig(ctor, templateString) {
    return {
        viewModel: {
            createViewModel: makeCreateVmFunctionForComponent(ctor),
        },
        template: templateString,
    };
}
//endregion
//region Renderer
export class KoRendererViewModel extends KoComponentViewModel {
    constructor(params, $element) {
        super(params, $element);
        if ((typeof params.structure !== 'object') || !(params.structure instanceof InterfaceStructure)) {
            throw new Error('Invalid interface structure for a renderer component.');
        }
        this.structure = params.structure;
    }
}
export function createRendererComponentConfig(ctor, templateString) {
    return {
        viewModel: {
            createViewModel: makeCreateVmFunctionForComponent(ctor),
        },
        template: templateString,
    };
}
//endregion
//# sourceMappingURL=control-base.js.map