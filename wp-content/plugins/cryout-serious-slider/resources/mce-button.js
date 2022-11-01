
function cryout_serious_slider_getsliders() {
	output = [ {text: CRYOUT_MCE_LOCALIZED.text_retrieving_sliders, value: '0'} ]

	jQuery.ajax(
			cryout_serious_slider_ajax.ajaxurl,
			{ 'method': 'POST', 'data' : { 'action': 'cryout_serious_slider_ajax' }, async: false, dataType: 'json',
			'success': function( data ) {
				output = data;
			} }
		).fail(function() {
		output = [ {text: CRYOUT_MCE_LOCALIZED.text_retrieving_sliders_error, value: '0'} ]
	});
	return output;
}

(function() {
	tinymce.PluginManager.add('serious_slider', function( editor, url ) {
		var sh_tag = 'serious-slider';

		//helper functions
		function getAttr(s, n) {
			n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);
			return n ?  window.decodeURIComponent(n[1]) : '';
		};

		function html( cls, data ,con) {
			var placeholder = url + '/img/' + getAttr(data,'type') + '.jpg';
			data = window.encodeURIComponent( data );
			content = window.encodeURIComponent( con );

			return '<img src="' + placeholder + '" class="mceItem ' + cls + '" ' + 'data-sh-attr="' + data + '" data-sh-content="'+ con+'" data-mce-resize="false" data-mce-placeholder="1" />';
		}

		function replaceShortcodes( content ) {
			return content.replace( /\[serious_slider([^\]]*)\]([^\]]*)\[\/serious_slider\]/g, function( all,attr,con) {
				return html( 'wp-serious_slider', attr , con);
			});
		}

		function restoreShortcodes( content ) {
			return content.replace( /(?:<p(?: [^>]+)?>)*(<img [^>]+>)(?:<\/p>)*/g, function( match, image ) {
				var data = getAttr( image, 'data-sh-attr' );
				var con = getAttr( image, 'data-sh-content' );

				if ( data ) {
					return '<p>[' + sh_tag + data + ']' + con + '[/'+sh_tag+']</p>';
				}
				return match;
			});
		}

		//add popup
		editor.addCommand('serious_slider_popup', function(ui, v) {

			//setup defaults
			var sid = '0'; if (v.sid) sid = v.sid;

			editor.windowManager.open( {
				title: CRYOUT_MCE_LOCALIZED.text_serious_slider,
				width: 500,
				height: 150,
				// style: 'padding: 2em',
                buttons: [{
                    text: CRYOUT_MCE_LOCALIZED.text_insert_slider,
					classes: 'widget btn primary first',
					style: 'width: 150px',
                    onclick: 'submit'
                },
				{
					text: CRYOUT_MCE_LOCALIZED.text_cancel,
					classes: 'widget btn',
					onclick: 'close'
				}],
				body: [
					{
						type: 'listbox',
						name: 'sid',
						label: CRYOUT_MCE_LOCALIZED.text_select_slider,
						value: sid,
						'values': cryout_serious_slider_getsliders(),
						tooltip: ''
					},

				],
				onsubmit: function( e ) {
					var shortcode_str = '[' + sh_tag;

					if ( typeof e.data.sid != 'undefined')
							shortcode_str += ' id="' + e.data.sid + '"';
					shortcode_str += ']';

					//insert shortcode to tinymce
					editor.insertContent( shortcode_str);
				}
			});
	      	});

		//add button
		editor.addButton('serious_slider', {
			title: CRYOUT_MCE_LOCALIZED.text_add_slider,
			icon: 'serious_slider',
			tooltip: CRYOUT_MCE_LOCALIZED.text_serious_slider_tooltip,
			onclick: function() {
				editor.execCommand('serious_slider_popup','',{
				});
			}
		});

		/*//replace from shortcode to an image placeholder
		editor.on('BeforeSetcontent', function(event){
			event.content = replaceShortcodes( event.content );
		});

		//replace from image placeholder to shortcode
		editor.on('GetContent', function(event){
			event.content = restoreShortcodes(event.content);
		});

		//open popup on placeholder double click
		editor.on('DblClick',function(e) {
			var cls  = e.target.className.indexOf('wp-serious_slider');
			if ( e.target.nodeName == 'IMG' && e.target.className.indexOf('wp-serious_slider') > -1 ) {
				var title = e.target.attributes['data-sh-attr'].value;
				title = window.decodeURIComponent(title);
				console.log(title);
				var content = e.target.attributes['data-sh-content'].value;
				editor.execCommand('serious_slider_popup','',{
					header : getAttr(title,'header'),
					footer : getAttr(title,'footer'),
					type   : getAttr(title,'type'),
					content: content
				});
			}
		}); */
	});
})();
