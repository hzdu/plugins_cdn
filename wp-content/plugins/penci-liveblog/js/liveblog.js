jQuery( document ).ready( function( $ ) {
  $( document ).on( 'click', '.pcliveblog-addnew', function( e ) {
    e.preventDefault();

    var wrapper = $( '.pcliveblog-events-wrapper' ),
        classic_content = $('#pcliveblog_update').val(),
        content = classic_content ? classic_content : tinymce.get( 'pcliveblog_update' ).getContent(),
        utime = wrapper.find( '.pcliveblog_update_time' ),
        title = wrapper.find( '.pcliveblog_update_title' ),
        livwrapper = wrapper.find( '.live-events-listing' ), html = '',
        today = new Date(),
        time = today.getHours() + ':' + today.getMinutes() + ':' +
               today.getSeconds(),
        time = utime.val() ? utime.val() : time,
        itemid = $( this ).attr( 'data-item-id' ),
        id = $( this ).attr( 'data-id' );

    if ( content.length ) {

      var data_event = {
        action: 'penci_liveblog_update_content',
        nonce: penciliveblog.nonce,
        id: id,
        iid: itemid,
        content: content,
        title: title.val(),
        update: utime.val(),
      };

      html = '<div class="date"><span>' +
             time +
             '</span></div><div class="live-events-listing-ct post-title"><span>' +
             title.val() +
             '</span></div><div class="live-events-listing-ct post-entry">' +
             content +
             '</div><div class="live-events-listing-action"><a class="pcliveblog-event-edit" href="#">Edit</a><a class="pcliveblog-event-delete" href="#">Delete</a></div>';

      if ( classic_content ){
        $('#pcliveblog_update').val('');
      } else {
        tinymce.get( 'pcliveblog_update' ).setContent( '' );
      }

      utime.val( '' );
      title.val( '' );

      $.post( penciliveblog.url, data_event, function( response ) {
        var res_id = response.data.time,
            timeformat = response.data.time_format;
        if ( !itemid ) {
          livwrapper.append(
              '<div class="live-events-listing-item item-' + res_id +
              '" data-item="' + res_id + '">' + html + '</div>' );
          livwrapper.find( '.item-' + res_id + ' .date span' ).
                     html( timeformat.replace(/\\/gi, '' ) );
        } else {
          livwrapper.find( '.live-events-listing-item.item-' + itemid ).
                     html( html );
        }
      } );

      $( 'body' ).trigger('pcliveblog_reset');
    }

  } );

  $( document ).on( 'click', '.pcliveblog-event-delete', function( e ) {
    e.preventDefault();
    var t = $( this ),
        id = t.closest( '.live-events-listing-item' ).attr( 'data-item' ),
        pid = t.closest( '.live-events-listing' ).attr( 'data-event-id' );
    $.ajax( {
      type: 'get',
      url: penciliveblog.url,
      data: {
        action: 'penci_liveblog_delete_content',
        itemid: id,
        id: pid,
        nonce: penciliveblog.nonce,
        time: Date.now(),
      },
      success: function( data ) {
        t.closest( '.live-events-listing-item' ).remove();
      },
    } );
  } );

  $( document ).on( 'click', '.pcliveblog-event-edit', function( e ) {
    e.preventDefault();
    var t = $( this ),
        wrapper = t.closest( '.live-events-listing-item' ),
        item_id = wrapper.attr( 'data-item' ),
        editor = $( '.live-events-new' ),
        date = wrapper.find( '.date span' ).text(),
        title = wrapper.find( '.post-title span' ).text(),
        content = wrapper.find( '.post-entry' ).html();

    editor.find( 'a.pcliveblog-addnew' ).
           attr( 'data-item-id', item_id ).
           html( penciliveblog.update );
    editor.find( '.pcliveblog-reset' ).css( 'display', 'inline-block' );

    editor.find( '.pcliveblog_update_time' ).val( date );
    editor.find( '.pcliveblog_update_title' ).val( title );
    tinymce.get( 'pcliveblog_update' ).setContent( content );
  } );

  $( document ).on( 'click', '.pcliveblog-reset', function( e ) {
    e.preventDefault();
    $( 'body' ).trigger('pcliveblog_reset');
  } );

  $( 'body' ).on( 'pcliveblog_reset', function( e ) {
    var editor = $( '.live-events-new' );
    editor.find( '.pcliveblog_update_time' ).val( '' );
    editor.find( '.pcliveblog_update_title' ).val( '' );

    if ( $('#pcliveblog_update').val() ) {
      $('#pcliveblog_update').val('');
    } else {
      tinymce.get( 'pcliveblog_update' ).setContent( '' );
    }

    editor.find( 'a.pcliveblog-addnew' ).
           attr( 'data-item-id', '' ).
           html( 'Add new Update' );
    editor.find( '.pcliveblog-reset' ).css( 'display', 'none' );
  } );

  $( document ).on( 'change', '#pcliveblog_enable', function( e ) {
    e.preventDefault();
    var t = $( this ),
        v = t.val();
    $.ajax( {
      type: 'get',
      url: penciliveblog.url,
      data: {
        action: 'penci_liveblog_update_status',
        id: t.attr( 'data-event-id' ),
        value: v,
        nonce: penciliveblog.nonce,
      },
      success: function( data ) {
        t.after(
            '<span style="vertical-align:middle;margin-left:10px;border-radius:2px;display:inline-block;padding:2px 5px;background:green;color:#fff;" class="pcliveblog-notice">Updated</span>' );
        setInterval( function() {
          $( '.pcliveblog-notice' ).remove();
        }, 3000 );
      },
    } );
  } );
} );