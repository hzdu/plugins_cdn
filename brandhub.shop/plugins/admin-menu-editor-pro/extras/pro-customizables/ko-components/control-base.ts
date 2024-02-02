import {AmeCustomizable} from '../assets/customizable.js';
import Setting = AmeCustomizable.Setting;
import ViewModelFactoryFunction = KnockoutComponentTypes.ViewModelFactoryFunction;
import ComponentInfo = KnockoutComponentTypes.ComponentInfo;
import InterfaceStructure = AmeCustomizable.InterfaceStructure;
import UiElement = AmeCustomizable.UiElement;
import Control = AmeCustomizable.Control;
import Container = AmeCustomizable.Container;

//region Component (base)
export type KoComponentParams = Record<string, unknown>;

export abstract class KoComponentViewModel<UiElementType extends UiElement | never> {
	public readonly uiElement: UiElementType | null;

	/**
	 * Whether the component is bound to a comment node instead of a real DOM element.
	 *
	 * You can use the `<!-- ko component: ... -->` syntax to render a component without
	 * wrapping it in a new DOM element.
	 *
	 * @protected
	 */
	protected readonly isBoundToComment: boolean;

	public readonly isEnabled: KnockoutObservable<boolean>;

	protected readonly customClasses: string[];
	protected readonly customStyles: Record<string, any>;
	protected readonly description: string;

	protected readonly inputChildren: Array<UiElement> | KnockoutObservableArray<UiElement>;

	protected constructor(
		protected readonly params: KoComponentParams,
		protected readonly $element: JQuery
	) {
		this.isBoundToComment = ($element[0]) && ($element[0].nodeType === Node.COMMENT_NODE);

		this.uiElement = null;
		const expectedType = this.getExpectedUiElementType();
		if (expectedType !== null) {
			if (
				(typeof params.uiElement !== 'undefined')
				&& (params.uiElement instanceof expectedType)
			) {
				this.uiElement = params.uiElement;
			} else {
				throw new Error('uiElement is not a ' + expectedType.name + ' instance.');
			}
		} else if ((typeof params.uiElement !== 'undefined') && !(this instanceof KoStandaloneControl)) {
			console.warn(
				'Unexpected "uiElement" parameter for ' + this.constructor.name
				+ ' that did not expect an UI element. Did you forget to override getExpectedUiElementType() ?',
				params.uiElement
			);
		}

		if (typeof params.children !== 'undefined') {
			if (Array.isArray(params.children) || this.isObservableArray(params.children)) {
				this.inputChildren = params.children;
			} else {
				throw new Error('Invalid "children" parameter: expected an array or an observable array.');
			}
		} else {
			this.inputChildren = [];
		}

		this.customClasses = ((typeof params.classes === 'object') && Array.isArray(params.classes)) ? params.classes : [];
		this.customStyles = ((typeof params.styles === 'object') && (params.styles !== null)) ? params.styles : {};

		if (typeof params.enabled !== 'undefined') {
			if (ko.isObservable(params.enabled)) {
				this.isEnabled = params.enabled;
			} else {
				this.isEnabled = ko.pureComputed(() => !!params.enabled);
			}
		} else {
			this.isEnabled = ko.pureComputed(() => true);
		}

		//Get the description either from the "description" parameter or from the UI element.
		this.description = params.description
			? ko.unwrap(params.description.toString())
			: (this.uiElement?.description || '');
	}

	public dispose(): void {
		//Does nothing by default.
	}

	protected getExpectedUiElementType(): Constructor<UiElementType> | null {
		return null;
	}

	get classes(): string[] {
		return ([] as string[]).concat(this.customClasses);
	}

	// noinspection JSUnusedGlobalSymbols -- Used in Knockout templates.
	get classString(): string {
		return this.classes.join(' ');
	}

	get styles(): Record<string, any> {
		return Object.assign({}, this.customStyles);
	}

	protected findChild(selector: string, allowSiblingSearch: boolean | null = null): JQuery {
		if (allowSiblingSearch === null) {
			//Enable only if the component is bound to a comment (i.e. "<!-- ko component: ... -->").
			allowSiblingSearch = this.isBoundToComment;
		}

		if (this.isBoundToComment) {
			if (allowSiblingSearch) {
				return this.$element.nextAll(selector).first();
			} else {
				//We would never find anything because a comment node has no children.
				return jQuery();
			}
		}
		return this.$element.find(selector);
	}

	private isObservableArray(value: any): value is KnockoutObservableArray<any> {
		return (typeof value === 'object')
			&& (value !== null)
			&& (typeof value.slice === 'function')
			&& (typeof value.indexOf === 'function')
			&& (ko.isObservable(value));
	}
}

function makeCreateVmFunctionForComponent<C extends UiElement, T extends KoComponentViewModel<C>>(
	ctor: Constructor<T>
): ViewModelFactoryFunction['createViewModel'] {
	return function (params: KoComponentParams, componentInfo: ComponentInfo) {
		const $element = jQuery(componentInfo.element);
		return new ctor(params, $element);
	};
}

export function createComponentConfig<C extends UiElement, T extends KoComponentViewModel<C>>(
	ctor: Constructor<T>,
	templateString: string
): KnockoutComponentTypes.ComponentConfig {
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
	constructor(
		public readonly name: string,
		public readonly params: KoComponentParams,
		public readonly uiElement?: UiElement | null
	) {
		if (name === '') {
			throw new Error('Component name cannot be empty.');
		}
	}

	static fromElement(element: UiElement, overrideComponentName: string | null = null): ComponentBindingOptions {
		if (!element.component && (overrideComponentName === null)) {
			throw new Error(
				`Cannot create component binding options for UI element "${element.id}" without a component name.`
			);
		}
		return new ComponentBindingOptions(
			overrideComponentName || element.component,
			element.getComponentParams(),
			element
		);
	}
}

export abstract class KoContainerViewModel<C extends Container> extends KoComponentViewModel<C> {

	public readonly title: KnockoutObservable<string>;

	public readonly childComponents: KnockoutComputed<ComponentBindingOptions[]>;

	protected constructor(
		params: KoComponentParams,
		$element: JQuery
	) {
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
			return result as ComponentBindingOptions[];
		});
	}

	protected mapChildToComponentBinding(child: UiElement): ComponentBindingOptions | null {
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
export abstract class KoControlViewModel<C extends Control> extends KoComponentViewModel<C> {
	protected readonly settings: Record<string, Setting>;
	public readonly valueProxy: KnockoutObservable<any>;
	public readonly label: string;

	public readonly inputAttributes: KnockoutComputed<{ [name: string]: string }>;
	protected readonly primaryInputId: string | null;

	protected constructor(
		params: KoComponentParams,
		$element: JQuery,
	) {
		super(params, $element);

		this.settings =
			((typeof params.settings === 'object') && isSettingMap(params.settings))
				? params.settings
				: {};

		if (typeof this.settings.value !== 'undefined') {
			this.valueProxy = this.settings.value.value;
		} else {
			this.valueProxy = ko.pureComputed(() => {
				console.error('Missing "value" setting for a control component.', this.settings, params);
				return '';
			});
		}

		//Input ID will be provided by the server if applicable.
		this.primaryInputId = (typeof params.primaryInputId === 'string') ? params.primaryInputId : null;

		this.inputAttributes = ko.pureComputed(() => {
			const attributes = this.uiElement?.inputAttributes || {};

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
		} else {
			this.label = this.uiElement?.label || '';
		}
	}

	get inputClasses(): string[] {
		return this.uiElement?.inputClasses || [];
	}

	// noinspection JSUnusedGlobalSymbols -- Used in Knockout templates.
	get inputClassString(): string {
		return this.inputClasses.join(' ');
	}

	protected getAdditionalInputAttributes(): Record<string, string> {
		return {};
	}

	protected getPrimaryInputId(): string | null {
		return this.primaryInputId;
	}
}

function isSettingMap(value: unknown): value is Record<string, Setting> {
	if (value === null) {
		return false;
	}
	if (typeof value !== 'object') {
		return false;
	}
	const valueAsRecord = value as Record<string, unknown>;

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
export abstract class KoStandaloneControl extends KoControlViewModel<never> {
}

/**
 * A control that requires a UI element of the "Control" class.
 */
export abstract class KoDependentControl extends KoControlViewModel<Control> {
	protected getExpectedUiElementType(): Constructor<AmeCustomizable.Control> | null {
		return Control;
	}
}

export function createControlComponentConfig<C extends Control, T extends KoControlViewModel<C>>(
	ctor: Constructor<T>,
	templateString: string
): KnockoutComponentTypes.ComponentConfig {
	return {
		viewModel: {
			createViewModel: makeCreateVmFunctionForComponent(ctor),
		},
		template: templateString,
	};
}

//endregion

//region Renderer
export class KoRendererViewModel extends KoComponentViewModel<never> {
	protected structure: AmeCustomizable.InterfaceStructure;

	protected constructor(
		params: KoComponentParams,
		$element: JQuery
	) {
		super(params, $element);

		if ((typeof params.structure !== 'object') || !(params.structure instanceof InterfaceStructure)) {
			throw new Error('Invalid interface structure for a renderer component.');
		}
		this.structure = params.structure;
	}
}

export function createRendererComponentConfig<T extends KoRendererViewModel>(
	ctor: new (params: KoComponentParams, $element: JQuery) => T,
	templateString: string
): KnockoutComponentTypes.ComponentConfig {
	return {
		viewModel: {
			createViewModel: makeCreateVmFunctionForComponent(ctor),
		},
		template: templateString,
	};
}

//endregion