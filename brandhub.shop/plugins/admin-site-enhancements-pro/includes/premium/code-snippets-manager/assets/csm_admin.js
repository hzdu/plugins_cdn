jQuery(document).ready( function($) { 

    $('.page-title-action').hide();
    
    $('#code-snippet-description').appendTo('#code-snippet-description-wrapper');
    $('#code-snippet-description-wrapper').css('border','0');
    
    if ( 'post.php' == CSM.page_now ) {
        // Re-init wp_editor for snippet description. Required because the wp_editor was moved in the DOM after document ready.
        // Ref: https://stackoverflow.com/a/21519323.
        // Ref: https://core.trac.wordpress.org/ticket/19173
        var id = 'code_snippet_description';
        tinymce.execCommand('mceRemoveEditor', true, id);
        var init = tinymce.extend( {}, tinyMCEPreInit.mceInit[ id ] );
        try { tinymce.init( init ); } catch(e){}
        $('textarea[id="' + id + '"]').closest('form').find('input[type="submit"]').click(function(){
            if( getUserSetting( 'editor' ) == 'tmce' ){
                var id = mce.find( 'textarea' ).attr( 'id' );
                tinymce.execCommand( 'mceRemoveEditor', false, id );
                tinymce.execCommand( 'mceAddEditor', false, id );
            }
            return true;
        });
    }

    var postID = document.getElementById('post_ID') != null ? document.getElementById('post_ID').value : 0;

    // Initialize the CodeMirror editor
    if ( $('#csm_content').length > 0 ) {
        var content_mode = $("#csm_content").attr('mode');
        if ( content_mode == 'html' ) {
              var content_mode = {
                name: "htmlmixed",
                scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null}]
                 };
        }

		CSM.codemirror.mode = content_mode;
		CSM.codemirror.theme = 'monokai-mod';
		CSM.codemirror.extraKeys.F11 = function(cm) {
        	cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			fullscreen_buttons( true );
			var cookies = (getCookie('csm-' + postID) || '0,0,0,0').split(',');
			document.cookie = 'csm-' + postID + '=' + [cookies[0], cookies[1], cookies[2], 1].join(',') + '; SameSite=Lax';
		};
        CSM.codemirror.extraKeys.Esc = function(cm) {
			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			fullscreen_buttons( false );
			var cookies = (getCookie('csm-' + postID) || '0,0,0,0').split(',');
			document.cookie = 'csm-' + postID + '=' + [cookies[0], cookies[1], cookies[2], 0].join(',') + '; SameSite=Lax';
		};

        var editor = CodeMirror.fromTextArea(document.getElementById("csm_content"), CSM.codemirror);

		// Code folding
		editor.setOption("lineNumbers", true);
		editor.setOption("lineWrapping", true);
		editor.setOption("foldGutter", true);
		editor.setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
		CSM.codemirror.extraKeys["Ctrl-Q"] = function(cm){ cm.foldCode(cm.getCursor()); };

		// Note: csm-postID cookie will save cursor line, cursor character, editor height and fullscreen values
		var cookies = (getCookie('csm-' + postID) || '0,0,0,0').split(',');

        // Make the editor resizable
        var cm_width = $('#title').width() + 16;
		var cm_height = (parseFloat(cookies[2]) >= 200) ? parseFloat(cookies[2]) : 500;
        editor.setSize(cm_width, cm_height);

        $('.CodeMirror').resizable({
            resize: function() {
                editor.setSize($(this).width(), $(this).height());
            } ,
            maxWidth: cm_width,
            minWidth: cm_width,
            minHeight: 200
            
        });

        $(window).resize(function () { 
            var cm_width = $('#title').width() + 16;
            var cm_height = $('.CodeMirror').height();
            editor.setSize(cm_width, cm_height);
        });

        // Code Beautifier
        $("#csm-beautifier").click(function(e){
            CodeMirror.commands["selectAll"](editor);
            editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
            editor.setCursor(0);
            e.preventDefault();
        });

		// Autocomplete
		if ( CSM.autocomplete === '1' ) {
			editor.on( "keyup", function ( cm, event ) {
				if ( ! cm.state.completionActive && event.keyCode > 64 && event.keyCode < 91 ) {
					CodeMirror.commands.autocomplete( cm, null, { completeSingle: false } );
				}
			});
		}

        // Saving cursor state
        editor.on('cursorActivity', function () {
            var curPos = editor.getCursor();
            document.cookie = 'csm-' + postID + '=' + [curPos.line, curPos.ch, cookies[2], cookies[3]].join(',') + '; SameSite=Lax';
        });

        // Restoring cursor state
        editor.setCursor(parseFloat(cookies[0]), parseFloat(cookies[1]));

		// Save the editor's height
		editor.on('refresh', function() {
			var height = ( !editor.getOption('fullScreen') ) ? $('.CodeMirror').height() : cookies[2];
        	var curPos = editor.getCursor();
			document.cookie = 'csm-' + postID + '=' + [curPos.line, curPos.ch, height, Number(editor.getOption('fullScreen'))].join(',') + '; SameSite=Lax';
		});

		// Save the custom code when hitting "Ctrl-S"
		editor.on('keydown', function(cm, event) {
			if ( ! event.ctrlKey && ! event.metaKey || event.which !== 83 ) return;

			var height = ( !editor.getOption('fullScreen') ) ? $('.CodeMirror').height() : cookies[2];
        	var curPos = editor.getCursor();
			document.cookie = 'csm-' + postID + '=' + [curPos.line, curPos.ch, height, Number(editor.getOption('fullScreen'))].join(',') + '; SameSite=Lax';
			
			$("form#post").submit();
            event.preventDefault();
            return false;
		});


		// Restoring fullscreen 
		editor.setOption("fullScreen", parseFloat(cookies[3]));
        fullscreen_buttons( Boolean(parseFloat(cookies[3])) );

		// Action for the `fullscreen` button
		$("#csm-fullscreen-button").click( function() {
			editor.triggerOnKeyDown({type: 'keydown', keyCode: 122});
		});

		$("#publish").click(function(e){
			var cookies = (getCookie('csm-' + postID) || '0,0,0,0').split(',');
			var curPos = editor.getCursor();
			document.cookie = 'csm-' + postID + '=' + [curPos.line, curPos.ch, cookies[2], Number(editor.getOption('fullScreen'))].join(',') + '; SameSite=Lax';
		});
    }

    // Enable the tipsy 
    $('span[rel=tipsy].tipsy-no-html').tipsy({fade: true, gravity: 's'});
    $('span[rel=tipsy]').tipsy({fade: true, gravity: 's', html: true});

    // Toggle the buttons when in fullscreen mode
    function fullscreen_buttons( mode ) {
        editor.focus();
        if ( mode === true ) {
            $("#publish").css({
                'position'  : 'fixed',
                'right'     : '40px',
                'bottom'    : '40px',
                'z-index'   : 100005,
            });
        } else {
            $("#publish").css({
                'position'  : 'static',
                'right'     : 'initial',
                'bottom'    : 'initial',
                'z-index'   : 10,
            });
        }
    }


    // For post.php or post-new.php pages show the code's title in the page title
    if ( $('#titlediv #title').length > 0 ) {
        var new_title = $("input[name=code_snippet_language]").val().toUpperCase() + ' - ' + $('#titlediv #title').val();
        if( $('#titlediv #title').val().length > 0 ) {
            $(document).prop('title', new_title );
        }
        $('#titlediv #title').change(function() {
            if ( $(this).val().length > 0 ) {
                $(document).prop('title', new_title);
            } 
        });
    }


    // Make the inactive rows opaque
    if ( $('.dashicons-star-empty.csm_row').length > 0 ) {
        $('.dashicons-star-empty.csm_row').each(function(){
            $(this).parent().parent().parent().css('opacity', '0.4');
        });
    }

    // Activate/deactivate codes with AJAX
    $(".csm_activate_deactivate").click( function(e) {
        var url = $(this).attr('href');
        var code_id = $(this).attr('data-code-id');
        $('#publishing-action .spinner').addClass('is-active');
        $(this).children('.snippet-status').children('.snippet-status-spinner').toggle();
        e.preventDefault();
        $.ajax({
            url: url, 
            success: function(data){
                if (data === 'yes') {
                    csm_activate_deactivate(code_id, false);
			        $('#publishing-action .spinner').removeClass('is-active');
                }
                if (data === 'no') {
                    csm_activate_deactivate(code_id, true);
			        $('#publishing-action .spinner').removeClass('is-active');
                }
            }
        });
    });
    
    // Prevent conflict with ASE CFG that is adding hidden TinyMCE editor metabox with id="postdivrich" beneath CodeMirror
    // This happens when there's a field group that is not assigned to a certain post type, so, it tries to load on all post types edit screen
    if ( $('#postdivrich').length > 0 ) {
    	$('#postdivrich').remove();
    	// console.log('#postdivrich has been removed.');
    }

    // Disable safe mode on clicking admin bar icon for safe mode status
    $('#disabling-csm-safe-mode').detach().insertAfter('#wpadminbar');
    $("#wp-admin-bar-safe_mode > .ab-item, #disable-csm-safe-mode-link").click( function(e) {
        e.preventDefault();
		$('#disabling-csm-safe-mode').show();
		let searchParams = new URLSearchParams(window.location.search)
		if ( searchParams.has('post') ) {
			var code_id = searchParams.get('post');
		} else {
			var code_id = '';
		}
		// alert('This is post ' + code_id);
        $.ajax({
            url: ajaxurl,
            data: {
            	'action':'csm_disable_safe_mode',
            	'code_id':code_id
            },
            success: function(data){
				var data = data.slice(0,-1); // remove strange trailing zero in string returned by AJAX call
				var response = JSON.parse(data);

				if ( response.success == true ) {
					// alert('Safe mode has been disabled');
					setTimeout(function() {	
						// Skip browser cache, reload from server
						location.reload(true);
						// location = window.location.href;
					}, 2000);
				} else {
					// SVG icon: https://icon-sets.iconify.design/bx/error/
					$('#disabling-csm-safe-mode svg').html('<path fill="#d63638" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1m-1 13h2V6.5h-2zm2.004 1.5H11v2.004h2.004z"/>');
					$('#disabling-csm-safe-mode span').html("<div style=\"display:inline;color:#d63638;\">Unable to turn off safe mode</div> to resume PHP snippets execution. Please <a href=\"https://www.wpase.com/documentation/code-snippets-manager/\" target=\"_blank\">edit wp-config.php</a> directly.");
				}
            }
        });
    });

	// The "After <body> tag" option cannot go together with the "In Admin" option
	code_snippet_type_change();
	$( 'input[name=code_snippet_type]' ).on( 'change', code_snippet_type_change );
	function code_snippet_type_change() {
		if ( $( 'input[name=code_snippet_type]:checked' ).val() === 'body_open' ) {
			$( '#code_snippet_side-admin' ).prop( 'disabled', true );
			if ( $( 'input[name=code_snippet_side]:checked' ).val() === 'admin' ) {
				$( '#code_snippet_side-admin' ).prop( 'checked', 'checked' );
			}
		} else {
			$( '#code_snippet_side-admin' ).prop( 'disabled', false );
		}
	}
	code_snippet_side_change();
	$( 'input[name=code_snippet_side]' ).on( 'change', code_snippet_side_change );
	function code_snippet_side_change() {
		if ( $( 'input[name=code_snippet_side]:checked' ).val() === 'admin' ) {
			$( '#code_snippet_type-body_open' ).prop( 'disabled', true );
		} else {
			$( '#code_snippet_type-body_open' ).prop( 'disabled', false );
			if ( $( 'input[name=code_snippet_type]:checked' ).val() === 'body_open' ) {
				$( '#code_snippet_type-body_open' ).prop( 'checked', true );
			}
		}
	}


    // Toggle the signs for activating/deactivating codes
    function csm_activate_deactivate(code_id, action) {
        var row = $('tr#post-'+code_id);
        var iconActive = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M9 7c-4.96 0-9 4.035-9 9s4.04 9 9 9h14c4.957 0 9-4.043 9-9s-4.043-9-9-9zm14 2c3.879 0 7 3.121 7 7s-3.121 7-7 7s-7-3.121-7-7s3.121-7 7-7z"/></svg><span class="snippet-status-spinner" style="display:none;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#999" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="#999" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg></span>';
        var iconInactive = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#999" d="M9 7c-.621 0-1.227.066-1.813.188a9.238 9.238 0 0 0-.875.218A9.073 9.073 0 0 0 .72 12.5c-.114.27-.227.531-.313.813A8.848 8.848 0 0 0 0 16c0 .93.145 1.813.406 2.656c.004.008-.004.024 0 .032A9.073 9.073 0 0 0 5.5 24.28c.27.114.531.227.813.313A8.83 8.83 0 0 0 9 24.999h14c4.957 0 9-4.043 9-9s-4.043-9-9-9zm0 2c3.879 0 7 3.121 7 7s-3.121 7-7 7s-7-3.121-7-7c0-.242.008-.484.031-.719A6.985 6.985 0 0 1 9 9zm5.625 0H23c3.879 0 7 3.121 7 7s-3.121 7-7 7h-8.375C16.675 21.348 18 18.828 18 16c0-2.828-1.324-5.348-3.375-7z"/></svg><span class="snippet-status-spinner" style="display:none;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#999" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path fill="#999" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg></span>';
        var statusIconActive = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20"><path fill="currentColor" d="m0 11l2-2l5 5L18 3l2 2L7 18z"/></svg>';
        var statusIconInactive = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20"><path fill="currentColor" d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10s10-4.478 10-10S15.522 0 10 0Zm0 18.304A8.305 8.305 0 0 1 3.56 4.759l11.681 11.68A8.266 8.266 0 0 1 10 18.305Zm6.44-3.063L4.759 3.561a8.305 8.305 0 0 1 11.68 11.68Z"/></svg>';
        if ( action === true ) {
            row.find('.row-actions .csm_activate_deactivate')
                .text(CSM.deactivate)
                .attr('title', CSM.active_title);
            row.find('td.active .snippet-status')
            	.html(iconActive);
            row.find('td.active .csm_activate_deactivate')
                .attr('title', CSM.active_title);
            $('#activate-action span')
            	.removeClass('inactive')
            	.addClass('active')
            	.text(CSM.active)
            	.prepend(statusIconActive);
            $('#activate-action .csm_activate_deactivate').text(CSM.deactivate);
        } else {
            row.find('.row-actions .csm_activate_deactivate')
                .text(CSM.activate)
                .attr('title', CSM.deactive_title);
            row.find('td.active .snippet-status')
            	.html(iconInactive);
            row.find('td.active .csm_activate_deactivate')
                .attr('title', CSM.deactive_title);
            $('#activate-action span')
            	.removeClass('active')
            	.addClass('inactive')
            	.text(CSM.inactive)
            	.prepend(statusIconInactive);
            $('#activate-action .csm_activate_deactivate').text(CSM.activate);
        }
    }

    function getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
    }



    // Permalink slug
    $( '#titlediv' ).on( 'click', '.csm-edit-slug', function() {
		var i, 
			$el, revert_e,
			c = 0,
            slug_value = $('#editable-post-name').html(),
			real_slug = $('#post_name'),
			revert_slug = real_slug.val(),
			permalink = $( '#sample-permalink' ),
			permalinkOrig = permalink.html(),
			permalinkInner = $( '#sample-permalink a' ).html(),
            permalinkHref = $('#sample-permalink a').attr('href'),
			buttons = $('#csm-edit-slug-buttons'),
			buttonsOrig = buttons.html(),
			full = $('#editable-post-name-full');

		// Deal with Twemoji in the post-name.
		full.find( 'img' ).replaceWith( function() { return this.alt; } );
		full = full.html();

		permalink.html( permalinkInner );

		// Save current content to revert to when cancelling.
		$el = $( '#editable-post-name' );
		revert_e = $el.html();

		if ( typeof postL10n === 'undefined' || postL10n.cancel === '' || postL10n.ok === '' ) {
			postL10n = {
				ok     : wp.i18n.__( 'OK' ),
				cancel : wp.i18n.__( 'Cancel' ),
			}
		}

        buttons.html( '<button type="button" class="save button button-small">' + postL10n.ok + '</button> <button type="button" class="cancel button-link">' + postL10n.cancel + '</button>' );


        // Save permalink changes.
		buttons.children( '.save' ).click( function() {
			var new_slug = $el.children( 'input' ).val();

			if ( new_slug == $('#editable-post-name-full').text() ) {
				buttons.children('.cancel').click();
				return;
			}

			$.post(
				ajaxurl,
				{
					action: 'csm_permalink',
					code_id: $('#post_ID').val(),
					new_slug: new_slug,
                    permalink: permalinkHref, 
					filetype: $('#editable-post-name-full').data('filetype'), 
					csm_permalink_nonce: $('#csm-permalink-nonce').val()
				},
				function(data) {
					var box = $('#edit-slug-box');
					box.html(data);
					if (box.hasClass('hidden')) {
						box.fadeIn('fast', function () {
							box.removeClass('hidden');
						});
					}
				}
			);
		});

		// Cancel editing of permalink.
		buttons.children( '.cancel' ).click( function() {
			$('#view-post-btn').show();
			$el.html(revert_e);
			buttons.html(buttonsOrig);
			permalink.html(permalinkOrig);
			real_slug.val(revert_slug);
			$( '.csm-edit-slug' ).focus();
		});

		$el.html( '<input type="text" name="new_slug" id="new-post-slug" value="' + slug_value + '" autocomplete="off" />' ).children( 'input' ).keydown( function( e ) {
			var key = e.which;
			// On [enter], just save the new slug, don't save the post.
			if ( 13 === key ) {
				e.preventDefault();
				buttons.children( '.save' ).click();
			}
			// On [esc] cancel the editing.
			if ( 27 === key ) {
				buttons.children( '.cancel' ).click();
			}
		} ).keyup( function() {
			real_slug.val( this.value );
		}).focus();


    });


});

