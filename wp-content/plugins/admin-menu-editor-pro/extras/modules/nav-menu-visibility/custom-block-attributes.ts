(function (globalContext: Record<string, unknown>) {
	//Fetch the global wp object.
	if ((typeof globalContext.wp !== 'object') || (globalContext.wp === null)) {
		return;
	}
	const wp = globalContext.wp as AmePartialWpGlobal;

	if (typeof wp.hooks !== 'object') {
		return; //Missing hooks API. Should never happen in practice.
	}

	type SettingsWithAttributes = {
		attributes: Record<string, unknown>;
		[key: string]: unknown;
	};

	/**
	 * Loosely verify that the input is an object and ensure it has the "attributes" property.
	 *
	 * @param settings
	 */
	function parseBlockTypeSettings(settings: unknown): SettingsWithAttributes | null {
		if ((typeof settings !== 'object') || (settings === null)) {
			return null;
		}

		const settingsAsRecord = settings as Record<string, unknown>;
		if (typeof settingsAsRecord.attributes === 'undefined') {
			settingsAsRecord.attributes = {};
			return settingsAsRecord as SettingsWithAttributes;
		} else {
			if ((typeof settingsAsRecord.attributes === 'object') && (settingsAsRecord.attributes !== null)) {
				return settingsAsRecord as SettingsWithAttributes;
			}
		}

		//Unsupported settings object.
		return null;
	}

	//Add our custom attribute to block types. There's no UI for it in the block editor,
	//we just want to ensure it gets saved and loaded properly.
	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'admin-menu-editor/nav-menu-visibility',
		function (settings: unknown) {
			const parsedSettings = parseBlockTypeSettings(settings);
			if (parsedSettings === null) {
				return settings;
			}

			parsedSettings.attributes = Object.assign(parsedSettings.attributes, {
				ameNavMenuVisibility: {
					type: 'string',
					default: '',
				}
			});
			return parsedSettings;
		}
	);

})(window as (Window & typeof globalThis & Record<string, unknown>));