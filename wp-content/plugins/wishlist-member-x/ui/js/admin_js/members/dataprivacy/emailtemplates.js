$(function() {

	$('body').off('.wlm3dataprivacy');

	$('body').on('click.wlm3dataprivacy', '.modal .modal-save-button', function(e) {
		e.preventDefault();
		var modal = $(this).closest('.modal');
		var button = $(e.currentTarget);
		modal.save_settings({
			data : {
				action : 'admin_actions',
				WishListMemberAction : 'save',
			},
			on_init: function() {
				if(button.hasClass('btn')) {
					button.disable_button({disable:true, icon:'update', class:''});
				}
			},
			on_done: function() {
				if(button.hasClass('btn')) {
					button.disable_button({disable:false, icon:'save', class:''});
				}
			},
			on_success: function($me, $data) {
				$($me).find(':input').each(function() {
					$(this).data('initial', $(this).val());
				});
				$('.wlm-message-holder').show_message();
			}
		})
		if($(this).hasClass('modal-save-and-close')) {
			$(this).closest('.modal').modal('hide');
		}
	});

	$('body').on('click.wlm3dataprivacy', '.modal .modal-cancel', function(e) {
		e.preventDefault();
		var modal = $(this).closest('.modal');
		modal.find(':input').each(function() {
			$(this).val($(this).data('initial'));
			$(this).trigger('change');
		});
		modal.modal('hide');
	});

	$('body').on('change.wlm3dataprivacy', '#data-privacy_unsubscribe .is-toggle-switch', function() {
		$(this).closest('.switch').save_settings({
			data : {
				action : 'admin_actions',
				WishListMemberAction : 'save'
			}
		});
	});

	var mymodal = new wlm3_modal(
		'#data-privacy_download-fulfilled_markup', {
			after_open : function(e) {
				$(this).find(':input').each(function() {
					$(this).data('initial', $(this).val());
				});
			}
		}
	);
	var mymodal = new wlm3_modal(
		'#data-privacy_erasure-fulfilled_markup', {
			after_open : function(e) {
				$(this).find(':input').each(function() {
					$(this).data('initial', $(this).val());
				});
			}
		}
	);
	var mymodal = new wlm3_modal(
		'#data-privacy_unsubscribe_markup', {
			after_open : function(e) {
				$(this).find(':input').each(function() {
					$(this).data('initial', $(this).val());
				});
			}
		}
	);
	var mymodal = new wlm3_modal(
		'#data-privacy_user-request_markup', {
			after_open : function(e) {
				$(this).find(':input').each(function() {
					$(this).data('initial', $(this).val());
				});
			}
		}
	);

	$('#the-screen').set_form_data(form_data);

	$('.email-reset-button').each(function() {
		$(this).do_confirm({placement:'right',yes_classes:'-success'})
		.on('yes.do_confirm', function() {
			var type = $(this).data('target');
			var subject = type + '_subject';
			var message = (type in default_data) ? type : type + '_body';
			$('[name="' + subject + '"]').val(default_data[subject]);
			var target = $('[name="' + message + '"]');
			var editor = tinymce.get(target[0].id);
			editor.setContent(default_data[message]);
			target.val(default_data[message]);
			$(this).closest('.modal').find('.modal-save-and-continue').click();
		});
	});

	wlm.richtext();

});