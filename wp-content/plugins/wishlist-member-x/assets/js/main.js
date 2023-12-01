/**
 * main.js
 * Main UI Javascript
 * Anything that can be used across multiple screens must be put here
 */

var $ = jQuery.noConflict();

// capture clicks on href=# and preventDefault behavior
function capture_hash_clicks() {
	var a = 'a[href="#"]';
	var ns = '.capture_hash_clicks';

	$(a).off(ns);
	$('body').off('.capture_hash_clicks');

	$('body').on('click.' + ns, a, function(e) {
		e.preventDefault();
	});
	$(a).on('click.' + ns, function(e) {
		e.preventDefault();
	});
}

function get_merge_codes(add,noempty) {
	if(typeof get_merge_codes.core_merge_codes != 'object') {
		get_merge_codes.core_merge_codes = {
			name : wp.i18n.__( 'Common', 'wishlist-member' ),
			options : [
				{value : '', text : ''},
				{value : '[firstname]', text : wp.i18n.__( 'First Name', 'wishlist-member' )},
				{value : '[lastname]', text : wp.i18n.__( 'Last Name', 'wishlist-member' )},
				{value : '[email]', text : wp.i18n.__( 'Email', 'wishlist-member' )},
				{value : '[username]', text : wp.i18n.__( 'Username', 'wishlist-member' )},
				{value : '[memberlevel]', text : wp.i18n.__( 'Membership Level', 'wishlist-member' )},
				{value : '[loginurl]', text : wp.i18n.__( 'Login URL', 'wishlist-member' )}
			]
		};
	}
	if(typeof get_merge_codes.other_merge_codes != 'object') {
		get_merge_codes.other_merge_codes = {
			name : wp.i18n.__( 'Other', 'wishlist-member' ),
			options : [
				{value : '[wlm_website]', text : wp.i18n.__( 'Website URL', 'wishlist-member' )},
				// {value : '[wlm_aim]', text : 'AOL Instant Messenger'},
				// {value : '[wlm_yim]', text : wp.i18n.__( 'Yahoo Messenger', 'wishlist-member' )},
				// {value : '[wlm_jabber]', text : wp.i18n.__( 'Jabber', 'wishlist-member' )},
				{value : '[wlm_biography]', text : wp.i18n.__( 'Biography', 'wishlist-member' )},
				{value : '[wlm_company]', text : wp.i18n.__( 'Company', 'wishlist-member' )},
				{value : '[wlm_address]', text : wp.i18n.__( 'Address', 'wishlist-member' )},
				{value : '[wlm_address1]', text : wp.i18n.__( 'Address 1', 'wishlist-member' )},
				{value : '[wlm_address2]', text : wp.i18n.__( 'Address 2', 'wishlist-member' )},
				{value : '[wlm_state]', text : wp.i18n.__( 'State', 'wishlist-member' )},
				{value : '[wlm_city]', text : wp.i18n.__( 'City', 'wishlist-member' )},
				{value : '[wlm_zip]', text : wp.i18n.__( 'Zip', 'wishlist-member' )},
				{value : '[wlm_country]', text : wp.i18n.__( 'Country', 'wishlist-member' )},
			]
		};
	}

	if(typeof get_merge_codes.custom_fields != 'object') {
		get_merge_codes.custom_fields = {}
		if(WLM3VARS.custom_fields_merge_codes.length) {
			get_merge_codes.custom_fields = {
				name : wp.i18n.__( 'Custom Fields', 'wishlist-member' ),
				options: WLM3VARS.custom_fields_merge_codes.map(function(x) { return {value: x, text: x} })
			}
		}
	}

	var extra = {options : []};
	if(typeof add == 'object' && add != null) {
		add.forEach(function(i) {
			extra.options.push(i);
		});
	}

	var cmc = JSON.parse(JSON.stringify(get_merge_codes.core_merge_codes))
	if(noempty) {
		cmc.options.splice(0,1);
	}
	return [cmc,extra,get_merge_codes.other_merge_codes,get_merge_codes.custom_fields];
}

function calculate_overflow_ellipsis() {
	var ofWidth = $('.-cp-table').width() - 100;
    $('.overflow-ellipsis').css("width", ofWidth + "px");
}


//PROTOTYPES
(function ( $ ) {
	function add_settings_data(settings, index, data) {
		if(index in settings && index.substr(-2) == '[]') {
			if(Array.isArray(settings[index])) {
				settings[index].push(data);
			} else {
				settings[index] = [settings[index], data]
			}
		} else {
			settings[index] = data;
		}
		return settings;
	}
	$.fn.extend({
		do_confirm: function( options ) {
			$(this).each(function() {
				if( $( this ).hasClass( 'do-confirm-set' ) ) {
					return this;
				}

				$(this).attr('data-selector', 'true');

				var obj = this;

				var settings = $.extend( {
					yes_button : wp.i18n.__( 'Yes', 'wishlist-member' ),
					yes_classes : '-danger',
					no_button : wp.i18n.__( 'No', 'wishlist-member' ),
					no_classes : '',
					condensed : true,
					confirm_message : wp.i18n.__( 'Are you sure?', 'wishlist-member' ),
					container : false,
					placement : 'left',
				}, options ? options : {} )

				$( obj ).addClass( 'do-confirm-set' );

				var condensed = settings.condensed ? ' -condensed ' : '';

				markup = $( '<div class="do_confirm">' + settings.confirm_message + ' &nbsp; &nbsp; <button style="pointer-events: auto;" class="btn -yes' + condensed + settings.yes_classes + '">' + settings.yes_button + '</button> <button style="pointer-events: auto;" class="btn -bare' + condensed + settings.no_classes + '">' + settings.no_button + '</button></div>' );
				markup.find( '.-yes' ).on( 'click.do_confirm', function( e ) {
					e.preventDefault();
					var targetObj = '[aria-describedby="' + $( this ).closest( '.popover' ).attr( 'id' ) + '"]';
					//sometimes, $( targetObj ) is undefined, especially on the second instance eg. Do Members > Move to Level then Members > Move to Level again
					if ( $( targetObj ) ) {
						targetObj = $( targetObj );
					} else {
						//if undefine, lets get the previous button with do-confirn-set class
						targetObj = $( this ).closest( '.popover' ).prev().find(".do-confirm-set");
					}

					targetObj.popover( 'hide' );
					targetObj.trigger( 'yes.do_confirm' );
				} );
				markup.find( '.-bare' ).on( 'click.do_confirm', function( e ) {
					e.preventDefault();
					var targetObj = '[aria-describedby=' + $( this ).closest( '.popover' ).attr( 'id' ) + ']';
					//sometimes, $( targetObj ) is undefined, especially on the second instance eg. Do Members > Move to Level then Members > Move to Level again
					if ( $( targetObj ) ) {
						targetObj = $( targetObj );
					} else {
						//if undefine, lets get the previous button with do-confirn-set class
						targetObj = $( this ).closest( '.popover' ).prev().find(".do-confirm-set");
					}
					targetObj.popover( 'hide' );
					targetObj.trigger( 'no.do_confirm' );
				} );

				$( this ).popover( 'dispose' );
				$( this ).popover( {
					container : settings.container ? settings.container : ($(this).closest('.modal').length ? $(this).closest('.modal-content') : '#the-content'),
					placement : settings.placement,
					html : true,
					content : markup,
					trigger : 'click',
					template : '<div class="popover -confirm-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
				} )
				.on( 'show.bs.popover', { settings: settings }, function ( e ) {
					$( '.do-confirm-set' ).popover( 'hide' );
					if( $( e.target ).closest( '.button-hover' ).length ) {
						$( e.target ).closest( '.button-hover' ).addClass( 'popover-active' );
					}
				} )
				.on( 'hide.bs.popover', { settings: settings }, function ( e ) {
					if( $( e.target ).closest( '.button-hover' ).length ) {
						$( e.target ).closest( '.button-hover' ).removeClass( 'popover-active' );
					}
				} );
			});

			return this;
		},
		apply_cancel: function ( options ) {
			$(this).each(function() {
				var settings, condensed, obj, xid;
				obj = this;
				settings = $.extend( {
					apply_button: wp.i18n.__( 'Apply', 'wishlist-member' ),
					apply_classes: '-success',
					cancel_button: wp.i18n.__( 'Cancel', 'wishlist-member' ),
					cancel_classes: '',
					condensed: true,
					row: '.row',
					style: '',
					require_change: true,
					show_feedback: true,
				}, options ? options : {} )

				if ( options == 'hide' ) {
					$( $( this ).data('apply_cancel') ).hide();
					$( this ).trigger( 'hide.apply_cancel' );
				}
				if ( options == 'show' ) {
					var vis = $( $( this ).data('apply_cancel') ).is(':visible');
					$( $( this ).data('apply_cancel') ).show();
					if(!vis) $( this ).trigger( 'show.apply_cancel' );
				}

				if ( options == 'show_feedback' ) {
					myparent = $( this ).parent();
					//what if I am inside of another element
					if ( !myparent.hasClass(".form-group") ) {
						myparent = $( this ).closest(".form-group");
					}
					myparent.addClass( 'has-success' );
					window.setTimeout( function( container ) {
						container.removeClass( 'has-success' );
					}, 2000, myparent );
				}

				if( $( obj ).closest( settings.row ).find( '.apply-cancel' ).length ) {
					return obj;
				}

				xid = 'apply-cancel' + Math.floor((Math.random() * 100000) + 1) + '-' + ( + new Date() );
				$(this).attr('data-apply_cancel', '#' + xid);

				condensed = settings.condensed ? ' -condensed' : '';

				var padding = $( obj ).siblings( 'label' ).length ? 'padding-top : 30px;' : '';

				var markup = $('<div id="'+xid+'" class="apply-cancel col-sm-auto col-md-auto" style="display: none;' + padding + settings.style +'"></div>');
				markup.append( $('<button class="btn -apply ' + settings.apply_classes + condensed + '">' + settings.apply_button + '</button>' ) );
				markup.append( $('<button class="btn -bare ' + settings.cancel_classes + condensed + '">' + settings.cancel_button + '</button>' ) );

				markup.find( '.btn.-apply' ).click( {relatedInput : obj, options : settings}, function( e ) {
					var settings;

					e.preventDefault();

					settings = e.data.options;

					var i = $( e.data.relatedInput );
					if(settings.require_change === true) {
						i.apply_cancel( 'hide' );
					}
					if(settings.show_feedback === true) {
						i.apply_cancel( 'show_feedback' );
					}

					i.trigger( 'apply.apply_cancel' );
				});
				markup.find( '.btn.-bare' ).click( {relatedInput : obj}, function( e ) {
					e.preventDefault();
					var i = $( e.data.relatedInput )
					i.apply_cancel( 'hide' );
					i.trigger( 'cancel.apply_cancel' );
					i.trigger( 'change' );
				});

				$( obj ).closest( settings.row ).append( markup );

				if( settings.require_change === true ) {
					var eeee = 'keyup';
					if( $( obj )[0].type == 'number' ) eeee += ' mouseup';
					$( obj ).on( eeee, function(e) {
						if( e.type == 'keyup' ) {
							if( e.keyCode == 8 || this.tagName == 'TEXTAREA' && e.keyCode == 13 ) {
								keylength = 1;
							} else {
								keylength = e.key.length;
							}
							if( keylength > 1 ) return;
						}

						if( $( this ).val() == $( this ).data( 'initial' ) ) {
							$( this ).apply_cancel( 'hide' );
						} else {
							$( this ).apply_cancel( 'show' );
						}
					} );
				}
			});

			return this;
		},
		click_to_edit: function( options ) {
			var settings, condensed, ig, sibling, c2e, xid;

			settings = $.extend( {
				edit_text: wp.i18n.__( 'Edit', 'wishlist-member' ),
				close_text: wp.i18n.__( 'Close', 'wishlist-member' ),
				condensed: true,
				hide_on_edit: true,
				is_copyable: true,
			}, options ? options : {} )

			ig = $(this).closest('.input-group');
			if(!ig.length) {
				ig = $(this);
			}

			c2e = ig.siblings('.c2e_html');
			if( options == 'close' ) {
				c2e.show();
				ig.hide();
				c2e.find('button').text(c2e.find('button').data('edittext'));
				return this;
			}
			if( options == 'edit' ) {
				if( settings.hide_on_edit === true ) {
					c2e.hide();
				}
				ig.show().focus();
				c2e.find('button').text(c2e.find('button').data('closetext'));
				return this;
			}

			if(c2e.length) return this;

			xid = 'click-to-edit' + Math.floor((Math.random() * 100000) + 1) + '-' + ( + new Date() );
			$(this).attr('data-click_to_edit', '#' + xid);

			condensed = settings.condensed ? ' -condensed' : '';
			hide_on_edit = settings.hide_on_edit ? ' -hide-on-edit' : '';

			var t2e = settings.is_copyable ? '<input type="text" class="form-control -text-to-edit copyable" readonly>' : '<span class="form-control -text-to-edit" readonly></span>';

			c2e = $('<div class="c2e_html" id="' + xid + '">' + t2e + ' <button class="btn -bare'+condensed+hide_on_edit+'" data-edittext="'+settings.edit_text+'" data-closetext="'+settings.close_text+'">'+settings.edit_text+'</button></div>');
			if( settings.no_crop ) {
				c2e.css('width', 'calc(100% + ' + ( settings.edit_text.length + 4.5 ) + 'ch)');
			}
			c2e.on('click.c2e_event', 'button', { relatedInput : this }, function(e) {
				var ig;
				e.preventDefault();

				ig = $(e.data.relatedInput).closest('.input-group');
				if(!ig.length) {
					ig = $(e.data.relatedInput);
				}
				if($(this).text() == $(this).data('edittext')) {
					$(ig[0]).click_to_edit('edit');
					$( e.data.relatedInput ).trigger('edit.click_to_edit');
				} else {
					$(ig[0]).click_to_edit('close');
					$( e.data.relatedInput ).trigger('close.click_to_edit');
				}

				if($(this).hasClass('-hide-on-edit')) {
					$(this).closest('.c2e_html').hide();
				}
			});
			ig.before(c2e);

			$(this).off('change.c2e_event');

			// change event handler
			$(this).on('change.c2e_event', { options : settings }, function(e) {
				var settings, condensed, hide_on_edit, ig, text;

				settings = e.data.options;

				// get the input group
				ig = $(this).closest('.input-group');
				if(!ig.length) {
					ig = $(this);
				}

				// grab click to edit text
				text = '';
				ig.find('.input-group-prepend').each(function() {
					text += $(this).children('.input-group-text').text().trim();
				});
				text += $(this).val();
				ig.find('.input-group-append').each(function() {
					text += $(this).children('.input-group-text').text().trim();
				});

				// if text is link, then make it a link
				if(text.match(/^(http|https):\/\//) && !settings.is_copyable) {
					text = '<a href="'+text+'" target="_blank">'+text+'</a>';
				}
				// update text
				if(settings.is_copyable) {
					// $( $( this ).data('click_to_edit') ).find('input.-text-to-edit').val(text).css('width',(text.length+1) + 'ch');
					$( $( this ).data('click_to_edit') ).find('input.-text-to-edit').val(text).css('width', 'calc(100% - ' + (settings.edit_text.length + 4) + 'ch)');
				} else {
					$( $( this ).data('click_to_edit') ).find('span.-text-to-edit').html(text);
				}
			}).trigger('change.c2e_event');

			ig.hide();

			return this;
		},
		disable_button: function( options ){
			var settings = $.extend({
				// These are the defaults.
				disable: true,
				text: "",
				icon: "",
				class: "-primary"
			}, options );
			if ( settings.disable ) {
				this.removeClass(settings.class).addClass("disabled").prop("disabled", true).attr("disabled", "disabled");
				// $.each(this, function() {
				// 	$(this).find(".wlm-icons").addClass("text-success");
				// });
			} else {
				this.addClass(settings.class).removeClass("disabled").prop("disabled", false).removeAttr("disabled");
				// $.each(this, function() {
				// 	$(this).find(".wlm-icons").removeClass("text-success");
				// });
			}
			if ( settings.text != "" ) {
				$(this).each(function() {
					$(this).find(".text").html(settings.text);
				})
			}
			if ( settings.icon != "" ) {
				$(this).each(function() {
					$(this).find(".wlm-icons").html(settings.icon);
				});
			}
			return this; //return for chaining
		},
		show_message: function( options ){
			var settings = $.extend({
				// These are the defaults.
				message: wp.i18n.__( 'Saved', 'wishlist-member' ),
				type: 'success',
				icon: '',
				delay: 4000,
			}, options );
			//lets double the delay for warning and danger
			settings.delay = (settings.type === "danger" || settings.type === "warning") ? settings.delay : settings.delay;

			if($(this).hasClass('wlm-message-holder')) {
				if($('body').hasClass('modal-open') && $('body').hasClass('modal-save')) {
					$('body').removeClass('modal-save');
					var x = $('<div/>').addClass('text-' + settings.type).html(settings.message);
					$('.modal .modal-header .modal-toaster')
						.html(x)
						.stop(true)
						.removeAttr('style')
						.show();

					if(settings.type != 'danger') {
						$('.modal .modal-header .modal-toaster')
							.delay(settings.delay)
							.fadeOut(settings.delay);
					}
				}

				var x = $('<div/>').addClass('notice is-dismissible notice-' + settings.type).html($('<p/>').html(settings.message));
				$('.wlm-toaster').html(x).stop(true).removeAttr('style').fadeIn(settings.delay/8);
				if(settings.type != 'danger') {
					$('.wlm-toaster').delay(settings.delay).fadeOut(settings.delay);
				}
				return this;
			}
			this.html("");
			settings.icon = (settings.icon == "success") ? "done" : settings.icon;
			settings.icon = (settings.icon == "danger") ? "close" : settings.icon;
			var $markup = "<br><div class=\"alert alert-" +settings.type +" alert-dismissible\" role=\"alert\">";
			$markup += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";
			$markup += "<p class=\"title\"><i class=\"wlm-icons\">" +settings.icon +"</i>" +settings.message +"</p></div>";
			var $el = $($markup);
			this.append($el);
			this.css("z-index","999999");
			$el.fadeIn(settings.delay/8).delay(settings.delay).fadeOut(settings.delay, function(){$(this).remove();});
			return this; //return for chaining
		},
		get_form_data: function( options ) {
			var me = this;
			var settings = $.extend({
				validator: null,
			}, options );
			var settings_data = {};
			var err = false;
			var error_fields = {}
			me.find(':input').each( function () {
				if ( $(this).prop('name') && typeof $(this).attr('skip-save') == "undefined" ) {
					$(this).parent().removeClass("has-error"); //clean error field
					//custom validation of fields
					if ( settings.validator ) {
						var val = settings.validator( $(this) );
						if ( val === false ) {
							settings_data = add_settings_data(settings_data, $(this).prop('name'), val);
						} else {
							error_fields[$(this).prop('name')] = $(this);
							err = true;
						}
					} else { //generic validation
						var val = false;
						//for hidden fields that needs to be submitted, they need to have hidden_val
						if ( $(this).parent().hasClass('hidden') || $(this).hasClass('hidden') ) {
							if ( typeof $(this).attr('hidden_val') != "undefined" ) {
								val  = $(this).attr('hidden_val');
							}
						} else if ( $(this).prop('required') && ($(this).val() == "" || $(this).val() == null ) ) {
							//temporary, we'll need a css class for this
							if ( !$(this).parent().hasClass('hidden') ) {
								error_fields[$(this).prop('name')] = $(this);
								err = true;
							}
						} else {
							val = $(this).val();
						}
						// check for type
						if ( $(this).prop('type') == "checkbox" || $(this).prop('type') == "radio" ) {
							if ( $(this).is(':checked') ) {
								settings_data = add_settings_data(settings_data, $(this).prop('name'), val);
							} else if ( typeof $(this).attr('uncheck_value') != "undefined" ) {
								settings_data = add_settings_data(settings_data, $(this).prop('name'), $(this).attr('uncheck_value'));
							}
						} else {
							settings_data = add_settings_data(settings_data, $(this).prop('name'), val);
						}
					}
				}
			});
			if ( err ) {
				error_fields["error"] = err;
				return error_fields;
			} else {
				return settings_data;
			}
		},
		normalize_form_data: function(data) {
			var _data = [];
			function recurse(d, name) {
				$.each(d, function(n, v) {
					if(name) {
						n = name + '['+n+']';
					}
					if(v && typeof v == 'object') {
						recurse(v, n);
					} else {
						_data[n] = v;
					}
				});
			}
			recurse(data, '');
			return $.extend({},_data);
		},
		set_form_data: function( data) {
			var f = $(this);
			f.find(':input').each(function() {
				if(!this.name) return true; // skip
				var n = this.name.replace(/\[\]$/g, '').replace(/\[/g,'["').replace(/\]/g, '"]');
				v = null;
				try {
					var s = 'data.'+n;
					if(!n.match('^[\$_A-Za-z]')) {
						n = n.replace(/^[^\[]+/, '["$&"]');
						s = 'data' + n;
					}
					var v = eval(s)
				} catch(e) {
					v = null
				}

				if(v === null && $(this).data('default')) {
					v = $(this).data('default');
				}

				if(!v && v!=null) {
					v = '';
				}

        try { // ensure that site doesn't break if some invalid value is passed
  				if(v != null) {
  					var i = $(this);
  					if(!Array.isArray(v)) {
  						v = ['' + v];
  					}
  					switch(this.type) {
  						case 'checkbox':
  							i.prop('checked',(v.indexOf(i.val()) >= 0));
  						break;
  						case 'select-multiple':
  						case 'select-one':
  						case 'select':
  							i.val(v).trigger('change.select2');
  						break;
  						case 'undefined': break;
  						case 'radio':
  							i.val(v).trigger('change');
  						break;
  						default:
  							i.val(v[0]===false || v[0]=='false'?'':v[0].replace(/\\(.)/mg, '$1')).trigger('change');
  					}
  				}
        } catch (e) {};
			});
		},
		save_settings: function( options ){
			var me = this;
			wlm.is_saving(me, true);
			var settings = $.extend({
				data: null,
				on_init: null,
				on_success: null,
				on_fail: null,
				on_error: null,
				on_done: null,
				validator: null, //custom validation function
				debug: false, //custom validation function
				use_serialize: false, // use jquery serialize instead of our get_form_data()
				skip_empty:false, //
				show_loader: true,
			}, options );
			var err = false;
			var error_fields = {}

			if ( $('body').hasClass('modal-open') ) {
				$('body').addClass('modal-save');
				if ( settings.show_loader ) me.closest(".modal-dialog").find(".modal-loader-overlay-holder").removeClass("d-none");
			}
			//retrieve data from this
			if(settings.use_serialize) {
				if(settings.skip_empty) {
					var settings_data = me.find(':input').filter(function() { return !! this.value; }).serialize();
				} else {
					var settings_data = me.serialize();
				}
			} else {
				var settings_data = me.get_form_data({
					validator: settings.validator, //pass custom validator
				});
			}
			if ( typeof settings.data === 'object' ) settings_data = $.extend( settings_data, settings.data );
			if ( settings.debug ) {
				console.log(settings_data);
				if ( settings.show_loader ) me.closest(".modal-dialog").find(".modal-loader-overlay-holder").addClass("d-none");
				return me;
			}
			if ( settings.on_init ) settings.on_init(me, settings_data );
			if ( settings_data.error ) {
				delete settings_data.error;
				if ( settings.on_error ) settings.on_error(me, settings_data );
				if ( settings.show_loader ) me.closest(".modal-dialog").find(".modal-loader-overlay-holder").addClass("d-none");
			} else {
				//send post
				settings_data = $.each(settings_data, function(i, v) {
					if(Array.isArray(v) && !v.length) {
						settings_data[i] = '';
					}
				});
				$.post( WLM3VARS.ajaxurl, settings_data, function( result ) {
					if ( result != 0 || result != "" ) {
						// try parsing result
						try {
							result_data = wlm.json_parse(result);
						} catch (e) {
							result_data = result;
						}
						try {
							if ( settings.on_success ) settings.on_success(me, result_data);
						} catch (e) {
              try {
                if ( settings.on_fail ) settings.on_fail(me, settings_data);
              } catch(e) {}
						}
					}
				})
				.fail( function( jqXHR, textStatus ) {
					if ( settings.on_fail ) settings.on_fail(me, settings_data);
				})
				.always( function( jqXHR, textStatus ) {
					wlm.is_saving(me, false);
					if ( settings.show_loader ) me.closest(".modal-dialog").find(".modal-loader-overlay-holder").addClass("d-none");
					$('body').removeClass('modal-save');
					if ( settings.on_done ) settings.on_done(me, settings_data, jqXHR, textStatus);
					wlm.state_update();
				});
			}
			return me;
		},
		load_screen: function(link, title, pushState) {
			var $container = $(this);

			if(!wlm.unload_check()) return;

			window.parent.document.title = title;

			var $section = $container.attr('id');
			var $url = typeof link == 'string' ? link : link.attr('href');

			var a = document.createElement('a');
			a.href = $url;
			$url = a.href.split('?');
			if($url[1]) {
				$url = $url[0] + '?' + $url[1].replace(/\//g, '%2F');
			} else {
				$url = $url[0];
			}

			var $hash = $url.split('#');
			$hash = $hash.length > 1 ? $hash[1] : '';

			$container.html($('#wlm-simple-loader-container').html());

			var $data = {
				action : 'wlm3_get_screen',
				data : {
					url : $url,
					section : $section
				}
			}

			$('.wlm-toaster').hide();

			if(typeof link != 'string' || pushState) {
				wlm.pushState($section, title, $url);
			}

			$.post(WLM3VARS.ajaxurl, $data, function(result) {
				result = wlm.json_parse(result);
				$container.html(result.html);

				if(result.js) {
					$.getScript(result.js + '?build=3.24.4');
				}
				var match = $url.match(/&wl=[^&#]+/);
				if(match) {
					var xmatch = decodeURIComponent(match[0]).split('/');
					match = xmatch[0];
					if(xmatch[1]) {
						match += '%2F' + xmatch[1];
						if(xmatch[2]) {
							match += '%2F' + xmatch[2];
						}
					}

					$('ul#wlm3-tabbar li a').removeClass('active');
					var $a = $('ul#wlm3-tabbar a[href*="'+match+'"]');
					if($a.closest('li.dropdown a')) {
						$a.closest('li.dropdown a').addClass('active');
					}
					$a.closest('li a').addClass('active');

					if($section == 'the-screen') {
						match = decodeURIComponent(match).split('/');
						match = match[0] + '%2F' + match[1];
					}
					$('ul#wlm3-sidebar a').removeClass('active');
					$('ul#wlm3-sidebar a[href*="'+match+'"]').addClass('active');

				}

				if($hash && $section == 'the-screen') {
					$('#the-screen').attr('class', 'container-fluid').addClass($hash);
				}

				$container.transformers();
				// $container.fadeTo('fast', 1);

				capture_hash_clicks();
			});
		},
		reload_screen: function() {
			$('.modal-backdrop').remove();
			$('#the-screen').load_screen( window.parent.location.href, window.parent.document.title );
			$('html, body').css({
				overflow: '',
				height: ''
			});
			$('body').removeClass('modal-open');
		},
		select_text: function() {
			if (window.getSelection) {
				var range = document.createRange();
				range.selectNode(this[0]);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
			} else if (document.selection) {
				var range = document.body.createTextRange();
				range.moveToElementText(this[0]);
				range.select();
			}
		},
		unselect_text: function() {
			var sel = window.getSelection ? window.getSelection() : document.selection;
			if (sel) {
				if (sel.removeAllRanges) {
					sel.removeAllRanges();
				} else if (sel.empty) {
					sel.empty();
				}
			}
		},
		insert_text_at_caret: function(text_to_insert) {
			return this.each(function(i) {
				if (document.selection) {
					//For browsers like Internet Explorer
					this.focus();
					var sel = document.selection.createRange();
					sel.text = text_to_insert;
					this.focus();
				} else if (this.selectionStart || this.selectionStart == '0') {
					//For browsers like Firefox and Webkit based
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var scrollTop = this.scrollTop;
					this.value = this.value.substring(0, startPos) + text_to_insert + this.value.substring(endPos, this.value.length);
					this.focus();
					this.selectionStart = startPos + text_to_insert.length;
					this.selectionEnd = startPos + text_to_insert.length;
					this.scrollTop = scrollTop;
				} else {
					this.value += text_to_insert;
					this.focus();
				}
			});
		},
		transform_form_groups: function() {
			// form group
			$(this).find('template.wlm3-form-group').each(function() {
				try {
					var $data = eval('('+$(this).html()+')');
					if(!Array.isArray($data)) {
						$data = [$data];
					}
					var html = '';
					$data.forEach(function(d) {
						html += (new wlm3_form_group(d, true)).html;
					})
					$(this).replaceWith($(html));
				} catch (e) {
					if(WLM3VARS.plugin_version.indexOf('{' + 'WLP_VERSION}') >= 0) {
						console.log(e);
						console.log($(this).html());
					}
				}
			});
		},
		transform_toggle_switches: function() {
			// toggle-switch
			$(this).find('template.wlm3-toggle-switch').each(function() {
				try {
					var $data = eval('('+$(this).html()+')');
					if(!Array.isArray($data)) {
						$data = [$data];
					}
					var html = '';
					$data.forEach(function(d) {
						html += (new wlm3_toggle_switch(d, true)).html;
					})
					$(this).replaceWith($(html));
				} catch (e) {
					if(WLM3VARS.plugin_version.indexOf('{' + 'GLOBALREV}') >= 0) {
						console.log(e);
						console.log($(this).html());
					}
				}
			});

			// .wlm_toggle-switch markup converter
			// start: v4
			$(this).find('input[type=checkbox].wlm_toggle-switch').each(function() {
				var l = $(this).closest('.form-check').find('label').first().clone();
				l.find('input').remove();
				l.find('.marker').remove();
				l.removeClass("cb-container");
				l.find('.text-content').addClass("title-label");
				$(this).closest('.form-check').removeClass("-with-tooltip")
				var i = $(this).clone(true,true).removeClass('wlm_toggle-switch');
				i.addClass('is-toggle-switch');

				var fg = _.template($('script#wlm3-template-toggle-switch').html(), {variable: 'data'});
				html = ($(fg({ label : '___label___' }))[0].outerHTML)
					.replace('___input___', i[0].outerHTML)
					.replace('___label___', l[0].outerHTML);
				$(this).closest('.form-check').replaceWith(html);
			});
			// end: v4
		},
		transform_date_picker: function() {
			// date picker
			$(this).find('#DateRangePicker').daterangepicker(
				{
					singleDatePicker: true,
					timePicker: true,
					showCustomRangeLabel: false,
					buttonClasses: "btn -default",
					applyClass: "-condensed -success",
					cancelClass: "-condensed -link",
					locale: {
						format: "MM/DD/YYYY hh:mm a"
					}
				},
				function(start, end, label) {
					console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
				}
			);
		},
		transform_select2: function() {
			// select2
			$(this).find('.wlm-select:not(.body *)').select2({
				theme: "bootstrap",
			});
			window.setTimeout(function(obj) {
				$(obj).find('.modal .wlm-select').select2({
					theme: "bootstrap",
				});
			}, 2000, this);
		},
		transformers: function() {
			$.fn.select2.defaults.set("theme", "bootstrap");
			
			$(this).find('a[href="#"]').click(function(e) {
				e.preventDefault();
			});

			$(this).transform_form_groups();
			$(this).transform_toggle_switches();
			$(this).transform_select2();
			$(this).transform_date_picker();

			wlm.richtext();

			wlm.popover.init();

			$('.img-uploader input').trigger('change');

			// tooltip
			$(document).tooltip({
				html: true,
				trigger: 'hover',
				selector: 'a.help-icon',
				placement: 'right',
			});

			$(document).on('inserted.bs.tooltip', 'a.help-icon', function() {
				var tt = '#' + $(this).attr('aria-describedby');
				$(tt).addClass('-tooltip-' + $(this).data('size'));
			});

			$(':input').attr('data-lpignore', 'true');

			$('.date-ranger :input').trigger('apply.daterangepicker');

			$('input.wlm3colorpicker').minicolors({
				theme: 'bootstrap',
				opacity: true,
				format: 'rgb'
			});

			// merge multiple content wrappers
			var cws = $('#the-screen > div > div > .content-wrapper');
			if( cws.length > 1 ) {
				for(var i = 1; i < cws.length; i++) {
					if($(cws[i]).hasClass('-merge')) {
						$(cws[i-1]).css({
							'border-bottom': 0,
							'border-bottom-left-radius': 0,
							'border-bottom-right-radius': 0,
							'padding-bottom': 0,
						});
						$(cws[i]).css({
							'border-top': 0,
							'border-top-left-radius': 0,
							'border-top-right-radius': 0,
							'padding-top': 0,
						});
					}
				}
			}

			wlm.state_update();
		},
		sort: function( selector, attribute, numeric, reverse ) {
      if( typeof selector != 'string' ) {
        return;
      }
			var elms = $(this).find(selector).get();
			if ( elms.length <= 1 ) return;
			var sort_elms = function(a, b) {
				var x = '';
				var y = '';

				try { x = $(a).attr(attribute).toLowerCase(); } catch(e) {}
				try { y = $(b).attr(attribute).toLowerCase(); } catch(e) {}
				if(numeric === true) {
					x = Number(x);
					y = Number(y);
				}
				if(reverse) {
					if (x < y) return 1;
					if (x > y) return -1;
				} else {
					if (x < y) return -1;
					if (x > y) return 1;
				}
				return 0;
			}
			elms.sort(sort_elms);
			var parent = $(this);
			$.each(elms, function(key, obj) {
				parent.append($(obj));
			});
		},
		allow_select_all:  function( options ) {
			var settings, obj;

			if( $( this ).hasClass( 'select-all-allowed' ) ) {
				return this;
			}

			$( obj ).addClass( 'select-all-allowed' );

			obj = this;

			settings = $.extend( {
				column : false,
				column_class : 'col-md-6 no-margin no-padding',
				class : 'pull-right',
			}, options ? options : {} );

			markup = $( '<a href="#" class="btn -condensed -bare -mini ' +settings.class +'">Select All</a>' );
			if ( settings.column ) {
				column = $( '<div class="'+settings.column_class+'"></div>' );
				column.prepend(markup);
				obj.closest(".row").append(column);
			} else {
				markup.insertBefore(obj);
			}
			markup.click( function( e ) {
				e.preventDefault();
				if ( $(this).html() == wp.i18n.__( 'Clear All', 'wishlist-member' ) ) {
				// if ( obj.find("option:not(:selected)").length == 0 ) {
					obj.find('option').prop("selected",false);
					$(this).html(wp.i18n.__( 'Select All', 'wishlist-member' ));
					$( obj ).trigger( 'selection_cleared' );
				} else {
					obj.find('option').each( function() {
						if ( $(this).attr("disabled") != "disabled" ) {
							$(this).prop("selected",true);
						}
					});
					$(this).html(wp.i18n.__( 'Clear All', 'wishlist-member' ));
					$( obj ).trigger( 'selected_all' );
				}
				obj.trigger('change.select2');
				$( obj ).trigger( 'selection_updated' );
			});
			obj.on("change", function(e) {
				if ( obj.find("option:not(:selected)").length == 0 ) {
					markup.html(wp.i18n.__( 'Clear All', 'wishlist-member' ));
				} else {
					markup.html(wp.i18n.__( 'Select All', 'wishlist-member' ));
				}
				obj.trigger('change.select2');
				$( obj ).trigger( 'selection_updated' );
			});
			return this;
		},
	});
}( jQuery ));

// other stuff
(function ( $ ) {
	//remove error class on fields with errors upon typing something
	$('input').on('input', function(){ $(this).parent().removeClass("has-error"); });

	$('body').off('.wlm3global');

	// .wlm_toggle-adjacent event handler
	$('body').on('change.wlm3global', ':radio.wlm_toggle-adjacent,:checkbox.wlm_toggle-adjacent', function() {
		var a = $(this).closest('.row').find('> div:not(:first):not(.apply-cancel):not(.reverse-toggle)');
		var b = $(this).closest('.row').find('> div:not(:first):not(.apply-cancel).reverse-toggle');
		var checked = $(this).prop('checked');
		if($(this).hasClass('reverse-toggle')) {
			checked = !checked;
		}
		if(checked) {
			if($(this).hasClass('disable-adjacent')) {
				a.find(':input, .btn').removeClass('-disable').prop('disabled', false);
				b.find(':input, .btn').addClass('-disable').prop('disabled', false);
			} else {
				a.show();
				b.hide();
			}
		} else {
			if($(this).hasClass('disable-adjacent')) {
				a.find(':input, .btn').addClass('-disable').prop('disabled', true);
				b.find(':input, .btn').removeClass('-disable').prop('disabled', true);
			} else {
				a.hide();
				b.show();
			}
		}
	});

	// radio button change trigger
	$('body').on('change.wlm3global', ':radio', function() {
		if(wlm.radio_change_running) return;
		wlm.radio_change_running = true;
		this.running = $(this).val();
		$(':radio[name="'+$(this).attr('name')+'"]').not('[value="'+$(this).val()+'"]').change();
		wlm.radio_change_running = false;
	});

	// handle ajax loading of 2nd level links
	$('body').on('click.wlm3global', '#wlm3-sidebar a[href!=""]', function(e) {
		if(!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) {
			var $container = $('#the-content').load_screen($(this), $(this).attr('data-title'));
			return false;
		}
	});

	// handle ajax loading of 3rd level links
	$('body').on('click.wlm3global', '#wlm3-tabbar > li > a', function(e) {
		if($(this).hasClass('dropdown-toggle')) {
			$(this).dropdown('toggle');
			return false;
		}
		if(!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) {
			var $container = $('#the-screen').load_screen($(this), $(this).attr('data-title'));
			return false;
		}
	});

	$('body').on('click.wlm3global', '*:not(.modal) ul.nav.nav-tabs:not(#wlm-tabbar) > li > a[href^="#"]', function(e) {
		e.preventDefault();
		if(e.target.hash.length > 1) {
			wlm.pushState('hash-only', '', e.target.hash);
		}
	});

	// handle ajax loading of 4th level links
	$('body').on('click.wlm3global', '#wlm3-tabbar ul.dropdown-menu a', function() {

		var $me = $(this);
		var $li = $me.closest('ul').closest('li.dropdown');
		var $dd = $me.closest('ul').closest('li.dropdown').find('a.dropdown-toggle').first();

		$dd.dropdown('toggle');
		if(!$li.hasClass('active')) {
			var $container = $('#the-screen').load_screen($(this), $(this).attr('data-title'));
			$li.addClass('active');
		} else {
			var classname = $me.attr('href').split('#')[1];
			$('#the-screen').attr('class', 'container-fluid').addClass(classname);
		}
		return false;
	});

	$('body').on('click.wlm3global', '.toggle-sidebar .nav-link', function(e) {
		e.preventDefault();
		$('.wlm3body').toggleClass('nav-collapsed');
		var $data = {
			action : 'admin_actions',
			WishListMemberAction : 'save',
			wlm3sidebar_state : + $('.wlm3body').hasClass('nav-collapsed')
		}
		$('<div/>').save_settings( { data : $data } );
	});

	window.parent.onpopstate = wlm.popState;

	$(parent.window).on('scroll', function() {
		// $('#wlm3-sidebar').css('margin-top', this.document.body.scrollTop);
		$('.toaster, .toaster .alert').css('top', this.document.body.scrollTop);
	});

	$('body').on('show.bs.modal.wlm3global', '.modal', function() {
		var element = $(this);
		//show modal in current scroll position
		element.css({ 'margin-top': $(parent.window).scrollTop()});
		//make sure that our modal follows when scrolling
		$(parent.window).on('scroll', function(event) {
			element.css({ 'margin-top': $(this).scrollTop() })
		});
	});

	$('body').on('click.wlm3global', '.copy-url', function() {
		var text = '';
		var ig = $(this).closest('.-url-group').find('.input-group');
		var addons = $(ig).find('.input-group-prepend, .input-group-append').toArray();

		var addon = addons.shift();
		text += $(addon).text().trim();
		text += $(ig).find(':input').val().trim();
		while (addons.length) {
			addon = addons.shift();
			text += $(addon).text().trim();
		}
		$(this).data('text', text);
	});

	$('body').on('focus.wlm3global', '.email-subject', function() {
		var select = $(this).closest('.row').find('.insert_text_at_caret');
		var t = "[name=" +$(this).attr("name") +"]";
		if ( select.data('select2') ) select.select2('destroy');
		select.data('target', t).select2({theme:"bootstrap"});
	});

	$('body').on('change.wlm3global', '.insert_text_at_caret', function() {
		var text = $(this).val();
		var target = $(this).data('target');

		var t = tinymce.get($(target)[0].id);
		if(t) t.focus();
		if(tinymce.activeEditor && tinymce.activeEditor.id == $(target)[0].id) {
			tinymce.activeEditor.insertContent(text);
		} else {
			$(target).insert_text_at_caret(text);
		}
		$(this).val('').trigger('change.select2');
	});

	$('body').on('click.wlm3global keyup.wlm3global', ':input.copyable', function() {
		document.getSelection().removeAllRanges();
		$(this).select();
		$(this).next('.copyable-ins').remove();
		$(this).after('<small class="copyable-ins">' + WLM3VARS.copy_command + '</small>');
	});

	$('body').on('blur.wlm3global', ':input.copyable', function() {
		$(this).next('.copyable-ins').remove();
	});

	//for input-save textboxes, CHANGE TO MIKE's APPLY CANCEL
	$('body').on('blur.wlm3global', '.input-save', function() {
	   $this = $(this);
	   if ( $.trim($(this).attr("current-value")) == $.trim($(this).val()) ) {
			return false;
	   }
	   $(this).parent().save_settings({
			on_success: function( $me, $result) {
				$this.attr( "current-value", $.trim($this.val()) );
				if ( $this.parent().hasClass("input-group") ) {
					$this.parent().find(".save-notifier i").show();
					$this.parent().find(".save-notifier i").fadeOut(1000, function(){ $(this).hide() });
				} else {
					$this.closest(".form-group").find(".form-control-feedback").show();
					$this.closest(".form-group").addClass("has-success");
					$this.closest(".form-group").find(".form-control-feedback").fadeOut(1000, function(){
						$this.closest(".form-group").removeClass("has-success");
						$(this).hide();
					});
				}
			},
			on_fail: function( $me, $data) {
				$me = $me.find(".notification-switch");
				alert(WLM3VARS.request_failed);
				$me.prop('checked', ! $me.prop('checked') );
			},
			on_error: function( $me, $error_fields) {
				alert(WLM3VARS.request_error);
			}
		});
	});

	//for toggle boxes
	$('body').on('click.wlm3global', '.notification-switch', function() {
	   $(this).parent().parent().parent().parent().parent().save_settings({
			on_success: function( $me, $result) {
				$me = $me.find(".notification-switch");
				$( '.wlm-message-holder' ).show_message( { message : $result.msg, type : $result.msg_type} );
				// console.log($result.msg);
			},
			on_fail: function( $me, $data) {
				$me = $me.find(".notification-switch");
				alert(WLM3VARS.request_failed);
				$me.prop('checked', ! $me.prop('checked') );
			},
			on_error: function( $me, $error_fields) {
				alert(WLM3VARS.request_error);
			}
		});
	});

	// start : media uploader
	$('body').on('change.wlm3global', '.img-uploader input', function() {
		var placeholder    = $(this).attr('placeholder');
		var uploader       = $(this).closest('.img-uploader');
		var is_file        = uploader.hasClass('file');
		var img            = uploader.find('img');
		var file_container = uploader.find('.file-container');

		if ( is_file ) {
			file_container.html( $( this ).val() );
		} else {
			img
			 .attr( 'src', $( this ).val() )
			 .attr( 'title', $( this ).val() );
		}

		if ( $(this).val() ) {
			uploader.addClass('-set');
			if ( is_file ) {
				file_container
				 .attr( "title", "x" )
				 .html( $(this).val() );
			} else {
				img.attr('alt', '');
			}
		} else {
			uploader.removeClass('-set');
			if ( is_file ) {
				file_container
				 .attr("title",placeholder)
				 .html( placeholder );
			} else {
				img.attr('alt', placeholder);
			}
		}

	});
	$('body').on('click.wlm3global', '.img-uploader .img-clear-button', function() {
		$(this).closest('.img-uploader').find('input').val('').trigger('change.wlm3global');
	});
	$('body').on('click.wlm3global', '.img-uploader button', function(e) {
		e.preventDefault();

		var media_uploader;
		var container = $(this).closest('.img-uploader');
		var is_file = container.hasClass('file');

		if(media_uploader) {
			media_uploader.open();
			return;
		}

		media_uploader = wp.media({
			title : is_file ? wp.i18n.__( 'Choose File', 'wishlist-member' ) : wp.i18n.__( 'Choose Image', 'wishlist-member' ),
			button : {
				text : is_file ? wp.i18n.__( 'Choose File', 'wishlist-member' ) : wp.i18n.__( 'Choose Image', 'wishlist-member' ),
			},
			multiple : false
		});

		media_uploader
			.on('select', function() {
				var attachment = media_uploader.state().get('selection').first().toJSON();
				var i = container.find('input');
				i.data('height', attachment.height);
				i.data('width', attachment.width);
				i.val(attachment.url).trigger('change');
			})
		media_uploader.open();
	});
	// end : media uploader

	$('body').on('click.wlm3global', '#wlm3-hamburger-toggle', function(e) {
		parent.jQuery('#wp-admin-bar-menu-toggle').click();
		return false;
	});

	$('body').on('click.wlm3global', '#wlm3-tabbar a', function(e) {
		$('#wlm3-tabbar a').removeClass('active');
		$(this).addClass('active');
	});

	$('body').on('click.wlm3global', '#wlm3-sidebar a', function(e) {
		$('#wlm3-sidebar a').removeClass('active');
		$(this).addClass('active');
	});

	$('body').on('click.wlm3global', '.menu-top.toplevel_page_WishListMember a', function(e) {
		if(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return true;

		if(!wlm.unload_check()) {
			$(this).blur();
			return false;
		}

		// loader screen
		$('#wlm3-app-container').html($('#wlm-simple-loader-container').html());
		// update menu
		$('.menu-top.toplevel_page_WishListMember li').removeClass('current');
		$('.menu-top.toplevel_page_WishListMember a').removeClass('current');
		$(this).addClass('current');
		$(this).closest('li').addClass('current');
		$(this).blur();

		location.href=this.href

		return false;
	});

	$('body').on('apply.daterangepicker', '.date-ranger :input', function() {
		if($(this).val().trim()) {
			$(this).siblings('.wlm-icons').hide();
		} else {
			$(this).siblings('.wlm-icons').show();
		}
	});

	$('body').on('keypress.wlm3global', 'input[type="number"]', function(e) {
		if ( !$.isNumeric(e.key) ) { //prevent non numeric
			e.preventDefault();
		}
	});

	$('body').on('keypress.wlm3global, blur.wlm3global', '.pagination .pagination-pagenum', function(e) {
		if ( !$.isNumeric(e.key) && !e.keyCode !== 13 && e.type != 'focusout' ) { //prevent non numeric
			e.preventDefault();
		}
		if ( e.keyCode == 13 || e.type == 'focusout' ) {
			var page = $(this).val();
			if($(this).data('orig') && $(this).data('orig') == page && e.type == 'focusout' ) {
				return false;
			}
			$(this).data('orig', page);

			var total_pages = $(this).data("pages");
			var link = $(this).data("link");
			//make sure these are numeric values
			total_pages = $.isNumeric(total_pages) ? total_pages : 1;
			page = $.isNumeric(page) && page > 0 ? page : 1;

			page = page < total_pages ? page : total_pages;

			location.href = link.replace('%d', page);
			return false;
		}
	});

	$('body').on('change.wlm3global', ':input:not(.nosave)', wlm.state_changed);

	$('body').transformers();

	capture_hash_clicks();

	$(document).on('click', function(e) {
		var target;
		if(e.target.tagName != 'A') {
			target = $(e.target).closest('a');
			if(!target.length) {
				target = e.target;
			}
		} else {
			target = e.target;
		}

		if (!('' + $(target).attr('aria-describedby')).match(/^popover\d+/) && !$(target).parents().is('.popover')) {
			$('[aria-describedby^="popover"]').popover('hide');
		}
	});

	$(function () {
		$('body').transformers();
	});

	calculate_overflow_ellipsis();

	$(window).resize(function() {
		calculate_overflow_ellipsis();
	  if ($(window).width() <= 992) $('body').addClass("nav-collapsed");
	});
	$(window).on('beforeunload', function() {
		if(!wlm.state_check()) {
			return true;
		}
	});
	$('#wlm3-app-container').css('position', '');
}( jQuery ));

$( document ).ajaxComplete(function() {
	capture_hash_clicks();
});

// admin notice dismiss button.
$(
	function() {
		$( '.form-text.is-dismissible' ).append(
			$( '<button type="button" class="notice-dismiss" title="' + wp.i18n.__( 'Dismiss this notice', 'wishlist-member' ) + '"></button>' )
		);
		$( 'body' ).on(
			'click.wlm3global',
			'.form-text.is-dismissible .notice-dismiss',
			function() {
				$( this ).closest( '.form-text' ).slideUp();
			}
		)
	}
);
