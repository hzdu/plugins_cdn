/**
 * [START] Pro features
 */
(function($) {
    $.fn.wpAssetCleanUpPro = function() {
        return {
            cssJsManagerActions: function() {
                // Load it on all pages if specific taxonomies (e.g. Category, Tag) are set
                $(document).on('change', '.wpacu_load_it_via_tax_checkbox', function () {
                    let $mainThis = $(this);
                    let $parentLi = $(this).parents('li');

                    // IS CHECKED
                    if ($(this).prop('checked')) {
                        let $termsDd = $parentLi.find('select');

                        if (typeof($termsDd.val()) !== 'undefined' && $termsDd.val() !== null && $termsDd.length > 0) {
                            $termsDd.on('chosen:hiding_dropdown change', function (evt, params) {
                                if ($termsDd.val() === '[]' || $termsDd.val() === '' || $termsDd.val().length === 0) {
                                    $mainThis.prop('checked', false).trigger('change');
                                }
                            });
                        }

                        if ($termsDd.html() === '') {
                            $termsDd.parent().parent().next('div[data-wpacu-tax-terms-options-loader]').show();
                            // Load the drop-down (while keeping it hidden and showing a preloader image)
                            // and then show the area when it's done and remove the preloader image
                            $.fn.wpAssetCleanUpPro().wpacuAjaxLoadAllSetTermsForPostType($termsDd, $parentLi);
                        } else {
                            // The options were already loaded (no more preloading needed)
                            $termsDd.prop('disabled', false) // mark it as enabled
                                .focus() // focus on it
                                .removeClass('wpacu_disabled');

                            $parentLi.find('.wpacu_handle_load_via_tax_input_wrap')
                                .removeClass('wpacu_hide'); // Show the input area
                        }
                    } else {
                        // IS UNCHECKED
                        $parentLi.find('.wpacu_handle_load_via_tax_input_wrap').addClass('wpacu_hide'); // Hide the input area
                    }
                });

                // Load it for URLs with request URI matching this RegEx (make exception)
                $(document).on('click change', '.wpacu_load_it_option_two', function () {
                    let $parentLi = $(this).parents('li');

                    if ($(this).prop('checked')) {
                        $parentLi.find('textarea')
                            .prop('disabled', false) // mark it as enabled
                            .focus() // focus on it
                            .removeClass('wpacu_disabled');
                        $parentLi.find('.wpacu_load_regex_input_wrap').removeClass('wpacu_hide');
                    } else {
                        $parentLi.find('textarea')
                            .blur() // lose focus
                            .addClass('wpacu_disabled');

                        // Action taken if the input has no value
                        if ($parentLi.find('textarea').val().trim() === '') {
                            $parentLi.find('textarea')
                                .prop('disabled', true).val(''); // unchecked with no value added to the input
                            $parentLi.find('.wpacu_load_regex_input_wrap').addClass('wpacu_hide');
                        }
                    }
                });

                // async, defer checkboxes actions
                $(document).on('click change', '.wpacu_script_attr_rule_input', function (event) {
                    if ($(this).is(':checked')) {
                        // Does it have any "children"? Alert the admin about any possible issues if the attribute is applied
                        if (event.type === 'click') { // prevent double confirm
                            var anyScriptChildHandlesList = $(this).parents('tr.wpacu_asset_row').attr('data-script-child-handles'),
                                scriptIsParentAlert = wpacu_object.script_is_parent_alert;

                            if ((typeof anyScriptChildHandlesList !== typeof undefined) && anyScriptChildHandlesList !== '') {
                                scriptIsParentAlert = scriptIsParentAlert.replace('{wpacu_script_child_handles}', anyScriptChildHandlesList);

                                if (! confirm(scriptIsParentAlert)) {
                                    return false;
                                }
                            }
                        }

                        $(this).parents('ul').find('.wpacu_script_attr_rule_input').not($(this)).prop('checked', false);

                        if ($(this).hasClass('wpacu_script_attr_rule_global')) {
                            $(this).parents('ul').find('.wpacu-script-attr-make-exception').removeClass('wpacu_hide');
                        }
                    }

                    // Was a rule set, but it's not the site-wide one? Hide the make exception area
                    if (! $(this).parents('ul').find('.wpacu_script_attr_rule_global').is(':checked')) {
                        $(this).parents('ul').find('.wpacu-script-attr-make-exception').addClass('wpacu_hide');
                    }
                });

                // Media Query Load Values
                $(document).on('change', '.wpacu-screen-size-load', function (e) {
                    let wpacuMediaQueriesLoadEnableCustom = ($(this).val() === '1'),
                        wpacuHandle = $(this).attr('data-handle'),
                        wpacuAssetType,
                        $wpacuHandleMediaQueriesLoadFieldArea,
                        $wpacuMediaQueryTextArea;
                    if ($(this).hasClass('wpacu-for-script')) {
                        wpacuAssetType = 'SCRIPT file';
                        $wpacuHandleMediaQueriesLoadFieldArea = $('.wpacu-handle-media-queries-load-field[data-script-handle="' + wpacuHandle + '"]');
                    } else if ($(this).hasClass('wpacu-for-style')) {
                        wpacuAssetType = 'CSS file';
                        $wpacuHandleMediaQueriesLoadFieldArea = $('.wpacu-handle-media-queries-load-field[data-style-handle="' + wpacuHandle + '"]');
                    } else {
                        return false; // should not reach it, but just in case
                    }

                    if ($wpacuHandleMediaQueriesLoadFieldArea.length < 1) {
                        return;
                    }

                    $wpacuMediaQueryTextArea = $wpacuHandleMediaQueriesLoadFieldArea.find(':input');
                    if (wpacuMediaQueriesLoadEnableCustom) {
                        if ($(this)[0].hasAttribute('data-wpacu-show-parent-alert')) {
                            let wpacuWarningNotification = wpacu_object.parent_asset_media_query_load_alert.replace('[asset_type]', wpacuAssetType);

                            if ( ! confirm(wpacuWarningNotification) ) {
                                $(this).val(''); // on any screen size (switch to default)
                                return false;
                            }
                        }

                        $wpacuHandleMediaQueriesLoadFieldArea.addClass('wpacu-is-visible');
                        $wpacuMediaQueryTextArea.prop('disabled', false);

                        if ($wpacuMediaQueryTextArea.val() === '') {
                            // Focus on the textarea to alter the admin about it as sometimes due to the layout styling, it's not very visible
                            $wpacuMediaQueryTextArea.focus();
                        }
                    } else {
                        //console.log('TextArea should be hidden.');
                        $wpacuHandleMediaQueriesLoadFieldArea.removeClass('wpacu-is-visible');

                        // Was the area hidden without any textarea value, and the value was null on a page load?
                        // Mark it as disabled (save total sent inputs for PHP processing)
                        // If there's ONLY space added (could be by mistake) to the textarea, ignore it as it's irrelevant
                        if (typeof($wpacuMediaQueryTextArea.val()) !== 'undefined' && $wpacuMediaQueryTextArea.val() !== null && $wpacuMediaQueryTextArea.val().trim() === '' && $wpacuMediaQueryTextArea.attr('data-wpacu-is-empty-on-page-load') === 'true') {
                            $wpacuMediaQueryTextArea.prop('disabled', true).val('');
                        }
                    }
                });

                },

            limitSubmittedFields: function () {
                let preloadTargetInput    = '[data-wpacu-input="preload"]',
                    mediaQueryTargetInput = '[data-wpacu-input="media-query-select"]',
                    positionTargetInput   = '[data-wpacu-input="position-select"]',
                    postTypeViaTaxUnload  = '.wpacu_unload_it_via_tax_checkbox',
                    postTypeViaTaxLoad    = '.wpacu_load_it_via_tax_checkbox',
                    wpacuListToCheck = [];

                // Edit post/page area (e.g. /wp-admin/post.php?post=[POST_ID_HERE]&action=edit)
                // OR edit taxonomy area (e.g. /wp-admin/term.php?taxonomy=category&tag_ID=63&post_type=post)
                if ($('body.wp-admin form#post').length > 0 || $('body.wp-admin form#edittag').length > 0) {
                    if ($('#wpacu_unload_assets_area_loaded').length < 1) {
                        return true; // the CSS/JS area is not loaded on edit post/page area, thus no reason to continue
                    }
                }

                if ($(preloadTargetInput).length > 0) {
                    wpacuListToCheck.push(preloadTargetInput);
                }

                if ($(mediaQueryTargetInput).length > 0) {
                    wpacuListToCheck.push(mediaQueryTargetInput);
                }

                if ($(positionTargetInput).length > 0) {
                    wpacuListToCheck.push(positionTargetInput);
                }

                if ($(postTypeViaTaxUnload).length > 0) {
                    wpacuListToCheck.push(postTypeViaTaxUnload);
                }

                if ($(postTypeViaTaxLoad).length > 0) {
                    wpacuListToCheck.push(postTypeViaTaxLoad);
                }

                if (wpacuListToCheck.length > 0) {
                    $(wpacuListToCheck.join()).each(function () {
                        //console.log($(this).val());
                        if ( ! $(this).val() ) {
                            let $thisEl = $(this);
                            $thisEl.prop('disabled', 'disabled');

                            setTimeout(function () {
                                $thisEl.prop('disabled', false);
                            }, 2000); // restore them in case the user pressed "Preview Changes"
                        }

                        // Media Query Load
                        if ($(this).hasClass('wpacu-screen-size-load')) {
                            let dataHandle = $(this).attr('data-handle');
                            let selectMediaQueryEl = '#wpacu_handle_media_query_load_select_style_' + dataHandle;
                            let textareaMediaQueryEl = '#wpacu_handle_media_query_load_textarea_style_' + dataHandle;

                            let selectMediaQueryStatusOne = typeof($(selectMediaQueryEl)) !== 'undefined' &&
                                $(selectMediaQueryEl).val() !== null &&
                                $(selectMediaQueryEl).length > 0 &&
                                ($(selectMediaQueryEl).val() === 1);

                            let textareaMediaQueryExistsWithoutValue = typeof($(textareaMediaQueryEl)) !== 'undefined' &&
                                $(textareaMediaQueryEl).val() !== null &&
                                $(textareaMediaQueryEl).length > 0 &&
                                ! $(textareaMediaQueryEl).val();

                            if ( selectMediaQueryStatusOne && textareaMediaQueryExistsWithoutValue ) {
                                let $thisEl = $(this);
                                $thisEl.prop('disabled', 'disabled');

                                $(textareaMediaQueryEl).prop('disabled', 'disabled');

                                setTimeout(function () {
                                    $thisEl.prop('disabled', false);
                                    $(textareaMediaQueryEl).prop('disabled', false);
                                }, 2000); // restore them in case the user pressed "Preview Changes"
                            }
                        }

                        // Position drop-down
                        if ($(this).attr('data-wpacu-input') === 'position-select' && $(this).val() === 'initial') {
                            let $thisEl = $(this);
                            $thisEl.prop('disabled', 'disabled');
                            setTimeout(function () {
                                $thisEl.prop('disabled', false);
                                }, 2000); // restore them in case the user pressed "Preview Changes"
                        }

                        // Unload post type based on its taxonomy values
                        if ($(this).hasClass('wpacu_unload_it_via_tax_checkbox')) {
                            let dataHandle = $(this).attr('data-handle');
                            let dataFor = $(this).attr('data-handle-for');

                            let $targetedDd = $('select.wpacu_unload_via_tax_dd[data-handle="' + dataHandle + '"][data-handle-for="' + dataFor + '"]');

                            if (typeof($targetedDd.val()) !== 'undefined' && $targetedDd.val() !== null && $targetedDd.length > 0 && ($targetedDd.val() === '[]' || $targetedDd.val() === '' || $targetedDd.val().length === 0)) {
                                let $thisEl = $(this);
                                $thisEl.prop('disabled', 'disabled');
                                $targetedDd.prop('disabled', 'disabled');

                                setTimeout(function () {
                                    $thisEl.prop('disabled', false);
                                    $targetedDd.prop('disabled', false);
                                }, 2000); // restore them in case the user pressed "Preview Changes"
                            }
                        }

                        // Exception: Unload post type based on its taxonomy values
                        if ($(this).hasClass('wpacu_load_it_via_tax_checkbox')) {
                            let dataHandle = $(this).attr('data-handle');
                            let dataFor = $(this).attr('data-handle-for');

                            let $targetedDd = $('select.wpacu_load_via_tax_dd[data-handle="' + dataHandle + '"][data-handle-for="' + dataFor + '"]')

                            if (typeof($targetedDd.val()) !== 'undefined' && $targetedDd.val() !== null && $targetedDd.length > 0 && ($targetedDd.val() === '[]' || $targetedDd.val() === '' || $targetedDd.val().length === 0)) {
                                let $thisEl = $(this); // for the timeout
                                $thisEl.prop('disabled', 'disabled');
                                $targetedDd.prop('disabled', 'disabled');

                                setTimeout(function () {
                                    $thisEl.prop('disabled', false);
                                    $targetedDd.prop('disabled', false);
                                }, 2000); // restore them in case the user pressed "Preview Changes"
                            }
                        }

                        });
                }
                return true;
            },

            triggerForHardcodedAssets: function () {
                // [Start] Only for hardcoded assets
                let hardcodedRowTarget = '[data-is-hardcoded-asset="true"]';

                if ($(hardcodedRowTarget).length > 0) {
                    let hardcodedAssetsTrAreas = document.querySelectorAll(hardcodedRowTarget + ' .wpacu_asset_size_area');

                    let wpacuObserverHardcodedAssets = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            let wpacuAssetSizeArea = entry.target;

                            if ($(entry.target.parentNode).attr('data-wpacu-row-status') === 'contracted') {
                                wpacuAssetSizeArea.classList.add('wpacu_prepend_sign_before');
                            } else {
                                wpacuAssetSizeArea.classList.remove('wpacu_prepend_sign_before');
                            }
                        }
                    });

                    hardcodedAssetsTrAreas.forEach(entry => {
                            wpacuObserverHardcodedAssets.observe(entry);
                        }
                    );

                    $.each($(hardcodedRowTarget), function (index, value) {
                        $.fn.wpAssetCleanUpPro().updateHardcodedDataHiddenFieldStatus($(this));

                        });

                    $(hardcodedRowTarget).on('change', ':input', function () {
                        // If all three checkboxes () are off, mark the hidden input with the hardcoded data as hidden to have fewer inputs submitted
                        // This is good in case there are only 1000 maximum fields set for the maximum post fields that can be sent (php.ini)
                        $.fn.wpAssetCleanUpPro().updateHardcodedDataHiddenFieldStatus($(this).parents('[data-is-hardcoded-asset]'));
                    });
                }
                // [End] Only for hardcoded assets
            },
            updateHardcodedDataHiddenFieldStatus: function ($parentTr) {
                // If all three checkboxes () are off, mark the hidden input with the hardcoded data as hidden to have fewer inputs submitted
                // This is good in case there are only 1000 maximum fields set for the maximum post fields that can be sent (php.ini)
                let hardcodedAssetGeneratedHandle = false;

                if ($parentTr.is('[data-style-handle-row]')) {
                    hardcodedAssetGeneratedHandle = $parentTr.attr('data-style-handle-row');
                } else if ($parentTr.is('[data-script-handle-row]')) {
                    hardcodedAssetGeneratedHandle = $parentTr.attr('data-script-handle-row');
                }

                if ( ! hardcodedAssetGeneratedHandle ) {
                    return;
                }

                if (  $parentTr.find('.wpacu_unload_rule_input:checked').length > 0 ||
                      $parentTr.find('.wpacu_load_exception:checked').length > 0 ||
                    ( $parentTr.find('select[data-wpacu-input="position-select"]').length > 0 && ($parentTr.find('select[data-wpacu-input="position-select"]').val() === 'head' || $parentTr.find('select[data-wpacu-input="position-select"]').val() === 'body') ) ||
                    ( $parentTr.find('select[data-wpacu-input="preload"]').length > 0 && ($parentTr.find('select[data-wpacu-input="preload"]').val() !== 'basic' || $parentTr.find('select[data-wpacu-input="preload"]').val() !== 'async') ) ||
                      $parentTr.hasClass('wpacu_not_load') ) {
                    // A rule is set
                    $('#' + hardcodedAssetGeneratedHandle + '_hardcoded_data').prop('disabled', false);
                } else {
                    // No rule is set
                    $('#' + hardcodedAssetGeneratedHandle + '_hardcoded_data').prop('disabled', true);
                }
            },

            initPluginLoadManager: function () {
                if ($('#wpacu-plugins-load-manager-wrap').length > 0) {
                    setTimeout(function () {
                        $.fn.wpAssetCleanUpPro().pluginLoadManager();
                    }, 200);
                }
            },

            pluginLoadManager: function () {
                // Status of the rules
                $('#' + wpacu_object.plugin_prefix + '_plugins_manager_checkbox').on('click', function() {
                    let wpacuSpinnerElId = '#wpacu-main-loading-spinner';

                    if ($(wpacuSpinnerElId).length > 0) {
                        $(wpacuSpinnerElId).removeClass('wpacu_hide');
                    }

                    let pluginsManagerAreaType = $(this).attr('data-wpacu-type');

                    let wpacuSettingKey = 'plugins_manager_'+ pluginsManagerAreaType +'_disable';
                    let wpacuSettingValue = $(this).is(':checked')
                        ? 0 // Turned "ON": 'plugins_manager_'+ $(this).attr('data-wpacu-type') +'_disable' is set to ZERO
                        : 1; // Turned "OFF": 'plugins_manager_'+ $(this).attr('data-wpacu-type') +'_disable' is set to ONE

                    if (wpacuSettingValue === 0) {
                        //console.log(wpacuSettingValue);
                        $('#wpacu-sub-page-nav-plugins-manager-' + pluginsManagerAreaType).removeClass('wpacu-disabled');
                    } else {
                        //console.log(wpacuSettingValue);
                        $('#wpacu-sub-page-nav-plugins-manager-' + pluginsManagerAreaType).addClass('wpacu-disabled');
                    }

                    /*
                    if ( $('#wpacu-sub-page-nav-plugins-manager-front').hasClass('wpacu-disabled') ) {
                        $('[data-wpacu-top-menu-tab-item="wpassetcleanup_plugins_manager"]').addClass('wpacu-disabled');
                    } else {
                        $('[data-wpacu-top-menu-tab-item="wpassetcleanup_plugins_manager"]').removeClass('wpacu-disabled');
                    }
                    */

                    $.post(wpacu_object.ajax_url, {
                        'action'              : wpacu_object.plugin_prefix + '_update_plugin_setting',
                        'wpacu_setting_key'   : wpacuSettingKey,
                        'wpacu_setting_value' : wpacuSettingValue,
                        'time_r'              : new Date().getTime(),
                        'wpacu_nonce'         : wpacu_object.wpacu_update_plugin_setting_nonce
                    }, function (response) {
                        if (response === 'DONE') {
                            $(wpacuSpinnerElId).addClass('wpacu_hide');
                        }
                    });

                    if ( ! $(this).prop('checked') ) {
                        $('#wpacu-plugins-load-manager-wrap').addClass('wpacu-area-disabled');
                    } else {
                        $('#wpacu-plugins-load-manager-wrap').removeClass('wpacu-area-disabled');
                    }
                });

                // Plugin: Load it (default)
                $('.wpacu_plugin_load_it').on('click', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    if ($(this).prop('checked')) {
                        // Hide load exception area
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);

                        // Hide unload via RegEx input (if shown)
                        $('.wpacu_plugin_unload_regex_input_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .addClass('wpacu_hide');

                        // Remove class for unload site-wide & unload via RegEx
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                        $('.wpacu_plugin_unload_regex_option[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    }
                });

                // Plugin: Unload site-wide (everywhere)
                $('.wpacu_plugin_unload_site_wide').on('click', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');
                        // Remove highlight for unload on the home page
                        $('.wpacu_plugin_unload_home_page[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Remove highlight for unload via post type
                        $('.wpacu_plugin_unload_via_post_type[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Remove highlight for unload via tax
                        $('.wpacu_plugin_unload_via_tax[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Remove highlight for unload via archive
                        $('.wpacu_plugin_unload_via_archive[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Remove highlight for unload logged-in via role
                        $('.wpacu_plugin_unload_logged_in_via_role[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Remove highlight for unload via RegEx
                        $('.wpacu_plugin_unload_regex_option[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide unload if user is logged-in (if shown)
                        $('.wpacu_plugin_unload_logged_in[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide unload via post type drop-down (if shown)
                        $('.wpacu_plugin_unload_via_post_type_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .addClass('wpacu_hide');

                        // Hide unload via RegEx input (if shown)
                        $('.wpacu_plugin_unload_regex_input_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .addClass('wpacu_hide');

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);
                    } else {
                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                $('.wpacu_plugin_unload_home_page').on('click', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Unload it for URLs with request URI matching a RegEx
                $('.wpacu_plugin_unload_regex_option').on('click', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');
                        // Show unload via RegEx Input
                        $('.wpacu_plugin_unload_regex_input_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').removeClass('wpacu_hide');

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        // Hide unload via RegEx Input
                        $('.wpacu_plugin_unload_regex_input_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').addClass('wpacu_hide');

                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Unload in all pages that belong to the following post types
                $('.wpacu_plugin_unload_via_post_type').on('click change', function () {
                    let wpacuPluginPath  = $(this).attr('data-wpacu-plugin-path');
                    let $ddPostTypesWrap = $('.wpacu_plugin_unload_via_post_type_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');

                        // Show unload via post types drop-down
                        $ddPostTypesWrap.removeClass('wpacu_hide');

                        let $ddPostTypesSelect = $ddPostTypesWrap.find('select');

                        if ($ddPostTypesSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddPostTypesSelect.chosen({'width': '100%'});
                        }

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        // Hide unload via post type
                        $ddPostTypesWrap.addClass('wpacu_hide');

                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Unload in all pages that belong to the following page types
                $('.wpacu_plugin_unload_via_tax').on('click change', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');
                    let $ddTaxWrap      = $('.wpacu_plugin_unload_via_tax_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');
                    //console.log($ddTaxWrap);

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');

                        // Show unload via post types drop-down
                        $ddTaxWrap.removeClass('wpacu_hide');

                        let $ddTaxSelect = $ddTaxWrap.find('select');

                        if ($ddTaxSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddTaxSelect.chosen({'width': '100%'});
                        }

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        // Hide unload via tax input
                        $ddTaxWrap.addClass('wpacu_hide');

                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Unload in all pages that belong to the following archive types
                $('.wpacu_plugin_unload_via_archive').on('click change', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');
                    let $ddArchiveWrap  = $('.wpacu_plugin_unload_via_archive_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');

                        // Show unload via archive types
                        $ddArchiveWrap.removeClass('wpacu_hide');

                        let $ddArchiveSelect = $ddArchiveWrap.find('select');

                        if ($ddArchiveSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddArchiveSelect.chosen({'width': '100%'});
                        }

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        // Hide unload via archive input
                        $ddArchiveWrap.addClass('wpacu_hide');

                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Unload it if the user is logged in
                $('.wpacu_plugin_unload_logged_in').on('click', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    if ($(this).prop('checked')) {
                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Unload if the user is logged-in and has the specified role(s)
                $('.wpacu_plugin_unload_logged_in_via_role').on('click change', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');
                    let $ddRolesWrap    = $('.wpacu_plugin_unload_logged_in_via_role_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        $(this).parent('label').addClass('wpacu_plugin_unload_rule_input_checked');

                        // Show unload via roles list
                        $ddRolesWrap.removeClass('wpacu_hide');

                        let $ddRolesSelect = $ddRolesWrap.find('select');

                        if ($ddRolesSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddRolesSelect.chosen({'width': '100%'});
                        }

                        // Show load exception area
                        $.fn.wpAssetCleanUpPro().showPluginLoadExceptionArea(wpacuPluginPath);

                        // Uncheck Site-Wide Rule
                        $('.wpacu_plugin_unload_site_wide[data-wpacu-plugin-path="' + wpacuPluginPath + '"]')
                            .prop('checked', false)
                            .parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');
                    } else {
                        // Hide unload logged-in via role drop-down area
                        $ddRolesWrap.addClass('wpacu_hide');

                        $(this).parent('label').removeClass('wpacu_plugin_unload_rule_input_checked');

                        // Hide load exception area (if no other unload rules are set)
                        $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                    }
                });

                // Plugin: Make exception to load via RegEx (clicked)
                $('.wpacu_plugin_load_exception_regex_option').on('click', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    if ($(this).prop('checked')) {
                        $('.wpacu_load_regex_input_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').removeClass('wpacu_hide');
                    } else {
                        $('.wpacu_load_regex_input_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').addClass('wpacu_hide');
                    }
                });

                // Plugin: Make exception to load it via post type
                $('.wpacu_plugin_load_via_post_type').on('click change', function () {
                    let wpacuPluginPath  = $(this).attr('data-wpacu-plugin-path');
                    let $ddPostTypesWrap = $('.wpacu_plugin_load_via_post_type_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        // Show unload via post types drop-down
                        $ddPostTypesWrap.removeClass('wpacu_hide');

                        let $ddPostTypesSelect = $ddPostTypesWrap.find('select');

                        if ($ddPostTypesSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddPostTypesSelect.chosen({'width': '100%'});
                        }
                    } else {
                        $ddPostTypesWrap.addClass('wpacu_hide');
                    }
                });

                // Plugin: Make exception to load it via taxonomy
                $('.wpacu_plugin_load_via_tax').on('click change', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');
                    let $ddTaxWrap      = $('.wpacu_plugin_load_via_tax_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        // Show unload via post types drop-down
                        $ddTaxWrap.removeClass('wpacu_hide');

                        let $ddTaxSelect = $ddTaxWrap.find('select');

                        if ($ddTaxSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddTaxSelect.chosen({'width': '100%'});
                        }
                    } else {
                        $ddTaxWrap.addClass('wpacu_hide');
                    }
                });

                // Plugin: Make exception to load it via archive page type
                $('.wpacu_plugin_load_via_archive').on('click change', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');
                    let $ddArchiveWrap  = $('.wpacu_plugin_load_via_archive_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        // Show unload via post types drop-down
                        $ddArchiveWrap.removeClass('wpacu_hide');

                        let $ddArchiveSelect = $ddArchiveWrap.find('select');

                        if ($ddArchiveSelect.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddArchiveSelect.chosen({'width': '100%'});
                        }
                    } else {
                        $ddArchiveWrap.addClass('wpacu_hide');
                    }
                });

                // Plugin: Make exception to load it via the user role
                $('.wpacu_plugin_load_logged_in_via_role').on('click change', function () {
                    let wpacuPluginPath = $(this).attr('data-wpacu-plugin-path');

                    // WRAP OF "SELECT" element
                    let $ddRolesWrap = $('.wpacu_plugin_load_logged_in_via_role_select_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]');

                    if ($(this).prop('checked')) {
                        // Show unload logged-in via role drop-down
                        $ddRolesWrap.removeClass('wpacu_hide');

                        // "SELECT" element
                        let $ddRoles = $ddRolesWrap.find('select');

                        if ($ddRoles.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $ddRoles.chosen({'width': '100%'});
                        }
                    } else {
                        $ddRolesWrap.addClass('wpacu_hide');
                    }
                });

                // This is related to alerts
                $(document).on('wpacu_plugin_row_show_hide_load_exceptions_area', function(e, wpacuPluginPath) {
                    $.fn.wpAssetCleanUpPro().hidePluginLoadExceptionArea(wpacuPluginPath);
                });

                /* [START] Contract/Expand All Plugins From An Area (e.g. with active unload rules) */
                $('.wpacu_plugins_groups_change_state_area').on('click', '.wpacu_plugins_contract_expand_all', function() {
                    let $currentClickedElement = $(this);

                    $currentClickedElement.prop('disabled', true);
                    $currentClickedElement.find('.wpacu_ajax_loader').removeClass('wpacu_hide'); // show the loading spinner after click

                    let targetedArea = $(this).attr('data-wpacu-for-area');
                    let managePluginsInArea = (($('#wpacu-plugins-load-manager-wrap').attr('data-wpacu-sub-page-area') === 'manage_plugins_front') ? 'front' : 'dash');

                    let newPluginAreaState = 'expanded'; // default

                    let wpacuAllAreaPlugins = [];

                    if ($(this).hasClass('wpacu_plugins_contract_all')) {
                        newPluginAreaState = 'contracted';
                    }

                    let $areaWrap = $('table[data-wpacu-area="'+ targetedArea +'"');

                    $areaWrap.find('.wpacu_plugin_details').each(function(index, value) {
                        $(this).find('.wpacu_plugin_expand_contract_area').find('button').prop('disabled', true);
                        $(this).find('.wpacu_ajax_loader').removeClass('wpacu_hide'); // Show the loading spinner for each plugin from the area

                        wpacuAllAreaPlugins[index] = $(this).attr('data-wpacu-plugin-path');
                    }).attr('data-wpacu-status-area', newPluginAreaState);

                    if (newPluginAreaState === 'expanded') {
                        let $maybeChosenSelects = $areaWrap.find('.wpacu_plugin_details').find('.wpacu_chosen_select');

                        if ($maybeChosenSelects.length > 0) {
                            $maybeChosenSelects.chosen('destroy').chosen({'width': 'auto'});
                        }

                        $.fn.wpAssetCleanUp().wpacuTriggerAdjustTextAreaHeightAllTextareas();
                    }

                    $.fn.wpAssetCleanUpPro().wpacuAjaxUpdateAllAreaPluginsRowState(newPluginAreaState, wpacuAllAreaPlugins, managePluginsInArea, $areaWrap, $currentClickedElement);
                });
                /* [END] Contract/Expand All Plugins From An Area (e.g. with active unload rules) */

                /* [START] Contract/Expand SPECIFIC Plugin From An Area (e.g. with active unload rules) */
                $('.wpacu_plugin_expand_contract_area').on('click', 'button', function() {
                    let $currentClickedElement = $(this);

                    $currentClickedElement.prop('disabled', true);
                    $currentClickedElement.find('.wpacu_ajax_loader').removeClass('wpacu_hide'); // show the loading spinner after click

                    let $pluginMainArea = $currentClickedElement.parent().parent().parent(),
                        wpacuPluginPath = $pluginMainArea.find('.wpacu_plugin_unload_rules_options_wrap').attr('data-wpacu-plugin-path'),
                        wpacuPluginArea = (($('#wpacu-plugins-load-manager-wrap').attr('data-wpacu-sub-page-area') === 'manage_plugins_front') ? 'front' : 'dash'),
                        wpacuNewPluginRowState; // to be detected below

                    if ($pluginMainArea.attr('data-wpacu-status-area') === 'expanded') {
                        $pluginMainArea.attr('data-wpacu-status-area', 'contracted');
                        wpacuNewPluginRowState = 'contracted';
                    } else if ($pluginMainArea.attr('data-wpacu-status-area') === 'contracted') {
                        $pluginMainArea.attr('data-wpacu-status-area', 'expanded');
                        wpacuNewPluginRowState = 'expanded';
                    }

                    if (wpacuNewPluginRowState === 'expanded') {
                        let $maybeChosenSelect = $pluginMainArea.find('.wpacu_chosen_select');

                        if ($maybeChosenSelect.length > 0) {
                            $maybeChosenSelect.chosen('destroy').chosen({'width': '100%'});
                        }

                        $.fn.wpAssetCleanUp().wpacuTriggerAdjustTextAreaHeightAllTextareas();
                    }

                    // AJAX Call here to remember the state for this plugin
                    $.fn.wpAssetCleanUpPro().wpacuAjaxUpdateKeepThePluginRowState(wpacuNewPluginRowState, wpacuPluginPath, wpacuPluginArea, $currentClickedElement);
                });
                /* [END] Contract/Expand SPECIFIC Plugin From An Area (e.g. with active unload rules) */
            },

            wpacuAjaxUpdateKeepThePluginRowState: function(newState, pluginPath, pluginArea, $currentClickedElement) {
                let dataUpdateSetting = {
                    'action'                        : wpacu_object.plugin_prefix + '_update_plugin_row_state',
                    'wpacu_update_plugin_row_state' : 'yes',
                    'wpacu_plugin_row_state'        : newState, // "expanded" or "contracted"
                    'wpacu_plugin_path'             : pluginPath,
                    'wpacu_manage_plugins_in_area'  : pluginArea,
                    'time_r'                        : new Date().getTime(), // avoid any caching
                    'wpacu_nonce'                   : wpacu_object.wpacu_update_plugin_row_state_nonce
                };

                $.post(wpacu_object.ajax_url, dataUpdateSetting, function (response) {
                    $currentClickedElement.prop('disabled', false)
                                          .find('.wpacu_ajax_loader').addClass('wpacu_hide');

                    console.log(response);
                });
            },

            // This triggers when all the assets from a plugin are expanded or contracted
            wpacuAjaxUpdateAllAreaPluginsRowState: function(newState, plugins, managePluginsInArea, $areaWrap, $currentClickedElement) {
                let dataUpdateSetting = {
                    'action'                              : wpacu_object.plugin_prefix + '_update_plugins_row_state_in_area',
                    'wpacu_area_update_plugins_row_state' : 'yes',
                    'wpacu_area_plugins_row_state'        : newState, // "expanded" or "contracted"
                    'wpacu_area_plugins'                  : plugins,
                    'wpacu_manage_plugins_in_area'        : managePluginsInArea,
                    'time_r'                              : new Date().getTime(), // avoid any caching
                    'wpacu_nonce'                         : wpacu_object.wpacu_area_update_plugins_row_state_nonce
                };

                $.post(wpacu_object.ajax_url, dataUpdateSetting, function (response) {
                    $currentClickedElement.prop('disabled', false)
                                          .find('.wpacu_ajax_loader').addClass('wpacu_hide');

                    $areaWrap.find('.wpacu_plugin_details').each(function(index, value) {
                        $(this).find('.wpacu_plugin_expand_contract_area').find('button').prop('disabled', false);
                        $(this).find('.wpacu_ajax_loader').addClass('wpacu_hide'); // Remove the loading spinner for each plugin from the area
                    });

                    console.log(response);
                });
            },

            showPluginLoadExceptionArea: function (wpacuPluginPath) {
                $('.wpacu_plugin_load_exception_options_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').removeClass('wpacu_hide')
                    .find('input[type="checkbox"]').prop('disabled', false);
            },
            hidePluginLoadExceptionArea: function (wpacuPluginPath) {
                // Hide load exception area (if no other unload rules are set)
                let $anyUnloadRuleChecked = $('.wpacu_plugin_unload_rules_options_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').find('input:checked');

                if ($anyUnloadRuleChecked.length < 1) {
                    $('.wpacu_plugin_load_exception_options_wrap[data-wpacu-plugin-path="' + wpacuPluginPath + '"]').addClass('wpacu_hide')
                        .find('input[type="checkbox"]').prop('disabled', true);
                }
            },

            wpacuTriggerChosenForTaxDd: function() {
                if ($('.wpacu_chosen_select').length > 0 && typeof $.fn.chosen !== 'undefined') {
                    // e.g. for drop-downs such as "Unload CSS on all WooCommerce "Product" pages when the taxonomy (e.g. Category, Tag) has a certain value"
                    $('.wpacu_chosen_select.wpacu_manage_via_tax_dd').chosen({'width':'100%'});

                    // make sure the rest of the chosen drop-downs have the default settings
                    $('.wpacu_chosen_select:not(.wpacu_manage_via_tax_dd)').chosen();
                }
            },

            wpacuAjaxLoadAllSetTermsForPostType: function($termsDd, $parentLi) {
                //console.log($termsDd);

                let fetchFor = 'unload'; // default

                if ($termsDd.hasClass('wpacu_load_via_tax_dd')) {
                    fetchFor = 'load_exception';
                }

                let loadData = {
                    'action'            : wpacu_object.plugin_prefix + '_load_all_set_terms_for_post_type',
                    'wpacu_post_type'   : wpacu_object.current_post_type,
                    'wpacu_handle'      : $termsDd.attr('data-handle'),
                    'wpacu_asset_type'  : $termsDd.attr('data-handle-for'),
                    'wpacu_for'         : fetchFor,
                    'time_r'            : new Date().getTime(), // avoid any caching
                    'wpacu_nonce'       : wpacu_object.wpacu_ajax_get_post_type_terms_nonce
                };

                $.post(wpacu_object.ajax_url, loadData, function (response) {
                    $termsDd.html(response);

                    setTimeout(function() {
                        if ($termsDd.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            $termsDd.chosen({'width': '100%'});
                        }

                        $termsDd.parent().parent().next('div[data-wpacu-tax-terms-options-loader]').hide();

                        $termsDd.prop('disabled', false) // mark it as enabled
                            .focus() // focus on it
                            .removeClass('wpacu_disabled');

                        $parentLi.find('.wpacu_handle_manage_via_tax_input_wrap')
                            .removeClass('wpacu_hide'); // Show the input area

                        if ($termsDd.hasClass('wpacu_chosen_can_be_later_enabled')) {
                            // Focus on it to avoid an extra click
                            $termsDd.trigger('chosen:open');
                        }
                    }, 200);
                });
            }
        }
    }
})(jQuery);

jQuery(document).ready(function($) {
    $.fn.wpAssetCleanUpBulkChangesAreaPro = function() {
        return {
            actions: function() {
                $(document).on('change', '#wpacu_taxonomy_select', function() {
                    $('#wpacu_taxonomy_form').trigger('submit');
                });

                // "RegEx Unloads"
                $(document).on('click', '.wpacu_remove_regex', function() {
                    let $wpacuRegExRuleRow = $(this).parents('.wpacu_regex_rule_row');

                    if ($(this).prop('checked')) {
                        $wpacuRegExRuleRow.addClass('wpacu_enabled');
                    } else {
                        $wpacuRegExRuleRow.removeClass('wpacu_enabled');
                    }
                });

                // "Updated CSS/JS positions"
                $(document).on('click', '.wpacu_restore_position', function() {
                    let $wpacuRestorePositionRow = $(this).parents('.wpacu_restore_position_row');

                    if ($(this).prop('checked')) {
                        $wpacuRestorePositionRow.addClass('wpacu_selected');
                    } else {
                        $wpacuRestorePositionRow.removeClass('wpacu_selected');
                    }
                });

                // "Defer & Async used on all pages"
                $(document).on('click', '.wpacu_remove_global_attr', function() {
                    let $wpacuRemoveGlobalAttrRow = $(this).parents('.wpacu_remove_global_attr_row');

                    if ($(this).prop('checked')) {
                        $wpacuRemoveGlobalAttrRow.addClass('wpacu_selected');
                    } else {
                        $wpacuRemoveGlobalAttrRow.removeClass('wpacu_selected');
                    }
                });
            }
        }
    }
    $.fn.wpAssetCleanUpBulkChangesAreaPro().actions();

    $.fn.wpAssetCleanUpPro().initPluginLoadManager();

    /*
     * [START] License Area
     */
    $.fn.wpAssetCleanUpLicenseArea = function() {
        return {
            actions: function () {
                $(document).on('click', '#wpacu-mark-license-valid-button', function() {
                    return confirm(wpacu_object.mark_license_valid_confirm);
                });

                $(document).on('submit', '#wpacu-license-form', function() {
                    // Activate
                    $('#wpacu_license_activate_btn').attr('disabled', 'disabled');

                    // Deactivate
                    $('#wpacu_license_deactivate_btn').attr('disabled', 'disabled');

                    $('.wpacu-license-spinner').show();
                });
            }
        }
    }
    $.fn.wpAssetCleanUpLicenseArea().actions();
    /*
     * [END] License Area
     */
});

/**
 * [END] Pro features
 */
//
// [START] Core file
//
(function($) {
    $.fn.wpAssetCleanUp = function() {
        let metaBoxContent = '#wpacu_meta_box_content';

        return {
            cssJsManagerActions: function () {
                // [wpacu_pro]
                // Trigger any Pro actions
                if (wpacu_object.plugin_slug === 'wp-asset-clean-up-pro') { $.fn.wpAssetCleanUpPro().cssJsManagerActions(); }
                // [/wpacu_pro]

                let cbSelector = '.input-unload-on-this-page',
                    cbSelectorNotLocked = '.input-unload-on-this-page.wpacu-not-locked',
                    cbSelectorMakeExceptionOnPage = '.wpacu_load_it_option_one.wpacu_load_exception',
                    handle, handleFor, $targetedAssetRow;

                // live() is deprecated and if used and jQuery Migrate is disabled
                // it could break the website's front-end functionality
                $(document).on('click change', cbSelector, function (event) {
                    handle = $(this).attr('data-handle');
                    handleFor = $(this).hasClass('wpacu_unload_rule_for_style') ? 'style' : 'script';

                    if ($(this).prop('checked')) {
                        if (event.type === 'click' && (! $.fn.wpAssetCleanUp().triggerAlertWhenAnyUnloadRuleIsChosen(handle, handleFor))) {
                            return false;
                        }

                        $.fn.wpAssetCleanUp().uncheckAllOtherBulkUnloadRules($(this), false); // skip Unload via RegEx as both can be used

                        // Show load exceptions area (for exceptions like load it if the user is logged in)
                        $.fn.wpAssetCleanUp().showHandleLoadExceptionArea(handleFor, handle);
                        $(this).closest('tr').addClass('wpacu_not_load');
                    } else {
                        $(this).closest('tr').removeClass('wpacu_not_load');
                        $targetedAssetRow = $(this).parents('.wpacu_asset_row');
                        $.fn.wpAssetCleanUp().hideHandleLoadExceptionArea($targetedAssetRow, handle, handleFor);
                    }
                });

                /*
                 * [Start] Unload on this page
                 */
                // Check All
                $('.wpacu-area-check-all').on('click', function (e) {
                    e.preventDefault();

                    let wpacuPluginTarget = $(this).attr('data-wpacu-plugin');
                    //console.log(wpacuPluginTarget);

                    $('table.wpacu_list_by_location[data-wpacu-plugin="' + wpacuPluginTarget + '"]')
                        .find(cbSelectorNotLocked)
                        .prop('checked', true).closest('tr').addClass('wpacu_not_load');
                });

                // Uncheck All
                $('.wpacu-area-uncheck-all').on('click', function (e) {
                    e.preventDefault();

                    let wpacuPluginTarget = $(this).attr('data-wpacu-plugin');

                    $('table.wpacu_list_by_location[data-wpacu-plugin="' + wpacuPluginTarget + '"]')
                        .find(cbSelectorNotLocked)
                        .prop('checked', false).closest('tr').removeClass('wpacu_not_load');
                });
                /*
                 * [End] Unload on this page
                 */

                /*
                * [Start] Make exception, Load it on this page
                */
                // Check All
                $('.wpacu-area-check-load-all').on('click change', function (e) {
                    e.preventDefault();

                    let wpacuPluginTarget = $(this).attr('data-wpacu-plugin');
                    let $wpacuPluginList = $('table.wpacu_list_by_location[data-wpacu-plugin="' + wpacuPluginTarget + '"]');

                    $wpacuPluginList
                        .find(cbSelectorMakeExceptionOnPage)
                        .prop('checked', true).closest('tr.wpacu_is_bulk_unloaded').removeClass('wpacu_not_load');

                    $wpacuPluginList.find(cbSelectorNotLocked).prop('checked', false).trigger('change');
                });

                // Uncheck All
                $('.wpacu-area-uncheck-load-all').on('click change', function (e) {
                    e.preventDefault();

                    let wpacuPluginTarget = $(this).attr('data-wpacu-plugin');
                    let $wpacuPluginList = $('table.wpacu_list_by_location[data-wpacu-plugin="' + wpacuPluginTarget + '"]');

                    $wpacuPluginList
                        .find(cbSelectorMakeExceptionOnPage)
                        .prop('checked', false).closest('tr.wpacu_is_bulk_unloaded').addClass('wpacu_not_load');

                    $wpacuPluginList.find(cbSelectorNotLocked).prop('checked', false).trigger('change');
                });
                /*
                * [End] Make exception, Load it on this page
                */

                $(document).on('click', '.wpacu_keep_bulk_rule', function () {
                    if ($(this).prop('checked')) {
                        $(this).parents('li').next().removeClass('remove_rule');
                    }
                });

                $(document).on('click', '.wpacu_remove_bulk_rule', function () {
                    if ($(this).prop('checked')) {
                        $(this).parents('li').addClass('remove_rule');
                    }
                });

                // Unload on All Pages of post/page/custom post type / site-wide (everywhere) / based on taxonomy
                $(document).on('change', '.wpacu_bulk_unload', function (event) {
                    // [wpacu_pro]
                    let $mainThis = $(this);
                    // [/wpacu_pro]
                    handle = $(this).attr('data-handle');
                    handleFor = $(this).attr('data-handle-for'); // 'style' or 'script' (e.g. 'contact-form-7' has the same name for both)
                    $targetedAssetRow = $('[data-' + handleFor + '-handle-row="' + handle + '"]');

                    let $parentLi = $(this).parents('li');

                    /**************************************************************
                     * STATE 1: The checkbox IS CHECKED (show multiple drop-down)
                     * ************************************************************
                     */
                    if ($(this).prop('checked')) {
                        if (event.type === 'click' && (! $.fn.wpAssetCleanUp().triggerAlertWhenAnyUnloadRuleIsChosen(handle, handleFor))) {
                            return false;
                        }

                        if ($(this).hasClass('wpacu_global_unload') ||
                            $(this).hasClass('wpacu_post_type_unload')
                            // [wpacu_pro]
                            || $(this).hasClass('wpacu_taxonomy_unload')
                            // [/wpacu_pro]
                        ) {
                            /*
                             * Clicked: "Unload site-wide" (.wpacu_global_unload) or "Unload on all posts of the same [post_type]" (.wpacu_post_type_unload)
                             */
                            $(this).parent('label').addClass('wpacu_input_load_checked');
                            $(this).closest('tr').addClass('wpacu_not_load');
                        }

                        // [wpacu_pro]
                        if ($(this).hasClass('wpacu_unload_it_regex_checkbox')) {
                            /*
                             * "Unload via RegEx" is clicked
                             */
                            $parentLi.find('label').addClass('wpacu_unload_checked');
                            $parentLi.find('textarea')
                                .prop('disabled', false) // mark it as enabled
                                .focus() // focus on it
                                .removeClass('wpacu_disabled');
                            $parentLi.find('.wpacu_handle_unload_regex_input_wrap')
                                .removeClass('wpacu_hide'); // Show the input area
                        } else if ($(this).hasClass('wpacu_unload_it_via_tax_checkbox')) {
                            /*
                             * "Unload via Taxonomy" is clicked
                             */
                            var $termsDd = $parentLi.find('select');

                            $termsDd.on('chosen:hiding_dropdown change', function (evt, params) {
                                //console.log($termsDd.val());
                                if ($termsDd.val() === '[]' || $termsDd.val() === '' || $termsDd.val().length === 0) {
                                    //console.log($termsDd.val());
                                    $mainThis.prop('checked', false).trigger('change');
                                }
                            });

                            $parentLi.find('label').addClass('wpacu_unload_checked');

                            if ($termsDd.html() === '') {
                                $termsDd.parent().parent().next('div[data-wpacu-tax-terms-options-loader]').show();
                                // Load the drop-down (while keeping it hidden and showing a preloader image)
                                // and then show the area when it's done and remove the preloader image

                                console.log(event);

                                $.fn.wpAssetCleanUpPro().wpacuAjaxLoadAllSetTermsForPostType($termsDd, $parentLi);
                            } else {
                                // The options were already loaded (no more preloading needed)
                                $termsDd.prop('disabled', false) // mark it as enabled
                                    .focus() // focus on it
                                    .removeClass('wpacu_disabled');

                                $parentLi.find('.wpacu_handle_unload_via_tax_input_wrap')
                                    .removeClass('wpacu_hide'); // Show the input area
                            }
                        }
                        // [/wpacu_pro]

                        // Show load exceptions area if Unload everywhere or other bulk unload rule is chosen
                        $.fn.wpAssetCleanUp().showHandleLoadExceptionArea(handleFor, handle);

                        if ($(this).hasClass('wpacu_global_unload')) {
                            // CSS/JS: Unload Site-Wide (Everywhere) was clicked
                            $.fn.wpAssetCleanUp().uncheckAllOtherBulkUnloadRules($(this), true);

                            // Obviously, "Unload on this page" should be unchecked as the rule overwrites it
                            $('.input-unload-on-this-page[data-handle-for="' + handleFor + '"][data-handle="' + handle + '"]')
                                .prop('checked', false);

                        } else if ($(this).hasClass('wpacu_post_type_unload')) {
                            // Unload on All Pages of "[post_type_here]" post type
                            $.fn.wpAssetCleanUp().uncheckAllOtherBulkUnloadRules($(this), false);

                            // Obviously, "Unload on this page" should be unchecked as the rule overwrites it
                            $('.input-unload-on-this-page[data-handle-for="' + handleFor + '"][data-handle="' + handle + '"]')
                                .prop('checked', false);
                        }
                        //wpAssetCleanUp.uncheckAllOtherBulkUnloadRules($(this));
                        //$(this).closest('tr').find('.wpacu_remove_site_wide_rule').prop('checked', true);
                    } else {
                        /***********************************************************************************
                         * STATE 2: The checkbox IS UNCHECKED / UNMARKED (the multiple drop-down is hidden)
                         ***********************************************************************************
                         */
                        if (!$(this).hasClass('wpacu_unload_it_regex_checkbox') && !$(this).hasClass('wpacu_unload_it_via_tax_checkbox')) {
                            /*
                             * Clicked: "Unload site-wide" or "Unload on all posts of the same [post_type]"
                             */
                            $(this).parent('label').removeClass('wpacu_input_load_checked');
                            $(this).closest('tr').removeClass('wpacu_not_load');
                        } else if ($(this).hasClass('wpacu_unload_it_regex_checkbox')) {
                            /*
                             * "Unload via RegEx" is clicked
                             */
                            $parentLi.find('label').removeClass('wpacu_unload_checked');
                            $parentLi.find('textarea')
                                .blur() // lose focus
                                .addClass('wpacu_disabled');

                            // Action taken if the input has no value
                            if ($parentLi.find('textarea').val().trim() === '') {
                                $parentLi.find('textarea')
                                    .prop('disabled', true).val(''); // unchecked with no value added to the input

                                $parentLi.find('.wpacu_handle_unload_regex_input_wrap')
                                    .addClass('wpacu_hide'); // Hide the input area
                            }
                        } else if ($(this).hasClass('wpacu_unload_it_via_tax_checkbox')) {
                            /*
                             * "Unload via taxonomy" is clicked
                             */
                            $parentLi.find('label').removeClass('wpacu_unload_checked');
                            /*
                            $parentLi.find('select')
                                .blur() // lose focus
                                .addClass('wpacu_disabled');
                            */
                            //$parentLi.find('select').prop('disabled', true).val(''); // unchecked with no value added to the input
                            $parentLi.find('.wpacu_handle_unload_via_tax_input_wrap').addClass('wpacu_hide'); // Hide the input area
                        }

                        // [wpacu_lite]
                        // If it's NOT already unloaded (on page load)
                        // All bulk unloads are unchecked
                        // Then HIDE make exceptions area
                        $.fn.wpAssetCleanUp().hideHandleLoadExceptionArea($targetedAssetRow, handle, handleFor);
                        // [/wpacu_lite]
                    }

                    // No bulk rule already applied (red background) and none of the bulk unloads (except RegEx) checkboxes are checked
                    if (!$targetedAssetRow.hasClass('wpacu_is_bulk_unloaded') && !$('.wpacu_bulk_unload:not(.wpacu_unload_it_regex_checkbox)').is(':checked')) {
                        $(this).closest('tr').removeClass('wpacu_not_load');
                    }
                });

                // Load it on this page
                $(document).on(
                    'click change', // when these actions are taken
                    cbSelectorMakeExceptionOnPage + ',' + '.wpacu_load_it_option_post_type', // on these elements
                    function () { // trigger the following function
                        let handle = $(this).attr('data-handle');

                        if ($(this).prop('checked')) {
                            $(this).parent('label').addClass('wpacu_global_unload_exception');

                            // Uncheck "Unload on this page" as it's not relevant anymore
                            let asset_type = '';

                            if ($(this).hasClass('wpacu_style')) {
                                asset_type = 'style';
                            } else if ($(this).hasClass('wpacu_script')) {
                                asset_type = 'script';
                            }

                            $('#' + asset_type + '_' + handle).prop('checked', false).trigger('change');
                        } else {
                            $(this).parent('label').removeClass('wpacu_global_unload_exception');
                        }
                    }
                );

                // Handle Notes
                $(document).on('click', '.wpacu-add-handle-note', function (e) {
                    e.preventDefault();

                    let wpacuHandle = $(this).attr('data-handle'), $wpacuNotesFieldArea, $wpacuNoteInput;

                    if ($(this).hasClass('wpacu-for-script')) {
                        $wpacuNotesFieldArea = $('.wpacu-handle-notes-field[data-script-handle="' + wpacuHandle + '"]');
                    } else if ($(this).hasClass('wpacu-for-style')) {
                        $wpacuNotesFieldArea = $('.wpacu-handle-notes-field[data-style-handle="' + wpacuHandle + '"]');
                    }

                    if ($wpacuNotesFieldArea.length < 1) {
                        return;
                    }

                    $wpacuNoteInput = $wpacuNotesFieldArea.find(':input');

                    if ($wpacuNotesFieldArea.is(':hidden')) {
                        // When "Add Note" is clicked, mark the textarea as visible and not disabled
                        $wpacuNotesFieldArea.show();
                        $wpacuNoteInput.prop('disabled', false);
                    } else {
                        $wpacuNotesFieldArea.hide();

                        // Was the area hidden without any textarea value and the value was null on page load?
                        // Mark it as disabled (save total sent inputs for PHP processing)
                        // If there's ONLY space added (could be by mistake) to the textarea, ignore it as it's irrelevant
                        if ($wpacuNoteInput.val().trim() === '' && $wpacuNoteInput.attr('data-wpacu-is-empty-on-page-load') === 'true') {
                            $wpacuNoteInput.prop('disabled', true).val('');
                        }
                    }
                });

                // [Get external asset size]
                $(document).on('click', '.wpacu-external-file-size', function (e) {
                    e.preventDefault();

                    let $wpacuCurrentTarget = $(this),
                        $wpacuFileSizeArea,
                        wpacuRemoteFile = $wpacuCurrentTarget.attr('data-src');

                    $wpacuCurrentTarget.hide();

                    $wpacuFileSizeArea = $wpacuCurrentTarget.next();
                    $wpacuFileSizeArea.show();

                    if (wpacuRemoteFile.includes('/?')) { // Dynamic CSS/JS
                        $.get(wpacuRemoteFile, {}, function (output, textStatus, request) {
                            if (textStatus !== 'success') {
                                return 'N/A';
                            }

                            $wpacuFileSizeArea.html($.fn.wpAssetCleanUp().wpacuBytesToSize(output.length));
                        });
                    } else {
                        $.post(wpacu_object.ajax_url, {
                            'action':             wpacu_object.plugin_prefix + '_get_external_file_size',
                            'wpacu_remote_file':  wpacuRemoteFile,
                            'wpacu_nonce':        wpacu_object.wpacu_ajax_check_remote_file_size_nonce
                        }, function (size) {
                            $wpacuFileSizeArea.html(size);
                        });
                    }
                });
                // [/Get external asset size]

                // Note: Starting from July 24, 2021, AJAX is used to save the state
                $(document).on('click', '.wpacu_handle_row_expand_contract', function (e) {
                    e.preventDefault();

                    let wpacuAssetHandle = $(this).attr('data-wpacu-handle'),
                        wpacuAssetHandleFor = $(this).attr('data-wpacu-handle-for'),
                        wpacuNewAssetRowState;

                    if ($(this).find('span').hasClass('dashicons-minus')) {
                        /*
                         * Already expanded when clicked (had minus sign)
                         */
                        wpacuNewAssetRowState = 'contracted';

                        $(this).parents('td').attr('data-wpacu-row-status', wpacuNewAssetRowState)
                            .find('.wpacu_handle_row_expanded_area').addClass('wpacu_hide');
                        $(this).find('span').removeClass('dashicons-minus').addClass('dashicons-plus');

                        } else if ($(this).find('span').hasClass('dashicons-plus')) {
                        /*
                         * Already contracted when clicked (had plus sign)
                         */
                        wpacuNewAssetRowState = 'expanded';

                        $(this).parents('td').attr('data-wpacu-row-status', wpacuNewAssetRowState).find('.wpacu_handle_row_expanded_area').removeClass('wpacu_hide');
                        $(this).find('span').removeClass('dashicons-plus').addClass('dashicons-minus');

                        }

                    $.fn.wpAssetCleanUp().wpacuAjaxUpdateKeepTheAssetRowState(wpacuNewAssetRowState, wpacuAssetHandle, wpacuAssetHandleFor, $(this));
                });

                $(document).on('click', '.wpacu_area_handles_row_expand_contract', function (e) {
                    e.preventDefault();

                    let wpacuAreaName = $(this).attr('data-wpacu-area'),
                        wpacuNewAreaAssetsRowState,
                        wpacuAllAreaHandles = [],
                        $areaWrap = $('table.wpacu_list_table[data-wpacu-area="'+ wpacuAreaName +'"]');

                    if ($(this).hasClass('wpacu-area-contract-all-assets')) {
                        wpacuNewAreaAssetsRowState = 'contracted';
                    } else if ($(this).hasClass('wpacu-area-expand-all-assets')) {
                        wpacuNewAreaAssetsRowState = 'expanded';
                    }

                    // Get all plugin / area handles and wrap them in a list together with their type ("style" or "script")
                    $areaWrap.find('tr.wpacu_asset_row').each(function(index, value) {
                        var handleStyleAttr  = $(this).attr('data-style-handle-row');
                        var handleScriptAttr = $(this).attr('data-script-handle-row');

                        if (typeof handleStyleAttr !== 'undefined' && handleStyleAttr !== false) {
                            wpacuAllAreaHandles[index] = handleStyleAttr + '_style';
                        } else if (typeof handleScriptAttr !== 'undefined' && handleScriptAttr !== false) {
                            wpacuAllAreaHandles[index] = handleScriptAttr + '_script';
                        }

                        var $tdAssetRow = $(this).find('td[data-wpacu-row-status]');

                        if (wpacuNewAreaAssetsRowState === 'contracted') {
                            $tdAssetRow.attr('data-wpacu-row-status', wpacuNewAreaAssetsRowState)
                                .find('.wpacu_handle_row_expanded_area').addClass('wpacu_hide');
                            $tdAssetRow.find('a.wpacu_handle_row_expand_contract').find('span').removeClass('dashicons-minus').addClass('dashicons-plus');
                        } else if (wpacuNewAreaAssetsRowState === 'expanded') {
                            $tdAssetRow.attr('data-wpacu-row-status', wpacuNewAreaAssetsRowState)
                                .find('.wpacu_handle_row_expanded_area').removeClass('wpacu_hide');
                            $tdAssetRow.find('a.wpacu_handle_row_expand_contract').find('span').removeClass('dashicons-plus').addClass('dashicons-minus');
                        }
                    });

                    $.fn.wpAssetCleanUp().wpacuAjaxUpdateAllAreaAssetsRowState(wpacuNewAreaAssetsRowState, wpacuAllAreaHandles, $areaWrap);
                });
            },

            triggerAlertWhenAnyUnloadRuleIsChosen: function (handle, handleFor) {
                // The moment the load exception area is shown, it means at least one unload rule was set
                // There are cases when the admin needs to be alerted

                // Dashicons
                if (handle === 'dashicons' && handleFor === 'style') {
                    if ($('input[name="wpacu_ignore_child[styles][nf-display]').length > 0 && !confirm(wpacu_object.dashicons_unload_alert_ninja_forms)) {
                        return false;
                    }
                }

                if (handleFor === 'script') {
                    // jQuery library
                    if ((handle === 'jquery' || handle === 'jquery-core')) {
                        if ($('#script_jquery_ignore_children').length > 0 && !confirm(wpacu_object.jquery_unload_alert)) {
                            return false;
                        }
                    }

                    // JavaScript Cookie (https://github.com/js-cookie/js-cookie)
                    // Parent of: wc-cart-fragments, woocommerce
                    if (handle === 'js-cookie') {
                        if (!confirm(wpacu_object.woo_js_cookie_unload_alert)) {
                            return false;
                        }
                    }

                    // WooCommerce's "wc-cart-fragments" JS file
                    if (handle === 'wc-cart-fragments') {
                        if (!confirm(wpacu_object.woo_wc_cart_fragments_unload_alert)) {
                            return false;
                        }
                    }

                    // Other JS files
                    if ((handle === 'backbone' || handle === 'underscore')) {
                        if (!confirm(wpacu_object.sensitive_library_unload_alert)) {
                            return false;
                        }
                    }
                }

                return true;
            },

            showHandleLoadExceptionArea: function (handleFor, handle) {
                let $targetedLoadExceptionArea = $('div.wpacu_exception_options_area_wrap[data-' + handleFor + '-handle="' + handle + '"]');
                $targetedLoadExceptionArea.parent('div').removeClass('wpacu_hide');
                // Remove "disabled" attribute to any load exceptions checkboxes
                // Except the locked ones if the Lite version is used
                $targetedLoadExceptionArea.find('input[type="checkbox"]').not('.wpacu_lite_locked').prop('disabled', false);
            },
            hideHandleLoadExceptionArea: function ($targetedAssetRow, handle, handleFor) {
                // If it's NOT already unloaded (on page load)
                // All bulk unloads are unchecked
                // Then HIDE make exceptions area
                if (!$targetedAssetRow.hasClass('wpacu_is_bulk_unloaded')) {
                    if (!$targetedAssetRow.find('.wpacu_bulk_unload').is(':checked')) {
                        let $targetedLoadExceptionArea = $('div.wpacu_exception_options_area_wrap[data-' + handleFor + '-handle="' + handle + '"]');
                        $targetedLoadExceptionArea.parent('div').addClass('wpacu_hide');
                        // Set "disabled" attribute any load exceptions checkboxes as they are irrelevant in this instance
                        $targetedLoadExceptionArea.find('input[type="checkbox"]').prop('disabled', true);
                    }
                }
            },

            uncheckAllOtherBulkUnloadRules: function ($targetInput, includingUnloadViaRegEx) {
                let wpacuToFind = '.wpacu_bulk_unload';

                if (includingUnloadViaRegEx === false) {
                    wpacuToFind = '.wpacu_bulk_unload:not(.wpacu_unload_it_regex_checkbox)';
                }

                $targetInput.closest('tr').find(wpacuToFind).not($targetInput) // all except the target one
                    // uncheck it
                    .prop('checked', false)
                    // remove the "checked" style from the label
                    .parent('label').removeClass('wpacu_input_load_checked')
                    .removeClass('wpacu_unload_checked');
            },

            limitSubmittedFields: function () {
                // [wpacu_pro]
                if (wpacu_object.plugin_slug === 'wp-asset-clean-up-pro') {
                    return $.fn.wpAssetCleanUpPro().limitSubmittedFields();
                }
                // [wpacu_pro]

                let preloadTargetInput = '[data-wpacu-input="preload"]',
                    wpacuListToCheck = [];

                // Edit post/page area (e.g. /wp-admin/post.php?post=[POST_ID_HERE]&action=edit)
                // OR edit taxonomy area (e.g. /wp-admin/term.php?taxonomy=category&tag_ID=63&post_type=post)
                if ($('body.wp-admin form#post').length > 0 || $('body.wp-admin form#edittag').length > 0) {
                    if ($('#wpacu_unload_assets_area_loaded').length < 1) {
                        return; // the CSS/JS area is not loaded on edit post/page area, thus no reason to continue
                    }

                    return true; // leave it always to true as the edit post/page/taxonomy form needs to always submit (might be edited later on)
                }

                if ($(preloadTargetInput).length > 0) {
                    wpacuListToCheck.push(preloadTargetInput);
                }

                if (wpacuListToCheck.length > 0) {
                    $(wpacuListToCheck.join()).each(function () {
                        let $thisEl = $(this);
                        if ( ! $thisEl.val() ) {
                            $thisEl.prop('disabled', 'disabled');

                            setTimeout(function () {
                                $thisEl.prop('disabled', false);
                            }, 2000); // restore them in case the user pressed "Preview Changes"
                        }
                    });
                }

                return true;
            },

            wpacuParseContentsForDirectCall: function (contents, statusCode) {
                if (contents.lastIndexOf(wpacu_object.start_del_e) < 0
                    || contents.lastIndexOf(wpacu_object.end_del_e) < 0
                    || contents.lastIndexOf(wpacu_object.start_del_h) < 0
                    || contents.lastIndexOf(wpacu_object.end_del_h) < 0
                ) {
                    // Sometimes, 200 OK (success) is returned, but due to an issue with the page, the assets list is not retrieved
                    // Do further checks if any of the markers are missing (even if there are no assets to manage, they should be printed)
                    let wpacuOutputError = wpacu_object.ajax_direct_fetch_error_with_success_response;

                    // Strip tags (Source: https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/)
                    wpacuOutputError = wpacuOutputError.replace(
                        /{wpacu_output}/,
                        xhr.responseText.replace(/(<([^>]+)>)/ig, '')
                    );

                    // htmlEntities() PHP equivalent: https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
                    try {
                        wpacuOutputError = String(wpacuOutputError).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    } catch (e) {
                        console.log(e);
                    }

                    $(metaBoxContent).html(wpacuOutputError);
                    return;
                }

                let wpacuListE = contents.substring(
                    (contents.lastIndexOf(wpacu_object.start_del_e) + wpacu_object.start_del_e.length),
                    contents.lastIndexOf(wpacu_object.end_del_e)
                );

                /*
                 * IMPORTANT NOTE: It looks like UglifyJS jas issues preserving comments that are after consecutive "var"
                 */
                let wpacuListH = contents.substring(
                    (contents.lastIndexOf(wpacu_object.start_del_h) + wpacu_object.start_del_h.length),
                    contents.lastIndexOf(wpacu_object.end_del_h)
                );

                let dataGetLoadedAssets = {
                    'action'            : wpacu_object.plugin_prefix + '_get_loaded_assets',
                    'wpacu_list_e'      : wpacuListE,
                    'wpacu_list_h'      : wpacuListH,
                    'post_id'           : wpacu_object.post_id,
                    'page_url'          : wpacu_object.page_url,
                    'tag_id'            : wpacu_object.tag_id,
                    'wpacu_taxonomy'    : wpacu_object.wpacu_taxonomy,
                    'force_manage_dash' : wpacu_object.force_manage_dash,
                    'is_for_singular'   : false, // e.g. Post ID, Post Title
                    'wpacu_nonce'       : wpacu_object.wpacu_ajax_get_loaded_assets_nonce,
                    'time_r'            : new Date().getTime()
                };

                if ($('#wpacu_manage_singular_page_assets').length > 0) { // e.g. /wp-admin/admin.php?page=wpassetcleanup_assets_manager
                    dataGetLoadedAssets['is_for_singular'] = true;
                }

                $.post(wpacu_object.ajax_url, dataGetLoadedAssets, function (response) {
                    if (!response) {
                        return;
                    }

                    $(metaBoxContent).html(response);

                    if (statusCode === 404) {
                        $(metaBoxContent).prepend('<p><span class="dashicons dashicons-warning"></span> ' + wpacu_object.server_returned_404_not_found + '</p><hr />');
                    }

                    if ($('#wpacu_dash_assets_manager_form').length > 0) {
                        $('#submit').show();
                    }

                    setTimeout(function () {
                        $.fn.wpAssetCleanUp().cssJsManagerActions();
                        $('.wpacu_asset_row, .wpacu-page-options .wpacu-assets-collapsible-content').removeClass('wpacu_loading'); // hide loading spinner after post is updated
                        $('#wpacu-assets-reloading').remove();

                        // [wpacu_pro]
                        $.fn.wpAssetCleanUpPro().wpacuTriggerChosenForTaxDd();
                        $.fn.wpAssetCleanUpPro().triggerForHardcodedAssets();
                        // [/wpacu_pro]

                        $.fn.wpAssetCleanUp().wpacuCheckSourcesFor404Errors();
                    }, 200);
                });
            },

            wpacuAjaxGetAssetsArea: function (forceFetch) {
                // Do not make any AJAX call unless force fetch is enabled
                if (!forceFetch && !$('#wpacu_ajax_fetch_assets_list_dashboard_view').length) {
                    return false;
                }

                // Was "Do not load Asset CleanUp Pro on this page (this will disable any functionality of the plugin)" ticked?
                // Do not load any list! Instead, make an AJAX call to load the restricted area mentioning that the restriction took effect

                let pageOptionNoPluginLoadTarget = '#wpacu_page_options_no_wpacu_load';
                if ($(pageOptionNoPluginLoadTarget).length > 0 && $(pageOptionNoPluginLoadTarget).prop('checked')) {
                    let dataLoadPageRestrictedArea = {
                        'action'      : wpacu_object.plugin_prefix + '_load_page_restricted_area',
                        'post_id'     : wpacu_object.post_id,
                        'wpacu_nonce' : wpacu_object.wpacu_ajax_load_page_restricted_area_nonce,
                        'time_r'      : new Date().getTime()
                    };

                    $.post(wpacu_object.ajax_url, dataLoadPageRestrictedArea, function (response) {
                        if (!response) {
                            return false;
                        }

                        $(metaBoxContent).html(response);

                        $('.wpacu_asset_row, .wpacu-page-options .wpacu-assets-collapsible-content').removeClass('wpacu_loading'); // hide loading spinner after post is updated
                        $('#wpacu-assets-reloading').remove();
                    });

                    return;
                }

                let dataDirect = {};

                if (wpacu_object.dom_get_type === 'direct') {
                    dataDirect[wpacu_object.plugin_prefix + '_load']   = 1;
                    dataDirect[wpacu_object.plugin_prefix + '_time_r'] = new Date().getTime();

                    $.ajax({
                        method: 'GET',
                        url: wpacu_object.page_url,
                        data: dataDirect,
                        cache: false,
                        complete: function (xhr, textStatus) {
                            if (xhr.statusText === 'error') {
                                // Make exception for 404 errors as there could be plugin used such as "404page – your smart custom 404 error page"
                                if (xhr.status === 404) {
                                    $.fn.wpAssetCleanUp().wpacuParseContentsForDirectCall(xhr.responseText, xhr.status, $);
                                    return;
                                }

                                // Strip any tags (Source: https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/)
                                let errorTextOutput = xhr.responseText.replace(/(<([^>]+)>)/ig, '');

                                // htmlEntities() PHP equivalent: https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
                                try {
                                    errorTextOutput = String(errorTextOutput).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                                } catch (e) {
                                    console.log(e);
                                }

                                let wpacuOutputError = wpacu_object.ajax_direct_fetch_error;
                                    wpacuOutputError = wpacuOutputError.replace(/{wpacu_output}/, errorTextOutput);
                                    wpacuOutputError = wpacuOutputError.replace(/{wpacu_status_code_error}/, xhr.status);

                                $(metaBoxContent).html(wpacuOutputError);
                            }
                        }
                    }).done(function (contents, _textStatus, jqXHR) {
                        // "Step 1" (Fetch the assets from the home page) is now completed
                        $('#wpacu-fetch-list-step-1-wrap').addClass('wpacu-completed');
                        $('#wpacu-fetch-list-step-1-status').html($('#wpacu-list-step-completed-status').html());

                        // "Step 2" is in progress, mark it as such
                        $('#wpacu-fetch-list-step-2-status').html($('#wpacu-list-step-default-status').html());
                        $.fn.wpAssetCleanUp().wpacuParseContentsForDirectCall(contents);
                    });
                } else if (wpacu_object.dom_get_type === 'wp_remote_post') {
                    let dataGetLoadedAssets = {
                        'action':             wpacu_object.plugin_prefix + '_get_loaded_assets',
                        'post_id':            wpacu_object.post_id,
                        'page_url':           wpacu_object.page_url,
                        'tag_id':             wpacu_object.tag_id,
                        'wpacu_taxonomy':     wpacu_object.wpacu_taxonomy,
                        'force_manage_dash':  wpacu_object.force_manage_dash,
                        'wpacu_nonce':        wpacu_object.wpacu_ajax_get_loaded_assets_nonce,
                        'time_r':             new Date().getTime()
                    };

                    if ($('#wpacu_manage_singular_page_assets').length > 0) { // e.g. /wp-admin/admin.php?page=wpassetcleanup_assets_manager
                        dataGetLoadedAssets['is_for_singular'] = true;
                    }

                    $.post(wpacu_object.ajax_url, dataGetLoadedAssets, function (response) {
                        if (!response) {
                            return false;
                        }

                        $(metaBoxContent).html(response);

                        if ($('#wpacu_dash_assets_manager_form').length > 0) {
                            $('#submit').show();
                        }

                        setTimeout(function () {
                            $.fn.wpAssetCleanUp().cssJsManagerActions();

                            setTimeout(function () {
                                // [wpacu_pro]
                                $.fn.wpAssetCleanUpPro().wpacuTriggerChosenForTaxDd();
                                $.fn.wpAssetCleanUpPro().triggerForHardcodedAssets();
                                // [/wpacu_pro]

                                $.fn.wpAssetCleanUp().wpacuCheckSourcesFor404Errors();
                            }, 100);
                        }, 200);
                    });
                }
            },

            wpacuParseResultsForHarcodedAssets: function (contents) {
                if (contents.lastIndexOf(wpacu_object.start_del_h) < 0 || contents.lastIndexOf(wpacu_object.end_del_h) < 0) {
                    // error in fetching the list
                }

                // IMPORTANT NOTE: It looks like UglifyJS has issues preserving comments that are after consecutive "var"
                let wpacuListH = contents.substring(
                    (contents.lastIndexOf(wpacu_object.start_del_h) + wpacu_object.start_del_h.length),
                    contents.lastIndexOf(wpacu_object.end_del_h)
                );

                let wpacuSettings = $('#wpacu-assets-collapsible-wrap-hardcoded-list').attr('data-wpacu-settings-frontend');

                let dataGetLoadedHardcodedAssets = {
                    'action'          : wpacu_object.plugin_prefix + '_print_loaded_hardcoded_assets',
                    'wpacu_list_h'    : wpacuListH,
                    'wpacu_settings'  : wpacuSettings, // includes $data values as well (with rules) to pass to the hardcoded list
                    'time_r'          : new Date().getTime(),
                    'wpacu_nonce'     : wpacu_object.wpacu_print_loaded_hardcoded_assets_nonce
                };

                if ($.fn.wpAssetCleanUpFrontendCssJsManagerArea().getParameterByName('wpacu_ignore_no_load_option') !== null) {
                    dataGetLoadedHardcodedAssets['wpacu_ignore_no_load_option'] = 1;
                }

                $.post(wpacu_object.ajax_url, dataGetLoadedHardcodedAssets, function (response) {
                    let $mainJQuerySelector = '#wpacu-assets-collapsible-wrap-hardcoded-list';

                    if ( ! response ) {
                        return;
                    }

                    if (response.includes('The security nonce is not valid')) {
                        $($mainJQuerySelector).find('> .wpacu-assets-collapsible-content').html(response);
                        return;
                    }

                    let responseJson = JSON.parse(response);

                    $($mainJQuerySelector).find('> .wpacu-assets-collapsible-content').html(responseJson.output);
                    $($mainJQuerySelector).find('a.wpacu-assets-collapsible').append(responseJson.after_hardcoded_title);

                    // [wpacu_pro]
                    $.fn.wpAssetCleanUpPro().wpacuTriggerChosenForTaxDd();
                    $.fn.wpAssetCleanUpPro().triggerForHardcodedAssets();
                    // [/wpacu_pro]
                });
            },

            wpacuCheckSourcesFor404Errors: function() {
                // Trigger on page load (front-end view)
                let $targetSources = $('[data-wpacu-external-source]');

                if ($targetSources.length < 1) {
                    return;
                }

                let totalExternalSources = $targetSources.length, checkUrlsToPass = '';

                $targetSources.each(function(wpacuIndex) {
                    let $targetSource = $(this), sourceUrl = $targetSource.attr('data-wpacu-external-source');

                    checkUrlsToPass += sourceUrl + '-at-wpacu-at-';

                    if (wpacuIndex === totalExternalSources - 1) {
                        $.post(wpacu_object.ajax_url, {
                            'action'            : wpacu_object.plugin_prefix + '_check_external_urls_for_status_code',
                            'wpacu_check_urls'  : checkUrlsToPass,
                            'wpacu_nonce'       : wpacu_object.wpacu_ajax_check_external_urls_nonce
                        }, function(response) {
                            let urlsList = $.parseJSON(response);

                            $.each(urlsList, function(index, sourceToHi) {
                                $('[data-wpacu-external-source="'+ sourceToHi +'"]')
                                    .css({'color': '#cc0000'})
                                    .parent('div')
                                    .find('[data-wpacu-external-source-status]')
                                    .html('<small>* <em style="font-weight: 600;">' + wpacu_object.source_load_error_msg + '</em></small>');
                            });
                        });
                    }
                    });
            },

            wpacuBytesToSize: function(bytes) {
                /**
                 * Inspired from: https://web.archive.org/web/20120507054320/http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-(javascript)
                 * Bytes to KB
                 */
                if (bytes === 0) {
                    return 'N/A';
                }

                return (bytes / 1024).toFixed(4) + ' KB';
            },

            wpacuAjaxUpdateKeepTheGroupsState: function(newState, btnIdClicked) {
                // Don't use resources and perform the AJAX call if the same "state" button is clicked
                let dataCurrentState = $('#wpacu-assets-groups-change-state-area').attr('data-wpacu-groups-current-state');

                if (dataCurrentState == newState) {
                    $('#' + btnIdClicked).prop('disabled', false); // Don't leave the button disabled
                    return;
                }

                let dataUpdateSetting = {
                    'action'                       : wpacu_object.plugin_prefix + '_update_settings',
                    'wpacu_nonce'                  : wpacu_object.wpacu_update_specific_settings_nonce,
                    'wpacu_update_keep_the_groups' : 'yes',
                    'wpacu_keep_the_groups_state'  : newState, // "expanded" or "contracted"
                    'time_r'                       : new Date().getTime() // avoid any caching
                };

                try {
                    $.post(wpacu_object.ajax_url, dataUpdateSetting, function (response) {
                        if (response == 'done') {
                            $('#wpacu-assets-groups-change-state-area').attr('data-wpacu-groups-current-state', newState);
                        }

                        $('#' + btnIdClicked).prop('disabled', false);
                    });
                } catch (e) {
                    $('#'+ btnIdClicked).prop('disabled', false); // Any problems with the AJAX call? Don't keep the button disabled
                }
            },

            wpacuAjaxUpdateKeepTheAssetRowState: function(newState, handle, handleFor, $currentElement) {
                let dataUpdateSetting = {
                    'action'                       : wpacu_object.plugin_prefix + '_update_asset_row_state',
                    'wpacu_update_asset_row_state' : 'yes',
                    'wpacu_asset_row_state'        : newState, // "expanded" or "contracted"
                    'wpacu_handle'                 : handle,
                    'wpacu_handle_for'             : handleFor,
                    'time_r'                       : new Date().getTime(), // avoid any caching
                    'wpacu_nonce'                  : wpacu_object.wpacu_update_asset_row_state_nonce
                };

                $currentElement.addClass('wpacu_hide');

                $.post(wpacu_object.ajax_url, dataUpdateSetting, function (response) {
                    $currentElement.removeClass('wpacu_hide');
                    console.log(response);
                });
            },

            // This triggers when all the assets from a plugin are expanded or contracted
            wpacuAjaxUpdateAllAreaAssetsRowState: function(newState, handles, $areaWrap) {
                let dataUpdateSetting = {
                    'action'                             : wpacu_object.plugin_prefix + '_area_update_assets_row_state',
                    'wpacu_area_update_assets_row_state' : 'yes',
                    'wpacu_area_assets_row_state'        : newState, // "expanded" or "contracted"
                    'wpacu_area_handles'                 : handles,
                    'time_r'                             : new Date().getTime(), // avoid any caching
                    'wpacu_nonce'                        : wpacu_object.wpacu_area_update_assets_row_state_nonce
                };

                $areaWrap.find('.wpacu_handle_row_expand_contract').addClass('wpacu_hide');

                $.post(wpacu_object.ajax_url, dataUpdateSetting, function (response) {
                    $areaWrap.find('.wpacu_handle_row_expand_contract').removeClass('wpacu_hide');
                    console.log(response);
                });
            },

            wpacuTriggerAdjustTextAreaHeightAllTextareas: function() {
                // We use the "data-wpacu-adapt-height" attribute as a marker
                let wpacuTextAreas = [].slice.call(document.querySelectorAll('textarea[data-wpacu-adapt-height="1"]'));

                // Iterate through all the textareas on the page
                wpacuTextAreas.forEach(function(el) {
                    // we need box-sizing: border-box, if the textarea has padding
                    el.style.boxSizing = el.style.mozBoxSizing = 'border-box';

                    // we don't need any scrollbars, do we? :)
                    el.style.overflowY = 'hidden';

                    // the minimum height initiated through the "rows" attribute
                    let minHeight = el.scrollHeight;

                    el.addEventListener('input', function() {
                        $.fn.wpAssetCleanUp().wpacuAdjustTextareaHeight(el, minHeight);
                    });

                    // we have to readjust when window size changes (e.g. orientation change)
                    window.addEventListener('resize', function() {
                        $.fn.wpAssetCleanUp().wpacuAdjustTextareaHeight(el, minHeight);
                    });

                    // we adjust height to the initial content
                    $.fn.wpAssetCleanUp().wpacuAdjustTextareaHeight(el, minHeight);
                });
            },

            wpacuAdjustTextareaHeight: function(el, minHeight) {
                /* Source: http://bdadam.com/blog/automatically-adapting-the-height-textarea.html */
                // compute the height difference which is caused by border and outline
                let outerHeight = parseInt(window.getComputedStyle(el).height, 10);
                let diff = outerHeight - el.clientHeight;

                // set the height to 0 in case of it has to be shrunk
                el.style.height = 0;

                // set the correct height
                // el.scrollHeight is the full height of the content, not just the visible part
                el.style.height = Math.max(minHeight, el.scrollHeight + diff) + 'px';
            }
        }
    }
})(jQuery);

jQuery(document).ready(function($) {
    /*
    * [START] "Settings" (menu)
     */
    $.fn.wpAssetCleanUpSettingsArea = function() {
        return {
            actions: function () {
                /*
                * Settings: A link is clicked that should trigger a vertical menu link from the plugin
                 */
                $(document).on('click', 'a[data-wpacu-vertical-link-target]', function (e) {
                    e.preventDefault();
                    $.fn.wpAssetCleanUpSettingsArea().tabOpenSettingsArea(e, $(this).attr('data-wpacu-vertical-link-target'));
                });

                /*
                 * A vertical tab is clicked
                 */
                $(document).on('click', 'a[data-wpacu-settings-tab-key]', function (e) {
                    e.preventDefault();
                    $.fn.wpAssetCleanUpSettingsArea().tabOpenSettingsArea(e, $(this).attr('data-wpacu-settings-tab-key'));
                });

                $(document).on('click', 'input[type="checkbox"]#wpacu_disable_rss_feed', function () {
                    if ($(this).is(':checked')) {
                        $('#wpacu_remove_main_feed_link, #wpacu_remove_comment_feed_link').prop('checked', true);
                    } else {
                        $('#wpacu_remove_main_feed_link, #wpacu_remove_comment_feed_link').prop('checked', false);
                    }
                });

                /*
                * Settings: Sub-tab within tab clicked
                */
                $(document).on('click', 'input[name="wpacu_sub_tab_area"]', function () {
                    $('.wpacu-sub-tabs-item').removeClass('wpacu-visible');

                    if ($(this).is(':checked')) {
                        let refId = $(this).attr('id');
                        $('#'+ refId +'-area').addClass('wpacu-visible');

                        let $mainTabArea = $(this).parent('.wpacu-sub-tabs-wrap').parent('.wpacu-settings-tab-content');
                        let mainTabAreaId = $mainTabArea.attr('id');

                        $.fn.wpAssetCleanUpSettingsArea().updateUriParamWithTabArea(mainTabAreaId);
                        $.fn.wpAssetCleanUpSettingsArea().updateUriParamWithSubTabArea($(this).val());
                    }
                });

                /* [Start] Minify/Combine CSS/JS status circles */
                $(document).on('click', '#wpacu_minify_css_enable, #wpacu_combine_loaded_css_enable, #wpacu_minify_js_enable, #wpacu_combine_loaded_js_enable, #wpacu_cdn_rewrite_enable, #wpacu_enable_test_mode', function () {
                    if ($(this).prop('checked')) {
                        $('[data-linked-to="' + $(this).attr('id') + '"]').find('.wpacu-circle-status').addClass('wpacu-on').removeClass('wpacu-off');
                    } else {
                        $('[data-linked-to="' + $(this).attr('id') + '"]').find('.wpacu-circle-status').addClass('wpacu-off').removeClass('wpacu-on');
                    }
                });
                /* [End] Minify/Combine CSS/JS status circles */

                /* [Start] Inline Stylesheet (.css) Files Smaller Than (x) KB */
                $(document).on('click', '#wpacu_inline_css_files_below_size_checkbox', function () {
                    // The checkbox is not 'checked' and it was clicked
                    if ($(this).is(':checked')) {
                        $('#wpacu_inline_css_files_enable').prop('checked', true).trigger('tick');
                    } else {
                        if ($('#wpacu_inline_css_files_list').val() === '') {
                            $('#wpacu_inline_css_files_enable').prop('checked', false).trigger('tick');
                        }
                    }
                });
                /* [End] Inline Stylesheet (.css) Files Smaller Than (x) KB */

                /* [Start] Inline JavaScript (.js) Files Smaller Than (x) KB */
                $(document).on('click', '#wpacu_inline_js_files_below_size_checkbox', function () {
                    // The checkbox is not 'checked' and it was clicked
                    if ($(this).is(':checked')) {
                        if (!confirm(wpacu_object.inline_auto_js_files_confirm_msg)) {
                            return false;
                        }

                        $('#wpacu_inline_js_files_enable').prop('checked', true).trigger('tick');
                    } else {
                        if ($('#wpacu_inline_js_files_list').val() === '') {
                            $('#wpacu_inline_js_files_enable').prop('checked', false).trigger('tick');
                        }
                    }
                });
                /* [End] Inline JavaScript (.js) Files Smaller Than (x) KB */

                // "Manage in the Dashboard?" Clicked
                $(document).on('click', '#wpacu_dashboard', function() {
                    if ($(this).prop('checked')) {
                        $('#wpacu-settings-assets-retrieval-mode').show();
                        //$('#wpacu_hide_meta_boxes_for_post_types_chosen .chosen-choices, #wpacu-hide-meta-boxes-for-post-types-info').css({'opacity':1});
                    } else {
                        $('#wpacu-settings-assets-retrieval-mode').hide();
                        //$('#wpacu_hide_meta_boxes_for_post_types_chosen .chosen-choices, #wpacu-hide-meta-boxes-for-post-types-info').css({'opacity':0.4});
                    }
                });

                // "Manage in the Dashboard?" radio selection
                $(document).on('change', '.wpacu-dom-get-type-selection', function() {
                    if ($(this).is(':checked')) {
                        $('.wpacu-dom-get-type-info').hide();
                        $('#'+ $(this).attr('data-target')).fadeIn('fast');
                    }
                });

                // "Manage in the Front-end?" Clicked
                $(document).on('click', '#wpacu_frontend', function() {
                    if ($(this).prop('checked')) {
                        $('#wpacu-settings-frontend-exceptions').show();
                    } else {
                        $('#wpacu-settings-frontend-exceptions').hide();
                    }
                });

                // Google Fonts: Load Optimizer (render-blocking or asynchronous)
                $(document).on('change', '.google_fonts_combine_type', function() {
                    $('.wpacu_google_fonts_combine_type_area').hide();

                    if ($(this).val() === 'async') {
                        $('#wpacu_google_fonts_combine_type_async_info_area').fadeIn();
                    } else if ($(this).val() === 'async_preload') {
                        $('#wpacu_google_fonts_combine_type_async_preload_info_area').fadeIn();
                    } else {
                        $('#wpacu_google_fonts_combine_type_rb_info_area').fadeIn();
                    }
                });

                if (  $('#wpacu-allow-manage-assets-to-select-list-area').length > 0 &&
                    ! $('#wpacu-allow-manage-assets-to-select-list-area').hasClass('wpacu_hide') &&
                      $('#wpacu-allow-manage-assets-to-select-list').hasClass('wpacu_chosen_can_be_later_enabled')
                ) {
                    setTimeout(function() { jQuery('#wpacu-allow-manage-assets-to-select-list').chosen(); }, 200);
                }

                $('#wpacu-allow-manage-assets-to-select').on('click change', function() {
                    if ($(this).val() === 'chosen') {
                        $('#wpacu-allow-manage-assets-to-select-list-area').removeClass('wpacu_hide');
                        setTimeout(function() {
                            if (jQuery('#wpacu-allow-manage-assets-to-select-list').hasClass('wpacu_chosen_can_be_later_enabled')) {
                                jQuery('#wpacu-allow-manage-assets-to-select-list').chosen();
                            }
                        }, 200);
                    } else {
                        $('#wpacu-allow-manage-assets-to-select-list-area').addClass('wpacu_hide');
                    }
                });

                $('#wpacu_assets_list_layout').on('click change', function() {
                    if ($(this).val() === 'by-location') {
                        $('#wpacu-assets-list-by-location-selected').fadeIn('fast');
                    } else {
                        $('#wpacu-assets-list-by-location-selected').fadeOut('fast');
                    }
                });

                $('#wpacu_disable_jquery_migrate').on('click', function() {
                    // It was checked and the user unchecked it
                    if (! $(this).is(':checked')) {
                        return true;
                    }

                    // It was unchecked and the user checked it, needs confirmation
                    // Otherwise, it would be reversed as not checked
                    if ($(this).is(':checked') && confirm(wpacu_object.jquery_migration_disable_confirm_msg)) {
                        return true;
                    } else {
                        // Not confirmed?
                        $(this).prop('checked', false);
                        return false;
                    }
                });

                $('#wpacu_disable_comment_reply').on('click', function() {
                    // It was checked and the user unchecked it
                    if (! $(this).is(':checked')) {
                        return true;
                    }

                    // It was unchecked and the user checked it, needs confirmation
                    // Otherwise, it would be reversed as not checked
                    if ($(this).is(':checked') && confirm(wpacu_object.comment_reply_disable_confirm_msg)) {
                        return true;
                    } else {
                        // Not confirmed?
                        $(this).prop('checked', false);
                        return false;
                    }
                });

                // "Settings" - When an option is enabled/disabled
                $('[data-target-opacity]').on('click change tick', function() {
                    if ($(this).prop('checked')) {
                        $('#'+ $(this).attr('data-target-opacity')).css({'opacity':1});
                    } else {
                        $('#'+ $(this).attr('data-target-opacity')).css({'opacity':0.4});
                    }
                });

                $('#wpacu-show-assets-meta-box-checkbox').on('click change', function() {
                    if ($(this).prop('checked')) {
                        $('#wpacu-show-assets-enabled-area').show();
                        $('#wpacu-show-assets-disabled-area').hide();
                    } else {
                        $('#wpacu-show-assets-enabled-area').hide();
                        $('#wpacu-show-assets-disabled-area').show();
                    }
                });

                // "Combine JS Files" - "Select a combination method:"
                $(document).on('change', '.wpacu-combine-loaded-js-level', function() {
                    if ($(this).is(':checked')) {
                        $('.wpacu_combine_loaded_js_level_area').removeClass('wpacu_active');
                        $('#'+ $(this).attr('data-target')).addClass('wpacu_active');
                    }
                });

                $(document).on('click', '.wpacu-add-new-no-features-rule-row', function(e) {
                    e.preventDefault();

                    // Show the spinner
                    let $spinnerAfterLink = $(this).next('.wpacu-add-new-no-features-rule-row-loader');
                    $spinnerAfterLink.show();

                    $.get(wpacu_object.ajax_url, {
                        'action'      : wpacu_object.plugin_prefix + '_add_new_no_features_load_row',
                        'time_r'      : new Date().getTime()
                    }, function (newRowOutput) {
                        $('#wpacu-prevent-feature-rule-areas-wrap').append(newRowOutput);

                        let $lastNoFeatureAreaWithChosen = $('#wpacu-prevent-feature-rule-areas-wrap > .wpacu-prevent-feature-rule-area:last')
                            .find('.wpacu_chosen_can_be_later_enabled');

                        //console.log($lastNoFeatureAreaWithChosen);

                        if ($lastNoFeatureAreaWithChosen.length > 0) {
                            $lastNoFeatureAreaWithChosen.chosen();
                        }

                        // Hide the spinner
                        $spinnerAfterLink.hide();
                    });
                });

                $(document).on('click', '.wpacu-delete-no-features-rule-row', function(e) {
                    e.preventDefault();
                    let $lastNoFeatureArea = $(this).parent('.wpacu-prevent-feature-rule-area');
                    $lastNoFeatureArea.find(':input').prop('disabled', true);
                    $lastNoFeatureArea.remove();
                });

                // Submit button (Dashboard) is clicked
                let $settingSubmitBtn = $('#wpacu-update-button-area input[type="submit"]');

                // Show the loading spinner
                $(document).on('submit', '#wpacu-settings-form, .wpacu_settings_form', function() {
                    $settingSubmitBtn.attr('disabled', true);
                    $('#wpacu-updating-settings').addClass('wpacu-show').removeClass('wpacu-hide');
                });

                // Once the form is submitted, disable the submit button to prevent any double submission
                // Settings & Homepage Buttons
                $(document).on('submit', 'form#wpacu-settings-form, form#wpacu_dash_assets_manager_form', function() {
                    $settingSubmitBtn.attr('disabled', true);
                    $('#wpacu-updating-settings').show();
                    return true;
                });
            },

            tabOpenSettingsArea: function(evt, settingName) {
                /*
                * Only relevant in the "Settings" area
                */
                evt.preventDefault();

                let i, wpacuVerticalTabContent, wpacuVerticalTabLinks;

                wpacuVerticalTabContent = document.getElementsByClassName("wpacu-settings-tab-content");

                for (i = 0; i < wpacuVerticalTabContent.length; i++) {
                    wpacuVerticalTabContent[i].style.display = "none";
                }

                wpacuVerticalTabLinks = document.getElementsByClassName("wpacu-settings-tab-link");

                for (i = 0; i < wpacuVerticalTabLinks.length; i++) {
                    wpacuVerticalTabLinks[i].className = wpacuVerticalTabLinks[i].className.replace(" active", "");
                }

                document.getElementById(settingName).style.display = "table-cell";

                $('a[href="#'+ settingName +'"]').addClass('active');
                $('#wpacu-selected-tab-area').val(settingName);

                $.fn.wpAssetCleanUpSettingsArea().updateUriParamWithTabArea(settingName);

                // Any sub-tabs within the tab area?
                let $anyFirstSubTabInput = $('#' + settingName).find('.wpacu-sub-tabs-wrap .wpacu-nav-input:first-child');
                //console.log($anyFirstSubTabInput.length);

                if ($anyFirstSubTabInput.length > 0) {
                    $('#' + $anyFirstSubTabInput.attr('id')).prop('checked', true);
                    $('#' + $anyFirstSubTabInput.attr('id') + '-area').addClass('wpacu-visible');
                    $.fn.wpAssetCleanUpSettingsArea().updateUriParamWithSubTabArea($anyFirstSubTabInput.val());
                } else {
                    $.fn.wpAssetCleanUpSettingsArea().updateUriParamWithSubTabArea('');
                }

                },

            updateUriParamWithTabArea: function(selectedTabArea) {
                // Construct URLSearchParams object instance from current URL querystring.
                var queryParams = new URLSearchParams(window.location.search);

                // Set new or modify existing parameter value.
                queryParams.set('wpacu_selected_tab_area', selectedTabArea);

                // Replace current querystring with the new one.
                history.replaceState(null, null, '?' + queryParams.toString());
            },

            updateUriParamWithSubTabArea: function(selectedSubTabArea) {
                // Construct URLSearchParams object instance from current URL querystring.
                var queryParams = new URLSearchParams(window.location.search);

                if (selectedSubTabArea !== '') {
                    // Set new or modify existing parameter value.
                    queryParams.set('wpacu_selected_sub_tab_area', selectedSubTabArea);
                } else {
                    // Remove existing parameter value.
                    queryParams.delete('wpacu_selected_sub_tab_area');
                }

                // Replace current querystring with the new one.
                history.replaceState(null, null, '?' + queryParams.toString());

                // Old reference fallback | $_REQUEST is used to get the value in case the URI param fails to update
                $('#wpacu-selected-sub-tab-area').val(selectedSubTabArea);
            }
        }
    }
    $.fn.wpAssetCleanUpSettingsArea().actions();
    /*
    * [END] "Settings" (menu)
     */

    /*
    * [START] "Tools" (menu)
     */
    $.fn.wpAssetCleanUpToolsArea = function() {
        return {
            actions: function () {
                /*
                * "Tools" -> "Reset"
                */
                let wpacuResetDdSelector = '#wpacu-reset-drop-down', $wpacuOptionSelected, wpacuMsgToShow;

                $(wpacuResetDdSelector).on('change keyup keydown mouseup mousedown click', function() {
                    if ($(this).val() === '') {
                        $('#wpacu-warning-read').removeClass('wpacu-visible');
                        $('#wpacu-reset-submit-btn').attr('disabled', 'disabled')
                            .removeClass('button-primary')
                            .addClass('button-secondary');
                    } else {
                        if ($(this).val() === 'reset_everything') {
                            $('#wpacu-license-data-remove-area, #wpacu-cache-assets-remove-area').addClass('wpacu-visible');
                        } else {
                            $('#wpacu-license-data-remove-area, #wpacu-cache-assets-remove-area').removeClass('wpacu-visible');
                        }

                        $('#wpacu-warning-read').addClass('wpacu-visible');
                        $('#wpacu-reset-submit-btn').removeAttr('disabled')
                            .removeClass('button-secondary')
                            .addClass('button-primary');
                    }

                    $('.wpacu-tools-area .wpacu-warning').hide();

                    $wpacuOptionSelected = $(this).find('option:selected');
                    $('#'+ $wpacuOptionSelected.attr('data-id')).show();
                });

                $('#wpacu-reset-submit-btn').on('click', function() {
                    if ($(wpacuResetDdSelector).val() === 'reset_settings') {
                        wpacuMsgToShow = wpacu_object.reset_settings_confirm_msg;
                    } else if ($(wpacuResetDdSelector).val() === 'reset_critical_css') {
                        wpacuMsgToShow = wpacu_object.reset_critical_css_confirm_msg;
                    } else if ($(wpacuResetDdSelector).val() === 'reset_everything_except_settings') {
                        wpacuMsgToShow = wpacu_object.reset_everything_except_settings_confirm_msg;
                    } else if ($(wpacuResetDdSelector).val() === 'reset_everything') {
                        wpacuMsgToShow = wpacu_object.reset_everything_confirm_msg;
                    }

                    if (! confirm(wpacuMsgToShow)) {
                        return false;
                    }

                    $('#wpacu-action-confirmed').val('yes');

                    setTimeout(function() {
                        if ($('#wpacu-action-confirmed').val() === 'yes') {
                            $('#wpacu-tools-form').trigger('submit');
                        }
                    }, 1000);
                });

                /*
                * "Tools" -> "Import"
                */
                $(document).on('submit', '#wpacu-import-form', function() {
                    if (! confirm(wpacu_object.import_confirm_msg)) {
                        return false;
                    }

                    $(this).find('button').addClass('wpacu-importing').prop('disabled', true);
                });
            }
        }
    }
    $.fn.wpAssetCleanUpToolsArea().actions();
    /*
    * [END] "Tools" (menu)
     */

    /*
     * [START] Front-end CSS/JS Manager
     */
    $.fn.wpAssetCleanUpFrontendCssJsManagerArea = function() {
        return {
            getParameterByName: function(name, url = window.location.href) {
                // Source: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            },
            actions: function () {
                // "Update" button is clicked within front-end view
                let $updateBtnFrontEnd = $('#wpacu-update-front-settings-area .wpacu_update_btn');

                // Show the loading spinner
                $(document).on('submit', '#wpacu-frontend-form', function() {
                    $updateBtnFrontEnd.attr('disabled', true).addClass('wpacu_submitting');
                    $('#wpacu-updating-front-settings').show();
                    return true;
                });

                // Asset Front-end Edit (if setting is enabled)
                if ($('#wpacu_wrap_assets').length > 0) {
                    setTimeout(function () {
                        $.fn.wpAssetCleanUp().cssJsManagerActions();
                    }, 200);
                }

                // The code below is for the pages loaded in the front-end view
                // Fetch hardcoded assets
                if ($('#wpacu-assets-collapsible-wrap-hardcoded-list').length > 0) {
                    let dataFetchHardcodedList = {};
                    dataFetchHardcodedList[wpacu_object.plugin_prefix + '_load']   = 1;
                    dataFetchHardcodedList[wpacu_object.plugin_prefix + '_time_r'] = new Date().getTime();
                    dataFetchHardcodedList['wpacu_just_hardcoded']                 = 1;

                    if ($.fn.wpAssetCleanUpFrontendCssJsManagerArea().getParameterByName('wpacu_ignore_no_load_option') !== null) {
                        dataFetchHardcodedList['wpacu_ignore_no_load_option']      = 1;
                    }

                    $.ajax({
                        method: 'GET',
                        url: wpacu_object.page_url,
                        data: dataFetchHardcodedList,
                        cache: false,
                        complete: function (xhr, textStatus) {
                            if (xhr.statusText === 'error') {
                                $.fn.wpAssetCleanUp().wpacuParseResultsForHarcodedAssets(xhr.responseText);
                                }
                        }
                    }).done(function (contents) {
                        $.fn.wpAssetCleanUp().wpacuParseResultsForHarcodedAssets(contents);
                    });
                }
            }
        }
    }
    $.fn.wpAssetCleanUpFrontendCssJsManagerArea().actions();
    /*
     * [END] Front-end CSS/JS Manager
     */

    /*
    * [START] Dashboard CSS/JS Manager
    */
    $.fn.wpAssetCleanUpDashboardCssJsManagerArea = function() {
        return {
            actions: function () {
                // Option #1: Fetch the assets automatically and show the list (Default) is chosen
                // Or "Homepage" from "CSS & JavaScript Load Manager" is loaded
                if (wpacu_object.list_show_status === 'default' || wpacu_object.list_show_status === '' || wpacu_object.override_assets_list_load) {
                    $.fn.wpAssetCleanUp().wpacuAjaxGetAssetsArea(false);
                }

                // Option #2: Fetch the assets on button click
                // This takes effect only when edit post/page is used - e.g. /wp-admin/post.php?post=[post_id_here]&action=edit
                if (wpacu_object.list_show_status === 'fetch_on_click') {
                    $(document).on('click', '#wpacu_ajax_fetch_on_click_btn', function(e) {
                        e.preventDefault();
                        $(this).hide(); // Hide the button
                        $('#wpacu_fetching_assets_list_wrap').show(); // Show the loading information
                        $.fn.wpAssetCleanUp().wpacuAjaxGetAssetsArea(true); // Fetch the assets list
                    });
                }

                // Better compatibility with WordPress 5.0 as edit post/page is not refreshed after update
                // Asset CleanUp meta box's content is refreshed to show the latest changes as if the page was refreshed
                // This takes effect only when edit post/page is used and Gutenberg editor is used - e.g. /wp-admin/post.php?post=[post_id_here]&action=edit
                $(document).on('click', '.wp-admin.post-php .edit-post-header__settings button.is-primary', function () {
                    let $thisUpdateBtn = $(this);

                    // Wait until triggering it around half a second after the "Update" button is clicked
                    setTimeout(function() {
                        let wpacuIntervalUpdateAction = function () {
                            // If it's in the updating status, don't do anything
                            if ($thisUpdateBtn.attr('aria-disabled') === 'true' || $('#editor').hasClass('is-validating')) {
                                return;
                            }

                            // If the button "Fetch CSS & JavaScript Management List" is there, stop here as the list shouldn't be loaded
                            // since the admin didn't use the button in the first place
                            if ($('#wpacu_ajax_fetch_on_click_btn').length > 0) {
                                return;
                            }

                            // Updating status is over. Reload the CSS/JS manager which would show the new list
                            // (e.g. a site-wide rule could be applied, and it needs to show the removing "radio input" option)
                            if ($('.edit-post-header__settings .is-saving').length === 0) {
                                let wpacuMetaBoxContentTarget = '#wpacu_meta_box_content';

                                if ($(wpacuMetaBoxContentTarget).length > 0) {
                                    $('#wpacu-assets-reloading').remove();
                                    let wpacuAppendToPostWhileUpdating = '<span id="wpacu-assets-reloading" class="editor-post-saved-state is-wpacu-reloading">' + wpacu_object.reload_icon + wpacu_object.reload_msg + '</span>';
                                    $('.wp-admin.post-php .edit-post-header__settings').prepend(wpacuAppendToPostWhileUpdating);

                                    $('.wpacu_asset_row, .wpacu-page-options .wpacu-assets-collapsible-content').addClass('wpacu_loading'); // show loading spinner once "Update" is clicked

                                    $.fn.wpAssetCleanUp().wpacuAjaxGetAssetsArea(true);
                                    $.fn.wpAssetCleanUpClearCache().wpacuAjaxClearCache();

                                    // Finally, after the list is fetched and the caching is cleared,
                                    // do not keep checking any "saving" status as all the needed actions have been taken
                                    clearInterval(wpacuUpdateIntervalId);
                                }
                            }
                        };

                        let wpacuUpdateIntervalId = setInterval(wpacuIntervalUpdateAction, 900);
                    }, 500);
                });

                return $.fn.wpAssetCleanUp().limitSubmittedFields();
            }
        }
    }
    $.fn.wpAssetCleanUpDashboardCssJsManagerArea().actions();
    /*
    * [END] Dashboard CSS/JS Manager
    */

    /*
    * [START] Common CSS/JS Manager (Dashboard & Front-end)
    */
    $.fn.wpAssetCleanUpCommonCssJsManagerArea = function() {
        return {
            actions: function () {
                // Mark specific inputs as disabled if they are not needed to further reduce the total PHP inputs
                // if "max_input_vars" from php.ini is not set high enough
                $(document).on('submit', 'form#wpacu-frontend-form, form#wpacu_dash_assets_manager_form, body.wp-admin form#post, body.wp-admin #edittag', function() {
                    return $.fn.wpAssetCleanUp().limitSubmittedFields();
                });

                // Source (updated)
                $(document).on('click', '.wpacu-filter-handle', function(event) {
                    alert($(this).attr('data-wpacu-filter-handle-message'));
                    event.preventDefault();
                });

                // "Contract All Groups"
                $(document).on('click', '#wpacu-assets-contract-all', function() {
                    $(this).prop('disabled', true); // avoid multiple clicks and AJAX calls
                    $.fn.wpAssetCleanUp().wpacuAjaxUpdateKeepTheGroupsState('contracted', $(this).attr('id'));
                });

                // "Expand All Groups"
                $(document).on('click', '#wpacu-assets-expand-all', function() {
                    $(this).prop('disabled', true); // avoid multiple clicks and AJAX calls
                    $.fn.wpAssetCleanUp().wpacuAjaxUpdateKeepTheGroupsState('expanded', $(this).attr('id'));
                });
            }
        }
    }
    $.fn.wpAssetCleanUpCommonCssJsManagerArea().actions();
    /*
    * [END] Common CSS/JS Manager (Dashboard & Front-end)
    */

    const wpacuSpinnerElId = '#wpacu-main-loading-spinner';
    const wpacuSpinnerTextEl= '#wpacu-main-loading-spinner-text';

    $.fn.wpAssetCleanUpClearCache = function() {
        return {
            init: function() {
                $(document).on('click', '.wpacu-clear-cache-link', function(e) {
                    e.preventDefault();

                    if ($(wpacuSpinnerElId).length > 0) {
                        $(wpacuSpinnerTextEl).html( $(wpacuSpinnerTextEl).attr('data-wpacu-clear-cache-text') );
                        $(wpacuSpinnerElId).removeClass('wpacu_hide');
                    }

                    $.fn.wpAssetCleanUpClearCache().wpacuAjaxClearCache(true);
                });

                // Do not trigger other plugins' cache again if already cleared (save resources)
                let triggeredClearCacheIncludingOtherPluginsClearing = false;

                // The assets of a page just had rules applied (e.g. assets were unloaded)
                if (wpacu_object.clear_cache_on_page_load !== '') {
                    $.fn.wpAssetCleanUpClearCache().wpacuAjaxClearCache();
                    triggeredClearCacheIncludingOtherPluginsClearing = true;
                }

                if (wpacu_object.clear_other_caches !== '' && ! triggeredClearCacheIncludingOtherPluginsClearing) {
                    setTimeout(function () {
                        $.fn.wpAssetCleanUpClearCache().wpacuClearAutoptimizeCache();  // Autoptimize (if active)
                        $.fn.wpAssetCleanUpClearCache().wpacuClearCacheEnablerCache(); // Cache Enabler (if active)
                    }, 150);
                }
            },

            afterSubmit: function () {
                try {
                    let httpRefererFieldTargetName = 'input[type="hidden"][name="_wp_http_referer"]',
                        wpacuHttpRefererFieldVal;

                    if ($(httpRefererFieldTargetName).length > 0) {
                        wpacuHttpRefererFieldVal = $(httpRefererFieldTargetName).val();

                        // Edit Taxonomy page (after submit)
                        if (wpacuHttpRefererFieldVal.includes('term.php?taxonomy=') && wpacuHttpRefererFieldVal.includes('message=')) {
                            $.fn.wpAssetCleanUpClearCache().wpacuAjaxClearCache();
                        }

                        // Edit (Post/Page/Custom Post type) page (after submit)
                        if (wpacuHttpRefererFieldVal.includes('post.php?post=') && wpacuHttpRefererFieldVal.includes('message=')) {
                            $.fn.wpAssetCleanUpClearCache().wpacuAjaxClearCache();
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },

            wpacuAjaxClearCache: function(forceCacheClear = false) {
                // Do these verifications if the default value is used which is for triggering the cache in certain situations
                // If it's set to "true" then it's the obvious intention of the user to clear the cache such as clicking the link from the top admin bar
                if (forceCacheClear === false) {
                    /**
                     * Called after a post/page is saved (WordPress AJAX call)
                     */
                    if (typeof wpacu_object.wpacu_ajax_preload_url_nonce === 'undefined') {
                        return;
                    }

                    // Is the post status a "draft" one? Do not do any cache clearing and preloading as it's useless
                    let $wpacuHiddenPostStatusEl = '#hidden_post_status';
                    if ($($wpacuHiddenPostStatusEl).length > 0 && $($wpacuHiddenPostStatusEl).val() === 'draft') {
                        return;
                    }
                }

                $.get(wpacu_object.ajax_url, {
                    'action'      : wpacu_object.plugin_prefix + '_clear_cache',
                    'time_r'      : new Date().getTime(),
                    'wpacu_nonce' : wpacu_object.wpacu_ajax_clear_cache_nonce
                }, function (response) {
                    setTimeout(function() {
                        $.fn.wpAssetCleanUpClearCache().wpacuClearAutoptimizeCache(); // Autoptimize (if active)
                        // "Cache Enabler" (if active) cache was already cleared in classes/Update::ajaxClearCache() during the AJAX call

                        if (wpacu_object.is_frontend_view) {
                            // Preload (for the guest)
                            // The preload for the admin is not needed as the user is managing the CSS/JS in the front-end view and the page has been already visited
                            $.post(wpacu_object.ajax_url, {
                                'action':       wpacu_object.plugin_prefix + '_preload',
                                'page_url':     wpacu_object.page_url,
                                'wpacu_nonce':  wpacu_object.wpacu_ajax_preload_url_nonce,
                                'time_r':       new Date().getTime()
                            }, function() {
                                if ($(wpacuSpinnerElId).length > 0) {
                                    // As the caching has been cleared, hide the notice from the screen
                                    $(wpacuSpinnerElId).addClass('wpacu_hide');
                                }
                            });
                        } else {
                            // Preload (for the admin)
                            $.get(wpacu_object.page_url, {
                                'wpacu_preload': 1,
                                'wpacu_no_frontend_show': 1,
                                'time_r': new Date().getTime()
                            }, function () {
                                // Then, preload (for the guest)
                                $.post(wpacu_object.ajax_url, {
                                    'action':       wpacu_object.plugin_prefix + '_preload',
                                    'page_url':     wpacu_object.page_url,
                                    'wpacu_nonce':  wpacu_object.wpacu_ajax_preload_url_nonce,
                                    'time_r':       new Date().getTime()
                                }, function() {
                                    if ($(wpacuSpinnerElId).length > 0) {
                                        // As the caching has been cleared, hide the notice from the screen
                                        $(wpacuSpinnerElId).addClass('wpacu_hide');
                                    }
                                });
                            });
                        }
                    }, 150);
                });
            },
            wpacuClearAutoptimizeCache: function() {
                if (typeof wpacu_object.autoptimize_not_active !== 'undefined') {
                    return; // Autoptimize is not activated, thus do not continue
                }

                if (wpacu_object.clear_autoptimize_cache == 'false') {
                    console.log(wpacu_object.plugin_title + ': Autoptimize cache clearing is deactivated via "WPACU_DO_NOT_ALSO_CLEAR_AUTOPTIMIZE_CACHE" constant.');
                    return;
                }

                let wpacuAutoptimizeClickEl = '#wp-admin-bar-autoptimize-default li';

                // Autoptimize elements & variables: make sure they are all initialized
                if ($(wpacuAutoptimizeClickEl).length > 0
                    && typeof autoptimize_ajax_object.ajaxurl !== 'undefined'
                    && typeof autoptimize_ajax_object.nonce !== 'undefined') {
                    $.ajax({
                        type     : 'GET',
                        url      : autoptimize_ajax_object.ajaxurl,
                        data     : {'action' : 'autoptimize_delete_cache', 'nonce' : autoptimize_ajax_object.nonce},
                        dataType : 'json',
                        cache    : false,
                        timeout  : 9000,
                        success  : function( cleared ) {},
                        error    : function( jqXHR, textStatus ) {}
                    });
                }
            },
            wpacuClearCacheEnablerCache: function() {
                if (typeof wpacu_object.cache_enabler_not_active !== 'undefined') {
                    return; // Autoptimize is not activated, thus do not continue
                }

                if (wpacu_object.clear_cache_enabler_cache == 'false') {
                    console.log(wpacu_object.plugin_title + ': "Cache Enabler" cache clearing is deactivated via "WPACU_DO_NOT_ALSO_CLEAR_CACHE_ENABLER_CACHE" constant.');
                    return;
                }

                let sendParams = {
                    'action'            : wpacu_object.plugin_prefix + '_cache_enabler_clear_cache',
                    'time_r'            : new Date().getTime(), // avoid any caching
                    'wpacu_nonce'       : wpacu_object.wpacu_ajax_clear_cache_enabler_cache_nonce
                };

                $.get(wpacu_object.ajax_url, sendParams, function (response) {});
            }
        }
    }
    $.fn.wpAssetCleanUpClearCache().init();

    $.fn.wpAssetCleanUp().wpacuTriggerAdjustTextAreaHeightAllTextareas();

    /*
    * [START] Bulk Changes
    */
    $.fn.wpAssetCleanUpBulkChangesArea = function() {
        return {
            actions: function() {
                // Items are marked for removal from the unload list
                // from either "Everywhere" or "Post Type"
                $(document).on('click', '.wpacu_bulk_rule_checkbox, .wpacu_remove_preload', function() {
                    let $wpacuBulkChangeRow = $(this).parents('.wpacu_bulk_change_row');

                    if ($(this).prop('checked')) {
                        $wpacuBulkChangeRow.addClass('wpacu_selected');
                    } else {
                        $wpacuBulkChangeRow.removeClass('wpacu_selected');
                    }
                });

                $(document).on('change', '#wpacu_post_type_select', function() {
                    $('#wpacu_post_type_form').trigger('submit');
                });
            }
        }
    }
    $.fn.wpAssetCleanUpBulkChangesArea().actions();
    /*
    * [END] Bulk Changes
    */
});

(function($){
    $(window).on('load', function() {
        $.fn.wpAssetCleanUp().wpacuCheckSourcesFor404Errors();
    });
})(jQuery);
//
// [END] Core file
//
