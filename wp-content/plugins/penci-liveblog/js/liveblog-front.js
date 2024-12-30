jQuery( document ).ready( function( $ ) {
  $( '.pcliveblog-wrapper' ).each( function() {
    var t = $( this ),
        wrapper = t.find( '.pcliveblog-wrapper-listing' ),
        id = t.attr( 'data-id' ),
        timeout = penciliveblog.timeout,
        check = t.find( '#_wpnonce' ).val(),
        html = '',
        timeleft = timeout / 1000;
    btn = t.find( '.pcliveblog-wrapper-button-action' );

    var count = timeleft;
    var counter = null;

    // reset count and timer
    function reset_timer() {
      clearInterval( counter );
      count = timeleft;
      counter = setInterval( timer, 1000 ); //1000 will  run it every 1 second
    }

    // init timer for first time
    reset_timer();

    function timer() {
      count --;
      if ( count <= 0 ) {
        clearInterval( counter );
        setTimeout( reset_timer, 0 );
        return;
      }
      $( '.pcliveblog-count' ).html( count );
    }

    var pgetedit = function( $time ) {

      t.attr( 'data-update-time', $time );

      $.ajax( {
        type: 'get',
        url: ajax_var_more.url,
        data: {
          action: 'penci_liveblog_get_update_content',
          id: id,
          get: $time,
          nonce: check,
        },
        success: function( data ) {

          if ( data.data.action == 'edited' && data.data.time &&
               data.data.content && data.data.title && data.data.id ) {

            html = '<div class="pcliveblog-date">\n' + '        <span>' +
                   data.data.time + '</span>\n' + '    </div>\n' +
                   '    <div class="pcliveblog-title post-entry">' +
                   data.data.title + '</div>\n' +
                   '    <div class="pcliveblog-content post-entry">' +
                   data.data.content + '</div>';

            wrapper.find( '#pc-live-item-' + data.data.id ).html( html );

            if ( !penciliveblog.disable_share ) {
              wrapper.find( '#pc-live-item-' + data.data.id ).
                      append( data.data.share );
            }

          } else if ( data.data.action == 'delete' && data.data.id ) {
            wrapper.find( '#pc-live-item-' + data.data.id ).remove();
          }

        },
      } );
    };

    var pupdate = function() {
      $.ajax( {
        type: 'get',
        url: penciliveblog.url,
        data: {
          action: 'penci_liveblog_get_content',
          current: parseInt( t.attr( 'data-current-live' ) ),
          id: id,
          nonce: check,
          time: Date.now(),
        },
        success: function( data ) {

          if ( data.data.time && data.data.content && data.data.title &&
               data.data.id ) {

            var ori_title = document.title,
                ptime = data.data.time;

            html = '<div id="pc-live-item-' + data.data.id + '" data-item="' +
                   data.data.id + '" class="pcliveblog-listing-item">\n' +
                   '    <div class="pcliveblog-date">\n' + '        <span>' +
                   ptime + '</span>\n' + '    </div>\n' +
                   '    <div class="pcliveblog-title post-entry">' +
                   data.data.title + '</div>\n' +
                   '    <div class="pcliveblog-content post-entry">' +
                   data.data.content + '</div>\n' + '</div>';

            wrapper.prepend( html );

            if ( !penciliveblog.disable_share ) {
              wrapper.find( '#pc-live-item-' + data.data.id ).
                      append( data.data.share );
            }

            t.attr( 'data-current-live', data.data.item );

            if ( penciliveblog.tab ) {
              document.title = penciliveblog.update + ' - ' + ori_title;

              setInterval( function() {
                document.title = ori_title;
              }, timeout );
            }
          }

          if ( data.data.update && (
              parseInt( data.data.update ) >
              parseInt( t.attr( 'data-update-time' ) )
          ) ) {
            pgetedit( data.data.update );
          }

          $( 'body' ).trigger( 'pclive_apply_ads' );
        },
      } );
      setInterval( function() {
        btn.removeClass( 'loading' );
      }, 300 );
    };

    setInterval( pupdate, timeout );

    $( document ).
        on( 'click', '.pcliveblog-wrapper-button-action', function( e ) {
          e.preventDefault();
          $( this ).addClass( 'loading' );
          pupdate();
          reset_timer();
        } );

    $( 'body' ).on( 'pclive_apply_ads', function( e ) {
      var ads_num = parseInt( penciliveblog.ads_num ),
          ads_code = penciliveblog.ads_code,
          wrapper = $( '.pcliveblog-wrapper-listing' ),
          total = parseInt( wrapper.find( '.pcliveblog-listing-item' ).length );

      if ( total % ads_num === 1 ) {
        wrapper.find( '.pcliveblog-listing-item:first-child' ).after(
            '<div class="pcliveblog-listing-ads">' + ads_code + '</div>' );
      }
    } );

    $( document ).on( 'click', '.penci-copy-link', function( e ) {
      e.preventDefault();
      var link = $( this ).attr( 'href' );
      navigator.clipboard.writeText( link );

      $( this ).
          after( '<span class="pclb-sitem penci-copy-link-notice">' +
                 penciliveblog.event_copies + '</span>' );

      setInterval( function() {
        $( '.penci-copy-link-notice' ).remove();
      }, 1000 );

    } );

    if ( window.location.hash ) {

      var path = window.location.hash;

      if ( path.startsWith( '#pc-live-item' ) ) {

        var offset = - 120,
            hash = window.location.hash.substring( 1 );

        if ( !hash ) {
          return;
        }

        var sel = '[id="' + hash + '"]';
        var currentOffset = $( sel ).offset().top;

        // smooth scroll to the anchor id
        $( 'html, body' ).animate( {
          scrollTop: (
                     currentOffset + offset
                     ) + 'px',
        }, 1000, 'swing' );
      }
    }

  } );
} );