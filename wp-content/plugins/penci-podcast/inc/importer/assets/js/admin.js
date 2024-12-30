let PenciPodcastImporter = {};

PenciPodcastImporter.API = {

  post : function( path, request_data, callback ) {
    return this.__request( path, 'POST', request_data, callback );
  },

  fetch : function( action, request_data, callback ) {
    return this.__request( action, 'GET', request_data, callback );
  },

  __request : function( path, method, request_data, callback ) {
    return jQuery.ajax( {
      url        : window.podcast_import_settings.rest_url + path,
      method     : method,
      beforeSend : function ( xhr ) {
        xhr.setRequestHeader( 'X-WP-Nonce', window.podcast_import_settings.rest_nonce );
      },
      data       : request_data
    } ).done( function ( response, statusText, xhr ) {
      callback( response );
    } ).fail( function( $xhr ) {
      callback( $xhr.responseJSON );
    });
  },

};

PenciPodcastImporter.Submission = {

  handle_import : function( request_data, callback_completed, callback_progress ) {
    PenciPodcastImporter.API.post( "pencipdc-importer/v1/get-feed-summary", request_data, function( response ) {
      if( typeof response.episode_count === 'undefined' ) {
        callback_completed( response );
        return;
      }

      if( typeof request_data.post_id !== 'undefined'
          || ( typeof request_data.import_continuous !== 'undefined' && request_data.import_continuous === 'on' ) ) {
        PenciPodcastImporter.API.post( "pencipdc-importer/v1/save-feed", request_data, function( response_save ) {
          callback_progress( response_save.messages, false, 0, response.episode_count );

          PenciPodcastImporter.Submission._handleImportRecursion(
            request_data,
            response.episode_count,
            0,
            callback_completed,
            callback_progress
          );
        });
      } else {
        PenciPodcastImporter.Submission._handleImportRecursion(
          request_data,
          response.episode_count,
          0,
          callback_completed,
          callback_progress
        );
      }
    } );
  },

  _handleImportRecursion : function( request_data, episode_count, episode_offset, callback_completed, callback_progress ) {
    PenciPodcastImporter.API.post( "pencipdc-importer/v1/import-feed", jQuery.extend( true, {
      episode_offset : episode_offset,
      episode_limit  : window.podcast_import_settings.import_limit
    }, request_data ), function( response ) {
      if( episode_count < episode_offset + parseInt( window.podcast_import_settings.import_limit ) ) {
          callback_completed( response );
      } else {
        callback_progress(
          response.messages,
          response.summary,
          episode_offset + parseInt( window.podcast_import_settings.import_limit ),
          episode_count
        );

        PenciPodcastImporter.Submission._handleImportRecursion(
          request_data,
          episode_count,
          episode_offset + parseInt( window.podcast_import_settings.import_limit ),
          callback_completed,
          callback_progress
        );
      }
    } );
  }

};

function pencipdc_importer_element_loader( type ) {
  let response = '';

  response += '<div class="pis-application-loader-wrapper"' + ( type === 'mini' ? ' data-pis-loader-type="mini"' : '' ) + '>';

  if( type === 'mini' ) {
    response += '<div><div></div></div>';
  } else {
    response += '<div>' +
                  '<div>' +
                    '<div>' +
                      '<div>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>';
  }


  response += '</div>';

  return response;
}

jQuery(document).ready( function() {
  jQuery( "#podtcast-importer-pencipdc-dismissible" ).on( "click", ".notice-dismiss", function( event ) {
    event.preventDefault();
    event.stopImmediatePropagation();

    PenciPodcastImporter.API.post( "pencipdc-importer/v1/admin-dismiss-notice", {}, function() {} );
  });

  jQuery( "[data-pencipdc-import-rest-api-request]" ).off( "click" ).on( "click", function() {
    let request_path = jQuery(this).attr( 'data-pencipdc-import-rest-api-request' ),
        trigger = jQuery(this),
        trigger_text = trigger.html();

    trigger.attr( "disabled", "disabled" ).html( pencipdc_importer_element_loader( "mini" ) );

    PenciPodcastImporter.API.post( request_path, {}, function( response ) {
      if ( typeof trigger.attr( "data-pencipdc-import-success-message" ) !== 'undefined' )
        trigger.html( trigger.attr( "data-pencipdc-import-success-message" ) );
      else
        trigger.html( trigger_text );
    });
  });

  jQuery( '.pencipdc_import_form' ).each( function() {
    let formObject = jQuery(this),
        summaryTotalData = {},
        notificationsContainerObject = formObject.find( ".pencipdc_import_notifications" ),
        wrapperContainerObject = formObject.find( '.pencipdc_import_wrapper' ),
        _attachSummaryTotalData = function( notificationsContainerObject, summary, display_notifications ) {
          if( summary === false )
            return;

          jQuery.each( summary, function( _k, _v ) {
            if( typeof summaryTotalData[ _k ] === 'undefined' )
              summaryTotalData[ _k ] = parseInt( _v );
            else if( _k !== 'episode_count' )
              summaryTotalData[ _k ] += parseInt( _v );
          });

          if( !display_notifications )
            return;

          let message_html = '';

          if( summaryTotalData.current_import === 0 && summaryTotalData.episode_count !== 0) {
            if( summaryTotalData.synced_count !== 0 ) {
              if( summaryTotalData.skipped_count !== 0 ) {
                message_html = '<div class="pencipdc_import_summary"' +
                                   ' data-pencipdc-import-notification="success">' +
                                      window.podcast_import_settings.lang_import_summary_progress_with_skips.replace( "%s", summaryTotalData.synced_count ).replace( "%s", summaryTotalData.skipped_count ) +
                               '</div>';
              } else {
                message_html = '<div class="pencipdc_import_summary" data-pencipdc-import-notification="success">' +
                                  window.podcast_import_settings.lang_import_summary_progress.replace( "%s", summaryTotalData.synced_count ) +
                               '</div>';
              }
            } else {
              if( parseInt( summaryTotalData.skipped_count ) !== 0 ) {
                message_html = '<div class="pencipdc_import_summary"' +
                                   ' data-pencipdc-import-notification="progress">' +
                                      window.podcast_import_settings.lang_import_summary_progress_skips.replace( "%s", summaryTotalData.skipped_count ) +
                               '</div>';
              } else {
                message_html = '<div class="pencipdc_import_summary" data-pencipdc-import-notification="danger">' + window.podcast_import_settings.lang_import_summary_no_imports + '</div>';
              }
            }
          } else if ( summaryTotalData.episode_count === 0 ) { // No episodes existing within feed.
            message_html = '<div class="pencipdc_import_summary" data-pencipdc-import-notification="danger">' + window.podcast_import_settings.lang_import_summary_no_episodes + '</div>';
          } else {
            message_html = '<div class="pencipdc_import_summary" data-pencipdc-import-notification="success">' +
                              window.podcast_import_settings.lang_import_summary_success.replace( "%s", summaryTotalData.current_import ).replace( "%s", summaryTotalData.episode_count ) +
                              ( summaryTotalData.synced_count !== 0 ? window.podcast_import_settings.lang_import_summary_success_resynced.replace( "%s", summaryTotalData.synced_count ) : '' ) +
                           '</div>';
          }

          notificationsContainerObject.find( '.pencipdc_import_summary' ).remove();
          notificationsContainerObject.append( message_html );
        };

    formObject.find( '[data-pencipdc-conditional-display]' ).each( function() {
      let conditionalDisplayContainer = jQuery(this),
          attr = jQuery(this).attr( 'data-pencipdc-conditional-display' ),
          target = attr.substr( 0, attr.indexOf( ":" ) ),
          allow_list = attr.substr( attr.indexOf( ":" ) + 1 ).split( ',' ),
          val = ( formObject.find( target ).is( ':checkbox' ) ? ( formObject.find( target ).is(':checked') ? '1' : '0' ) : formObject.find( target ).val() );

      if( !allow_list.includes( val ) )
        conditionalDisplayContainer.hide();

      if (!attr || !val)
        conditionalDisplayContainer.show();  

      formObject.find( target ).on( "change", function() {
        if( !allow_list.includes( ( jQuery(this).is( ':checkbox' ) ? ( jQuery(this).is(':checked') ? '1' : '0' ) : jQuery(this).val() ) ) )
          conditionalDisplayContainer.hide();
        else
          conditionalDisplayContainer.show();
      });
    });

    formObject.find( '.pencipdc_import_advanced_settings_toggle' ).on( "click", function() {
      if( jQuery(this).hasClass( "active" ) ) {
        jQuery(this).parent().find( ' > .pencipdc_import_advanced_settings' ).slideUp( "slow" );
        jQuery(this).removeClass( "active" );
      } else {
        jQuery(this).parent().find( ' > .pencipdc_import_advanced_settings' ).slideDown( "slow" );
        jQuery(this).addClass( "active" );
      }
    });

    formObject.find( '.pencipdc_import_field_media_image_handler .button-primary' ).on( "click", function( event ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let image_container = jQuery(this).parents( '.pencipdc_import_field_media_image_handler:first' );

      let image = wp.media({
        title: 'Upload Image File',
        multiple: false
      }).open().on('select', function(e){
        let uploaded_file = image.state().get('selection').first();

        if( typeof uploaded_file.toJSON().id === 'undefined' ) {
          alert( "Missing Image ID, it needs to be uploaded on the server" );
          return;
        }

        image_container.find( 'input[type="hidden"]' ).val( uploaded_file.toJSON().id );

        if( image_container.find( " img " ).length !== 0 )
          image_container.find( " img " ).attr( 'src', uploaded_file.toJSON().url );
        else
          image_container.prepend( '<img src="' + uploaded_file.toJSON().url + '"/>' );

        image_container.find( '.button-secondary' ).show();
      });
    });

    formObject.find( '.pencipdc_import_field_media_image_handler .button-secondary' ).on( "click", function( event ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let image_handler = jQuery(this).parents( '.pencipdc_import_field_media_image_handler:first' );

      image_handler.find( '.button-secondary' ).hide();
      image_handler.find( 'img' ).remove();
      image_handler.find( 'input[type="hidden"]' ).val( '' );
    });

    formObject.on( "submit", function( event ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      notificationsContainerObject.show();
      notificationsContainerObject.find( '[data-pencipdc-import-notification]' ).remove();

      let request_data = {};

      // Hidden inputs are defaults for the checkboxes, PHP way of achieving it, and emulating it here.
      formObject.find( 'input:not([type="checkbox"]), select:not([multiple])' ).each( function() {
        request_data[ jQuery(this).attr( "name" ) ] = jQuery(this).val();
      });

      formObject.find( 'input[type="checkbox"]:checked' ).each( function() {
        request_data[ jQuery(this).attr( "name" ) ] = jQuery(this).val();
      });

      formObject.find( 'select[multiple]' ).each( function() {
        request_data[ jQuery(this).attr( "name" ).replace( '[]', '' ) ] = jQuery(this).val();
      });

      wrapperContainerObject.slideUp( "slow" );
      formObject.prepend( pencipdc_importer_element_loader() );

      summaryTotalData = {};

      PenciPodcastImporter.Submission.handle_import( request_data, function( response ) {
        formObject.find( '.pis-application-loader-wrapper' ).remove();
        formObject.find( '.pis-application-loader-progress-bar' ).remove();

        if( typeof response === 'undefined' ) {
          notificationsContainerObject.prepend( '<div data-pencipdc-import-notification="danger">Server Error</div>');
        } else if( typeof response.data !== 'undefined' && ( response.data.status > 400 || response.data.status < 300 ) ) {
          notificationsContainerObject.prepend( '<div data-pencipdc-import-notification="danger">' + response.message + '</div>');
        } else if( typeof response.message !== 'undefined' ) {
          notificationsContainerObject.prepend( '<div data-pencipdc-import-notification="success">' + response.message + '</div>');
        } if( typeof response.messages !== 'undefined' ) {
          jQuery.each( response.messages, function( k, message_data ) {
            notificationsContainerObject.prepend( '<div data-pencipdc-import-notification="' + message_data.type + '">' + message_data.message + '</div>' );
          });
        }

        _attachSummaryTotalData( notificationsContainerObject, response.summary, true );
        wrapperContainerObject.slideDown( "slow" );
      }, function( messages, summary, processed_items, total_items ) {
        let loaderProgressBarObject = formObject.find( '.pis-application-loader-progress-bar' ),
            loader_message = window.podcast_import_settings.lang_import_progress.replace( '%s', processed_items ).replace( '%s', total_items );

        if( loaderProgressBarObject.length === 0 ) {
          formObject.find( '.pis-application-loader-wrapper' ).before(
            '<div class="pis-application-loader-progress-bar">' +
                '<div class="pis-application-loader-progress-bar-background"></div>' +
                pencipdc_importer_element_loader( 'mini' ) +
                '<p></p>' +
            '</div>'
          );

          loaderProgressBarObject = formObject.find( '.pis-application-loader-progress-bar' );
        }

        loaderProgressBarObject.find( ' > p' ).html( loader_message );
        loaderProgressBarObject.find( ' > .pis-application-loader-progress-bar-background' ).css( 'width', '' + ( processed_items / total_items * 100 ) + '%' );
        formObject.find( '.pis-application-loader-wrapper' ).not( '[data-pis-loader-type="mini"]' ).remove();

        jQuery.each( messages, function( k, message_data ) {
          notificationsContainerObject.prepend( '<div data-pencipdc-import-notification="' + message_data.type + '">' + message_data.message + '</div>' );
        });

        _attachSummaryTotalData( notificationsContainerObject, summary, false );
      } );
    });
  });
});