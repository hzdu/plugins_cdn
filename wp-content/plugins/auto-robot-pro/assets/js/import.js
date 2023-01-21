(function($){

    "use strict";

    var AutoRobotImport = {

        init: function()
        {
            // Document ready.
            this._bind();
        },

        /**
         * Binds events for the Auto Robot Import.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {
            $( document ).on('click', '.robot-vertical-tab a', AutoRobotImport._switchTabs );
            $( document ).on('click', '.sui-checkbox-all input:checkbox', AutoRobotImport._allCheckBoxes );
            $( document ).on('click', '.robot-trigger-export', AutoRobotImport._triggerExport );
        },

        /**
         * Trigger Export
         *
         */
        _triggerExport: function( event ) {

            event.preventDefault();

            var allChecked = [];
            $('.sui-checkbox input:checkbox').each(function(i){
                if( $(this).is(":checked") ) {
                    allChecked[i] = $(this).data('index');
                }
            });

            var filtered = allChecked.filter(function (el) {
                return el != null;
            });

            // set post form data
            var fields = {};
            fields['campaign_index'] = filtered;

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_trigger_export',
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
                        var blob = new Blob([JSON.stringify(options.data)],{type:'application/json'});
                        AutoRobotImport._downloadBlob(blob);
                    }
                });
        },

        /**
         * Download blob
         *
         */
        _downloadBlob: function(blob, name = 'export.json')  {
            // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement("a");

            // Set link's href to point to the Blob URL
            link.href = blobUrl;
            link.download = name;

            // Append link to the body
            document.body.appendChild(link);

            // Dispatch click event on the link
            // This is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
              new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              })
            );

            // Remove link from body
            document.body.removeChild(link);
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
         * All check boxes
         *
         */
        _allCheckBoxes: function( ) {
            var checked =$('.sui-checkbox-all input:checkbox').is(":checked");

            if(checked){
                $('.sui-checkbox input:checkbox').prop("checked", true);
            }else{
                $('.sui-checkbox input:checkbox').prop("checked", false);
            }
        },

    };

    /**
     * Initialize AutoRobotImport
     */
    $(function(){
        AutoRobotImport.init();
    });

})(jQuery);
