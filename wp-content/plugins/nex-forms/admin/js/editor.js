'use strict';
var element = '';
var code = '';
var editor;		

jQuery(document).on('click','.tiny_button_tags_placeholders .item', function() {
		element = '';
		code = '';
		element = jQuery(this).attr('element');
		code = jQuery(this).attr('code');
		editor.selection.setContent('{{' + code + '}}');
		code = '';
	});

tinymce.create('tinymce.plugins.nf_tags_button', {
	init : function(ed, url) {
		ed.addButton('nf_tags_button', {
			title : 'Add an element',
			classes : 'flight_shortcodes btn nf_mce_button',
			text: '+ Add field tag',
			onclick : function(element) {
				editor = ed;
				var the_button = jQuery('#'+element.control._id);
				var button = the_button.offset();
				var top = (button.top - 53) + "px";
				var left = (button.left) + "px";
				jQuery('.tags_opened').removeClass('tags_opened');
				var set_tags = jQuery('.tiny_button_tags_placeholders').detach()
				
				var editor_container = the_button.closest('.wp-editor-wrap');
				editor_container.prepend(set_tags);
				element = '';
				code = '';	
				
					if(the_button.hasClass('is_opened'))
						{
						the_button.removeClass('is_opened');
						jQuery('.tiny_button_tags_placeholders').hide();
						jQuery('.tags_opened').removeClass('tags_opened');
						}
					else
						{
						the_button.addClass('is_opened');
						jQuery('.tiny_button_tags_placeholders').slideDown('fast');
						editor_container.addClass('tags_opened');
						}
			}
		});
	},
	createControl : function(n, cm) {
		return null;
	},
});	
tinymce.PluginManager.add('nf_tags_button', tinymce.plugins.nf_tags_button);