'use strict';
(function() {
			tinymce.PluginManager.add('gavickpro_tc_button', function( editor, url ) {
				editor.addButton( 'gavickpro_tc_button', {
					text: '',
					icon: 'nex-forms-tinymce-button',
					onclick: function() {
				editor.windowManager.open( {
					title: 'Insert NEX-Form',
					body: insert_nex_form,
					onsubmit: function( e )
						{
						var params = '[';
						params += 'NEXForms id="' + e.data.form_id + '" ';
						if(e.data.open_trigger!='normal')
							{
							params += 'open_trigger="' + e.data.open_trigger + '" ';
							params += 'auto_popup_delay="' + e.data.auto_popup_delay + '" ';
							params += 'auto_popup_scroll_top="' + e.data.auto_popup_scroll_top + '" ';
							params += 'exit_intent="' + e.data.exit_intent + '" ';
							params += 'type="' + e.data.button_type + '" ';
							params += 'element_class="' + e.data.element_class + '" ';
							params += 'text="' + e.data.button_text + '" ';
							params += 'button_color="' + e.data.button_color + '" ';
							}
						params += ']';
						editor.insertContent( params);
						}
				});
			}
        });
    });
})();




