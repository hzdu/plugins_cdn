$(document).ready(function() {
    var allowedTags = 'div, h1, h2, h3, h4, h5, h6, section, table, main, header, img';
    var allowedTagsHover = 'div:hover, h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover, section:hover, table:hover, main:hover, header:hover, img:hover';

    $('a').click(function() {
        return false;
    });

    $('form').submit(function() {
        return false;
    });

    function updateIgnoreBlocks()
    {
        var xpath = '';
        jQuery('.pcfds-div-ignore').each(function(index, item) {
            xpath += getIgnoreItemXpath(item) + ",\n";
        });

        window.parent.changeExtractorIgnoreRule(xpath);
    }

    function getFixedXPath(className) {
        if (className.indexOf(' ') > -1) {
            return '[contains(@class, "' + className + '")]';
        } else {
            return '[@class="' + className + '"]';
        }
    }

    function getIgnoreItemXpath(item)
    {
        jQuery(item).addClass('pcfds-div-selected');

        var xpath = '';

        // Current element has ID and doesn't contain numbers
        if (jQuery(item).attr('id') && jQuery(item).attr('id').match(/\d+/g) == null) {
            xpath = '//'+jQuery(item).prop("tagName").toLowerCase()+'[@id="'+jQuery(item).attr('id')+'"]';
        } else {
            xpath = jQuery(item).prop("tagName").toLowerCase();

            var attrs = '';

            if (jQuery(item).prop("className")) {

                var className = jQuery(item).prop("className")
                    .replace("pcfds-div-selected", "")
                    .replace("pcfds-div-ignore", "")
                    .replace("pcfds-div-hover", "")
                    .trim();

                xpath += getFixedXPath(className);
            }

            // Add xpath index if needed
            var selector = jQuery(item).prop("tagName").toLowerCase();

            if (jQuery(item).prop("className")) {
                selector += '.'+jQuery(item).prop("className")
                    .replace("pcfds-div-selected", "")
                    .replace("pcfds-div-ignore", "")
                    .replace("pcfds-div-hover", "")
                    .trim();
            }

            if (jQuery(selector, jQuery(item).parent()).length > 1) {
                jQuery(selector, jQuery(item).parent()).each(function(index, child) {
                    if (jQuery(child)[0] === jQuery(item)[0]) {
                        xpath += '['+(index+1)+']';
                        return;
                    }
                });
            }

            var currentElement = jQuery(item).parent();

            while (1) {
                if (!currentElement || jQuery(currentElement).prop('tagName').toLowerCase() == 'body') {
                    break;
                }
                if (jQuery(currentElement).attr('id') && jQuery(currentElement).attr('id').match(/\d+/g) == null) {
                    xpath = jQuery(currentElement).prop("tagName").toLowerCase() + '[@id="'+jQuery(currentElement).attr('id')+'"]' + '/' + xpath;
                    break;
                } else {
                    attrs = '';
                    if (jQuery(currentElement).prop("className")) {
                        var className = jQuery(currentElement).prop("className")
                            .replace("pcfds-div-selected", "")
                            .replace("pcfds-div-ignore", "")
                            .replace("pcfds-div-hover", "")
                            .trim();

                        attrs = getFixedXPath(className);
                    }

                    xpath = jQuery(currentElement).prop("tagName").toLowerCase() + attrs +'/'+xpath;
                }
                currentElement = jQuery(currentElement).parent();
            }
            xpath = '//'+xpath;
        }

        return xpath;
    }

    jQuery(allowedTags).mousemove(function() {
        if (jQuery(allowedTagsHover, jQuery(this)).length) {
            jQuery(this).removeClass('pcfds-div-hover');
        } else {
            jQuery(this).addClass('pcfds-div-hover');
        }
    }).mouseout(function() {
        jQuery(this).removeClass('pcfds-div-hover');
    }).click(function() {
        if (!jQuery(allowedTagsHover, jQuery(this)).length) {
            // Check if we clicked on the already selected block
            if (jQuery(this).hasClass('pcfds-div-selected')) {
                jQuery(this).removeClass('pcfds-div-selected');
                jQuery(allowedTags, jQuery(this)).removeClass('pcfds-div-selected').removeClass('pcfds-div-ignore');
            }
            // Check if we are inside selected content block
            else if (jQuery(this).parents('.pcfds-div-selected').length) {

                // Check if we clicked on the ignorance block
                if (jQuery(this).hasClass('pcfds-div-ignore')) {
                    // Unignore
                    jQuery(this).removeClass('pcfds-div-ignore');
                    jQuery(allowedTags, jQuery(this)).removeClass('pcfds-div-ignore');

                    // Update ignore box
                    updateIgnoreBlocks();
                } else {
                    // Add to ignore
                    jQuery(this).addClass('pcfds-div-ignore');

                    // Update ignore box
                    updateIgnoreBlocks();
                }

            } else {
                // If not - select block and unselect all previously selected contents of that block
                jQuery('.pcfds-div-selected', jQuery(this)).prop("rss-xpath", null);

                jQuery(allowedTags, jQuery(this)).removeClass('pcfds-div-selected').removeClass('pcfds-div-ignore');
                jQuery(this).addClass('pcfds-div-selected');

                var xpath = '';

                // Current element has ID and ID doesn't contain numbers
                if (jQuery(this).attr('id') && jQuery(this).attr('id').match(/\d+/g) == null) {
                    xpath = '//'+jQuery(this).prop("tagName").toLowerCase()+'[@id="'+jQuery(this).attr('id')+'"]';
                } else {
                    xpath = jQuery(this).prop("tagName").toLowerCase();

                    var attrs = '';

                    if (jQuery(this).prop("className")) {
                        var className = jQuery(this).prop("className")
                            .replace("pcfds-div-selected", "")
                            .replace("pcfds-div-hover", "")
                            .trim();

                        xpath += getFixedXPath(className);
                    }

                    var currentElement = jQuery(this).parent();

                    while (1) {
                        if (!currentElement || jQuery(currentElement).prop('tagName').toLowerCase() == 'body') {
                            break;
                        }
                        if (jQuery(currentElement).attr('id') && jQuery(currentElement).attr('id').match(/\d+/g) == null) {
                            xpath = jQuery(currentElement).prop("tagName").toLowerCase() + '[@id="'+jQuery(currentElement).attr('id')+'"]' + '/' + xpath;
                            break;
                        } else {
                            attrs = '';
                            if (jQuery(currentElement).prop("className")) {
                                var className = jQuery(currentElement).prop("className").trim();

                                attrs = getFixedXPath(className);
                            }

                            xpath = jQuery(currentElement).prop("tagName").toLowerCase() + attrs +'/'+xpath;
                        }
                        currentElement = jQuery(currentElement).parent();
                    }

                    xpath = '//'+xpath;
                }

                jQuery(this).prop("rss-xpath", xpath);

                var totalXpath = '';
                jQuery('.pcfds-div-selected').each(function(index, item) {
                    totalXpath += jQuery(item).prop("rss-xpath") + '|';
                });

                if (totalXpath) {
                    totalXpath = totalXpath.substring(0, totalXpath.length-1);
                }

                // Call parent window function
                window.parent.changeExtractorRule(totalXpath);

                updateIgnoreBlocks();
            }
        }
    });
});