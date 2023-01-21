(function($){

    "use strict";

    var AutoRobotWelcome = {

        init: function()
        {
            // Document ready.
            this._bind();
        },

        /**
         * Binds events for the Auto Robot Welcome.
         *
         * @since 1.0.0
         * @access private
         * @method _bind
         */
        _bind: function()
        {
            $( document ).on('click', '.robot-welcome-next', AutoRobotWelcome._nextSlider );
            $( document ).on('click', '.robot-welcome-prev', AutoRobotWelcome._prevSlider );
            $( document ).on('keyup', '#robot-search', AutoRobotWelcome._searchSuggest );
            $( document ).on('click', '.robot-keyword-selected', AutoRobotWelcome._selectKeyword );
            $( document ).on('click', '.robot-generate-campaign', AutoRobotWelcome._generateCampaign );
            $( document ).on('click', '.robot-slide-trigger-button', AutoRobotWelcome._triggerCampaign );
            $( document ).ready( AutoRobotWelcome._languageSelector() );
            $( document ).ready( AutoRobotWelcome._typeSelector() );
            $( document ).ready( AutoRobotWelcome._modeSelector() );
            $( document ).ready( AutoRobotWelcome._categorySelector() );
            $( document ).ready( AutoRobotWelcome._changeBgColor() );
        },

        /**
         * Trigger expert campaign
         *
         */
         _triggerCampaign: function( ) {
            var type = $('input[name="robot_init_type"]:checked').val();
            console.log(type);
            var target_url = Auto_Robot_Data.wizard_url + '&source='+ type;
            window.location.replace(target_url);
        },

        /**
         * Generate new campaign
         *
         */
        _generateCampaign: function( event ) {
            event.preventDefault();
            console.log('generate campaign');

            // set post form data
            var formdata = $('#robot-generate-campaign-form').serializeArray();
            var fields = {};
            $(formdata ).each(function(index, obj){
                fields[obj.name] = obj.value;
            });
            fields['campaign_status'] = 'publish';
            fields['robot_post_status'] = 'publish';

            $.ajax({
                    url  : Auto_Robot_Data.ajaxurl,
                    type : 'POST',
                    dataType: 'json',
                    data : {
                        action       : 'auto_robot_generate_campaign',
                        fields_data  : fields,
                        _ajax_nonce  : Auto_Robot_Data._ajax_nonce

                    },
                    beforeSend: function() {

                    },
                })
                .fail(function( jqXHR ){
                    console.log( jqXHR.status + ' ' + jqXHR.responseText);
                })
                .done(function ( options ) {
                    console.log(options);
                    if( false === options.success ) {
                        console.log(options);
                    } else {
                        //redirect to campaigns
                        var campaigns_url = Auto_Robot_Data.campaigns_url;
                        window.location.replace(campaigns_url);
                    }
                });
        },

        /**
         * Show next slider
         *
         */
        _nextSlider: function( event ) {
            event.preventDefault();
            var currentSlider = $('.cd-slider li.visible');
            //cache jQuery objects
           var direction = 'next';
           var svgCoverLayer = $('div.cd-svg-cover');
           var pathId = svgCoverLayer.find('path').attr('id');
           var svgPath = Snap('#' + pathId);
           var mode = $('input[name="robot-mode-switch"]:checked').val();

           //store path 'd' attribute values
           var pathArray = [];
           pathArray[0] = svgCoverLayer.data('step1');
           pathArray[1] = svgCoverLayer.data('step6');
           pathArray[2] = svgCoverLayer.data('step2');
           pathArray[3] = svgCoverLayer.data('step7');
           pathArray[4] = svgCoverLayer.data('step3');
           pathArray[5] = svgCoverLayer.data('step8');
           pathArray[6] = svgCoverLayer.data('step4');
           pathArray[7] = svgCoverLayer.data('step9');
           pathArray[8] = svgCoverLayer.data('step5');
           pathArray[9] = svgCoverLayer.data('step10');

           if ( currentSlider.hasClass('robot-slide-campaign-name') && $( "input[name='robot_campaign_name']" ).val().length == 0 ){
                $('.robot-error-message-name').css("display", "block");
                return;
            }else if(
                currentSlider.hasClass('robot-generate-slide') && $( "input[name='rss_selected_keywords']" ).val().length == 0){
                $('.robot-error-message-keywords').css("display", "block");
                return;
            }else{
                AutoRobotWelcome._sliderLayerAnimate(direction, svgCoverLayer, pathArray, svgPath);
            }

            // Display prev button
            if($('.robot-welcome-prev').css('display') == 'none'){
                setTimeout(function(){
                    $('.robot-welcome-prev').css("display", "block");
                }, 400);
            }

            if ( currentSlider.next('.robot-slide').length ){
                setTimeout(function(){
                    currentSlider.removeClass('visible')
                    .next('.robot-slide')
                    .addClass('visible');
                }, 400);
            }

            if ( currentSlider.next('.robot-slide').hasClass('robot-last-slide') ){
                setTimeout(function(){
                    $('.robot-welcome-prev').css("display", "none");
                    $('.robot-welcome-next').css("display", "none");
                }, 400);
            }

            if ( currentSlider.next('.robot-slide').hasClass('robot-slide-campaign-type') ){
                if (mode == 'smart') {
                    console.log('remove slide');
                    setTimeout(function(){
                        currentSlider.next('.robot-slide').removeClass('visible');
                        $('.robot-slide-campaign-name').addClass('visible');
                    }, 400);
                }
            }

            if ( currentSlider.next('.robot-slide').hasClass('robot-slide-campaign-type') && mode == 'expert'){
                $('.robot-welcome-next').addClass("robot-slide-trigger-button").removeClass("robot-welcome-next");
            }
        },

        /**
         * Show prev slider
         *
         */
         _prevSlider: function( event ) {
            event.preventDefault();

             //cache jQuery objects
           var direction = 'prev';
           var svgCoverLayer = $('div.cd-svg-cover');
           var pathId = svgCoverLayer.find('path').attr('id');
           var svgPath = Snap('#' + pathId);

           //store path 'd' attribute values
           var pathArray = [];
           pathArray[0] = svgCoverLayer.data('step1');
           pathArray[1] = svgCoverLayer.data('step6');
           pathArray[2] = svgCoverLayer.data('step2');
           pathArray[3] = svgCoverLayer.data('step7');
           pathArray[4] = svgCoverLayer.data('step3');
           pathArray[5] = svgCoverLayer.data('step8');
           pathArray[6] = svgCoverLayer.data('step4');
           pathArray[7] = svgCoverLayer.data('step9');
           pathArray[8] = svgCoverLayer.data('step5');
           pathArray[9] = svgCoverLayer.data('step10');

           AutoRobotWelcome._sliderLayerAnimate(direction, svgCoverLayer, pathArray, svgPath);

            var currentSlider = $('.cd-slider li.visible');
            if ( currentSlider.prev('.robot-slide').length ){
                setTimeout(function(){
                        currentSlider.removeClass('visible')
                        .prev('.robot-slide')
                        .addClass('visible');
                }, 400);
            }

            if ( currentSlider.prev('.robot-slide').hasClass('robot-first-slide') ){
                setTimeout(function(){
                    $('.robot-welcome-prev').css("display", "none");
                }, 400);
            }


            if ( currentSlider.prev('.robot-slide').hasClass('robot-slide-campaign-type') ){
                var mode = $('input[name="robot-mode-switch"]:checked').val();
                console.log(mode);
                if (mode == 'smart') {
                    console.log('remove slide');
                    setTimeout(function(){
                        currentSlider.prev('.robot-slide').removeClass('visible');
                        $('.robot-slide-campaign-mode').addClass('visible');
                    }, 400);
                }
            }

        },

        _sliderLayerAnimate: function(direction, svgCoverLayer, paths, svgPath) {
            var duration = 300;
            var delay = 300;
            var epsilon = (1000 / 60 / duration) / 4;
            var firstCustomMinaAnimation = AutoRobotWelcome._bezier(.42, .03, .77, .63, epsilon);
            var secondCustomMinaAnimation = AutoRobotWelcome._bezier(.27, .5, .6, .99, epsilon);

            if (direction == 'next') {
                var path1 = paths[0];
                var path2 = paths[2];
                var path3 = paths[4];
                var path4 = paths[6];
                var path5 = paths[8];
            } else {
                var path1 = paths[1];
                var path2 = paths[3];
                var path3 = paths[5];
                var path4 = paths[7];
                var path5 = paths[9];
            }

            svgCoverLayer.addClass('is-animating');
            svgPath.attr('d', path1);
            svgPath.animate({'d': path2}, duration, firstCustomMinaAnimation, function () {
                svgPath.animate({'d': path3}, duration, secondCustomMinaAnimation, function () {
                    setTimeout(function () {
                        svgPath.animate({'d': path4}, duration, firstCustomMinaAnimation, function () {
                            svgPath.animate({'d': path5}, duration, secondCustomMinaAnimation, function () {
                                svgCoverLayer.removeClass('is-animating');
                            });
                        });
                    }, delay);
                });
            });
        },

        _bezier: function(x1, y1, x2, y2, epsilon) {
            //https://github.com/arian/cubic-bezier
            var curveX = function (t) {
                var v = 1 - t;
                return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
            };

            var curveY = function (t) {
                var v = 1 - t;
                return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
            };

            var derivativeCurveX = function (t) {
                var v = 1 - t;
                return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
            };

            return function (t) {

                var x = t, t0, t1, t2, x2, d2, i;

                // First try a few iterations of Newton's method -- normally very fast.
                for (t2 = x, i = 0; i < 8; i++) {
                    x2 = curveX(t2) - x;
                    if (Math.abs(x2) < epsilon)
                        return curveY(t2);
                    d2 = derivativeCurveX(t2);
                    if (Math.abs(d2) < 1e-6)
                        break;
                    t2 = t2 - x2 / d2;
                }

                t0 = 0, t1 = 1, t2 = x;

                if (t2 < t0)
                    return curveY(t0);
                if (t2 > t1)
                    return curveY(t1);

                // Fallback to the bisection method for reliability.
                while (t0 < t1) {
                    x2 = curveX(t2);
                    if (Math.abs(x2 - x) < epsilon)
                        return curveY(t2);
                    if (x > x2)
                        t0 = t2;
                    else
                        t1 = t2;
                    t2 = (t1 - t0) * .5 + t0;
                }

                // Failure
                return curveY(t2);

            };
        },

        /**
         * Change background color
         *
         */
        _changeBgColor: function( ) {
            $('#wpwrap').css("background-color", "#9bd8ef");
        },

        /**
         * Language Selector
         *
         */
         _languageSelector: function( ) {
            $('.robot-init-language-selector').click(function(e) {
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
         * Type Selector
         *
         */
         _typeSelector: function( ) {
            $('.robot-init-type-selector').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                /* api type expanded */
                $(this).toggleClass('expanded');

                /* set from type value */
                //var translator_from_type = $('#'+$(e.target).attr('for'));
                var type = $(this).find('#'+$(e.target).attr('for'));
                console.log(type);
                type.prop('checked',true);
            });
        },

        /**
         * Mode Selector
         *
         */
         _modeSelector: function( ) {
            $('.mode-switch').click(function(e) {
                var mode = $('input[name="robot-mode-switch"]:checked').val();
                console.log(mode);
                if (mode == 'smart') {
                    $('.robot-slide-campaign-type').removeClass('visible');
                    $('.robot-slide-trigger-button').addClass("robot-welcome-next").removeClass("robot-slide-trigger-button");
                }
                else if(mode == 'expert') {
                    $('.robot-slide-campaign-type').addClass('visible');
                }
            });
            $('.toggle-outside').click(function(e) {
                var mode = $('input[name="robot-mode-switch"]:checked').val();
                if (mode == 'smart') {
                    $('.toggle-inside').css("left", "3.25rem");
                    $('#radio-b').prop('checked',true);
                }
                else if(mode == 'expert') {
                    $('.toggle-inside').css("left", "0.25rem");
                    $('#radio-a').prop('checked',true);
                }
            });
            $('#radio-a').click(function(e) {
                $('.toggle-inside').css("left", "0.25rem");
                $('#radio-a').prop('checked',true);
            });
            $('#radio-b').click(function(e) {
                $('.toggle-inside').css("left", "3.25rem");
                $('#radio-b').prop('checked',true);
            });
        },

        /**
         * Category Selector
         *
         */
         _categorySelector: function( ) {
            $('.robot-init-category-selector').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                /* api type expanded */
                $(this).toggleClass('expanded');

                /* set from category value */
                //var translator_from_category = $('#'+$(e.target).attr('for'));
                var category = $(this).find('#'+$(e.target).attr('for'));
                category.prop('checked',true);
            });
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

            console.log('keywords selected');

            var keyword = $(this).data('keyword');
            var parsed = keyword.replace(/(<([^>]+)>)/ig,"");

            $('#robot-selected-keywords').val(function(i, text) {
                if(text.length === 0){
                    return text +  parsed;
                }else{
                    return text + ', '+ parsed;
                }
            });


            AutoRobotWelcome._addTag(parsed);

        },

        /**
         * Add selected tag
         *
         */
        _addTag: function( textValue ) {
            const tag = document.createElement('div'),
            tagName = document.createElement('label'),
            remove = document.createElement('span');

            const query = document.querySelector.bind(document);

            tagName.setAttribute('class', 'tag-name');
            tagName.textContent = textValue;

            remove.setAttribute('class', 'remove');
            remove.textContent = 'X';
            remove.addEventListener('click', AutoRobotWelcome._deleteTag);

            tag.setAttribute('class', 'tag');
            tag.appendChild(tagName);
            tag.appendChild(remove);

            query('.tags').appendChild(tag);
          },

          /**
          * Delete selected tag
          *
          */
          _deleteTag: function(e) {
            const query = document.querySelector.bind(document);
            var i = Array.from(query('.tags').children).indexOf(e.target.parentElement);
            const index = query('.tags').getElementsByClassName('tag')[i];

            query('.tags').removeChild(index);
          }


    };

    /**
     * Initialize AutoRobotWelcome
     */
    $(function(){
        AutoRobotWelcome.init();
    });

})(jQuery);
