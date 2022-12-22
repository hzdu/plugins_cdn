(function($) { 
    "use strict";    

	// creates the plugin
	tinymce.PluginManager.add('PrivateContent', function( editor, url ) {

        // Add a button that opens a window
        editor.addButton('pc_btn', {
            text		: false,
			title		: 'PrivateContent',
            icon		: 'pc_btn',  // css class  mce-i-pc_btn
            onclick		: function() {

				$.magnificPopup.open({
					items : {
						src: '#pvtcontent_sc_wizard > *',
						type: 'inline'
					},
					mainClass	: 'pc_sc_wizard_lb',
					closeOnContentClick	: false,
					closeOnBgClick		: false, 
					preloader	: false,
					callbacks	: {
					  beforeOpen: function() {
						if($(window).width() < 800) {
						  this.st.focus = false;
						}
					  },
					  open : function() {
						pc_live_lc_switch();
						pc_lc_select();
						
						
						// tabify through select
						var lb_class = ".pc_sc_wizard_lb"
						
						$(lb_class+' .pc_scw_choser option').each(function() {
							var val = $(this).attr('value');
							
							if(!$(this).is(':selected')) {
								$(lb_class +' '+ val).hide();	
							} else {
								$(lb_class +' '+ val).show();		
							}
						});
						
						// on select change
						$(lb_class).on('change', '.pc_scw_choser', function(e) {
							e.preventDefault();
							
							$(lb_class+' .pc_scw_choser option').each(function() {
								var val = $(this).attr('value');
							
								if(!$(this).is(':selected')) {
									$(lb_class +' '+ val).hide();	
								} else {
									$(lb_class +' '+ val).show();		
								}
							});
						});
					  }
					}
				});
				$(document).on('click', '.mfp-wrap.pc_sc_wizard_lb', function(e) {
					if($(e.target).hasClass('mfp-container')) {
						$.magnificPopup.close();
					}
				});
            }

        });
	});
	



	////////////////////////////////////////////////////////
	///// private block pvt-content
	
	// toggle "block" field
	$(document).on("change", "#pc_sc_allow", function() {
		var val = ($(this).val() !== null && typeof($(this).val()) == "object") ? $(this).val() : [];
		var unlogged_chosen = false;

		// if ALL is selected, discard the rest
		if($.inArray("all", val) !== -1) {
			$(this).find("option").prop("selected", false);
			$(this).find(".pc_all_field").prop("selected", true);
			
			val = ["all"];
            
            const resyncEvent = new Event('lc-select-refresh');
            $('.pc_scw_field_dd #pc_sc_allow')[0].dispatchEvent(resyncEvent);
		}
		
		// if only UNLOGGED is selected, hide block
		else if($.inArray("unlogged", val) !== -1) {
			if(val.length == 1 && val[0] == "unlogged") { 
				unlogged_chosen = true;
			}
		}
		
		// toggle block field
		if(unlogged_chosen || !val.length) {
			$('.pc_sc_block_wrap').slideUp(200);	
		} else {
			$('.pc_sc_block_wrap').slideDown(200);	
		}
	});
	
	
	// hide message text if no warning is shown
	$(document).on('lcs-statuschange', '#pg-hide-warning', function() {
		if( $(this).is(':checked') ) {
			$('.pc_scw_wb_row').slideUp();
		} else {
			$('.pc_scw_wb_row').slideDown();	
		}
	});
	

	// handles the click event of the submit button
	$(document).on('click', '#pg-pvt-content-submit', function() {
		var type = $('#pc_sc_type').val();
		var sc = '[pc-pvt-content';
		
		// one value is required
		if($('#pc_sc_allow').val() === null) {
			alert('Choose who can access contents');	
			return false;
		}
		

		// allowed
		sc += ' allow="' + $('#pc_sc_allow').val().join(',') + '"';
		
		// blocked
		if($('#pc_sc_block').val() !== null) {
			sc += ' block="' + $('#pc_sc_block').val().join(',') + '"'; 
		}
		
		// show warning box
		if( $('#pg-hide-warning').is(':checked') ) {
			sc += ' warning="0"';	
		} else {
			sc += ' warning="1"';	
		}
		
		// custom message
		if( !$('#pg-hide-warning').is(':checked') && $('#pg-text').val()) {
			sc += ' message="' + $('#pg-text').val() + '"';
		}
		
		// custom login button value
		if( !$('#pg-hide-warning').is(':checked') && $('#pc_sc_login_lb').val()) {
			sc += ' login_lb="' + $('#pc_sc_login_lb').val() + '"';
		}
		
		// custom registration button value
		if( !$('#pg-hide-warning').is(':checked') && $('#pc_sc_registr_lb').val()) {
			sc += ' registr_lb="' + $('#pc_sc_registr_lb').val() + '"';
		}
		

		// inserts the shortcode into the active editor
		tinyMCE.activeEditor.execCommand('mceInsertContent', 0, sc + '][/pc-pvt-content]');
		$.magnificPopup.close();
	});
	
	
	
	
	////////////////////////////////////////////////////////
	///// registration-form
	$(document).on('click', '#pg-regform-submit', function() {	
		var sc = '[pc-registration-form';
		
		var form_id = $('#pc_sc_rf_id').val();
		var layout = $('#pc_sc_rf_layout').val();
		var cats = $('#pc_sc_rf_cat').val();
		var redir = $('#pc_sc_rf_redirect').val()
		
		// form id
		if(!form_id) {
			alert("No registration form found");	
			return false;
		}
		else {
			sc += ' id="' + form_id + '"';	
		}
		
		// layout
		if(layout) {
			sc += ' layout="' + layout + '"';		
		}
		
		// cats
		if(cats) {
			sc += ' custom_categories="' + cats.join(',') + '"';			
		}
		
		// redirect
		if($.trim(redir)) {
			sc += ' redirect="' + redir + '"';			
		}
		
		// alignment
		if($('#pc_sc_rf_align').val() != 'center') {
			sc += ' align="' + $('#pc_sc_rf_align').val() + '"';		
		}

		// inserts the shortcode into the active editor
		tinyMCE.activeEditor.execCommand('mceInsertContent', 0, sc + ']');
		$.magnificPopup.close();
	});
	
	
	
	
	////////////////////////////////////////////////////////
	///// login-form
	$(document).on('click', '#pg-loginform-submit', function() {	
		var sc = '[pc-login-form]';
		
		// custom redirect
		if($('#pc_sc_lf_redirect').val()) {
			sc = sc.replace(']', ' redirect="'+ $('#pc_sc_lf_redirect').val() +'"]');	
		}
		
		// alignment
		if($('#pc_sc_lf_align').val() != 'center') {
			sc = sc.replace(']', ' align="'+ $('#pc_sc_lf_align').val() +'"]');	
		}
		
		tinyMCE.activeEditor.execCommand('mceInsertContent', 0, sc);
		$.magnificPopup.close();
	});
	
	
	
	
	////////////////////////////////////////////////////////
	///// logout-box
	$(document).on('click', '#pg-logoutbox-submit', function() {	
		var sc = '[pc-logout-box]';
		
		if($('#pc_sc_lb_redirect').val()) {
			sc = sc.replace(']', ' redirect="'+ $('#pc_sc_lb_redirect').val() +'"]');	
		}
		
		tinyMCE.activeEditor.execCommand('mceInsertContent', 0, sc);
		$.magnificPopup.close();
	});
	
	
	
	
	////////////////////////////////////////////////////////
	///// user-del-box
	$(document).on('click', '#pg-userdel-submit', function() {	
		var sc = '[pc-user-del-box]';
		
		// alignment
		if($('.pc_sc_wizard_lb [name=pc_sc_udel_align]') != 'center') {
			sc = sc.replace(']', ' align="'+ $('.pc_sc_wizard_lb [name=pc_sc_udel_align]').val() +'"]');	
		}
		
		// custom redirect
		if($('.pc_sc_wizard_lb [name=pc_sc_udel_redirect]').val()) {
			sc = sc.replace(']', ' redirect="'+ $('.pc_sc_wizard_lb [name=pc_sc_udel_redirect]').val() +'"]');	
		}

		tinyMCE.activeEditor.execCommand('mceInsertContent', 0, sc);
		$.magnificPopup.close();
	});
	
	
	///////
	
	// lc select
	const pc_lc_select = function() {
		new lc_select('.pc_sc_wizard_lb .pc_lc_select', {
            wrap_width : '100%',
            addit_classes : ['lcslt-lcwp', 'pc_scw_field_dd'],
        });
	};
	
	// lc switch
	const pc_live_lc_switch = function() {
        lc_switch('.pc_sc_wizard_lb .pc_lc_switch', {
            on_txt      : 'YES',
            off_txt     : 'NO',   
        });
	};
	
})(jQuery); 