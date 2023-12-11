/* global ywraq_exclusion_list*/
jQuery(function ($) {
	"use strict";

	var add_exclusion_button = $( '.ywraq-add-exclusion' ),
		content              = $( '.yith-plugin-fw__panel__content__page .yith-plugin-fw__panel__content__page__title' );

		content.append( add_exclusion_button );

	var newExclusion = $(document).find('.yith-exclusion-list__popup_wrapper'),
		confirm = $(document).find('#yith-exclusion-list__delete_row'),
		popupForm = newExclusion.find('form'),
		openPopup = function () {

			newExclusion = $(document).find('.yith-exclusion-list__popup_wrapper');

			// init dialog
			newExclusion.dialog({
				closeText: '',
				title: ywraq_exclusion_list.popup_add_title,
				width: 500,
				modal: true,
				dialogClass: 'yith-plugin-ui ywraq-exclusion-list-add ywraq-exclusion-list-popup',
				buttons: [{
					'text': ywraq_exclusion_list.save,
					'click': function (e) {
						e.preventDefault();
						window.onbeforeunload = null;
						popupForm.submit();
					},
					'class': 'yith-save-form'
				}]
			});

		},

		updatePopupField = function () {
			$(document).on('change', '#ywraq-exclusion-type', function () {
				var $t = $(this),
					fieldSelected = $t.val();
				$('.ywraq-exclusion-field').hide();
				$('[dep-value="' + fieldSelected + '"').show();
			});

			$('#ywraq-exclusion-type').change();
		},
		cancelExclusion = function (fieldType, fieldId) {
			$.ajax({
				url: ywraq_exclusion_list.ajaxurl,
				data: {type: fieldType, id: fieldId, action:'ywraq_delete_from_exclusion_list',nonce:ywraq_exclusion_list.delete_nonce},
				type: 'POST',
				success: function( response ){
					confirm.dialog('close');
					window.location.reload();
				}
			});
		};

	updatePopupField();


	$(document).on('click', '.ywraq-add-exclusion', function () {
		openPopup();
	});

	$(document).on('click', '.action__trash', function (ev) {
		ev.preventDefault();

		var $t = $(this),
				$row = $t.closest('tr'),

			 fieldId = $row.find( '.check-column input').val(),
				fieldType = $row.find( '.ywraq-data-type').data('type');


		// init dialog
		confirm.dialog({
			closeText: '',
			width: 350,
			modal: true,
			dialogClass: 'yith-plugin-ui ywraq-exclusion-list-popup-confirmation ywraq-exclusion-list-popup',
			buttons: [{
				'text': ywraq_exclusion_list.confirmChoice,
				'click': function () {
					cancelExclusion(fieldType, fieldId);
				},
				'class': 'yith-confirm'
			},
				{
					'text': ywraq_exclusion_list.cancel,
					'click': function () {
						confirm.dialog("close");
					},
					'class': 'yith-close'
				}]

		});
	});

});

