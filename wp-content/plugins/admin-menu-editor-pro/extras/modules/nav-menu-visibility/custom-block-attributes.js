"use strict";
(function (globalContext) {
    //Fetch the global wp object.
    if ((typeof globalContext.wp !== 'object') || (globalContext.wp === null)) {
        return;
    }
    const wp = globalContext.wp;
    if (typeof wp.hooks !== 'object') {
        return; //Missing hooks API. Should never happen in practice.
    }
    /**
     * Loosely verify that the input is an object and ensure it has the "attributes" property.
     *
     * @param settings
     */
    function parseBlockTypeSettings(settings) {
        if ((typeof settings !== 'object') || (settings === null)) {
            return null;
        }
        const settingsAsRecord = settings;
        if (typeof settingsAsRecord.attributes === 'undefined') {
            settingsAsRecord.attributes = {};
            return settingsAsRecord;
        }
        else {
            if ((typeof settingsAsRecord.attributes === 'object') && (settingsAsRecord.attributes !== null)) {
                return settingsAsRecord;
            }
        }
        //Unsupported settings object.
        return null;
    }
    //Add our custom attribute to block types. There's no UI for it in the block editor,
    //we just want to ensure it gets saved and loaded properly.
    wp.hooks.addFilter('blocks.registerBlockType', 'admin-menu-editor/nav-menu-visibility', function (settings) {
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
    });
})(window);
//# sourceMappingURL=custom-block-attributes.js.map