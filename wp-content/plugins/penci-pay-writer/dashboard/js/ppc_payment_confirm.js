jQuery(document).ready(function($) {
    /* Hide and display detailed table for each user */
    $(".ppcp-confirm-payment-hide-detailed").unbind('click').click(function(e) {
        e.preventDefault();
        var user = $(this).attr(("accesskey"));

        var table = $("#ppcp-confirm-detailed-table_"+user);
        table.css("opacity", "0.40");
        table.slideUp();
    });
    $(".ppcp-confirm-payment-display-detailed").unbind('click').click(function(e) {
        e.preventDefault();
        var user = $(this).attr(("accesskey"));

        var table = $("#ppcp-confirm-detailed-table_"+user);
        table.css("opacity", "1");
        table.slideDown();
    });

    /* Confirm payment */
    $("#ppcp_confirm_payment").unbind('click').click(function(e) {
        e.preventDefault();

        $("#ppcp_confirm_payment_error").css('display', 'none');

        //Disable confirm button
        $("#ppcp_confirm_payment").attr("disabled", "true");
        $('#ppcp_confirm_payment_loading').css("display", "block");

        //CONFIRM MARK AS PAID
        if($("#ppcp_payment_action").val() == 'ppcp_mark_as_paid') {
            var data = {
                action:         'ppcp_mark_as_paid',
                _ajax_nonce:    ppcp_payment_confirm_vars.nonce_ppcp_confirm_payment,
                form_data:      $('#ppcp_confirm_payment_form').serializeAnything(),
            };

            //AJAX request
            $.post(ajaxurl, data, function(response) {
                $('#ppcp_confirm_payment_loading').css("display", "none");
                console.log(response);
                //If error
                if(! response.success) {
                    $("#ppcp_confirm_payment_error").css("display", "block");
                    $("#ppcp_confirm_payment_error").html(response.data.message);
                    $("#ppcp_confirm_payment").removeAttr("disabled");
                    return false;

                    //If everything's fine
                } else {
                    $("#ppcp_confirm_payment_success").css("display", "block");
                    window.location.replace(response.data.redirect_url);
                }
            });

            //CONFIRM PAYPAL
        } else if($("#ppcp_payment_action").val() == 'ppcp_paypal_payment') {
            var data = {
                action:         'ppcp_paypal_payment',
                _ajax_nonce:    ppcp_payment_confirm_vars.nonce_ppcp_confirm_payment,
                form_data:      $('#ppcp_confirm_payment_form').serializeAnything(),
            };

            //AJAX request to prepare payment and get PayKey
            $.post(ajaxurl, data, function(response) {
                $('#ppcp_confirm_payment_loading').css("display", "none");

                //If error
                if(! response.success) {
                    $("#ppcp_confirm_payment_error").css("display", "block");
                    $("#ppcp_confirm_payment_error").html(response.data.message);
                    $("#ppcp_confirm_payment").removeAttr("disabled");

                    return false;

                    //If everything's fine
                } else {
                    $("#ppcp_confirm_payment_success").html(ppcp_payment_confirm_vars.localized_paypal_payment_successful);
                    $("#ppcp_confirm_payment_success").css("display", "block");
                    window.location.replace(response.data.redirect_url);
                }
            });

        } else {
            $("#ppcp_confirm_payment_error").css("display", "block");
            $("#ppcp_confirm_payment_error").html('NO');
        }
    });
});
