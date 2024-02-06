/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/jqueryui.d.ts" />

declare const wsAmeDashboardLayoutSettings: AmeWidgetLayoutOverrideSettings;

interface AmeWidgetLayoutOverrideSettings {
	orderOverrideEnabled: boolean;
}

{
	const $ = jQuery;

	function disableWidgetSorting() {
		//Set the "handle" and "items" options to a non-existent selector to effectively
		//disable sorting. Using the "disable" method doesn't work because the sortable
		//somehow becomes enabled again when the user opens or closes a widget. I was not
		//able to figure out how that happens.
		const nonExistentSelector = '.ws-de-non-existent-class-4168408650';
		$('.meta-box-sortables')
			.sortable('option', 'handle', nonExistentSelector)
			.sortable('option', 'items', nonExistentSelector)
			.sortable('refresh');

		//Hide the "up" and "down" buttons.
		const $widgetContainer = $('#dashboard-widgets');
		$widgetContainer
			.find('.postbox .handle-order-higher, .postbox .handle-order-lower')
			.hide();

		//Get rid of the "move" cursor on widget headers.
		$('<style>')
			.html('#dashboard-widgets .postbox .hndle { cursor: auto; }')
			.appendTo('head');

		//Hide the "drag boxes here" message and disable special styling for empty columns.
		/*$widgetContainer
			.find('.meta-box-sortables.empty-container')
			.removeClass('empty-container');*/
	}

	function init() {
		if (wsAmeDashboardLayoutSettings.orderOverrideEnabled) {
			disableWidgetSorting();
		}
	}

	let waitStart: Date | null = null;
	let isFirstWait = true;
	let $sortables: JQuery | null = null;

	/**
	 * Because we can't directly control the load order of scripts in WordPress
	 * (especially core scripts), this script could run before /wp-admin/js/dashboard.js
	 * has initialized the dashboard widgets. So we'll wait for that to happen
	 * before we do anything.
	 */
	function waitForDashboardInit() {
		if ($sortables === null) {
			$sortables = $('.meta-box-sortables');
		}

		if ((typeof wp === 'undefined') || !$sortables.sortable('instance')) {
			setTimeout(waitForDashboardInit, isFirstWait ? 40 : 200);
			isFirstWait = false;
		} else {
			init();
			return;
		}

		if (waitStart === null) {
			waitStart = new Date();
		}
		if ((new Date().getTime() - waitStart.getTime()) > 5000) {
			return; //Don't wait forever.
		}
	}

	if (typeof wsAmeDashboardLayoutSettings !== 'undefined') {
		$(waitForDashboardInit);
	}
}