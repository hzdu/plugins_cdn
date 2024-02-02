/// <reference path="../../../js/knockout.d.ts" />
/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/jqueryui.d.ts" />
/// <reference path="../../../js/jquery.form.d.ts" />
/// <reference types="@types/lodash" />
/// <reference path="./dashboard-widget.ts" />
/// <reference path="../../../modules/actor-selector/actor-selector.ts" />

declare var wsWidgetEditorData: any;
let ameWidgetEditor: AmeDashboardWidgetEditor;

interface WidgetEditorSettings {
	format: {
		name: string,
		version: string
	};
	widgets: Array<WidgetPropertyMap>;
	welcomePanel: {
		grantAccess: AmeDictionary<boolean>
	};

	defaultOrderOverrideEnabled: boolean;
	orderOverridePerActor: AmeDictionary<boolean>;

	forcedColumnCount: number | null;
	forcedColumnStrategy: number | null;
	forcedColumnsEnabledPerActor: AmeDictionary<boolean>;

	siteComponentHash: string;
	lastModified: number;
}
class AmeDashboardWidgetEditor {
	private static _ = wsAmeLodash;
	private static autoCleanupEnabled: boolean = true;

	private welcomePanel: AmeWelcomeWidget | null = null;

	actorSelector: AmeActorSelector;
	selectedActor: KnockoutComputed<string | null>;

	private readonly maxDashboardColumns: number = 4;
	public readonly widgetColumns: Array<KnockoutObservableArray<AmeDashboardWidget>>;
	public readonly desiredPreviewColumnCount: KnockoutObservable<number>;
	public readonly previewColumnOptions: Array<number>;

	public readonly columnLayout: KnockoutComputed<Array<Array<number>>>;

	public widgetData: KnockoutObservable<string>;
	public widgetDataLength: KnockoutObservable<number>;

	public isExportButtonEnabled: KnockoutObservable<boolean>;

	private initialWidgetSettings: WidgetEditorSettings | null = null;
	private readonly isMultisite: boolean = false;

	private static customIdPrefix = 'ame-custom-widget-';
	private newWidgetCounter = 0;

	private readonly importDialog: JQuery;
	public importState: KnockoutObservable<string>;
	public uploadButtonEnabled: KnockoutObservable<boolean>;

	public importErrorMessage: KnockoutObservable<string>;
	public importErrorHttpCode: KnockoutObservable<number>;
	public importErrorResponse: KnockoutObservable<string>;

	public readonly isDefaultOrderOverrideEnabled: KnockoutObservable<boolean>;
	public readonly actorOrderOverride: AmeActorFeatureState;

	public readonly actorForcedColumns: AmeActorFeatureState;
	public readonly forcedColumnCount: KnockoutObservable<number | null>;
	public readonly forcedColumnSelectorOptions: Array<{ value: number | null, label: string }>;

	public readonly forcedColumnStrategy: KnockoutObservable<number | null>;
	public readonly forcedColumnStrategyOptions: Array<{ value: number | null, label: string }> = [
		{value: null, label: 'Always'}
	];

	public readonly toggleLabelForSelectedActor: KnockoutObservable<string>;

	constructor(
		widgetSettings: WidgetEditorSettings,
		selectedActor: string | null = null,
		isMultisite: boolean = false,
		initialPreviewColumns: number|string = 1
	) {
		this.isMultisite = isMultisite;

		this.actorSelector = new AmeActorSelector(AmeActors, true);

		//Wrap the selected actor in a computed observable so that it can be used with Knockout.
		this.selectedActor = this.actorSelector.createKnockoutObservable(ko);
		//Re-select the previously selected actor, or select "All" (null) by default.
		this.selectedActor(selectedActor);
		const selectedActorObject = this.actorSelector.createActorObservable(ko);

		this.widgetColumns = [];
		for (let i = 0; i < this.maxDashboardColumns; i++) {
			this.widgetColumns.push(ko.observableArray([] as AmeDashboardWidget[]));
		}

		//Widget order settings.
		const defaultOrderOverride = ko.observable(
			widgetSettings.defaultOrderOverrideEnabled || false
		);
		this.isDefaultOrderOverrideEnabled = ko.computed({
			read: () => defaultOrderOverride(),
			write: (newDefaultOrderOverride: any) => {
				//Coerce the value to a boolean. Knockout could pass in a string.
				defaultOrderOverride(!!newDefaultOrderOverride);
			}
		});

		const layoutOverrideStrategy = new AmeActorFeatureStrategy({
			roleCombinationMode: AmeRoleCombinationMode.Some,
			noValueDefault: false,
			getSelectedActor: selectedActorObject,
			getAllActors: () => this.actorSelector.getVisibleActors(),
		});

		this.actorOrderOverride = new AmeActorFeatureState(
			new AmeObservableActorFeatureMap(widgetSettings.orderOverridePerActor),
			layoutOverrideStrategy
		);

		//Column layout settings.
		this.forcedColumnCount = ko.observable(widgetSettings.forcedColumnCount ?? null);
		this.forcedColumnStrategy = ko.observable(widgetSettings.forcedColumnStrategy ?? null);
		this.actorForcedColumns = new AmeActorFeatureState(
			new AmeObservableActorFeatureMap(widgetSettings.forcedColumnsEnabledPerActor),
			layoutOverrideStrategy
		);

		this.forcedColumnSelectorOptions = [{value: null, label: 'Leave unchanged'}];
		for (let i = 1; i <= this.maxDashboardColumns; i++) {
			this.forcedColumnSelectorOptions.push({
				value: i,
				label: i + ' column' + (i > 1 ? 's' : '')
			});
		}

		const breakpoints = [600, 768, 800, 992, 1200, 1400, 1500, 1800]
		for (let i = 0; i < breakpoints.length; i++) {
			this.forcedColumnStrategyOptions.push({
				value: breakpoints[i],
				label: 'Screen size ≥' + breakpoints[i] + 'px'
			});
		}

		this.previewColumnOptions = [];
		for (let i = 1; i <= this.maxDashboardColumns; i++) {
			this.previewColumnOptions.push(i);
		}

		this.loadSettings(widgetSettings);

		const previewColumnCount = ko.observable<number>(
			typeof initialPreviewColumns === 'string'
				? parseInt(initialPreviewColumns, 10)
				: initialPreviewColumns
		);
		this.desiredPreviewColumnCount = ko.computed({
			read: () => previewColumnCount(),
			write: (newColumnCount: number) => {
				if (newColumnCount < 1 || newColumnCount > this.widgetColumns.length) {
					throw {message: 'Invalid column count: ' + newColumnCount};
				}
				previewColumnCount(newColumnCount);
			}
		});

		this.columnLayout = ko.computed<Array<Array<number>>>(() => {
			const singleColumnLayout = [[1, 2, 3, 4]];
			//These are based on how WordPress 6.2 lays out the dashboard
			//widget columns using floats.
			switch (this.desiredPreviewColumnCount()) {
				case 1:
					return singleColumnLayout;
				case 2:
					return [[1], [2, 3, 4]];
				case 3:
					return [[1], [2], [3, 4]];
				case 4:
					return [[1], [2], [3], [4]];
			}
			return singleColumnLayout;
		});

		this.toggleLabelForSelectedActor = ko.computed(() => {
			const actor = selectedActorObject();
			if (actor === null) {
				return 'Enable for all users';
			}
			if (actor.isUser()) {
				return 'Enable for the selected user';
			}
			return 'Enable for the selected role';
		});


		//These are only updated when saving or exporting widget settings.
		this.widgetData = ko.observable('');
		this.widgetDataLength = ko.observable(0);
		this.isExportButtonEnabled = ko.observable(true);

		//Similarly, these are used when importing settings.
		this.importState = ko.observable('start');
		this.uploadButtonEnabled = ko.observable(false);

		this.importErrorHttpCode = ko.observable(0);
		this.importErrorMessage = ko.observable('');
		this.importErrorResponse = ko.observable('');

		this.importDialog = this.setupImportDialog();
	}

	loadSettings(widgetSettings: WidgetEditorSettings) {
		const _ = AmeDashboardWidgetEditor._;

		for (let i = 0; i < this.widgetColumns.length; i++) {
			this.widgetColumns[i].removeAll();
		}

		this.welcomePanel = new AmeWelcomeWidget(_.get(widgetSettings, 'welcomePanel', {}), this);
		this.widgetColumns[0].push(this.welcomePanel);

		for (let i = 0; i < widgetSettings.widgets.length; i++) {
			let properties = widgetSettings.widgets[i],
				widget = null;

			if (properties.hasOwnProperty('wrappedWidget')) {
				widget = new AmeStandardWidgetWrapper(properties, this);
			} else if (_.get(properties, 'widgetType') === 'custom-html') {
				widget = new AmeCustomHtmlWidget(properties, this);
			} else if (_.get(properties, 'widgetType') === 'custom-rss') {
				widget = new AmeCustomRssWidget(properties, this);
			} else {
				throw {message: 'Unknown widget type', widgetProperties: properties};
			}

			//On a normal site we don't have to worry about plugins that are active on some sites but not others,
			//so we can just remove/filter out widgets that are not present. Just to be safe, however, these changes
			//won't be saved unless the user saves the filtered widget list.
			if (!this.isMultisite && !widget.isPresent && AmeDashboardWidgetEditor.autoCleanupEnabled) {
				continue;
			}

			const columnIndex = AmeDashboardWidget.locationToColumnMap[widget.location()] ?? 0;
			this.widgetColumns[columnIndex].push(widget);

			//The custom ID counter should be high enough not to clash with existing widgets.
			if (widget.id.indexOf(AmeDashboardWidgetEditor.customIdPrefix) === 0) {
				let idNum = parseInt(widget.id.substring(AmeDashboardWidgetEditor.customIdPrefix.length), 10);
				if (!isNaN(idNum)) {
					this.newWidgetCounter = Math.max(idNum, this.newWidgetCounter);
				}
			}
		}

		this.initialWidgetSettings = widgetSettings;
	}

	getColumnContents(columnNumber: number): KnockoutObservableArray<AmeDashboardWidget> {
		const columnIndex = columnNumber - 1;
		if (columnIndex < 0 || columnIndex >= this.widgetColumns.length) {
			throw {message: 'Invalid column index', columnIndex: columnIndex};
		}
		return this.widgetColumns[columnIndex];
	}

	isColumnEmpty(columnNumber: number): boolean {
		const columnIndex = columnNumber - 1;
		if (columnIndex >= 0 && (columnIndex < this.widgetColumns.length)) {
			return this.widgetColumns[columnIndex]().length === 0;
		}
		return false;
	}

	onBeforeMoveWidget(args: any) {
		const firstColumn = this.widgetColumns[0];

		//The "Welcome" widget should always be the first item in the first column.
		if (args.item === this.welcomePanel) {
			if ((args.targetParent !== firstColumn) || (args.targetIndex !== 0)) {
				args.cancelDrop = true;
				return;
			}
		} else {
			//Because the "Welcome" widget is always first, other widgets can't be
			//moved to the top of the first column.
			if ((args.targetParent === firstColumn) && (args.targetIndex === 0)) {
				args.cancelDrop = true;
				return;
			}
		}
	}

	onAfterMoveWidget(args: any) {
		//When a widget is moved to a different column, update its location.
		if ((args.sourceParent !== args.targetParent) && (args.item instanceof AmeDashboardWidget)) {
			const columnIndex = this.widgetColumns.indexOf(args.targetParent);
			if (columnIndex >= 0) {
				if (typeof AmeDashboardWidget.columnToLocationMap[columnIndex] === 'string') {
					const widget = args.item as AmeDashboardWidget;
					widget.location(AmeDashboardWidget.columnToLocationMap[columnIndex]);
				}
			}
		}
	}

	// noinspection JSUnusedGlobalSymbols Used in Knockout templates.
	removeWidget(widget: AmeDashboardWidget, event: Event) {
		if (!event.target) {
			return;
		}

		jQuery(event.target).closest('.ame-dashboard-widget').slideUp(300, () => {
			for (let i = 0; i < this.widgetColumns.length; i++) {
				this.widgetColumns[i].remove(widget);
			}
		});
	}

	// noinspection JSUnusedGlobalSymbols Used in Knockout templates.
	addHtmlWidget() {
		this.newWidgetCounter++;

		let widget = new AmeCustomHtmlWidget({
			id: AmeDashboardWidgetEditor.customIdPrefix + this.newWidgetCounter,
			title: 'New Widget ' + this.newWidgetCounter
		}, this);

		//Expand the new widget.
		widget.isOpen(true);

		this.insertAfterWelcomePanel(widget);
	}

	// noinspection JSUnusedGlobalSymbols Used in Knockout templates.
	addRssWidget() {
		this.newWidgetCounter++;

		let widget = new AmeCustomRssWidget({
			id: AmeDashboardWidgetEditor.customIdPrefix + this.newWidgetCounter,
			title: 'New RSS Widget ' + this.newWidgetCounter
		}, this);

		//Expand the new widget.
		widget.isOpen(true);

		this.insertAfterWelcomePanel(widget);
	}

	private insertAfterWelcomePanel(widget: AmeDashboardWidget) {
		//The "Welcome" panel should always be in the first column. It can't be moved.
		const firstColumn = this.widgetColumns[0];

		//The "Welcome" panel is always first, so we can cheat for performance.
		if (this.welcomePanel && (firstColumn.indexOf(this.welcomePanel) === 0)) {
			let welcomePanel = firstColumn.shift();
			firstColumn.unshift(widget);
			firstColumn.unshift(welcomePanel);
		} else {
			//But just in case it's not first for some odd reason,
			//let's fall back to inserting the widget at the beginning.
			firstColumn.unshift(widget);
		}
	}

	// noinspection JSUnusedGlobalSymbols Used in Knockout templates.
	saveChanges() {
		let settings = this.getCurrentSettings();

		//Set the hidden form fields.
		this.widgetData(JSON.stringify(settings));
		this.widgetDataLength(this.widgetData().length);

		//Submit the form.
		return true;
	}

	protected getCurrentSettings(): WidgetEditorSettings {
		const collectionFormatName = 'Admin Menu Editor dashboard widgets';
		const collectionFormatVersion = '1.1';
		const _ = AmeDashboardWidgetEditor._;

		let settings: WidgetEditorSettings = {
			format: {
				name: collectionFormatName,
				version: collectionFormatVersion
			},
			widgets: [],
			welcomePanel: {
				grantAccess: _.pickBy(this.welcomePanel?.grantAccess.getAll() ?? {}, function (hasAccess, actorId) {
					if (typeof actorId === 'undefined') {
						return false; //This should never happen in practice.
					}

					//Remove "allow" settings for actors that can't actually see the panel.
					return AmeActors.hasCapByDefault(actorId, 'edit_theme_options') || !hasAccess;
				}),
			},

			defaultOrderOverrideEnabled: this.isDefaultOrderOverrideEnabled(),
			orderOverridePerActor: this.actorOrderOverride.toJs(),

			forcedColumnCount: this.forcedColumnCount(),
			forcedColumnStrategy: this.forcedColumnStrategy(),
			forcedColumnsEnabledPerActor: this.actorForcedColumns.toJs(),

			siteComponentHash: this.initialWidgetSettings?.siteComponentHash ?? 'initial-settings-not-initialized',
			//Unix timestamp in seconds.
			lastModified: Math.floor(Date.now() / 1000)
		};

		for (let i = 0; i < this.widgetColumns.length; i++) {
			_.forEach(_.without(this.widgetColumns[i](), this.welcomePanel), function (widget) {
				if (widget !== null) {
					settings.widgets.push(widget.toPropertyMap());
				}
			});
		}

		return settings;
	}

	// noinspection JSUnusedGlobalSymbols Used in Knockout templates.
	exportWidgets() {
		//Temporarily disable the export button to prevent accidental repeated clicks.
		this.isExportButtonEnabled(false);

		this.widgetData(JSON.stringify(this.getCurrentSettings()));

		//Re-enable the export button after a few seconds.
		window.setTimeout(() => {
			this.isExportButtonEnabled(true);
		}, 3000);

		//Explicitly allow form submission.
		return true;
	}

	setupImportDialog() {
		//Note to self: Refactor this as a separate view-model, perhaps.

		const importDialog = jQuery('#ame-import-widgets-dialog');
		let importForm = importDialog.find('#ame-import-widgets-form');

		importDialog.dialog({
			autoOpen: false,
			modal: true,
			closeText: ' ',
			open: () => {
				importForm.resetForm();
				this.importState('start');
				this.uploadButtonEnabled(false);
			}
		});

		//jQuery moves the dialog to the end of the DOM tree, which puts it outside our KO root node.
		//This means we must apply bindings directly to the dialog node.
		ko.applyBindings(this, importDialog.get(0));

		//Enable the upload button only when the user selects a file.
		importForm.find('#ame-import-file-selector').on('change', (event) => {
			this.uploadButtonEnabled(!!jQuery(event.target).val());
		});

		//This function displays unhandled server side errors. In theory, our upload handler always returns a well-formed
		//response even if there's an error. In practice, stuff can go wrong in unexpected ways (e.g. plugin conflicts).
		let handleUnexpectedImportError = (xhr: JQueryXHR, errorMessage: string) => {
			//The server-side code didn't catch this error, so it's probably something serious
			//and retrying won't work.
			importForm.resetForm();
			this.importState('unexpected-error');

			//Display error information.
			this.importErrorMessage(errorMessage);
			this.importErrorHttpCode(xhr.status);
			this.importErrorResponse((xhr.responseText !== '') ? xhr.responseText : '[Empty response]');
		};

		importForm.ajaxForm({
			dataType: 'json',
			beforeSubmit: (formData) => {

				//Check if the user has selected a file
				for (let i = 0; i < formData.length; i++) {
					if (formData[i].name === 'widget_file') {
						if ((typeof formData[i].value === 'undefined') || !formData[i].value) {
							alert('Select a file first!');
							return false;
						}
					}
				}

				this.importState('uploading');
				this.uploadButtonEnabled(false);
				return true;
			},
			success: (data, status, xhr) => {
				if (!importDialog.dialog('isOpen')) {
					//Whoops, the user closed the dialog while the upload was in progress.
					//Discard the response silently.
					return;
				}

				if ((data === null) || (typeof data !== 'object')) {
					handleUnexpectedImportError(xhr, 'Invalid response from server. Please check your PHP error log.');
					return;
				}

				if (typeof data.error !== 'undefined') {
					alert(data.error.message || data.error.code);
					//Let the user try again.
					importForm.resetForm();
					this.importState('start');
				}

				if ((typeof data.widgets !== 'undefined') && data.widgets) {
					//Lets load these widgets into the editor.
					this.loadSettings(data);

					//Display a success message, then automatically close the window after a few moments.
					this.importState('complete');
					setTimeout(() => {
						importDialog.dialog('close');
					}, 700);
				}

			},
			error: function (xhr, status, errorMessage) {
				handleUnexpectedImportError(xhr, errorMessage);
			}
		});

		importDialog.find('#ame-cancel-widget-import').on('click', () => {
			importDialog.dialog('close');
		});

		return importDialog;
	}

	// noinspection JSUnusedGlobalSymbols Used in Knockout templates.
	openImportDialog() {
		this.importDialog.dialog('open');
	}
}

jQuery(function () {
	ameWidgetEditor = new AmeDashboardWidgetEditor(
		wsWidgetEditorData.widgetSettings,
		wsWidgetEditorData.selectedActor,
		wsWidgetEditorData.isMultisite,
		wsWidgetEditorData.previewColumns
	);
	ko.applyBindings(ameWidgetEditor, document.getElementById('ame-dashboard-widget-editor'));

	//Set up tooltips.
	if (typeof (jQuery as any)['qtip'] !== 'undefined') {
		jQuery('#ame-dashboard-widget-editor .ws_tooltip_trigger').qtip({
			style: {
				classes: 'qtip qtip-rounded ws_tooltip_node'
			}
		});
	}
});