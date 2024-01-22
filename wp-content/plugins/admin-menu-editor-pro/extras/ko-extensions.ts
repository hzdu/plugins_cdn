/// <reference path="../js/common.d.ts" />
/// <reference path="../js/knockout.d.ts" />
/// <reference path="../js/jquery.d.ts" />
/// <reference types="@types/lodash" />

declare var wsAmeLodash: _.LoDashStatic;

interface AmeKnockoutDialog {
	isOpen: KnockoutObservable<boolean>;

	options?: Record<string, any>;
	autoCancelButton?: boolean;
	jQueryWidget: JQuery | null;
	title: KnockoutObservable<string | null>;
	confirmButtonLabel?: KnockoutObservable<string | null>;
	confirmButtonId?: string;

	onOpen?(event: JQueryEventObject, ui: any): void;

	onClose?(event: JQueryEventObject, ui: any): void;

	onBeforeInit?(): void;
}

abstract class AmeBaseKnockoutDialog implements AmeKnockoutDialog {
	isOpen: KnockoutObservable<boolean> = ko.observable(false);
	jQueryWidget: JQuery | null = null;
	title: KnockoutObservable<string | null> = ko.observable(null);

	options: Record<string, any> = {
		buttons: []
	};

	abstract isConfirmButtonEnabled: KnockoutObservable<boolean>;
	public abstract readonly confirmButtonLabel: KnockoutObservable<string | null>;
	public readonly confirmButtonId: string;

	private firstInitDone: boolean = false;

	protected static readonly autoIdPrefix: string = 'ws-ame-dialogAuto-';
	protected static autoIdCounter: number = 0;

	protected constructor() {
		this.confirmButtonId = AmeBaseKnockoutDialog.autoIdPrefix + 'confirm-' + AmeBaseKnockoutDialog.autoIdCounter++;
	}

	onBeforeInit(): void {
		if (this.firstInitDone) {
			return;
		}
		this.firstInitDone = true;

		const confirmButtonLabel = this.confirmButtonLabel();
		if (confirmButtonLabel !== null) {
			this.options.buttons.push({
				text: confirmButtonLabel,
				'class': 'button button-primary ame-dialog-confirm-button',
				id: this.confirmButtonId,
				click: this.handleConfirmButtonClick.bind(this),
				disabled: true //Should be enabled by using the isConfirmButtonEnabled observable.
			});
		}
	}

	protected handleConfirmButtonClick(event: JQueryEventObject): void {
		if (!this.isConfirmButtonEnabled()) {
			event.preventDefault();
			return;
		}
		this.onConfirm(event);
	}

	onConfirm(event: JQueryEventObject): void {
		//Override in subclasses.
		event.preventDefault();
	}

	onSubmit(event: JQueryEventObject): void {
		if (this.isConfirmButtonEnabled()) {
			this.onConfirm(event);
		} else {
			event.preventDefault();
		}
	}
}

/*
 * jQuery Dialog binding for Knockout.
 *
 * The main parameter of the binding is an instance of AmeKnockoutDialog. In addition to the standard
 * options provided by jQuery UI, the binding supports two additional properties:
 *
 *  isOpen - Required. A boolean observable that controls whether the dialog is open or closed.
 *  autoCancelButton - Set to true to add a WordPress-style "Cancel" button that automatically closes the dialog.
 *
 * Usage example:
 * <div id="my-dialog" data-bind="ameDialog: {isOpen: anObservable, autoCancelButton: true, options: {minWidth: 400}}">...</div>
 */
ko.bindingHandlers.ameDialog = {
	init: function (element, valueAccessor) {
		const dialog = ko.utils.unwrapObservable(valueAccessor()) as AmeKnockoutDialog;
		const _ = wsAmeLodash;

		if (dialog.onBeforeInit) {
			dialog.onBeforeInit();
		}

		let options: JQueryUI.DialogOptions = dialog.options ? dialog.options : {};
		if (!dialog.hasOwnProperty('isOpen')) {
			dialog.isOpen = ko.observable(false);
		}

		options = _.defaults(options, {
			autoCancelButton: _.get(dialog, 'autoCancelButton', true),
			autoOpen: dialog.isOpen(),
			modal: true,
			closeText: ' '
		});

		//Update isOpen when the dialog is opened or closed.
		options.open = function (event: JQueryEventObject, ui: any) {
			dialog.isOpen(true);
			if (dialog.onOpen) {
				dialog.onOpen(event, ui);
			}
		};
		options.close = function (event: JQueryEventObject, ui: any) {
			dialog.isOpen(false);
			if (dialog.onClose) {
				dialog.onClose(event, ui);
			}
		};

		let buttons = (typeof options['buttons'] !== 'undefined') ? ko.utils.unwrapObservable(options.buttons) : [];
		const autoCancelButton: boolean = _.get(options, 'autoCancelButton', false);
		if (autoCancelButton && Array.isArray(buttons)) {
			//In AME, the "Cancel" option is usually on the right side of the form/dialog/pop-up.
			buttons.push({
				text: 'Cancel',
				'class': 'button button-secondary ame-dialog-cancel-button',
				click: function () {
					jQuery(this).closest('.ui-dialog-content').dialog('close');
				}
			});
		}
		options.buttons = buttons;

		if (!dialog.hasOwnProperty('title') || (dialog.title === null)) {
			dialog.title = ko.observable(_.get(options, 'title', null));
		} else if (dialog.title()) {
			options.title = dialog.title() || undefined;
		}

		//Do in a setTimeout so that applyBindings doesn't bind twice from element being copied and moved to bottom.
		window.setTimeout(function () {
			jQuery(element).dialog(options);

			dialog.jQueryWidget = jQuery(element).dialog('widget');
			dialog.title(jQuery(element).dialog('option', 'title'));

			dialog.title.subscribe(function (newTitle) {
				jQuery(element).dialog('option', 'title', newTitle);
			});

			if (dialog.confirmButtonId && dialog.confirmButtonLabel) {
				dialog.confirmButtonLabel.subscribe(function (newLabel) {
					if (newLabel === null) {
						return;
					}
					jQuery('#' + dialog.confirmButtonId).button('option', 'label', newLabel);
				});
			}

			if (ko.utils.unwrapObservable(dialog.isOpen)) {
				jQuery(element).dialog('open');
			}
		}, 0);


		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			jQuery(element).dialog('destroy');
		});
	},

	update: function (element, valueAccessor) {
		const dialog = ko.utils.unwrapObservable(valueAccessor()) as AmeKnockoutDialog;
		const $element = jQuery(element);
		const shouldBeOpen = ko.utils.unwrapObservable(dialog.isOpen);

		//Do nothing if the dialog hasn't been initialized yet.
		const $widget = $element.dialog('instance');
		if (!$widget) {
			return;
		}

		if (shouldBeOpen !== $element.dialog('isOpen')) {
			$element.dialog(shouldBeOpen ? 'open' : 'close');
		}
	}
};

ko.bindingHandlers.ameOpenDialog = {
	init: function (element, valueAccessor) {
		const clickHandler = function (event: JQueryEventObject) {
			const dialogSelector = ko.utils.unwrapObservable(valueAccessor());

			//Do nothing if the dialog hasn't been initialized yet.
			const $widget = jQuery(dialogSelector);
			if (!$widget.dialog('instance')) {
				return;
			}

			$widget.dialog('open');
			event.stopPropagation();
		};
		jQuery(element).on('click', clickHandler);

		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			jQuery(element).off('click', clickHandler);
		});
	}
};

/*
 * The ameEnableDialogButton binding enables the specified jQuery UI button only when the "enabled" parameter is true.
 *
 * It's tricky to bind directly to dialog buttons because they're created dynamically and jQuery UI places them
 * outside dialog content. This utility binding takes a jQuery selector, letting you bind to a button indirectly.
 * You can apply it to any element inside a dialog, or the dialog itself.
 *
 * Usage:
 * <div data-bind="ameEnableDialogButton: { selector: '.my-button', enabled: anObservable }">...</div>
 * <div data-bind="ameEnableDialogButton: justAnObservable">...</div>
 *
 * If you omit the selector, the binding will enable/disable the first button that has the "button-primary" CSS class.
 */
ko.bindingHandlers.ameEnableDialogButton = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		//This binding could be applied before the dialog is initialised. In this case, the button won't exist yet.
		//Wait for the dialog to be created and then update the button.
		const dialogNode = jQuery(element).closest('.ui-dialog');
		if (dialogNode.length < 1) {
			const body = jQuery(element).closest('body');

			function setInitialButtonState() {
				//Is this our dialog?
				let dialogNode = jQuery(element).closest('.ui-dialog');
				if (dialogNode.length < 1) {
					return; //Nope.
				}

				//Yes. Remove the event handler and update the binding.
				body.off('dialogcreate', setInitialButtonState);
				if (ko.bindingHandlers.ameEnableDialogButton.update) {
					ko.bindingHandlers.ameEnableDialogButton.update(
						element,
						valueAccessor,
						allBindings,
						viewModel,
						bindingContext
					);
				}
			}

			body.on('dialogcreate', setInitialButtonState);
			//If our dialog never gets created, we still want to clean up the event handler eventually.
			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				body.off('dialogcreate', setInitialButtonState);
			});
		}
	},

	update: function (element, valueAccessor) {
		const _ = wsAmeLodash;
		let options = ko.unwrap(valueAccessor());
		if (!_.isPlainObject(options)) {
			options = {enabled: options};
		}

		options = _.defaults(
			options,
			{
				selector: '.button-primary:first',
				enabled: false
			}
		);

		jQuery(element)
			.closest('.ui-dialog')
			.find('.ui-dialog-buttonset')
			.find(options.selector)
			.button('option', 'disabled', !ko.utils.unwrapObservable(options.enabled));
	}
};

ko.bindingHandlers.ameColorPicker = {
	init: function (element, valueAccessor) {
		let valueUnwrapped = ko.unwrap(valueAccessor());

		const input = jQuery(element);
		input.val(valueUnwrapped);

		const guard = '__ameColorPickerIgnoreChange';
		let ignoredObservableValue: string | null = guard;
		let ignoredPickerValue: string | null = guard;

		function maybeUpdateObservableFromPicker(newValue: string) {
			//Don't update the observable if this color picker change was triggered
			//by the observable	itself changing (see the computed observable below).
			if (newValue === ignoredPickerValue) {
				return;
			}

			let observable = valueAccessor();
			if (!ko.isWriteableObservable(observable)) {
				return; //Can't update this thing.
			}

			//Don't update the observable if the value hasn't changed.
			//This helps prevent infinite loops.
			if (newValue === observable.peek()) {
				return;
			}

			//Avoid an unnecessary color picker update when changing the observable value.
			//This also helps prevent loops, and prevents a subtle bug where quickly
			//changing the color (e.g. by dragging the saturation slider) would cause
			//the picker to "drift" away from the actual color.
			ignoredObservableValue = newValue;
			observable(newValue);
			ignoredObservableValue = guard;
		}

		input.wpColorPicker({
			change: function (event: JQueryEventObject, ui: any) {
				maybeUpdateObservableFromPicker(ui.color.toString());
			},
			clear: function () {
				maybeUpdateObservableFromPicker('');
			}
		});

		//Update the picker when the observable changes. We're using a computed observable
		//instead of the "update" callback because this lets us store state in the closure.
		ko.computed(function () {
			let newValue = ko.unwrap(valueAccessor());
			if (typeof newValue !== 'string') {
				newValue = '';
			}
			if (newValue === ignoredObservableValue) {
				return;
			}

			ignoredPickerValue = newValue;
			if (newValue === '') {
				//Programmatically click the "Clear" button. It's not elegant, but I haven't found
				//a way to do this using the Iris API.
				input.closest('.wp-picker-input-wrap').find('.wp-picker-clear').trigger('click');
			} else {
				input.iris('color', newValue);
			}
			ignoredPickerValue = guard;
		}, null, {disposeWhenNodeIsRemoved: element});
	}
};

/**
 * This binding generates a custom JS event when the value of an observable changes.
 * It also listens for another custom event and updates the observable to the specified value.
 *
 * Usage:
 * <input type="text" data-bind="value: someObservable, ameObservableChangeEvents: someObservable" />
 *
 * Alternatively, you can set the parameter to "true". This binding will then look for
 * other bindings that are commonly used to set the value of an element (e.g. "value"),
 * and use the observable value of the first one it finds.
 *
 * Finally, you can pass an object with the following properties:
 * - observable: The observable to watch for changes, or "true" (see above).
 * - sendInitEvent: If true, the binding will send an event when it's initialized.
 */
ko.bindingHandlers.ameObservableChangeEvents = {
	init: function (element, valueAccessor, allBindings) {
		const defaults = {
			observable: null,
			sendInitEvent: false
		};

		let options = valueAccessor();

		if (ko.isObservable(options)) {
			//Just the observable.
			options = Object.assign({}, defaults, {observable: options});
		} else if (options === true) {
			//"true" means we'll try to find the observable automatically (see below).
			options = Object.assign({}, defaults, {observable: true});
		} else if (typeof options === 'object') {
			//Custom options.
			options = Object.assign({}, defaults, options);
		} else {
			throw new Error('Invalid options for the ameObservableChangeEvents binding.');
		}

		let targetObservable = options.observable;
		if (targetObservable === true) {
			let alternativeFound = false;
			const possibleValueBindings = ['value', 'checked', 'selectedOptions'];
			for (let i = 0; i < possibleValueBindings.length; i++) {
				const bindingValue = allBindings.get(possibleValueBindings[i]);
				if (ko.isWriteableObservable(bindingValue)) {
					targetObservable = bindingValue;
					alternativeFound = true;
					break;
				}
			}
			if (!alternativeFound) {
				throw new Error(
					'ameObservableChangeEvents did not find a suitable observable to watch. ' +
					'Supported bindings: ' + possibleValueBindings.join(', ')
				);
			}
		} else if (!ko.isWriteableObservable(targetObservable)) {
			throw new Error('The ameObservableChangeEvents binding accepts only an observable or the boolean "true".');
		}

		const inEvent = 'adminMenuEditor:controlValueChanged';
		const outEvent = 'adminMenuEditor:observableValueChanged';
		const initEvent = 'adminMenuEditor:observableBindingInit';

		const $element = jQuery(element);
		const uniqueMarker = {};
		let ignoredValue = uniqueMarker;

		const subscription = targetObservable.subscribe(function (newValue: unknown) {
			//Don't trigger the "out" event if the value was changed as a result
			//of the "in" event.
			if (newValue === ignoredValue) {
				return;
			}
			//console.log('Observable changed: ', newValue);
			$element.trigger(outEvent, [newValue]);
		});

		const incomingChangeHandler = function (event: JQueryEventObject, newValue: unknown) {
			//Ignore events from child elements. For example, in a BoxDimensions control,
			//popup sliders associated with individual number inputs trigger their own
			//"controlValueChanged" events.
			if (event.target !== element) {
				return;
			}

			if ((typeof newValue !== 'undefined') && (newValue !== targetObservable.peek())) {
				//console.log('Control changed: ', newValue);
				ignoredValue = newValue as any;
				targetObservable(newValue);
				ignoredValue = uniqueMarker;
			}
		};

		$element.on(inEvent, incomingChangeHandler);

		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			// @ts-ignore - My jQuery typings are out of date.
			$element.off(inEvent, incomingChangeHandler);
			subscription.dispose();
		});

		//Optionally, send an initial event to synchronize the control with the observable.
		if (options.sendInitEvent) {
			$element.trigger(initEvent, [targetObservable.peek()]);
		}
	}
}

//A one-way binding for indeterminate checkbox states.
ko.bindingHandlers.indeterminate = {
	update: function (element, valueAccessor) {
		element.indeterminate = !!(ko.unwrap(valueAccessor()));
	}
};

//A "readonly" property binding for input and textarea elements.
ko.bindingHandlers.readonly = {
	update: function (element, valueAccessor) {
		const value = !!(ko.unwrap(valueAccessor()));
		if (value !== element.readOnly) {
			element.readOnly = value;
		}
	}
};

{
	interface ToggleCheckboxOptions {
		checked: KnockoutObservable<any>;
		onValue: any,
		offValue: any
	}

	function parseToggleCheckboxOptions(options: object): ToggleCheckboxOptions {
		let parsed: ToggleCheckboxOptions = wsAmeLodash.defaults(
			ko.unwrap(options),
			{
				onValue: true,
				offValue: false,
				checked: ko.pureComputed(() => false)
			}
		);
		parsed.onValue = ko.unwrap(parsed.onValue);
		parsed.offValue = ko.unwrap(parsed.offValue);
		return parsed;
	}

	ko.bindingHandlers.ameToggleCheckbox = {
		init: function (element, valueAccessor) {
			const $element = jQuery(element);

			const changeHandler = function () {
				const options = parseToggleCheckboxOptions(valueAccessor());
				if (ko.isWriteableObservable(options.checked)) {
					options.checked(
						$element.prop('checked') ? options.onValue : options.offValue
					);
				}
			}

			$element.on('change', changeHandler);
			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				$element.off('change', changeHandler);
			});
		},

		update: function (element, valueAccessor) {
			const options = parseToggleCheckboxOptions(valueAccessor());
			const checked = (ko.unwrap(options.checked) === options.onValue);
			jQuery(element).prop('checked', checked);
		}
	}
}

//region Validation

//Adds an error CSS class to the element if the associated setting has any validation errors.
ko.bindingHandlers.ameValidationErrorClass = {
	init: function (element, valueAccessor) {
		const errorClassName = 'ame-has-validation-errors';

		ko.computed({
			read: function () {
				//The parameter should be a Setting object.
				const value = ko.unwrap(valueAccessor());
				if (!value || (typeof value.validationErrors === 'undefined')) {
					return;
				}

				const errors = ko.unwrap(value.validationErrors);
				if (Array.isArray(errors) && (errors.length > 0)) {
					element.classList.add(errorClassName);
				} else {
					element.classList.remove(errorClassName);
				}
			},
			disposeWhenNodeIsRemoved: element
		});
	}
};

//This could be extracted to AmeValidationError in common.d.ts. Then it could be used
//for both settings and observables.
interface ObservableValidationError {
	message: string;
	code?: string;
}

interface ObservableValidationFields {
	ameValidationErrors: KnockoutObservable<ObservableValidationError[]>;
	ameIsValid: () => boolean;
}

type ValidatedObservable<T> =
	(KnockoutComputed<T> & ObservableValidationFields)
	| (KnockoutObservable<T> & ObservableValidationFields);

function ameIsValidatedObservable<T>(observable: unknown): observable is ValidatedObservable<T> {
	if ((typeof observable === 'undefined') || (observable === null)) {
		return false;
	}

	return (
		ko.isObservable(observable)
		&& ko.isObservable((observable as any).ameValidationErrors)
	);
}

{
	const validationErrorCssClass = 'ame-has-validation-errors';

	interface ElementWithValidation extends HTMLElement {
		setCustomValidity: (message: string) => void;
	}

	function isElementWithValidation(element: Node): element is ElementWithValidation {
		return (
			(element instanceof HTMLElement)
			&& (typeof (element as any).setCustomValidity === 'function')
		);
	}

	type ExtractValidityState = (value: unknown) => AmeMiniFunc.Option<{
		isValid: boolean,
		errors: ObservableValidationError[]
	}>;

	function makeValidityBindingHandler(getValidity: ExtractValidityState): KnockoutBindingHandler['init'] {
		return function (element: Node, valueAccessor: () => any) {
			if (!(element instanceof HTMLElement)) {
				throw new Error('This binding can only be used with elements.');
			}
			if (!isElementWithValidation(element)) {
				throw new Error('This binding can only be used with elements that support the constraint validation API.');
			}

			ko.computed({
				read: function () {
					const value = valueAccessor();
					const stateOption = getValidity(value);

					if (stateOption.isEmpty()) {
						return;
					}
					const state = stateOption.get();

					if (state.isValid) {
						element.classList.remove(validationErrorCssClass);
						element.setCustomValidity('');
					} else {
						if (!element.classList.contains(validationErrorCssClass)) {
							element.classList.add(validationErrorCssClass);
						}
						const errors = state.errors;
						if (Array.isArray(errors) && (errors.length > 0)) {
							//Make am error list separated by newlines.
							element.setCustomValidity(errors.map(e => e.message).join('\n'));
						} else {
							//Default message.
							element.setCustomValidity('Invalid value');
						}
					}
				},
				disposeWhenNodeIsRemoved: element
			});
		}
	}

	ko.bindingHandlers.ameObservableValidity = {
		init: makeValidityBindingHandler((value: unknown) => {
			if (!ameIsValidatedObservable(value)) {
				return AmeMiniFunc.none;
			}

			const errors = ko.unwrap(value.ameValidationErrors);
			return AmeMiniFunc.some({
				isValid: !errors || (errors.length === 0),
				errors: errors
			});
		})
	};

	ko.bindingHandlers.ameSettingValidity = {
		init: makeValidityBindingHandler((value: unknown) => {
			const valueAsRecord = value as Record<string, unknown>;

			//The parameter should be a Setting object, but we're not importing
			//that here because then this would have to be a module.
			if (!valueAsRecord || (typeof valueAsRecord['validationErrors'] === 'undefined')) {
				return AmeMiniFunc.none;
			}

			const errors = ko.unwrap(valueAsRecord.validationErrors);
			if (Array.isArray(errors) && (errors.length > 0)) {
				return AmeMiniFunc.some({
					isValid: false,
					//Setting validation errors should already be structurally compatible
					//with ObservableValidationErrors.
					errors: errors
				});
			} else {
				return AmeMiniFunc.some({
					isValid: true,
					errors: []
				});
			}
		})
	};
}

//endregion

// noinspection JSUnusedGlobalSymbols -- Used to define the "ameNumericInput" extender.
interface KnockoutExtenders {
	ameNumericInput: (target: KnockoutObservable<unknown>) => KnockoutObservable<unknown>;
}

{
	type SufficientlyNumericType = string | number | null;

	function sanitizeAnyValueAsNumeric(value: unknown): string | number | null {
		if (value === null) {
			return value as null;
		} else if (typeof value === 'number') {
			return value;
		}
		return AmeMiniFunc.sanitizeNumericString(
			(typeof value === 'string') ? value : String(value)
		);
	}

	/**
	 * An extender that leniently converts any value to a number or numeric string.
	 *
	 * This is useful for input fields that accept numbers, but also allow empty values.
	 * It is intended for live, as-you-type sanitization, so it is intentionally tolerant
	 * of incomplete and un-normalized values like:
	 *
	 * - "1." (missing the decimal part)
	 * - "1.500" (unnecessary trailing zeros)
	 * - "-" (minus sign without a number)
	 *
	 * For details on the sanitization algorithm, see {@link AmeMiniFunc.sanitizeNumericString()}.
	 */
	ko.extenders.ameNumericInput = function (target: KnockoutObservable<unknown>) {
		const displayValue: KnockoutObservable<SufficientlyNumericType> = ko.observable(
			sanitizeAnyValueAsNumeric(target.peek())
		);

		target.subscribe(function (newValue) {
			displayValue(sanitizeAnyValueAsNumeric(newValue));
		});

		const result = ko.pureComputed({
			read: displayValue,
			write: function (newValue: unknown) {
				const oldDisplayValue = displayValue.peek();

				let sanitizedValue: SufficientlyNumericType = sanitizeAnyValueAsNumeric(newValue);
				const hasChanged = (sanitizedValue !== oldDisplayValue);

				if (hasChanged) {
					displayValue(sanitizedValue);
				} else if (sanitizedValue !== newValue) {
					//If the sanitized value is different, we should update any associated form fields
					//to show the sanitized value. This is usually automatic except when the sanitized
					//value is the same as the old value (e.g. "1a" -> "1"). In that case, we need to
					//manually notify subscribers.
					result.notifySubscribers(sanitizedValue);
				}

				//Also update the underlying observable if the value has changed.
				if (hasChanged) {
					target(sanitizedValue);
				}
			}
		});

		return result;
	}
}

ko.bindingHandlers.ameCodeMirror = {
	init: function (element, valueAccessor, allBindings) {
		if (!wp.hasOwnProperty('codeEditor') || !wp.codeEditor.initialize) {
			return;
		}
		let parameters = ko.unwrap(valueAccessor());
		if (!parameters) {
			return;
		}

		let options;
		let refreshTrigger: KnockoutObservable<any> | null = null;
		if (parameters.options) {
			options = parameters.options;
			if (parameters.refreshTrigger) {
				refreshTrigger = parameters.refreshTrigger;
			}
		} else {
			options = parameters;
		}

		let result = wp.codeEditor.initialize(element, options);
		const cm = result.codemirror;

		//Synchronize the editor contents with the observable passed to the "value" binding.
		const valueBinding = allBindings.get('value');
		const valueObservable = (ko.isObservable(valueBinding) ? valueBinding : null);

		let subscription: KnockoutSubscription | null = null;
		let changeHandler: null | (() => void) = null;
		if (valueObservable !== null) {
			//Update the observable when the contents of the editor change.
			let ignoreNextUpdate = false;
			changeHandler = function () {
				//This will trigger our observable subscription (see below).
				//We need to ignore that trigger to avoid recursive or duplicated updates.
				ignoreNextUpdate = true;
				valueObservable(cm.doc.getValue());
			};
			cm.on('changes', changeHandler);

			//Update the editor when the observable changes.
			subscription = valueObservable.subscribe(function (newValue) {
				if (ignoreNextUpdate) {
					ignoreNextUpdate = false;
					return;
				}
				cm.doc.setValue(newValue);
				ignoreNextUpdate = false;
			});
		}

		//Refresh the size of the editor element when an observable changes value.
		let refreshSubscription: KnockoutSubscription | null = null;
		if (refreshTrigger) {
			refreshSubscription = refreshTrigger.subscribe(function () {
				cm.refresh();
			});
		}

		//If the editor starts out hidden - for example, because it's inside a collapsed section - it will
		//render incorrectly. To fix that, let's refresh it the first time it becomes visible.
		if (!jQuery(element).is(':visible') && (typeof IntersectionObserver !== 'undefined')) {
			const observer = new IntersectionObserver(
				function (entries) {
					for (let i = 0; i < entries.length; i++) {
						if (entries[i].isIntersecting) {
							//The editor is at least partially visible now.
							observer.disconnect();
							cm.refresh();
							break;
						}
					}
				},
				{
					//Use the browser viewport.
					root: null,
					//The threshold is somewhat arbitrary. Any value will work, but a lower setting means
					//that the user is less likely to see an incorrectly rendered editor.
					threshold: 0.05
				}
			);
			observer.observe(cm.getWrapperElement());
		}

		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			//Remove subscriptions and event handlers.
			if (subscription) {
				subscription.dispose();
			}
			if (refreshSubscription) {
				refreshSubscription.dispose();
			}
			if (changeHandler) {
				cm.off('changes', changeHandler);
			}

			//Destroy the CodeMirror instance.
			jQuery(cm.getWrapperElement()).remove();
		});
	}
};