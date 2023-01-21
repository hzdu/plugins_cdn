(function($){

    "use strict";

    var AutoRobotAddon = {

        init: function()
        {
            // Document ready.
            $( document ).ready( AutoRobotAddon._loadPopup() );

            this._bind();
        },

        /**
         * Binds events for the Auto Robot Addon.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {
            $( document ).on('click', '.robot-connect-integration', AutoRobotAddon._selectIntegration );
            $( document ).on('click', '.robot-addon-connect', AutoRobotAddon._saveAPIData );
            $( document ).on('auto-robot-reload-integration-page', AutoRobotAddon._reloadIntegrationPage );

        },

        /**
         * Load Popup
         *
         */
        _loadPopup: function( ) {

            $('.robot-connect-integration').magnificPopup({
                type:'inline',
                midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                // Delay in milliseconds before popup is removed
                removalDelay: 300,

                // Class that is added to popup wrapper and background
                // make it unique to apply your CSS animations just to this exact popup
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    }
                },
            });

        },

        /**
         * Display Actions
         *
         */
        _selectIntegration: function( event ) {

            event.preventDefault();


            var slug = $(this).data('slug');

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_select_integration',
                        template     : slug,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce,
                    },
                    beforeSend: function() {
                        $('#integration-popup').empty();
                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( result ) {
                    if( false === result.success ) {
                        console.log(result);
                    } else {
                        $('#integration-popup').html(result.data);
                    }
                });


        },

        /**
         * Save API Data
         *
         */
        _saveAPIData: function( event ) {

            event.preventDefault();


            var formdata = $('.robot-integration-form').serializeArray();
            var fields = {};
            $(formdata ).each(function(index, obj){
                fields[obj.name] = obj.value;
            });

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_save_api_data',
                        fields_data  : fields,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce,
                    },
                    beforeSend: function() {
                        $('.robot-loading-text').text('Loading...');
                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( result ) {
                    if( false === result.success ) {
                        console.log(result);
                    } else {
                        $('.robot-loading-text').text('Save');

                        AutoRobotAddon._displayNoticeMessage(result.data);

                        setTimeout(function(){
                         $(document).trigger( 'auto-robot-reload-integration-page' );
                        }, 3000);
                    }


                });


        },

        /**
         * Reload Integration Page
         *
         */
        _reloadIntegrationPage: function( event ) {

            event.preventDefault();

            var target_url = Auto_Robot_Data.integrations_url;
            window.location.replace(target_url);

        },

        /**
         * Display Notice Message
         *
         */
        _displayNoticeMessage: function(message) {

            event.preventDefault();

            var html = '<div class="message-box robot-message-box success">' + message + '</div>';
            $(html).appendTo(".robot-wrap").fadeIn('slow').animate({opacity: 1.0}, 2500).fadeOut('slow');;

        },
        
    };

    /**
     * Initialize AutoRobotAddon
     */
    $(function(){
        AutoRobotAddon.init();
    });

})(jQuery);
