/* global admin_general */
jQuery( function ( $ ) {
    'use strict';
    if ( typeof admin_general === 'undefined' ) {
        return false;
    }

    var AdminRule = {
        init: function ( ) {
            this.trigger_on_page_load( )
            $( '.sumo_number_input' ).on( 'keyup keypress change', this.trigger_keyup );
        },
        trigger_on_page_load: function ( ) {
            if ( admin_general.actionforsorting !== 'undefined' ) {
                $( '#accordion' ).accordion( {
                    header: "> div > h3",
                    collapsible: true,
                    heightStyle: "content"
                } ).sortable( {
                    axis: "y",
                    handle: "h3",
                    update: function ( event, ui ) {

                        var data = $( this ).sortable( "toArray" );
                        // POST to server using $.post or $.ajax
                        console.log( data );
                        $.ajax( {
                            data: ( {
                                action: admin_general.actionforsorting,
                                data: data,
                                sumo_discount_security: admin_general.sorting_nonce,
                            } ),
                            type: 'POST',
                            url: admin_general.ajax_url,
                            success: function ( response ) {
                                console.log( response );
                            },
                        } );
                    },
                    stop: function ( event, ui ) {
                        // IE doesn't register the blur when sorting
                        // so trigger focusout handlers to remove .ui-state-focus
                        ui.item.children( "h3" ).triggerHandler( "focusout" );
                        // Refresh accordion to handle new order
                        $( this ).accordion( "refresh" );
                    }
                } );
                $( 'p.form-field span.dashicons-info' ).tipTip( );
                $( 'table' ).sortable( {
                    axis: "y",
                    items: "tbody",
                    update: function ( event, ui ) {

                        var data = $( this ).sortable( "toArray" );
                        // POST to server using $.post or $.ajax
                        console.log( data );
                        $.ajax( {
                            data: ( {
                                action: admin_general.actionforsorting,
                                data: data,
                                sumo_discount_security: admin_general.sorting_nonce,
                            } ),
                            type: 'POST',
                            url: admin_general.ajax_url,
                            success: function ( response ) {
                                console.log( response );
                            },
                        } );
                    }
                } );

            }
               $( ".sumomembership_plans_select" ).select2( {
                placeholder: "Enter atleast 3 characters",
                allowClear: true,
                //                                    enable: false,
                //                                    maximumSelectionSize: 1,
                //                                    readonly: false,
                //                                    multiple: false,
                minimumInputLength: 3,
                //                                    tags: [],
                escapeMarkup: function ( m ) {
                    return m;
                },
                ajax: {
                    url: admin_general.ajax_url,
                    dataType: 'json',
                    quietMillis: 250,
                    data: function ( params ) {
                        return {
                            term: params.term,
                            action: 'sumo_search_membership_plans'
                        };
                    },
                    processResults: function ( data ) {
                        var terms = [ ];
                        if ( data ) {
                            $.each( data, function ( id, text ) {
                                terms.push( {
                                    id: id,
                                    text: text
                                } );
                            } );
                        }
                        return {
                            results: terms
                        };
                    },
                    cache: true
                }
            } );
        },
        trigger_keyup: function ( ) {
            var res = this.value.charAt( 0 );
            if ( res !== '*' ) {
                this.value = this.value.replace( /[^0-9\.]/g, '' );
                if ( admin_general.rule_type === 'quantity_pricing' ) {
                    this.value = this.value.replace( '.', '' );
                    if ( this.value < 1 ) {
                        this.value = '';
                    }
                } else {
                    if ( this.value < 0.01 ) {
                        this.value = '';
                    }
                }
            } else {
                this.value = this.value.replace( /[^*\.]/g, '' );
            }
        }
    };
    AdminRule.init( );
} );
