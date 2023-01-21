(function($){

    "use strict";

    var AutoRobot = {

        selected_source: [],

        init: function()
        {
            // Document ready.
            $( document ).ready( AutoRobot._loadPopup() );

            this._bind();
        },

        /**
         * Binds events for the Auto Robot.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {
            $( document ).on('click', '.open-popup-link', AutoRobot._openPopup );
            $( document ).on('click', '.auto-robot-select-type', AutoRobot._selectType );
            $( document ).on('click', '.auto-robot-select-previous', AutoRobot._selectPrevious );
            $( document ).on('click', '.robot-source', AutoRobot._checkedSource );
            $( document ).on('click', '.robot-go-wizard', AutoRobot._goWizard );


        },

        /**
         * Load Popup
         *
         */
        _loadPopup: function( ) {

            $('.open-popup-link').magnificPopup({
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
         * Open Popup
         *
         */
        _openPopup: function( event ) {

            event.preventDefault();

            $('#test-popup .step-1').show();
            $('#test-popup .step-2').hide();

        },

        /**
         * Select Type
         *
         */
        _selectType: function( event ) {

            event.preventDefault();

            var selected_type = $('#test-popup').find("input[name=robot-selected-type]:checked").val();

            // define source data
            var data = [];

            switch (selected_type) {
                case 'search':
                    data = [
                        { value: "google", icon: "logo-google" },
                        { value: "yahoo", icon: "logo-yahoo" }
                    ];
                    break;
                case 'affiliate':
                    data = [
                        { value: "amazon", icon: "logo-amazon" },
                        { value: "eBay", icon: "logo-ebay" }
                    ];
                    break;
                case 'rss':
                    data = [
                        { value: "rss", icon: "logo-rss" }
                    ];
                    break;
                case 'social':
                    data = [
                        { value: "facebook", icon: "logo-facebook" },
                        { value: "twitter", icon: "logo-twitter" },
                        { value: "flickr", icon: "logo-flickr" },
                        { value: "instagram", icon: "logo-instagram" },
                    ];
                    break;
                case 'video':
                    data = [
                        { value: "youtube", icon: "logo-youtube" },
                        { value: "vimeo", icon: "logo-vimeo" }
                    ];
                    break;
                case 'sound':
                    data = [
                        { value: "music", icon: "logo-youtube" },
                        { value: "soundcloud", icon: "logo-vimeo" }
                    ];
                    break;
                default:
                    data = [
                        { value: "youtube", icon: "logo-youtube" },
                        { value: "vimeo", icon: "logo-vimeo" }
                    ];
            }

            AutoRobot._updateSource(data);
            $('#test-popup .step-1').hide();
            $('#test-popup .step-2').show();


        },

        /**
         * Select Previous
         *
         */
        _selectPrevious: function( event ) {

            event.preventDefault();

            $('#test-popup .step-2').hide();
            $('#test-popup .step-1').show();


        },

        /**
         * Check source
         *
         */
        _checkedSource: function( event ) {

            event.preventDefault();

            AutoRobot.selected_source = $(this).data('source');

            $(this).css({"background-color": "#e1f6ff", "color": "#04223f"});

            $(".robot-source").not($(this)).css({"background-color": "#ffffff", "color": "#888"});


        },

        /**
         * Update Source
         *
         * @param  {object} event Object.
         * @param  {object} data  API response data.
         */
        _updateSource: function( data  ) {

            var template = wp.template('robot-source-list');

            jQuery('.source-list').show().html(template( data ));

        },

        /**
         * Go Wizard
         *
         */
        _goWizard: function( ) {

            var target_url = Auto_Robot_Data.wizard_url + '&source='+ AutoRobot.selected_source;

            window.location.replace(target_url);


        },

    };

    /**
     * Initialize AutoRobot
     */
    $(function(){
        AutoRobot.init();
    });

})(jQuery);