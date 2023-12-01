WLM3ThirdPartyIntegration.coderedemption.fxn = {
  settings: WLM3ThirdPartyIntegration.coderedemption.coderedemption_settings,
  search_results: [],
  /**
   * Initialize
   * @param  object settings Integration settings
   */
  init(settings) {
    if (settings) {
      WLM3ThirdPartyIntegration.coderedemption.coderedemption_settings = settings;
      this.settings = WLM3ThirdPartyIntegration.coderedemption.coderedemption_settings;
    }
    this.load_campaigns_table();
    this.set_handlers();
    this.do_confirms();
    $('#coderedemption-campaign-modal-actions tbody').sortable({
      items: '> tr',
      handle: '.handle',
      axis: 'y',
      stop: (e) => this.fix_action_field_names()
    });
  },
  /**
   * Initialize do_confirm buttons
   */
  do_confirms() {
    $('.popover.-confirm-popover').remove();
    
    // code cancel/uncancel button
    $('.-code-cancel-btn').removeClass('do-confirm-set');
    $('.-code-cancel-btn').do_confirm({
      confirm_message: wp.i18n.__( 'Cancel this Code?', 'wishlist-member' ),
      yes_button: wp.i18n.__( 'Cancel', 'wishlist-member' )
    }).on('yes.do_confirm', {
      that: this
    }, (e) => this.cancel_uncancel(e) );

    // code uncancel button
    $('.-code-uncancel-btn').removeClass('do-confirm-set');
    $('.-code-uncancel-btn').do_confirm({
      confirm_message: wp.i18n.__( 'Uncancel this Code?', 'wishlist-member' ),
      yes_button: wp.i18n.__( 'Uncancel', 'wishlist-member' )
    }).on('yes.do_confirm', {
      that: this
    }, (e) => this.cancel_uncancel(e) );

    // code delete button
    $('.-code-del-btn').removeClass('do-confirm-set');
    $('.-code-del-btn').do_confirm({
      confirm_message: wp.i18n.__( 'Delete this Code?', 'wishlist-member' ),
      yes_button: wp.i18n.__( 'Delete', 'wishlist-member' )
    }).on('yes.do_confirm', {
      that: this
    }, (e) => {
      var tr = $(e.target).closest('tr');
      var code = tr.data('code');
      $.post(
        WLM3VARS.ajaxurl,
        {
          action: 'wlm_coderedemption_delete_code',
          code: code,
          id: $('#campaign-id').val()
        }
      ).always((r) => {
        if(r.success) {
          tr.fadeOut(300, function() { $(this).remove() });
        } else {
          $('.wlm-message-holder').show_message({
            type: 'error',
            message: wp.i18n.__( 'Cannot delete code', 'wishlist-member' )
          });
        }
      });
    });

    // delete action button
    $('.-action-del-btn').removeClass('do-confirm-set');
    $('.-action-del-btn').slice(1).do_confirm({
      confirm_message: wp.i18n.__( 'Delete this Action?', 'wishlist-member' ),
      yes_button: wp.i18n.__( 'Delete', 'wishlist-member' )
    }).on('yes.do_confirm', {
      that: this
    }, (e) => {
      $(e.target).closest('tr').fadeOut(300, function() { $(this).remove() });
    });

    // delete campaign button
    $('#coderedemption-lists-table .-del-btn').do_confirm({
      confirm_message: wp.i18n.__( 'Delete this Campaign?', 'wishlist-member' ),
      yes_button: wp.i18n.__( 'Delete', 'wishlist-member' )
    }).on('yes.do_confirm', {
      that: this
    }, (e) => {
      $.post(WLM3VARS.ajaxurl, {
        action: 'wlm_coderedemption_delete_campaign',
        'campaign-id': $(e.target).data('campaign-id'),
      }, (result) => {
        this.init(result.data.coderedemption_settings);
      });
    });  
  },
  /**
   * Load campaigns table
   */
  load_campaigns_table() {
    data = {
      campaigns: this.settings.campaigns
    }
    if (Object.keys(data.campaigns).length) {
      var tmpl = _.template($('script#coderedemption-lists-template').html(), {
        variable: 'data'
      });
      var html = tmpl(data);
    } else {
      var html = '<tbody></tbody>';
    }
    $('#coderedemption-lists-table tbody').replaceWith(html);
    $('#coderedemption-lists-table table tfoot tr').removeClass('d-none');
  },
  /**
   * Generate codes button
   * @param  object e Event
   */
  generate_codes(e) {
    e.preventDefault();
    var data = {
      action: 'wlm_coderedemption_generate_codes',
      format: $('#generate-code-format').val(),
      quantity: $('#generate-code-quantity').val(),
      id: $('#campaign-id').val(),
    };
		$('#coderedemption-campaign-modal-codes-generate :input, coderedemption-campaign-modal-codes-generate button').prop('disabled', true);
		$('.coderedemption-code-total').text(wp.i18n.__( 'Loading...', 'wishlist-member' ));		
    $.post(WLM3VARS.ajaxurl, data, (result) => {
      if (result.success) {
        this.init(result.data.coderedemption_settings);
        this.populate_modal_values(data.id);
        $('.wlm-message-holder').show_message({
          type: 'success',
          message: wp.i18n.__( 'Codes Generated', 'wishlist-member' )
        });
      } else {
        $('.wlm-message-holder').show_message({
          type: 'error',
          message: result.data.msg
        });
      }
    }).always(() => {
			$('#coderedemption-campaign-modal-codes-generate :input, coderedemption-campaign-modal-codes-generate button').prop('disabled', false);
		});
  },
  /**
   * Add action
   * @param object e Event
   */
  add_action(e) {
    e && e.preventDefault();
    // copy html from first row
    var html = $($('#actions-tbody tr:first-child')[0].outerHTML);
    // remove select2
    html.find('span.select2').remove();
    // reset values
    html.find('select').each(function(index) {
      $(this).val('');
      $(this).attr('id', 'id__' + Date.now() + '__' + index);
    });
    html.find('select').first()[0].selectedIndex=0;
    html.find('select option').prop('disabled', false);
    // append
    $('#actions-tbody').append(html)
    this.fix_action_field_names();
    this.do_confirms();
    return false;
  },
  /**
   * Search for codes
   * @param  object e Event
   */
  search_codes(e) {
    this.search_results = [];
    $('#coderedemption-code-search-results-wrapper').scroll(()=>{
      if($('#coderedemption-code-search-results-wrapper').scrollTop() == $('#coderedemption-code-search-results-wrapper')[0].scrollHeight - $('#coderedemption-code-search-results-wrapper').height() ) {
        this.show_search_results();
      }      
    });
    e.preventDefault();
    $('#coderedemption-code-search-button').prop('disabled', true);
    $('#coderedemption-code-search-results tbody').replaceWith('<tbody></tbody>');
    $('#coderedemption-code-search-results-summary').text(wp.i18n.__( 'Searching...', 'wishlist-member' ));
    $.post(
      WLM3VARS.ajaxurl,
      {
        action: 'wlm_coderedemption_search_codes',
        id: $('#campaign-id').val(),
        search: $('#coderedemption-code-search').val(),
        status: $('#coderedemption-code-search-status').val(),
      },
      (result) => {
        if(result.data.results.length) {
          this.search_results = result.data.results;
          this.search_results_length = result.data.results.length;
          this.show_search_results();
        } else {
          $('#coderedemption-code-search-results-summary').text(wp.i18n.__( 'No codes found', 'wishlist-member' ));
        }
      }
    ).always(() => {
      $('#coderedemption-code-search-button').prop('disabled', false);
      this.do_confirms();
    });
  },
  show_search_results() {
    var tbody = $('#coderedemption-code-search-results tbody');
    var counter = 50;
    var row;
    while(counter-- && (row = this.search_results.shift())) {
      var cancel_button = '<a href="#" title="' + wp.i18n.__( 'Uncancel Code', 'wishlist-member' ) + '" class="btn -icon-only -code-uncancel-btn"><i class="wlm-icons md-24" title="' + wp.i18n.__( 'Uncancel Code', 'wishlist-member' ) + '">replay</i></a>';
      
      var uncancel_button = '<a href="#" title="' + wp.i18n.__( 'Cancel Code', 'wishlist-member' ) + '" class="btn -icon-only -code-cancel-btn"><i class="wlm-icons md-24" title="' + wp.i18n.__( 'Cancel Code', 'wishlist-member' ) + '">close</i></a>';
      
      var delete_button = '<a href="#" title="' + wp.i18n.__( 'Delete Code', 'wishlist-member' ) + '" class="btn -icon-only -code-del-btn"><i class="wlm-icons md-24" title="' + wp.i18n.__( 'Delete Code', 'wishlist-member' ) + '">delete</i></a>';
      
      var user_button = '<a href="?page=WishListMember&wl=members/manage&transactionid=CODE*' + row[0] + '" target="_blank" class="btn -icon-only -code-user-btn" title="' + wp.i18n.__( 'View Member', 'wishlist-member' ) + '"><i class="wlm-icons md-24">people</i></a>';
      
      tbody.append('<tr class="button-hover code-status-' + Number(row[1]) + '" data-code="' + row[0] + '"><td>' + row[0] + '</td><td class="code-status"><span class="code-status-0">' + wp.i18n.__( 'Available', 'wishlist-member' ) + '</span><span class="code-status-1">' + wp.i18n.__( 'Redeemed', 'wishlist-member' ) + '</span><span class="code-status-2">' + wp.i18n.__( 'Cancelled', 'wishlist-member' ) + '</span></td><td><div class="btn-group-action text-right">' + cancel_button + uncancel_button + user_button + delete_button + '</div></td></tr>');
    }
    var showing = this.search_results_length - this.search_results.length;
    $('#coderedemption-code-search-results-summary').text(this.search_results.length == 1 ? wp.i18n.__( '1 code found', 'wishlist-member' ) : wp.i18n.sprintf(
			// Translators: 1 - Number of codes displayed, 2 - Number of codes found.
			wp.i18n.__( 'Showing %1$s of %2$s codes found', 'wishlist-member' ),
			showing.toLocaleString(),
			this.search_results_length.toLocaleString()
		) );
  },
  /**
   * Import Codes
   * @param  object e Event
   */
  import_codes(e) {
    var fd = new FormData();
    var files = $('#coderedemption-code-import-file')[0].files;
    
    // Check file selected or not
    if(files.length > 0 ){
      var cid = $('#campaign-id').val();
      var import_option = $('#coderedemption-code-import-option').val();
      fd.append('file',files[0]);
      fd.append('option', import_option);
      fd.append('id', cid);
      fd.append('action', 'wlm_coderedemption_import_codes');
      $.ajax({
        url: WLM3VARS.ajaxurl,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: (result) => {
          if(result.success) {
            this.init(result.data.coderedemption_settings);
            this.populate_modal_values($('#campaign-id').val());
            
            var msg = '';
            switch(import_option) {
              case 'skip':
                msg = wp.i18n.sprintf(
									// Translators: 1 - Number of codes imported, 2 - Total number of codes processed.
									wp.i18n.__( '%1$s new codes imported. %2$s lines processed.', 'wishlist-member' ),
									result.data.import_stats[0],
									result.data.import_stats[2]
								);
                break;
              case 'update':
                msg = wp.i18n.sprintf(
									// Translators: 1 - Number of codes imported, 2 - Number of codes updated, 3 - Total number of codes processed.
									wp.i18n.__( '%1$s new codes imported. %2$s codes updated. %3$s lines processed.', 'wishlist-member' ),
									...result.data.import_stats
								);
                break;
              case 'replace':
                msg = wp.i18n.sprintf(
									// Translators: 1 - Number of codes imported, 2 - Total number of codes processed.
									wp.i18n.__( 'Old codes replaced. %1$s codes imported. %2$s lines processed.', 'wishlist-member' ),
									result.data.import_stats[0],
									result.data.import_stats[2]
								);
                break;
            }
            
            $('.wlm-message-holder').show_message({
              type: 'success',
              message: msg
            });
          } else {
            $('.wlm-message-holder').show_message({
              type: 'error',
              message: wp.i18n.__( 'Error importing codes.', 'wishlist-member' ) + ' ' + result.data
            });
          }
        }
      });
    }else{
       alert("Please select a file.");
    }
  },
  /**
   * Export codes
   * @param  object e Event
   */
  export_codes(e) {
    e.preventDefault();
    $('#coderedemption-code-export-button').prop('disabled', true);
    $.ajax({
      type: 'POST',
      url: WLM3VARS.ajaxurl,
      data: {
        action: 'wlm_coderedemption_export_codes',
        id: $('#campaign-id').val(),
        status: $('#coderedemption-code-export-status').val(),
      },
      xhrFields: {
          responseType: 'blob' // to avoid binary data being mangled on charset conversion
      },
      complete: () => {
        $('#coderedemption-code-export-button').prop('disabled', false);
      },
      success: (blob, status, xhr) => {
        // file download via ajax
        var filename = '';
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround
            window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
                window.location.href = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
          } else {
            window.location.href = downloadUrl;
          }

          setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
      }
    });
  },
  /**
   * Cancel or uncancel code
   * @param  object e Event
   */
  cancel_uncancel(e) {
    var cancel = $(e.target).hasClass('-code-cancel-btn');
    var cancel_uncancel = cancel ? 'cancel' : 'uncancel';
    var tr = $(e.target).closest('tr');
    var code = tr.data('code');
    $.post(
      WLM3VARS.ajaxurl,
      {
        action: 'wlm_coderedemption_' + cancel_uncancel + '_code',
        code: code,
        id: $('#campaign-id').val()
      }
    ).always((r) => {
      if(r.success) {
        tr.removeClass('code-status-0 code-status-1 code-status-2').addClass('code-status-' + ( cancel ? 2 : 1 ) );
      } else {
        $('.wlm-message-holder').show_message({
          type: 'error',
          message: wp.i18n.sprintf(
						// Translators: 1 - cancel/uncancel
						wp.i18n.__( 'Cannot %1$s code', 'wishlist-member' ),
						cancel_uncancel
					)
        });
      }
    });
  },
  /**
   * Reorders the access field names
   * @return {[type]} [description]
   */
  fix_action_field_names() {
    $('.popover.-confirm-popover').remove();
    $('#actions-tbody tr').each((index, row) => {
      $(row).find('select').each((x, select) => {
        select.name = select.name.replace(/access\[.*?\]/g, 'access[' + index + ']')
        // apply select2
        $(select).select2();
      });
    });
  },
  /**
   * Populate the fields of the campaign modal
   * @param  integer campaign_id Campaign ID
   */
  populate_modal_values(campaign_id) {
    var modal = $('#coderedemption-campaign-modal');
    // modal.find('form')[0].reset();
    
    // get campaigns
    var campaigns = this.settings.campaigns;

    if (campaign_id != 'new' && campaign_id in campaigns) {
      // existing campaign
      var campaign = campaigns[campaign_id];
      // hide/show relevant sections
      modal.removeClass('new-campaign').addClass('edit-campaign');
      // set title
      campaign.modal_title = wp.i18n.__( 'Edit Code Redemption Campaign: ', 'wishlist-member' ) + campaign.name;
      modal.attr('data-campaign-codes', Number(campaign['code_total']));
    } else {
      // new campaign
      // hide/show relevant sections
      modal.removeClass('edit-campaign').addClass('new-campaign');
      // set initial data for new campaign
      var campaign = {
        // set id
        id: 'new',
        // set title
        modal_title: wp.i18n.__( 'Create New Code Redemption Campaign', 'wishlist-member' ),
        // set name
        name: '',
        description: '',
      };
      modal.attr('data-campaign-codes', 0);
    }
    // set title
    modal.find('.modal-title').text(campaign.modal_title);

    // show code quantity
    modal.find('.coderedemption-code-total').html(
			wp.i18n.sprintf(
				// Translators: Total number of codes.
				wp.i18n.__( 'This campaign has <strong>%1$s</strong> codes.', 'wishlist-member' ),
				(~~Number(campaign.code_total)).toLocaleString()
			)
		);
    modal.find('.coderedemption-code-stats').html(Number(campaign.code_total) ? wp.i18n.sprintf(
			// Translators: 1 - Number of codes available, 2 - Number of codes redeemed, 3 - Number of codes cancelled
			wp.i18n.__( 'Available: <strong>%1$s</strong>, Redeemed: <strong>%2$s</strong>, Cancelled: <strong>%3$s</strong>', 'wishlist-member' ),
			(~~Number(campaign.code_available)).toLocaleString(),
			(~~Number(campaign.code_redeemed)).toLocaleString(),
			(~~Number(campaign.code_cancelled)).toLocaleString()
		) : '');
    
    // default values
    modal.find('input[type="text"], input[type="file"]').val('');
    modal.find('select[multiple]').val('').trigger('change.select2');
    modal.find('select:not([multiple])').prop('selectedIndex', 0).trigger('change.select2');
    modal.find('#generate-code-quantity').val(5000);

    // build actions table
    $('#actions-tbody tr + tr').remove()
    Object.values(campaign.access || []).slice(1).forEach((access, index) => {
      if(access.levels) {
        this.add_action();
      }
    });

    // set modal form data
    modal.set_form_data(campaign);
    
    $('#actions-tbody select').trigger('change');
  },
  /**
   * Modal opened event handler
   * @param  object e Event
   */
  modal_opened(e) {
    this.populate_modal_values($(e.relatedTarget).data('campaign-id'));
    var modal = $(e.target);
    if(modal[0].id!='coderedemption-campaign-modal') {
      return;
    }
    
    // show the first tab in the modal
    var data_campaign_codes = Number(modal.attr('data-campaign-codes'));
    modal.find('ul.nav.nav-tabs').each(function() {
      if(!data_campaign_codes) {
        $(this).find('li:not(.hide-on-0-codes) a:first').tab('show');
      } else {
        $(this).find('a:first').tab('show');
      }
    });
    
    // show save buttons
    modal.find('.modal-footer .save-button').show();
    
    // clear search results
    $('#coderedemption-code-search-results tbody').replaceWith('<tbody></tbody>');
    $('#coderedemption-code-search-results-summary').html('')

  },
  /**
   * Set event handlers
   */
  set_handlers() {
    // turn off handlers to prevent duplicate events
    $('body').off('.coderedemption');
    
    $('body').on('change.coderedemption', '.access-action', (e) => {
      var move = $(e.target).val() == 'move';
      var row = $(e.target).closest('tr');
      
      // append -hide-payperposts to id if move. note this hackish solution is due to the
      // fact that we're using select2 4.0.3 that doesn't support disabling of optgroups
      var id = row.find('.access-levels')[0].id.replace(/-hide-payperposts$/, '');
      row.find('.access-levels').attr('id', id += (move ? '-hide-payperposts' : ''));
      // disable payperpost options
      row.find('.access-levels optgroup:not(:first-child) option').prop('disabled', move);
      // deselect payperpost options
      row.find('.access-levels option:disabled').prop('selected', false);
      // rebuild select2
      row.find('.access-levels').select2();
    });

    // generate codes
    $('body').on('click.coderedemption', '#generate-codes', (e) => this.generate_codes(e));
    
    // search codes
    $('body').on('click.coderedemption', '#coderedemption-code-search-button', (e) => this.search_codes(e));
    // import codes
    $('body').on('click.coderedemption', '#coderedemption-code-import-button', (e) => this.import_codes(e));
    // export codes
    $('body').on('click.coderedemption', '#coderedemption-code-export-button', (e) => this.export_codes(e));
    // add action
    $('body').on('click.coderedemption', '#add-action', (e) => this.add_action(e));
    // campaign modal
    $('body').on('show.bs.modal.coderedemption', (e) => this.modal_opened(e));
    $('body').on('shown.bs.modal.coderedemption', (e) => {
      var modal = $(e.target);
      if(modal[0].id != 'coderedemption-campaign-modal') {
        return;
      }
      var namefld = modal.find(':input[name="name"]');
      if(!namefld.val()) {
        namefld.focus();
      }
    });
    
    $('body').on('show.bs.tab.coderedemption', (e) => {
      var modal = $(e.target).closest('.modal');
      if(!modal.length || modal[0].id != 'coderedemption-campaign-modal') {
        return;
      }
      modal.find('.modal-footer .save-button').toggle($(e.target).hasClass('show-modal-footer'));      
    });

  },
}

integration_after_open['coderedemption'] = function(obj) {
  WLM3ThirdPartyIntegration.coderedemption.fxn.init();
}

integration_modal_save['coderedemption'] = function(me, settings_data, result, textStatus) {
  WLM3ThirdPartyIntegration.coderedemption.fxn.init(result.data.coderedemption_settings);
  WLM3ThirdPartyIntegration.coderedemption.fxn.populate_modal_values(result.data.id);
}