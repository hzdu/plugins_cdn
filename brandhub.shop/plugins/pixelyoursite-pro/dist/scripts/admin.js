function pysTagTemplateSelection( tag, container ) {
    // here we are finding option element of tag and
    // if it has property 'locked' we will add class 'locked-tag'
    // to be able to style element in select
    var $option = jQuery( '.pys-tags-pysselect2 option[value="' + tag.id + '"]' );
    if ( $option.attr( 'locked' ) ) {
        jQuery( container ).addClass( 'locked-tag' );
        tag.locked = true;
    }
    return tag.text;
}


jQuery( document ).ready( function ( $ ) {

    function toggleVisibilityBasedOnValue( e ) {
        var targetElement = $( "#" + e.data( "target" ) );
        if ( e.val() === e.data( "value" ) ) {
            targetElement.removeClass( "form-control-hidden" );
        } else {
            targetElement.addClass( "form-control-hidden" );
        }
    }

    function toggleWooEventValueOption() {
        if ( $( 'input[name="pys[core][woo_event_value]"]:checked' ).val() === "price" ) {
            $( ".woo-event-value-option" ).hide();
        } else {
            $( ".woo-event-value-option" ).show();
        }
    }

    function toggleEDDEventValueOption() {
        if ( $( 'input[name="pys[core][edd_event_value]"]:checked' ).val() === "price" ) {
            $( ".edd-event-value-option" ).hide();
        } else {
            $( ".edd-event-value-option" ).show();
        }
    }

    function showRelevantEventTriggerPanel() {

        let triggerGroup = $( ".pys_triggers_wrapper .trigger_group" );
        $( ".event_triggers_panel" ).hide();

        if ( triggerGroup.length > 0 ) {
            $.each( triggerGroup, function ( index, trigger ) {
                trigger = $( trigger );

                let triggerGroupId = trigger.attr( "data-trigger_id" ),
                    eventType = $( "#pys_event_" + triggerGroupId + "_trigger_type" ).val(),
                    panelName = trigger.find( "." + eventType + "_panel" );

                $( panelName ).show();

                if ( eventType === "page_visit" ) {
                    trigger.find( ".url_filter_panel" ).hide();
                } else {
                    trigger.find( ".url_filter_panel" ).show();
                }

                let triggerPanel = $( panelName ),
                    triggerType = triggerPanel.data( "trigger_type" );

                if ( $( '.event_trigger:not([data-trigger_id="-1"])', triggerPanel ).length == 0 ) {
                    cloneAndInsertTrigger( triggerPanel, triggerType );
                }
            } )
        }
    }

    function cloneAndInsertTrigger( triggerPanel, triggerType ) {
        let triggers = $( ".event_trigger", triggerPanel ),
            clonedTrigger = $( triggers[ 0 ] ).clone( true ),
            triggerGroup = triggerPanel.closest( '.trigger_group' );

        if ( triggerGroup.length > 0 ) {
            let triggerId = triggerGroup.attr( "data-trigger_id" ),
                newTriggerTriggerId = parseInt( $( triggers[ triggers.length - 1 ] ).attr( "data-trigger_id" ) ) + 1,
                newTriggerName = "pys[event][triggers][" + triggerId + "][" + triggerType + "_triggers][" + newTriggerTriggerId + "]";

            clonedTrigger.attr( "data-trigger_id", newTriggerTriggerId );
            $( "select", clonedTrigger ).attr( "name", newTriggerName + "[rule]" );
            $( "input", clonedTrigger ).attr( "name", newTriggerName + "[value]" );
            clonedTrigger.css( "display", "block" );
            clonedTrigger.insertBefore( $( ".insert-marker", triggerPanel ) );
        }

    }

    function toggleEventDelay() {
        let triggerGroup = $( ".pys_triggers_wrapper .trigger_group" );

        if ( triggerGroup.length > 0 ) {
            $.each( triggerGroup, function ( index, trigger ) {
                trigger = $( trigger );
                let trigger_type = trigger.find( '.pys_event_trigger_type' ).val();

                if ( trigger_type === "page_visit" ) {
                    trigger.find( ".event-delay" ).css( "display", "flex" );
                } else {
                    trigger.find( ".event-delay" ).css( "display", "none" );
                }

                if ( trigger_type === "number_page_visit" ) {
                    trigger.find( ".trigger_number_page_visit" ).css( "display", "flex" );
                } else {
                    trigger.find( ".trigger_number_page_visit" ).css( "display", "none" );
                }
            } )
        }

    }

    function toggleFacebookPanel() {
        if ( $( "#pys_event_facebook_enabled" ).is( ":checked" ) ) {
            $( "#facebook_panel" ).show();
        } else {
            $( "#facebook_panel" ).hide();
        }
    }

    function toggleFacebookCustomEventType() {
        if ( $( "#pys_event_facebook_event_type" ).val() === "CustomEvent" ) {
            $( ".facebook-custom-event-type" ).css( "visibility", "visible" );
        } else {
            $( ".facebook-custom-event-type" ).css( "visibility", "hidden" );
        }
    }

    function toggleFacebookParamsPanel() {
        if ( $( "#pys_event_facebook_params_enabled" ).is( ":checked" ) ) {
            $( "#facebook_params_panel" ).show();
        } else {
            $( "#facebook_params_panel" ).hide();
        }
    }

    function updateFacebookParamsPanelClass() {
        var eventType = $( "#pys_event_facebook_event_type" ).val();
        $( "#facebook_params_panel" ).removeClass().addClass( eventType );
    }

    function toggleFacebookCustomCurrency() {
        if ( $( "#pys_event_facebook_params_currency" ).val() === "custom" ) {
            $( ".facebook-custom-currency" ).css( "visibility", "visible" );
        } else {
            $( ".facebook-custom-currency" ).css( "visibility", "hidden" );
        }
    }

    function togglePinterestPanel() {
        if ( $( "#pys_event_pinterest_enabled" ).is( ":checked" ) ) {
            $( "#pinterest_panel" ).show();
        } else {
            $( "#pinterest_panel" ).hide();
        }
    }

    function togglePinterestCustomEventType() {
        if ( $( "#pys_event_pinterest_event_type" ).val() === "CustomEvent" ) {
            $( ".pinterest-custom-event-type" ).css( "visibility", "visible" );
        } else {
            $( ".pinterest-custom-event-type" ).css( "visibility", "hidden" );
        }
    }

    function togglePinterestParamsPanel() {
        if ( $( "#pys_event_pinterest_params_enabled" ).is( ":checked" ) ) {
            $( "#pinterest_params_panel" ).show();
        } else {
            $( "#pinterest_params_panel" ).hide();
        }
    }

    function updatePinterestParamsPanelClass() {
        var eventType = $( "#pys_event_pinterest_event_type" ).val();
        $( "#pinterest_params_panel" ).removeClass().addClass( eventType );
    }

    function togglePinterestCustomCurrency() {
        if ( $( "#pys_event_pinterest_params_currency" ).val() === "custom" ) {
            $( ".pinterest-custom-currency" ).css( "visibility", "visible" );
        } else {
            $( ".pinterest-custom-currency" ).css( "visibility", "hidden" );
        }
    }

    function toggleGoogleAnalyticsPanel() {
        if ( $( "#pys_event_ga_enabled" ).is( ":checked" ) ) {
            $( "#analytics_panel" ).show();
        } else {
            $( "#analytics_panel" ).hide();
        }
    }

    function toggleGoogleAdsPanel() {
        if ( $( "#pys_event_google_ads_enabled" ).is( ":checked" ) ) {
            $( "#google_ads_panel" ).show();
        } else {
            $( "#google_ads_panel" ).hide();
        }
    }

    function toggleGoogleAdsCustomEventAction() {
        if ( $( "#pys_event_google_ads_event_action" ).val() === "_custom" ) {
            $( "#pys_event_google_ads_custom_event_action" ).css( "visibility", "visible" );
        } else {
            $( "#pys_event_google_ads_custom_event_action" ).css( "visibility", "hidden" );
        }
    }

    function toggleBingPanel() {
        if ( $( "#pys_event_bing_enabled" ).is( ":checked" ) ) {
            $( "#bing_panel" ).show();
        } else {
            $( "#bing_panel" ).hide();
        }
    }

    function cloneEventTrigger() {
        let cloned = $( '#pys_add_event_trigger .trigger_group' ).clone( true ),
            triggerWrapper = $( '.pys_triggers_wrapper' ),
            triggerGroup = $( '.pys_triggers_wrapper .trigger_group' ),
            triggerId = 0;

        if ( triggerGroup.length > 0 ) {
            triggerId = parseInt( $( triggerGroup[ triggerGroup.length - 1 ] ).attr( "data-trigger_id" ) ) + 1;
        }

        $( '.pys_event_trigger_type', cloned ).attr( {
            name: 'pys[event][triggers][' + triggerId + '][trigger_type]',
            id: 'pys_event_' + triggerId + '_trigger_type',
            value: 'page_visit'
        } );

        $( '.event-delay > input', cloned ).attr( {
            name: 'pys[event][triggers][' + triggerId + '][delay]',
            id: 'pys_event_' + triggerId + '_delay'
        } );

        cloned.attr( 'data-trigger_id', triggerId );
        cloned.css( 'display', 'block' );

        triggerWrapper.append( cloned );
        $( '.pys_event_trigger_type', cloned ).trigger( 'change' );

    }

    function checkTriggerTypeAvailability( group, triggerPanel ) {
        let panelAvailability = group.find( '.' + triggerPanel + '_panel' );

        if ( panelAvailability.length === 0 ) {

            let panelNames;
            if ( triggerPanel === 'number_page_visit' ) {
                panelNames = [ triggerPanel + '_url', triggerPanel + '_conditional' ];
            } else {
                panelNames = [ triggerPanel ];
            }

            panelNames.forEach( function ( panel ) {
                let clonedTrigger = $( '#pys_add_event_trigger .' + panel + '_panel' ).clone( true ),
                    triggerId = group.attr( "data-trigger_id" );

                switch ( panel ) {
                    case 'post_type':
                        $( '.trigger_post_type > select', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][post_type_value]',
                            id: 'pys_event_' + triggerId + '_post_type_value'
                        } );
                        break;

                    case 'number_page_visit_conditional':
                        $( '.conditional_number_visit > select', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][conditional_number_visit]',
                            id: 'pys_event_' + triggerId + '_conditional_number_visit'
                        } );

                        $( '.number_visit > input', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][number_visit]',
                            id: 'pys_event_' + triggerId + '_number_visit'
                        } );
                        break;
                    case 'video_view':
                        $( '.pys_event_video_view_data', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][video_view_data]',
                        } );

                        $( '.pys_video_view_urls_event', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][video_view_urls][]',
                            id: 'pys_event_' + triggerId + '_video_view_urls'
                        } ).addClass( 'pys-tags-pysselect2' );

                        $( '.pys_video_view_triggers_event', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][video_view_triggers][]',
                            id: 'pys_event_' + triggerId + '_video_view_triggers'
                        } ).addClass( 'pys-pysselect2' );

                        $( '.pys_video_view_play_trigger', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][video_view_play_trigger]',
                            id: 'pys_event_' + triggerId + '_video_view_play_trigger'
                        } );

                        let disableWatchVideo = $( '.switcher_event_disable_watch_video', clonedTrigger );

                        disableWatchVideo.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][video_view_disable_watch_video]',
                        } );

                        disableWatchVideo.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][video_view_disable_watch_video]',
                            id: 'pys_event_' + triggerId + '_disable_watch_video'
                        } );

                        disableWatchVideo.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_disable_watch_video'
                        } );

                        break;
                    case 'elementor_form':
                        $( '.pys_event_elementor_form_data', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][elementor_form_data]',
                        } );

                        $( '.pys_elementor_form_urls_event', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][elementor_form_urls][]',
                            id: 'pys_event_' + triggerId + '_elementor_form_urls'
                        } ).addClass( 'pys-tags-pysselect2' );

                        $( '.pys_elementor_form_triggers_event', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][elementor_form][forms][]',
                            id: 'pys_event_' + triggerId + '_elementor_form_triggers'
                        } ).addClass( 'pys-pysselect2' );

                        let disableElementorForm = $( '.switcher_event_disabled_form_action', clonedTrigger );

                        disableElementorForm.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][' + panel + '][disabled_form_action]',
                        } );

                        disableElementorForm.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][' + panel + '][disabled_form_action]',
                            id: 'pys_event_' + triggerId + '_' + panel + '_disabled_form_action'
                        } );

                        disableElementorForm.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_' + panel + '_disabled_form_action'
                        } );

                        break;
                    case 'email_link':

                        $( 'select.pys_email_link_triggers', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][email_link_triggers]',
                            id: 'pys_event_' + triggerId + '_email_link_triggers'
                        } );

                        let disableEmailLink = $( '.switcher_event_email_link_event', clonedTrigger );

                        disableEmailLink.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][email_link_disable_email_event]',
                        } );

                        disableEmailLink.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][email_link_disable_email_event]',
                            id: 'pys_event_' + triggerId + '_email_link_disable_email_event'
                        } );

                        disableEmailLink.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_email_link_disable_email_event'
                        } );

                        break;
                    case 'CF7':
                    case 'fluentform':
                    case 'formidable':
                    case 'forminator':
                    case 'gravity':
                    case 'ninjaform':
                    case 'wpforms':
                    case 'wsform':

                        let form = $( '.select_event_trigger_form_wrapper .trigger_form_select', clonedTrigger ),
                            disableEventWrapper = $( '.switcher_event_form_disable_event', clonedTrigger );

                        form.attr( {
                            name: 'pys[event][triggers][' + triggerId + '][' + panel + '][forms][]',
                            id: 'pys_event_' + triggerId + '_' + panel
                        } );

                        form.addClass( 'pys-pysselect2' );

                        disableEventWrapper.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][' + panel + '][disabled_form_action]',
                        } );

                        disableEventWrapper.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][' + panel + '][disabled_form_action]',
                            id: 'pys_event_' + triggerId + '_' + panel + '_disabled_form_action'
                        } );

                        disableEventWrapper.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_' + panel + '_disabled_form_action'
                        } );

                        break;
                }

                clonedTrigger.css( "display", "block" );
                let inserted = clonedTrigger.insertBefore( group.find( '.insert-marker-trigger.' + panel + '_marker' ) );

                $( '.pys-tags-pysselect2', inserted ).each( function ( index, item ) {
                    if ( !$( this ).data( 'select2' ) ) {
                        $( this ).pysselect2( {
                            tags: true,
                            tokenSeparators: [ ",", " " ],
                            templateSelection: pysTagTemplateSelection
                        } )
                    }
                } )


                $( 'select.pys-pysselect2', inserted ).each( function ( index, item ) {
                    if ( !$( this ).data( 'select2' ) ) {
                        $( this ).pysselect2( {
                            placeholder: $( this ).data( "placeholder" ),
                        } );
                    }
                } );
            } );
        }
    }

    // Initialize popovers
    $( () => {
        $( '[data-toggle="pys-popover"]' ).popover( {
            container: "#pys",
            html: true,
            content: function () {
                return $( "#pys-" + $( this ).data( "popover_id" ) ).html();
            }
        } );
    } );

    // Initialize pysselect2 for select elements
    $( ".pys-pysselect2" ).each( function () {
        $( this ).pysselect2( {
            placeholder: $( this ).data( "placeholder" )
        } );
    } );

    $( ".pys-tags-pysselect2" ).pysselect2( {
        tags: true,
        tokenSeparators: [ ",", " " ],
        templateSelection: pysTagTemplateSelection
    } ).on( 'pysselect2:unselecting', function ( e ) {
        if ( $( e.params.args.data.element ).attr( 'locked' ) ) {
            e.preventDefault();
        }
    } );

    // Controls visibility based on select elements' values
    $( "select.controls-visibility" ).on( "change", function ( e ) {
        toggleVisibilityBasedOnValue( $( this ) );
    } ).each( function ( index, element ) {
        toggleVisibilityBasedOnValue( $( element ) );
    } );

    // Collapse card functionality
    $( ".card-collapse" ).on( 'click', function () {
        var cardBody = $( this ).closest( ".card" ).children( ".card-body" );
        if ( cardBody.hasClass( "show" ) ) {
            cardBody.hide().removeClass( "show" );
        } else {
            cardBody.show().addClass( "show" );
        }
    } );

    // Toggle visibility based on custom switch inputs
    $( ".collapse-control .custom-switch-input" ).on( 'change', function () {
        var $this = $( this ),
            targetElement = $( "." + $this.data( "target" ) );
        if ( targetElement.length > 0 ) {
            if ( $this.prop( "checked" ) ) {
                targetElement.show();
            } else {
                targetElement.hide();
            }
        }
    } ).trigger( "change" );

    toggleWooEventValueOption();
    $( 'input[name="pys[core][woo_event_value]"]' ).on( 'change', function () {
        toggleWooEventValueOption();
    } );

    toggleEDDEventValueOption();
    $( 'input[name="pys[core][edd_event_value]"]' ).on( 'change', function () {
        toggleEDDEventValueOption();
    } );

    $( "#pys_select_all_events" ).on( 'change', function () {
        if ( $( this ).prop( "checked" ) ) {
            $( ".pys-select-event" ).prop( "checked", "checked" );
        } else {
            $( ".pys-select-event" ).prop( "checked", false );
        }
    } );

    toggleEventDelay();
    showRelevantEventTriggerPanel();
    $( ".pys_event_trigger_type" ).on( 'change', function () {
        let triggerGroup = $( this ).closest( '.trigger_group' ),
            panel = $( this ).val();

        checkTriggerTypeAvailability( triggerGroup, panel )
        toggleEventDelay();
        showRelevantEventTriggerPanel();
    } );

    $( ".add-event-trigger" ).on( 'click', function () {
        var triggerPanel = $( this ).closest( ".event_triggers_panel" ),
            triggerType = triggerPanel.data( "trigger_type" );
        cloneAndInsertTrigger( triggerPanel, triggerType );
    } );

    $( ".add-url-filter" ).on( 'click', function () {
        cloneAndInsertTrigger( $( this ).closest( ".event_triggers_panel" ), "url_filter" );
    } );

    $( ".remove-row" ).on( 'click', function ( e ) {
        $( this ).closest( ".row.event_trigger, .row.facebook-custom-param, .row.pinterest-custom-param, .row.google_ads-custom-param" ).remove();
    } );

    toggleFacebookPanel();
    toggleFacebookCustomEventType();
    toggleFacebookParamsPanel();
    updateFacebookParamsPanelClass();
    toggleFacebookCustomCurrency();
    $( "#pys_event_facebook_enabled" ).on( 'click', function () {
        toggleFacebookPanel();
    } );
    $( "#pys_event_facebook_event_type" ).on( 'change', function () {
        toggleFacebookCustomEventType();
        updateFacebookParamsPanelClass();
    } );
    $( "#pys_event_facebook_params_enabled" ).on( 'click', function () {
        toggleFacebookParamsPanel();
    } );
    $( "#pys_event_facebook_params_currency" ).on( 'change', function () {
        toggleFacebookCustomCurrency();
    } );
    $( ".add-facebook-parameter" ).on( 'click', function () {
        var facebookParamsPanel = $( "#facebook_params_panel" ),
            customParams = $( ".facebook-custom-param", facebookParamsPanel ),
            clonedParam = $( customParams[ 0 ] ).clone( true ),
            newParamId = $( customParams[ customParams.length - 1 ] ).data( "param_id" ) + 1,
            newParamName = "pys[event][facebook_custom_params][" + newParamId + "]";

        clonedParam.data( "param_id", newParamId );
        $( "input.custom-param-name", clonedParam ).attr( "name", newParamName + "[name]" );
        $( "input.custom-param-value", clonedParam ).attr( "name", newParamName + "[value]" );
        clonedParam.css( "display", "flex" );
        clonedParam.insertBefore( $( ".insert-marker", facebookParamsPanel ) );
    } );

    togglePinterestPanel();
    togglePinterestCustomEventType();
    togglePinterestParamsPanel();
    updatePinterestParamsPanelClass();
    togglePinterestCustomCurrency();
    $( "#pys_event_pinterest_enabled" ).on( 'click', function () {
        togglePinterestPanel();
    } );
    $( "#pys_event_pinterest_event_type" ).on( 'change', function () {
        togglePinterestCustomEventType();
        updatePinterestParamsPanelClass();
    } );
    $( "#pys_event_pinterest_params_enabled" ).on( 'click', function () {
        togglePinterestParamsPanel();
    } );
    $( "#pys_event_pinterest_params_currency" ).on( 'change', function () {
        togglePinterestCustomCurrency();
    } );
    $( ".add-pinterest-parameter" ).on( 'click', function () {
        var pinterestParamsPanel = $( "#pinterest_params_panel" ),
            customParams = $( ".pinterest-custom-param", pinterestParamsPanel ),
            clonedParam = $( customParams[ 0 ] ).clone( true ),
            newParamId = $( customParams[ customParams.length - 1 ] ).data( "param_id" ) + 1,
            newParamName = "pys[event][pinterest_custom_params][" + newParamId + "]";

        clonedParam.data( "param_id", newParamId );
        $( "input.custom-param-name", clonedParam ).attr( "name", newParamName + "[name]" );
        $( "input.custom-param-value", clonedParam ).attr( "name", newParamName + "[value]" );
        clonedParam.css( "display", "flex" );
        clonedParam.insertBefore( $( ".insert-marker", pinterestParamsPanel ) );
    } );

    toggleGoogleAnalyticsPanel();
    $( "#pys_event_ga_enabled" ).on( 'click', function () {
        toggleGoogleAnalyticsPanel();
    } );

    toggleGoogleAdsPanel();
    toggleGoogleAdsCustomEventAction();
    $( "#pys_event_google_ads_enabled" ).on( 'click', function () {
        toggleGoogleAdsPanel();
    } );
    $( "#pys_event_google_ads_event_action" ).on( 'change', function () {
        toggleGoogleAdsCustomEventAction();
    } );
    $( ".add-google_ads-parameter" ).on( 'click', function () {
        var googleAdsParamsPanel = $( "#google_ads_params_panel" ),
            customParams = $( ".google_ads-custom-param", googleAdsParamsPanel ),
            clonedParam = $( customParams[ 0 ] ).clone( true ),
            newParamId = $( customParams[ customParams.length - 1 ] ).data( "param_id" ) + 1,
            newParamName = "pys[event][google_ads_custom_params][" + newParamId + "]";

        clonedParam.data( "param_id", newParamId );
        $( "input.custom-param-name", clonedParam ).attr( "name", newParamName + "[name]" );
        $( "input.custom-param-value", clonedParam ).attr( "name", newParamName + "[value]" );
        clonedParam.css( "display", "flex" );
        clonedParam.insertBefore( $( ".insert-marker", googleAdsParamsPanel ) );
    } );

    toggleBingPanel();
    $( "#pys_event_bing_enabled" ).on( 'click', function () {
        toggleBingPanel();
    } );


    //add trigger
    $( '#pys-add-trigger .add-trigger' ).on( 'click', function ( e ) {
        e.preventDefault();
        cloneEventTrigger();
    } );

    //check for empty triggers
    if ( $( '.pys_triggers_wrapper .trigger_group' ).length === 0 ) {
        $( '#pys-add-trigger .add-trigger' ).trigger( 'click' );
    }

} );


jQuery( document ).ready( function ( $ ) {
    function enable_merged_ga() {
        $( "#pys_event_ga_ads_enabled" ).is( ":checked" ) ? $( "#merged_analytics_panel" ).show() : $( "#merged_analytics_panel" ).hide()
    }

    enable_merged_ga();
    $( "#pys_event_ga_ads_enabled" ).on( 'click', function () {
        enable_merged_ga()
    } )

    function enable_gtm(){
        $("#pys_event_gtm_enabled").is(":checked")?$("#gtm_panel").show():$("#gtm_panel").hide()
    }
    enable_gtm();
    $("#pys_event_gtm_enabled").on('click',function(){enable_gtm()})

    function check_custom_action_merged() {
        "_custom" === $( "#pys_event_ga_ads_event_action" ).val() ? $( "#pys_event_ga_ads_custom_event_action" ).css( "visibility", "visible" ) : $( "#pys_event_ga_ads_custom_event_action" ).css( "visibility", "hidden" )
    }

    checkStepActive();
    calculateStepsNums();

    $( '.woo_initiate_checkout_enabled input[type="checkbox"]' ).on( 'change', function () {
        checkStepActive()
    } );
    $( '.checkout_progress input[type="checkbox"]' ).on( 'change', function () {
        calculateStepsNums();
    } );

    function calculateStepsNums() {
        var step = 2;
        $( '.checkout_progress' ).each( function ( index, value ) {
            if ( $( value ).find( "input:checked" ).length > 0 ) {
                $( value ).find( ".step" ).text( "STEP " + step + ": " );
                step++;
            } else {
                $( value ).find( ".step" ).text( "" );
            }
        } );
    }

    function checkStepActive() {
        if ( $( '.woo_initiate_checkout_enabled input[type="checkbox"]' ).is( ':checked' ) ) {
            $( '.checkout_progress .custom-switch' ).removeClass( "disabled" );
            $( '.checkout_progress input[type="checkbox"]' ).removeAttr( "disabled" );
            $( '.woo_initiate_checkout_enabled .step' ).text( "STEP 1:" );
        } else {
            $( '.checkout_progress input' ).prop( 'checked', false );
            $( '.checkout_progress .custom-switch' ).addClass( "disabled" );
            $( '.checkout_progress input[type="checkbox"]' ).attr( "disabled", "disabled" );
            $( '.woo_initiate_checkout_enabled .step' ).text( "" );
        }
        calculateStepsNums();
    }

    updatePurchaseFDPValue( $( "#pys_facebook_fdp_purchase_event_fire" ) );
    $( "#pys_facebook_fdp_purchase_event_fire" ).on( 'change', function () {

        updatePurchaseFDPValue( this );
    } );

    updateAddToCartFDPValue( $( "#pys_facebook_fdp_add_to_cart_event_fire" ) );
    $( "#pys_facebook_fdp_add_to_cart_event_fire" ).on( 'change', function () {

        updateAddToCartFDPValue( this );
    } );

    updatePostEventFields();

    $( ".pys_event_trigger_type" ).on( 'change', function () {
        updatePostEventFields();
    } );

    $(document).on('change', '.event_trigger .pys_number_page_visit_triggers, .event_trigger .pys_email_link_triggers', function() {
        if ( $( this ).val() === 'any' ) {
            $( this ).closest( '.event_trigger' ).find( '.trigger_url' ).hide();
        } else {
            $( this ).closest( '.event_trigger' ).find( '.trigger_url' ).show();
        }
    } );

    $( ".action_old,.action_g4,.action_merged_g4" ).on( 'change', function () {
        var value = $( this ).val();
        $( ".ga-param-list, .ga-ads-param-list" ).html( "" );

        for ( i = 0; i < ga_fields.length; i++ ) {
            if ( ga_fields[ i ].name == value ) {
                ga_fields[ i ].fields.forEach( function ( el ) {
                    $( ".ga-param-list" ).append( '<div class="row mb-3 ga_param">\n' +
                        '<label class="col-5 control-label">' + el + '</label>' +
                        '<div class="col-4">' +
                        '<input type="text" name="pys[event][ga_params][' + el + ']" class="form-control">' +
                        '</div>' +
                        ' </div>' );
                    $( ".ga-ads-param-list" ).append( '<div class="row mb-3 ga_ads_param">\n' +
                        '<label class="col-5 control-label">' + el + '</label>' +
                        '<div class="col-4">' +
                        '<input type="text" name="pys[event][ga_ads_params][' + el + ']" class="form-control">' +
                        '</div>' +
                        ' </div>' );
                } );
                break;
            }
        }

        if ( $( 'option:selected', this ).attr( 'group' ) == "Retail/Ecommerce" ) {
            $( ".ga_woo_info" ).attr( 'style', "display: block" );
        } else {
            $( ".ga_woo_info" ).attr( 'style', "display: none" );
        }
        updateGAActionSelector();
    } )

    if ( $( ".action_merged_g4" ).length > 0 ) {
        var value = $( '.action_merged_g4' ).val();
        if ( $( ".ga-ads-param-list .ga_ads_param" ).length == 0 ) {
            for ( i = 0; i < ga_fields.length; i++ ) {
                if ( ga_fields[ i ].name == value ) {
                    ga_fields[ i ].fields.forEach( function ( el ) {
                        $( ".ga-ads-param-list" ).append( '<div class="row mb-3 ga_ads_param">\n' +
                            '<label class="col-5 control-label">' + el + '</label>' +
                            '<div class="col-4">' +
                            '<input type="text" name="pys[event][ga_ads_params][' + el + ']" class="form-control">' +
                            '</div>' +
                            ' </div>' );
                    } );
                    break;
                }
            }
        }
        ;


        if ( $( 'option:selected', this ).attr( 'group' ) == "Retail/Ecommerce" ) {
            $( ".ga_woo_info" ).attr( 'style', "display: block" );
        } else {
            $( ".ga_woo_info" ).attr( 'style', "display: none" );
        }
        updateGAActionSelector();
    }

    function updateGAActionSelector() {
        if ( $( '.action_g4' ).length > 0 ) {
            if ( $( '.action_old' ).val() === "_custom" || $( '.action_old' ).val() === "CustomEvent" ) {
                $( '#ga-custom-action_old' ).css( 'display', 'block' )
            } else {
                $( '#ga-custom-action_old' ).css( 'display', 'none' )
            }
            if ( $( '.action_g4' ).val() === "_custom" || $( '.action_g4' ).val() === "CustomEvent" ) {
                $( '#ga-custom-action_g4' ).css( 'display', 'block' );
            } else {
                $( '#ga-custom-action_g4' ).css( 'display', 'none' )
            }
        }
        if ( $( '.action_merged_g4' ).length > 0 ) {
            if ( $( '.action_merged_g4' ).val() === "_custom" || $( '.action_merged_g4' ).val() === "CustomEvent" ) {
                $( '#ga-ads-custom-action_g4' ).css( 'display', 'block' );
            } else {
                $( '#ga-ads-custom-action_g4' ).css( 'display', 'none' )
            }
        }

    }

    $(".action_gtm").on('change',function () {
        var value = $(this).val();
        $(".gtm-param-list").html("");

        for(i=0;i<gtm_fields.length;i++){
            if(gtm_fields[i].name == value) {
                gtm_fields[i].fields.forEach(function(el){
                    $(".gtm-param-list").append('<div class="row mb-3 gtm_param">\n' +
                        '<label class="col-5 control-label">'+el+'</label>' +
                        '<div class="col-4">' +
                        '<input type="text" name="pys[event][gtm_params]['+el+']" class="form-control">' +
                        '</div>' +
                        ' </div>');
                });
                break;
            }
        }

        if($('option:selected', this).attr('group') == "Retail/Ecommerce") {
            $(".gtm_woo_info").attr('style',"display: block");
        } else {
            $(".gtm_woo_info").attr('style',"display: none");
        }
        updateGTMActionSelector();
    })

    if($(".action_gtm").length > 0) {
        var value = $('.action_gtm').val();
        if($(".gtm-param-list .gtm_param").length == 0) {
            for(i=0;i<gtm_fields.length;i++){
                if(gtm_fields[i].name == value) {
                    gtm_fields[i].fields.forEach(function(el){
                        $(".gtm-param-list").append('<div class="row mb-3 gtm_param">\n' +
                            '<label class="col-5 control-label">'+el+'</label>' +
                            '<div class="col-4">' +
                            '<input type="text" name="pys[event][gtm_params]['+el+']" class="form-control">' +
                            '</div>' +
                            ' </div>');
                    });
                    break;
                }
            }
        };



        if($('option:selected', this).attr('group') == "Retail/Ecommerce") {
            $(".gtm_woo_info").attr('style',"display: block");
        } else {
            $(".gtm_woo_info").attr('style',"display: none");
        }
        updateGTMActionSelector();
    };


    function updateGTMActionSelector() {
        if($('.action_gtm').length > 0) {
            if($('.action_gtm').val() === "_custom" || $('.action_gtm').val() === "CustomEvent") {
                $('#gtm-custom-action_g4').css('display','block');
            } else {
                $('#gtm-custom-action_g4').css('display','none')
            }
        }
    }

    $('.gtm-custom-param-list').on("click",'.gtm-custom-param .remove-row',function(){
        var currentCount = $(".gtm-custom-param-list .gtm-custom-param").length;
        var messageContainer = $("#custom-param-message");
        $(this).parents('.gtm-custom-param').remove();
        if (messageContainer.length && $(".gtm-custom-param-list .gtm-custom-param").length < 5) {
            messageContainer.remove();
        }
    });
    $('.add-gtm-custom-parameter').on('click',function(){
        var currentCount = $(".gtm-custom-param-list .gtm-custom-param").length;
        var messageContainer = $("#custom-param-message");
        if (currentCount < 5) {
            var index = currentCount + 1;
            $(".gtm-custom-param-list").append('<div class="row mt-3 gtm-custom-param" data-param_id="'+index+'">' +
                '<div class="col">' +
                '<div class="row">' +
                '<div class="col-1"></div>' +
                '<div class="col-4">' +
                '<input type="text" placeholder="Enter name" class="form-control custom-param-name"' +
                ' name="pys[event][gtm_custom_params]['+index+'][name]"' +
                ' value="">' +
                '</div>' +
                '<div class="col-4">' +
                '<input type="text" placeholder="Enter value" class="form-control custom-param-value"' +
                ' name="pys[event][gtm_custom_params]['+index+'][value]"' +
                ' value="">' +
                '</div>' +
                '<div class="col-2">' +
                '<button type="button" class="btn btn-sm remove-row">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            if (messageContainer.length) {
                messageContainer.remove();
            }
        } else {
            if (messageContainer.length) {
                messageContainer.text("You can add up to 5 custom parameters only.");
            } else {
                $(".gtm-custom-param-list").after('<p id="custom-param-message" style="color: red;">You can add up to 5 custom parameters only.</p>');
            }
        }

    });

    $('.ga-custom-param-list').on("click",'.ga-custom-param .remove-row',function(){
       $(this).parents('.ga-custom-param').remove();
    });

    $( '.add-ga-custom-parameter' ).on( 'click', function () {
        var index = $( ".ga-custom-param-list .ga-custom-param" ).length + 1;
        $( ".ga-custom-param-list" ).append( '<div class="row mt-3 ga-custom-param" data-param_id="' + index + '">' +
            '<div class="col">' +
            '<div class="row">' +
            '<div class="col-1"></div>' +
            '<div class="col-4">' +
            '<input type="text" placeholder="Enter name" class="form-control custom-param-name"' +
            ' name="pys[event][ga_custom_params][' + index + '][name]"' +
            ' value="">' +
            '</div>' +
            '<div class="col-4">' +
            '<input type="text" placeholder="Enter value" class="form-control custom-param-value"' +
            ' name="pys[event][ga_custom_params][' + index + '][value]"' +
            ' value="">' +
            '</div>' +
            '<div class="col-2">' +
            '<button type="button" class="btn btn-sm remove-row">' +
            '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' );
    } );

    $( '.add-ga-ads-custom-parameter' ).on( 'click', function () {
        var index = $( ".ga-ads-custom-param-list .ga-ads-custom-param" ).length + 1;
        $( ".ga-ads-custom-param-list" ).append( '<div class="row mt-3 ga-ads-custom-param" data-param_id="' + index + '">' +
            '<div class="col">' +
            '<div class="row">' +
            '<div class="col-1"></div>' +
            '<div class="col-4">' +
            '<input type="text" placeholder="Enter name" class="form-control custom-param-name"' +
            ' name="pys[event][ga_ads_custom_params][' + index + '][name]"' +
            ' value="">' +
            '</div>' +
            '<div class="col-4">' +
            '<input type="text" placeholder="Enter value" class="form-control custom-param-value"' +
            ' name="pys[event][ga_ads_custom_params][' + index + '][value]"' +
            ' value="">' +
            '</div>' +
            '<div class="col-2">' +
            '<button type="button" class="btn btn-sm remove-row">' +
            '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' );
    } );

    $( "#import_events_file" ).on( 'change', function () {
        var fd = new FormData();
        fd.append( "_wpnonce", $( "#import_events_file_nonce" ).val() );
        fd.append( "action", "pys_import_events" );
        fd.append( $( this ).attr( "name" ), $( this ).prop( 'files' )[ 0 ] );

        $.ajax( {
            url: ajaxurl,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function ( data ) {
                if ( data.success ) {
                    location.reload();
                } else {
                    alert( data.data )
                }

            }, error: function ( data ) {
                console.log( data );
            }
        } );
    } );


    function updatePostEventFields() {
        const arr_form_trigger = [ "CF7", "fluentform", "formidable", "forminator", "gravity", "ninjaform", "wpforms", "wsform" ],
            triggerGroup = $( ".trigger_group" ),
            fire_once = $( "#fire_event_once" );

        let available_triggers = [];
        fire_once.show();

        if ( triggerGroup.length > 0 ) {
            $.each( triggerGroup, function ( index, trigger ) {
                trigger = $( trigger );

                let url_filter = trigger.find( ".url_filter_panel" ),
                    trigger_type = trigger.find( '.pys_event_trigger_type' ).val(),
                    embedded_video_view = trigger.find( ".embedded_video_view" ),
                    post_type = trigger.find( ".trigger_post_type" ),
                    post_type_error = trigger.find( ".post_type_error" ),
                    video_view_error = trigger.find( ".video_view_error" ),
                    elementor_form = trigger.find( ".elementor_form" ),
                    elementor_form_error = trigger.find( ".elementor_form_error" );

                available_triggers.push( trigger_type );

                trigger.find( ".trigger_number_page_visit" ).css( "display", "none" );
                if ( trigger_type == "post_type" ) {
                    trigger.find( ".event-delay" ).css( "display", "flex" );
                    post_type.show();
                    url_filter.hide();
                    post_type_error.show();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide()
                } else if ( trigger_type == "number_page_visit" ) {
                    trigger.find( ".trigger_number_page_visit" ).css( "display", "flex" );
                    url_filter.hide();
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else if(trigger_type == "home_page") {
                    trigger.find( ".event-delay" ).css( "display", "flex" );
                    url_filter.hide();
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else if(trigger_type == "elementor_form") {
                    url_filter.hide();
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.show();
                    elementor_form_error.hide();
                } else if ( trigger_type == "video_view" ) {
                    url_filter.hide();
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.show();
                    video_view_error.hide();
                } else if($.inArray(trigger_type, arr_form_trigger) != -1 || trigger_type == "email_link") {
                    url_filter.hide();
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else {
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                }
            } )
        }

        if ( available_triggers.length > 0 ) {

            let i = available_triggers.indexOf( 'number_page_visit' ),
                number_page_visit = [];

            while ( i !== -1 ) {
                number_page_visit.push( i );
                i = available_triggers.indexOf( 'number_page_visit', i + 1 );
            }

            if ( available_triggers.length === number_page_visit.length ) {
                fire_once.hide();
            }
        }
    }

    function updateAddToCartFDPValue( input ) {
        if ( $( input ).val() == "scroll_pos" ) {
            $( "#fdp_add_to_cart_event_fire_scroll_block" ).show();
            $( "#pys_facebook_fdp_add_to_cart_event_fire_css" ).hide()
        } else if ( $( input ).val() == "css_click" ) {
            $( "#fdp_add_to_cart_event_fire_scroll_block" ).hide();
            $( "#pys_facebook_fdp_add_to_cart_event_fire_css" ).show()
        } else {
            $( "#fdp_add_to_cart_event_fire_scroll_block" ).hide();
            $( "#pys_facebook_fdp_add_to_cart_event_fire_css" ).hide()
        }
    }

    function updatePurchaseFDPValue( input ) {
        if ( $( input ).val() == "scroll_pos" ) {
            $( "#fdp_purchase_event_fire_scroll_block" ).show();
            $( "#pys_facebook_fdp_purchase_event_fire_css" ).hide()
        } else if ( $( input ).val() == "css_click" ) {
            $( "#fdp_purchase_event_fire_scroll_block" ).hide();
            $( "#pys_facebook_fdp_purchase_event_fire_css" ).show()
        } else {
            $( "#fdp_purchase_event_fire_scroll_block" ).hide();
            $( "#pys_facebook_fdp_purchase_event_fire_css" ).hide()
        }
    }

    function updateGAFields() {
        var allValues = $( "#pys_ga_pixel_id_event option" ).map( function () {
            return $( this ).val();
        } ).get();
        var selectedValues = $( "#pys_ga_pixel_id_event" ).val();

        var hasAWElement = selectedValues && ( selectedValues.some( value => value.startsWith( 'AW' ) ) || ( selectedValues.includes( 'all' ) && allValues.some( value => value.startsWith( 'AW' ) ) ) );
        if ( hasAWElement ) {
            $( '.conversion_label' ).css( 'display', 'flex' );
        } else {
            $( '.conversion_label' ).hide();
        }

    }

    if ( $( "#pys_ga_pixel_id_event" ).length > 0 ) {
        $( "#pys_ga_pixel_id_event" ).on( 'change', function () {
            updateGAFields()
        } )
        updateGAFields();
    }

    function updateGAADSFields() {
        var allValues = $( "#pys_ga_ads_pixel_id_event option" ).map( function () {
            return $( this ).val();
        } ).get();
        var selectedValues = $( "#pys_ga_ads_pixel_id_event" ).val();

        var hasAWElement = selectedValues && ( selectedValues.some( value => value.startsWith( 'AW' ) ) || ( selectedValues.includes( 'all' ) && allValues.some( value => value.startsWith( 'AW' ) ) ) );
        if ( hasAWElement ) {
            $( '.conversion_label' ).css( 'display', 'flex' );
        } else {
            $( '.conversion_label' ).hide();
        }

    }

    if ( $( "#pys_ga_ads_pixel_id_event" ).length > 0 ) {
        $( "#pys_ga_ads_pixel_id_event" ).on( 'change', function () {
            updateGAADSFields()
        } )
        updateGAADSFields();
    }


    $( document ).on( 'change', '.ga_tracking_id,#pys_ga_tracking_id_0', function () {
        let text = 'We identified this tag as a Google Analytics Universal property.'
        if ( $( this ).val().indexOf( 'G' ) === 0 ) {
            text = 'We identified this tag as a GA4 property.';
        }
        $( this ).next().text( text );
    } );

    function renderField( data, wrapClass = "row mb-3", labelClass = "col-5 control-label" ) {
        if ( data.type === "input" ) {
            return '<div class="' + wrapClass + '">' +
                '<label class="' + labelClass + '">' + data.label + '</label>' +
                '<div class="col-4">' +
                '<input type="text" name="' + data.name + '" value="" placeholder="" class="form-control">' +
                '</div></div>';
        }
    }

    /**
     * TikTok Edit Event
     */
    if ( $( '#pys_event_tiktok_event_type' ).length > 0 ) {
        $( '#pys_event_tiktok_event_type' ).on( 'change', function () {
            updateTikTokEventParamsFrom()
        } )

        $( '#pys_event_tiktok_params_enabled' ).on( 'change', function () {
            updateTiktokParamFormVisibility()
        } )

        if ( $( '#pys_event_tiktok_event_type' ).val() === 'CustomEvent' ) {
            $( '.tiktok-custom-event-type' ).css( 'display', 'block' )
        } else {
            $( '.tiktok-custom-event-type' ).css( 'display', 'none' )
        }
        updateTiktokParamFormVisibility();

        $( '.tiktok-custom-param-list' ).on( "click", '.tiktok-custom-param .remove-row', function () {
            $( this ).parents( '.tiktok-custom-param' ).remove();
        } );

        $( '.add-tiktok-custom-parameter' ).on( 'click', function () {
            var index = $( ".tiktok-custom-param-list .tiktok-custom-param" ).length + 1;
            $( ".tiktok-custom-param-list" ).append( '<div class="row mt-3 tiktok-custom-param" data-param_id="' + index + '">' +
                '<div class="col">' +
                '<div class="row">' +
                '<div class="col-1"></div>' +
                '<div class="col-4">' +
                '<input type="text" placeholder="Enter name" class="form-control custom-param-name"' +
                ' name="pys[event][tiktok_custom_params][' + index + '][name]"' +
                ' value="">' +
                '</div>' +
                '<div class="col-4">' +
                '<input type="text" placeholder="Enter value" class="form-control custom-param-value"' +
                ' name="pys[event][tiktok_custom_params][' + index + '][value]"' +
                ' value="">' +
                '</div>' +
                '<div class="col-2">' +
                '<button type="button" class="btn btn-sm remove-row">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' );
        } );
    }

    function updateTikTokEventParamsFrom() {
        let $select = $( '#pys_event_tiktok_event_type' );
        if ( $select.length === 0 ) return;
        let $panel = $( '#tiktok_params_panel .standard' );
        let $custom = $( '.tiktok-custom-event-type' );

        $panel.html( '' )
        if ( $select.val() === 'CustomEvent' ) {
            $custom.css( 'display', 'block' )
        } else {
            $custom.css( 'display', 'none' )
            let fields = $select.find( ":selected" ).data( 'fields' )
            fields.forEach( function ( item ) {
                $panel.append( renderField( item ) )
            } )
        }
    }

    function updateTiktokParamFormVisibility() {
        if ( $( '#pys_event_tiktok_params_enabled:checked' ).length > 0 ) {
            $( '#tiktok_params_panel' ).css( 'display', 'block' )
        } else {
            $( '#tiktok_params_panel' ).css( 'display', 'none' )
        }
    }

    function updateTikTokPanelVisibility() {
        if ( $( "#pys_event_tiktok_enabled" ).is( ":checked" ) ) {
            $( "#tiktok_panel" ).show()
        } else {
            $( "#tiktok_panel" ).hide()
        }
    }

    updateTikTokPanelVisibility()
    $( "#pys_event_tiktok_enabled" ).on( 'click', function () {
        updateTikTokPanelVisibility()
    } )


    $( "select.pys_hidden_content" ).each( function ( el ) {
        hideShowHiddenData( $( this ) )
    } )

    $( "select.pys_hidden_content" ).on( "change", function () {
        hideShowHiddenData( $( this ) )
    } )

    function hideShowHiddenData( $elSwitch ) {
        var point = $elSwitch.data( "hidden" );
        var value = $elSwitch.val();

        $( point ).each( function () {
            if ( $( this ).data( "hide_value" ) === value ) {
                $( this ).show();
            } else {
                $( this ).hide()
            }
        } )
    }

    $( "#pys_core_automatic_events_enabled" ).on( "change", function () {
        var $headSwitch = $( this ).parents( ".card-header" ).find( ".card-collapse" )
        var $body = $( this ).parents( ".card" ).children( ".card-body" )
        if ( $( this ).is( ':checked' ) ) {
            $headSwitch.css( "display", "block" )
        } else {
            $body.removeClass( "show" )
            $body.css( "display", "none" )
            $headSwitch.css( "display", "none" )
        }
    } )

    $( "#pys .copy_text" ).on( "click", function () {

        navigator.clipboard.writeText( $( this ).text() );
    } )

    $( "#pys .pys_utm_builder .utm, #pys .pys_utm_builder .site_url" ).on( "input", function () {

        updateBuilderUrl()
    } )

    function updateBuilderUrl() {
        let utms = ""
        let urls = $( "#pys .pys_utm_builder .site_url" ).val()
        $( "#pys .pys_utm_builder .utm" ).each( function () {
            if ( $( this ).val() != "" ) {
                if ( utms === "" ) {
                    utms = $( this ).data( 'type' ) + "=" + $( this ).val()
                } else {
                    utms += "&" + $( this ).data( 'type' ) + "=" + $( this ).val()
                }
            }
        } )
        if ( utms != "" ) {
            utms = "?" + utms
        }
        $( "#pys .build_utms_with_url" ).text( urls + utms )
        $( "#pys .build_utms" ).text( utms )
    }

    updateBuilderUrl()
    $body = $( 'body' );
    $body.on( 'change', '.plate #pys_ga_use_server_api', function () {
        if ( this.checked == '1' ) {
            $( this ).parents( '.plate' ).find( '#pys_ga_server_access_api_token_0' ).removeAttr( 'disabled' )
        } else {
            $( this ).parents( '.plate' ).find( '#pys_ga_server_access_api_token_0' ).attr( 'disabled', 'disabled' )
        }
    } )

    /**
     * Video trigger handler
     */
    $( document ).on( 'click', '.pys-scan-video', function ( e ) {
        let event_trigger = $( this ).closest( '.embedded_video_view' ),
            urls = event_trigger.find( '.pys_video_view_urls_event' ).val(),
            error = event_trigger.find( '.video_view_error' ),
            message = error.find( '.event_error' ),
            button = $( this ),
            video_view_triggers = event_trigger.find( '.pys_video_view_triggers' );
        error.hide();

        if ( urls.length > 0 ) {

            let site_url = window.location.origin,
                valid = true,
                not_valid_urls = [],
                not_valid_message = 'The URLs " %s " are not related to the site: ' + site_url + '. Please enter valid video URLs';

            urls.forEach( function ( url ) {
                if ( !url.startsWith( site_url ) ) {
                    valid = false;
                    not_valid_urls.push( url );
                }
            } )

            if ( !valid ) {
                not_valid_message = not_valid_message.replace( '%s', not_valid_urls.join( ', ' ) );
                message.html( not_valid_message );
                error.show();
                return;
            }
            button.html( 'Scanning...' ).prop( 'disabled', true );

            let data = {
                _wpnonce: $( '#_wpnonce' ).val(),
                action: 'pys_scan_video',
                urls: urls
            };

            $.ajax( {
                url: ajaxurl,
                data: data,
                type: 'POST',
                success: function ( data ) {
                    if ( data.success ) {
                        event_trigger.find( '.pys_event_video_view_data' ).val( JSON.stringify( data.data ) );
                        let video_triggers = event_trigger.find( '.pys_video_view_triggers_event' );
                        video_triggers.find( 'option' ).remove();
                        if ( data.data.length > 0 ) {
                            Object.entries( data.data ).forEach( function ( [ key, item ] ) {
                                video_triggers.append( $( '<option>', {
                                    value: item.id,
                                    text: item.title
                                } ) );
                            } )
                            video_view_triggers.show();
                            video_triggers.pysselect2( 'open' );
                        } else {
                            message.html( 'These URLs do not contain any videos' );
                            error.show();
                            video_view_triggers.hide();
                        }
                    } else {
                        message.html( 'Something went wrong' );
                        error.show();
                        video_view_triggers.hide();
                    }
                },
                error: function ( data ) {
                    message.html( data.responseJSON.data );
                    error.show();
                    video_view_triggers.hide();
                    console.log( data );
                },
                complete: function () {
                    button.html( button.val() ).prop( 'disabled', false );
                }
            } );
        } else {
            message.html( 'Please enter video URLs' );
            error.show();
            video_view_triggers.hide();
        }
    } )

    /**
     * Elementor forms handler
     */
    $( document ).on( 'click', '.pys-scan-elementor-form', function ( e ) {
        let event_trigger = $( this ).closest( '.elementor_form' ),
            urls = event_trigger.find( '.pys_elementor_form_urls_event' ).val(),
            error = event_trigger.find( '.elementor_form_error' ),
            message = error.find( '.event_error' ),
            button = $( this ),
            elementor_form_triggers = event_trigger.find( '.pys_elementor_form_triggers' );

        error.hide();

        if ( urls.length > 0 ) {

            let site_url = window.location.origin,
                valid = true,
                not_valid_urls = [],
                not_valid_message = 'The URLs " %s " are not related to the site: ' + site_url + '. Please enter valid Elementor form URLs';

            urls.forEach( function ( url ) {
                if ( !url.startsWith( site_url ) ) {
                    valid = false;
                    not_valid_urls.push( url );
                }
            } )

            if ( !valid ) {
                not_valid_message = not_valid_message.replace( '%s', not_valid_urls.join( ', ' ) );
                message.html( not_valid_message );
                error.show();
                return;
            }
            button.html( 'Scanning...' ).prop( 'disabled', true );

            let data = {
                _wpnonce: $( '#_wpnonce' ).val(),
                action: 'pys_scan_elementor_form',
                urls: urls
            };

            $.ajax( {
                url: ajaxurl,
                data: data,
                type: 'POST',
                success: function ( data ) {
                    if ( data.success ) {

                        $( '.pys_event_elementor_form_data' ).val( JSON.stringify( data.data ) );
                        let form_triggers = event_trigger.find( '.pys_elementor_form_triggers_event' );
                        form_triggers.find( 'option' ).remove();
                        if ( data.data.length > 0 ) {
                            Object.entries( data.data ).forEach( function ( [ key, item ] ) {
                                form_triggers.append( $( '<option>', {
                                    value: item.id,
                                    text: item.title + ' - ID  ' + item.id
                                } ) );
                            } )
                            elementor_form_triggers.show();
                            form_triggers.pysselect2( 'open' );
                        } else {
                            message.html( 'These URLs do not contain any forms' );
                            error.show();
                            elementor_form_triggers.hide();
                        }
                    } else {
                        message.html( 'Something went wrong' );
                        error.show();
                        elementor_form_triggers.hide();
                    }
                },
                error: function ( data ) {
                    message.html( data.responseJSON.data );
                    error.show();
                    elementor_form_triggers.hide();
                    console.log( data );
                },
                complete: function () {
                    button.html( button.val() ).prop( 'disabled', false );
                }
            } );
        } else {
            message.html( 'Please enter form pages URLs' );
            error.show();
            elementor_form_triggers.hide();
        }
    } )

    //Remove trigger
    $( document ).on( 'click', '.pys_triggers_wrapper .remove-row', function () {
        $( this ).closest( '.trigger_group' ).remove();
    } )

    const inputWrapperList = document.getElementsByClassName('input-number-wrapper');

    for(let wrapper of inputWrapperList) {
        const input = wrapper.querySelector('input');
        const incrementation = +input.step || 1;

        wrapper.querySelector('.increase').addEventListener('click', function(e) {
            e.preventDefault();
            incInputNumber(input, incrementation);
        });

        wrapper.querySelector('.decrease').addEventListener('click', function(e) {
            e.preventDefault();
            incInputNumber(input, "-" + incrementation);
        });
    }

    function incInputNumber(input, step) {
        if(!input.disabled) {
            let val = +input.value;

            if (isNaN(val)) val = 0
            val += +step;

            if(input.max && val > input.max) {
                val = input.max;
            } else if (input.min && val < input.min) {
                val = input.min;
            } else if (val < 0) {
                val = 0;
            }

            input.value = val;
            input.setAttribute("value", val);
        }
    }

    $('#pys_event_title').on( "change", function ( e ) {
        const value = $(this).val();
        $.ajax( {
            url: ajaxurl,
            data: {
                action: 'get_transform_title',
                _wpnonce: $( '#get_transform_title_wpnonce' ).val(),
                title: value
            },
            type: 'POST',
            success: function ( data ) {
                $('#manual_custom_object_name').text(data.data.title);
                $('input#pys_event_gtm_custom_object_name').val(data.data.title);
            }, error: function ( data ) {
                console.log( data );
            }
        } );

    });

    $('input#pys_event_gtm_custom_object_name').on( "input", function ( e ) {
        const value = $(this).val();
        $('#manual_custom_object_name').text(value);
    });
} );
