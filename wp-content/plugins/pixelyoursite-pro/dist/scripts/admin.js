const ADMIN_BAR_HEIGHT = 32;

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

    $(".password-block").each(function() {
        maskPassword($(this));
    });
    $(".maskedInput").on("input", function() {
        updatePassword($(this));
    });
    function toggleVisibilityBasedOnValue( e ) {
        let targetElement = $( "#" + e.data( "target" ) );
        if ( e.val() === e.data( "value" ) ) {
            targetElement.slideDown( 400 );
            setTimeout( () => targetElement.removeClass( "form-control-hidden" ), 400 );
        } else {
            targetElement.slideUp( 400 );
            setTimeout( () => targetElement.addClass( "form-control-hidden" ), 400 );
        }
    }

    function toggleWooEventValueOption() {
        if ( $( 'input[name="pys[core][woo_event_value]"]:checked' ).val() === "price" ) {
            $( ".woo-event-value-option" ).slideUp( 400 );
        } else {
            $( ".woo-event-value-option" ).slideDown( 400 );
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

            const $inputWrapperList = clonedTrigger.find( '.input-number-wrapper' );
            $inputWrapperList.each( function () {
                addInputNumberListener( $( this ) );
            } );

            clonedTrigger.insertBefore( $( ".insert-marker", triggerPanel ) );
        }
    }

    function toggleTriggerGroupHead( triggerHead, panel ) {
        if ( triggerHead.length > 0 ) {
            triggerHead.each( function () {
                $( this ).attr( 'class', 'trigger_group_head trigger_group_' + panel );
            } )
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
        let event_facebook_enabled = $( "#pys_event_facebook_enabled" ),
            card = event_facebook_enabled.closest( '.card' ),
            configured = +card.attr( 'data-configured' ) === 1,
            pixel_status = card.find( '.custom-event-pixel-status .pixel-status' );

        if ( configured ) {
            if ( event_facebook_enabled.is( ":checked" ) ) {
                $( "#facebook_panel" ).removeClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).show();
                pixel_status.find( '.pixel-disabled' ).hide();
            } else {
                $( "#facebook_panel" ).addClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).hide();
                pixel_status.find( '.pixel-disabled' ).show();
            }
        } else {
            $( '.facebook-not-configured-error' ).show();
            $( "#facebook_panel" ).addClass( 'disabled' );
            event_facebook_enabled.prop( 'checked', false ).prop( 'disabled', true );
        }
    }

    function toggleFacebookCustomEventType() {
        if ( $( "#pys_event_facebook_event_type" ).val() === "CustomEvent" ) {
            $( ".facebook-custom-event-type" ).slideDown( 400 );
        } else {
            $( ".facebook-custom-event-type" ).slideUp( 400 );
        }
    }

    function toggleFacebookParamsPanel() {
        if ( $( "#pys_event_facebook_params_enabled" ).is( ":checked" ) ) {
            $( "#facebook_params_panel" ).show();
            updateFacebookParamsPanelClass( 0 );
        } else {
            $( "#facebook_params_panel" ).slideUp( 400 );
        }
    }

    function updateFacebookParamsPanelClass( delay = 200 ) {
        $( "#facebook_params_panel" ).slideUp( delay, function () {
            if ( $( "#pys_event_facebook_params_enabled" ).is( ":checked" ) ) {
                let eventType = $( "#pys_event_facebook_event_type" ).val();
                $( "#facebook_params_panel" ).removeClass().addClass( eventType );

                $( this ).slideDown( 400 );
            }
        } );
    }

    function toggleFacebookCustomCurrency() {
        if ( $( "#pys_event_facebook_params_currency" ).val() === "custom" ) {
            $( ".facebook-custom-currency" ).slideDown( 400 );
        } else {
            $( ".facebook-custom-currency" ).slideUp( 400 );
        }
    }

    function togglePinterestPanel() {
        let event_pinterest_enabled = $( "#pys_event_pinterest_enabled" ),
            card = event_pinterest_enabled.closest( '.card' ),
            configured = +card.attr('data-configured') === 1,
            pixel_status = card.find( '.custom-event-pixel-status .pixel-status' );

        if ( configured ) {
            if ( event_pinterest_enabled.is( ":checked" ) ) {
                $( "#pinterest_panel" ).removeClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).show();
                pixel_status.find( '.pixel-disabled' ).hide();
            } else {
                $( "#pinterest_panel" ).addClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).hide();
                pixel_status.find( '.pixel-disabled' ).show();
            }
        } else {
            $('.pinterest-not-configured-error').show();
            $( "#pinterest_panel" ).addClass( 'disabled' );
            event_pinterest_enabled.prop( 'checked', false ).prop( 'disabled', true );
        }
    }

    function togglePinterestCustomEventType() {
        if ( $( "#pys_event_pinterest_event_type" ).val() === "partner_defined" ) {
            $( ".pinterest-custom-event-type" ).slideDown( 400 );
        } else {
            $( ".pinterest-custom-event-type" ).slideUp( 400 );
        }
    }

    function togglePinterestParamsPanel() {
        if ( $( "#pys_event_pinterest_params_enabled" ).is( ":checked" ) ) {
            $( "#pinterest_params_panel" ).slideDown( 400 );
        } else {
            $( "#pinterest_params_panel" ).slideUp( 400 );
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
        let event_bing_enabled = $( "#pys_event_bing_enabled" ),
            card = event_bing_enabled.closest( '.card' ),
            configured = +card.attr('data-configured') === 1,
            pixel_status = card.find( '.custom-event-pixel-status .pixel-status' );

        if ( configured ) {
            if ( event_bing_enabled.is( ":checked" ) ) {
                $( "#bing_panel" ).removeClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).show();
                pixel_status.find( '.pixel-disabled' ).hide();
            } else {
                $( "#bing_panel" ).addClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).hide();
                pixel_status.find( '.pixel-disabled' ).show();
            }
        } else {
            $('.bing-not-configured-error').show();
            $( "#bing_panel" ).addClass( 'disabled' );
            event_bing_enabled.prop( 'checked', false ).prop( 'disabled', true );
        }
    }

    function cloneEventCondition() {
        let cloned = $( '#pys_add_event_condition .condition_group' ).clone( true ),
            conditionWrapper = $( '.pys_conditions_wrapper' ),
            conditionGroup = $( '.pys_conditions_wrapper .condition_group' ),
            conditionId = 0;

        if ( conditionGroup.length > 0 ) {
            conditionId = parseInt( $( conditionGroup[ conditionGroup.length - 1 ] ).attr( "data-condition_id" ) ) + 1;
        }
        $( '.pys_event_condition_type', cloned ).attr( {
            name: 'pys[event][conditions][' + conditionId + '][condition_type]',
            id: 'pys_event_' + conditionId + '_condition_type',
            value: 'url_filters'
        } );


        cloned.attr( 'data-condition_id', conditionId );
        cloned.css( 'display', 'block' );

        conditionWrapper.append( cloned );
        $( '.pys_event_condition_type', cloned ).trigger( 'change' );
    }

    function checkConditionTypeAvailability( group, triggerPanel ) {
        let panelAvailability = group.find( '.' + triggerPanel + '_panel' );
        group.find( '.event_conditions_panel' ).hide();
        if ( panelAvailability.length === 0 ) {
            let clonedCondition = $( '#pys_add_event_condition .' + triggerPanel + '_panel' ).clone( true ),
            conditionId = group.attr( "data-condition_id" );
            switch ( triggerPanel ) {
                case 'url_filters':
                case 'url_parameters':
                case 'landing_page':
                case 'source':
                    $( 'select', clonedCondition ).attr( {
                        name: 'pys[event][conditions][' + conditionId + '][' + triggerPanel + '][condition_rule]',
                        id: 'pys_event_' + conditionId + '_'+ triggerPanel + '_condition_rule'
                    } );
                    $( 'input[type="text"]', clonedCondition ).attr( {
                        name: 'pys[event][conditions][' + conditionId + '][' + triggerPanel + '][condition_value]',
                        id: 'pys_event_' + conditionId + '_'+ triggerPanel + '_condition_value'
                    } );
                    break;
                case 'device' :

                    $( 'input[type="radio"]', clonedCondition ).each(function(index) {
                        const newId = 'pys_event_' + conditionId + '_device_' + index;
                        const newName = 'pys[event][conditions][' + conditionId + '][device]';
                        $(this).attr({
                            id: newId,
                            name: newName
                        });
                        $(this).next('.radio-checkbox-label').attr('for', newId);
                    });
                    break;
                case 'user_role':
                    $( 'select', clonedCondition ).attr( {
                        name: 'pys[event][conditions][' + conditionId + '][user_role][]',
                        id: 'pys_event_' + conditionId + '_user_role'
                    } );
                    $( 'input[type="hidden"]', clonedCondition ).attr( {
                        name: 'pys[event][conditions][' + conditionId + '][user_role][]',
                    } );
                    break;
            }

            clonedCondition.show();
            let inserted = group.append(clonedCondition);
            $( '.pys-role-pysselect2', inserted ).each( function ( index, item ) {
                $(this).pysselect2()
            });
        } else {
            panelAvailability.show();
        }
    }

    function cloneEventTrigger() {
        let cloned = $( '#pys_add_event_trigger .trigger_group' ).clone( true ),
            triggerWrapper = $( '.pys_triggers_wrapper .insert-marker-add-trigger' ),
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

        $( '.event-delay input', cloned ).attr( {
            name: 'pys[event][triggers][' + triggerId + '][delay]',
            id: 'pys_event_' + triggerId + '_delay'
        } );

        cloned.attr( 'data-trigger_id', triggerId );
        cloned.css( 'display', 'block' );

        const $inputWrapperList = cloned.find( '.input-number-wrapper');
        $inputWrapperList.each( function () {
            addInputNumberListener( $( this ) );
        } );

        cloned.insertBefore( triggerWrapper );
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
                        $( '.trigger_post_type select', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][post_type_value]',
                            id: 'pys_event_' + triggerId + '_post_type_value'
                        } );
                        break;

                    case 'number_page_visit_conditional':
                        $( '.conditional_number_visit select', clonedTrigger ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][conditional_number_visit]',
                            id: 'pys_event_' + triggerId + '_conditional_number_visit'
                        } );

                        $( '.number_visit input', clonedTrigger ).attr( {
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
                    case 'purchase':
                        let transactionOnly = $( '.switcher_event_transaction_only_action', clonedTrigger );
                        transactionOnly.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][purchase_transaction_only]',
                        } );
                        transactionOnly.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][purchase_transaction_only]',
                            id: 'pys_event_' + triggerId + '_purchase_transaction_only'
                        } );
                        transactionOnly.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_purchase_transaction_only'
                        } );

                        let transactionID = $( '.switcher_event_track_transaction_ID', clonedTrigger );
                        transactionID.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][track_transaction_ID]',
                        } );
                        transactionID.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][track_transaction_ID]',
                            id: 'pys_event_' + triggerId + '_track_transaction_ID'
                        } );
                        transactionID.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_track_transaction_ID'
                        } )

                    case 'add_to_cart':
                    case 'purchase':
                        let trackValueAndCurrency = $( '.switcher_event_track_value_and_currency', clonedTrigger );
                        trackValueAndCurrency.find( 'input[type="hidden"]' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][track_value_and_currency]',
                        } );
                        trackValueAndCurrency.find( 'input.custom-switch-input' ).attr( {
                            name: 'pys[event][triggers][' + triggerId + '][track_value_and_currency]',
                            id: 'pys_event_' + triggerId + '_track_value_and_currency'
                        } );
                        trackValueAndCurrency.find( 'label.custom-switch-btn' ).attr( {
                            for: 'pys_event_' + triggerId + '_track_value_and_currency'
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

                $( '.pys-tags-pysselect2', inserted ).each( function () {
                    if ( !$( this ).data( 'select2' ) ) {
                        $( this ).pysselect2( {
                            tags: true,
                            tokenSeparators: [ ",", " " ],
                            templateSelection: pysTagTemplateSelection
                        } )
                    }
                } )

                $( 'select.pys-pysselect2', inserted ).each( function () {
                    if ( !$( this ).data( 'select2' ) ) {
                        $( this ).pysselect2( {
                            placeholder: $( this ).data( "placeholder" ),
                        } );
                    }
                } );

                const $inputWrapperList = clonedTrigger.find( '.input-number-wrapper');
                $inputWrapperList.each( function () {
                    addInputNumberListener( $( this ) );
                } );
            } );
        }
    }

    // Initialize popovers
    $( () => {
        tippy('[data-toggle="pys-popover"]', {
            allowHTML: true,
            animation: 'fade',
            trigger: 'click',
            appendTo: document.querySelector('#pys'),
            maxWidth: 320,
            content(reference) {
                const id = reference.getAttribute('data-popover_id');
                return $( "#pys-" + id ).html();
            },
            interactive: true
        } );

        tippy('.copy-icon', {
            content(reference) {
                const id = reference.getAttribute('data-popover_id');
                return $( "#pys-" + id ).html();
            },
            appendTo: document.querySelector('#pys'),
            maxWidth: 320,
            trigger: 'click',
            placement: 'bottom',
            animation: 'fade',
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 3000);
            }
        });

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
    $( ".card-collapse, .card-header-label .general-property-svg" ).on( 'click', function () {
        let cardBody = $( this ).closest( ".card, .card-video" ).children( ".card-body" ),
            cardHeader = $( this ).closest( ".card-header, .card-video-header" );

        if ( cardHeader.length > 0 ) {
            cardHeader.toggleClass( "header-opened" );
        }

        cardBody.slideToggle( 400 );
    } );

    // Toggle visibility based on custom switch inputs
    $( ".collapse-control .custom-switch-input" ).on( 'change', function () {
        let $this = $( this ),
            targetElement = $( "." + $this.data( "target" ) );
        if ( targetElement.length > 0 ) {
            if ( $this.prop( "checked" ) ) {
                targetElement.slideDown( 400 );
            } else {
                targetElement.slideUp( 400 );
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

    //toggle all events
    $( "#pys_select_all_events" ).on( 'change', function () {
        if ( $( this ).prop( "checked" ) ) {
            $( ".pys-select-event" ).prop( "checked", "checked" );
        } else {
            $( ".pys-select-event" ).prop( "checked", false );
        }

        checkEventsState();
    } );

    $( ".pys-select-event" ).on( 'change', function () {
       checkEventsState();
    })

    function checkEventsState() {
        let allEvents = $( ".pys-select-event" );
        if ( allEvents.filter( ":checked" ).length > 0 ) {
            $( ".buttons-action-events" ).addClass( 'checked' );
        } else {
            $( ".buttons-action-events" ).removeClass( 'checked' );
        }
    }

    toggleEventDelay();
    showRelevantEventTriggerPanel();
    $( ".pys_event_trigger_type" ).on( 'change', function () {
        let triggerGroup = $( this ).closest( '.trigger_group' ),
            triggerHead = $( this ).closest( '.trigger_group_head' ),
            panel = $( this ).val();

        checkTriggerTypeAvailability( triggerGroup, panel )
        toggleEventDelay();
        showRelevantEventTriggerPanel();
        toggleTriggerGroupHead( triggerHead, panel );
    } );

    $('.pys_conditions_wrapper .pys-role-pysselect2').each( function ( index, value ) {
        $(this).pysselect2();
    } );
    $( ".pys_event_condition_type" ).on( 'change', function () {
        let conditionGroup = $( this ).closest( '.condition_group' ),
            panel = $( this ).val();
        console.log( panel );
        checkConditionTypeAvailability( conditionGroup, panel );
    } );

    $( ".add-event-trigger" ).on( 'click', function () {
        let triggerPanel = $( this ).closest( ".event_triggers_panel" ),
            triggerType = triggerPanel.data( "trigger_type" );
        cloneAndInsertTrigger( triggerPanel, triggerType );
    } );

    $( document ).on( 'click', '.button-remove-row', function ( e ) {
        $( this ).closest( ".event_trigger, .facebook-custom-param, .pinterest-custom-param, .ga-ads-custom-param" ).remove();
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

    $( '#pys-add-condition .add-condition' ).on( 'click', function ( e ) {
        e.preventDefault();
        cloneEventCondition();
    } );

    //check for empty triggers
    if ( $( '.pys_conditions_wrapper .condition_group' ).length === 0 ) {
        $( '#pys-add-condition .add-condition' ).trigger( 'click' );
    }

    if ( $( '.pys_triggers_wrapper .trigger_group' ).length === 0 ) {
        $( '#pys-add-trigger .add-trigger' ).trigger( 'click' );
    }

    function toggleMergedGA() {
        let merged_ga_enabled = $( "#pys_event_ga_ads_enabled" ),
            card = merged_ga_enabled.closest( '.card' ),
            configured = +card.attr( 'data-configured' ) === 1,
            pixel_status = card.find( '.custom-event-pixel-status .pixel-status' );

        if ( configured ) {
            if ( merged_ga_enabled.is( ":checked" ) ) {
                $( "#merged_analytics_panel" ).removeClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).show();
                pixel_status.find( '.pixel-disabled' ).hide();
            } else {
                $( "#merged_analytics_panel" ).addClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).hide();
                pixel_status.find( '.pixel-disabled' ).show();
            }
        } else {
            $( '.gatags-not-configured-error' ).show();
            $( "#merged_analytics_panel" ).addClass( 'disabled' );
            merged_ga_enabled.prop( 'checked', false ).prop( 'disabled', true );
        }
    }

    toggleMergedGA();
    $( "#pys_event_ga_ads_enabled" ).on( 'click', function () {
        toggleMergedGA();
    } )

    function toggleGTMPanel() {
        let event_gtm_enabled = $( "#pys_event_gtm_enabled" ),
            card = event_gtm_enabled.closest( '.card' ),
            configured = +card.attr( 'data-configured' ) === 1,
            pixel_status = card.find( '.custom-event-pixel-status .pixel-status' );

        if ( configured ) {
            if ( event_gtm_enabled.is( ":checked" ) ) {
                $( "#gtm_panel" ).removeClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).show();
                pixel_status.find( '.pixel-disabled' ).hide();
            } else {
                $( "#gtm_panel" ).addClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).hide();
                pixel_status.find( '.pixel-disabled' ).show();
            }
        } else {
            $( '.gtm-not-configured-error' ).show();
            $( "#gtm_panel" ).addClass( 'disabled' );
            event_gtm_enabled.prop( 'checked', false ).prop( 'disabled', true );
        }
    }

    toggleGTMPanel();

    $( "#pys_event_gtm_enabled" ).on( 'click', function () {
        toggleGTMPanel()
    } )

    checkStepActive();
    calculateStepsNums();

    $( '.woo_initiate_checkout_enabled input[type="checkbox"]' ).on( 'change', function () {
        checkStepActive()
    } );
    $( '.checkout_progress input[type="checkbox"]' ).on( 'change', function () {
        calculateStepsNums();
    } );

    function calculateStepsNums() {
        let step = 2;
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
            $( '.checkout_progress .secondary-switch' ).removeClass( "disabled" );
            $( '.checkout_progress input[type="checkbox"]' ).removeAttr( "disabled" );
            $( '.woo_initiate_checkout_enabled .step' ).text( "STEP 1:" );
        } else {
            $( '.checkout_progress input' ).prop( 'checked', false );
            $( '.checkout_progress .secondary-switch' ).addClass( "disabled" );
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
        let value = $( this ).val(),
            ga_param_list = '',
            ga_ads_param_list = '';

        $( ".ga-param-list, .ga-ads-param-list" ).slideUp( 200, function () {
            $( this ).html( "" );
            for ( let i = 0; i < ga_fields.length; i++ ) {
                if ( ga_fields[ i ].name == value ) {
                    ga_fields[ i ].fields.forEach( function ( el ) {
                        ga_param_list += '<div class="ga_param mb-24">\n' +
                            '<div class="mb-8">' +
                            '<label class="custom-event-label">' + el + '</label>' +
                            '</div>' +
                            '<input type="text" name="pys[event][ga_params][' + el + ']" class="input-standard">' +
                            ' </div>';
                        ga_ads_param_list += '<div class="ga_ads_param mb-24">\n' +
                            '<div class="mb-8">' +
                            '<label class="custom-event-label">' + el + '</label>' +
                            '</div>' +
                            '<input type="text" name="pys[event][ga_ads_params][' + el + ']" class="input-standard">' +
                            ' </div>';
                    } );
                    break;
                }
            }

            if ( ga_param_list.length > 0 ) {
                $( ".ga-param-list" ).append( ga_param_list ).slideDown( 400 );
            }

            if ( ga_ads_param_list.length > 0 ) {
                $( ".ga-ads-param-list" ).append( ga_ads_param_list ).slideDown( 400 );
            }
        } );

        let group = $( 'option:selected', this ).attr( 'group' );
        $( this ).parent().siblings( '#ga_ads_event_action_group' ).val( group );

        if ( group == "Retail/Ecommerce" ) {
            $( ".ga_woo_info" ).slideDown( 400 );
        } else {
            $( ".ga_woo_info" ).slideUp( 400 );
        }
        updateGAActionSelector();
    } );

    let action_merged_g4 = $( ".action_merged_g4" );

    if ( action_merged_g4.length > 0 ) {
        var value = $( '.action_merged_g4' ).val();
        if ( $( ".ga-ads-param-list .ga_ads_param" ).length == 0 ) {
            for ( i = 0; i < ga_fields.length; i++ ) {
                if ( ga_fields[ i ].name == value ) {
                    ga_fields[ i ].fields.forEach( function ( el ) {
                        $( ".ga-ads-param-list" ).append( '<div class="row mb-3 ga_ads_param">\n' +
                            '<label class="col-5">' + el + '</label>' +
                            '<div class="col-4">' +
                            '<input type="text" name="pys[event][ga_ads_params][' + el + ']" class="form-control">' +
                            '</div>' +
                            ' </div>' );
                    } );
                    break;
                }
            }
        }

        let group = $( 'option:selected', action_merged_g4 ).attr( 'group' );
        group = group ? group : "All Properties";
        action_merged_g4.parent().siblings( '#ga_ads_event_action_group' ).val( group );

        if ( group == "Retail/Ecommerce" ) {
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
                $( '#ga-ads-custom-action_g4' ).slideDown(400);
            } else {
                $( '#ga-ads-custom-action_g4' ).slideUp(400)
            }
        }
    }

    let action_gtm = $( ".action_gtm" );

    action_gtm.on( 'change', function () {
        let value = $( this ).val(),
            gtm_param_list = '';

        $( ".gtm-param-list" ).slideUp(200, function () {
            $( this ).html( "" );

            for ( let i = 0; i < gtm_fields.length; i++ ) {
                if ( gtm_fields[ i ].name == value ) {
                    gtm_fields[ i ].fields.forEach( function ( el ) {
                        gtm_param_list += '<div class="mb-24 gtm_param">' +
                            '<div class="mb-8">' +
                            '<label class="custom-event-label">' + el + '</label>' +
                            '</div>' +
                            '<input type="text" name="pys[event][gtm_params][' + el + ']" class="form-control input-standard">' +
                            ' </div>';
                    } );
                    break;
                }
            }

            if ( gtm_param_list.length > 0 ) {
                $( ".gtm-param-list" ).append( gtm_param_list ).slideDown( 400 );
            }
        });

        let group = $( 'option:selected', this ).attr( 'group' );
        $( this ).parent().siblings( '#gtm_event_action_group' ).val( group );

        if ( group == "Retail/Ecommerce" ) {
            $( ".gtm_woo_info" ).slideDown(400);
        } else {
            $( ".gtm_woo_info" ).slideUp(400);
        }
        updateGTMActionSelector();
    } )

    if(action_gtm.length > 0) {
        let value = $('.action_gtm').val(),
            gtm_param_list = '';

        if($(".gtm-param-list .gtm_param").length == 0) {
            for(let i=0;i<gtm_fields.length;i++){
                if(gtm_fields[i].name == value) {
                    gtm_fields[ i ].fields.forEach( function ( el ) {
                        gtm_param_list += '<div class="mb-24 gtm_param">' +
                            '<div class="mb-8">' +
                            '<label class="custom-event-label">' + el + '</label>' +
                            '</div>' +
                            '<input type="text" name="pys[event][gtm_params][' + el + ']" class="form-control input-standard">' +
                            ' </div>';
                    } );
                    break;
                }
            }

            if ( gtm_param_list.length > 0 ) {
                $( ".gtm-param-list" ).append( gtm_param_list ).slideDown( 400 );
            }
        }

        let group = $( 'option:selected', action_gtm ).attr( 'group' );
        group = group ? group : "All Properties";
        action_gtm.parent().siblings( '#gtm_event_action_group' ).val( group );

        if($('option:selected', this).attr('group') == "Retail/Ecommerce") {
            $(".gtm_woo_info").attr('style',"display: block");
        } else {
            $(".gtm_woo_info").attr('style',"display: none");
        }
        updateGTMActionSelector();
    }


    function updateGTMActionSelector() {
        if ( $( '.action_gtm' ).length > 0 ) {
            if ( $( '.action_gtm' ).val() === "_custom" || $( '.action_gtm' ).val() === "CustomEvent" ) {
                $( '#gtm-custom-action_g4' ).slideDown( 400 );
            } else {
                $( '#gtm-custom-action_g4' ).slideUp( 400 );
            }
        }
    }

    $( '.gtm-custom-param-list' ).on( "click", '.gtm-custom-param .button-remove-row', function () {
        let messageContainer = $( "#custom-param-message" );

        $( this ).parents( '.gtm-custom-param' ).remove();
        if ( messageContainer.length && $( ".gtm-custom-param-list .gtm-custom-param" ).length < 5 ) {
            messageContainer.slideUp( 400 );
        }
    } );

    $( '.add-gtm-parameter' ).on( 'click', function () {
        let currentCount = $( ".gtm-custom-param-list .gtm-custom-param" ).length,
            messageContainer = $( "#custom-param-message" );

        if ( currentCount < 5 ) {
            let index = currentCount + 1;
            $( ".gtm-custom-param-list" ).append( '<div class="gtm-custom-param" data-param_id="' + index + '">' +
                '<div class="mt-24 d-flex align-items-center">' +
                '<div>' +
                '<input type="text" placeholder="Enter name" class="custom-param-name input-standard"' +
                ' name="pys[event][gtm_custom_params][' + index + '][name]"' +
                ' value="">' +
                '</div>' +
                '<div class="ml-16">' +
                '<input type="text" placeholder="Enter value" class="custom-param-value input-standard"' +
                ' name="pys[event][gtm_custom_params][' + index + '][value]"' +
                ' value="">' +
                '</div>' +
                '<button type="button" class="btn button-remove-row">' +
                '<i class="icon-delete" aria-hidden="true"></i>' +
                '</button>' +
                '</div>' +
                '</div>' );
            if ( messageContainer.length ) {
                messageContainer.slideUp( 400 );
            }
        } else {
            if ( messageContainer.length ) {
                messageContainer.text( "You can add up to 5 custom parameters only." );
                messageContainer.slideDown( 400 );
            } else {
                $(".gtm-custom-param-list").after('<div class="critical_message mt-24" id="custom-param-message">You can add up to 5 custom parameters only.</div>');
            }
        }
    } );

    $('.ga-custom-param-list').on("click",'.ga-custom-param .remove-row',function(){
       $(this).parents('.ga-custom-param').remove();
    });

    $( '.add-ga-ads-parameter' ).on( 'click', function () {
        let index = $( ".ga-ads-custom-param-list .ga-ads-custom-param" ).length + 1;

        $( ".ga-ads-custom-param-list" ).append( '<div class="ga-ads-custom-param" data-param_id="' + index + '">' +
            '<div class="mt-24 d-flex align-items-center">' +
            '<div>' +
            '<input type="text" placeholder="Enter name" class="custom-param-name input-standard"' +
            ' name="pys[event][ga_ads_custom_params][' + index + '][name]"' +
            ' value="">' +
            '</div>' +
            '<div class="ml-16">' +
            '<input type="text" placeholder="Enter value" class="custom-param-name input-standard"' +
            ' name="pys[event][ga_ads_custom_params][' + index + '][value]"' +
            ' value="">' +
            '</div>' +
            '<div>' +
            '<button type="button" class="btn button-remove-row">' +
            '<i class="icon-delete" aria-hidden="true"></i>' +
            '</button>' +
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

                let trigger_type = trigger.find( '.pys_event_trigger_type' ).val(),
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
                    post_type_error.show();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide()
                } else if ( trigger_type == "number_page_visit" ) {
                    trigger.find( ".trigger_number_page_visit" ).css( "display", "flex" );
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else if(trigger_type == "home_page") {
                    trigger.find(".event-delay").css("display", "flex");
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else if(trigger_type == "add_to_cart") {
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else if(trigger_type == "purchase") {
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.hide();
                    elementor_form_error.hide();
                } else if(trigger_type == "elementor_form") {
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.hide();
                    video_view_error.hide();
                    elementor_form.show();
                    elementor_form_error.hide();
                } else if ( trigger_type == "video_view" ) {
                    post_type_error.hide();
                    post_type.hide();
                    embedded_video_view.show();
                    video_view_error.hide();
                } else if($.inArray(trigger_type, arr_form_trigger) != -1 || trigger_type == "email_link") {
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
        let text = '<span class="not-support-tag form-text text-small">We identified this tag as a Google Analytics Universal property.</span>'
        if ( $( this ).val().indexOf( 'G' ) === 0 ) {
            text = '<span class="form-text text-small">We identified this tag as a GA4 property.</span>';
        }
        $( this ).next().html( text );
    } );

    function renderField( data ) {
        if ( data.type === "input" ) {
            return '<div class="mt-24">' +
                '<div class="mb-8">' +
                '<label class="custom-event-label">' + data.label + '</label>' +
                '</div>' +
                '<input type="text" name="' + data.name + '" value="" placeholder="" class="input-standard">' +
                '</div>';
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
            updateTiktokParamFormVisibility( true )
        } )

        if ( $( '#pys_event_tiktok_event_type' ).val() === 'CustomEvent' ) {
            $( '.tiktok-custom-event-type' ).css( 'display', 'block' )
        } else {
            $( '.tiktok-custom-event-type' ).css( 'display', 'none' )
        }
        updateTiktokParamFormVisibility();
    }

    function updateTikTokEventParamsFrom() {
        let $select = $( '#pys_event_tiktok_event_type' );
        if ( $select.length === 0 ) return;
        let $panel = $( '#tiktok_params_panel' );
        let $custom = $( '.tiktok-custom-event-type' );

        if ( $select.val() === 'CustomEvent' ) {
            $custom.slideDown( 400 );
            $panel.slideUp( 400, function () {
                $( this ).html( '' );
            } );
        } else {
            let fields = $select.find( ":selected" ).data( 'fields' );

            if ( fields.length === 0 || !$( '#pys_event_tiktok_params_enabled' ).is( ":checked" ) ) {
                $panel.slideUp( 400, function () {
                    $( this ).html( '' );
                } );
            } else {
                $panel.html( '' )
                fields.forEach( function ( item ) {
                    $panel.append( renderField( item ) )
                } );

                $panel.slideDown( 400 );
            }

            $custom.slideUp( 400 );
        }
    }

    function updateTiktokParamFormVisibility( new_form = false ) {
        if ( $( '#pys_event_tiktok_params_enabled:checked' ).length > 0 ) {
            if ( new_form ) {
                updateTikTokEventParamsFrom();
            }
            $( '#tiktok_params_panel' ).slideDown( 400 );
        } else {
            $( '#tiktok_params_panel' ).slideUp( 400 );
        }
    }

    function updateTikTokPanelVisibility() {
        let tiktok_enabled = $( "#pys_event_tiktok_enabled" ),
            card = tiktok_enabled.closest( '.card' ),
            configured = +card.attr( 'data-configured' ) === 1,
            pixel_status = card.find( '.custom-event-pixel-status .pixel-status' );

        if ( configured ) {
            if ( tiktok_enabled.is( ":checked" ) ) {
                $( "#tiktok_panel" ).removeClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).show();
                pixel_status.find( '.pixel-disabled' ).hide();
            } else {
                $( "#tiktok_panel" ).addClass( 'disabled' );
                pixel_status.find( '.pixel-enabled' ).hide();
                pixel_status.find( '.pixel-disabled' ).show();
            }
        } else {
            $( '.tiktok-not-configured-error' ).show();
            $( "#tiktok_panel" ).addClass( 'disabled' );
            tiktok_enabled.prop( 'checked', false ).prop( 'disabled', true );
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

    $( "#pys_core_automatic_events_enabled, #pys_core_fdp_enabled" ).on( "change", function () {
        let $cardHeader = $( this ).parents( ".card-header" ),
            $headSwitch = $cardHeader.find( ".card-collapse" ),
            $body = $( this ).parents( ".card" ).children( ".card-body" );
        if ( $( this ).is( ':checked' ) ) {
            $headSwitch.css( "display", "block" );
        } else {
            $body.slideUp( 400 );
            $headSwitch.css( "display", "none" );
            $cardHeader.removeClass( "header-opened" );
        }
    } )

    //toggle card (dashboard)
    let $disable_card = $( "#pys .disable-card .custom-switch-input" );
    $disable_card.on( "change", function () {
        toggleDashboardAutomaticEventsCard( $( this ) );
    } )

    $disable_card.each( function () {
        toggleDashboardAutomaticEventsCard( $( this ) );
    } )

    function toggleDashboardAutomaticEventsCard( $card ) {
        let $header = $card.closest( ".disable-card-wrap" ),
            $headSwitch = $header.find( ".card-collapse" ),
            $body = $card.closest( ".card" ).children( ".card-body" ),
            $disable_card = $card.closest( ".disable-card" );

        if ( $card.is( ':checked' ) ) {
            $headSwitch.css( "display", "flex" );
            $disable_card.removeClass( "disabled" );
        } else {
            $body.removeClass( "show" );
            $body.slideUp( 400 );
            $headSwitch.css( "display", "none" );
            $header.removeClass( "header-opened" );
            $disable_card.addClass( "disabled" );
        }
    }

    $("#pys").on("click", ".copy_text", function () {
        let textToCopy = $(this).text();
        let popoverIcon = $(this).find(".copy-icon")[0];

        navigator.clipboard.writeText(textToCopy).then(() => {
            const instance = popoverIcon._tippy;
            if (instance) {
                instance.show();
            }
        }).catch(err => console.error("Error copied: ", err));
    })

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
        $( "#pys .build_utms_with_url span.insert" ).text( urls + utms )
        $( "#pys .build_utms span.insert" ).text( utms )
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
        error.slideUp( 400 );

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
                error.slideDown( 400 );
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
                            video_view_triggers.slideDown( 400 );
                            video_triggers.pysselect2( 'open' );
                        } else {
                            message.html( 'These URLs do not contain any videos' );
                            error.slideDown( 400 );
                            video_view_triggers.slideUp( 400 );
                        }
                    } else {
                        message.html( 'Something went wrong' );
                        error.slideDown( 400 );
                        video_view_triggers.slideUp( 400 );
                    }
                },
                error: function ( data ) {
                    message.html( data.responseJSON.data );
                    error.slideDown( 400 );
                    video_view_triggers.slideUp( 400 );
                    console.log( data );
                },
                complete: function () {
                    button.html( button.val() ).prop( 'disabled', false );
                }
            } );
        } else {
            message.html( 'Please enter video URLs' );
            error.slideDown( 400 );
            video_view_triggers.slideUp( 400 );
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

        error.slideUp( 400 );

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
                error.slideDown( 400 );
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
                            elementor_form_triggers.slideDown( 400 );
                            form_triggers.pysselect2( 'open' );
                        } else {
                            message.html( 'These URLs do not contain any forms' );
                            error.slideDown( 400 );
                            elementor_form_triggers.slideUp( 400 );
                        }
                    } else {
                        message.html( 'Something went wrong' );
                        error.slideDown( 400 );
                        elementor_form_triggers.slideUp( 400 );
                    }
                },
                error: function ( data ) {
                    message.html( data.responseJSON.data );
                    error.slideDown( 400 );
                    elementor_form_triggers.slideUp( 400 );
                    console.log( data );
                },
                complete: function () {
                    button.html( button.val() ).prop( 'disabled', false );
                }
            } );
        } else {
            message.html( 'Please enter form pages URLs' );
            error.slideDown( 400 );
            elementor_form_triggers.slideUp( 400 );
        }
    } )

    //Remove trigger
    $( document ).on( 'click', '.pys_triggers_wrapper .pys_remove_trigger .button-remove-row', function () {
        $( this ).closest( '.trigger_group' ).remove();
    } )

    $( document ).on( 'click', '.pys_conditions_wrapper .button-remove-row', function () {
        $( this ).closest( '.condition_group' ).remove();
    } )

    const $inputWrapperList = $( '.input-number-wrapper' );

    $inputWrapperList.each( function () {
        addInputNumberListener( $( this ) );
    } );

    function addInputNumberListener( $wrapper ) {
        const $input = $wrapper.find( 'input' );
        const incrementation = Number( $input.attr( 'step' ) ) || 1;

        $wrapper.find( '.increase' ).on( 'click', function ( e ) {
            e.preventDefault();
            incInputNumber( $input, incrementation );
        } );

        $wrapper.find( '.decrease' ).on( 'click', function ( e ) {
            e.preventDefault();
            incInputNumber( $input, -incrementation );
        } );
    }

    function incInputNumber( $input, step ) {

        if ( !$input.is( ':disabled' ) ) {
            let val = Number( $input.val() );

            if ( isNaN( val ) ) val = 0;
            val += +step;

            const max = $input.attr( 'max' );
            const min = $input.attr( 'min' );

            if ( max !== undefined && val > Number( max ) ) {
                val = Number( max );
            } else if ( min !== undefined && val < Number( min ) ) {
                val = Number( min );
            } else if ( val < 0 ) {
                val = 0;
            }

            $input.val( val ).attr( 'value', val );
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

    //save settings
    $('#pys-save-settings').on('click', function () {
        $('#pys-form').submit();
    });

    $('.logs-wrapper .icon-trash').on('click', function (){
        $(this).closest('.card').addClass('loading');
    });

    $("#pys .logs_enable input[id$='logs_enable']").on('change', function () {
        let isChecked = $(this).prop("checked");
        let card = $(this).closest('.card');
        let textarea = card.find("textarea");
        if (isChecked) {
            textarea.prop("disabled", false);
        } else {
            textarea.prop("disabled", true);
        }
    });

    function maskPassword(block) {
        const passwordInput = block.find(".passwordInput");
        const maskedInput = block.find(".maskedInput");

        if (passwordInput.length && maskedInput.length) {
            maskedInput.val('');
            maskedInput.attr("placeholder", "*".repeat(passwordInput.val().length));
        }
    }

    function updatePassword(maskedInput) {
        const block = maskedInput.closest(".password-block");
        const passwordInput = block.find(".passwordInput");

        let realValue = passwordInput.val().split("");
        let maskedValue = maskedInput.val();
        if (maskedValue.length > 0 && maskedValue.trim().length > 0) {
            passwordInput.val(maskedValue);
        }
        else {
            passwordInput.val(maskedValue.data('value'));
        }
    }

    $(".licenses-wrapper .btn.btn-block").on("click", function() {
        const licenseBlock = $(this).closest(".card");
        const headButtonBlock = licenseBlock.find(".head-button-block");
        const passwordBlock = licenseBlock.find(".card-body .password-block");

        maskPassword(passwordBlock);

        headButtonBlock.find(".btn").hide();
        headButtonBlock.find(".icon-load").addClass("active");
        passwordBlock.find(".maskedInput").attr("disabled", true);
    });
} );
