(function($) {
    "use strict";
	
    if(typeof(window.dike_plc) != 'undefined' && !window.dike_plc('lcweb', pc_vars.dike_slug)) {
        console.error('PrivateContent - validate the license');
        return false;    
    }
    
    
	let pc_form_pag_acting 	    = false, // just one form pagination per time
        pc_reg_is_acting        = false, // know when registration form is being submitted
        pc_login_is_acting 		= false, // security var to avoid multiple calls
        pc_del_user_is_acting 	= false; // security var to avoid multiple calls
	

	// fields focus/blur tracking
	const focus_track_subj = '.pc_field_container input';
    
	$(document).on('focus', focus_track_subj, function(e) {
		$(this).parents('.pc_field_container').addClass('pc_focused_field');
		
	}).on('blur', focus_track_subj, function(e) {
		$(this).parents('.pc_field_container').removeClass('pc_focused_field');
	});
	
    
    
    // remove anti-cache parameter on page's loading
    if(window.location.href.indexOf('?pcac=') || window.location.href.indexOf('&pcac=')) {
        const arr = window.location.href.split('?');
        let params = (arr.length > 1) ? arr[1].split('&') : []; 
        
        params.some((param, index) => {
            if(param.indexOf('pcac=') !== -1) {
                params.splice(index, 1)        
            }
        });

        let new_url = arr[0];
        if(params.length) {
            new_url += '?'+ params.join('&');     
        }
        
        window.history.replaceState(null, null, new_url);      
    }
    
    const pre_timestamp    = (window.location.href.indexOf('?') !== -1) ? '&pcac=' : '?pcac=';
    
    
	
    
	
	/**************************
			 LOGIN
	**************************/	
	
    // handler
    $(document).on('submit', '.pc_login_form', function(e) {
        e.preventDefault();

        const $target_form = $(this),
              f_data = $target_form.serialize();

        if($target_form.find('.pc_spinner_btn').length) {
            return false;    
        }

        submit_login($target_form, f_data);
    });
	
	
	// handle form
	const submit_login = function($form, f_data, recaptcha_token) {
		if(pc_login_is_acting) {
            return false;    
        }
        
        if(!$form.find('input[name="pc_auth_username"]').val() || !$form.find('input[name="pc_auth_psw"]').val()) {
            return false;	
        }
        
        // anti bruteforce
        if(pc_vars.abfa_blocked) {
            $form.find('#pc_auth_message').empty().append('<div class="pc_error_mess"><span>'+ pc_vars.abfa_error_mess +'</span></div>');
            return false;
        }

        const forced_redirect = $form.data('pc_redirect');

        $form.find('.pc_auth_btn').addClass('pc_spinner_btn');
        $form.find('.pc_login_smalls').fadeTo(200, 0);
        $form.find('#pc_auth_message').empty();

        // using recaptcha?
        if($form.find('.pc_grecaptcha').length && typeof(recaptcha_token) == 'undefined') {

            // check if it hasn't been done yet
            if(typeof(grecaptcha) == 'undefined') {
                alert('recaptcha script not loaded');
            }

            grecaptcha.ready(function() {
                grecaptcha.execute( 
                    $form.find('.pc_grecaptcha').data('sitekey'), 
                    {
                        action: 'submit'
                    }
                ).then(function(token) {	
                    submit_login($form, f_data, token);
                    return true;
                });
            });
            return false;	
        }
        /////


        pc_login_is_acting = true;
        const recaptcha_param = (typeof(recaptcha_token) == 'undefined') ? '' : 'grecaptcha_token='+ recaptcha_token +'&'; 

        $.ajax({
            type    : "POST",
            url     : window.location.href,
            dataType: "json",
            data    : 
                "type=js_ajax_auth&" + 
                recaptcha_param +
                f_data,

            success: function(pc_data) {
                if(pc_data.resp == 'success') {
                    $form.find('#pc_auth_message').append('<div class="pc_success_mess"><span>'+ pc_data.mess +'<span></div>');
                    let red_url;
                    
                    if(typeof(forced_redirect) == 'undefined' || forced_redirect == 'refresh') {
                         red_url = pc_data.redirect;
                        
                        if(!pc_data.redirect || forced_redirect == 'refresh') {
                            red_url = window.location.href + pre_timestamp + new Date().getTime();
                        }
                    }
                    else {
                        red_url = forced_redirect;
                    }

                    // redirect
                    setTimeout(function() {
                        window.location.href = red_url;
                    }, 1000);
                }
                else {
                    $form.find('#pc_auth_message').empty().append('<div class="pc_error_mess"><span>'+ pc_data.mess +'</span></div>');	
                    
                    // anti bruteforce
                    if(pc_data.abfa) {
                        pc_vars.abfa_blocked = true;    
                    }
                }
            }
        })
        .fail(function(e) {
            if(e.status) {
                console.error(e);

                $form.find('#pc_auth_message').empty().append('<div class="pc_error_mess"><span>'+ pc_vars.ajax_failed_mess +'</span></div>');	
            }    
        })
        .always(function() {
            pc_login_is_acting = false;       
            
            // wait button to be re-resized
            setTimeout(function() {
                $form.find('.pc_login_smalls').fadeTo(200, 1);
            }, 500);
            
            // a bit of delay to display the loader
            setTimeout(function() {
                $form.find('.pc_auth_btn').removeClass('pc_spinner_btn');
            }, 370);
        });
	};
	
	
	/* manage checkbox status on "remember me" label click */
	$(document).on('click', '.pc_login_remember_me small', function() {
		$(this).parents('.pc_login_remember_me').find('.pc_checkbox').trigger('click');
	});
	
	
	/* check to avoid smalls over button on small screens */
	window.pc_login_smalls_display_check = function() {
		$('.pc_login_smalls').each(function() {
            
            const $form = $(this).parents('.pc_login_form'),
                  $smalls = $form.find('.pc_login_smalls > *');
			
            if($form.find('.pcma_psw_recovery_trigger').length) {
                return true;    
            }
            
            $form.removeClass('pc_mobile_login');
            
			// check smalls
			let smalls_w = 0;
			$smalls.each(function() {
                smalls_w = smalls_w + $(this).outerWidth(true);
            });
            
			($form.width() - $form.find('.pc_auth_btn').outerWidth() < (smalls_w + 10)) ? $form.addClass('pc_mobile_login') : $form.removeClass('pc_mobile_login');
        });
	};


	/* long labels check */
	window.pc_lf_labels_h_check = function() {
		$('.pc_login_form').not('.pc_lf_long_labels').each(function() {
			const user_h 	= $(this).find('label[for=pc_auth_username]').outerHeight(),
                  user_f_h 	= $(this).find('input[name="pc_auth_username"]').outerHeight(),
                  
                  psw_h 	= $(this).find('label[for=pc_auth_psw]').outerHeight(),
                  psw_f_h   = $(this).find('input[name="pc_auth_psw"]').outerHeight();
			
			((user_h > user_f_h || psw_h > psw_f_h) && $(window).width() >= 440) ? $(this).addClass('pc_lf_long_labels') : $(this).removeClass('pc_lf_long_labels');
        });	
	};
	
	
	// on resize
	let pc_is_resizing;
        
    $(window).resize(function() {
        if(pc_is_resizing) {
            clearTimeout(pc_is_resizing);
        }

        pc_is_resizing = setTimeout(function() {
            pc_login_smalls_display_check();
            pc_lf_labels_h_check();
        }, 50); 
    });
	
	
	
	
	/**************************
           USER DELETION
	**************************/
	
	// handlers
	$(document).ready(function($) {
		$(document).on('click', '.pc_del_user_btn', function(e) {
			e.preventDefault();
				
			const $target_form = $(this).parents('form');
			pc_del_user($target_form);
		});
		$(document).on('keyup', '.pc_del_user_form input', function(e){
			if(event.keyCode === 13){
				const $target_form = $(this).parents('form');
				pc_del_user($target_form);
                
                e.preventDefault();
                return false;
			}
		});
	});
	
	
	// handle form
	const pc_del_user = function($form) {
		const val = $form.find('input[name=pc_del_user_psw]').val();	
	
		if($.trim(val) && !pc_del_user_is_acting) {
			
			pc_del_user_is_acting = true;	
			const redirect = $form.data('pc_redirect');
			
			$form.find('.pc_del_user_btn').addClass('pc_spinner_btn');
			$form.find('.pc_user_del_message').empty();
			
			$.ajax({
				type: "POST",
				url: window.location.href,
				dataType: "json",
				data: {
					type 		: 'pc_del_user_ajax',
					pc_ud_psw	: $form.find('input[name=pc_del_user_psw]').val()				
				},
				success: function(pc_data){

					if(pc_data.resp == 'success') {
						$form.find('.pc_user_del_message').append('<div class="pc_success_mess"><span>'+ pc_data.mess +'<span></div>');

						// redirect
						setTimeout(function() {
				            window.location.href = redirect;
						}, 1000);
					}
					else {
						$form.find('.pc_user_del_message').empty().append('<div class="pc_error_mess"><span>'+ pc_data.mess +'</span></div>');	
					}
				}
			})
            .fail(function(e) {
                if(e.status) {
                    console.error(e);

                    $form.find('.pc_user_del_message').empty().append('<div class="pc_error_mess"><span>'+ pc_vars.ajax_failed_mess +'</span></div>');	
                }
            })
            .always(function() {
                pc_del_user_is_acting = false;    
                
                // a bit of delay to display the loader
                setTimeout(function() {
                    $form.find('.pc_del_user_btn').removeClass('pc_spinner_btn');
                }, 370);
            });
		}
	};
	
	
	
	
	/**************************
			 LOGOUT
	**************************/
		 
	$(document).on('click', '.pc_logout_btn', function(e) {	
		e.preventDefault();
		
		const forced_redirect = $(this).data('pc_redirect');
		$(this).addClass('pc_spinner_btn');
		
		$.ajax({
			type: "POST",
			url: window.location.href,
			data: "type=pc_logout",
			success: function(response){
				let resp = $.trim(response);
				
				if(typeof(forced_redirect) == 'undefined') {
					window.location.href = (!resp) ? window.location.href = window.location.href + pre_timestamp + new Date().getTime() : resp;
				}
				else {
                    if(forced_redirect == 'refresh') {
                        window.location.href = window.location.href + pre_timestamp + new Date().getTime();
                    } else {
                        window.location.href = forced_redirect;    
                    }
                }
			},
            fail: function(e) {
                if(e.status) {
                    console.error(e);

                    alert(pc_vars.ajax_failed_mess);	
                }
            }
		})
        .fail(function(e) {
            if(e.status) {
                    console.error(e);

                    alert(pc_vars.ajax_failed_mess);	
                }
        });
	});
	
	
			
		
	/**************************
		   REGISTRATION
	**************************/	
	
	// handlers
	$(document).ready(function($) {
		$('body, form').on('click', '.pc_reg_btn', function(e) {	
			e.preventDefault();
		});
        
		$('body, form').on('click', '.pc_reg_btn:not(.pc_spinner_btn)', function(e) {	
			const $target_form = $(this).parents('form').first(),
                  f_data = $target_form.serialize();
	
			submit_registration($target_form, f_data);
		});
        
		$(document).on('keyup', '.pc_registration_form input, .pc_registration_form textarea', function(e) {
			if(event.keyCode === 13) { // enter key
				const $target_form = $(this).parents('form');
				
				// maintain textarea line breaks
				$target_form.find('textarea').each(function() {
					$(this).val( $(this).val().replace(/\r\n|\r|\n/gi, "<br />") );
				});
				
				const f_data = $target_form.serialize();
				
				// restore textarea values
				$target_form.find('textarea').each(function() {
					$(this).val( $(this).val().replace(/<br \/>/gi,"\n") );
				});
				
				$(this).parents('.pc_registration_form').find('.pc_reg_btn').trigger('click');
                
                e.preventDefault();
                return false;
			}
		});
	});
	
	
	// handle form
	const submit_registration = function($form, f_data, recaptcha_token) {
		if(pc_reg_is_acting) {
            return false;
        }
			
		// HTML5 validate first
		if(!$form.pc_validate_form_fieldset()) {
			return false;	
		}
		
		$form.find('.pc_reg_btn').addClass('pc_spinner_btn');
		
		
		const fid     = $form.attr('id'),	
              cc      = (typeof($form.data('pc_cc')) == 'undefined') ? '' : $form.data('pc_cc'),
              redir   = $form.data('pc_redirect');
			
		// using recaptcha?
		if($form.find('.pc_grecaptcha').length && typeof(recaptcha_token) == 'undefined') {

			// check if it hasn't been done yet
			if(typeof(grecaptcha) == 'undefined') {
				alert('recaptcha script not loaded');
			}
			
			grecaptcha.ready(function() {
				grecaptcha.execute( $form.find('.pc_grecaptcha').data('sitekey'), {action: 'submit'}).then(function(token) {	
					submit_registration($form, f_data, token);
					return true;
				});
			});
			return false;	
		}
		/////
		

		pc_reg_is_acting = true;
		$form.find('.pc_form_response').empty();
		
		// recaptcha token
		const recaptcha_param = (typeof(recaptcha_token) == 'undefined') ? '' : '&grecaptcha_token='+recaptcha_token; 
		
		const data =
			'type=pc_registration'+
			'&form_id=' + $form.data('form-id') +
			'&pc_cc=' + cc +
			recaptcha_param +
			'&' + $form.serialize()
		;
		$.ajax({
			type: "POST",
			url: window.location.href,
			data: data,
			dataType: "json",
			success: function(pc_data){
				if(pc_data.resp == 'success') {
                    
                    $(document).trigger('pc_successful_registr', [$form]);
					$form.find('.pc_form_response').append('<div class="pc_success_mess"><span>'+ pc_data.mess +'<span></div>');
					
                    if(pc_vars.hide_reg_btn_on_succ) {
                        $form.find('.pc_reg_btn').remove();    
                    }
                    
					//// redirect
					let redirect;
                    
                    // special case for premium plans add-on - overrides any other case
					if(
						(typeof(redir) != 'undefined' && redir.substr(0,2) != 'f-') &&
						pc_data.redirect && 
						pc_data.redirect.indexOf('pay_for_order=true') !== -1
					) {
						redirect = pc_data.redirect	
					}
					else {
						if(typeof(redir) != 'undefined') {
							redirect = (redir.substr(0,2) == 'f-') ? redir.substr(2) : redir;
						} else {
							redirect = pc_data.redirect;	
						}

						if(redirect == 'refresh') {
                            redirect = window.location.href;
                        }
					}
                    
					if(redirect) {
						setTimeout(function() {
                            window.location.href = redirect;
						}, 1000);	
					}
				}
				else {
					$form.find('.pc_form_response').append('<div class="pc_error_mess">'+ pc_data.mess +'</div>');
					
					// if exist recaptcha - reload
					if( $('#recaptcha_response_field').length) {
						Recaptcha.reload();	
					}
				}	
			}
		})
        .fail(function(e) {
            if(e.status) {
                console.error(e);

                $form.find('.pc_form_response').append('<div class="pc_error_mess">'+ pc_vars.ajax_failed_mess +'</div>');
            }
        })
        .always(function() {
            pc_reg_is_acting = false;    
            
            // a bit of delay to display the loader
            setTimeout(function() {
                $form.find('.pc_reg_btn').removeClass('pc_spinner_btn');
            }, 370);
        });
	};
	
	
	
	// given the form object - returns the recaptcha widget ID
	const get_recaptcha_widget_id = function($form) {
		var gre_id_arr = $form.find('.g-recaptcha-response').attr('id').split('-');
		return (gre_id_arr.length == 4) ? parseInt(gre_id_arr[3], 10) : 0;	
	};	

    
    
    // mail-only registration - copy the email field in the username one
    $(document).ready(function($) {
        $(document).on('keyup input', '.pc_onlymail_reg .pc_f_email input', function() {
            
            const $username_f = $(this).parents('.pc_registration_form').find('.pc_f_username input');
            $username_f.val( $(this).val() );
        });    
    });
    
    
	
	///////////////////////////////////
	
	
	
    /* LC Select setup */
    window.pc_lc_select_setup = function() {
        if(!$('.pc_multiselect, .pc_singleselect').length) {
            return true;    
        }
        if(typeof(lc_select) == 'undefined') {
            console.error('pvtContent: LC select script not found');
            return false;  
        }
           
        new lc_select('.pc_multiselect select, .pc_singleselect select', {
            wrap_width      : '100%',
            addit_classes   : ['lcslt-pc-skin'],
            pre_placeh_opt  : true, 
            labels : [ 
                pc_vars.lcslt_search,
                pc_vars.lcslt_add_opt,
                pc_vars.lcslt_select_opts +' ..',
                '.. '+ pc_vars.lcslt_no_match +' ..',
            ],
        });
    };
	$(document).ready(function() {
		pc_lc_select_setup();
	});
	
	
	
	/* setup custom checkboxes */
	window.pc_checkboxes_setup = function() {
        lc_switch('.pc_single_check input[type=checkbox], .pc_disclaimer_f input[type=checkbox]', {
            on_txt      : 'YES',
            off_txt     : 'NO',  
            compact_mode: true,
        });
        
		$('.pc_login_form input[type=checkbox], .pc_check_wrap input[type=checkbox], .pc_check_wrap input[type=radio], .pc_manag_check input[type=checkbox], .pc_manag_check input[type=radio]').each(function() {
			if($(this).hasClass('pc_checkboxed')) {
                return true;
            }
			
			const $subj          = $(this),
                  checked        = ($subj.is(':checked')) ? 'pc_checked' : '',
                  
                  is_radio_class = ($subj.attr('type') == 'radio') ? 'pc_radio_cb' : '',
                  check_content  = (is_radio_class) ? '&bull;' : '&#10003;';

			$subj
                .addClass('pc_checkboxed')
                .after('<div class="pc_checkbox '+ is_radio_class +' '+ checked +'" data-name="'+ $subj.attr('name') +'" data-val="'+ $subj.val() +'"><span>'+ check_content +'</span></div>');
		});
	};
	$(document).ready(function() {
		pc_checkboxes_setup();
	});
    
    
    // handle click on PC custom checkboxes
    $(document).on('click', 'div.pc_checkbox', function() {
        const $subj     = $(this),
              type      = ($subj.hasClass('pc_radio_cb')) ? 'radio' : 'checkbox', 
              $input = $subj.prev('input[type="'+ type +'"][name="'+ $subj.data('name') +'"][value="'+ $subj.data('val') +'"]');

        if(!$input.length) {
            return true;
        }

        if($subj.hasClass('pc_checked')) {
            if(type == 'radio') {
                return false;    
            } else {
                $subj.removeClass('pc_checked');        
            }
        }
        else {
            if(type == 'radio') {
                $subj.parents('.pc_check_wrap').find('.pc_checkbox').removeClass('pc_checked');    
                $subj.parents('.pc_check_wrap').find('.pc_checkboxed').each(function() {
                    this.checked = false;    
                });  
            }
            
            $subj.addClass('pc_checked');        
        }

        $input[0].checked = !$input[0].checked;
        $input.trigger('input');
    });
    
    
    // use custom checkbox on label's click
    $(document).on('click', '.pc_check_label', function() {
        $(this).prev('.pc_checkbox').trigger('click');    
    });
    
	

	
	
	/* fluid forms - columnizer */
	window.pc_fluid_form_columnizer = function() {
		const threshold = (typeof(pc_vars) == 'object' && typeof(pc_vars.fluid_form_thresh) != 'undefined') ? parseInt(pc_vars.fluid_form_thresh, 10) : 370;
        
        document.querySelectorAll('.pc_fluid_form').forEach($form => {
            
            const computedStyle = getComputedStyle($form),
                  form_w        = $form.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight), 
                  min_col_w     = 230;

            let cols = 1; 
            while(Math.ceil(form_w / cols) > threshold && Math.ceil(form_w / (cols + 1)) > min_col_w) {
                cols++;            
            }

            $form.querySelectorAll('fieldset').forEach($fieldset => {
                $fieldset.style.gridTemplateColumns = 'repeat('+ cols +', 1fr)';
            });
            
            $form.querySelectorAll('.pc_fullw_field').forEach($fullw => {
                $fullw.style.gridColumn = '1 / span '+ cols;
            });
            
            $form.classList.add('pc_fluid_form_columnized');
            $form.setAttribute('data-col', cols);
            
            // trigger event to allow custom add-on events on columnification
            const event = new CustomEvent("pc_form_columnized", {detail: {
                form: $form,
                cols: cols,
            }});
            document.dispatchEvent(event);
        });
	};
    pc_fluid_form_columnizer();
    
    
    let pc_ffc;
    $(window).resize(function() { 
        if(pc_ffc) {
            clearTimeout(pc_ffc);
        }
        pc_ffc = setTimeout(function() {
            pc_fluid_form_columnizer();
        }, 50);
	});
	
    
    
    
    /* revealable password */
    if(typeof(pc_vars.revealable_psw) == 'undefined' || pc_vars.revealable_psw) {
        $(document).on('click', '.pc_f_psw .pc_field_icon, .pc_lf_psw .pc_field_icon', function() {
            
            const vis_class = 'pc_visible_psw',
                  $field    = $(this).parents('.pc_field_container').find('input'),
                  $icon     = $(this).find('i');
            
            if($field.hasClass(vis_class)) {
                $field.removeClass(vis_class);
                $field.attr('type', 'password');
                $icon.attr('class', 'far fa-eye');
            }
            else {
                $field.addClass(vis_class);   
                $field.attr('type', 'text');
                $icon.attr('class', 'far fa-eye-slash');
            }
        });            
    }
    
    

	

	/**************************
		  FORM PAGINATION
	**************************/	
	
    // paginate on buttons click
	$(document).on('click', '.pc_pag_btn', function(e) {
        const $form = $(this).parents('form').first();
        
        let curr_pag = parseInt($form.data('form-pag'), 10),
            new_pag = ($(e.target).hasClass('pc_pag_next')) ? curr_pag + 1 : curr_pag - 1;
        
        paginate_form($form, new_pag);
    });
    
    
    // paginate on progres bar click
	$(document).on('click', '.pc_form_pag_progress span:not(.pc_fpp_current)', function(e) {
        const $form = $(this).parents('form').first();
        
        let curr_pag = parseInt($form.data('form-pag'), 10),
            new_pag = parseInt($(this).data('pag'), 10);
        
        paginate_form($form, new_pag);
    });
    
    
    // perform form pagination
	const paginate_form = function($form, new_pag) {
        if(pc_form_pag_acting || pc_reg_is_acting) {
            return true;
        }

        let curr_pag = parseInt($form.data('form-pag'), 10);
        const tot_pag = $form.find('fieldset').length;
        
        if(new_pag < 0 || new_pag > tot_pag) {
            return false;    
        }
        
        const $new_fieldset = $form.find('fieldset.pc_f_pag_'+new_pag),
              $curr_fieldset = $form.find('fieldset.pc_f_pag_'+curr_pag);

        // HTML5 validate first
        if(!$form.pc_validate_form_fieldset()) {
            $("body, html").animate({
                scrollTop: ($form.find('fieldset').not('.pc_hidden_fieldset').find('.pc_field_error').first().offset().top - 50)
            }, 500);

            return true;	
        }

        // apply
        pc_form_pag_acting = true;

        $form.css('height', $form.outerHeight());
        $form.data('form-pag', new_pag);
        $form.find('> *').not('script, .pc_form_pag_progress').animate({opacity : 0}, 150);;

        
        // pagination progress bar? adjust
        if($form.find('.pc_form_pag_progress').length) {
            $form.find('.pc_form_pag_progress span').removeClass('pc_fpp_current pc_fpp_active');
            
            for(let c=1; c <= new_pag; c++) {
                $form.find('.pc_form_pag_progress span[data-pag="'+ c +'"]').addClass('pc_fpp_active');       
            }
            
            $form.find('.pc_form_pag_progress span[data-pag="'+ new_pag +'"]').addClass('pc_fpp_current');  
            
            const progressbar_w = (100 / (tot_pag - 1)) * (new_pag - 1);
            $form.find('.pc_form_pag_progress i').css('width', progressbar_w + '%');
        }
        
        
        // apply
        setTimeout(function() {
            $new_fieldset.removeClass('pc_hidden_fieldset');

            const new_form_h = ($form.outerHeight() - $curr_fieldset.outerHeight(true)) + $new_fieldset.outerHeight(true);  
            $form.animate({height : new_form_h}, 300);

            $curr_fieldset.addClass('pc_hidden_fieldset');
            (new_pag == tot_pag) ? $form.find('.pc_pag_submit').show() : $form.find('.pc_pag_submit').hide();	

            setTimeout(function() {	
                $form.find('fieldset, .pc_pag_submit, .pc_pag_btn, .pc_form_response').animate({opacity : 1}, 150);

                // next btn and submit visibility
                if(new_pag == tot_pag) {
                    $form.find('.pc_pag_next').css('visibility', 'hidden');
                } else {
                    $form.find('.pc_pag_next').css('visibility', 'visible');	
                }

                // prev btn visibility
                if(new_pag < 2) {
                    $form.find('.pc_pag_prev').css('visibility', 'hidden');	
                } else {
                    $form.find('.pc_pag_prev').css('visibility', 'visible');	
                }

                $form.css('height', 'auto');
                pc_form_pag_acting = false;
            }, 350);
        }, 300);        
    };
    
    
	
	

	/**************************
		  FORM VALIDATION
	**************************/	
	
	
	// validate fields using HTML5 engine
	$.fn.pc_validate_fields = function() {
		if(typeof(pc_vars.html5_validation) == 'undefined' || !pc_vars.html5_validation) {
            return true;
        }
		
		// if browser doesn't support validation - ignore
		if(!(typeof document.createElement( 'input' ).checkValidity == 'function')) {
            return true;
        }
		
		let errorless = true,
            multicheck_objs = {}; // store multi-checkbox wrapper's obj to be validated after
		 
		$(this).each(function() {
            if(!$(this).parents('section').first().is(':visible')) {
                return true;    
            }
            
			// multicheck element
			if($(this).parents('.pc_check_wrap').length && $(this).parents('section').find('.pc_req_field').length) {
				multicheck_objs[ $(this).attr('name') ] = $(this).parents('section.pc_form_field');
				return true;	
			}
			
			// avoid select search field
			if($(this).is('input') && typeof($(this).attr('name')) == 'undefined') {
				return true;	
			}
			
			// remove old errors
			$(this).parents('section.pc_form_field, section.pc_disclaimer_f').find('.pc_field_error').remove();
			
			// validate
            if( !$(this)[0].checkValidity() ) {

				errorless = false;
				let mess = $(this)[0].validationMessage; 
				
				// remove ugly point at the end
				if( mess.substr(mess.length - 1) == '.') {
					mess = mess.substr(0, (mess.length - 1));
				}
				
				$(this).parents('section.pc_form_field, section.pc_disclaimer_f').prepend('<div class="pc_field_error">'+ mess +'</div>');	
			}
        });
		

		// validate multichecks
		$.each(multicheck_objs, function(i, $wrap) {
			var show_mess = true;
			$wrap.find('.pc_field_error').remove();
			
			$wrap.find('input[type=checkbox]').each(function() {
				if(this.checked) {
					show_mess = false;
					return false;	
				}
			});
			
			if(show_mess) {
				// generate message to append
				var mess = $('<input type="checkbox" name="" required="required" />')[0].validationMessage;
				
				// remove ugly point at the end
				if( mess.substr(mess.length - 1) == '.') {
					mess = mess.substr(0, (mess.length - 1));
				}
				
				$wrap.prepend('<div class="pc_field_error">'+ mess +'</div>');
                errorless = false;
			}
		});
        
		return errorless;
	};
	
    
	// shortcut to validate active fieldset fields
	$.fn.pc_validate_form_fieldset = function() {
		return $(this).find('fieldset').not('.pc_hidden_fieldset').find('input, select, textarea').pc_validate_fields();
	};
	
	
	// re-validate on field change
	$(document).ready(function($) {
		$('body, form').on('change keyup input', '.pc_form_field input, .pc_form_field select, .pc_form_field textarea, .pc_disclaimer_f input', function() {
			
			if($(this).pc_validate_fields()) {
				$(this).parents('.pc_form_field').find('.pc_field_error').pc_close_tooltip();	
			}
		});
	});
	
	
	// close field error tooltip
	$.fn.pc_close_tooltip = function() {
		var $subj = $(this);
		$subj.addClass('pc_fe_closing');
		
		setTimeout(function() {
			$subj.remove();
		}, 310);
	};
	
	// close form tooltips on single tooltip click
	$(document).ready(function($) {
		$('body, form').on('click', '.pc_field_error', function() {
			$(this).parents('form').find('.pc_field_error').each(function() {
				$(this).pc_close_tooltip();
			});
		});
	});
	
	

    
	/**************************
			LIGHTBOX
	**************************/	
	
	$(document).ready(function($) {
		if(typeof(pc_lb_classes) == 'undefined' || typeof($.magnificPopup) == 'undefined') {
		   return false;	
        }
            
        // persistent check to preload contents
        var pc_lb_load_intval = setInterval(function() {
            let to_load = [];

            $.each(pc_lb_classes, function(i, v) {
                const id = v.replace('.pc_lb_trig_', '');
                if($.inArray(id, pc_ready_lb) !== -1) {
                    return true;
                }

                // ajax call to get
                if($(v).length) {
                    to_load.push(id);
                    pc_ready_lb.push(id);
                }
            });

            if(to_load.length) {

                // just one ajax call to get codes
                var data = {
                    type 	: 'pc_lightbox_load',
                    ids		: to_load
                };
                $.ajax({
                    type: "POST",
                    url: window.location.href,
                    data: data,
                    success: function(data){
                        $('#pc_lb_codes').append(data);
                    },
                    fail: function(e) {
                        if(e.status) {
                            console.error('pvtContent lightbox codes loading error', e);
                        }
                    },
                });
            }

            // if loaded every lightbox - end interval 
            if(pc_lb_classes.length == pc_ready_lb.length) {
                clearInterval(pc_lb_load_intval);	
            }
        }, 200);



        // track lightbox triggers click
        $.each(pc_lb_classes, function(i,v) {
            const lb_id = v.replace('.pc_lb_trig_', '');

            $(document).on('click', v, function(e) {
                if(!$('.pc_lb_'+lb_id).length) {
                    return true;
                }
                e.preventDefault();

                $.magnificPopup.open({
                    items : {
                        src: '.pc_lb_'+lb_id,
                        type: 'inline'
                    },
                    mainClass			: 'pc_lightbox',
                    closeOnContentClick	: false,
                    closeOnBgClick		: false, 
                    preloader			: false,
                    modal				: ($(this).hasClass('pc_modal_lb')) ? true : false,
                    focus				: false,
                    removalDelay		: 300,
                    callbacks: {
                        open: function() {
                            pc_lc_select_setup();
                            pc_checkboxes_setup();
                            pc_fluid_form_columnizer();

                            // if last element is a form - remove bottom margin
                            if($('.pc_lightbox_contents > *').eq(-2).hasClass('pc_aligned_form')) {
                                $('.pc_lightbox_contents > *').eq(-2).find('form').css('margin-bottom', 0);
                            }

                            // allow other plugins to hook here
                            $(document).trigger('pc_opening_lightbox');
                        }
                    }
                });

                return false;
            });
        });	
        
        
        
        // fix MagPop issue focusing LC Select search field
        $.magnificPopup.instance._onFocusIn = function(e) {
            if($(e.target).is('input[name="lcslt-search"]')) {
                return true;
            } 
            
            $.magnificPopup.proto._onFocusIn.call(this, e);
        };
        
	});
	
	
})(jQuery);
