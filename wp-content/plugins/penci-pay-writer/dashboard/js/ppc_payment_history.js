function ppcp_payment_history_handler(type) {

    //Payment history element deletion
    jQuery("body").on("click", ".ppcp_payment_history_delete_"+type, function(e) {
        e.preventDefault();
        jQuery("#ppcp_payment_history_error").css("display", "none");

        var agree = confirm(ppcp_payment_history_vars.localized_confirm_payment_history_delete);
        if (!agree)
            return false;

        var clicked = jQuery(this);

        jQuery("#ppcp_payment_history_loading").css("display", "block");
        clicked.closest('div').css('opacity', '0.3'); //blur to-be-deleted element

        var data = {
            action:       "ppcp_"+type+"_payment_history_delete",
            _ajax_nonce:  ppcp_payment_history_vars.nonce_ppcp_payment_history_delete,
            delete_from:  jQuery("#delete_from").html(),
            tracking_id:  clicked.attr("accesskey")
        };

        jQuery.post(ajaxurl, data, function(response) {
            jQuery("#ppcp_payment_history_loading").css("display", "none");

            if(response.indexOf("ok") < 0) {
                jQuery("#ppcp_payment_history_error").css("display", "block");
                jQuery("#ppcp_payment_history_error").html(response);
            } else {
                clicked.closest(".ppcp_payment_history_element").fadeOut();
            }
        });
    });
}

jQuery(document).ready(function($) {
    //POST PAYMENT HISTORY
    if($(".post_payment_history").length != 0) {
        ppcp_payment_history_handler('post');
    }

    //AUTHOR PAYMENT HISTORY
    if($(".author_payment_history").length != 0) {
        ppcp_payment_history_handler('author');
    }

    //Transaction delete
    jQuery("body").on("click", ".ppcp_transaction_delete", function(e) {
        e.preventDefault();
        jQuery("#ppcp_transaction_error").css("display", "none");

        var agree = confirm(ppcp_payment_history_vars.localized_confirm_transaction_delete);
        if (!agree)
            return false;

        var clicked = jQuery(this);

        jQuery("#ppcp_transaction_loading").css("display", "block");
        clicked.closest('div').css('opacity', '0.3'); //blur to-be-deleted element

        var data = {
            action:       "ppcp_delete_transaction",
            _ajax_nonce:  ppcp_payment_history_vars.nonce_ppcp_transaction_delete,
            tracking_id:  clicked.attr("accesskey")
        };

        jQuery.post(ajaxurl, data, function(response) {
            jQuery("#ppcp_transaction_loading").css("display", "none");

            if(response.indexOf("ok") < 0) {
                jQuery("#ppcp_transaction_error").css("display", "block");
                jQuery("#ppcp_transaction_error").html(response);
            } else {
                jQuery("#ppcp_transaction_success").css("display", "block");
                clicked.closest('div').html(''); //clear window
            }
        });
    });
});
