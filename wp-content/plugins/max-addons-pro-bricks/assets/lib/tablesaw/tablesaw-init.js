/*! Tablesaw - v3.1.2 - 2019-03-19
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2019 Filament Group; Licensed MIT */
(function(win) {
	"use strict";

	// DOM-ready auto-init of plugins.
	// Many plugins bind to an "enhance" event to init themselves on dom ready, or when new markup is inserted into the DOM
	// Use raw DOMContentLoaded instead of shoestring (may have issues in Android 2.3, exhibited by stack table)
	if (!("Tablesaw" in win)) {
		throw new Error("Tablesaw library not found.");
	}
	if (!("init" in Tablesaw)) {
		throw new Error("Your tablesaw-init.js is newer than the core Tablesaw version.");
	}

	Tablesaw.init();
})(typeof window !== "undefined" ? window : this);

function mabTable() {
	bricksQuerySelectorAll(document, '.brxe-max-table').forEach(function (e) {
		var element  = document.querySelector('.mab-table'),
			settings = ( element != null ) ? JSON.parse(element.dataset.settings) : '';

		if ( settings.table_type === 'responsive' ) {

			if ( settings.scrollable === true && settings.breakpoint > 0 ) {
				var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

				if ( width >= settings.breakpoint ) {
					element.removeAttribute('data-tablesaw-mode');
				}
			}

			Tablesaw.init();
		}
	});
}

document.addEventListener('DOMContentLoaded', function (e) {
	if (bricksIsFrontend) {
        mabTable();
	}
});