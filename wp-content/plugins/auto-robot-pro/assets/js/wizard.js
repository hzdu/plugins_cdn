(function($){

    "use strict";

    var AutoRobotWizard = {

        init: function()
        {
            // Document ready.
            this._bind();
        },

        /**
         * Binds events for the Auto Robot Wizard.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {

            $( document ).on('click', '.robot-wizard-permissions', AutoRobotWizard._showPermission );
            $( document ).on('click', '.robot-wizard-opt-in', AutoRobotWizard._optIn );
            $( document ).on('click', '.robot-wizard-skip', AutoRobotWizard._skip );

        },

        /**
         * Show permission details
         *
         */
        _showPermission: function( event ) {

            event.preventDefault();

            if ($("#robot_wizard_set_up").hasClass("wizard-set-up")){
				$("#robot_wizard_set_up").css("display", "none");
				$("#robot_wizard_set_up").removeClass("wizard-set-up");
			}else{
				$("#robot_wizard_set_up").css("display", "block");
				$("#robot_wizard_set_up").addClass("wizard-set-up");
			}
        },

        /**
         * Opt-in
         *
         */
        _optIn: function( event ) {

            event.preventDefault();

            console.log('click opt in');

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_save_user_data',
                        type         : 'opt-in',         
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce,
                    },
                    beforeSend: function() {
                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                    window.location.href = "admin.php?page=auto-robot";
                })
                .done(function ( option ) {
                    if( false === option.success ) {
                        console.log(option);
                    } else {
                        console.log(option);
                        window.location.href = "admin.php?page=auto-robot";
                    }

                });

        },    

        /**
         * Skip opt in
         *
         */
        _skip: function( event ) {

            event.preventDefault();

            console.log('click skip.');

            $.ajax({
                url  : Auto_Robot_Data.ajaxurl,
                type : 'POST',
                dataType: 'json',
                data : {
                    action       : 'auto_robot_save_user_data',
                    type         : 'skip',         
                    _ajax_nonce  : Auto_Robot_Data._ajax_nonce,
                },
                beforeSend: function() {
                },
            })
            .fail(function( jqXHR ){
                console.log( jqXHR.status + ' ' + jqXHR.responseText);
            })
            .done(function ( option ) {
                if( false === option.success ) {
                    console.log(option);
                } else {
                    console.log(option);
                    window.location.href = "admin.php?page=auto-robot";
                }

            });

        },    

    };

    /**
     * Initialize AutoRobotWizard
     */
    $(function(){
        AutoRobotWizard.init();
    });

})(jQuery);
