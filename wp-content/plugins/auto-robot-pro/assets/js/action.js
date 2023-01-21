(function($){

    "use strict";

    var AutoRobotAction = {

        init: function()
        {
            // Document ready.
            $( document ).ready( AutoRobotAction._stickyHeader() );
            $( document ).ready( AutoRobotAction._loadPopup() );
            $( document ).ready( AutoRobotAction._mobileSelect() );
            $( document ).ready( AutoRobotAction._rangeSlider() );
            $( document ).ready( AutoRobotAction._mainSelect() );
            $( document ).ready( AutoRobotAction._postSelect() );
            $( document ).ready( AutoRobotAction._typeSelect() );
            $( document ).ready( AutoRobotAction._authorSelect() );
            $( document ).ready( AutoRobotAction._categorySelect() );
            $( document ).ready( AutoRobotAction._sourceSelect() );
            $( document ).ready( AutoRobotAction._translatorAPISelector() );



            this._bind();
        },

        /**
         * Binds events for the Auto Robot Action.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {
            $( document ).on('click', '.robot-vertical-tab a', AutoRobotAction._switchTabs );
            $( document ).on('keyup', '#robot-search', AutoRobotAction._searchSuggest );
            $( document ).on('click', '.robot-keyword-selected', AutoRobotAction._selectKeyword );
            $( document ).on('click', '#robot-campaign-save', AutoRobotAction._saveCampaign );
            $( document ).on('click', '#robot-campaign-publish', AutoRobotAction._publishCampaign );
            $( document ).on('click', '.robot-run-campaign-button', AutoRobotAction._runCampaign );
            $( document ).on('click', '.sui-tab-item', AutoRobotAction._switchSuiTabs );
            $( document ).on('click', '.source-select-list-container', AutoRobotAction._sourceSelectTab );
            $( document ).on('click', '.button_add_field', AutoRobotAction._appendTemplate );
            $( document ).on('click', '#robot-clear-logs', AutoRobotAction._clearLogs );
            $( document ).on('click', '.nav-tab', AutoRobotAction._switchWelcomeTabs );
            $( document ).ready( AutoRobotAction._languageLocationSelector() );


        },

        /**
         * Language and Location Selector
         *
         */
         _languageLocationSelector: function( ) {
            $('.robot-language-location-selector').click(function(e) {
                console.log('click selector');
                e.preventDefault();
                e.stopPropagation();
                /* api type expanded */
                $(this).toggleClass('expanded');

                /* set from language value */
                //var translator_from_language = $('#'+$(e.target).attr('for'));
                var language = $(this).find('#'+$(e.target).attr('for'));
                console.log(language);
                language.prop('checked',true);
            });
        },


        /**
         * Switch Welcome Tabs
         *
         */
        _switchWelcomeTabs: function( event ) {

            event.preventDefault();
            var tab = '#' + $(this).data('nav');

            $('.nav-tab').removeClass('nav-tab-active');
            $(this).addClass('nav-tab-active');

            $('.nav-container').removeClass('active');
            $('.robot-welcome-tabs').find(tab).addClass('active');

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
         * Search Suggest
         *
         */
        _searchSuggest: function( ) {

            var term = $(this).val();

            $.ajax({
                    url  : 'https://clients1.google.com/complete/search',
                    type : 'GET',
                    dataType: 'jsonp',
                    data: {
                        q: term,
                        nolabels: 't',
                        client: 'hp',
                        ds: ''
                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( data ) {

                    var htmlResult = '';

                    $.each( data[1], function( key, value ) {
                        htmlResult += '<li><a href="#"><span class="robot-keyword-selected" data-keyword="' + value[0] + '">' + value[0] + '</span></a></li>';
                    });

                    jQuery('.search-result-list').show().html(htmlResult);

                });

        },

        /**
         * Select Keyword
         *
         */
        _selectKeyword: function( event ) {

            event.preventDefault();

            var keyword = $(this).data('keyword');
            var parsed = keyword.replace(/(<([^>]+)>)/ig,"");

            $('#robot-selected-keywords').val(function(i, text) {
                if(text.length === 0){
                    return text +  parsed;
                }else{
                    return text + ', '+ parsed;
                }
            });


        },

        /**
         * Save Campaign
         *
         */
        _saveCampaign: function( ) {

            // set post form data
            var formdata = $('.robot-campaign-form').serializeArray();
            var fields = {};
            $(formdata ).each(function(index, obj){
                fields[obj.name] = obj.value;
            });
            fields['campaign_status'] = 'draft';
            fields['update_frequency'] = $('.range-slider__value').text();
            fields['update_frequency_unit'] = $('#robot-field-unit-button').val();
            fields['robot_post_status'] = $('#robot-post-status').val();
            fields['robot_post_type'] = $('#robot-post-type').val();
            fields['robot_post_author'] = $('#robot-post-author').val();
            fields['translation'] = $('.translation.active').data('nav');
            fields['facebook_source_type'] = $('.facebook_source_type.active').data('nav');


            // set selected category data
            var select_category_data = $('.robot-category-multi-select').select2('data');
            var selected_category = select_category_data.map(function (el) {
                return el.id;
            });
            fields['robot-post-category'] = selected_category;

            // set selected tag data
            var select_tag_data = $('.robot-tag-multi-select').select2('data');
            var selected_tag = select_tag_data.map(function (el) {
                return el.id;
            });
            console.log(selected_tag);
            fields['robot-post-tag'] = selected_tag;

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_save_campaign',
                        fields_data  : fields,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce


                    },
                    beforeSend: function() {

                        $('.robot-status-changes').html('<ion-icon name="reload-circle"></ion-icon></ion-icon>Saving');

                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( options ) {
                    if( false === options.success ) {
                        console.log(options);
                    } else {
                        $( "input[name='campaign_id']" ).val(options.data);


                        // update campaign status
                        $('.robot-tag').html('draft');
                        $('.robot-tag').removeClass('robot-tag-published');
                        $('.robot-tag').addClass('robot-tag-draft');

                        // update campaign save icon status
                        $('.robot-status-changes').html('<ion-icon class="robot-icon-saved" name="checkmark-circle"></ion-icon>Saved');

                        // update campaign button text
                        $('.campaign-save-text').text('save draft');
                        $('.campaign-publish-text').text('publish');

                        //update page url with campaign id
                        var campaign_url = Auto_Robot_Data.wizard_url+ '&id=' + options.data + '&source=' + fields['robot_selected_source'];
                        window.history.replaceState('','',campaign_url);
                    }
                });

        },

        /**
         * Publish Campaign
         *
         */
        _publishCampaign: function( ) {

            var formdata = $('.robot-campaign-form').serializeArray();
            var fields = {};
            $(formdata ).each(function(index, obj){
                fields[obj.name] = obj.value;
            });
            fields['campaign_status'] = 'publish';
            fields['update_frequency'] = $('.range-slider__value').text();
            fields['update_frequency_unit'] = $('#robot-field-unit-button').val();
            fields['robot_post_status'] = $('#robot-post-status').val();
            fields['robot_post_type'] = $('#robot-post-type').val();
            fields['robot_post_author'] = $('#robot-post-author').val();
            fields['translation'] = $('.translation.active').data('nav');
            fields['facebook_source_type'] = $('.facebook_source_type.active').data('nav');


            // set selected category data
            var select_category_data = $('.robot-category-multi-select').select2('data');
            var selected_category = select_category_data.map(function (el) {
                return el.id;
            });
            fields['robot-post-category'] = selected_category;

            // set selected tag data
            var select_tag_data = $('.robot-tag-multi-select').select2('data');
            var selected_tag = select_tag_data.map(function (el) {
                return el.id;
            });
            console.log(selected_tag);
            fields['robot-post-tag'] = selected_tag;

            console.log(Auto_Robot_Data.ajaxurl);

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_save_campaign',
                        fields_data  : fields,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce,


                    },
                    beforeSend: function() {

                        $('.robot-status-changes').html('<ion-icon name="reload-circle"></ion-icon></ion-icon>Saving');

                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( options ) {
                    if( false === options.success ) {
                        console.log(options);
                    } else {
                        $( "input[name='campaign_id']" ).val(options.data);

                        // update campaign tag status
                        $('.robot-tag').html('published');
                        $('.robot-tag').removeClass('robot-tag-draft');
                        $('.robot-tag').addClass('robot-tag-published');

                        // update campaign save icon status
                        $('.robot-status-changes').html('<ion-icon class="robot-icon-saved" name="checkmark-circle"></ion-icon>Saved');

                        // update campaign button text
                        $('.campaign-save-text').text('unpublish');
                        $('.campaign-publish-text').text('update');

                        //update page url with campaign id
                        var campaign_url = Auto_Robot_Data.wizard_url+ '&id=' + options.data + '&source=' + fields['robot_selected_source'];
                        window.history.replaceState('','',campaign_url);
                    }
                });

        },

        /**
         * Run Campaign
         *
         */
        _runCampaign: function( ) {

            var fields = {};
            fields['campaign_id'] = $( "input[name='campaign_id']" ).val();

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_run_campaign',
                        fields_data  : fields,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce,
                    },
                    beforeSend: function() {
                      $('.robot-box-footer').hide();
                      $('.robot-campaign-popup-body').html('<div class="robot-campaign-running"><div class="loader" id="loader-1"></div><span>running now...</span><div>');
                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( option ) {
                    if( false === option.success ) {
                        console.log(option);
                        $('.robot-campaign-popup-body').html(option.data);
                    } else {
                        console.log(option.data);
                        $('.robot-campaign-popup-body').html('Running Log:<br>');
                        $.each(option.data, function(index, value) {
                            $('.robot-campaign-popup-body').append(value.message);
                            $('.robot-campaign-popup-body').append('<br>');
                        });
                        $('.robot-campaign-popup-body').append('Finished');

                        $('.robot-box-footer').show();
                    }

                });

        },


        /**
         * Sticky Header
         *
         */
        _stickyHeader: function( ) {

                //===== Sticky

                $(window).on('scroll',function(event) {
                    var scroll = $(window).scrollTop();
                    if (scroll < 245) {
                         $(".robot-box-sticky").removeClass("robot-is-sticky");
                    }else{
                          $(".robot-box-sticky").addClass("robot-is-sticky");
                    }
                });

        },

        /**
         * Load Popup
         *
         */
        _loadPopup: function( ) {

            $('.open-popup-campaign').magnificPopup({
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
         * Mobile Select
         *
         */
        _mobileSelect: function( ) {

            // onClick new options list of new select
            var newOptions = $('.robot-vertical-tabs > li');
            newOptions.on('click', function(){
                $('.robot-select-content').text($(this).text());
                $('.robot-vertical-tabs > li').removeClass('selected');
                $(this).addClass('selected');
            });

            var aeDropdown = $('.robot-sidenav');
            aeDropdown.on('click', function(){
                $('.robot-vertical-tabs').toggleClass('robot-sidenav-hide-md');
            });

        },

        /**
         * Range Slider
         *
         */
        _rangeSlider: function( ) {

            var slider = $('.range-slider'),
                range = $('.range-slider__range'),
                value = $('.range-slider__value');

            slider.each(function(){

                value.each(function(){
                    var value = $(this).prev().attr('value');
                    $(this).html(value);
                });

                range.on('input', function(){
                    $(this).next(value).html(this.value);
                });
            });

        },

        /**
         * Main Select
         *
         */
        _mainSelect: function( ) {

            // onClick new options list of new select
            var newOptions = $('.list-results > li');
            newOptions.on('click', function(){
                $(this).closest('.select-list-container').find('.list-value').text($(this).text());
                $(this).closest('.select-list-container').find('.list-value').val($(this).text());
                $(this).closest('.select-list-container').find('.list-results > li').removeClass('selected');
                $(this).addClass('selected');
            });

            var aeDropdown = $('.select-list-container');
            aeDropdown.on('click', function(){
                $(this).closest('.select-list-container').find('.list-results').toggleClass('robot-sidenav-hide-md');
            });

            var robotDropdown = $('.dropdown-handle');
            robotDropdown.on('click', function(){
                $(this).closest('.select-list-container').find('.list-results').toggleClass('robot-sidenav-hide-md');
            });

        },

        /**
         * Post Select
         *
         */
        _postSelect: function( ) {

            // onClick new options list of new select
            var newOptions = $('.post-list-results > li');
            newOptions.on('click', function(){
                $('.post-list-value').text($(this).text());
                $('.post-list-value').val($(this).text());
                $('.post-list-results > li').removeClass('selected');
                $(this).addClass('selected');
            });

            var aeDropdown = $('.post-select-list-container');
            aeDropdown.on('click', function(){
                $('.post-list-results').toggleClass('robot-sidenav-hide-md');
            });

            var robotDropdown = $('.post-dropdown-handle');
            robotDropdown.on('click', function(){
                $('.post-list-results').toggleClass('robot-sidenav-hide-md');
            });
        },

        /**
         * Type Select
         *
         */
        _typeSelect: function( ) {

            // onClick new options list of new select
            var newOptions = $('.type-list-results > li');
            newOptions.on('click', function(){
                $('.type-list-value').text($(this).text());
                $('.type-list-value').val($(this).text());
                $('.type-list-results > li').removeClass('selected');
                $(this).addClass('selected');
            });

            var aeDropdown = $('.type-select-list-container');
            aeDropdown.on('click', function(){
                $('.type-list-results').toggleClass('robot-sidenav-hide-md');

            });

            var robotDropdown = $('.type-dropdown-handle');
            robotDropdown.on('click', function(){
                $('.type-list-results').toggleClass('robot-sidenav-hide-md');
            });

        },

        /**
         * Author Select
         *
         */
        _authorSelect: function( ) {

            // onClick new options list of new select
            var newOptions = $('.author-list-results > li');
            newOptions.on('click', function(){
                $('.author-list-value').text($(this).text());
                $('.author-list-value').val($(this).text());
                $('.author-list-results > li').removeClass('selected');
                $(this).addClass('selected');
            });

            var aeDropdown = $('.author-select-list-container');
            aeDropdown.on('click', function(){
                $('.author-list-results').toggleClass('robot-sidenav-hide-md');

            });

            var robotDropdown = $('.author-dropdown-handle');
            robotDropdown.on('click', function(){
                $('.author-list-results').toggleClass('robot-sidenav-hide-md');
            });

        },

        /**
         * Category Select
         *
         */
        _categorySelect: function( ) {

            // Categories Select2
            $(".robot-category-multi-select").select2({
                placeholder: "Select your post categories here", //placeholder
                allowClear: true
            });

            // Tags Select2
            $(".robot-tag-multi-select").select2({
                placeholder: "Select your post tags here", //placeholder
                allowClear: true
            });

        },

        /**
         * Switch Sui Tabs
         *
         */
        _switchSuiTabs: function( event ) {

            event.preventDefault();

            //console.log('clicked');

            var tab = '#' + $(this).data('nav');

            console.log(tab);

            $('.sui-tab-item').removeClass('active');
            $(this).addClass('active');

            $('.sui-tab-content').removeClass('active');
            $('.sui-tabs-content').find(tab).addClass('active');


        },

        /**
         * Source Select
         *
         */
        _sourceSelect: function( ) {

            var tab = '#' + $('.robot_youtube_source_category').val();

            // Load action tab
            //$('.sui-tab-content').removeClass('active');
            $('.sui-tabs-content').find(tab).addClass('active');

            // onClick new options list of new select
            var newOptions = $('.source-list-results > li');
            newOptions.on('click', function(){
                $('.source-list-value').text($(this).text());
                $('.source-list-value').val($(this).text());
                $('.source-list-results > li').removeClass('selected');
                $(this).addClass('selected');
            });

            var aeDropdown = $('.source-select-list-container');
            aeDropdown.on('click', function(){
                $('.source-list-results').toggleClass('source-robot-sidenav-hide-md');
            });

            var robotDropdown = $('.source-dropdown-handle');
            robotDropdown.on('click', function(){
                $('.source-list-results').toggleClass('source-robot-sidenav-hide-md');
            });

        },

        /**
         * Source Select Tab
         *
         */
        _sourceSelectTab: function( event ) {

            event.preventDefault();

            // onClick new options list of new select
            var newOptions = $('.source-list-results > li');
            newOptions.on('click', function(){

                var tab = '#' + $(this).data('nav');


                $('.sui-tab-content').removeClass('active');
                $('.sui-tabs-content').find(tab).addClass('active');

                $('.robot_youtube_source_category').val($(this).text());

            });

        },

        /**
         * Append template shortcode
         *
         */
        _appendTemplate: function( ) {
            var template = $("#robot-main-post-template").val();
            var shortcode = $("#robot-field-shortcode-button").val();
            console.log(template + shortcode);
            $("#robot-main-post-template").val(template + shortcode);
        },

        /**
         * Clear logs
         *
         */
        _clearLogs: function( event ) {

            event.preventDefault();

            if (!confirm('Are you sure you wish to permanently delete logs?')) {
				return;
			}

            $.ajax({
                url  : Auto_Robot_Data.ajaxurl,
                type : 'POST',
                dataType: 'json',
                data : {
                    action       : 'auto_robot_clear_logs',
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
                    AutoRobotAction._displayNoticeMessage(options.data);
                    window.location.reload();
                }
            });


        },

        /**
         * Display Notice Message
         *
         */
        _displayNoticeMessage: function(message) {
            var html = '<div class="message-box robot-message-box success">' + message + '</div>';
            $(html).appendTo(".robot-wrap").fadeIn('slow').animate({opacity: 1.0}, 2500).fadeOut('slow');;

        },

        /**
         * Category Selector
         *
         */
         _translatorAPISelector: function( ) {

            $('.translator-api').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                /* api type expanded */
                $(this).toggleClass('expanded');

                /* set api value */
                var translator_api = $('#'+$(e.target).attr('for'));
                translator_api.prop('checked',true);
            });

            $('.translator-from-language').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                /* api type expanded */
                $(this).toggleClass('expanded');

                /* set from language value */
                //var translator_from_language = $('#'+$(e.target).attr('for'));
                var translator_from_language = $(this).find('#'+$(e.target).attr('for'));
                translator_from_language.prop('checked',true);
            });

            $('.translator-to-language').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                /* api type expanded */
                $(this).toggleClass('expanded');

                /* set to language value */
                //var translator_to_language = $('#'+$(e.target).attr('for'));
                var translator_to_language = $(this).find('#'+$(e.target).attr('for'));
                translator_to_language.prop('checked',true);
            });

        },

    };

    /**
     * Initialize AutoRobotAction
     */
    $(function(){
        AutoRobotAction.init();
    });

})(jQuery);
