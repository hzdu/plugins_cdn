function wfacp_show_form_popup() {

    jQuery("body").append("<div id='WFACP_MB_overlay'></div><div id='WFACP_MB_window' class='wfacpmodal-loading'></div>");
    jQuery("#WFACP_MB_overlay").click(wfacp_modal_remove);
    jQuery('body').addClass('modal-open');
    jQuery("#WFACP_MB_overlay").addClass("WFACP_MB_overlayBG");//use background and opacity

    var WFACP_MB_WIDTH, WFACP_MB_HEIGHT, ajaxContentW, ajaxContentH;
    WFACP_MB_WIDTH =  630; //defaults to 630 if no parameters were added to URL
    WFACP_MB_HEIGHT =  440; //defaults to 440 if no parameters were added to URL


    WFACP_MB_WIDTH = 1030; //defaults to 630 if no parameters were added to URL
    WFACP_MB_HEIGHT = 540; //defaults to 440 if no parameters were added to URL


    ajaxContentW = WFACP_MB_WIDTH - 30;
    ajaxContentH = WFACP_MB_HEIGHT - 45;
    if (jQuery("#WFACP_MB_window").css("visibility") != "visible") {


        jQuery("#WFACP_MB_window").append("<div id='WFACP_MB_title'>" +
            "<div id='WFACP_MB_ajaxWindowTitle'>Aero Checkout Form Classes</div>" +
            "<div id='WFACP_MB_closeAjaxWindow'>" +
            "<a href='#' id='WFACP_MB_closeWindowButton'>" +
            "<div class='wfacp_modal_close_btn'></div>" +
            "</a>" +
            "</div>" +
            "</div>" +
            "<div id='WFACP_MB_ajaxContent' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px'>" +
            "</div>");

        jQuery("#WFACP_MB_ajaxContent").append(jQuery('#wfacp_form_popup_content').html());
        wfacp_modal_position(WFACP_MB_WIDTH, WFACP_MB_HEIGHT);
        jQuery("#WFACP_MB_load").remove();
        jQuery("#WFACP_MB_window").css({'visibility': 'visible'});
        jQuery("#WFACP_MB_closeWindowButton").click(wfacp_modal_remove);

    }
}

function wfacp_modal_position(WFACP_MB_WIDTH, WFACP_MB_HEIGHT) {
    var isIE6 = typeof document.body.style.maxHeight === "undefined";

    jQuery("#WFACP_MB_window").css({marginLeft: '-' + parseInt((WFACP_MB_WIDTH / 2), 10) + 'px', width: WFACP_MB_WIDTH + 'px'});
    if (!isIE6) { // take away IE6
        jQuery("#WFACP_MB_window").css({marginTop: '-' + parseInt((WFACP_MB_HEIGHT / 2), 10) + 'px'});
    }
}

function wfacp_modal_remove() {
    jQuery("#WFACP_MB_imageOff").unbind("click");
    jQuery("#WFACP_MB_closeWindowButton").unbind("click");
    jQuery( '#WFACP_MB_window' ).fadeOut( 'fast', function() {
        jQuery( '#WFACP_MB_window, #WFACP_MB_overlay, #WFACP_MB_HideSelect' ).trigger( 'wfacp_modal_unload' ).unbind().remove();
        jQuery( 'body' ).trigger( 'wfacpmodal:removed' );
    });
    jQuery( 'body' ).removeClass( 'modal-open' );
    jQuery("#WFACP_MB_load").remove();
    if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
        jQuery("body","html").css({height: "auto", width: "auto"});
        jQuery("html").css("overflow","");
    }
    jQuery(document).unbind('.wfacpmodal');
    return false;
}