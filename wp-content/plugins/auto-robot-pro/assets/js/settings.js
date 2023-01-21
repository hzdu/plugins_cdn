(function($){

    "use strict";

    var AutoRobotSettings = {

        init: function()
        {
            this._bind();
        },

        /**
         * Binds events for the Auto Robot Settings.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {
            $( document ).on('click', '.robot-save-settings', AutoRobotSettings._saveSettings );
            $( document ).on('click', '.robot-vertical-tab a', AutoRobotSettings._switchTabs );
        },

        /**
         * Switch Tabs
         *
         */
         _switchTabs: function( event ) {

            event.preventDefault();

            var tab = '#' + $(this).data('nav');

            $('.robot-vertical-tab').removeClass('current');
            $(this).parent().addClass('current');

            $('.robot-box-tab').removeClass('active');
            $('.robot-box-tabs').find(tab).addClass('active');

        },

        /**
         * Save Settings
         *
         */
        _saveSettings: function( event ) {

            event.preventDefault();

            $(this).html('<div class="text-center"><div class="loader1"><span></span><span></span><span></span><span></span><span></span></div></div>');


            // set post form data
            var formdata = $('.robot-settings-form').serializeArray();
            var fields = {};
            $(formdata ).each(function(index, obj){
                fields[obj.name] = obj.value;
            });
            fields['update_frequency'] = $('.range-slider__value').text();
            fields['update_frequency_unit'] = $('#robot-field-unit-button').val();

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_save_settings',
                        fields_data  : fields,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce,
                    },
                    beforeSend: function() {
                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( options ) {
                    if( false === options.success ) {
                        console.log(options);
                    } else {
                        console.log(options.success);
                        $('.robot-save-settings').html('<span class="robot-loading-text">Save Settings</span>');
                        AutoRobotSettings._displayNoticeMessage(options.data);
                    }
                });

        },

        /**
         * Display Notice Message
         *
         */
        _displayNoticeMessage: function(message) {

            var html = '<div class="message-box robot-message-box success">' + message + '</div>';
            $(html).appendTo(".robot-wrap").slideDown('slow').animate({opacity: 1.0}, 2500).slideUp('slow');

        },
    };

    /**
     * Initialize AutoRobotSettings
     */
    $(function(){
        AutoRobotSettings.init();
    });

})(jQuery);
