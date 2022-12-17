/*
* Ultimate Membership Pro - Register Box Modal
*/
"use strict";
var IhcRegisterModal = {
	modalSelector						     : '#ihc_register_modal',
  triggerModalSelector         : '.ihc-register-modal-trigger',
	preventDefault							 : 0,

	init: function(args){
		var obj = this;
		obj.setAttributes(obj, args);
    obj.initModal(obj);
    jQuery(obj.triggerModalSelector).on('click', function(evt){
        obj.handleOpenModal(obj, evt);
    });
	},

  setAttributes: function(obj, args){
		for (var key in args) {
			obj[key] = args[key];
		}
	},

  initModal: function(obj){
      jQuery(obj.modalSelector).iziModal({
  				title: jQuery(obj.modalSelector).attr('data-title'),
  				headerColor: '#88A0B9',
  				background: null,
  				theme: 'light',  // light
  				width: 600,
  				top: null,
  				bottom: null,
  				borderBottom: true,
  				padding: 20,
  				radius: 3,
  				zindex: 9999,
  				focusInput: true,
  				autoOpen: 0, // Boolean, Number
  				bodyOverflow: false,
  				closeOnEscape: true,
  				closeButton: true,
  				appendTo: 'body', // or false
  				appendToOverlay: 'body', // or false
  				overlay: true,
  				overlayClose: true,
  				overlayColor: 'rgba(0, 0, 0, 0.4)',
  				transitionIn: 'comingIn',
  				transitionOut: 'comingOut',
  				transitionInOverlay: 'fadeIn',
  				transitionOutOverlay: 'fadeOut',
					onOpening: function(){},
  				onClosing: function(){},
  				onClosed: function(){},
  				afterRender: function(){}
  		})
  },

  handleOpenModal: function( obj, evt ){
			if (obj.preventDefault){
					evt.preventDefault();
			}
      jQuery(obj.modalSelector).iziModal('open');
  },

}
