'use strict';

/// <reference path="../../../js/common.d.ts" />
/// <reference types="@types/lodash" />

declare var wsAmeLodash: _.LoDashStatic;

export namespace AmeCustomizable {
	import Option = AmeMiniFunc.Option;
	import some = AmeMiniFunc.some;
	import none = AmeMiniFunc.none;
	import Either = AmeMiniFunc.Either;

	const _ = wsAmeLodash;

	export class Setting {
		public readonly id: string;
		public readonly value: KnockoutObservable<any>;
		protected readonly underlyingValue: KnockoutObservable<any>;
		public readonly defaultValue: any;
		public readonly groupTitle: string | null = null;

		public readonly supportsPostMessage: boolean;

		public readonly validationErrors: KnockoutObservableArray<ValidationErrorInterface>;
		public readonly isValid: KnockoutComputed<boolean>;

		/**
		 * The last value that was tried to be set. This is used to ignore server-side
		 * validation errors when the input value has changed since the request was sent.
		 *
		 * Displayed validation errors should be relevant to what the user tried
		 * to enter, not the currently stored setting value.
		 */
		private lastTriedNewValue: any = null;

		constructor(
			id: string,
			value: any = null,
			defaultValue: any = null,
			supportsPostMessage: boolean = false,
			groupTitle: string | null = null,
			protected readonly validator: Validator | null = null
		) {
			this.id = id;
			this.underlyingValue = ko.observable(value);
			this.defaultValue = defaultValue;
			this.supportsPostMessage = supportsPostMessage;
			this.groupTitle = groupTitle;

			this.lastTriedNewValue = value;

			this.value = ko.computed({
				read: () => this.underlyingValue(),
				write: (newValue) => {
					const errors = this.tryUpdate(newValue);
					if (errors && (errors.length > 0)) {
						/*
						We could revert to the previous value here, but there are some cases where
						that would interfere with the user's input. For example, if the user is
						manually typing in a URL, the value will be temporarily invalid until they
						finish entering the protocol and domain name. If we revert to the previous
						value, the user will have to start over.

						Instead, let's leave the invalid value in place and let the user fix it.
						*/
					}
				},
				owner: this
			});

			this.validationErrors = ko.observableArray<ValidationErrorInterface>();
			this.isValid = ko.computed(() => {
				return (this.validationErrors().length === 0);
			});
		}

		tryUpdate(newValue: any): ValidationErrorInterface[] {
			this.lastTriedNewValue = newValue;
			const oldValue = this.underlyingValue();

			//Clear validation errors.
			this.validationErrors.removeAll();

			//Validate and sanitize the new value.
			const [sanitizedValue, errors] = this.validate(newValue);
			this.validationErrors.push(...errors);
			if (errors.length > 0) {
				return errors;
			}

			//Remember the last validation subject so that server-side validation results
			//can be ignored if the value has changed since the request was sent.
			this.lastTriedNewValue = sanitizedValue;

			//Only update the underlying value if it has changed.
			if (sanitizedValue !== oldValue) {
				this.underlyingValue(sanitizedValue);
			}

			return [];
		}

		validate(newValue: any): [any, ValidationErrorInterface[]] {
			if (this.validator !== null) {
				const result = this.validator.check(newValue);
				if (result.isLeft()) {
					return [newValue, [result.value]];
				} else if (result.isRight()) {
					newValue = result.value;
				}
			}
			return [newValue, []];
		}

		/**
		 * Add validation errors to the setting if the current value still
		 * matches the given value.
		 *
		 * This is intended as a way to add validation errors that were produced
		 * asynchronously, such as by sending the value to the server for validation.
		 * The setting's value can change while the validation is in progress,
		 * so we need to check that the validated value matches the current one.
		 *
		 * @param subjectValue
		 * @param errors
		 */
		addValidationErrorsForValue(subjectValue: any, errors: ValidationErrorInterface[]) {
			if (this.lastTriedNewValue !== subjectValue) {
				return;
			}

			//Add the error(s) only if there is no existing error with the same code.
			const existingCodes = _.keyBy(this.validationErrors(), 'code');
			for (const error of errors) {
				if ((typeof error.code === 'undefined') || !existingCodes.hasOwnProperty(error.code)) {
					this.validationErrors.push(error);
				}
			}
		}

		clearValidationErrorsForValue(subjectValue: any) {
			if (this.lastTriedNewValue !== subjectValue) {
				return;
			}
			this.validationErrors.removeAll();
		}
	}

	export interface SettingDefinition {
		value?: any;
		defaultValue?: any;

		/**
		 * A few rare settings have a title that can be used when the control that
		 * shows the setting is put into a new control group.
		 */
		groupTitle?: string;
		/**
		 * Whether the setting supports updating the preview via postMessage,
		 * like in the Customizer. Not used in most contexts.
		 */
		supportsPostMessage?: boolean;

		validation?: SettingValidationConfig;
	}

	export interface SettingDefinitionMap {
		[settingId: string]: SettingDefinition;
	}

	export function unserializeSettingMap(settings: SettingDefinitionMap): SettingCollection {
		const collection = new SettingCollection();
		for (const settingId in settings) {
			if (!settings.hasOwnProperty(settingId)) {
				continue;
			}

			const definition = settings[settingId];
			collection.add(unserializeSetting(settingId, definition));
		}
		return collection;
	}

	export function unserializeSetting(settingId: string, definition: SettingDefinition): Setting {
		return new Setting(
			settingId,
			(typeof definition.value !== 'undefined') ? definition.value : null,
			(typeof definition.defaultValue !== 'undefined') ? definition.defaultValue : null,
			(typeof definition.supportsPostMessage !== 'undefined') ? definition.supportsPostMessage : false,
			(typeof definition.groupTitle !== 'undefined') ? definition.groupTitle : null,
			(typeof definition.validation !== 'undefined') ? (new Validator(definition.validation)) : null
		);
	}

	//region Validation (client-side)
	export interface ValidationErrorInterface {
		message: string;
		code?: string;
	}

	type BuiltinParserId = keyof typeof BuiltinParsers;
	type ParserConfiguration = Record<string, unknown>;

	interface SettingValidationConfig {
		isNullable?: boolean;
		/**
		 * Whether to convert empty strings to null.
		 */
		convertEsToNull?: boolean;
		parsers?: Array<[BuiltinParserId, ParserConfiguration]>;
	}

	type ParserFunction = (value: unknown, config?: ParserConfiguration) => Either<ValidationErrorInterface, any>;

	const BuiltinParsers: Record<string, ParserFunction> = {
		'numeric': (
			value,
			config?: Readonly<{ min?: number, max?: number }>
		): Either<ValidationErrorInterface, number | string> => {
			//In some UI controls the observable value is updated as the user types,
			//so this parser/validator should be tolerant and accept partial values.

			let parsed: number;
			let sanitized: string | number;

			if (typeof value === 'number') {
				parsed = sanitized = value;
			} else {
				sanitized = (typeof value === 'string') ? value : String(value);
				sanitized = AmeMiniFunc.sanitizeNumericString(sanitized);

				parsed = parseFloat(sanitized);
				if (isNaN(parsed)) {
					return Either.left({
						message: 'Value must be a number.',
						code: 'invalid_number'
					});
				}
			}

			if (config) {
				if ((typeof config.min !== 'undefined') && parsed < config.min) {
					return Either.left({
						message: `Value must be ${config.min} or greater`,
						code: 'min_value'
					});
				}

				if (typeof config.max !== 'undefined' && parsed > config.max) {
					return Either.left({
						message: `Value must be ${config.max} or lower`,
						code: 'max_value'
					});
				}
			}

			return Either.right(sanitized);
		},
		'int': (value): Either<ValidationErrorInterface, number> => {
			let parsed = (typeof value === 'number') ? value : parseInt(String(value), 10);
			if (isNaN(parsed)) {
				return Either.left({
					message: 'Value must be a number.',
					code: 'invalid_type'
				});
			}

			parsed = Math.floor(parsed);
			return Either.right(parsed);
		}
	}

	class Validator {
		private readonly parsers: Array<[ParserFunction, ParserConfiguration | null]>;

		constructor(private readonly config: SettingValidationConfig) {
			this.parsers = [];

			//Converting to null is only allowed if the setting is nullable.
			if (config.convertEsToNull && !config.isNullable) {
				throw new Error('convertEsToNull is only allowed if the setting is nullable.');
			}

			if (config.parsers) {
				for (const [parserId, parserConfig] of config.parsers) {
					if (!BuiltinParsers.hasOwnProperty(parserId)) {
						throw new Error(`Unknown parser: ${parserId}`);
					}
					this.parsers.push([BuiltinParsers[parserId], parserConfig]);
				}
			}
		}

		check(value: unknown): Either<ValidationErrorInterface, any> {
			if (value === null) {
				if (this.config.isNullable) {
					return Either.right(value);
				} else {
					return Either.left({
						message: 'This setting cannot be null.'
					});
				}
			}

			if (typeof value === 'string') {
				if (this.config.convertEsToNull && (value === '')) {
					return Either.right(null);
				}
			}

			for (const [parser, parserConfig] of this.parsers) {
				const result = parser(
					value,
					(parserConfig === null) ? undefined : parserConfig
				);
				if (result.isLeft()) {
					return result;
				} else if (result.isRight()) {
					value = result.value;
				}
			}

			return Either.right(value);
		}
	}

	//endregion

	type SettingChangeListener = (setting: Setting, newValue: any) => void;

	export class SettingCollection {
		private settings: Record<string, Setting> = {};
		/**
		 * Adding settings to an observable array makes it easier to automatically
		 * update computed values like "are any settings invalid?".
		 */
		private observableSettings: KnockoutObservableArray<Setting> = ko.observableArray<Setting>();

		/**
		 * Whether any settings currently have validation errors.
		 */
		public readonly hasValidationErrors: KnockoutComputed<boolean>;

		private readonly changeListeners: Map<symbol, SettingChangeListener>;

		constructor() {
			const self = this;

			this.hasValidationErrors = ko.pureComputed(() => {
				return _.some(self.observableSettings(), (setting) => {
					return !setting.isValid();
				});
			});

			this.changeListeners = new Map<symbol, SettingChangeListener>();
		}

		get(id: string): Option<Setting> {
			if (this.settings.hasOwnProperty(id)) {
				return some(this.settings[id]);
			}
			return none;
		}

		add(setting: Setting) {
			this.settings[setting.id] = setting;
			this.observableSettings.push(setting);

			setting.value.subscribe((newValue: any) => this.onSettingChanged(setting, newValue));
		}

		protected onSettingChanged(setting: Setting, newValue: any) {
			this.notifyChangeListeners(setting, newValue);
		}

		/**
		 * Add a callback that will be called whenever the value of a setting changes.
		 *
		 * @param callback
		 */
		addChangeListener(callback: SettingChangeListener): symbol {
			const id = Symbol();
			this.changeListeners.set(id, callback);
			return id;
		}

		removeChangeListener(id: symbol) {
			this.changeListeners.delete(id);
		}

		protected notifyChangeListeners(setting: Setting, newValue: any) {
			for (const listener of this.changeListeners.values()) {
				listener(setting, newValue);
			}
		}

		getAllSettingIds(): string[] {
			return Object.keys(this.settings);
		}

		getAllSettingValues(): Record<string, any> {
			const values: Record<string, any> = {};
			for (const id in this.settings) {
				if (this.settings.hasOwnProperty(id)) {
					values[id] = this.settings[id].value();
				}
			}
			return values;
		}
	}

	type SettingConditionOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'falsy' | 'truthy';

	interface SettingConditionData {
		settingId: string;
		op: SettingConditionOperator;
		value: any;
	}

	function isSettingConditionData(data: unknown): data is SettingConditionData {
		if ((typeof data !== 'object') || (data === null)) {
			return false;
		}

		const dataAsRecord = data as Record<string, unknown>;
		return (
			typeof dataAsRecord.settingId === 'string'
			&& typeof dataAsRecord.op === 'string'
			&& typeof dataAsRecord.value !== 'undefined'
		);
	}

	export class SettingCondition {
		constructor(
			public readonly setting: Setting,
			public readonly op: SettingConditionOperator,
			public readonly value: any,
		) {
		}

		public evaluate(): boolean {
			const settingValue = this.setting.value();
			switch (this.op) {
				case '==':
					//Note the intentional use of == instead of ===.
					return settingValue == this.value;
				case '!=':
					return settingValue != this.value;
				case '>':
					return settingValue > this.value;
				case '<':
					return settingValue < this.value;
				case '>=':
					return settingValue >= this.value;
				case '<=':
					return settingValue <= this.value;
				case 'falsy':
					return !settingValue;
				case 'truthy':
					return !!settingValue;
			}
		}

		public static fromData(data: SettingConditionData, findSetting: SettingLookupFunction): SettingCondition {
			const setting = findSetting(data.settingId);
			if (!setting || setting.isEmpty()) {
				throw new Error(`Setting with ID "${data.settingId}" not found for SettingCondition`);
			}
			return new SettingCondition(setting.get(), data.op, data.value);
		}
	}

	//region UI Structure - Script data
	export interface UiElementData {
		t: string;

		/**
		 * The type of the instance that should be created for this element.
		 * This is not a real property, it's just used to help TypeScript
		 * infer the correct type.
		 */
		instanceType?: unknown;

		component?: string;
		id?: string;
		description?: string;
		classes?: string[];
		styles?: Record<string, any>;

		params?: Record<string, any>;
	}

	export interface ContainerData extends UiElementData {
		title: string;
		children?: AnySpecificElementData[];
	}

	type SectionRole = 'navigation' | 'content';

	export interface SectionData extends ContainerData {
		t: 'section';
		preferredRole?: SectionRole;
		instanceType?: Section;
	}

	interface ToggleableUiElement {
		enabled?: SettingConditionData | boolean;
	}

	export interface ControlGroupData extends ContainerData, ToggleableUiElement {
		t: 'control-group';
		instanceType?: ControlGroup;
		labelFor?: string;

		//... Add other properties later.
	}

	export interface InterfaceStructureData extends ContainerData {
		t: 'structure';
		instanceType?: InterfaceStructure;
	}

	export interface ControlData extends UiElementData, ToggleableUiElement {
		t: 'control';
		instanceType?: Control;

		label: string;

		/**
		 * A map of names to setting IDs. Usually, a control will have a single
		 * setting named 'value', but some controls can have multiple settings.
		 */
		settings: {
			[childName: string]: string;
		};

		inputClasses?: string[];
		inputAttributes?: Record<string, string>;
		includesOwnLabel?: boolean;
		labelTargetId?: string;
		primaryInputId?: string;
	}

	//endregion

	//region UI Structure - Objects
	export type SettingLookupFunction = (id: string) => Option<Setting>;

	export abstract class UiElement {
		public readonly component: string;
		public readonly id: string;
		public readonly description: string;
		/**
		 * Additional CSS classes to add to the outermost DOM node of the element.
		 * Usually that will be a wrapper element, but for some controls it may be
		 * the input itself.
		 */
		public readonly classes: string[];
		/**
		 * Additional CSS styles to add to the outermost DOM node of the element.
		 */
		public readonly styles: Record<string, any>;

		/**
		 * Additional parameters to pass to the Knockout component.
		 */
		public readonly componentParams: Record<string, any>;

		public readonly children: UiElement[];

		protected constructor(data: UiElementData, children: UiElement[] = []) {
			this.component = data.component || '';
			this.id = data.id || '';
			this.description = data.description || '';
			this.classes = data.classes || [];
			this.styles = data.styles || {};
			this.componentParams = data.params || {};
			this.children = children;
		}

		getComponentParams(): Record<string, any> {
			return {
				...this.componentParams,
				uiElement: this,
				id: this.id,
				description: this.description,
				classes: this.classes,
				styles: this.styles,
				children: this.children
			};
		}
	}

	export class Container extends UiElement {
		public readonly title: string;

		protected constructor(data: ContainerData, children: UiElement[] = []) {
			super(data, children);
			this.title = data.title;
		}

		replaceChild(oldChild: UiElement, newChild: UiElement): void {
			const index = this.children.indexOf(oldChild);
			if (index === -1) {
				throw new Error('Child not found');
			}
			this.children[index] = newChild;
		}

		replaceChildByIndex(index: number, newChild: UiElement): void {
			this.children[index] = newChild;
		}
	}

	export class Section extends Container {
		public readonly preferredRole: SectionRole;

		constructor(data: SectionData, children: UiElement[] = []) {
			super(data, children);
			this.preferredRole = data.preferredRole || 'navigation';
		}
	}

	export class ControlGroup extends Container {
		public readonly enabled: KnockoutObservable<boolean>;
		public readonly labelFor: string | null;

		constructor(
			data: ControlGroupData,
			children: UiElement[] = [],
			enabled: KnockoutObservable<boolean> | null = null
		) {
			super(data, children);
			this.enabled = enabled || ko.observable(true);
			this.labelFor = data.labelFor || null;
		}

		getComponentParams(): Record<string, any> {
			return {
				...super.getComponentParams(),
				enabled: this.enabled
			};
		}
	}

	export class InterfaceStructure extends Container {
		constructor(data: InterfaceStructureData, children: UiElement[] = []) {
			super(data, children);
		}

		getAsSections(): Section[] {
			let currentAnonymousSection: Section | null = null;
			let sections: Section[] = [];

			for (const child of this.children) {
				if (child instanceof Section) {
					sections.push(child);
					currentAnonymousSection = null;
				} else {
					if (!currentAnonymousSection) {
						currentAnonymousSection = new Section({
							t: 'section',
							title: '',
							children: []
						});
						sections.push(currentAnonymousSection);
					}
					currentAnonymousSection.children.push(child);
				}
			}

			return sections;
		}
	}

	export type ValidationErrorWithId = [string, ValidationErrorInterface];

	export class Control extends UiElement {
		public readonly label: string;
		public readonly settings: Record<string, Setting>;
		public readonly inputClasses: string[];
		public readonly inputAttributes: Record<string, string>;
		public readonly enabled: KnockoutObservable<boolean>;

		public readonly includesOwnLabel: boolean;
		public readonly labelTargetId: string;
		public readonly primaryInputId: string;

		public readonly settingValidationErrors: KnockoutComputed<ValidationErrorWithId[]>;

		constructor(
			data: ControlData,
			settings: Record<string, Setting> = {},
			enabled: KnockoutObservable<boolean> | null = null,
			children: UiElement[] = []
		) {
			super(data, children);
			this.label = data.label;
			this.settings = settings;
			this.inputClasses = data.inputClasses || [];
			this.inputAttributes = data.inputAttributes || {};
			this.enabled = enabled || ko.observable(true);

			// noinspection PointlessBooleanExpressionJS -- Might not actually be a boolean if sent from the server.
			this.includesOwnLabel = (typeof data.includesOwnLabel !== 'undefined') ? (!!data.includesOwnLabel) : false;
			this.labelTargetId = data.labelTargetId || '';
			this.primaryInputId = data.primaryInputId || '';

			this.settingValidationErrors = ko.pureComputed(() => {
				const errors: ValidationErrorWithId[] = [];
				for (const [settingId, setting] of Object.entries(this.settings)) {
					const settingErrors = setting.validationErrors();
					if (settingErrors.length > 0) {
						for (const error of settingErrors) {
							errors.push([settingId, error]);
						}
					}
				}
				return errors;
			});
		}

		getComponentParams(): Record<string, any> {
			return {
				...super.getComponentParams(),
				settings: this.settings,
				enabled: this.enabled,
				label: this.label,
				primaryInputId: this.primaryInputId,
			};
		}

		getAutoGroupTitle(): string {
			if (this.settings['value']) {
				const customGroupTitle = this.settings['value'].groupTitle;
				if (customGroupTitle) {
					return customGroupTitle;
				}
			}
			return this.label;
		}

		/**
		 * Create a control group wrapper with this control as its only child.
		 */
		createControlGroup(): ControlGroup {
			let title = this.getAutoGroupTitle();
			//Some controls like the checkbox already show their own label.
			//Don't add a group title in that case.
			if (this.includesOwnLabel) {
				title = '';
			}

			const data: ControlGroupData = {
				t: 'control-group',
				title: title
			};
			if (this.labelTargetId) {
				data.labelFor = this.labelTargetId;
			}

			return new ControlGroup(data, [this], this.enabled);
		}
	}

	export type AnySpecificElementData = SectionData | ControlGroupData | InterfaceStructureData | ControlData;

	export function unserializeUiElement<T extends AnySpecificElementData>(
		data: T,
		findSetting: SettingLookupFunction,
		dataCustomizer?: (data: AnySpecificElementData) => void
	): Required<T>["instanceType"] {
		if (typeof dataCustomizer === 'function') {
			dataCustomizer(data);
		}

		const dataAsRecord = data as Record<string, any>;

		//Unserialize children recursively.
		let children = [];
		if ((typeof dataAsRecord['children'] !== 'undefined') && Array.isArray(dataAsRecord['children'])) {
			for (const childData of dataAsRecord['children']) {
				children.push(
					unserializeUiElement(childData, findSetting, dataCustomizer)
				);
			}
		}

		//Unserialize the "enabled" condition.
		let enabled: KnockoutObservable<boolean> | null = null;
		if ((data.t === 'control') || (data.t === 'control-group')) {
			if (typeof data.enabled !== 'undefined') {
				if (isSettingConditionData(data.enabled)) {
					const condition = SettingCondition.fromData(data.enabled, findSetting);
					enabled = ko.pureComputed(() => condition.evaluate());
				} else {
					enabled = ko.pureComputed(() => !!data.enabled);
				}
			} else {
				enabled = ko.observable(true);
			}
		}

		switch (data.t) {
			case 'section':
				return new Section(data as SectionData, children);
			case 'control-group':
				return new ControlGroup(data as ControlGroupData, children, enabled);
			case 'structure':
				return new InterfaceStructure(data as InterfaceStructureData, children);
			case 'control':
				let settings: Record<string, Setting> = {};
				if (data.settings) {
					for (const childName in data.settings) {
						if (data.settings.hasOwnProperty(childName)) {
							const settingId = data.settings[childName];
							const setting = findSetting(settingId);
							if (setting.isDefined()) {
								settings[childName] = setting.get();
							} else {
								throw new Error(
									'Unknown setting "' + settingId + '" referenced by control "' + data.label + '".'
								);
							}
						}
					}
				}
				return new Control(data as ControlData, settings, enabled, children);
		}
	}

	//endregion

	//region Setting readers
	export type SettingValueReader = (settingId: string, defaultResult: any) => any;

	export class SettingReaderRegistry {
		private readonly notFound = {};

		private readonly valueReaders: Array<{
			getter: SettingValueReader,
			idPrefix: string | null
		}> = [];

		registerValueReader(getter: SettingValueReader, idPrefix: string | null = null): void {
			this.valueReaders.push({getter, idPrefix});
		}

		/**
		 * Try to find a setting in a registered setting reader.
		 */
		getValue(settingId: string): Option<any> {
			for (const {getter, idPrefix} of this.valueReaders) {
				if ((idPrefix !== null) && !(settingId.startsWith(idPrefix))) {
					continue;
				}

				const result = getter(settingId, this.notFound);
				if (result !== this.notFound) {
					return some(result);
				}
			}
			return none;
		}
	}

	//endregion

	//region Preview
	export type PreviewCallback = (newValue: any) => void;

	export interface PreviewUpdater {
		/**
		 * Preview the specified setting.
		 *
		 * Usually, this method only receives a subset of all settings. If necessary,
		 * the preview updater can request the value of other settings using
		 * the `getSettingValue` callback.
		 */
		preview(settingId: string, value: any, getSettingValue: SettingValueReader): void;

		clearPreview(): void;
	}

	export class PreviewRegistry {
		protected readonly settingPreviewUpdaters: Record<string, PreviewUpdater[]> = {};
		protected readonly allPreviewUpdaters: KnockoutObservableArray<PreviewUpdater>;
		protected readonly notFound = {};

		constructor(protected readonly previewValueGetter: SettingValueReader) {
			this.allPreviewUpdaters = ko.observableArray([] as PreviewUpdater[]);
		}

		protected preview(settingId: string, value: any): void {
			if (!this.settingPreviewUpdaters.hasOwnProperty(settingId)) {
				return;
			}
			const updaters = this.settingPreviewUpdaters[settingId];
			for (const updater of updaters) {
				updater.preview(settingId, value, this.previewValueGetter);
			}
		}

		clearPreview(): void {
			for (const updater of this.allPreviewUpdaters()) {
				updater.clearPreview();
			}
		}

		registerPreviewUpdater(settingIds: string[], updater: PreviewUpdater): void {
			for (const settingId of settingIds) {
				if (!this.settingPreviewUpdaters.hasOwnProperty(settingId)) {
					this.settingPreviewUpdaters[settingId] = [];
				}
				this.settingPreviewUpdaters[settingId].push(updater);
			}

			if (this.allPreviewUpdaters.indexOf(updater) < 0) {
				this.allPreviewUpdaters.push(updater);
			}
		}

		registerPreviewCallback(settingId: string, callback: PreviewCallback): void {
			this.registerPreviewUpdater([settingId], new PreviewCallbackWrapper(callback));
		}

		canPreview(settingId: string): boolean {
			return (
				this.settingPreviewUpdaters.hasOwnProperty(settingId)
				&& (this.settingPreviewUpdaters[settingId].length > 0)
			);
		}
	}

	class PreviewCallbackWrapper implements PreviewUpdater {
		constructor(private readonly callback: PreviewCallback) {
		}

		preview(settingId: string, value: any, getSettingValue: SettingValueReader): void {
			this.callback(value);
		}

		clearPreview(): void {
			//Nothing to do in this case.
		}
	}

	export class ThrottledPreviewRegistry extends PreviewRegistry {
		private pendingSettings: Record<string, boolean> = {};
		private readonly throttledUpdate: ReturnType<typeof throttleAnimationFrame>;

		constructor(
			previewValueGetter: SettingValueReader,
			private readonly minPreviewRefreshInterval: number = 40
		) {
			super(previewValueGetter);

			this.throttledUpdate = throttleAnimationFrame(
				this.applyPendingUpdates.bind(this),
				this.minPreviewRefreshInterval
			);
		}

		queuePreview(settingId: string): void {
			this.pendingSettings[settingId] = true;
			this.throttledUpdate();
		}

		private applyPendingUpdates() {
			//Cancel any pending updates in case this method was called directly.
			this.throttledUpdate.cancel();

			const pendingSettingIds = Object.keys(this.pendingSettings);
			if (pendingSettingIds.length === 0) {
				return;
			}

			this.updatePreview(pendingSettingIds);
			this.pendingSettings = {};
		}

		/**
		 * Update the preview for the specified settings.
		 *
		 * This method is called by the throttled update function, but it can also be called
		 * directly if necessary, e.g. to update the preview for all settings when the user
		 * opens a settings screen for the first time. Note that calling it will *not* cancel
		 * pending updates.
		 *
		 * @param settingIds
		 */
		updatePreview(settingIds: string[]) {
			if (settingIds.length < 1) {
				return;
			}

			for (const settingId of settingIds) {
				const value = this.previewValueGetter(settingId, this.notFound);
				if (value !== this.notFound) {
					this.preview(settingId, value);
				}
			}
		}

		clearPreview() {
			this.throttledUpdate.cancel();
			this.pendingSettings = {};
			super.clearPreview();
		}
	}

	interface CancelableThrottledFunction {
		/**
		 * Cancels the next scheduled invocation of the throttled function, if any.
		 */
		cancel(): void;
	}

	/**
	 * Creates a throttled function that runs the specified callback at most once
	 * every `minInterval` milliseconds.
	 *
	 * The callback is always invoked using `requestAnimationFrame()`, so it will be delayed
	 * until the next frame even if the required interval has already passed.
	 */
	function throttleAnimationFrame(
		callback: () => any,
		minInterval: number = 0
	): Function & CancelableThrottledFunction {
		/**
		 * Expected time between animation frames. Intervals shorter than this will be ineffective.
		 */
		const expectedFrameTime = 1000 / 60;
		/**
		 * The threshold at which we will use `setTimeout()` instead of `requestAnimationFrame()`.
		 */
		const timeoutThreshold = Math.max(1000 / 20, expectedFrameTime * 2 + 1);
		const epsilon = 0.001;

		let requestAnimationFrameId: number | null = null;
		let timerId: number | null = null;
		let lastCallTimestamp: number = 0;
		let nextCallTimestamp: number = 0;

		function animationCallback() {
			requestAnimationFrameId = null;
			const now = Date.now();
			if (nextCallTimestamp <= now) {
				lastCallTimestamp = now;
				callback();
				return;
			} else {
				requestAnimationFrameId = window.requestAnimationFrame(animationCallback);
			}
		}

		const invoke = () => {
			if ((requestAnimationFrameId !== null) || (timerId !== null)) {
				return; //Already scheduled.
			}

			nextCallTimestamp = lastCallTimestamp + minInterval;
			const now = Date.now();
			if (nextCallTimestamp <= now) {
				nextCallTimestamp = now + expectedFrameTime - epsilon;
			}

			//Two-stage throttling: If the remaining time is large, use setTimeout().
			//If it's small, use requestAnimationFrame() and go frame by frame.
			const remainingTime = nextCallTimestamp - now;
			if (remainingTime > timeoutThreshold) {
				timerId = window.setTimeout(() => {
					timerId = null;
					requestAnimationFrameId = window.requestAnimationFrame(animationCallback);
				}, remainingTime - (expectedFrameTime / 2));
			} else {
				//Use requestAnimationFrame.
				requestAnimationFrameId = window.requestAnimationFrame(animationCallback);
			}
		};

		invoke.cancel = () => {
			if (requestAnimationFrameId !== null) {
				window.cancelAnimationFrame(requestAnimationFrameId);
				requestAnimationFrameId = null;
			}
			if (timerId !== null) {
				window.clearTimeout(timerId);
				timerId = null;
			}
		}
		return invoke;
	}

//endregion
}

export namespace AmeCustomizableViewModel {
	import SettingCollection = AmeCustomizable.SettingCollection;
	import Setting = AmeCustomizable.Setting;

	import ThrottledPreviewRegistry = AmeCustomizable.ThrottledPreviewRegistry;
	import SettingReaderRegistry = AmeCustomizable.SettingReaderRegistry;
	import lift = AmeMiniFunc.lift;
	import SettingValueReader = AmeCustomizable.SettingValueReader;

	export interface CustomizableVmInterface {
		getSettingObservable(settingId: string, defaultValue: unknown): KnockoutObservable<any>;

		getAllSettingValues(): Record<string, any>;
	}

	export class SimpleVm extends ThrottledPreviewRegistry implements CustomizableVmInterface {
		private settings: SettingCollection;

		private readonly settingReaders: SettingReaderRegistry;

		public readonly isPreviewPossible: KnockoutObservable<boolean>;
		public readonly isPreviewEnabled: KnockoutObservable<boolean>;
		private readonly previewDesired = ko.observable(false);

		constructor(extraPreviewCondition: KnockoutObservable<boolean> | null = null) {
			const getSettingValue = (settingId: string, defaultResult: any) => {
				const setting = this.getOrCreateKnownSetting(settingId);
				if (setting !== null) {
					return setting.value();
				}
				return defaultResult;
			};

			super(getSettingValue, 40);

			this.settings = new SettingCollection();
			this.settingReaders = new SettingReaderRegistry();

			this.isPreviewPossible = ko.pureComputed(() => {
				return this.allPreviewUpdaters().length > 0;
			});

			this.isPreviewEnabled = ko.computed({
				read: () => {
					if (extraPreviewCondition !== null) {
						if (!extraPreviewCondition()) {
							return false;
						}
					}
					return this.getPreviewActiveState();
				},
				write: (newValue) => {
					this.previewDesired(newValue);

					if (newValue && !this.getPreviewActiveState()) {
						//Can't actually enable preview. Reset the checkbox/other input.
						this.isPreviewEnabled.notifySubscribers();
					}
				}
			});

			this.isPreviewEnabled.subscribe((newValue) => {
				if (newValue) {
					this.updatePreview(this.settings.getAllSettingIds());
				} else {
					this.clearPreview();
				}
			});

			this.settings.addChangeListener((setting) => {
				if (!this.isPreviewEnabled()) {
					return;
				}
				this.queuePreview(setting.id);
			});
		}

		public getSettingObservable(settingId: string, unusedDefaultValue: unknown = null): KnockoutObservable<any> {
			const result = this.getOrCreateKnownSetting(settingId);
			if (result !== null) {
				return result.value;
			}

			throw new Error('Unknown setting ID: ' + settingId);
		}

		protected getOrCreateKnownSetting(settingId: string): Setting | null {
			const result = this.settings.get(settingId);
			if (result.isDefined()) {
				return result.get();
			}

			const foundValue = this.settingReaders.getValue(settingId);
			if (foundValue.isDefined()) {
				const setting = new Setting(settingId, foundValue.get());
				this.settings.add(setting);
				return setting;
			}

			return null;
		}

		public registerSettingReader(reader: SettingValueReader, idPrefix: string | null = null) {
			this.settingReaders.registerValueReader(reader, idPrefix);
		}

		protected getPreviewActiveState(): boolean {
			return this.previewDesired() && this.isPreviewPossible();
		}

		getAllSettingValues(): Record<string, any> {
			return this.settings.getAllSettingValues();
		}

		/**
		 * Reread all settings from the value readers. This will be used to reload settings
		 * in case the underlying configuration is reset or a new configuration is loaded.
		 */
		reloadAllSettings() {
			for (const settingId of this.settings.getAllSettingIds()) {
				lift(
					[this.settings.get(settingId), this.settingReaders.getValue(settingId)],
					(setting, newValue) => setting.value(newValue)
				);
			}
		}
	}

	// noinspection JSUnusedGlobalSymbols -- Not used right now, but kept for testing and prototyping purposes.
	export class NullVm implements CustomizableVmInterface {
		private readonly settings: SettingCollection;

		constructor() {
			this.settings = new SettingCollection();
		}

		public getSettingObservable(settingId: string, defaultValue: unknown = null): KnockoutObservable<any> {
			const existingSetting = this.settings.get(settingId);
			if (existingSetting.isDefined()) {
				return existingSetting.get().value;
			}

			const setting = new Setting(settingId, defaultValue);
			this.settings.add(setting);
			return setting.value;
		}

		getAllSettingValues(): Record<string, any> {
			return this.settings.getAllSettingValues();
		}
	}
}