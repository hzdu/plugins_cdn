//Given a set of checkboxes through the container (selector), returns the number of checked ones
function get_selected_checkbox_count(selector) {
    var selected_checkbox_count = 0;
    jQuery(selector + " input:checkbox").each(function() {
        if (jQuery(this).is(":checked") && jQuery(this).hasClass("ppcp_one_to_rule_them_all") == false )
            selected_checkbox_count++;
    });

    return selected_checkbox_count;
}

jQuery(document).ready(function($) {

    //Handles checkbox-ruler in pay selection
    $('.ppcp_one_to_rule_them_all').unbind('change').change(function() {

        //Uncheck all
        if(this.checked == false) {
            $('.ppcp_paid_status_update').each(function() {
                $(this).attr('checked', false);
            });
            $('.ppcp_one_to_rule_them_all').each(function() {
                $(this).attr('checked', false);
            });

            //Check all
        } else if(this.checked == true) {

            $('.ppcp_paid_status_update').each(function() {
                if($(this).attr('disabled') != 'disabled') {
                    $(this).attr('checked', true);
                }
            });
            $('.ppcp_one_to_rule_them_all').each(function() {
                $(this).attr('checked', true);
            });
        }
    });

    //PAYMENT PREPARATION
    if($("#ppcp_mark_as_paid_post").length != 0 || $("#ppcp_paypal_payment_post").length != 0 || $("#ppcp_mark_as_paid_author").length != 0 || $("#ppcp_paypal_payment_author").length != 0) {

        $(".ppcp_payment").unbind('click').click(function(e) {
            $("#ppc_stats").attr("action", ppcp_payment_stuff_vars.confirm_payment_form_action); //only change the form action if a payment button is clicked
            $("#ppcp_payment_error").css('display', 'none');

            //No checkboxes selected
            if(get_selected_checkbox_count('#ppc_stats') == 0) {
                jQuery("#ppcp_payment_error").html(ppcp_payment_stuff_vars.localized_no_selection);
                jQuery("#ppcp_payment_error").css("display", "block");

                e.preventDefault();
                return false;
            }
        });
    }
});
