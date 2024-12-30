'use strict'
var PENCI = PENCI || {};
(
  function ($) {
    $.fn.checked = function (value) {
      if (value === true || value === false) {
        // Set the value of the checkbox
        $(this).each(function () {
          this.checked = value
        })
      } else if (value === undefined || value === 'toggle') {
        // Toggle the checkbox
        $(this).each(function () {
          this.checked = !this.checked
        })
      }
    }
  }
)(jQuery)
jQuery(document).ready(function ($) {
  /* Penci Notify
---------------------------------------------------------------*/
  PENCI.notify = function (title, message, type, img = null) {
    if (Penci_Bf_Vars.popup && title && message && type) {
      var $icon = type,
        img_out = '',
        bmlink = Penci_Bf_Vars.bookmarkpage ?
          Penci_Bf_Vars.bookmarkpage :
          '#'

      if (type === 'added_to_cart') {
        $icon = false
      }

      if (img) {
        img_out =
          '<a href="' +
          bmlink +
          '" class="pencpf-popup-thumb" style="background-image: url(' +
          img +
          ')"></a>'
      }

      $.toast({
        heading: '',
        text:
          '<div class="pencpf-popup-mess-wrapper">' +
          img_out +
          '<div class="pencpf-popup-ct-area"><div class="pencpf-popup-mess-title">' +
          title +
          '</div><div class="pencpf-popup-mess"><a href="' +
          bmlink +
          '">' +
          message +
          '</a></div></div></div>',
        icon: $icon,
        position: Penci_Bf_Vars.popup_position,
        textAlign: 'left',
        showHideTransition: 'fade',
        loader: false,
        hideAfter: Penci_Bf_Vars.popup_timeout,
        bgColor: Penci_Bf_Vars.popup_bg_cl,
        textColor: Penci_Bf_Vars.popup_text_cl,
      })
    }
  }

  PENCI.imported_posts_data = function () {
    var current_saved_ids = Cookies.get('penci-bf-posts-ids')

    if (!current_saved_ids) {
      return false
    }

    if (Penci_Bf_Vars.loginflag == 1) {
      current_saved_ids = JSON.parse(current_saved_ids)

      current_saved_ids.forEach(function (item) {
        item = parseInt(item)

        var data = {
          status: 1,
          action: 'penci_bl_follow_post',
          nonce: Penci_Bf_Vars.nonce,
          postid: item,
          currentpostid: item,
        }

        jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
        }).done(function () {
          Cookies.remove('penci-bf-posts-ids')
        })
      })
    }
  }

  PENCI.imported_authors_data = function () {
    var current_author_saved_ids = Cookies.get('penci-bf-author-ids')

    if (!current_author_saved_ids) {
      return false
    }

    if (Penci_Bf_Vars.loginflag == 1) {
      current_author_saved_ids = JSON.parse(current_author_saved_ids)
      current_author_saved_ids.forEach(function (item) {
        item = parseInt(item)

        var data = {
          status: 1,
          action: 'penci_bl_follow_author',
          nonce: Penci_Bf_Vars.nonce,
          authorid: item,
          currentpostid: item,
        }

        jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
        }).success(function () {
          Cookies.remove('penci-bf-author-ids')
        })
      })
    }
  }

  PENCI.imported_terms_data = function () {
    var current_terms_saved_ids = Cookies.get('penci-bf-terms-ids')

    if (!current_terms_saved_ids) {
      return false
    }

    if (Penci_Bf_Vars.loginflag == 1) {
      current_terms_saved_ids = JSON.parse(current_terms_saved_ids)
      current_terms_saved_ids.forEach(function (item) {
        item = parseInt(item)

        var data = {
          status: 1,
          action: 'penci_bl_follow_terms',
          nonce: Penci_Bf_Vars.nonce,
          termid: item,
          currentpostid: item,
        }

        jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
        }).success(function () {
          Cookies.remove('penci-bf-terms-ids')
        })
      })
    }
  }

  PENCI.check_class = function () {
    $('.penci-bf-follow-post-wrapper').each(function (e) {
      var parent = $(this).closest('div')
      if (parent.find('.penci-rv-sm-show').length) {
        $(this).addClass('has-review')
      }
      $(this).show()
    })

    $('.penci-rv-sm-show').each(function (e) {
      var parent = $(this).closest('div')
      if (parent.find('.penci-bf-follow-post-wrapper').length) {
        $(this).addClass('has-bookmark')
      }
    })

    $('.penci-bf-follow-author-wrapper .penci-bf-guest-btn').
      each(function (e) {
        var authorid = $(this).attr('data-author-id')
        var current_saved_ids = Cookies.get('penci-bf-author-ids')
        $(this).hide()

        $(this).
          addClass('penci-bf-follow-button').
          removeClass('penci-bf-following-button')
        $(this).attr('data-status', 1)
        $(this).
          find('.pencibf-following-text').
          html($(this).attr('data-follow-text'))

        if (current_saved_ids) {
          current_saved_ids = JSON.parse(current_saved_ids)
          if (jQuery.inArray(authorid, current_saved_ids) !== -1) {
            $(this).
              removeClass('penci-bf-follow-button').
              addClass('penci-bf-following-button')
            $(this).attr('data-status', 0)
            $(this).
              find('.pencibf-following-text').
              html($(this).attr('data-following-text'))
          }
        }
        $(this).show()
      })

    $('.penci-bf-follow-post-wrapper .penci-bf-guest-btn').
      each(function (e) {
        var postid = $(this).attr('data-postid')
        var current_saved_ids = Cookies.get('penci-bf-posts-ids')
        var follow_wrapper = $(this).
          parents('.penci-bf-follow-post-wrapper')
        $(this).hide()
        if (current_saved_ids) {
          current_saved_ids = JSON.parse(current_saved_ids)
          if (jQuery.inArray(postid, current_saved_ids) !== -1) {
            follow_wrapper.find('button').
              removeClass('penci-bf-follow-button').
              addClass('penci-bf-following-button')
            $(this).attr('data-status', 0)
            follow_wrapper.find('.pencibf-following-text').
              html(follow_wrapper.find('button').
                attr(
                  'data-following-text'))
          }
        }
        $(this).show()
      })

    $('.penci-bf-follow-term-wrapper .penci-bf-guest-btn').
      each(function (e) {
        var postid = $(this).attr('data-term-id')
        var current_saved_ids = Cookies.get('penci-bf-terms-ids')
        var follow_wrapper = $(this).
          parents('.penci-bf-follow-term-wrapper')
        $(this).hide()
        if (current_saved_ids) {
          current_saved_ids = JSON.parse(current_saved_ids)
          if (jQuery.inArray(postid, current_saved_ids) !== -1) {
            follow_wrapper.find('button').
              removeClass('penci-bf-follow-button').
              addClass('penci-bf-following-button')
            $(this).attr('data-status', 0)
          }
        }
        $(this).show()
      })
  }

  function removeElement(array, elem) {
    var index = array.indexOf(elem)
    if (index > -1) {
      array.splice(index, 1)
    }
  }

  // Code used for follow post
  $(document).on(
    'click',
    '.penci-bf-follow-post-wrapper .penci-bf-guest-btn',
    function (e) {
      e.preventDefault()

      var status = $(this).attr('data-status')
      var postid = $(this).attr('data-postid')
      var follow = $(this).attr('data-follow-text')
      var ptitle = $(this).attr('data-posttitle')
      var thumb = $(this).attr('data-thumb')
      var table_row = $(this).closest('.penci-bf-follow-post-row-body')

      var follow_wrapper = $(this).
        parents('.penci-bf-follow-post-wrapper')
      var message_popout

      //show loader
      follow_wrapper.addClass('loading')
      var current_saved_ids = Cookies.get('penci-bf-posts-ids')

      if (current_saved_ids) {
        current_saved_ids = JSON.parse(current_saved_ids)
        if (status === '1') {
          current_saved_ids.push(postid)
          message_popout = Penci_Bf_Vars.popup_success_mess
        } else {
          removeElement(current_saved_ids, postid)
          if (table_row) {
            table_row.remove()
          }
          follow_wrapper.find('.pencibf-following-text').html(follow)
          message_popout = Penci_Bf_Vars.popup_remove_mess
        }
        Cookies.set('penci-bf-posts-ids',
          JSON.stringify(current_saved_ids))
      } else {
        var current_new_saved_ids = []
        current_new_saved_ids.push(postid)
        message_popout = Penci_Bf_Vars.popup_success_mess
        Cookies.set(
          'penci-bf-posts-ids',
          JSON.stringify(current_new_saved_ids),
        )
      }

      if (status === '1') {
        $(this).
          removeClass('penci-bf-follow-button').
          addClass('penci-bf-following-button')
        $(this).attr('data-status', '0')

        $(document).
          find('.penci-bf-follow-post-wrapper').
          each(function () {
            var all_follow_wrapper = $(this)
            var all_postid = $(this).
              find('.penci-bf-button').
              attr('data-postid')

            if (all_postid === postid) {
              all_follow_wrapper.find('.penci-bf-button').
                attr('data-status', '0')
              all_follow_wrapper.find('.penci-bf-button').
                removeClass('penci-bf-follow-button').
                addClass('penci-bf-following-button')
            }
          })
      } else {
        $(this).
          addClass('penci-bf-follow-button').
          removeClass('penci-bf-following-button')
        $(this).attr('data-status', '1')

        $(document).
          find('.penci-bf-follow-post-wrapper').
          each(function () {
            var all_follow_wrapper = $(this)
            var all_postid = $(this).
              find('.penci-bf-button').
              attr('data-postid')

            if (all_postid === postid) {
              all_follow_wrapper.find('.penci-bf-button').
                attr('data-status', '1')
              all_follow_wrapper.find('.penci-bf-button').
                addClass('penci-bf-follow-button').
                removeClass('penci-bf-following-button')
            }
          })
      }

      setTimeout(function () {
        follow_wrapper.removeClass('loading')

        if (message_popout) {
          PENCI.notify(ptitle, message_popout, 'success', thumb)
        }
      }, 600)
    },
  )

  // Code used for follow post
  $(document).on(
    'click',
    '.penci-bf-follow-post-wrapper .penci-bf-follow-btn:not(.penci-bf-guest-btn)',
    function () {
      var onlyfollowing = $(this).
        parents('.penci-bf-manage-follow-posts').
        data('only-following')
      var status = $(this).attr('data-status')
      var postid = $(this).attr('data-postid')
      var currentpostid = $(this).attr('data-current-postid')
      var follow = $(this).attr('data-follow-text')
      var following = $(this).attr('data-following-text')
      var unfollow = $(this).attr('data-unfollow-text')
      var ptitle = $(this).attr('data-posttitle')
      var thumb = $(this).attr('data-thumb')
      var email = ''
      var follow_wrapper = $(this).
        closest('.penci-bf-follow-post-wrapper')

      // trigger follow button click event

      if (status === '1') {
        follow_wrapper.find('.pencibf-following-text').html(following)
      } else {
        follow_wrapper.find('.penci-bf-follow-btn').
          addClass('penci-bf-follow-button').
          removeClass('penci-bf-following-button')
      }

      var data = {
        action: 'penci_bl_follow_post',
        nonce: Penci_Bf_Vars.nonce,
        status: status,
        postid: postid,
        currentpostid: currentpostid,
        email: email,
        onlyfollowing: onlyfollowing,
      }

      //show loader
      follow_wrapper.addClass('loading')

      jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
        //hide loader
        follow_wrapper.removeClass('loading')

        if (response !== 'confirm') {
          //Check if numeric value

          if (status === '1') {
            follow_wrapper.find('.pencibf-following-text').
              html(following)
            follow_wrapper.find('.penci-bf-follow-btn').
              attr('data-status', '0')
            follow_wrapper.find('.penci-bf-follow-btn').
              removeClass('penci-bf-follow-button').
              addClass('penci-bf-following-button')

            PENCI.notify(
              ptitle,
              Penci_Bf_Vars.popup_success_mess,
              'success',
              thumb,
            )

            $(document).
              find('.penci-bf-follow-btn:not(.penci-bf-guest-btn)').
              each(function () {
                var all_follow_wrapper = $(this).closest(
                  '.penci-bf-follow-post-wrapper',
                )
                var all_postid = $(this).attr('data-postid')

                if (all_postid === postid) {
                  all_follow_wrapper.find('.pencibf-following-text').
                    html(following)
                  all_follow_wrapper.find('.penci-bf-follow-btn').
                    attr('data-status', '0')
                  all_follow_wrapper.find('.penci-bf-follow-btn').
                    removeClass(
                      'penci-bf-follow-button').
                    addClass(
                      'penci-bf-following-button')
                }
              })
          } else {
            if (onlyfollowing === 1) {
              var newresponse = jQuery(response).
                filter('.penci-bf-manage-follow-posts').
                html()
              jQuery('.penci-bf-manage-follow-posts').html(newresponse)
            } else {
              follow_wrapper.find('.pencibf-following-text').html(follow)
              follow_wrapper.find('.penci-bf-follow-btn').
                attr('data-status', '1')
              follow_wrapper.find('.penci-bf-follow-btn').
                removeClass('penci-bf-following-button').
                addClass('penci-bf-follow-button')

              $(document).
                find('.penci-bf-follow-btn:not(.penci-bf-guest-btn)').
                each(function () {
                  var all_follow_wrapper = $(this).closest(
                    '.penci-bf-follow-post-wrapper',
                  )
                  var all_postid = $(this).attr('data-postid')

                  if (all_postid === postid) {
                    all_follow_wrapper.find('.pencibf-following-text').
                      html(follow)
                    all_follow_wrapper.find('.penci-bf-follow-btn').
                      attr('data-status', '1')
                    all_follow_wrapper.find('.penci-bf-follow-btn').
                      removeClass(
                        'penci-bf-following-button').
                      addClass('penci-bf-follow-button')
                  }
                })

              PENCI.notify(
                ptitle,
                Penci_Bf_Vars.popup_remove_mess,
                'success',
                thumb,
              )
            }
          }
        }

        // trigger follow button reload event to reload page from 3rd party plugin
        var follow_wrapper_obj = { this_object: follow_wrapper }
        follow_wrapper.trigger('penci-bf-follow-btn-reload', [
          follow_wrapper_obj,
        ])

        follow_wrapper.find('.penci-bf-follow-btn').
          removeClass('penci-bf-unfollow-button').
          addClass('penci-bf-follow-button')
      })
    },
  )

  // Code used for follow author popup
  $(document).on(
    'click',
    '.penci-bf-follow-author-wrapper .penci-bf-guest-btn',
    function (e) {
      e.preventDefault()

      var follow_wrapper = $(this).
        closest('.penci-bf-follow-author-wrapper')
      var status = $(this).attr('data-status')
      var authorid = $(this).attr('data-author-id')
      var follow = $(this).attr('data-follow-text')
      var following = $(this).attr('data-following-text')
      var thumb = $(this).attr('data-thumb')
      var current_saved_ids = Cookies.get('penci-bf-author-ids')
      var table_row = ''
      var message_popout = ''
      var ptitle = ''
      var follow = $(this).attr('data-follow-text')
      var following = $(this).attr('data-following-text')
      var unfollow = $(this).attr('data-unfollow-text')

      follow_wrapper.addClass('loading')

      if (current_saved_ids) {
        current_saved_ids = JSON.parse(current_saved_ids)
        if (status === '1') {
          follow_wrapper.find('.pencibf-following-text').html(following)
          current_saved_ids.push(authorid)
          ptitle = Penci_Bf_Vars.popup_success_author_title
          message_popout = Penci_Bf_Vars.popup_success_author_mess
        } else {
          follow_wrapper.find('.pencibf-following-text').html(follow)
          removeElement(current_saved_ids, authorid)
          if (table_row) {
            table_row.remove()
          }
          follow_wrapper.find('.pencibf-following-text').html(follow)
          ptitle = Penci_Bf_Vars.popup_remove_author_title
          message_popout = Penci_Bf_Vars.popup_remove_author_mess
        }
        Cookies.set('penci-bf-author-ids',
          JSON.stringify(current_saved_ids))
      } else {
        var current_new_saved_ids = []
        current_new_saved_ids.push(authorid)
        Cookies.set(
          'penci-bf-author-ids',
          JSON.stringify(current_new_saved_ids),
        )
      }

      if (status === '1') {
        $(this).
          removeClass('penci-bf-follow-button').
          addClass('penci-bf-following-button')
        $(this).attr('data-status', '0')
        ptitle = Penci_Bf_Vars.popup_success_author_title
        message_popout = Penci_Bf_Vars.popup_success_author_mess
        follow_wrapper.find('.pencibf-following-text').html(following)
      } else {
        $(this).
          addClass('penci-bf-follow-button').
          removeClass('penci-bf-following-button')
        ptitle = Penci_Bf_Vars.popup_remove_author_title
        message_popout = Penci_Bf_Vars.popup_remove_author_mess
        $(this).attr('data-status', '1')
        follow_wrapper.find('.pencibf-following-text').html(follow)
      }

      setTimeout(function () {
        follow_wrapper.removeClass('loading')

        if (message_popout) {
          PENCI.notify(ptitle, message_popout, 'success', thumb)
        }
      }, 600)
    },
  )

  // Code start for follow Author
  $(document).on(
    'click',
    '.penci-bf-follow-author-wrapper .penci-bf-follow-btn',
    function (e) {
      e.preventDefault()

      var onlyfollowing = $(this).
        parents('.penci-bf-manage-follow-authors').
        data('only-following')
      var status = $(this).attr('data-status')
      var thumb = $(this).attr('data-thumb')
      var authorid = $(this).attr('data-author-id')
      var currentpostid = $(this).attr('data-current-postid')
      var follow = $(this).attr('data-follow-text')
      var following = $(this).attr('data-following-text')
      var unfollow = $(this).attr('data-unfollow-text')
      var email = ''
      var message_popout = ''
      var ptitle = ''

      // trigger follow button click event
      var follow_button_obj = {
        popup: true,
        error: false,
        this_object: this,
      }
      $(this).
        trigger('penci-bf-follow-author-btn-click', [follow_button_obj])

      var follow_wrapper = $(this).
        parents('.penci-bf-follow-author-wrapper')

      if (!follow_button_obj.popup) {
        return false
      }

      if (follow_button_obj.error) {
        return false
      }

      if (status === '1') {
        follow_wrapper.find('.pencibf-following-text').html(following)
        ptitle = Penci_Bf_Vars.popup_success_author_title
        message_popout = Penci_Bf_Vars.popup_success_author_mess
      } else {
        follow_wrapper.find('.penci-bf-follow-btn').
          addClass('penci-bf-follow-button').
          removeClass('penci-bf-following-button')
        ptitle = Penci_Bf_Vars.popup_remove_author_title
        message_popout = Penci_Bf_Vars.popup_remove_author_mess
      }

      var disable_reload =
        follow_wrapper.find('.penci-bf-guest-btn').
          hasClass('disable-reload') ||
        follow_wrapper.parents('.widget').length > 0

      var data = {
        action: 'penci_bl_follow_author',
        nonce: Penci_Bf_Vars.nonce,
        status: status,
        authorid: authorid,
        currentpostid: currentpostid,
        email: email,
        onlyfollowing: onlyfollowing,
      }

      //Check if need disable reload and message on same page
      if (disable_reload) {
        data.disable_reload = true
      }

      //show loader
      follow_wrapper.addClass('loading')

      jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
        if (response != 'confirm') {
          if (Penci_Bf_Vars.loginflag == '1') {
            if (status == '1') {
              follow_wrapper.find('.pencibf-following-text').
                html(following)
              follow_wrapper.find('.penci-bf-follow-btn').
                attr('data-status', '0')
              follow_wrapper.find('.penci-bf-follow-btn').
                removeClass('penci-bf-follow-button').
                addClass('penci-bf-following-button')
              ptitle = Penci_Bf_Vars.popup_success_author_title
              message_popout = Penci_Bf_Vars.popup_success_author_mess
            } else {
              ptitle = Penci_Bf_Vars.popup_remove_author_title
              message_popout = Penci_Bf_Vars.popup_remove_author_mess

              follow_wrapper.find('.pencibf-following-text').html(follow)
              follow_wrapper.find('.penci-bf-follow-btn').
                attr('data-status', '1')
              follow_wrapper.find('.penci-bf-follow-btn').
                removeClass('penci-bf-following-button').
                addClass('penci-bf-follow-button')
            }
          }
        }

        // trigger follow button reload event to reload page from 3rd party plugin
        var follow_wrapper_obj = { this_object: follow_wrapper }
        follow_wrapper.trigger('penci-bf-follow-author-btn-reload', [
          follow_wrapper_obj,
        ])

        follow_wrapper.find('.penci-bf-follow-btn').
          removeClass('penci-bf-unfollow-button').
          addClass('penci-bf-follow-button')

        follow_wrapper.removeClass('loading')
        if (message_popout) {
          PENCI.notify(ptitle, message_popout, 'success', thumb)
        }
      })
    },
  )

  $(document).on('click', '#penci_bl_unsubscribe_submit', function () {
    $('.penci-bf-unsubscribe-email-error').
      removeClass('message_stack_error').
      html('').
      hide()
    $('#penci_bl_unsubscribe_email').removeClass('penci_bl_email_error')
    $('.message_stack_success').hide()
    $('.message_stack_error').hide()

    var email = $.trim($('#penci_bl_unsubscribe_email').val())

    if (email == '') {
      // Check email is empty
      $('.penci-bf-unsubscribe-email-error').
        addClass('message_stack_error').
        html(Penci_Bf_Vars.emailempty).
        show()
      $('#penci_bl_unsubscribe_email').
        addClass('penci_bl_email_error').
        show()
      return false
    } else {
      if (!penci_bl_valid_email(email)) {
        // Check email is valid or not
        $('.penci-bf-unsubscribe-email-error').
          addClass('message_stack_error').
          html(Penci_Bf_Vars.emailinvalid).
          show()
        $('#penci_bl_unsubscribe_email').
          addClass('penci_bl_email_error').
          show()
        return false
      }
    }
  })

  $(document).on('click', '.penci-pf-ajx-loadmore', function (e) {
    e.preventDefault()
    var btn = $(this),
      nomore = btn.attr('data-nomore'),
      action_name = 'penci_bl_follow_post_next_page',
      wrapper = $('.penci-bf-manage-follow-posts .pcsl-inner'),
      post = true,
      paged = btn.attr('data-paged')

    if (btn.closest('.penci-bf-follows').hasClass('penci-bf-manage-follow-authors')) {
      action_name = 'penci_bl_follow_author_next_page';
      wrapper = $('.penci-bf-follow-author-table tbody');
      post = false;
    } else if (btn.closest('.penci-bf-follows').hasClass('penci-bf-manage-follow-terms')) {
      action_name = 'penci_bl_follow_term_next_page';
      wrapper = $('.penci-bf-manage-follow-terms .pcsl-inner');
    }

    var data = {
      action: action_name,
      nonce: Penci_Bf_Vars.nonce,
      paging: paged,
    }

    $.ajax({
      type: 'POST',
      dataType: 'html',
      url: Penci_Bf_Vars.ajaxurl,
      data: data,
      beforeSend: function () {
        btn.addClass('loading-posts')
      },
      success: function (response) {
        var newresponse

        if (post) {
          newresponse = $(response).find('.pcsl-inner').html()
        } else {
          newresponse = $(response).
            find('.penci-bf-follow-author-table tbody').
            html()
        }

        btn.addClass('loading-posts')

        if ($(newresponse).length) {
          wrapper.append(newresponse)
          btn.attr('data-paged', parseInt(paged) + 1)
          $(document).trigger('penci_bf_check')
        } else {
          btn.html(nomore).addClass('disable')
          setTimeout(function () {
            btn.closest('.penci-bf-paging').remove()
          }, 1200)
        }
        btn.removeClass('loading-posts')
      },
    })
  })

  //function for follow author ajax pagination
  function penci_bl_follow_author_ajax_pagination(pid) {
    var data = {
      action: 'penci_bl_follow_author_next_page',
      nonce: Penci_Bf_Vars.nonce,
      paging: pid,
    }

    jQuery('.penci-bf-follow-authors-loader').show()
    jQuery('.penci-bf-follow-authors-paging').hide()

    jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
      var newresponse = jQuery(response).
        filter('.penci-bf-manage-follow-authors').
        html()
      jQuery('.penci-bf-follow-authors-loader').hide()
      jQuery('.penci-bf-manage-follow-authors').html(newresponse)
    })
    return false
  }

  // Code start for follow term
  $(document).on(
    'click',
    '.penci-bf-follow-term-wrapper .penci-bf-follow-btn:not(.penci-bf-guest-btn)',
    function () {
      var onlyfollowing = $(this).
        parents('.penci-bf-manage-follow-terms').
        data('only-following')
      var status = $(this).attr('data-status')
      var posttype = $(this).attr('data-posttype')
      var taxonomyslug = $(this).attr('data-taxonomy-slug')
      var termid = $(this).attr('data-term-id')
      var currentpostid = $(this).attr('data-current-postid')
      var thumb = $(this).attr('data-thumb')

      // trigger follow button click event
      var follow_button_obj = { popup: true, error: false, this_object: this }
      $(this).
        trigger('penci-bf-follow-term-btn-click', [follow_button_obj])
      var follow_wrapper = $(this).
        parents('.penci-bf-follow-term-wrapper')

      if (!follow_button_obj.popup) {
        return false
      }

      if (follow_button_obj.error) {
        return false
      }

      if (status == '1') {
      } else {
      }

      follow_wrapper.addClass('loading')

      var disable_reload =
        follow_wrapper.find('.penci-bf-guest-btn').
          hasClass('disable-reload') ||
        follow_wrapper.parents('.widget').length > 0

      var data = {
        action: 'penci_bl_follow_terms',
        status: status,
        posttype: posttype,
        taxonomyslug: taxonomyslug,
        termid: termid,
        currentpostid: currentpostid,
        onlyfollowing: onlyfollowing,
      }

      //Check if need disable reload and message on same page
      if (disable_reload) {
        data.disable_reload = true
      }

      jQuery.post(Penci_Bf_Vars.ajaxurl, data, function (response) {
        //Check if numeric value

        if (Penci_Bf_Vars.loginflag == '1') {
          if (status == '1') {
            follow_wrapper.find('.penci-bf-follow-btn').
              attr('data-status', '0')
            follow_wrapper.find('.penci-bf-follow-btn').
              removeClass('penci-bf-follow-button').
              addClass('penci-bf-following-button')
          } else {
            if (onlyfollowing == 1) {
              var newresponse = jQuery(response).
                filter('.penci-bf-manage-follow-terms').
                html()
              jQuery('.penci-bf-manage-follow-terms').html(newresponse)
            } else {
              follow_wrapper.find('.penci-bf-follow-btn').
                attr('data-status', '1')
              follow_wrapper.find('.penci-bf-follow-btn').
                removeClass('penci-bf-following-button').
                addClass('penci-bf-follow-button')
            }
          }
        } else {
          //make text of following and unfollowing to as it is "Follow" & "Unfollow"

          follow_wrapper.find('.penci-bf-follow-btn').
            removeClass('penci-bf-following-button').
            addClass('penci-bf-follow-button')

          if (disable_reload) {
            if (!$.isNumeric(response)) {
              //show confirm email message to user
              $('.message_stack_success, .message_stack_error').remove()
              $(
                '<div class="message_stack_error">' + response + '<div>',
              ).insertBefore(follow_wrapper)
            } else {
              //show confirm email message to user
              $('.message_stack_success, .message_stack_error').remove()
              $(
                '<div class="message_stack_success">' +
                Penci_Bf_Vars.follow_success +
                '<div>',
              ).insertBefore(follow_wrapper)
            }

            //Hide popup if exists
            if (follow_wrapper.find('.penci-bf-popup-close').length > 0) {
              follow_wrapper.find('.penci-bf-popup-close').click()
            }
          } else {
            var msgs = {}
            if (!$.isNumeric(response)) {
              //store confirm email message to cookie
              msgs = { termid: termid, msgs: response }
            } else {
              //store confirm email message to cookie
              msgs = { termid: termid, msgs: Penci_Bf_Vars.follow_success }
            }

            Cookies.set('penci-bf-follow-term-msgs',
              JSON.stringify(msgs))
            window.location.reload()
          }
        }

        // trigger follow button reload event to reload page from 3rd party plugin
        var follow_wrapper_obj = { this_object: follow_wrapper }
        follow_wrapper.trigger('penci-bf-follow-term-btn-reload', [
          follow_wrapper_obj,
        ])

        follow_wrapper.find('.penci-bf-follow-btn').
          removeClass('penci-bf-unfollow-button').
          addClass('penci-bf-follow-button')

        follow_wrapper.removeClass('loading')
      })
    },
  )

  $(document).on(
    'click',
    '.penci-bf-follow-term-wrapper .penci-bf-guest-btn',
    function (e) {
      e.preventDefault()

      var follow_wrapper = $(this).
        closest('.penci-bf-follow-term-wrapper')
      var status = $(this).attr('data-status')
      var posttype = $(this).attr('data-posttype')
      var taxonomyslug = $(this).attr('data-taxonomy-slug')
      var termid = $(this).attr('data-term-id')
      var currentpostid = $(this).attr('data-current-postid')
      var current_saved_ids = Cookies.get('penci-bf-terms-ids')
      var ptitle = $(this).attr('data-posttitle')
      var message_popout
      var thumb = $(this).attr('data-thumb')
      var table_row = $(this).closest('.penci-bf-follow-term-row-body')
      var follow = $(this).attr('data-follow-text')
      var following = $(this).attr('data-following-text')
      var unfollow = $(this).attr('data-unfollow-text')

      follow_wrapper.addClass('loading')

      if (current_saved_ids) {
        current_saved_ids = JSON.parse(current_saved_ids)
        if (status === '1') {
          current_saved_ids.push(termid)

          ptitle = Penci_Bf_Vars.popup_success_term_title
          message_popout = Penci_Bf_Vars.popup_success_term_mess
        } else {
          removeElement(current_saved_ids, termid)
          if (table_row) {
            table_row.remove()
          }
          ptitle = Penci_Bf_Vars.popup_remove_term_title
          message_popout = Penci_Bf_Vars.popup_remove_term_mess
        }
        Cookies.set('penci-bf-terms-ids',
          JSON.stringify(current_saved_ids))
      } else {
        var current_new_saved_ids = []
        current_new_saved_ids.push(termid)
        Cookies.set(
          'penci-bf-terms-ids',
          JSON.stringify(current_new_saved_ids),
        )
      }

      if (status === '1') {

        $(this).
          removeClass('penci-bf-follow-button').
          addClass('penci-bf-following-button')
        $(this).attr('data-status', '0')
        ptitle = Penci_Bf_Vars.popup_success_term_title
        message_popout = Penci_Bf_Vars.popup_success_term_mess
      } else {

        $(this).
          addClass('penci-bf-follow-button').
          removeClass('penci-bf-following-button')
        ptitle = Penci_Bf_Vars.popup_remove_term_title
        message_popout = Penci_Bf_Vars.popup_remove_term_mess
        $(this).attr('data-status', '1')
      }

      setTimeout(function () {
        follow_wrapper.removeClass('loading')

        if (message_popout) {
          PENCI.notify(ptitle, message_popout, 'success', thumb)
        }
      }, 600)
    },
  )

  // validation of email
  function penci_bl_valid_email(emailStr) {
    var checkTLD = 1
    var knownDomsPat =
      /^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/
    var emailPat =
      /(?:((?:[\w-]+(?:\.[\w-]+)*)@(?:(?:[\w-]+\.)*\w[\w-]{0,66})\.(?:[a-z]{2,6}(?:\.[a-z]{2})?));*)/g
    var specialChars = '\\(\\)><@,;:\\\\\\"\\.\\[\\]'
    var validChars = '[^\\s' + specialChars + ']'
    var quotedUser = '("[^"]*")'
    var ipDomainPat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
    var atom = validChars + '+'
    var word = '(' + atom + '|' + quotedUser + ')'
    var userPat = new RegExp('^' + word + '(\\.' + word + ')*$')
    var domainPat = new RegExp('^' + atom + '(\\.' + atom + ')*$')
    var pattern =
      /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    var matchArray = emailStr.match(emailPat)

    if (matchArray) {
      return true
    }

    if (matchArray == null) {
      /* Email address seems incorrect (check @ and .'s) */
      return false
    }

    var user = matchArray[1]
    var domain = matchArray[2]
    /* Start by checking that only basic ASCII characters are in the strings (0-127). */
    for (i = 0; i < user.length; i++) {
      if (user.charCodeAt(i) > 127) {
        /* Ths username contains invalid characters in e-mail address. */
        return false
      }
    }
    for (i = 0; i < domain.length; i++) {
      if (domain.charCodeAt(i) > 127) {
        /* Ths domain name contains invalid characters in e-mail address. */
        return false
      }
    }
    if (user.match(userPat) == null) {
      /* The username doesn't seem to be valid in e-mail address. */
      return false
    }
    var IPArray = domain.match(ipDomainPat)
    if (IPArray != null) {
      for (var i = 1; i <= 4; i++) {
        if (IPArray[i] > 255) {
          /* Destination IP address is invalid! */
          return false
        }
      }
      return true
    }
    var atomPat = new RegExp('^' + atom + '$')
    var domArr = domain.split('.')
    var len = domArr.length
    for (i = 0; i < len; i++) {
      if (domArr[i].search(atomPat) == -1) {
        /* The domain name does not seem to be valid in e-mail address. */
        return false
      }
    }
    if (
      checkTLD &&
      domArr[domArr.length - 1].length != 2 &&
      domArr[domArr.length - 1].search(knownDomsPat) == -1
    ) {
      /* The address must end in a well-known domain or two letter country. */
      return false
    }

    if (len < 2) {
      /* This e-mail address is missing a hostname! */
      return false
    }

    return true
  }

  PENCI.check_class()
  PENCI.imported_posts_data()
  PENCI.imported_authors_data()
  PENCI.imported_terms_data()

  $(document).on('penci_bf_check', function () {
    PENCI.check_class()
  })
  $('body').on('penci_bf_check', function () {
    PENCI.check_class()
  })
})

jQuery(window).on('elementor/frontend/init', function () {
  if (window.elementorFrontend && window.elementorFrontend.isEditMode()) {
    const widgets = [
      'penci-custom-sliders.default',
      'penci-big-grid.default',
      'penci-small-list.default',
      'penci-popular-posts.default',
      'penci-featured-cat.default',
      'penci-latest-posts.default',
      'penci-recent-posts.default',
      'penci-featured-sliders.default'
    ];

    widgets.forEach(function (widget) {
      elementorFrontend.hooks.addAction(`frontend/element_ready/${widget}`, function ($scope) {
        jQuery('body').trigger('penci_bf_check');
      });
    });
  }
});
