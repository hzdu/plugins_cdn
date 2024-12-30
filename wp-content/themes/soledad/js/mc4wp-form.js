jQuery(document).ready(function ($) {
  $(document).on('submit','.mc4wp-form',function (e){
    e.preventDefault();

    var form = $(this),
        formData = form.serialize();

    form.addClass('loading');

    // Send the AJAX request
    $.ajax({
      url: form.attr('action'),
      type: 'POST',
      data: formData,
      success: function(data) {
        var $html = $(data),
          $message = $html.find('.mc4wp-response').html();
          $('body').append('<div class="penciwp-notice-form"><div class="penciwp-notice-form-inner"><a class="pcwp-close-btn"></a>'+$message+'</div></div>');
      },
      error: function(xhr, status, error) {
        // Handle any errors
        console.error('Error:', error);
        alert('There was an error with the submission.');
      },
      complete: function (){
        form.removeClass('loading');
      }
    });
  });
  $(document).on('click','.pcwp-close-btn',function (e){
    e.preventDefault();
    $('.penciwp-notice-form').remove();
  });
});