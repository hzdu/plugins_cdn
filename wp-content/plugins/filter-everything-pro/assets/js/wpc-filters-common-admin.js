/*!
 * Filter Everything common admin 1.6.8
 */
(function($) {
    "use strict";

    $(document).ready(function (){
        // Common JS code
        $(document).on('click', '#show_bottom_widget', function (e){
            if( $(this).is(':checked') ){
                $('#show_open_close_button').parent('label').addClass('wpc-inactive-settings-field');
                $('.wpc-bottom-widget-compatibility').addClass('wpc-opened');
            }else{
                $('#show_open_close_button').parent('label').removeClass('wpc-inactive-settings-field');
                $('.wpc-bottom-widget-compatibility').removeClass('wpc-opened');
            }
        });

        $('#wpc_primary_color').wpColorPicker({
            defaultColor: '',
            palettes: [ '#0570e2', '#f44336', '#E91E63', '#007cba', '#65BC7B', '#FFEB3B', '#FFC107', '#FF9800', '#607D8B'],
        });

        $('.wpc-help-tip').tipTip({
            'attribute': 'data-tip',
            'fadeIn':    50,
            'fadeOut':   50,
            'delay':     200,
            'keepAlive': true,
            'maxWidth': "220px",
        });

        $( '.wpc-sortable-table' ).sortable({
            items: "tr.pro-version.wpc-sortable-row",
            delay: 150,
            placeholder: "wpc-filter-field-shadow",
            refreshPositions: true,
            cursor: 'move',
            handle: ".wpc-order-sortable-handle-icon",
            axis: 'y',
            update: function( event, ui ) {
                renderTableOrder();
            },

        });

        $(document).on( 'click', '.free-version .wpc-field-sortable-handle', function (){
            alert( wpcFiltersAdminCommon.prefixesOrderAvailableInPro );
        });

        let wpcUserAgent = navigator.userAgent.toLowerCase();
        let wpcIsAndroid = wpcUserAgent.indexOf("android") > -1;
        let wpcAllowSearchField = 0;
        if(wpcIsAndroid) {
            wpcAllowSearchField = Infinity;
        }

        $("#show_terms_in_content").select2({
            width: '80%',
            placeholder: wpcFiltersAdminCommon.chipsPlaceholder,
            minimumResultsForSearch: wpcAllowSearchField,
            tags: true
        });

        $('body').on('click', '.wpc-notice-dismiss', function (e){
            e.preventDefault();

            let requestParams      = {};
            requestParams._wpnonce = $(this).data('nonce');

            wp.ajax.post( 'wpc_dismiss_license_notice', requestParams )
                .always( function( response ) {
                    // $spinner.removeClass( 'is-active' );
                    var $el = $( '.license-notice' );
                    $el.fadeTo( 100, 0, function() {
                        $el.slideUp( 100, function() {
                            $el.remove();
                        });
                    });
                })
        });

    }); // End $(document).ready();

    $(document).on('click', '.wpc-error.is-dismissible > .notice-dismiss', function (e){
            e.preventDefault();

            let $button = $( this );
            let $el = $button.parent('.wpc-error');

            $el.fadeTo( 100, 0, function() {
                $el.slideUp( 100, function() {
                    $el.remove();
                });
            });
            $el.append( $button );
    });

    function renderTableOrder()
    {
        let num = 0;
        $("tr.wpc-sortable-row").each( function ( index, element ) {
            num = (index + 1);
            $(element).find('.wpc-order-td').text(num);
        });
    }

})(jQuery);