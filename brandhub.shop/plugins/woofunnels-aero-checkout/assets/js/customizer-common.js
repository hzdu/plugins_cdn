(function ($) {
    "use strict";
    $(window).on('load', function () {
        if (typeof wfacp_customizer !== 'undefined' && wfacp_customizer.hasOwnProperty('is_loaded') && wfacp_customizer.is_loaded === 'yes' && wfacp_customizer.wfacp_id > 0) {
            // console.log('wfacp_customizer testing', wfacp_customizer);
            // alert(wfacp_customizer);
            wp.customize.bind('changeset-save', function (submittedChanges, submittedArgs) {
                submittedArgs.wfacp_customize = 'loaded';
                submittedArgs.wfacp_id = wfacp_customizer.wfacp_id;

            });
            wp.customize.bind('save-request-params', function (data) {
                data.wfacp_customize = 'loaded';
                data.wfacp_id = wfacp_customizer.wfacp_id;
                return data;
            });
            $(document).on('heartbeat-send', function (event, data) {
                // Add additional data to Heartbeat data.
                data.wfacp_customize = 'loaded';
                data.wfacp_id = wfacp_customizer.wfacp_id;
            });

        }
        $('#accordion-panel-wfacp_form').on('click', function () {
            $('.wfacp_preview_msg').hide();
        });

        $('#sub-accordion-section-wfacp_form_form_fields .customize-section-back').on('click', function () {
            $('.wfacp_preview_msg').hide();
        });

        $('#sub-accordion-section-wfacp_form_section .customize-section-back').on('click', function () {
            $('.wfacp_preview_msg').hide();
        });


        $('.customize-panel-back').on('click', function () {
            $('.wfacp_preview_msg').show();
        });

        if ($("#publish-settings").length > 0) {
            $("#publish-settings").replaceWith('');
        }

    });
    $(document).ready(function () {
        let accordion_section_title = $("ul.accordion-section-content .customize-section-description-container");
        if (accordion_section_title.length > 0) {

            $("#customize-theme-controls").before('<ul class="wfacp_preview_msg"><li class="customize-control customize-control-wfacpkirki-custom" style="padding: 12px">' + wfacp_customizer.preview_msg + '</li></ul>');
            // accordion_section_title.after('<li class="customize-control customize-control-wfacpkirki-custom">' + wfacp_customizer.preview_msg + '</li>');
        }
    });


    wp.customize('heading_talign', function (value) {

        value.bind(function (newval) {

        });
    });


    wp.customize.state('expandedSection').bind(function (section) {
        $('.wfacp_preview_msg').hide();

        if (typeof section.id === 'undefined') {
            $('.wfacp_preview_msg').show();
            return;
        }
        $('.wfacp_preview_msg').hide();

        var iFrameDOM = $("#customize-preview > iframe").contents();

        var elm = iFrameDOM.find('body div[data-scrollto="' + section.id + '"]');

        if (elm.length > 0) {
            iFrameDOM.find('html, body').animate({
                scrollTop: elm.offset().top
            }, 1000);
        }

    });
})(jQuery);