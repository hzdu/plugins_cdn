"use strict";

(function ($)
{
    $(document).ready(function() {
        var tourActive = false,
            overlayActive = false;
        function createOverlay(){
            // if there are no tooltips
            if($('.wpil-is-tooltipped').length < 1 || $('.block-editor-page').length > 0 || parseInt(wpil_ajax.dismiss_explain_page) === 1){
                // don't setup for a tooltip tour!
                return;
            }

            // Add controls and overlay to the body
            $('body').append($('#wpil-help-overlay-controls').detach());
            $('body').append('<div id="wpil-help-overlay"></div>'); // style="opacity:0.01"
            $('body').append(wpil_ajax.wpil_help_overlay_controls);
        }
        createOverlay();

        function hideOverlay(){
            $('#wpil-help-overlay, #wpil-help-overlay-controls').fadeOut(function(){
                //$('#wpil-explain-part-button').fadeIn();
            });
            removeHighlight();
            $('.wpil-active-help-text-bubble').remove();
            $('#wpil-explain-page-button').text('Explain Page');
            overlayActive = tourActive = false;
            currentStep = 0;
            clearTimeout(waiter);
            clearTimeout(playWaiter);
        }

        // Function to highlight a specific element
        function highlightElement(selector) {
            if($(selector).hasClass('wpil-no-overlay')){
                $('#wpil-help-overlay').css({'opacity': '0.01'});
                //$('#wpil-help-overlay-controls').fadeIn();
            }else{
                $('#wpil-help-overlay').css({'opacity': '1'});
                //$('#wpil-help-overlay, #wpil-help-overlay-controls').fadeIn();
            }

            $('#wpil-help-overlay, #wpil-help-overlay-controls').fadeIn();
            overlayActive = true;
            removeHighlight();
            setupHelpTooltip(selector);
            $(checkIfTargetRelative(selector)).addClass('wpil-help-focused');
        }

        // Function to remove the highlight and overlay
        function removeHighlight() {
            $('.wpil-help-focused').removeClass('wpil-help-focused');
        }

        function setupHelpTooltip(element){
            if(!element){
                return;
            }

            // remove any existing text bubbles
            $('.wpil-active-help-text-bubble').remove();

            // create the template for the help bubbles
            var text = $('<div id="wpil-help-overlay-text-bubble-container" class="wpil-active-help-text-bubble"><div class="wpil-help-overlay-text-area"></div></div>');

            // insert the appropriate text in the bubble
            text.find('.wpil-help-overlay-text-area').html($(element).data('wpil-tooltip-content'));

            // add the tooltip to the body
            $('body').append(text);

            // position it appropriately
            var top = positionTooltip($(element).hasClass('wpil-tooltip-no-position') ? element: checkIfTargetRelative(element), '.wpil-active-help-text-bubble');

            // and scroll to it
            disableDebounce = true;
            $([document.documentElement, document.body]).animate({
                scrollTop: top - (($(window).height()/2) - ($('.wpil-active-help-text-bubble').outerHeight(true)/2))
            }, 500, 'swing', function(){ disableDebounce = false;});
        }

        function positionTooltip(elementSelector, tooltipSelector) {
            const $element = $(elementSelector);
            const $tooltip = $(tooltipSelector);

            // Get dimensions and position of the highlighted element
            const elemOffset = $element.offset();
            const elemWidth = $element.get()[0].getBoundingClientRect().width;
            const elemHeight = $element.get()[0].getBoundingClientRect().height;
        
            // Get tooltip dimensions
            const tooltipWidth = $tooltip.outerWidth(true);
            const tooltipHeight = $tooltip.outerHeight(true);
        
            // Get screen dimensions
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
        
            // Calculate available space around the element
            const spaceAbove = elemOffset.top - $(window).scrollTop();
            const spaceBelow = screenHeight - (elemOffset.top - $(window).scrollTop() + elemHeight);
            const spaceLeft = elemOffset.left - $(window).scrollLeft();
            const spaceRight = screenWidth - (elemOffset.left - $(window).scrollLeft() + elemWidth);

            // Determine optimal position for the tooltip
            let top, left; // Coordinates for tooltip positioning

            if (spaceRight >= tooltipWidth) {
                // Position to the right if there's enough space
                top = elemOffset.top + elemHeight / 2 - tooltipHeight / 2;
                left = elemOffset.left + elemWidth;
            } else if (spaceLeft >= tooltipWidth) {
                // Position to the left if there's enough space
                top = elemOffset.top + elemHeight / 2 - tooltipHeight / 2;
                left = elemOffset.left - tooltipWidth;
            } else if (spaceBelow >= tooltipHeight) {
                // Position below if there's enough space
                top = elemOffset.top + elemHeight;
                left = elemOffset.left + elemWidth / 2 - tooltipWidth / 2;
            } else if (spaceAbove >= tooltipHeight) {
                // Position above if there's enough space
                top = elemOffset.top - tooltipHeight;
                left = elemOffset.left + elemWidth / 2 - tooltipWidth / 2;
            } else {
                // Default to placing below and center-align with element if no optimal space
                top = elemOffset.top + elemHeight;
                left = elemOffset.left + elemWidth / 2 - tooltipWidth / 2;
            }

            // Apply calculated position to the tooltip
            $tooltip.css({ top: `${top}px`, left: `${left}px`, position: 'absolute' });

            // return the top position in case there's follow up positioning
            return top;
        }


        // Debounce function to limit function calls on rapid events
        var waiter,
            disableDebounce = false;
        function debounce(delay) {
            if(!overlayActive){
                return;
            }

            if(disableDebounce){
                clearTimeout(waiter);
                return;
            }

            clearTimeout(waiter);
            waiter = setTimeout(function(){
                positionTooltip('.wpil-help-focused', '.wpil-active-help-text-bubble');
            }, delay);
        }

        function setupPostionListening(){
            // Add scroll and resize event listeners with debounce
            $(window).on('scroll.tooltip resize.tooltip', function(){debounce(100)});
        }
        setupPostionListening();

        // Example to remove the highlight (you can bind it to any event, like next button)
        $('#wpil-help-overlay').on('click', hideOverlay);

        // remove any duplicate tooltip tags
        function deDupe(){
            var classes = [
                'wpil-tooltip-target\\.column-wpil_links_inbound_internal_count',
                'wpil-tooltip-target\\.column-wpil_links_outbound_internal_count',
                'wpil-tooltip-target\\.column-wpil_links_outbound_external_count',
                'wpil-tooltip-target\\.column-attributes',
                'wpil-tooltip-target\\.column-posts',
                'wpil-tooltip-target\\.column-links',
                'wpil-tooltip-target\\.column-post_title',
                'wpil-tooltip-target\\.column-date',
                'wpil-tooltip-target\\.column-post_type',
                'wpil-tooltip-target\\.column-clicks',
                'wpil-tooltip-target\\.column-checkbox',
                'wpil-tooltip-target\\.column-post',
                'wpil-tooltip-target\\.column-url',
                'wpil-tooltip-target\\.column-anchor',
                'wpil-tooltip-target\\.column-sentence',
                'wpil-tooltip-target\\.column-type',
                'wpil-tooltip-target\\.column-code',
                'wpil-tooltip-target\\.column-created',
                'wpil-tooltip-target\\.column-actions',
            ];

            for(var i in classes){
                var first = $('.' + classes[i]).first();
                $('.' + classes[i]).removeClass('wpil-is-tooltipped');
                first.addClass('wpil-is-tooltipped');
            }
        }
        deDupe();

        var tourSteps = $('.wpil-is-tooltipped:visible'),
            currentStep = 0,
            isPlaying = false,
            playWaiter;

        // Function to update the step display in the control panel
        function updateStepDisplay() {
            $('.segments-completed').text(currentStep + 1);
            $('.segments-total').text(tourSteps.length);
        }

        // Function to show the current step
        function showCurrentStep() {
            const selector = tourSteps[currentStep];
            highlightElement(selector); // Highlight element function as defined before
            updateStepDisplay();
        }

        // Functions to control navigation
        function nextStep() {
            if (currentStep < tourSteps.length - 1) {
                currentStep++;
                showCurrentStep();

                if(isPlaying){
                    var wait = getStepTime();
                    clearTimeout(playWaiter);
                    playWaiter = setTimeout(function(){
                        if (currentStep < tourSteps.length - 1) {
                            nextStep();
                        } else {
                            pauseTour(); // Auto-pause at the end
                        }
                    }, wait);
                }
            }
        }

        function previousStep() {
            if (currentStep > 0) {
                currentStep--;
                showCurrentStep();
            }
        }

        function playTour() {
            isPlaying = true;
            $('.wpil-help-pause').css({'display': 'inline-block'});
            $('.wpil-help-play').css({'display': 'none'});

            var wait = getStepTime();
            clearTimeout(playWaiter);
            playWaiter = setTimeout(function(){
                nextStep();
            }, wait);
        }

        function pauseTour() {
            isPlaying = false;
            $('.wpil-help-pause').css({'display': 'none'});
            $('.wpil-help-play').css({'display': 'inline-block'});
            clearTimeout(playWaiter);
        }

        function getStepTime(selector = false){
            if(!selector){
                selector = tourSteps[currentStep];
            }

            var wait = 3500,
                element = $(selector);
            if(element.length > 0 && element.data('wpil-tooltip-read-time')){
                wait = parseInt(element.data('wpil-tooltip-read-time'));
            }

            return wait;
        }

        // Initial display update
        updateStepDisplay();

        $(document).on('click', '.wpil-help-focused', function(){
            positionTooltip('.wpil-help-focused', '.wpil-active-help-text-bubble');
        });

        // Event listeners for control buttons
        $('.wpil-help-backward').on('click', function() {
            pauseTour();
            previousStep();
        });

        $('.wpil-help-forward').on('click', function() {
            pauseTour();
            nextStep();
        });

        $('.wpil-help-play').on('click', function() {
            if (!isPlaying) {
                tourSteps = $('.wpil-is-tooltipped:visible');
                if(currentStep == tourSteps.length - 1){
                    currentStep = 0;
                    showCurrentStep();
                }
                playTour();
            }
        });

        $('.wpil-help-pause').on('click', function() {
            if (isPlaying) {
                pauseTour();
            }
        });

        $('#wpil-explain-page-button').on('click', function(){
            // toggle the tour state
            tourActive = (tourActive) ? false: true;

            if(tourActive){
                // get the tooltips
                tourSteps = $('.wpil-is-tooltipped:visible');
                // Start at the first step
                showCurrentStep();
                // begin the tour
                playTour();
                // change the button text
                $(this).text('Stop Explaining');
                // hide the explain part button
                //$('#wpil-explain-part-button').css({'display': 'none'});
            }else{
                hideOverlay();
            }
        });

        function checkIfTargetRelative(selector){
            if($(selector).hasClass('wpil-tooltip-target-child')){
                var child = false,
                    classes = $(selector).attr("class").split(/\s+/);
                if(classes.length > 0){
                    for(var i in classes){
                        if(-1 !== classes[i].indexOf('wpil-tooltip-target')){
                            child = $(classes[i].substring(19));
                        }
                    }
                }

                if(child){
                    if($(selector).hasClass('wpil-no-scale')){
                        $(child).addClass('wpil-no-scale');
                    }
                    selector = child;
                }
            }else if($(selector).hasClass('wpil-tooltip-target-parent')){
                var parent = false,
                classes = $(selector).attr("class").split(/\s+/);
                if(classes.length > 0){
                    for(var i in classes){
                        if(-1 !== classes[i].indexOf('wpil-tooltip-target')){
                            parent = $(classes[i].substring(19));
                        }
                    }
                }

                if(parent){
                    if($(selector).hasClass('wpil-no-scale')){
                        $(parent).addClass('wpil-no-scale');
                    }
                    selector = parent;
                }
            }

            return selector;
        }

        $(document).on('click', '#wpil-hide-explain-page-x', toggleHideExplainPage);

        var hideOptionOpen = false;
        function toggleHideExplainPage(){
            var controls    = $('#wpil-explain-page-control-wrapper'),
                hideOptions = $('#wpil-hide-explain-page-option-wrapper');

            if(hideOptionOpen){
                controls.css({'display': 'block'});
                hideOptions.css({'display': 'none'});
            }else{
                controls.css({'display': 'none'});
                hideOptions.css({'display': 'block'});
            }
            hideOptionOpen = (hideOptionOpen) ? false: true;
        }

        $(document).on('click', '.wpil-hide-explain-page-button', hideExplainPage);
        function hideExplainPage(){
            var button = parseInt($(this).val());

            if(button === 1){
                permHideExplainPage();
            }else if(button === 2){
                permHideExplainPage(true);
            }

            $('#wpil-floating-help-menu').hide();
        }

        function permHideExplainPage(hideOnAllPages = false){
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'wpil_hide_explain_page',
                    current_page: wpil_ajax.current_page,
                    hide_on_all_pages: ((hideOnAllPages) ? 1: 0),
                    nonce: $('#wpil-floating-help-menu-nonce').val(),
                },
            });
        }

    });

})(jQuery);