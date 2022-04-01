jQuery(function($) {

    /**
     * Init
     */
    function init() {

        set_iframe_height();

        $(window).on( 'resize', function(){
            set_iframe_height();
        });

    }


    function set_iframe_height() {
        $('.aw-preview__email-iframe').height( $(window).height() - $('.aw-preview__header').outerHeight() );
    }



    $('form.aw-preview__send-test-form').on( 'submit', function(e){
        e.preventDefault();

        var $form = $(this);

        $form.addClass('aw-loading');
        $form.find('button').trigger( 'blur' );

        var data = {
            action: 'aw_send_test_email',
            type: $form.find('[name="type"]').val(),
            to_emails: $form.find('[name="to_emails"]').val(),
            args: JSON.parse( $form.find('[name="args"]').val() )
        };

        $.post( ajaxurl, data, function( response ){
            alert( response.data.message );
            $form.removeClass('aw-loading');
        });

        return false;

    });


    init();

});
