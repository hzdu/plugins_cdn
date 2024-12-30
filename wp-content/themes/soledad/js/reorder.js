jQuery(function ($) {
  $('tr.type-penci_slider').parent().sortable({
    axis: 'y',
    placeholder: 'ui-state-highlight',
    forcePlaceholderSize: true,
    update: function (event, ui) {
      var theOrder = $(this).sortable('toArray')
      var nonce = $(this).
        closest('form#posts-filter').
        children('#_wpnonce').
        attr('value')
      var data = {
        action: 'penci_update_slide_order',
        postType: 'penci_slider',
        order: theOrder,
        penci_meta_box_nonce: nonce,
      }

      $.post(ajaxurl, data)
    },
  }).disableSelection()

  //shifty fix for the title column header in the home slider section
  if ($('td.post-title').parent().hasClass('type-penci_slider')) {
    $('th#title, th.column-title').html('<span>Actions</span>')
  }

  // ORDER

  // Only show the "remove image" button when needed
  if (!jQuery('#penci_categories_thumbnail_id').val()) {
    jQuery('.remove_image_button').hide()
  }

  // Uploading files
  var file_frame

  jQuery(document).on('click', '.penci-add-icon', function (event) {
    event.preventDefault()

    // If the media frame already exists, reopen it.
    if (file_frame) {
      file_frame.open()
      return
    }

    // Create the media frame.
    file_frame = wp.media.frames.downloadable_file = wp.media({
      title: 'Choose an image',
      button: {
        text: 'Use image',
      },
      multiple: false,
    })

    // When an image is selected, run a callback.
    file_frame.on('select', function () {
      var attachment = file_frame.state().get('selection').first().toJSON()
      var attachment_thumbnail =
        attachment.sizes.thumbnail || attachment.sizes.full

      jQuery('.penci-icon-id').val(attachment.id)
      jQuery('.penci-placeholder-img').attr('src', attachment_thumbnail.url)
      jQuery('.remove_image_button').show()
    })

    // Finally, open the modal.
    file_frame.open()
  })

  jQuery(document).ajaxComplete(function (event, request, options) {
    if (
      request &&
      4 === request.readyState &&
      200 === request.status &&
      options.data &&
      0 <= options.data.indexOf('action=add-tag')
    ) {
      var res = wpAjax.parseAjaxResponse(request.responseXML, 'ajax-response')
      if (!res || res.errors) {
        return
      }
      // Clear Thumbnail fields on submit
      jQuery('.penci-placeholder-img').attr(
        'src',
        jQuery('.penci-placeholder-img').attr('data-placeholder'),
      )
      return
    }
  })
});

(function ($) {
  var add_custom_social = function () {
    var _eventRunning = false

    function notify (msg, type) {
      $('.penci-notice').
        html(msg).
        removeClass('notice-success notice-info notice-error').
        addClass('notice-' + type).
        show()
    }

    $(document).on(
      'click',
      '.penci-add-social, .penci-remove-social',
      function (e) {
        e.preventDefault()

        var $el = $(this),
          form = $el.closest('form'),
          type = $el.data('type'),
          nonce = $('[name="penci_ajax_processor_nonce"]').val(),
          urlField = form.find('[name="social_url"]'),
          iconField = form.find('[name="penci-icon-id"]'),
          nameField = form.find('[name="social_name"]'),
          colorField = form.find('[name="social_color"]'),
          name = $el.data('name'),
          spinner = $('.penci-wrapper').find('.spinner'),
          table = $('#penci-table'),
          action_name,
          answer = ''

        if ('add' == type) {
          action_name = 'soledad_add_social'

          var name = nameField.val(),
            icon = iconField.val(),
            color = colorField.val(),
            url = urlField.val()

          if ('' == name || '' == icon || '' == url) {
            notify('Please fill all require fields', 'error')
            return
          }
        } else if ('remove' == type) {
          action_name = 'soledad_remove_social'
          name = $el.data('slug')

          answer = confirm('Do you want to remove social "' + name + '"?')

          if (!answer) return
        }

        // if running
        if (_eventRunning) return

        _eventRunning = true

        spinner.fadeIn(function () {
          $(this).addClass('is-active')
        })

        var dataSend = {
          action: action_name,
          type: type,
          _wpnonce: nonce,
          name: name,
          icon: icon,
          url: url,
          color: color,
        }

        // Ajax call
        $.ajax({
          type: 'POST',
          url: ajaxurl,
          data: dataSend,

          success: function (response) {
            // SUCCESS ADDED
            if (response.success && 'add' == response.data.type) {
              // clear fields
              nameField.val('')
              iconField.val('')
              urlField.val('')
              colorField.val('')
              $('.penci-placeholder-img').attr(
                'src',
                $('.penci-placeholder-img').attr('data-placeholder'),
              )

              table.append(
                "<tr><td>" +
                  response.data.name +
                  "</td><td>" +
                  response.data.url +
                  "</td><td>" +
                  response.data.img +
                  '</td><td><span aria-label="' +
                  response.data.color +
                  '" class="social-colors-init" style="background-color: ' +
                  response.data.color +
                  ';"></span></td><td><button class="button button-small penci-remove-social" data-type="remove" data-slug="' +
                  response.data.id +
                  '">Delete</button></td></tr>'
              );

              // remove no social row
              var no_social_tr = table.find('tr.no-social-tr')
              if (no_social_tr.length) no_social_tr.remove()

              notify(response.data.message, 'success')

              // SUCCESS REMOVED
            } else if (response.success && 'remove' == response.data.type) {
              $el.closest('tr').remove()

              notify(response.data.message, 'success')
            } else if ('error' == response.data.type) {
              notify(response.data.message, 'error')
            }

            spinner.fadeOut(function () {
              $(this).removeClass('is-active')
            })

            _eventRunning = false
          },
        })
      },
    ) // on click action
  }
  add_custom_social()
})(jQuery)
