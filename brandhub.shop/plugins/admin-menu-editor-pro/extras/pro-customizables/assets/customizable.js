'use strict';
export var AmeCustomizable;
(function (AmeCustomizable) {
    var some = AmeMiniFunc.some;
    var none = AmeMiniFunc.none;
    var Either = AmeMiniFunc.Either;
    const _ = wsAmeLodash;
    class Setting {
        constructor(id, value = null, defaultValue = null, supportsPostMessage = false, groupTitle = null, validator = null) {
            this.validator = validator;
            this.groupTitle = null;
            /**
             * The last value that was tried to be set. This is used to ignore server-side
             * validation errors when the input value has changed since the request was sent.
             *
             * Displayed validation errors should be relevant to what the user tried
             * to enter, not the currently stored setting value.
             */
            this.lastTriedNewValue = null;
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
            this.validationErrors = ko.observableArray();
            this.isValid = ko.computed(() => {
                return (this.validationErrors().length === 0);
            });
        }
        tryUpdate(newValue) {
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
        validate(newValue) {
            if (this.validator !== null) {
                const result = this.validator.check(newValue);
                if (result.isLeft()) {
                    return [newValue, [result.value]];
                }
                else if (result.isRight()) {
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
        addValidationErrorsForValue(subjectValue, errors) {
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
        clearValidationErrorsForValue(subjectValue) {
            if (this.lastTriedNewValue !== subjectValue) {
                return;
            }
            this.validationErrors.removeAll();
        }
    }
    AmeCustomizable.Setting = Setting;
    function unserializeSettingMap(settings) {
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
    AmeCustomizable.unserializeSettingMap = unserializeSettingMap;
    function unserializeSetting(settingId, definition) {
        return new Setting(settingId, (typeof definition.value !== 'undefined') ? definition.value : null, (typeof definition.defaultValue !== 'undefined') ? definition.defaultValue : null, (typeof definition.supportsPostMessage !== 'undefined') ? definition.supportsPostMessage : false, (typeof definition.groupTitle !== 'undefined') ? definition.groupTitle : null, (typeof definition.validation !== 'undefined') ? (new Validator(definition.validation)) : null);
    }
    AmeCustomizable.unserializeSetting = unserializeSetting;
    const BuiltinParsers = {
        'numeric': (value, config) => {
            //In some UI controls the observable value is updated as the user types,
            //so this parser/validator should be tolerant and accept partial values.
            let parsed;
            let sanitized;
            if (typeof value === 'number') {
                parsed = sanitized = value;
            }
            else {
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
        'int': (value) => {
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
    };
    class Validator {
        constructor(config) {
            this.config = config;
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
        check(value) {
            if (value === null) {
                if (this.config.isNullable) {
                    return Either.right(value);
                }
                else {
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
                const result = parser(value, (parserConfig === null) ? undefined : parserConfig);
                if (result.isLeft()) {
                    return result;
                }
                else if (result.isRight()) {
                    value = result.value;
                }
            }
            return Either.right(value);
        }
    }
    class SettingCollection {
        constructor() {
            this.settings = {};
            /**
             * Adding settings to an observable array makes it easier to automatically
             * update computed values like "are any settings invalid?".
             */
            this.observableSettings = ko.observableArray();
            const self = this;
            this.hasValidationErrors = ko.pureComputed(() => {
                return _.some(self.observableSettings(), (setting) => {
                    return !setting.isValid();
                });
            });
            this.changeListeners = new Map();
        }
        get(id) {
            if (this.settings.hasOwnProperty(id)) {
                return some(this.settings[id]);
            }
            return none;
        }
        add(setting) {
            this.settings[setting.id] = setting;
            this.observableSettings.push(setting);
            setting.value.subscribe((newValue) => this.onSettingChanged(setting, newValue));
        }
        onSettingChanged(setting, newValue) {
            this.notifyChangeListeners(setting, newValue);
        }
        /**
         * Add a callback that will be called whenever the value of a setting changes.
         *
         * @param callback
         */
        addChangeListener(callback) {
            const id = Symbol();
            this.changeListeners.set(id, callback);
            return id;
        }
        removeChangeListener(id) {
            this.changeListeners.delete(id);
        }
        notifyChangeListeners(setting, newValue) {
            for (const listener of this.changeListeners.values()) {
                listener(setting, newValue);
            }
        }
        getAllSettingIds() {
            return Object.keys(this.settings);
        }
        getAllSettingValues() {
            const values = {};
            for (const id in this.settings) {
                if (this.settings.hasOwnProperty(id)) {
                    values[id] = this.settings[id].value();
                }
            }
            return values;
        }
    }
    AmeCustomizable.SettingCollection = SettingCollection;
    function isSettingConditionData(data) {
        if ((typeof data !== 'object') || (data === null)) {
            return false;
        }
        const dataAsRecord = data;
        return (typeof dataAsRecord.settingId === 'string'
            && typeof dataAsRecord.op === 'string'
            && typeof dataAsRecord.value !== 'undefined');
    }
    class SettingCondition {
        constructor(setting, op, value) {
            this.setting = setting;
            this.op = op;
            this.value = value;
        }
        evaluate() {
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
        static fromData(data, findSetting) {
            const setting = findSetting(data.settingId);
            if (!setting || setting.isEmpty()) {
                throw new Error(`Setting with ID "${data.settingId}" not found for SettingCondition`);
            }
            return new SettingCondition(setting.get(), data.op, data.value);
        }
    }
    AmeCustomizable.SettingCondition = SettingCondition;
    class UiElement {
        constructor(data, children = []) {
            this.component = data.component || '';
            this.id = data.id || '';
            this.description = data.description || '';
            this.classes = data.classes || [];
            this.styles = data.styles || {};
            this.componentParams = data.params || {};
            this.children = children;
        }
        getComponentParams() {
            return Object.assign(Object.assign({}, this.componentParams), { uiElement: this, id: this.id, description: this.description, classes: this.classes, styles: this.styles, children: this.children });
        }
    }
    AmeCustomizable.UiElement = UiElement;
    class Container extends UiElement {
        constructor(data, children = []) {
            super(data, children);
            this.title = data.title;
        }
        replaceChild(oldChild, newChild) {
            const index = this.children.indexOf(oldChild);
            if (index === -1) {
                throw new Error('Child not found');
            }
            this.children[index] = newChild;
        }
        replaceChildByIndex(index, newChild) {
            this.children[index] = newChild;
        }
    }
    AmeCustomizable.Container = Container;
    class Section extends Container {
        constructor(data, children = []) {
            super(data, children);
            this.preferredRole = data.preferredRole || 'navigation';
        }
    }
    AmeCustomizable.Section = Section;
    class ControlGroup extends Container {
        constructor(data, children = [], enabled = null) {
            super(data, children);
            this.enabled = enabled || ko.observable(true);
            this.labelFor = data.labelFor || null;
        }
        getComponentParams() {
            return Object.assign(Object.assign({}, super.getComponentParams()), { enabled: this.enabled });
        }
    }
    AmeCustomizable.ControlGroup = ControlGroup;
    class InterfaceStructure extends Container {
        constructor(data, children = []) {
            super(data, children);
        }
        getAsSections() {
            let currentAnonymousSection = null;
            let sections = [];
            for (const child of this.children) {
                if (child instanceof Section) {
                    sections.push(child);
                    currentAnonymousSection = null;
                }
                else {
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
    AmeCustomizable.InterfaceStructure = InterfaceStructure;
    class Control extends UiElement {
        constructor(data, settings = {}, enabled = null, children = []) {
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
                const errors = [];
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
        getComponentParams() {
            return Object.assign(Object.assign({}, super.getComponentParams()), { settings: this.settings, enabled: this.enabled, label: this.label, primaryInputId: this.primaryInputId });
        }
        getAutoGroupTitle() {
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
        createControlGroup() {
            let title = this.getAutoGroupTitle();
            //Some controls like the checkbox already show their own label.
            //Don't add a group title in that case.
            if (this.includesOwnLabel) {
                title = '';
            }
            const data = {
                t: 'control-group',
                title: title
            };
            if (this.labelTargetId) {
                data.labelFor = this.labelTargetId;
            }
            return new ControlGroup(data, [this], this.enabled);
        }
    }
    AmeCustomizable.Control = Control;
    function unserializeUiElement(data, findSetting, dataCustomizer) {
        if (typeof dataCustomizer === 'function') {
            dataCustomizer(data);
        }
        const dataAsRecord = data;
        //Unserialize children recursively.
        let children = [];
        if ((typeof dataAsRecord['children'] !== 'undefined') && Array.isArray(dataAsRecord['children'])) {
            for (const childData of dataAsRecord['children']) {
                children.push(unserializeUiElement(childData, findSetting, dataCustomizer));
            }
        }
        //Unserialize the "enabled" condition.
        let enabled = null;
        if ((data.t === 'control') || (data.t === 'control-group')) {
            if (typeof data.enabled !== 'undefined') {
                if (isSettingConditionData(data.enabled)) {
                    const condition = SettingCondition.fromData(data.enabled, findSetting);
                    enabled = ko.pureComputed(() => condition.evaluate());
                }
                else {
                    enabled = ko.pureComputed(() => !!data.enabled);
                }
            }
            else {
                enabled = ko.observable(true);
            }
        }
        switch (data.t) {
            case 'section':
                return new Section(data, children);
            case 'control-group':
                return new ControlGroup(data, children, enabled);
            case 'structure':
                return new InterfaceStructure(data, children);
            case 'control':
                let settings = {};
                if (data.settings) {
                    for (const childName in data.settings) {
                        if (data.settings.hasOwnProperty(childName)) {
                            const settingId = data.settings[childName];
                            const setting = findSetting(settingId);
                            if (setting.isDefined()) {
                                settings[childName] = setting.get();
                            }
                            else {
                                throw new Error('Unknown setting "' + settingId + '" referenced by control "' + data.label + '".');
                            }
                        }
                    }
                }
                return new Control(data, settings, enabled, children);
        }
    }
    AmeCustomizable.unserializeUiElement = unserializeUiElement;
    class SettingReaderRegistry {
        constructor() {
            this.notFound = {};
            this.valueReaders = [];
        }
        registerValueReader(getter, idPrefix = null) {
            this.valueReaders.push({ getter, idPrefix });
        }
        /**
         * Try to find a setting in a registered setting reader.
         */
        getValue(settingId) {
            for (const { getter, idPrefix } of this.valueReaders) {
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
    AmeCustomizable.SettingReaderRegistry = SettingReaderRegistry;
    class PreviewRegistry {
        constructor(previewValueGetter) {
            this.previewValueGetter = previewValueGetter;
            this.settingPreviewUpdaters = {};
            this.notFound = {};
            this.allPreviewUpdaters = ko.observableArray([]);
        }
        preview(settingId, value) {
            if (!this.settingPreviewUpdaters.hasOwnProperty(settingId)) {
                return;
            }
            const updaters = this.settingPreviewUpdaters[settingId];
            for (const updater of updaters) {
                updater.preview(settingId, value, this.previewValueGetter);
            }
        }
        clearPreview() {
            for (const updater of this.allPreviewUpdaters()) {
                updater.clearPreview();
            }
        }
        registerPreviewUpdater(settingIds, updater) {
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
        registerPreviewCallback(settingId, callback) {
            this.registerPreviewUpdater([settingId], new PreviewCallbackWrapper(callback));
        }
        canPreview(settingId) {
            return (this.settingPreviewUpdaters.hasOwnProperty(settingId)
                && (this.settingPreviewUpdaters[settingId].length > 0));
        }
    }
    AmeCustomizable.PreviewRegistry = PreviewRegistry;
    class PreviewCallbackWrapper {
        constructor(callback) {
            this.callback = callback;
        }
        preview(settingId, value, getSettingValue) {
            this.callback(value);
        }
        clearPreview() {
            //Nothing to do in this case.
        }
    }
    class ThrottledPreviewRegistry extends PreviewRegistry {
        constructor(previewValueGetter, minPreviewRefreshInterval = 40) {
            super(previewValueGetter);
            this.minPreviewRefreshInterval = minPreviewRefreshInterval;
            this.pendingSettings = {};
            this.throttledUpdate = throttleAnimationFrame(this.applyPendingUpdates.bind(this), this.minPreviewRefreshInterval);
        }
        queuePreview(settingId) {
            this.pendingSettings[settingId] = true;
            this.throttledUpdate();
        }
        applyPendingUpdates() {
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
        updatePreview(settingIds) {
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
    AmeCustomizable.ThrottledPreviewRegistry = ThrottledPreviewRegistry;
    /**
     * Creates a throttled function that runs the specified callback at most once
     * every `minInterval` milliseconds.
     *
     * The callback is always invoked using `requestAnimationFrame()`, so it will be delayed
     * until the next frame even if the required interval has already passed.
     */
    function throttleAnimationFrame(callback, minInterval = 0) {
        /**
         * Expected time between animation frames. Intervals shorter than this will be ineffective.
         */
        const expectedFrameTime = 1000 / 60;
        /**
         * The threshold at which we will use `setTimeout()` instead of `requestAnimationFrame()`.
         */
        const timeoutThreshold = Math.max(1000 / 20, expectedFrameTime * 2 + 1);
        const epsilon = 0.001;
        let requestAnimationFrameId = null;
        let timerId = null;
        let lastCallTimestamp = 0;
        let nextCallTimestamp = 0;
        function animationCallback() {
            requestAnimationFrameId = null;
            const now = Date.now();
            if (nextCallTimestamp <= now) {
                lastCallTimestamp = now;
                callback();
                return;
            }
            else {
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
            }
            else {
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
        };
        return invoke;
    }
    //endregion
})(AmeCustomizable || (AmeCustomizable = {}));
export var AmeCustomizableViewModel;
(function (AmeCustomizableViewModel) {
    var SettingCollection = AmeCustomizable.SettingCollection;
    var Setting = AmeCustomizable.Setting;
    var ThrottledPreviewRegistry = AmeCustomizable.ThrottledPreviewRegistry;
    var SettingReaderRegistry = AmeCustomizable.SettingReaderRegistry;
    var lift = AmeMiniFunc.lift;
    class SimpleVm extends ThrottledPreviewRegistry {
        constructor(extraPreviewCondition = null) {
            const getSettingValue = (settingId, defaultResult) => {
                const setting = this.getOrCreateKnownSetting(settingId);
                if (setting !== null) {
                    return setting.value();
                }
                return defaultResult;
            };
            super(getSettingValue, 40);
            this.previewDesired = ko.observable(false);
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
                }
                else {
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
        getSettingObservable(settingId, unusedDefaultValue = null) {
            const result = this.getOrCreateKnownSetting(settingId);
            if (result !== null) {
                return result.value;
            }
            throw new Error('Unknown setting ID: ' + settingId);
        }
        getOrCreateKnownSetting(settingId) {
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
        registerSettingReader(reader, idPrefix = null) {
            this.settingReaders.registerValueReader(reader, idPrefix);
        }
        getPreviewActiveState() {
            return this.previewDesired() && this.isPreviewPossible();
        }
        getAllSettingValues() {
            return this.settings.getAllSettingValues();
        }
        /**
         * Reread all settings from the value readers. This will be used to reload settings
         * in case the underlying configuration is reset or a new configuration is loaded.
         */
        reloadAllSettings() {
            for (const settingId of this.settings.getAllSettingIds()) {
                lift([this.settings.get(settingId), this.settingReaders.getValue(settingId)], (setting, newValue) => setting.value(newValue));
            }
        }
    }
    AmeCustomizableViewModel.SimpleVm = SimpleVm;
    // noinspection JSUnusedGlobalSymbols -- Not used right now, but kept for testing and prototyping purposes.
    class NullVm {
        constructor() {
            this.settings = new SettingCollection();
        }
        getSettingObservable(settingId, defaultValue = null) {
            const existingSetting = this.settings.get(settingId);
            if (existingSetting.isDefined()) {
                return existingSetting.get().value;
            }
            const setting = new Setting(settingId, defaultValue);
            this.settings.add(setting);
            return setting.value;
        }
        getAllSettingValues() {
            return this.settings.getAllSettingValues();
        }
    }
    AmeCustomizableViewModel.NullVm = NullVm;
})(AmeCustomizableViewModel || (AmeCustomizableViewModel = {}));
//# sourceMappingURL=customizable.js.map