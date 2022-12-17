/*
* Ultimate Membership Pro - JS Alert box
*/
"use strict";
jQuery( window ).on( 'load', function(){

  var selector = '.ihc-js-public-alerts-data';
  var error_title = jQuery( selector ).attr('data-error_title');
  var error_text = jQuery( selector ).attr('data-error_text');
  var warning_title = jQuery( selector ).attr('data-warning_title');
  var warning_text = jQuery( selector ).attr('data-warning_text');
  var info_title = jQuery( selector ).attr('data-info_title');
  var info_text = jQuery( selector ).attr('data-info_text');
  var error = jQuery( selector ).attr('data-error');
  var warning = jQuery( selector ).attr('data-warning');
  var info = jQuery( selector ).attr('data-info');
  var ok = jQuery( selector ).attr('data-ok');

  if ( error == 1 ){
    document.cookie = 'ihc_error=; path=/; Max-Age=-999;';
    ihcSwal({
      title: error_title,
      text: error_text,
      type: "error",
      showCancelButton: false,
      confirmButtonClass: "btn-danger",
      confirmButtonText: ok,
      closeOnConfirm: true
    });
  }

  if ( warning == 1 ){
      document.cookie = 'ihc_warning=; path=/; Max-Age=-999;';
      ihcSwal({
        title: warning_title,
        text: warning_text,
        type: "warning",
        showCancelButton: false,
        confirmButtonClass: "btn-danger",
        confirmButtonText: ok,
        closeOnConfirm: true
    });
  }

  if ( info == 1 ){
    document.cookie = 'ihc_info=; path=/; Max-Age=-999;';
    ihcSwal({
      title: info_title,
      text: info_text,
      type: "info",
      showCancelButton: false,
      confirmButtonClass: "btn-info",
      confirmButtonText: ok,
      closeOnConfirm: true
    });
  }
} );
