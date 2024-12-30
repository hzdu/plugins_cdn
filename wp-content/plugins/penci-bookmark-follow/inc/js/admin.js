'use strict';

function penci_bl_popup_indivisual(id, other_type) {
  
  jQuery('.penci_bl_indivisual_entries_data').hide();
  jQuery('.penci_bl_overlay').show();
  
  if (other_type != '') {
    
    other_type = other_type + '_';
  }
  
  jQuery('#fp_indivisual_data_' + other_type + id).show();
  penci_bl_indivisual_entries_done(id, other_type);
  
  // To hide/show check all/uncheck all when popup open
  var pencibf_check_all = false;
  jQuery('#fp_indivisual_data_' + other_type + id + ' input[type=\'checkbox\']').
      each(function() {
        if (jQuery(this).is(':checked')) {
          pencibf_check_all = true;
        } else {
          pencibf_check_all = false;
          return false;
        }
      });
  if (pencibf_check_all) {
    jQuery('.penci_bl_checkall_entries').hide();
    jQuery('.penci_bl_uncheckall_entries').show();
  } else {
    jQuery('.penci_bl_checkall_entries').show();
    jQuery('.penci_bl_uncheckall_entries').hide();
  }
}

function penci_bl_indivisual_entries_done(id, other_type) {
  
  jQuery(document).on('click', '#penci_bl_set_submit_indivisual', function() {
    var i = 0;
    jQuery('#fp_indivisual_data_' + other_type + id + ' input').
        each(function() {
          
          if (jQuery(this).is(':checked')) {
            i++;
          }
        });
    jQuery('#penci_bl_selected_indivisual_' + other_type + id).
        text('( ' + i + ' ) selected');
    
    jQuery('.penci_bl_indivisual_entries_data').hide();
    jQuery('.penci_bl_overlay').hide();
    
    return false;
  });
}

/**
 * Function to check/uncheck all checkbox
 */
function penci_bl_toggle_check_uncheck_all(id, other_type, status) {
  
  if (status == '1') { // check all
    
    jQuery('.penci_bl_checkall_entries').hide();
    jQuery('.penci_bl_uncheckall_entries').show();
    
    if (other_type != '') {
      
      other_type = other_type + '_';
    }
    jQuery('#fp_indivisual_data_' + other_type + id + ' input').
        each(function() {
          
          jQuery(this).attr('checked', true);
        });
  } else { // uncheck all
    
    jQuery('.penci_bl_checkall_entries').show();
    jQuery('.penci_bl_uncheckall_entries').hide();
    
    if (other_type != '') {
      
      other_type = other_type + '_';
    }
    
    jQuery('#fp_indivisual_data_' + other_type + id + ' input').
        each(function() {
          
          jQuery(this).attr('checked', false);
        });
  }
}

function penci_bl_chosen_select() {
  
  jQuery('.chosen-select').each(function() {
    
    jQuery(this).chosen({search_contains: true});
  });
  jQuery('.penci-bf-form select').each(function() {
    
    jQuery(this).chosen({search_contains: true});
  });
}

jQuery(document).ready(function($) {
  
  //code for plugin settings tabs
  $('#penci_bl_author_nm').chosen();
  jQuery('select#penci_bl_author_nm').ajaxChosen({
    method: 'GET',
    url: ajaxurl,
    dataType: 'json',
    minTermLength: 1,
    data: {
      action: 'penci_bl_search_authors',
    },
  }, function(data) {
    
    var terms = {};
    
    jQuery.each(data, function(i, val) {
      terms[i] = val;
    });
    
    return terms;
  });
  
  //  When recipient per email set to 1 show Disable Unsubscribe Confirmation settings
  $(document).on('keyup', 'input.recipient_per_email', function() {
    
    if ($(this).val() == 1) {
      $('tr.unsubscribe-confirmation-link').show();
      if ($('input.unsubscribe_confirmation').is(':checked')) {
        $('input.is_individual_unsubscribe').attr('checked', false);
        $('tr.individual-unsubscribe').show();
      }
    } else {
      $('input.unsubscribe_confirmation').attr('checked', false);
      $('tr.unsubscribe-confirmation-link').hide();
      $('tr.individual-unsubscribe').hide();
    }
  });
  
  $(document).on('change', 'tr.unsubscribe-confirmation-link', function() {
    if ($('tr.unsubscribe-confirmation-link').is(':visible')) {
      if ($('input.unsubscribe_confirmation').is(':checked')) {
        $('input.is_individual_unsubscribe').attr('checked', false);
        $('tr.individual-unsubscribe').show();
      } else {
        $('tr.individual-unsubscribe').hide();
      }
    }
  });
  
  //  When user clicks on tab, this code will be executed
  $(document).on('click', '.nav-tab-wrapper a', function() {
    
    //  First remove class "active" from currently active tab
    $('.nav-tab-wrapper a').removeClass('nav-tab-active');
    
    //  Now add class "active" to the selected/clicked tab
    $(this).addClass('nav-tab-active');
    
    //  Hide all tab content
    $('.penci-bf-tab-content').hide();
    
    //  Here we get the href value of the selected tab
    var selected_tab = $(this).attr('href');
    
    //  Show the selected tab content
    $(selected_tab).show();
    
    var selected = selected_tab.split('-');
    $('.penci-bf-tab-content').removeClass('penci-bf-selected-tab');
    $('#penci_bl_selected_tab').val(selected[3]);
    
    //  At the end, we add return false so that the click on the link is not executed
    return false;
  });
  
  //call on click reset options button from settings page
  $(document).on('click', '#penci_bl_reset_settings', function() {
    
    var ans;
    ans = confirm('Click OK to reset all options. All settings will be lost!');
    
    if (ans) {
      return true;
    } else {
      return false;
    }
  });
  
  $(document).on('click', '.penci-bf-delete', function() {
    
    var confirmdelete = confirm('Are you sure want to delete this ?');
    
    if (confirmdelete) {
      return true;
    } else {
      return false;
    }
    
  });
  
  $(document).on('click', '.penci_bl_overlay', function() {
    jQuery('.penci_bl_indivisual_entries_data').hide();
    jQuery('.penci_bl_overlay').fadeOut();
  });
  
  penci_bl_chosen_select();
  
  //send test email from email settings
  $(document).on('click', '.penci-bf-send-test-email', function() {
    
    $('.penci-bf-loader').show();
    var email_template = $('.penci-bf-email-template').val();
    var data = {
      action: 'penci_bl_test_email',
      template: email_template,
    };
    $('.penci-bf-send-email-msg').html('').hide();
    $.post(ajaxurl, data, function(response) {
      
      $('.penci-bf-loader').hide();
      if (response == 'success') {
        $('.penci-bf-send-email-msg').
            removeClass('penci-bf-email-error').
            addClass('penci-bf-email-success');
        $('.penci-bf-send-email-msg').
            html(Penci_Bf_Settings.testemailsuccess).
            show();
        setTimeout(function() {
          $('.penci-bf-send-email-msg').fadeOut('slow', function() {
          });
        }, 2000);
      } else {
        $('.penci-bf-send-email-msg').
            removeClass('penci-bf-email-success').
            addClass('penci-bf-email-error');
        $('.penci-bf-send-email-msg').
            html(Penci_Bf_Settings.testemailerror).
            show();
        setTimeout(function() {
          $('.penci-bf-send-email-msg').fadeOut('slow', function() {
          });
        }, 2000);
      }
    });
  });
  
  var page;
  
  jQuery(function($) {
    
    $(document).on('click', '.penci-bf-load_more', function() {
      //var load_button = $(this);
      var postType = $(this).attr('post-type');
      page = $('#' + postType + '-pagination').val();
      $('.penci-bf-load_more-spinner').css('width', '20px');
      $('.penci-bf-load_more-spinner').css('visibility', 'visible');
      var data = {
        'action': 'penci_bl_load_more',
        'page': page,
        'postType': postType,
      };
      
      $.post(ajaxurl, data, function(response) {
        
        if ($.trim(response)) {
          $('.appendNewPost_' + postType).append(response);
          page = parseInt(page) + 1;
          $('#' + postType + '-pagination').val(page);
        } else {
          $('.load_more_' + postType).hide();
        }
        
        $('.penci-bf-load_more-spinner').hide();
        $('.penci-bf-load_more-spinner').css('width', '0');
        $('.penci-bf-load_more-spinner').css('visibility', 'hidden');
        
      });
      
    });
  });
  
  jQuery(function($) {
    //var page = 2;
    
    $(document).on('click', '.penci-bf-load-more-notification', function() {
      
      var postType = $(this).attr('post-type');
      page = $('#' + postType + '-pagination').val();
      var data = {
        'action': 'penci_bl_load_more_notification',
        'page': page,
        'posttype': postType,
      };
      $('.penci-bf-load-more-notification-spinner').css('width', '20px');
      $('.penci-bf-load-more-notification-spinner').
          css('visibility', 'visible');
      $.post(ajaxurl, data, function(response) {
        
        if ($.trim(response)) {
          $('.appendNewNotification_' + postType).append(response);
          page = parseInt(page) + 1;
          $('#' + postType + '-pagination').val(page);
        } else {
          $('.load_more_notification_' + postType).hide();
        }
        
        $('.penci-bf-load-more-notification-spinner').
            css('visibility', 'hidden');
        $('.penci-bf-load-more-notification-spinner').css('width', '0');
      });
    });
  });
  
  // send email show hide post, terms, author onclick followed type
  $(document).on('change', '.followed_type', function() {
    
    var selected_followed_type = document.querySelector(
        'input[name="followed_type"]:checked').value;
    
    if (selected_followed_type == 'followed_post') {
      
      $('#followed_type_post').val('');
      $('#followed_type_post').trigger('chosen:updated');
      
      $('#add_follower_type_post').val('');
      $('#add_follower_type_post').trigger('chosen:updated');
      
      $('.followed_type_post').show();
      $('.penci-bf-user-type-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      $('.followed_type_terms').hide();
      $('.penci-bf-term-slug-tr').hide();
      $('.followed_type_author').hide();
      $('.followed_terms').hide();
      $('.penci-bf-success-message').html('');
      $('#followed_users').attr('checked', true);
    } else if (selected_followed_type == 'followed_terms') {
      
      $('#followed_type_terms').val('');
      $('#followed_type_terms').trigger('chosen:updated');
      
      $('.followed_type_post').hide();
      $('.penci-bf-post-tr').hide();
      $('.penci-bf-user-type-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      
      $('#add_follower_type_terms').val('');
      $('#add_follower_type_terms').trigger('chosen:updated');
      
      $('.followed_type_terms').show();
      $('.followed_type_author').hide();
      $('.penci-bf-success-message').html('');
      $('#followed_users').attr('checked', true);
    } else if (selected_followed_type == 'followed_authors') {
      
      $('#followed_type_author').val('');
      $('#followed_type_author').trigger('chosen:updated');
      
      $('.followed_type_post').hide();
      $('.penci-bf-post-tr').hide();
      $('.penci-bf-user-type-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      $('.penci-bf-term-slug-tr').hide();
      $('.followed_type_terms').hide();
      
      $('#followed_type_author').val('');
      $('#followed_type_author').trigger('chosen:updated');
      
      $('.followed_type_author').show();
      $('.penci-bf-success-message').html('');
      $('#followed_users').attr('checked', true);
    }
  });
  
  // on submit form
  $(document).on('submit', '#pencibf_send_mail', function() {
    
    var selected_followed_type = $('input[name="followed_type"]:checked').val();
    
    var flag = 'false';
    if (selected_followed_type == 'followed_post') {
      if ($('.followed_type_post').is(':visible')) {
        
        $('.followed_type_post_error').html(' ').hide();
        $('.followed_type_post').removeClass('penci_bl_email_error');
        
        type_post = $('#followed_type_post').val();
        
        if (type_post == '') { // Check subject is empty
          $('.followed_type_post_error').
              html('Please select post type.').
              show();
          var flag = 'true';
        }
      }
      
      if ($('.followed_type_post_name').is(':visible')) {
        
        $('.followed_type_post_name_error').html(' ').hide();
        $('.followed_type_post_name').removeClass('penci_bl_email_error');
        
        type_post_name = $('#followed_type_post_name').val();
        
        if (type_post_name == '') { // Check subject is empty
          $('.followed_type_post_name_error').
              html('Please select post name.').
              show();
          var flag = 'true';
        }
      }
    } else if (selected_followed_type == 'followed_terms') {
      if ($('.followed_type_terms').is(':visible')) {
        
        $('.followed_type_terms_error').html('').hide();
        $('.followed_type_terms').removeClass('penci_bl_email_error');
        
        type_terms = $('#followed_type_terms').val();
        
        if (type_terms == '') { // Check subject is empty
          $('.followed_type_terms_error').
              html('Please select taxonomy.').
              show();
          var flag = 'true';
        }
      }
      if ($('.penci_bl_term_id').is(':visible')) {
        
        $('.followed_type_term_id_error').html('').hide();
        $('.penci_bl_term_id').removeClass('penci_bl_email_error');
        
        term_id = $('#penci_bl_term_id').val();
        
        if (term_id == '') { // Check subject is empty
          $('.followed_type_term_id_error').html('Please select term.').show();
          var flag = 'true';
        }
      }
    } else if (selected_followed_type == 'followed_authors') {
      if ($('.followed_type_author').is(':visible')) {
        
        $('.followed_type_author_error').html('').hide();
        $('.followed_type_author').removeClass('penci_bl_email_error');
        
        type_authors = $('#followed_type_author').val();
        
        if (type_authors == '') { // Check subject is empty
          $('.followed_type_author_error').html('Please select author.').show();
          var flag = 'true';
        }
      }
    }
    
    if ($('.followed_email_body').is(':visible')) {
      var editorContent = tinyMCE.get('followed_email_body').getContent();
      
      $('.followed_email_body_error').html('').hide();
      $('.followed_email_body').removeClass('penci_bl_email_error');
      
      if (editorContent == '') { // Check subject is empty
        $('.followed_email_body_error').html('Please enter email body.').show();
        var flag = 'true';
        
      }
    }
    
    if (flag == 'true') {
      if ($('.post-box-container').length) {
        $('html, body').
            animate({scrollTop: $('.post-box-container').offset().top}, 500);
      }
      
      return false;
      
    } else {
      
      $('.penci-bf-send-email-submit').attr('disabled', 'disabled');
      $('.penci-bf-send-email-submit').val('Processing...');
      
    }
    
  });
  
  $(document).on('change', '#followed_type_post', function() {
    
    var post = $(this).val();
    
    var posttype = $('#followed_type_post option:selected').
        attr('data-posttype');
    
    if (post != '') {
      
      // Show Loader
      $('.penci-bf-post-follow-loader').show();
      
      var data = {
        action: 'penci_bl_post_name',
        posttype: posttype,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        // Hide Loader
        $('.penci-bf-post-follow-loader').hide();
        
        $('#followed_type_post_name').html(response).trigger('chosen:updated');
        
        $('.penci-bf-post-tr').show();
        
      });
    } else {
      $('.penci-bf-post-tr').hide();
    }
  });
  
  $(document).on('change', '#add_follower_type_post', function() {
    
    var post = $(this).val();
    
    var posttype = $('#add_follower_type_post option:selected').
        attr('data-posttype');
    
    $('.penci-bf-success-message').html('');
    
    if (post != '') {
      
      // Show Loader
      $('.penci-bf-post-follow-loader').show();
      
      var data = {
        action: 'penci_bl_get_posts',
        posttype: posttype,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        // Hide Loader
        $('.penci-bf-post-follow-loader').hide();
        
        $('#followed_type_post_name').html(response).trigger('chosen:updated');
        $('.followed_guest_user_error').text('');
        $('.penci-bf-post-tr').show();
        
      });
    } else {
      $('.penci-bf-post-tr').hide();
      $('.penci-bf-user-type-tr').hide();
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
    }
  });
  
  $(document).on('change', 'input[name=followed_user_type]', function() {
    
    var user_type = $(this).val();
    
    $('#followed_guest_user').val('');
    $('.followed_guest_user_error').text('');
    
    if (user_type == '0') {
      $('.penci-bf-users-tr').show();
      $('.penci-bf-guest-user-tr').hide();
    } else {
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-guest-user-tr').show();
    }
    
  });
  // Get User List for post
  $(document).on('change', '#followed_type_post_name', function() {
    
    $('.followed_guest_user_error').html('');
    $('.followed_type_post_name_error').html('');
    
    var user_type = $('input[name="followed_user_type"]:checked').val();
    
    var post = $(this).val();
    
    var posttype = $('#add_follower_type_post option:selected').
        attr('data-posttype');
    
    if (post != '') {
      
      // Show Loader
      $('.penci-bf-post-name-loader').show();
      
      var data = {
        action: 'penci_bl_get_users',
        post_id: post,
        posttype: posttype,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        // Hide Loader
        $('.penci-bf-post-name-loader').hide();
        
        $('.penci-bf-user-type-tr').show();
        $('#followed_by_users').html(response).trigger('chosen:updated');
        
        if (user_type == '0') {
          $('.penci-bf-users-tr').show();
          $('.penci-bf-guest-user-tr').hide();
        } else {
          $('.penci-bf-users-tr').hide();
          $('.penci-bf-guest-user-tr').show();
        }
        
        $('.penci-bf-save-tr').show();
        
      });
    } else {
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-user-type-tr').hide();
    }
  });
  
  // Get User List for terms
  $(document).on('change', '#penci_bl_term_id', function() {
    
    $('.followed_guest_user_error').html('');
    $('.followed_type_post_name_error').html('');
    
    var user_type = $('input[name="followed_user_type"]:checked').val();
    
    var term = $(this).val();
    
    var posttype = $('#add_follower_type_terms option:selected').
        attr('data-posttype');
    
    if (term != '') {
      
      // Show Loader
      $('.penci-bf-post-name-loader').show();
      
      var data = {
        action: 'penci_bl_get_users',
        term_id: term,
        posttype: posttype,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        // Hide Loader
        $('.penci-bf-post-name-loader').hide();
        
        $('.penci-bf-user-type-tr').show();
        $('#followed_by_users').html(response).trigger('chosen:updated');
        
        if (user_type == '0') {
          $('.penci-bf-users-tr').show();
          $('.penci-bf-guest-user-tr').hide();
        } else {
          $('.penci-bf-users-tr').hide();
          $('.penci-bf-guest-user-tr').show();
        }
        
        $('.penci-bf-save-tr').show();
        
      });
    } else {
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-user-type-tr').hide();
    }
  });
  
  // Get User List for authors
  $(document).on('change', '#followed_type_author', function() {
    
    var author = $(this).val();
    
    var user_type = $('input[name="followed_user_type"]:checked').val();
    
    $('.penci-bf-success-message').html('');
    
    if (author != '') {
      
      // Show Loader
      $('.penci-bf-post-name-loader').show();
      
      var data = {
        action: 'penci_bl_get_users',
        author_id: author,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        // Hide Loader
        $('.penci-bf-post-name-loader').hide();
        
        $('.penci-bf-user-type-tr').show();
        $('#followed_by_users').html(response).trigger('chosen:updated');
        
        $('.followed_guest_user_error').html('');
        
        if (user_type == '0') {
          $('.penci-bf-users-tr').show();
          $('.penci-bf-guest-user-tr').hide();
        } else {
          $('.penci-bf-users-tr').hide();
          $('.penci-bf-guest-user-tr').show();
        }
        
        $('.penci-bf-save-tr').show();
        
      });
    } else {
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-user-type-tr').hide();
    }
  });
  
  // Add or Save Follower
  $(document).on('click', '#penci-bf-follow', function() {
    
    var user_type = $('input[name=followed_user_type]:checked').val();
    
    var e_error = 0;
    var p_error = 0;
    var t_error = 0;
    
    if (user_type == '1') {
      
      var email = $('#followed_guest_user').val();
      var page = $('#penci-bf-current-page').val();
      
      if (email == '' || isEmail(email) == false) {
        $('.followed_guest_user_error').
            html('Please Enter Valid Email Address.');
        e_error = 1;
      } else {
        $('.followed_guest_user_error').html('');
        e_error = 0;
      }
      
    } else {
      
      var user_id = $('#followed_by_users option:selected').val();
      var email = $('#followed_by_users option:selected').attr('data-email');
    }
    
    // post data
    var post = $('#followed_type_post_name option:selected').val();
    var type_post = $('#followed_post:checked').val();
    
    // term data
    var term_id = $('#penci_bl_term_id option:selected').val();
    var type_term = $('#followed_terms:checked').val();
    
    // author data
    var author_id = $('#followed_type_author option:selected').val();
    var type_author = $('#followed_authors:checked').val();
    
    if (post == '' && type_post != undefined) {
      $('.followed_type_post_name_error').html('Please select post name.');
      p_error = 1;
    } else {
      $('.followed_type_post_name_error').html('');
      p_error = 0;
    }
    
    if (term_id == '' && type_term != undefined) {
      $('.followed_type_term_id_error').html('Please select term name.');
      t_error = 1;
    } else {
      $('.followed_type_term_id_error').html('');
      t_error = 0;
    }
    
    if (e_error == 1 || p_error == 1 || t_error == 1) return false;
    
    if (post != '' && post != undefined && type_post != undefined) {
      
      var posttype = $('#add_follower_type_post option:selected').
          attr('data-posttype');
      
      var data = {
        action: 'penci_bl_save',
        postid: post,
        currentpostid: post,
        status: '1',
        user_id: user_id,
        page: page,
        email: email,
        posttype: posttype,
      };
    } else if (term_id != '' && term_id != undefined && type_term !=
        undefined) {
      
      var posttype = $('#add_follower_type_terms option:selected').
          attr('data-posttype');
      var taxonomyslug = $('#add_follower_type_terms option:selected').val();
      
      var data = {
        action: 'penci_bl_save',
        termid: term_id,
        taxonomyslug: taxonomyslug,
        status: '1',
        user_id: user_id,
        page: page,
        email: email,
        posttype: posttype,
      };
    } else if (author_id != '' && author_id != undefined && type_author !=
        undefined) {
      
      var data = {
        action: 'penci_bl_save',
        authorid: author_id,
        status: '1',
        user_id: user_id,
        email: email,
        page: page,
      };
    }
    
    if (post != '' || term_id != '' || author_id != '') {
      
      // Show Loader
      $('.penci-bf-save-loader').show();
      $('#penci-bf-follow').attr('disabled', true);
      
      jQuery.post(ajaxurl, data, function(response) {
        // Hide Loader
        $('.penci-bf-save-loader').hide();
        
        if (response != '') {
          if (isNaN(response))
            $('.penci-bf-success-message').html(response);
          else
            $('.penci-bf-success-message').html('Follower added successfully.');
        }
        
        $('#followed_users').attr('checked', true);
        
        $('.penci-bf-post-tr').hide();
        $('.penci-bf-term-slug-tr').hide();
        $('.penci-bf-user-type-tr').hide();
        $('.penci-bf-users-tr').hide();
        $('.penci-bf-guest-user-tr').hide();
        $('.penci-bf-save-tr').hide();
        $('#penci-bf-follow').removeAttr('disabled');
        
        $('#add_follower_type_post').val('');
        $('#add_follower_type_post').trigger('chosen:updated');
        
        $('#add_follower_type_terms').val('');
        $('#add_follower_type_terms').trigger('chosen:updated');
        
        $('#followed_type_author').val('');
        $('#followed_type_author').trigger('chosen:updated');
      });
    } else {
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-save-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
      $('.penci-bf-user-type-tr').hide();
    }
  });
  
  $(document).on('change', '#followed_type_terms', function() {
    
    var taxonomy = $(this).val();
    var posttype = $('#followed_type_terms option:selected').
        attr('data-posttype');
    
    if (taxonomy != '') {
      
      // Show Loader
      $('.penci-bf-term-follow-loader').show();
      
      var data = {
        action: 'penci_bl_custom_terms',
        posttype: posttype,
        taxonomy: taxonomy,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        
        // Hide Loader
        $('.penci-bf-term-follow-loader').hide();
        
        $('#penci_bl_term_id').html(response).trigger('chosen:updated');
        
        $('.penci-bf-term-slug-tr').show();
        
      });
    } else {
      $('.penci-bf-term-slug-tr').hide();
    }
  });
  
  $(document).on('change', '#add_follower_type_terms', function() {
    
    var taxonomy = $(this).val();
    var posttype = $('#add_follower_type_terms option:selected').
        attr('data-posttype');
    
    $('.penci-bf-success-message').html('');
    
    if (taxonomy != '') {
      
      // Show Loader
      $('.penci-bf-term-follow-loader').show();
      
      var data = {
        action: 'penci_bl_get_terms',
        posttype: posttype,
        taxonomy: taxonomy,
      };
      
      jQuery.post(ajaxurl, data, function(response) {
        
        // Hide Loader
        $('.penci-bf-term-follow-loader').hide();
        
        $('#penci_bl_term_id').html(response).trigger('chosen:updated');
        $('.followed_guest_user_error').html('');
        
        $('.penci-bf-term-slug-tr').show();
        
      });
    } else {
      $('.penci-bf-term-slug-tr').hide();
      $('.penci-bf-user-type-tr').hide();
      $('.penci-bf-users-tr').hide();
      $('.penci-bf-guest-user-tr').hide();
    }
  });
  
  // Reset radio buttons
  $('#followed_post').attr('checked', true);
  $('#followed_users').attr('checked', true);
  
  $('#add_follower_type_post').val('');
  $('#add_follower_type_post').trigger('chosen:updated');
});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}