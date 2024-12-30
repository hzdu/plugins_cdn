(function ($) {
    'use strict'

    // Upload
    function soledad_upload_image_font () {
      soledad_upload_font('soledad-cf1')
      soledad_upload_font('soledad-cf2')
      soledad_upload_font('soledad-cf3')
      soledad_upload_font('soledad-cf4')
      soledad_upload_font('soledad-cf5')
      soledad_upload_font('soledad-cf6')
      soledad_upload_font('soledad-cf7')
      soledad_upload_font('soledad-cf8')
      soledad_upload_font('soledad-cf9')
      soledad_upload_font('soledad-cf10')

      soledad_delete_font('soledad-cf1')
      soledad_delete_font('soledad-cf2')
      soledad_delete_font('soledad-cf3')
      soledad_delete_font('soledad-cf4')
      soledad_delete_font('soledad-cf5')
      soledad_delete_font('soledad-cf6')
      soledad_delete_font('soledad-cf7')
      soledad_delete_font('soledad-cf8')
      soledad_delete_font('soledad-cf9')
      soledad_delete_font('soledad-cf10')
    }

    function soledad_upload_font (id_field) {
      $('#' + id_field + '-button-upload').on('click', function (e) {
        e.preventDefault()

        window.original_send_to_editor = window.send_to_editor
        wp.media.editor.open(jQuery(this))

        // Hide Gallery, Audio, Video
        var _id_hide = '.media-menu .media-menu-item:nth-of-type'
        $(_id_hide + '(2)').addClass('hidden')
        $(_id_hide + '(3)').addClass('hidden')
        $(_id_hide + '(4)').addClass('hidden')

        window.send_to_editor = function (html) {
          var link = $('img', html).attr('src')

          if (typeof link == 'undefined') {
            link = $(html).attr('href')
          }
          $('#' + id_field).val(link)
          $('#' + id_field + '-button-delete').removeClass('button-hide')

          var splitLink = link.split('/')
          var fileName = splitLink[splitLink.length - 1].split('.')
          $('#' + id_field + 'family').val(fileName[0])

          window.send_to_editor = window.original_send_to_editor
        }

        return false

      })
    }

    function soledad_delete_font (id_field) {
      $('#' + id_field + '-button-delete').on('click', function (e) {
        e.preventDefault()

        var result = window.confirm(
          'Are you sure you want to delete this font?')
        if (result == true) {

          $(this).addClass('button-hide')

          $('#' + id_field).val('')
          $('#' + id_field + 'family').val('')
        }
      })
    }

    function soledadEnvatoCodeCheck () {
      var $checkLicense = jQuery('#penci-check-license'),
        $spinner = $checkLicense.find('.spinner'),
        $activateButton = $checkLicense.find('.pennews-activate-button'),
        $missing = $checkLicense.find('.penci-err-missing'),
        $length = $checkLicense.find('.penci-err-length'),
        $invalid = $checkLicense.find('.penci-err-invalid'),
        $evatoCode = $checkLicense.find('.evato-code')

      $checkLicense.on('submit', function (e) {
        e.preventDefault()

        var evatoCode = $evatoCode.val()

        $spinner.addClass('active')
        $missing.removeClass('penci-err-show')
        $length.removeClass('penci-err-show')
        $invalid.removeClass('penci-err-show')

        if (!evatoCode) {
          $missing.addClass('penci-err-show')
          $spinner.removeClass('active')
          return false
        }

        if (evatoCode.length < 20) {
          $length.addClass('penci-err-show')
          $spinner.removeClass('active')
          return false
        }

        $activateButton.prop('disabled', true)
        $evatoCode.prop('disabled', true)

        var data = {
          action: 'penci_check_envato_code',
          code: evatoCode,
          domain: PENCIDASHBOARD.domain,
          item_id: 12945398,
        }

        $.post(PENCIDASHBOARD.ajaxUrl, data, function (response) {
          if (!response.success) {
            $spinner.removeClass('active')
            $activateButton.prop('disabled', false)
            $evatoCode.prop('disabled', false)
            var mes = response.data.message
            $invalid.text(mes).addClass('penci-err-show')
          } else {

            if ($('h1.penci-activate-code-title').length) {
              $('h1.penci-activate-code-title').html('Successfully Activated')
            }

            $('.penci-activate-desc').
              html(
                'Theme successfully activated. Thanks for buying our product.<br>Redirecting...')
            $('#penci-check-license, .penci-activate-extra-notes').hide()

            setTimeout(function () {
              window.location.replace('?page=soledad_dashboard_welcome')
            }, 2500)
          }
        })

      })
    }

    // Auto activate tabs when DOM ready.
    $(soledad_upload_image_font)
    $(soledadEnvatoCodeCheck)

  }(jQuery)
);

(function ($) {
    $(document).ready(function ($) {

      // Modify options based on template selections
      $('body').
        on('change', '.penci-instagram-container select[id$="template"]',
          function (e) {
            var template = $(this)
            if (template.val() == 'thumbs' || template.val() ==
              'thumbs-no-border') {
              template.closest('.penci-instagram-container').
                find('.penci-slider-options').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              template.closest('.penci-instagram-container').
                find('input[id$="columns"]').
                closest('p').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
            } else {
              template.closest('.penci-instagram-container').
                find('.penci-slider-options').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              template.closest('.penci-instagram-container').
                find('input[id$="columns"]').
                closest('p').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
            }
          })

      // Modfiy options when search for is changed
      $('body').
        on('change', '.penci-instagram-container input:radio[id$="search_for"]',
          function (e) {
            var search_for = $(this)
            if (search_for.val() != 'username') {
              search_for.closest('.penci-instagram-container').
                find('[id$="attachment"]:checkbox').
                closest('p').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find(
                  'select[id$="images_link"] option[value="local_image_url"]').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('select[id$="images_link"] option[value="user_url"]').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('select[id$="images_link"] option[value="attachment"]').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('select[id$="images_link"]').
                val('image_url')
              search_for.closest('.penci-instagram-container').
                find('select[id$="description"] option[value="username"]').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('input[id$="blocked_users"]').
                closest('p').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('input[id$="access_token"]').
                closest('p').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('input[id$="insta_user_id"]').
                closest('p').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
            } else {
              search_for.closest('.penci-instagram-container').
                find('[id$="attachment"]:checkbox').
                closest('p').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find(
                  'select[id$="images_link"] option[value="local_image_url"]').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('select[id$="images_link"] option[value="user_url"]').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('select[id$="images_link"] option[value="attachment"]').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('select[id$="images_link"]').
                val('image_url')
              search_for.closest('.penci-instagram-container').
                find('select[id$="description"] option[value="username"]').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('input[id$="blocked_users"]').
                closest('p').
                animate({
                  opacity: 'hide',
                  height: 'hide',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('input[id$="access_token"]').
                closest('p').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)
              search_for.closest('.penci-instagram-container').
                find('input[id$="insta_user_id"]').
                closest('p').
                animate({
                  opacity: 'show',
                  height: 'show',
                }, 200)

            }
          })

      // Toggle advanced options
      $('body').on('click', '.penci-advanced', function (e) {
        e.preventDefault()
        var advanced_container = $(this).parent().next()

        if (advanced_container.is(':hidden')) {
          $(this).html('[ - Close ]')
        } else {
          $(this).html('[ + Open ]')
        }
        advanced_container.toggle()
      })

      $(document).on('click', '.penci-reset-social-cache', function (e) {
        e.preventDefault()
        var button = $(this)
        $.ajax({
          url: ajaxurl,
          data: {
            _wpnonce: button.attr('data-nonce'),
            action: 'penci_social_clear_all_caches',
          },
          method: 'get',
          beforeSend: function () {
            button.addClass('loading')
          },
          success: function (response) {
            button.addClass('success')
            button.after(
              '<p class="wp-notice" style="color:blue;font-weight:bold;">' +
              response.data.messages +
              '</p>',
            )
          },
          complete: function () {
            button.removeClass('loading')
            button.prop('disabled', true)
          },
        })
      })

      var selectoptions = [
        '.select-button-type',
        '.penci-metabox-row.pheader_show',
        '.penci-metabox-row.pheader_hideline',
        '.penci-metabox-row.pheader_hidebead',
        '.penci-metabox-row.pheader_turn_offup',
        '.penci-metabox-row.page_wrap_bg_size',
        '.penci-metabox-row.page_wrap_bg_repeat',
        '.penci-metabox-row.penci_hide_fwidget',
        '.penci-metabox-row.penci_edeader_trans',
      ]

      $.each(selectoptions, function (key, value) {
        var $this = $(value),
          $select = $this.find('select')
        $select.gridPicker({
          canSelect: function (element) {
            return !$(element).is(':disabled')
          },
          canUnselect: function (element) {
            return typeof this._$ui.element.attr('multiple') !== 'undefined'
          },
        })
      })

      $('.pcfb_acces_token').on('click', (function (t) {
        t.preventDefault()
        console.log('chec')
        var n, i = $(this),
          a = i.parents('#facebook'),
          s = {
            client_id: a.find('input#facebook_appid').val(),
            client_secret: a.find('input#facebook_appsecret').val(),
            grant_type: 'client_credentials',
          }
        $.ajax({
          url: 'https://graph.facebook.com/oauth/access_token',
          data: s,
          dataType: 'json',
          type: 'POST',
          async: true,
          crossDomain: true,
          beforeSend: function () {
            i.parent().find('.pc-spinner').addClass('active')
          },
        }).done((function (e) {
          n = e.access_token, a.find('input#facebook_token').val(n)
        })).fail((function (e, t, n) {
          window.alert('Info Message: ' + n)
        })).always((function () {
          i.parent().find('.pc-spinner').removeClass('active')
        }))
      }))

      $(document).
        on('click', '.penci-license-notice .notice-dismiss', function (e) {
          e.preventDefault()
          var t = $(this),
            checkdata = {
              action: 'admin_dimiss_license_notice',
            }
          $.post(PENCIDASHBOARD.ajaxUrl, checkdata, function (response) {
            if (response.success) {
              t.fadeTo(100, 0, function () {
                t.slideUp(100, function () {
                  t.remove()
                })
              })
            }
          })
        })

      $('.pccat-color-picker').each(function () {
        $(this).wpColorPicker()
      })

    }) // Document Ready
  }
)(jQuery);

(function ($) {
  var sidebar_generator = function () {

    var _eventRunning = false

    function notify (msg, type) {

      $('.penci-notice').
        html(msg).
        removeClass('notice-success notice-info notice-error').
        addClass('notice-' + type).
        show()

    }

    $(document).
      on('click', '.penci-add-sidebar, .penci-remove-sidebar', function (e) {

        e.preventDefault()

        var self = this,
          $el = $(this),
          form = $el.closest('form'),
          type = $el.data('type'),
          nonce = $('[name="penci_ajax_processor_nonce"]').val(),

          slugField = form.find('[name="sidebar_slug"]'),
          nameField = form.find('[name="sidebar_name"]'),

          slug = $el.data('slug'),
          name = $el.data('name'),

          spinner = $('.penci-wrapper').find('.spinner'),
          table = $('#penci-table'),
          actiton_name,
          answer = ''

        if ('add' == type) {

          action_name = 'soledad_add_sidebar'

          var name = nameField.val(),
            slug = slugField.val()

          if ('' == name && '' == slug) {
            notify('Empty name or slug', 'error')
            return
          }

        } else if ('remove' == type) {

          action_name = 'soledad_remove_sidebar'

          answer = confirm('Do you want to remove sidebar "' + name + '"?')

          if (!answer)
            return

        }

        // if running
        if (_eventRunning)
          return

        _eventRunning = true

        spinner.fadeIn(function () {

          $(this).addClass('is-active')

        })

        var dataSend = {
          action: action_name,
          type: type,
          _wpnonce: nonce,
          name: name,
          slug: slug,
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
              slugField.val('')

              table.append(
                '<tr><td>' + response.data.name + '</td><td>'
                + response.data.slug +
                '</td><td><button class="button button-small penci-remove-sidebar" data-type="remove" data-slug="'
                + response.data.slug + '" data-name="' + response.data.name +
                '">Delete</button></td></tr>',
              )

              // remove no sidebar row
              var no_sidebar_tr = table.find('tr.no-sidebar-tr')
              if (no_sidebar_tr.length)
                no_sidebar_tr.remove()

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

      }) // on click action

  }
  sidebar_generator();
})(jQuery);

(function ($) {
  $(document).ready(function ($) {
    $(document).on('click','.penci-cat-option-forms-ul a', function(e) {
      e.preventDefault()
      var panel = $(this).attr('data-panel'),
          panels = $('.penci-cat-option-forms'),
          uls = $(this).closest('.penci-cat-option-forms-ul')

          uls.find('li a').removeClass('active')
          $(this).addClass('active')
          panels.find('.form-field').hide()
          panels.find('.form-field[data-panel="'+panel+'"]').show()

          return
      
    });
    $(document).on('click','.rwmb-device-btn',function(e){
      e.preventDefault()
      var t = $(this),
          d = t.attr('data-device'),
          wrapper = t.closest('.rwmb-has-mobile-field')

          wrapper.find('.rwmb-device-btn').removeClass('active')
          t.addClass('active')

          if ( d == 'mobile' ) {
            wrapper.addClass( 'mobile-active' )
          } else {
            wrapper.removeClass( 'mobile-active' )
          }
    });
  });
})(jQuery);