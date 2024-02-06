'use strict';

/// <reference path="../../../js/common.d.ts" />
/// <reference types="@types/lodash" />
/// <reference path="../../jszip/jszip.d.ts" />

import {AmeCustomizable, AmeCustomizableViewModel} from '../../pro-customizables/assets/customizable.js';
import {registerBaseComponents} from '../../pro-customizables/ko-components/ame-components.js';
import AmeAcStructure from './ko-components/ame-ac-structure.js';
import AmeAcSection from './ko-components/ame-ac-section.js';
import AmeAcSectionLink from './ko-components/ame-ac-section-link.js';
import AmeAcControl from './ko-components/ame-ac-control.js';
import AmeAcControlGroup from './ko-components/ame-ac-control-group.js';
import AmeAcContentSection from './ko-components/ame-ac-content-section.js';
import {AmeAdminCustomizerBase} from './admin-customizer-base.js';
import AmeAcSeparator from './ko-components/ame-ac-separator.js';
import AmeAcValidationErrors from './ko-components/ame-ac-validation-errors.js';
import z, {ZodError, ZodType} from '../../zod/lib/index.js';

declare var wsAmeLodash: _.LoDashStatic;
declare const wsAmeAdminCustomizerData: AmeAdminCustomizer.ScriptData;

export namespace AmeAdminCustomizer {
	import Setting = AmeCustomizable.Setting;
	import SettingCollection = AmeCustomizable.SettingCollection;
	import InterfaceStructureData = AmeCustomizable.InterfaceStructureData;
	import InterfaceStructure = AmeCustomizable.InterfaceStructure;
	import unserializeUiElement = AmeCustomizable.unserializeUiElement;
	import unserializeSetting = AmeCustomizable.unserializeSetting;
	import AnySpecificElementData = AmeCustomizable.AnySpecificElementData;
	import CustomizableVmInterface = AmeCustomizableViewModel.CustomizableVmInterface;

	const $ = jQuery;
	const _ = wsAmeLodash;

	registerBaseComponents();
	ko.components.register('ame-ac-structure', AmeAcStructure);
	ko.components.register('ame-ac-section', AmeAcSection);
	ko.components.register('ame-ac-section-link', AmeAcSectionLink);
	ko.components.register('ame-ac-content-section', AmeAcContentSection);
	ko.components.register('ame-ac-control-group', AmeAcControlGroup);
	ko.components.register('ame-ac-control', AmeAcControl);
	ko.components.register('ame-ac-separator', AmeAcSeparator);
	ko.components.register('ame-ac-validation-errors', AmeAcValidationErrors);

	export interface ScriptData extends AmeAdminCustomizerBase.ScriptData, AdminThemeTexts {
		ajaxUrl: string;
		saveChangesetNonce: string;
		trashChangesetNonce: string;
		changesetItemCount: number;
		changesetStatus: string;
		changesetThemeMetadata: AdminThemeMetadata | null;

		refreshPreviewNonce: string;
		initialPreviewUrl: string;
		interfaceStructure: InterfaceStructureData;

		/**
		 * The template to use when generating the URL for a changeset.
		 *
		 * By default, the changeset name is added as a query parameter. Alternatively,
		 * you can use a path template that includes a "{changeset}" placeholder, which
		 * will be replaced with the changeset name.
		 */
		changesetPathTemplate: string | null;

		/**
		 * Whether to use pushState() to update the URL when the changeset name changes.
		 *
		 * By default, we discourage navigating to the old URL (no pushState()) because
		 * the name is only expected to change when the old changeset becomes invalid
		 * (e.g. it's deleted or published).
		 */
		changesetPushStateEnabled: boolean;

		/**
		 * Admin Customizer base path. Defaults to the current URL path.
		 *
		 * Note that setting this to a non-empty value will also stop AC from
		 * adding the "page" query parameter to the URL.
		 */
		customBasePath: string | null;

		exitPromptMode?: number;
	}

	interface AdminThemeTexts {
		generatorCreditPhrase?: string;
		standalonePluginNote?: string;
	}

	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	let prefersReducedMotion = reducedMotionQuery && reducedMotionQuery.matches;
	reducedMotionQuery.addEventListener('change', () => {
		prefersReducedMotion = reducedMotionQuery.matches;
	});

	class CustomizerSettingsCollection extends SettingCollection {
		/**
		 * Settings that have changed since the last save attempt.
		 */
		private pendingSettings: Record<string, Setting> = {};
		/**
		 * Settings that in the process of being sent to the server to be saved.
		 * They might not be saved yet.
		 */
		private sentSettings: Record<string, Setting> = {};
		private currentChangesetRequest: JQueryXHR | null = null;
		private saveTriggerTimeoutId: null | ReturnType<typeof setTimeout> = null;

		private readonly currentChangeset: KnockoutObservable<Changeset>;
		public readonly changesetName: KnockoutComputed<string>;

		public readonly adminThemeMetadata: KnockoutObservable<AdminThemeMetadata | null>;
		private readonly underlyingMetadata: KnockoutObservable<AdminThemeMetadata | null> = ko.observable<AdminThemeMetadata | null>(null);
		private readonly metadataHasChanged: KnockoutObservable<boolean> = ko.observable<boolean>(false);

		public readonly isExclusiveOperationInProgress: KnockoutComputed<boolean>;
		private readonly exclusiveOperation: KnockoutObservable<boolean> = ko.observable(false);

		constructor(
			public readonly ajaxUrl: string,
			public readonly saveChangesetNonce: string,
			public readonly trashChangesetNonce: string,
			changesetName: string,
			changesetItemCount: number = 0,
			changesetStatus: string | null = null
		) {
			super();
			const self = this;

			this.currentChangeset = ko.observable(
				new Changeset(changesetName, changesetItemCount, changesetStatus)
			);
			this.changesetName = ko.pureComputed(() => {
				return (self.currentChangeset()?.name()) || '';
			});

			this.adminThemeMetadata = ko.computed({
				read: () => this.underlyingMetadata(),
				write: (newValue) => {
					const oldValue = this.underlyingMetadata.peek();
					if (!_.isEqual(newValue, oldValue)) {
						this.underlyingMetadata(newValue);
						this.metadataHasChanged(true);
					}
				}
			});

			//Automatically save the changeset when any settings change.
			const totalChangeCount = ko.pureComputed(() => {
				const changeset = self.currentChangeset();
				return (changeset ? changeset.currentSessionChanges() : 0);
			});
			const debouncedSaveTrigger = _.debounce(
				() => {
					//Only save if there are changes. This may look like a duplicate check,
					//but it's not: the totalChangeCount() may change between the time
					//the debounced function is called and the time this code is executed.
					//
					//Also save if the metadata has changed, but only if the changeset
					//is not empty. Saving a changeset with only metadata is not useful.
					if (
						(totalChangeCount() > 0)
						|| (this.metadataHasChanged() && this.currentChangeset().isNonEmpty())
					) {
						self.queueChangesetUpdate()
					}
				},
				3000,
				{leading: true, trailing: true}
			)
			totalChangeCount.subscribe((counter) => {
				if (counter > 0) {
					debouncedSaveTrigger();
				}
			});
			//Also save when theme metadata changes.
			this.metadataHasChanged.subscribe((hasChanged) => {
				if (hasChanged) {
					debouncedSaveTrigger();
				}
			});

			this.isExclusiveOperationInProgress = ko.pureComputed(() => {
				return self.exclusiveOperation();
			});

			//Keep track of unsaved changes and changesets.
			this.addChangeListener((setting: Setting) => {
				this.pendingSettings[setting.id] = setting;

				let changeset = this.currentChangeset();
				//If the current changeset cannot be modified, create a new one
				//for the changed setting(s).
				if (!changeset?.canBeModified()) {
					changeset = new Changeset();
					this.currentChangeset(changeset);
				}
				//Track the number of changes in the current session.
				changeset.currentSessionChanges(changeset.currentSessionChanges() + 1);
			});
		}

		queueChangesetUpdate(delay: number = 0) {
			if (delay > 0) {
				if (this.saveTriggerTimeoutId !== null) {
					//Replace the existing timeout with a new one.
					clearTimeout(this.saveTriggerTimeoutId);
				}
				this.saveTriggerTimeoutId = setTimeout(() => {
					this.saveTriggerTimeoutId = null;
					this.queueChangesetUpdate(0);
				}, delay);
				return;
			}

			if (this.saveTriggerTimeoutId !== null) {
				return; //Another timeout is already waiting.
			}

			if (this.currentChangesetRequest !== null) {
				//There's an in-progress request, so wait until it's done.
				this.currentChangesetRequest.always(() => {
					//Wait a bit to avoid hammering the server.
					this.queueChangesetUpdate(1000);
				});
				return;
			}

			this.saveChangeset();
		}

		private saveChangeset(status: string | null = null): JQueryPromise<any> {
			//Do nothing if there are no changes.
			if (_.isEmpty(this.pendingSettings) && (status === null) && !this.metadataHasChanged()) {
				return $.Deferred().reject(new Error('There are no changes to save.')).promise();
			}

			if (this.isExclusiveOperationInProgress()) {
				return $.Deferred().reject(
					new Error('Another exclusive changeset operation is in progress.')
				).promise();
			}

			let isExclusiveRequest = (status === 'publish') || (status === 'trash');
			if (isExclusiveRequest) {
				this.exclusiveOperation(true);
			}

			const savedChangeset = this.currentChangeset();

			//Keep a local copy of the settings in case something changes instance
			//properties while the request is in progress (should never happen).
			const settingsToSend = this.pendingSettings;
			this.sentSettings = settingsToSend;
			this.pendingSettings = {};

			const modifiedSettings = _.mapValues(settingsToSend, setting => setting.value());
			const requestData: Record<string, any> = {
				action: 'ws_ame_ac_save_changeset',
				_ajax_nonce: this.saveChangesetNonce,
				changeset: (savedChangeset?.name()) ?? '',
				modified: JSON.stringify(modifiedSettings),
			};
			if (status !== null) {
				requestData['status'] = status;
			}
			//If the changeset doesn't have a name, it is new.
			if (!savedChangeset?.hasName()) {
				requestData['createNew'] = 1;
			}

			//Also send the metadata if it has changed.
			const metadataWasChanged = this.metadataHasChanged();
			if (metadataWasChanged) {
				const metadata = this.adminThemeMetadata();
				requestData['adminThemeMetadata'] = JSON.stringify(metadata);
			}
			this.metadataHasChanged(false);

			const request = $.ajax({
				url: this.ajaxUrl,
				method: 'POST',
				data: requestData,
				dataType: 'json',
				timeout: 20000,
			});
			this.currentChangesetRequest = request;

			interface ServerValidationResults {
				[settingId: string]: {
					isValid: boolean;
					errors: Array<{ code: string; message: string; }>;
				}
			}

			const self = this;

			function storeValidationResultsFrom(serverResponse: any) {
				const results: ServerValidationResults = _.get(
					serverResponse,
					['data', 'validationResults']
				);
				if (typeof results !== 'object') {
					return;
				}

				for (const settingId in results) {
					const setting = self.get(settingId);
					if (!setting.isDefined()) {
						continue;
					}

					if (!modifiedSettings.hasOwnProperty(settingId)) {
						continue;
					}
					const sentValue = modifiedSettings[settingId];

					const state = results[settingId];
					if (state.isValid) {
						setting.get().clearValidationErrorsForValue(sentValue);
					} else {
						//Since the server response is not fully validated, some typeof checks
						//are still useful.
						// noinspection SuspiciousTypeOfGuard
						setting.get().addValidationErrorsForValue(
							sentValue,
							_.filter(state.errors, error => (typeof error.message === 'string'))
						);
					}
				}
			}

			function storeChangesetDetailsFrom(serverResponse: any) {
				if (!savedChangeset) {
					return;
				}

				//Store the returned changeset name in case a new changeset was created
				//or an existing changeset was forked due to permissions.
				const newName = _.get(serverResponse, ['data', 'changeset']);
				if (!savedChangeset.hasName() || (newName !== savedChangeset.name())) {
					if (typeof newName === 'string') {
						savedChangeset.name(newName);
					}
				}
				//Store the changeset status.
				const newStatus = _.get(serverResponse, ['data', 'changesetStatus']);
				if (typeof newStatus === 'string') {
					savedChangeset.status(newStatus);
				}

				//Store the number of changes in the changeset.
				const newChangeCount = _.get(serverResponse, ['data', 'changesetItemCount']);
				if (typeof newChangeCount === 'number') {
					savedChangeset.knownItemCount(newChangeCount);
				}

				//Was the changeset published? Because changesets are typically moved
				//to trash after publishing, "status" might be "trash" instead of "publish",
				//but we still want to know if it was successfully published.
				const wasPublished = _.get(serverResponse, ['data', 'changesetWasPublished'], null);
				if (wasPublished) {
					savedChangeset.wasPublished(wasPublished);
				}
			}

			request.done(function (response) {
				storeChangesetDetailsFrom(response);
				storeValidationResultsFrom(response);

				//After successfully publishing a changeset, it has no more
				//unsaved changes.
				const isPublished =
					(savedChangeset.status() === 'publish')
					|| (savedChangeset.status() === 'future')
					|| (savedChangeset.wasPublished());
				if (isPublished) {
					savedChangeset.currentSessionChanges(0);
				}

				//After a changeset is published or trashed, it can no longer
				//be edited. We may be able to replace it with a new changeset
				//that was created on the server.
				if (!self.currentChangeset().canBeModified()) {
					const nextChangeset = _.get(response, ['data', 'nextChangeset']);
					if ((typeof nextChangeset === 'string') && (nextChangeset !== '')) {
						self.currentChangeset(new Changeset(nextChangeset));
					}
				}
			});

			request.fail((requestObject: JQueryXHR) => {
				if (typeof requestObject.responseJSON === 'object') {
					storeValidationResultsFrom(requestObject.responseJSON);
					storeChangesetDetailsFrom(requestObject.responseJSON);
				}

				//Add the unsaved settings back to the pending list.
				for (const id in settingsToSend) {
					//Keep only settings that still exist.
					if (this.get(id).isDefined()) {
						this.pendingSettings[id] = settingsToSend[id];
					}
				}

				//We don't automatically retry because the problem might be something
				//that doesn't get better on its own, like missing permissions.
			});

			request.always(() => {
				this.currentChangesetRequest = null;
				this.sentSettings = {};
				if (isExclusiveRequest) {
					this.exclusiveOperation(false);
				}
			});

			return request;
		}

		public savePendingSettings(timeout: number = 20): JQueryPromise<any> {
			if (this.isExclusiveOperationInProgress()) {
				//Wait for the exclusive operation to finish.
				const deferred = $.Deferred();
				const result = deferred.then(() => this.doSavePendingSettings());

				const startTime = Date.now();
				const timer = setInterval(() => {
					if (!this.isExclusiveOperationInProgress()) {
						clearInterval(timer);
						deferred.resolve();
					} else if ((Date.now() - startTime) > timeout) {
						clearInterval(timer);
						deferred.reject(new Error('Exclusive operation timed out.'));
					}
				}, 200);

				return result;
			}

			return this.doSavePendingSettings();
		}

		private doSavePendingSettings(): JQueryPromise<any> {
			//If there are no changes, we don't need to do anything.
			if (_.isEmpty(this.pendingSettings)) {
				return $.Deferred().resolve().promise();
			}
			return this.saveChangeset();
		}

		public getCurrentChangeset(): Changeset {
			return this.currentChangeset();
		}

		/**
		 * Get any unsaved setting changes.
		 *
		 * @returns Object An object mapping setting IDs to their modified values.
		 */
		public get unsavedChanges(): Record<string, any> {
			//Include both pending settings and sent settings. Sent settings
			//might not be saved yet.
			let unsavedSettings: Record<string, Setting> = {};
			_.defaults(unsavedSettings, this.pendingSettings, this.sentSettings);

			return _.mapValues(unsavedSettings, setting => setting.value());
		}

		public publishChangeset(): JQueryPromise<any> {
			if (this.isExclusiveOperationInProgress()) {
				return $.Deferred()
					.reject(new Error('Another exclusive changeset operation is already in progress.'))
					.promise();
			}
			return this.saveChangeset('publish');
		}

		public trashChangeset(): JQueryPromise<any> {
			if (this.isExclusiveOperationInProgress()) {
				return $.Deferred()
					.reject(new Error('Another exclusive changeset operation is already in progress.'))
					.promise();
			}

			const changeset = this.currentChangeset();
			if (!changeset.hasName()) {
				//The changeset hasn't been saved yet, so we can just mark it as trashed.
				changeset.status('trash');
				changeset.currentSessionChanges(0);

				//It's a success of sorts.
				return $.Deferred().resolve(true).promise();
			}

			this.exclusiveOperation(true);

			const requestData: Record<string, any> = {
				action: 'ws_ame_ac_trash_changeset',
				_ajax_nonce: this.trashChangesetNonce,
				changeset: changeset.name
			};

			const request = $.ajax({
				url: this.ajaxUrl,
				method: 'POST',
				data: requestData,
				dataType: 'json',
				timeout: 20000,
			});
			this.currentChangesetRequest = request;

			request.done(function () {
				changeset.status('trash');
				changeset.currentSessionChanges(0);
			});

			//Unfortunately, jQuery doesn't seem to allow us to create a custom
			//error object and pass it to other handlers, so code that uses this
			//method will have to parse the error response itself.

			request.always(() => {
				this.currentChangesetRequest = null;
				this.exclusiveOperation(false);
			});

			return request;
		}

		public addInitialThemeMetadata(metadata: AdminThemeMetadata | null) {
			this.underlyingMetadata(metadata);
			this.metadataHasChanged(false);
		}
	}

	class Changeset {
		public readonly name: KnockoutObservable<string>;
		public readonly knownItemCount: KnockoutObservable<number>;
		public readonly status: KnockoutObservable<string>;

		/**
		 * The number of times settings have been changed in this changeset
		 * during the current customizer session.
		 *
		 * Note that this is not the same as the number settings in the changeset:
		 * if the same setting is changed X times, this counter will increase by X,
		 * but the changeset will still only have one entry for that setting.
		 */
		public readonly currentSessionChanges: KnockoutObservable<number> = ko.observable(0);

		/**
		 * Once a changeset has been published or deleted, its contents can't be modified any more.
		 * @private
		 */
		private readonly fixedContentStatuses: Record<string, any> =
			{'publish': true, 'trash': true, 'future': true};

		public readonly wasPublished: KnockoutObservable<boolean> = ko.observable(false);

		constructor(name: string = '', knownItemCount: number = 0, initialStatus: string | null = '') {
			this.name = ko.observable(name);

			this.name.subscribe((newName) => {
				//In theory, the type system should ensure that the name is always a string,
				//but that only works on the TS side. I've previously run into a bug where
				//a null value was sent from the server. Let's add a check here to make it
				//easier to spot bugs like that in the future.
				if ((typeof (newName as unknown) !== 'string')) {
					throw new Error('Changeset name must always be a string, found ' + (typeof newName));
				}
			});

			this.knownItemCount = ko.observable(knownItemCount);
			this.status = ko.observable(initialStatus ?? '');
		}

		public hasName(): boolean {
			const name = this.name();
			return (name !== '');
		}

		public canBeModified(): boolean {
			return !this.fixedContentStatuses.hasOwnProperty(this.status());
		}

		public isNonEmpty(): boolean {
			return (this.currentSessionChanges() > 0) || (this.knownItemCount() > 0)
		}
	}

	const TemporaryChangesetName = 'temporary000'; //Note: Must match the value used in PHP.

	//region Admin theme
	const UrlOrEmpty = z.union([
		z.string().url().max(1000),
		z.literal('')
	]);

	const AdminThemeMetadata = z.object({
		pluginName: z.string().max(100),
		shortDescription: z.string().max(500),

		pluginSlug: z.string().max(64).toLowerCase().default('')
			.refine(
				function (input: string) {
					//Only allow alphanumeric characters, underscores, and dashes.
					//Empty string is allowed.
					return /^[a-z0-9_-]*$/.test(input);
				},
				{message: 'The slug can only contain letters (a-z), numbers, underscores, and dashes.'}
			),
		identifierPrefix: z.string().max(20).optional(),

		pluginVersion: z.string().default('1.0').optional(),
		pluginUrl: UrlOrEmpty.optional(),
		authorName: z.string().max(100).optional(),
		authorUrl: UrlOrEmpty.optional(),
		requiredWpVersion: z.string().max(30).default('4.7').optional(),
		testedWpVersion: z.string().max(30).optional(),
		wasEverConfirmed: z.boolean().default(false).optional(),
	});

	type AdminThemeMetadata = z.infer<typeof AdminThemeMetadata>;

	const AdminThemeSettings = z.record(
		//Key type
		z.string().min(1),
		//Value type
		z.any()
	);

	class AdminThemeImportReport {
		public totalSettings: number = 0;
		public importedSettings: number = 0;
		public invalidSettings: number = 0;
		public skippedSettings: number = 0;
		public differentImportedSettings: number = 0;

		public readonly pluginName: string;

		constructor(
			public readonly fileName: string,
			public readonly metadata: AdminThemeMetadata
		) {
			this.pluginName = metadata.pluginName || '(Unnamed)';
		}
	}

	interface WithZodValidationResults extends ObservableValidationFields {
		ameZodValidationError: KnockoutObservable<z.ZodError | null>;
	}

	type ZodValidatedObservable<T> = KnockoutComputed<T> & WithZodValidationResults;

	function observableWithZodValidation<T, S extends z.Schema<T>>(
		value: z.output<S>,
		schema: S
	): ZodValidatedObservable<z.output<S>> {
		const underlyingObservable = ko.observable(value);

		const observable: ZodValidatedObservable<T> = ko.pureComputed({
			read: underlyingObservable,
			write: (newValue: T) => {
				const validationResult = schema.safeParse(newValue);
				if (validationResult.success) {
					underlyingObservable(validationResult.data);
					observable.ameZodValidationError(null);
					observable.ameValidationErrors([]);
				} else {
					observable.ameZodValidationError(validationResult.error);
					//Convert Zod issues to ObservableValidationErrors.
					observable.ameValidationErrors(validationResult.error.issues.map(issue => {
						return {
							code: issue.code,
							message: issue.message
						} satisfies ObservableValidationError;
					}));
				}
			}
		}) as ZodValidatedObservable<T>;

		observable.ameZodValidationError = ko.observable(null);
		observable.ameValidationErrors = ko.observable([] as ObservableValidationError[]);
		observable.ameIsValid = ko.pureComputed(() => {
			const errors = observable.ameValidationErrors();
			return !errors || errors.length === 0;
		});

		return observable;
	}

	class ObservableThemeMetadata {
		public readonly pluginName: ZodValidatedObservable<string>;
		public readonly shortDescription: ZodValidatedObservable<string>;
		public readonly pluginSlug: ZodValidatedObservable<AdminThemeMetadata['pluginSlug']>;
		public readonly identifierPrefix: ZodValidatedObservable<AdminThemeMetadata['identifierPrefix']>;
		public readonly pluginVersion: ZodValidatedObservable<AdminThemeMetadata['pluginVersion']>;
		public readonly pluginUrl: ZodValidatedObservable<AdminThemeMetadata['pluginUrl']>;
		public readonly authorName: ZodValidatedObservable<AdminThemeMetadata['authorName']>;
		public readonly authorUrl: ZodValidatedObservable<AdminThemeMetadata['authorUrl']>;
		public readonly requiredWpVersion: ZodValidatedObservable<AdminThemeMetadata['requiredWpVersion']>;
		public readonly testedWpVersion: ZodValidatedObservable<AdminThemeMetadata['testedWpVersion']>;
		public readonly wasEverConfirmed: ZodValidatedObservable<AdminThemeMetadata['wasEverConfirmed']>;

		constructor(metadata: AdminThemeMetadata) {
			this.pluginName = observableWithZodValidation(
				metadata.pluginName,
				AdminThemeMetadata.shape.pluginName
			);
			this.shortDescription = observableWithZodValidation(
				metadata.shortDescription,
				AdminThemeMetadata.shape.shortDescription
			);

			this.pluginSlug = observableWithZodValidation(
				metadata.pluginSlug ?? '',
				AdminThemeMetadata.shape.pluginSlug
			);
			this.identifierPrefix = observableWithZodValidation(
				metadata.identifierPrefix ?? '',
				AdminThemeMetadata.shape.identifierPrefix
			);

			this.pluginVersion = observableWithZodValidation(
				metadata.pluginVersion ?? '',
				AdminThemeMetadata.shape.pluginVersion
			);
			this.pluginUrl = observableWithZodValidation(
				metadata.pluginUrl ?? '',
				AdminThemeMetadata.shape.pluginUrl
			);
			this.authorName = observableWithZodValidation(
				metadata.authorName ?? '',
				AdminThemeMetadata.shape.authorName
			);
			this.authorUrl = observableWithZodValidation(
				metadata.authorUrl ?? '',
				AdminThemeMetadata.shape.authorUrl
			);
			this.requiredWpVersion = observableWithZodValidation(
				metadata.requiredWpVersion ?? '',
				AdminThemeMetadata.shape.requiredWpVersion
			);
			this.testedWpVersion = observableWithZodValidation(
				metadata.testedWpVersion ?? '',
				AdminThemeMetadata.shape.testedWpVersion
			);

			this.wasEverConfirmed = observableWithZodValidation(
				metadata.wasEverConfirmed ?? false,
				AdminThemeMetadata.shape.wasEverConfirmed
			);
		}

		public toObject(): AdminThemeMetadata {
			return {
				pluginName: this.pluginName(),
				shortDescription: this.shortDescription(),
				pluginSlug: this.pluginSlug(),
				identifierPrefix: this.identifierPrefix(),
				pluginVersion: this.pluginVersion(),
				pluginUrl: this.pluginUrl(),
				authorName: this.authorName(),
				authorUrl: this.authorUrl(),
				requiredWpVersion: this.requiredWpVersion(),
				testedWpVersion: this.testedWpVersion(),
				wasEverConfirmed: this.wasEverConfirmed()
			};
		}

		isValid(): boolean {
			//This seems really inelegant, but I can't think of a better way to do it.
			return this.pluginName.ameIsValid()
				&& this.shortDescription.ameIsValid()
				&& this.pluginSlug.ameIsValid()
				&& this.identifierPrefix.ameIsValid()
				&& this.pluginVersion.ameIsValid()
				&& this.pluginUrl.ameIsValid()
				&& this.authorName.ameIsValid()
				&& this.authorUrl.ameIsValid()
				&& this.requiredWpVersion.ameIsValid()
				&& this.testedWpVersion.ameIsValid()
				&& this.wasEverConfirmed.ameIsValid();
		}
	}

	enum MetadataDialogMode {
		Download,
		Edit
	}

	class DownloadThemeDialog extends AmeBaseKnockoutDialog {
		public readonly meta: KnockoutObservable<ObservableThemeMetadata>;
		public readonly areFieldsEditable: KnockoutComputed<boolean>;
		public readonly isOperationInProgress: KnockoutObservable<boolean> = ko.observable(false);

		public readonly mode: KnockoutObservable<MetadataDialogMode> = ko.observable<MetadataDialogMode>(MetadataDialogMode.Download);

		autoCancelButton: boolean = true;
		isConfirmButtonEnabled: KnockoutObservable<boolean>;
		readonly confirmButtonLabel: KnockoutObservable<string | null>;

		advancedOptionsVisible: KnockoutObservable<boolean> = ko.observable(false);
		advancedOptionsToggleLabel: KnockoutComputed<string>;

		helpVisible: KnockoutObservable<boolean> = ko.observable(false);
		helpToggleLabel: KnockoutComputed<string>;
		helpContainerVisible: KnockoutComputed<boolean>;

		changesetName: KnockoutObservable<string> = ko.observable('');
		metadataJson: KnockoutObservable<string> = ko.observable('');
		downloadCookieName: KnockoutObservable<string> = ko.observable('');

		public readonly adminThemeTexts: Required<AdminThemeTexts>;

		private cleanupCurrentDownload: () => void = () => {
		};

		constructor(
			private readonly getChangesetName: () => string,
			private readonly savePendingChangesetData: () => JQueryPromise<any>,
			private readonly metadataObservable: KnockoutObservable<AdminThemeMetadata | null>,
			customAdminThemeTexts: AdminThemeTexts
		) {
			super();
			this.options.minWidth = 400;

			this.adminThemeTexts = {
				...{
					generatorCreditPhrase: 'generated using the Admin Menu Editor Pro plugin.',
					standalonePluginNote: 'The result is a standalone plugin that you can use without Admin Menu Editor Pro.',
				},
				...customAdminThemeTexts
			}

			let initialMetadata = metadataObservable();
			if (initialMetadata === null) {
				initialMetadata = this.getSampleMetadata();
			}

			this.meta = ko.observable(new ObservableThemeMetadata(initialMetadata));

			this.confirmButtonLabel = ko.computed(() => {
				if (this.mode() === MetadataDialogMode.Download) {
					return 'Download Admin Theme';
				}
				return 'OK';
			});

			this.isConfirmButtonEnabled = ko.computed(() => {
				if (this.isOperationInProgress()) {
					return false;
				}

				if (getChangesetName() === '') {
					//To generate an admin theme, the changeset must have already been saved.
					return false;
				}
				return this.meta().isValid();
			});

			this.areFieldsEditable = ko.computed(() => {
				return !this.isOperationInProgress();
			});

			this.advancedOptionsToggleLabel = ko.pureComputed((): string => {
				return this.advancedOptionsVisible() ? 'Fewer options' : 'More options';
			});
			this.helpToggleLabel = ko.pureComputed((): string => {
				return this.helpVisible() ? 'Hide info' : 'How it works';
			});

			//Hide the help container in download mode.
			this.helpContainerVisible = ko.pureComputed((): boolean => {
				return this.mode() === MetadataDialogMode.Download;
			});

			this.mode.subscribe((newMode: MetadataDialogMode) => {
				if (newMode === MetadataDialogMode.Download) {
					this.title('Generate admin theme');
				} else if (newMode === MetadataDialogMode.Edit) {
					this.title('Edit admin theme properties');
				}
			});
		}

		private getSampleMetadata() {
			return AdminThemeMetadata.parse({
				pluginName: 'Custom Admin Theme',
				shortDescription: 'A custom admin theme ' + this.adminThemeTexts.generatorCreditPhrase,
				pluginVersion: '1.0',
			});
		}

		onOpen(event: JQueryEventObject, ui: any): void {
			let latestMetadata = this.metadataObservable();
			if (latestMetadata === null) {
				latestMetadata = this.getSampleMetadata();
			}
			this.meta(new ObservableThemeMetadata(latestMetadata));
		}

		toggleAdvancedOptions(): void {
			this.advancedOptionsVisible(!this.advancedOptionsVisible());
		}

		toggleHelp(): void {
			this.helpVisible(!this.helpVisible());
		}

		onConfirm(event: JQueryEventObject) {
			if (!this.meta().isValid()) {
				//This should never happen because the confirm button is disabled
				//when the metadata is invalid.
				alert('Error: The admin theme details are not valid.');
				return;
			}

			const metadata = this.meta().toObject();
			metadata.wasEverConfirmed = true;
			this.metadataObservable(metadata);

			if (this.mode() === MetadataDialogMode.Edit) {
				//That's all we need to do in edit mode.
				this.isOpen(false);
				return;
			}

			this.triggerDownloadWithErrorReporting(metadata);
		}

		public triggerDownloadWithErrorReporting(metadata: AdminThemeMetadata) {
			if (this.isOperationInProgress()) {
				alert('Error: Another operation is already in progress.');
				return;
			}

			this.triggerDownload(metadata)
				.fail((error: string) => {
					if (error !== '') {
						alert('Error: ' + error);
					}
				});
		}

		private triggerDownload(metadata: AdminThemeMetadata): JQueryPromise<any> {
			const deferred = $.Deferred();

			//Sanity checks.
			//Download mode still requires a saved changeset.
			const changesetName = this.getChangesetName();
			if (changesetName === '') {
				return deferred.reject('The changeset has not been saved yet (name is empty).').promise();
			}

			this.isOperationInProgress(true);

			const $form = $('#ame-ac-theme-download-request-form');
			const $frame = $('#ame-ac-theme-download-frame');

			//Cancel the operation and re-enable buttons if the request takes too long.
			let isCancelledOrDone: boolean = false;
			const requestTimeoutMs = 30000;
			const requestStartTime = (new Date()).getTime();
			let statusCheckInterval: ReturnType<typeof setTimeout> | null = null;

			const cleanup = this.cleanupCurrentDownload = () => {
				isCancelledOrDone = true;

				$frame.off('load.ameAcDownloadAdminTheme');
				if (timeoutTimer) {
					clearTimeout(timeoutTimer);
				}
				if (statusCheckInterval) {
					clearInterval(statusCheckInterval);
				}
				$frame.attr('src', 'about:blank');

				this.isOperationInProgress(false);

				if (this.cleanupCurrentDownload === cleanup) {
					this.cleanupCurrentDownload = () => {
					};
				}
			}

			const timeoutTimer = setTimeout(() => {
				deferred.reject('The download operation timed out.');
				cleanup();
			}, requestTimeoutMs);

			this.savePendingChangesetData().then(
				() => {
					if (isCancelledOrDone) {
						return;
					}

					this.changesetName(changesetName);
					this.metadataJson(JSON.stringify(metadata));

					//The server will set a cookie with a unique name that can be used
					//to check if the download has been initiated. Note that the user
					//can still cancel the download.
					const cookieName = ('ameAcFileDownload_'
						+ new Date().getTime()
						+ '_'
						+ Math.round(Math.random() * 10000) //No dots allowed in these cookie names.
					);
					this.downloadCookieName(cookieName);

					//Clear the frame to prevent the old response from being read.
					$frame.attr('src', 'about:blank');
					try {
						$frame.contents().find('body').html('');
					} catch (e) {
						//Ignore but log cross-origin errors. These should not happen in practice.
						if (console && console.error) {
							console.error(e);
						}
					}

					statusCheckInterval = setInterval(() => {
						const cookieValue = $.cookie(cookieName);
						if (cookieValue) {
							cleanup();
							$.removeCookie(cookieName);

							//Close the dialog when the download starts.
							this.isOpen(false);
							deferred.resolve();
							return;
						}

						if ((new Date()).getTime() - requestStartTime > requestTimeoutMs) {
							cleanup();
							deferred.reject('The download operation timed out.');
						}
					}, 1000);

					$frame.on('load.ameAcDownloadAdminTheme', () => {
						//Get the response from the frame. It should be JSON displayed as text.
						const responseText = String($frame.contents().text()).trim();
						const response = JSON.parse(responseText);

						cleanup();

						if ((response === null) || (typeof response !== 'object')) {
							deferred.reject('Received an invalid response from the server.');
						} else {
							if (!response.success) {
								let errorMessage;
								if (response.data.message) {
									errorMessage = response.data.message;
								} else {
									errorMessage = 'An unknown error occurred on the server.';
								}
								deferred.reject(errorMessage);
							} else {
								//This should never happen in practice.
								deferred.reject('The server did not start the download correctly.');
							}
						}
					});

					$form.trigger('submit');
				},
				() => {
					if (isCancelledOrDone) {
						if (deferred.state() === 'pending') {
							deferred.reject(''); //No error message; the user probably cancelled the operation.
						}
						return;
					}

					cleanup();
					deferred.reject('Could not save the changeset data before generating an admin theme.');
				}
			);

			return deferred.promise();
		}

		onClose(event: JQueryEventObject, ui: any) {
			this.cleanupCurrentDownload();
		}
	}

	//endregion

	class SectionNavigation {
		private sectionNavStack: KnockoutObservableArray<string> = ko.observableArray([] as string[]);
		private $sectionList: JQuery;

		public readonly breadcrumbs: KnockoutObservable<NavigationBreadcrumb[]>;

		constructor() {
			this.$sectionList = $('#ame-ac-container-collection');

			this.$sectionList.on('click', '.ame-ac-section-link', (event) => {
				event.preventDefault()

				if (event.currentTarget === null) {
					return; //Shouldn't happen in practice, but let's satisfy the type checker.
				}

				const targetId = $(event.currentTarget).data('target-id');
				if (targetId) {
					this.navigateToSection(targetId);
				}
			});

			this.$sectionList.on('click', '.ame-ac-section-back-button', (event) => {
				event.preventDefault()
				this.navigateBack();
			});

			this.breadcrumbs = ko.pureComputed(() => {
				return this.sectionNavStack()
					.map((sectionId) => $('#' + sectionId))
					.filter(($section) => $section.length > 0)
					.map(($section) => {
						return {
							title: $section.find('.ame-ac-section-title .ame-ac-section-own-title')
								.first().text()
						}
					});
			});
		}

		navigateToSection(sectionElementId: string) {
			const $section = $('#' + sectionElementId);
			if ($section.length === 0) {
				return;
			}

			if ($section.hasClass('ame-ac-current-section')) {
				return; //Already on this section.
			}

			//If the requested section is in the navigation stack, navigate back
			//to it instead of putting more sections on the stack.
			const stackIndex = this.sectionNavStack.indexOf(sectionElementId);
			if (stackIndex !== -1) {
				while (this.sectionNavStack().length > stackIndex) {
					this.navigateBack();
				}
				return;
			}

			const $previousSection = this.$sectionList.find('.ame-ac-current-section');
			if ($previousSection.length > 0) {
				this.expectTransition($previousSection, '.ame-ac-section');
				$previousSection
					.removeClass('ame-ac-current-section')
					.addClass('ame-ac-previous-section');
				this.sectionNavStack.push($previousSection.attr('id'));

				$previousSection.trigger('adminMenuEditor:leaveSection');
			}

			this.expectTransition($section, '.ame-ac-section');
			$section.addClass('ame-ac-current-section');

			$section.trigger('adminMenuEditor:enterSection');
		}

		navigateBack() {
			if (this.sectionNavStack().length < 1) {
				return;
			}
			const $newCurrentSection = $('#' + this.sectionNavStack.pop());
			if ($newCurrentSection.length === 0) {
				return;
			}

			const $oldCurrentSection = this.$sectionList.find('.ame-ac-current-section');
			this.expectTransition($oldCurrentSection, '.ame-ac-section');
			$oldCurrentSection.removeClass('ame-ac-current-section ame-ac-previous-section');
			$oldCurrentSection.trigger('adminMenuEditor:leaveSection');

			const $oldPreviousSection = this.$sectionList.find('.ame-ac-previous-section');
			$oldPreviousSection.removeClass('ame-ac-previous-section');

			//Show the new current section.
			this.expectTransition($newCurrentSection, '.ame-ac-section');
			$newCurrentSection.addClass('ame-ac-current-section');
			$newCurrentSection.trigger('adminMenuEditor:enterSection');

			//The next section in the stack becomes the previous section.
			if (this.sectionNavStack().length > 0) {
				this.$sectionList.find('#' + this.sectionNavStack()[this.sectionNavStack().length - 1])
					.addClass('ame-ac-previous-section');
			}
		}

		//Add a special class to sections when they have an active CSS transition.
		//This is used to keep both sections visible while the previous section
		//slides out and the next section slides in.
		expectTransition($element: JQuery, requiredSelector: string) {
			if (prefersReducedMotion) {
				return;
			}

			if ($element.data('ameHasTransitionEvents')) {
				return; //Event handler(s) already added.
			}

			const transitionEvents = 'transitionend transitioncancel';

			$element.addClass('ame-ac-transitioning');

			function transitionEndCallback(event: JQueryEventObject) {
				//Ignore events that bubble from child elements.
				if (!$(event.target).is(requiredSelector)) {
					return;
				}

				$element
					.off(transitionEvents, transitionEndCallback)
					.data('ameHasTransitionEvents', null)
					.removeClass('ame-ac-transitioning');
			}

			$element.data('ameHasTransitionEvents', true);
			$element.on(transitionEvents, transitionEndCallback);
		}
	}

	export interface NavigationBreadcrumb {
		title: string;
	}

	/**
	 * Whether to ask for confirmation when the user tries to exit the customizer.
	 */
	enum ExitPromptMode {
		/**
		 * Ask if there are unsaved changes.
		 */
		UnsavedChanges = 1,

		/**
		 * Ask if the current changeset hasn't been published yet.
		 */
		UnpublishedChanges = 2
	}

	export class AdminCustomizer extends AmeAdminCustomizerBase.AdminCustomizerBase implements CustomizableVmInterface {
		private readonly exitPromptMessage = 'Unsaved changes will be lost if you navigate away from this page.';
		//Admin themes generated by this plugin should be fairly small.
		private readonly maxImportFileSize = 500 * 1024;

		sectionNavigation: SectionNavigation;
		settings: CustomizerSettingsCollection;
		public readonly interfaceStructure: InterfaceStructure;

		private readonly $previewFrame: JQuery;

		/**
		 * Preview frame URL.
		 */
		private currentPreviewUrl: string | null = null;
		/**
		 * The default preview URL that can be used when the current frame URL cannot be detected.
		 */
		private readonly initialPreviewUrl: string;
		private previewConnection: ReturnType<typeof AmeAcCommunicator.connectToChild> | null = null;
		private readonly refreshPreviewNonce: string;

		private readonly $saveButton: JQuery;

		public readonly downloadThemeDialog: DownloadThemeDialog;
		private $extraActionMenu: JQuery | null = null;
		private $extraActionButton: JQuery | null = null;

		private $importFileInput: JQuery | null = null;
		private isImporting: KnockoutObservable<boolean> = ko.observable(false);
		private lastImportReport: KnockoutObservable<AdminThemeImportReport | null> = ko.observable(null);
		private isImportReportVisible: KnockoutObservable<boolean> = ko.observable(true);

		private isDiscardingChanges: KnockoutObservable<boolean> = ko.observable(false);

		public readonly isGeneralOverlayVisible: KnockoutObservable<boolean>;

		private readonly importActionEnabled: KnockoutComputed<boolean>;
		private readonly discardChangesActionEnabled: KnockoutComputed<boolean>;
		private readonly downloadThemeActionEnabled: KnockoutComputed<boolean>;

		private readonly customBasePath: string | null;
		private readonly consoleLoggingEnabled: boolean;
		private readonly exitPromptMode: ExitPromptMode;

		constructor(scriptData: ScriptData) {
			super(scriptData);

			this.settings = new CustomizerSettingsCollection(
				scriptData.ajaxUrl,
				scriptData.saveChangesetNonce,
				scriptData.trashChangesetNonce,
				scriptData.changesetName,
				scriptData.changesetItemCount,
				scriptData.changesetStatus
			);
			_.forOwn(scriptData.settings, (data, id) => {
				if (typeof id === 'string') {
					this.settings.add(unserializeSetting(id, data));
				}
			});
			if (scriptData.changesetThemeMetadata) {
				this.settings.addInitialThemeMetadata(scriptData.changesetThemeMetadata);
			}

			this.customBasePath = scriptData.customBasePath || null;
			this.consoleLoggingEnabled = scriptData.isWpDebugEnabled || false;

			if ((typeof scriptData.exitPromptMode === 'number') && (scriptData.exitPromptMode in ExitPromptMode)) {
				this.exitPromptMode = scriptData.exitPromptMode;
			} else {
				this.exitPromptMode = ExitPromptMode.UnpublishedChanges;
			}

			let sectionIdCounter = 0;

			this.interfaceStructure = unserializeUiElement(
				scriptData.interfaceStructure,
				this.settings.get.bind(this.settings),
				(data: AnySpecificElementData) => {
					switch (data.t) {
						case 'section':
							data.component = 'ame-ac-section';
							//All sections must have unique IDs for navigation to work.
							if (!data.id) {
								data.id = 'autoID-' + (++sectionIdCounter);
							}
							break;
						case 'control-group':
							data.component = 'ame-ac-control-group';
							break;
						case 'control':
							//Tell controls that use number inputs to position the popup
							//slider within the customizer sidebar.
							if (
								(data.component === 'ame-number-input')
								|| (data.component === 'ame-box-dimensions')
							) {
								data.params = data.params || {};
								data.params.popupSliderWithin = '#ame-ac-sidebar-content';
							}
							//Replace regular separators with AC-specific ones.
							if (data.component === 'ame-horizontal-separator') {
								data.component = 'ame-ac-separator';
							}
					}
				}
			);

			//Remove the reload parameter from the URL. It is only used to avoid
			//caching issues, and is not needed otherwise.
			const currentUrl = new URL(window.location.href);
			if (currentUrl.searchParams.get('_ame-ac-reload') !== null) {
				currentUrl.searchParams.delete('_ame-ac-reload');
				window.history.replaceState({}, '', currentUrl.href);
			}

			//Also remove the "request new changeset" parameter.
			if (currentUrl.searchParams.get('_ame-ac-new-changeset') !== null) {
				currentUrl.searchParams.delete('_ame-ac-new-changeset');
				window.history.replaceState({}, '', currentUrl.href);
			}

			const changesetPathTemplate: string | null = scriptData.changesetPathTemplate;
			const changesetPlaceholder = '{changeset}';

			function addChangesetToUrl(currentUrl: string, changesetName: string): URL {
				const url = new URL(currentUrl);
				if (changesetPathTemplate) {
					url.pathname = changesetPathTemplate.replace(changesetPlaceholder, changesetName);
					//With a custom path, the "page" parameter that points to the AC
					//admin page is not necessary and would be confusing.
					url.searchParams.delete('page');
					//When the changeset name is stored in the path, the "ame-ac-changeset"
					//parameter is no longer needed, and could be out of sync with the path.
					url.searchParams.delete('ame-ac-changeset');
				} else {
					url.searchParams.set('ame-ac-changeset', changesetName);
				}
				return url;
			}

			function getChangesetFromUrl(url: string): string {
				const parsedUrl = new URL(url);
				if (changesetPathTemplate) {
					function escapeRegExp(input: string): string {
						return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					}

					const placeholderStart = changesetPathTemplate.indexOf(changesetPlaceholder);
					const placeholderEnd = placeholderStart + changesetPlaceholder.length;

					const changesetPathTemplateRegex = new RegExp(
						'^' + escapeRegExp(changesetPathTemplate.slice(0, placeholderStart))
						+ '([^a-zA-Z0-9]+)'
						+ escapeRegExp(changesetPathTemplate.slice(placeholderEnd))
					);

					const match = parsedUrl.pathname.match(changesetPathTemplateRegex);
					return match ? match[1] : '';
				} else {
					return parsedUrl.searchParams.get('ame-ac-changeset') ?? '';
				}
			}

			//Add the changeset name to the URL (if not already present).
			if (getChangesetFromUrl(window.location.href) !== this.settings.changesetName()) {
				const newUrl = addChangesetToUrl(window.location.href, this.settings.changesetName());
				window.history.replaceState({}, '', newUrl.href);
			}

			//When the changeset name changes, also change the URL.
			this.settings.changesetName.subscribe((changesetName) => {
				const url = addChangesetToUrl(window.location.href, changesetName);
				if (scriptData.changesetPushStateEnabled) {
					window.history.pushState({}, '', url.href);
				} else {
					window.history.replaceState({}, '', url.href);
				}
			});

			this.$saveButton = $('#ame-ac-apply-changes');

			//The save button should be enabled when:
			// - There are non-zero changes in the current changeset.
			// - All settings are valid.
			// - The changeset is not in the process of being published, deleted, etc.
			// - The contents of the changeset can be modified (e.g. not already published).
			const isSaveButtonEnabled = ko.pureComputed(() => {
				const changeset = this.settings.getCurrentChangeset();
				return (
					changeset.isNonEmpty()
					&& changeset.canBeModified()
					&& !this.settings.isExclusiveOperationInProgress()
					&& !this.settings.hasValidationErrors()
				);
			});
			//Update button state when the customizer loads.
			this.$saveButton.prop('disabled', !isSaveButtonEnabled());
			//And also on changes.
			isSaveButtonEnabled.subscribe((isEnabled) => {
				this.$saveButton.prop('disabled', !isEnabled);
				//Change the text back to the default when the button is enabled.
				if (isEnabled) {
					this.$saveButton.val(this.$saveButton.data('default-text') ?? 'Save Changes');
				}
			});

			//Handle the "Save Changes" button.
			this.$saveButton.on('click', () => {
				//Show the spinner.
				const $spinner = $('#ame-ac-primary-actions .spinner');
				$spinner.css('visibility', 'visible').show();

				const publishFailNoticeId = 'ame-ac-publish-failed-notice';
				//Remove the previous error notification, if any.
				$('#' + publishFailNoticeId).remove();

				const promise = this.settings.publishChangeset();

				promise.fail((error) => {
					//Show a dismissible error notification.
					let message = 'An unexpected error occurred while saving changes.';
					if (typeof error === 'string') {
						message = error;
					} else if (error instanceof Error) {
						message = error.message;
					} else if (typeof error.responseJSON === 'object') {
						message = _.get(error.responseJSON, ['data', 'message'], message);
					}

					const $notice = $('<div>')
						.attr('id', publishFailNoticeId)
						.addClass('notice notice-error is-dismissible')
						.text(message);

					//WordPress won't automatically add the dismiss button to a dynamically
					//generated notice like this, so we have to do it.
					$notice.append(
						$('<button type="button" class="notice-dismiss"></button>')
							.append('<span class="screen-reader-text">Dismiss this notice</span>')
							.on('click', (event) => {
								event.preventDefault();
								$notice.remove(); //Not as fancy as WP does it.
							})
					);

					const $container = $('#ame-ac-global-notification-area');
					$container.append($notice);
				})

				promise.done(() => {
					this.$saveButton.val(this.$saveButton.data('published-text') ?? 'Saved');

					//The preview could be stale. For example, the color scheme module
					//switches between "actual" and "preview" color schemes dynamically,
					//but the "actual" scheme could change after applying new settings.
					//Let's reload the preview frame to make sure it's up-to-date.
					this.queuePreviewFrameReload();
				});

				promise.always(() => {
					$spinner.css('visibility', 'hidden');
				});
			});

			//Prevent the user from interacting with settings while the changeset is being modified.
			this.settings.isExclusiveOperationInProgress.subscribe((isInProgress) => {
				$('#ame-ac-sidebar-blocker-overlay').toggle(isInProgress);
			});

			//Show a general overlay with a progress spinner while something is happening.
			this.isGeneralOverlayVisible = ko.pureComputed(() => {
				return this.isImporting() || this.isDiscardingChanges();
			});

			//Initialize the "download admin theme" dialog.
			this.downloadThemeDialog = new DownloadThemeDialog(
				() => this.settings.getCurrentChangeset().name(),
				() => this.settings.savePendingSettings(),
				this.settings.adminThemeMetadata,
				scriptData
			);

			//Toggle available extra actions based on changeset status.
			this.importActionEnabled = ko.pureComputed(() => {
				const changeset = this.settings.getCurrentChangeset();
				return changeset && changeset.canBeModified()
					&& !this.settings.isExclusiveOperationInProgress();
			});
			this.importActionEnabled.subscribe((isEnabled) => {
				if (this.$extraActionMenu) {
					this.$extraActionMenu.find('.ame-ac-import-theme-action')
						.toggleClass('ui-state-disabled', !isEnabled);
				}
			});
			this.discardChangesActionEnabled = ko.pureComputed(() => {
				const changeset = this.settings.getCurrentChangeset();
				return changeset && changeset.isNonEmpty() && changeset.canBeModified()
					&& !this.settings.isExclusiveOperationInProgress()
			});
			this.discardChangesActionEnabled.subscribe((isEnabled) => {
				if (this.$extraActionMenu) {
					this.$extraActionMenu.find('.ame-ac-discard-changes-action')
						.toggleClass('ui-state-disabled', !isEnabled);
				}
			});
			this.downloadThemeActionEnabled = ko.pureComputed(() => {
				return (
					!this.settings.isExclusiveOperationInProgress()
					&& !this.downloadThemeDialog.isOperationInProgress()
					//The changeset must already be saved for the download to work,
					//which means it should have a name.
					&& (this.settings.getCurrentChangeset().name() !== '')
					//The changeset should probably be non-empty.
					&& this.settings.getCurrentChangeset().isNonEmpty()
				);
			});
			this.downloadThemeActionEnabled.subscribe((isEnabled) => {
				if (this.$extraActionMenu) {
					this.$extraActionMenu.find('.ame-ac-download-theme-action')
						.toggleClass('ui-state-disabled', !isEnabled);
				}
			});

			this.sectionNavigation = new SectionNavigation();

			//Set up the preview frame.
			this.$previewFrame = $('iframe#ame-ac-preview');

			this.initialPreviewUrl = scriptData.initialPreviewUrl;
			this.refreshPreviewNonce = scriptData.refreshPreviewNonce;

			this.$previewFrame.on('load', () => {
				this.isFrameLoading = false;

				//The URL that was actually loaded might not match the one that
				//was requested (e.g. because there was a redirect).
				this.currentPreviewUrl = null;

				//Close the previous postMessage connection.
				if (this.previewConnection) {
					this.previewConnection.disconnect();
					this.previewConnection = null;
				}

				const frame = this.$previewFrame.get(0) as HTMLIFrameElement;
				if (!frame || !(frame instanceof HTMLIFrameElement)) {
					return;
				}

				//Try to get the preview URL from the iframe.
				try {
					const url = frame.contentWindow?.location.href;
					if (url) {
						this.currentPreviewUrl = url;
					}
				} catch (e) {
					//We can't get the URL directly, probably because it's a cross-origin iframe.
				}

				this.previewConnection = AmeAcCommunicator.connectToChild(
					frame,
					{
						'setPreviewUrl': (url: string) => {
							if (this.isPreviewableUrl(url)) {
								this.previewUrl = url;
							}
						},
						'notifyPreviewUrlChanged': (url: string) => {
							this.currentPreviewUrl = url;
						}
					},
					this.allowedCommOrigins,
					scriptData.isWpDebugEnabled
				);

				this.previewConnection.promise.then((connection) => {
					if (typeof connection === 'undefined') {
						//This should never happen, but the type checker doesn't know that.
						throw new Error('Unexpected error: Connection apparently succeeded, but the connection object is undefined');
					}

					connection.execute('getCurrentUrl').then((url) => {
						if (url && (typeof url === 'string')) {
							this.currentPreviewUrl = url;
						}
					});

					//Notify other scripts that the preview frame is loaded and
					//the postMessage connection is ready for use.
					$('body').trigger('adminMenuEditor:acPreviewConnectionReady');
				});
			});

			this.previewUrl = this.initialPreviewUrl;

			//Notify other scripts. This lets them register custom controls and so on.
			$('#ame-ac-admin-customizer').trigger('adminMenuEditor:acRegister', [this]);

			const throttledReloadPreview = _.throttle(
				() => {
					this.queuePreviewFrameReload();
				},
				1000, //The reload method does its own throttling, so we use a low wait time here.
				{leading: true, trailing: true}
			);

			//Refresh the preview when any setting changes.
			this.settings.addChangeListener((setting, newValue) => {
				if (
					setting.supportsPostMessage
					&& this.previewConnection
					&& this.previewConnection.isConnected
				) {
					this.previewConnection.execute('previewSetting', setting.id, newValue);
				} else {
					let reason: string = 'Unknown';
					if (!setting.supportsPostMessage) {
						reason = 'Setting "' + setting.id + '" does not support postMessage';
					} else if (!this.previewConnection) {
						reason = 'No preview connection';
					} else if (!this.previewConnection.isConnected) {
						reason = 'Preview connection is not connected';
					}
					this.log('Reloading the preview frame because: ' + reason);

					throttledReloadPreview();
				}
			});

			const registerUnloadPrompt = () => {
				//Ask for confirmation when the user tries to leave the page and the changeset
				//has unpublished/unsaved changes.
				$(window).on('beforeunload.ame-ac-exit-confirm', (event) => {
					if (this.isExitPromptNeeded()) {
						event.preventDefault();
						//Note: The confirmation prompt will only be displayed if the user
						//has interacted with the page (e.g. clicked something).

						//As of this writing, MDN says that some browsers still don't support triggering
						//an "unsaved changes" prompt with event.preventDefault(). You need to set
						//event.returnValue to a string or return a string from the event handler.
						//Modern browsers will ignore the content and display their own generic message.
						return this.exitPromptMessage;
					}
				});
			}

			/*
			 Allegedly, registering a beforeunload handler can cause the browser to
			 disable some optimizations, so let's only do it when the user changes
			 something or the changeset already contains some changes.
			 */
			if (this.settings.getCurrentChangeset().isNonEmpty()) {
				registerUnloadPrompt();
			} else {
				const listenerId = this.settings.addChangeListener(() => {
					//Remove the listener after it has been triggered once.
					this.settings.removeChangeListener(listenerId);
					registerUnloadPrompt();
				});
			}
		}

		getSettingObservable(settingId: string, defaultValue: any): KnockoutObservable<any> {
			//Let's just implement this temporarily while working on refactoring this
			//stuff to use KO components.
			return this.settings
				.get(settingId)
				.map(setting => setting.value)
				.getOrElse(ko.observable(defaultValue));
		}

		getAllSettingValues(): Record<string, any> {
			throw new Error('Method not implemented.');
		}

		get previewUrl(): string | null {
			return this.currentPreviewUrl;
		}

		set previewUrl(url: string | null) {
			if (url === this.currentPreviewUrl) {
				return;
			}
			//The URL starts out as null, but it cannot be set to NULL again after
			//the preview frame has been loaded.
			if (url === null) {
				throw new Error('Cannot directly set preview URL to null');
			}

			if (this.isPreviewableUrl(url)) {
				this.navigatePreviewFrame(url);
			}
		}

		private navigatePreviewFrame(url: string | null = null, forceReload: boolean = false) {
			const oldUrl = this.previewUrl;
			if (url === null) {
				url = oldUrl ?? this.initialPreviewUrl;
			}

			const isSameUrl = (oldUrl === url);
			if (isSameUrl && !forceReload) {
				return;
			}

			//If there are any unsaved changes, let's include them in the preview by simulating
			//a form submission and sending the changes as form data. The server-side component
			//will merge these changes with existing changeset data.
			const unsavedChanges = this.settings.unsavedChanges;
			const simulateFormSubmission = !_.isEmpty(unsavedChanges);

			const parsedUrl = new URL(url);

			//If we're not using form submission, add a special parameter
			//to the URL to force a refresh.
			const refreshParam = '_ame-ac-refresh-trigger';
			if (isSameUrl && !simulateFormSubmission) {
				parsedUrl.searchParams.set(refreshParam, Date.now() + '_' + Math.random());
			} else {
				//Otherwise, remove the parameter just to be safe.
				parsedUrl.searchParams.delete(refreshParam);
			}

			//Ensure that the changeset used in the preview matches the current
			//changeset and preview is enabled. This is just a precaution. Normally,
			//the preview script automatically changes link URLs.
			let changesetName = this.settings.changesetName();
			if (changesetName === '') {
				//Use a special value if the changeset hasn't been saved yet.
				changesetName = TemporaryChangesetName;
			}
			parsedUrl.searchParams.set('ame-ac-changeset', changesetName);
			parsedUrl.searchParams.set('ame-ac-preview', '1');

			this.hasPendingPreviewReload = false; //Reloading now, so no longer pending.
			this.isFrameLoading = true;

			//console.info('navigatePreviewFrame: Navigating to ' + parsedUrl.href);
			if (simulateFormSubmission) {
				const formData = {
					action: 'ws_ame_ac_refresh_preview_frame',
					"ame-ac-changeset": changesetName,
					modified: JSON.stringify(unsavedChanges),
					nonce: this.refreshPreviewNonce
				}

				const $form = $('<form>')
					.attr('method', 'post')
					.attr('action', parsedUrl.href)
					.attr('target', 'ame-ac-preview-frame')
					.appendTo('body');

				let key: keyof typeof formData;
				for (key in formData) {
					const value = formData[key];
					$('<input>')
						.attr('type', 'hidden')
						.attr('name', key)
						.val(value)
						.appendTo($form);
				}

				this.currentPreviewUrl = parsedUrl.href;
				$form.trigger('submit');
				$form.remove();
			} else {
				this.currentPreviewUrl = parsedUrl.href;
				this.$previewFrame.attr('src', this.currentPreviewUrl);
			}
		}

		private _isFrameLoading: boolean = false;
		private frameLoadingTimeoutId: number | null = null;
		private lastPreviewLoadTimestamp: Date = new Date(0);

		private reloadWaitTimeoutId: number | null = null;
		private hasPendingPreviewReload: boolean = false;

		private set isFrameLoading(isLoading: boolean) {
			const wasLoadingBefore = this._isFrameLoading;
			if (!isLoading && (isLoading === wasLoadingBefore)) {
				return;
			}
			//In some circumstances, we may start to load a new URL before
			//the previous one has finished loading. This is valid and should
			//reset the load timeout.

			$('#ame-ac-preview-refresh-indicator').toggleClass('ame-ac-show-indicator', isLoading);
			if (this.frameLoadingTimeoutId) {
				clearTimeout(this.frameLoadingTimeoutId);
				this.frameLoadingTimeoutId = null;
			}

			if (isLoading) {
				//As a precaution, we'll assume that if the frame doesn't load in a reasonable
				//time, it will never finish loading.
				this.frameLoadingTimeoutId = window.setTimeout(() => {
					if (this.isFrameLoading) {
						this.isFrameLoading = false;
					}
				}, 20000);
			}
			this._isFrameLoading = isLoading;

			if (wasLoadingBefore && !isLoading) {
				this.lastPreviewLoadTimestamp = new Date();
			}

			//Once the frame is loaded, trigger any pending reload.
			if (!isLoading && this.hasPendingPreviewReload) {
				this.hasPendingPreviewReload = false;
				this.queuePreviewFrameReload();
			}
		}

		public get isFrameLoading(): boolean {
			return this._isFrameLoading;
		}

		private queuePreviewFrameReload() {
			if (this.reloadWaitTimeoutId) {
				return; //The frame will reload soon.
			}

			if (this.isFrameLoading) {
				this.hasPendingPreviewReload = true;
				return;
			}

			//To avoid stressing the server, wait at least X ms after the last
			//load completes before reloading the frame.
			const reloadWaitTime = 2000;
			const now = new Date();
			const timeSinceLastLoad = now.getTime() - this.lastPreviewLoadTimestamp.getTime();
			if (timeSinceLastLoad < reloadWaitTime) {
				this.reloadWaitTimeoutId = window.setTimeout(() => {
					this.reloadWaitTimeoutId = null;
					this.queuePreviewFrameReload();
				}, reloadWaitTime - timeSinceLastLoad);
				return;
			}

			//Actually reload the frame.
			this.navigatePreviewFrame(null, true);
		}

		onBindingsApplied(rootElement: HTMLElement) {
			//Navigate to the root section. In the current implementation this can't happen
			//until bindings have been applied, so it's not part of the constructor.
			this.navigateToRootSection();

			//Initialize the action menu.
			this.$extraActionButton = jQuery('#ame-ac-extra-actions-trigger', rootElement);
			this.$extraActionMenu = jQuery('#ame-ac-extra-actions-menu', rootElement).menu();

			//Update menu states.
			this.importActionEnabled.notifySubscribers(this.importActionEnabled());
			this.discardChangesActionEnabled.notifySubscribers(this.discardChangesActionEnabled());
			this.downloadThemeActionEnabled.notifySubscribers(this.downloadThemeActionEnabled());

			//Get the file picker.
			this.$importFileInput = jQuery('#ame-ac-import-admin-theme-file', rootElement);
		}

		navigateToRootSection() {
			this.sectionNavigation.navigateToSection('ame-ac-section-structure-root');
		}

		// noinspection JSUnusedGlobalSymbols -- Used in at least one add-on.
		/**
		 * Execute an RPC method in the preview frame.
		 *
		 * @param {string} methodName
		 * @param {*} args
		 */
		executeRpcMethod(methodName: string, ...args: any): JQueryPromise<any> {
			if (!this.previewConnection || !this.previewConnection.isConnected) {
				return $.Deferred().reject('The preview frame is not connected.').promise();
			}
			return this.previewConnection.execute(methodName, ...args);
		}

		confirmExit() {
			if (this.isExitPromptNeeded()) {
				if (window.confirm(this.exitPromptMessage)) {
					//Remove the confirmation prompt that appears when leaving the page.
					//We don't want to show two prompts.
					$(window).off('beforeunload.ame-ac-exit-confirm');
					return true;
				}
				return false;
			}
			return true;
		}

		private isExitPromptNeeded(): boolean {
			const changeset = this.settings.getCurrentChangeset();

			//No need to save anything if the changeset is empty.
			if (!changeset.isNonEmpty()) {
				return false;
			}

			switch (this.exitPromptMode) {
				case ExitPromptMode.UnpublishedChanges:
					return (
						!changeset.wasPublished()
						&& (changeset.status() !== 'trash') //Can't publish a trashed changeset.
					);
				case ExitPromptMode.UnsavedChanges:
					const unsavedChanges = this.settings.unsavedChanges;
					return !_.isEmpty(unsavedChanges);
				default:
					return false;
			}

		}

		// noinspection JSUnusedGlobalSymbols -- Used in the Knockout template.
		toggleExtraActionMenu() {
			if (!this.$extraActionMenu) {
				return;
			}
			this.$extraActionMenu.toggle();

			if (this.$extraActionMenu.is(':visible')) {
				//Position the menu below the button.
				const $button = $('#ame-ac-extra-actions-trigger');
				this.$extraActionMenu.position({
					my: 'right top',
					at: 'right bottom',
					of: $button,
					collision: 'flipfit'
				});

				//Hide the menu when the user clicks outside the menu or the button.
				$(document).on('mousedown.ameAcExtraMenuHide', this.handleClickOutsideActionMenu.bind(this));
			} else {
				//Remove the click listener if it's still active.
				$(document).off('mousedown.ameAcExtraMenuHide');
			}
		}

		handleClickOutsideActionMenu(event: JQueryEventObject) {
			if (
				!this.$extraActionMenu
				|| !this.$extraActionMenu.is(':visible')
				|| !this.$extraActionButton
			) {
				//The event listener should not be active if the menu is not visible.
				$(document).off('mousedown.ameAcExtraMenuHide');
				return;
			}

			const menuElement = this.$extraActionMenu.get(0);
			const buttonElement = this.$extraActionButton.get(0);
			const isClickOutsideMenu = !menuElement.contains(event.target);
			const isClickOutsideButton = !buttonElement.contains(event.target);

			if (isClickOutsideMenu && isClickOutsideButton) {
				this.hideExtraActionMenu();
			}
		}

		private hideExtraActionMenu() {
			if (!this.$extraActionMenu) {
				return;
			}

			this.$extraActionMenu.hide();
			//Stop listening for clicks outside the menu.
			$(document).off('mousedown.ameAcExtraMenuHide');
		}

		private openMetadataDialog(mode: MetadataDialogMode) {
			this.downloadThemeDialog.mode(mode);
			this.downloadThemeDialog.isOpen(true);
			this.isImportReportVisible(false);
			this.hideExtraActionMenu();
		}

		actionOpenDownloadDialog() {
			if (!this.downloadThemeActionEnabled()) {
				alert('Currently disabled because there are no changes to download.');
				return;
			}
			this.openMetadataDialog(MetadataDialogMode.Download);
		}

		// noinspection JSUnusedGlobalSymbols -- Used in another plugin.
		actionEditOrDownloadTheme() {
			if (!this.downloadThemeActionEnabled()) {
				return;
			}

			//If the user hasn't confirmed the theme metadata yet, show the dialog.
			const metadata = this.settings.adminThemeMetadata();
			if ((metadata === null) || !metadata.wasEverConfirmed) {
				this.openMetadataDialog(MetadataDialogMode.Download);
			} else {
				this.downloadThemeDialog.triggerDownloadWithErrorReporting(metadata);
			}
		}

		// noinspection JSUnusedGlobalSymbols -- Used in another plugin.
		actionOpenMetadataDialog() {
			this.openMetadataDialog(MetadataDialogMode.Edit);
		}

		actionOpenImportDialog() {
			if (!this.importActionEnabled()) {
				//Can't import if there is no changeset or the changeset can't be edited.
				//The menu item should be disabled in this case, but we'll check anyway.
				return false;
			}
			this.hideExtraActionMenu();

			//Allow the default action to proceed, which will open the file picker.
			return true;
		}

		actionDiscardChanges() {
			if (!this.discardChangesActionEnabled()) {
				return;
			}
			this.hideExtraActionMenu();

			if (this.settings.isExclusiveOperationInProgress()) {
				alert('Another operation is in progress. Please wait for it to complete before discarding changes.');
				return;
			}

			if (!confirm('Are you sure you want to discard your unsaved changes?')) {
				return;
			}

			this.isImportReportVisible(false);
			this.isDiscardingChanges(true);

			this.settings.trashChangeset()
				.then(() => {
					//Reload the customizer with a new changeset.
					const url = new URL(window.location.href);
					if (this.customBasePath) {
						url.pathname = this.customBasePath;
						url.search = '';
					} else {
						//To get the customizer's base URL, get the current URL
						//and remove all query parameters except "page".
						const page = url.searchParams.get('page');
						url.search = '';
						url.searchParams.set('page', page || 'ame-admin-customizer');
					}
					//Notify the customizer that we definitely want a new changeset;
					//don't try to load a draft.
					url.searchParams.set('_ame-ac-new-changeset', '1');

					//Don't need the hash.
					url.hash = '';

					//Add a random parameter to force a reload.
					url.searchParams.set('_ame-ac-reload', Math.random().toString(36).substring(7));

					//Navigate to the new URL.
					window.location.href = url.toString();

					//Note that the isDiscardingChanges flag is not reset here,
					//so the progress overlay will stay visible until the page reloads.
				})
				.fail((requestObject) => {
					let message: string = requestObject.statusText || 'Unknown error.';

					if (typeof requestObject.responseJSON === 'object') {
						const customMessage = _.get(requestObject.responseJSON, ['data', 'message']);
						if (typeof customMessage === 'string') {
							message = customMessage;
						}
					}

					alert('Error: ' + message);
					this.isDiscardingChanges(false);
				});
		}

		handleImportFileSelection() {
			if (!this.$importFileInput) {
				return;
			}
			const fileInput = this.$importFileInput.get(0) as HTMLInputElement;
			if (!fileInput || !fileInput.files || (fileInput.files.length < 1)) {
				return;
			}

			//Get the first file. Normally, there should only be one.
			const selectedFile = fileInput.files.item(0);
			if (!selectedFile) {
				return;
			}

			//Limit the file size.
			if (selectedFile.size > this.maxImportFileSize) {
				alert(
					'Error: The selected file is too large. The maximum file size is '
					+ Math.round(this.maxImportFileSize / 1024) + ' KiB'
				);
				//Clear the file input.
				this.$importFileInput.val('');
				return;
			}

			this.isImporting(true);
			this.lastImportReport(null);

			JSZip.loadAsync(selectedFile).then(
				(zip) => {
					const metadataFileRegex = /^([\\/]?[a-zA-Z0-9_-]+[\\/])metadata\.json$/;
					const foundMetadataFiles = zip.file(metadataFileRegex);
					if (!foundMetadataFiles || (foundMetadataFiles.length < 1)) {
						throw new Error('The selected file is not an admin theme generated by this tool.');
					}
					const metadataFile = foundMetadataFiles[0];

					//Get the directory name and separator from the metadata file path.
					//The prefix will usually be something like "admin-theme-slug/".
					const matches = metadataFileRegex.exec(metadataFile.name);
					let directoryPrefix: string;
					if (!matches || (matches.length < 2)) {
						throw new Error('The directory structure of this ZIP file is not recognized.');
					} else {
						directoryPrefix = matches[1];
					}

					const settingsFile = zip.file(directoryPrefix + 'settings.json');
					if (!settingsFile) {
						throw new Error('The selected ZIP file is missing a settings.json file.');
					}

					//Read both files.
					return Promise.all([
						metadataFile.async('string'),
						settingsFile.async('string')
					]);
				},
				(error) => {
					const errorMessage = error.message || error;
					throw new Error('Error reading "' + selectedFile.name + '": ' + errorMessage);
				}
			).then((fileContents) => {
				if (!fileContents) {
					throw new Error('Failed to read settings and metadata from the ZIP file.');
				}

				const metadata = this.parseImportedAdminThemeFile(
					fileContents[0],
					'metadata.json',
					AdminThemeMetadata
				);
				const settings = this.parseImportedAdminThemeFile(
					fileContents[1],
					'settings.json',
					AdminThemeSettings
				);
				const report = new AdminThemeImportReport(selectedFile.name, metadata);

				//Import metadata.
				this.downloadThemeDialog.meta(new ObservableThemeMetadata(metadata));

				//Import settings.
				for (const [settingId, value] of Object.entries(settings)) {
					report.totalSettings++;

					const foundSetting = this.settings.get(settingId);
					foundSetting.forEach((setting) => {
						const oldValue = setting.value();
						const errors = setting.tryUpdate(value);
						if (errors && errors.length) {
							report.invalidSettings++;
						} else {
							report.importedSettings++;
							if (oldValue != value) {
								report.differentImportedSettings++;
							}
						}
					});

					if (foundSetting.isEmpty()) {
						report.skippedSettings++;
					}
				}

				this.lastImportReport(report);
				this.isImportReportVisible(true);

			}).catch((error) => {
				//Error handling: Show the error message to the user.
				let errorMessage: string;
				if (error instanceof Error) {
					errorMessage = error.message;
				} else {
					errorMessage = String(error);
				}
				alert('Error: ' + errorMessage);
			}).finally(() => {
				this.isImporting(false);
				this.$importFileInput?.val('');
			});
		}

		private parseImportedAdminThemeFile<T extends ZodType>(
			content: string,
			name: string,
			schema: T
		): ReturnType<T['parse']> {
			try {
				const parsedJson = JSON.parse(content);
				return schema.parse(parsedJson);
			} catch (error) {
				let errorMessage: string;
				if (error instanceof ZodError) {
					//Convert issues to a newline-separated string.
					errorMessage = error.issues.map((issue) => {
						return issue.path.join('.') + ': ' + issue.message;
					}).join('\n');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				} else {
					errorMessage = String(error);
				}
				//Add the file name to the error message.
				throw new Error('Error parsing ' + name + ':\n' + errorMessage);
			}
		}

		dismissImportReport(): void {
			this.isImportReportVisible(false);
		}

		log(message: any): void {
			if (this.consoleLoggingEnabled && console && console.log) {
				console.log(message);
			}
		}
	}
}

declare global {
	interface Window {
		wsAdminCustomizer: AmeAdminCustomizer.AdminCustomizer;
	}
}

jQuery(function () {
	//Give other scripts a chance to load before we start.
	//Some of them also use jQuery to run when the DOM is ready.
	setTimeout(() => {
		window.wsAdminCustomizer = new AmeAdminCustomizer.AdminCustomizer(wsAmeAdminCustomizerData);
		const rootElement = document.getElementById('ame-ac-admin-customizer');
		if (rootElement === null) {
			throw new Error('The root element for the admin customizer was not found.');
		}

		ko.applyBindings(window.wsAdminCustomizer, rootElement);

		//Notify the customizer that bindings have been applied. It needs to do some
		//additional setup that can't be done until the DOM structure is ready.
		setTimeout(() => {
			window.wsAdminCustomizer.onBindingsApplied(rootElement);
		}, 5); //Components are rendered asynchronously.
	}, 20);
});