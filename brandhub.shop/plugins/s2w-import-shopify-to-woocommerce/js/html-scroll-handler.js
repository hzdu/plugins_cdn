'use strict';

function s2w_enable_scroll() {
    let html = jQuery('html');
    let scrollTop = parseInt(html.css('top'));
    html.removeClass('s2w-noscroll');
    jQuery('html,body').scrollTop(-scrollTop);
}

function s2w_disable_scroll() {
    let html = jQuery('html');
    if (jQuery(document).height() > jQuery(window).height()) {
        let scrollTop = (html.scrollTop()) ? html.scrollTop() : jQuery('body').scrollTop(); // Works for Chrome, Firefox, IE...
        html.addClass('s2w-noscroll').css('top', -scrollTop);
    }
}