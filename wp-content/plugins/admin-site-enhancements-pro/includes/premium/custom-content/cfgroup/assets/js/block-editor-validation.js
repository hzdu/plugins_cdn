(function($, wp) {
    'use strict';

    var LOCK_KEY = 'cfgroup-validation';
    var NOTICE_ID = 'cfgroup-validation-notice';
    var publishAttemptFailed = false;
    var preSaveHooksRegistered = false;
    var legacySaveListenerBound = false;
    var errorClearHandlerBound = false;
    var validationInProgress = false;
    var legacySubscribeHandling = false;

    function supportsPreSavePost() {
        return typeof cfgroupValidationI18n !== 'undefined' && !!cfgroupValidationI18n.supports_pre_save_post;
    }

    function hasFieldRules() {
        return window.CFG && window.CFG.field_rules && 'object' === typeof window.CFG.field_rules && !$.isEmptyObject(window.CFG.field_rules);
    }

    function getEditedPostStatus() {
        if (!wp.data || !wp.data.select) {
            return '';
        }
        var select = wp.data.select('core/editor');
        if (!select || !select.getEditedPostAttribute) {
            return '';
        }
        return select.getEditedPostAttribute('status') || '';
    }

    function shouldSkipValidation(options, edits) {
        options = options || {};
        edits = edits || {};

        if (options.isAutosave || options.isPreview) {
            return true;
        }

        var status = edits.status || getEditedPostStatus();
        if ('draft' === status) {
            return true;
        }

        return false;
    }

    function scrollToFirstError() {
        if (window.CFG && window.CFG.scrollToFirstValidationError) {
            window.CFG.scrollToFirstValidationError();
            return;
        }

        var $error = $('.cfgroup_input .error:visible').first();
        if (!$error.length) {
            return;
        }

        var el = $error.closest('.cfgroup-field-wrap, .field')[0];
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function showBlockEditorNotice() {
        if (!wp.data || !wp.data.dispatch) {
            return;
        }

        var dispatch = wp.data.dispatch('core/notices');
        if (!dispatch || !dispatch.createNotice) {
            return;
        }

        var message = (typeof cfgroupValidationI18n !== 'undefined' && cfgroupValidationI18n.notice)
            ? cfgroupValidationI18n.notice
            : 'One (or more) of your fields had validation errors. More information is available below.';

        if (dispatch.removeNotice) {
            dispatch.removeNotice(NOTICE_ID);
        }

        dispatch.createNotice('error', message, {
            id: NOTICE_ID,
            isDismissible: true
        });
    }

    function hideBlockEditorNotice() {
        if (!wp.data || !wp.data.dispatch) {
            return;
        }

        var dispatch = wp.data.dispatch('core/notices');
        if (dispatch && dispatch.removeNotice) {
            dispatch.removeNotice(NOTICE_ID);
        }
    }

    function handleValidationFailure(options) {
        options = options || {};
        publishAttemptFailed = true;
        if (options.showNotice) {
            showBlockEditorNotice();
        }
        scrollToFirstError();
    }

    function runValidationOrFail(options) {
        options = options || {};
        var showNotice = options.showNotice !== false;

        if (validationInProgress) {
            return false;
        }

        if (!hasFieldRules() || !window.CFG.runValidation) {
            return true;
        }

        validationInProgress = true;

        try {
            if (window.CFG.runValidation()) {
                hideBlockEditorNotice();
                publishAttemptFailed = false;
                return true;
            }

            handleValidationFailure({ showNotice: showNotice });
            return false;
        } finally {
            validationInProgress = false;
        }
    }

    function clearStaleSaveLock() {
        if (!wp.data || !wp.data.dispatch) {
            return;
        }

        var dispatch = wp.data.dispatch('core/editor');
        if (dispatch && dispatch.unlockPostSaving) {
            dispatch.unlockPostSaving(LOCK_KEY);
        }
    }

    function validateBeforeSaveStable(edits, options) {
        if (shouldSkipValidation(options, edits)) {
            return edits;
        }

        if (!runValidationOrFail({ showNotice: false })) {
            throw new Error(
                (typeof cfgroupValidationI18n !== 'undefined' && cfgroupValidationI18n.notice)
                    ? cfgroupValidationI18n.notice
                    : 'Validation failed.'
            );
        }

        return edits;
    }

    function validateBeforeSaveUnstable(edits, options) {
        if (shouldSkipValidation(options, edits)) {
            if (undefined === edits) {
                return true;
            }
            return edits;
        }

        if (!runValidationOrFail()) {
            return false;
        }

        if (undefined === edits) {
            return true;
        }
        return edits;
    }

    function registerPreSaveHooks() {
        if (preSaveHooksRegistered || !wp.hooks || !wp.hooks.addFilter) {
            return;
        }

        preSaveHooksRegistered = true;

        if (supportsPreSavePost()) {
            wp.hooks.addFilter('editor.preSavePost', 'cfgroup/validation', validateBeforeSaveStable);
        } else {
            wp.hooks.addFilter('editor.__unstablePreSavePost', 'cfgroup/validation-unstable', validateBeforeSaveUnstable);
        }
    }

    function bindErrorClearHandler() {
        if (errorClearHandlerBound) {
            return;
        }

        errorClearHandlerBound = true;

        $(document).on('input change', '.cfgroup_input :input', function() {
            if (!publishAttemptFailed || !window.CFG || !window.CFG.runValidation) {
                return;
            }

            if (window.CFG.runValidation({ silent: true })) {
                hideBlockEditorNotice();
                publishAttemptFailed = false;
                if (window.CFG.clearValidationState) {
                    window.CFG.clearValidationState();
                }
            }
        });
    }

    function bindLegacySaveListener() {
        if (legacySaveListenerBound || !wp.data || !wp.data.subscribe) {
            return;
        }

        legacySaveListenerBound = true;

        var previousIsSaving = false;

        wp.data.subscribe(function() {
            if (legacySubscribeHandling) {
                return;
            }

            var select = wp.data.select('core/editor');
            if (!select) {
                return;
            }

            var isSaving = select.isSavingPost && select.isSavingPost();
            var isAutosaving = select.isAutosavingPost && select.isAutosavingPost();

            if (isSaving && !previousIsSaving && !isAutosaving) {
                var skipOptions = {
                    isAutosave: isAutosaving,
                    isPreview: false
                };

                if (!shouldSkipValidation(skipOptions, {})) {
                    previousIsSaving = isSaving;
                    legacySubscribeHandling = true;

                    try {
                        runValidationOrFail();
                    } finally {
                        legacySubscribeHandling = false;
                    }
                }
            }

            previousIsSaving = isSaving;
        });
    }

    function initBlockEditorValidation() {
        if (!wp || !hasFieldRules()) {
            return;
        }

        clearStaleSaveLock();
        registerPreSaveHooks();
        bindErrorClearHandler();

        if (!supportsPreSavePost()) {
            bindLegacySaveListener();
        }
    }

    window.CFG = window.CFG || {};
    window.CFG.initBlockEditorValidation = initBlockEditorValidation;

    $(function() {
        initBlockEditorValidation();
    });
})(jQuery, window.wp);
