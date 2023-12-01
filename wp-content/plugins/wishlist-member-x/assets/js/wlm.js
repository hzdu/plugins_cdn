/**
 * wlm.js
 * WLM Object
 */

// wlm object
var wlm = {};
(function ( $ ) {
	wlm = {
		radio_change_running : false,
		state_fields_changed : [],
		state_fields : [],
		state_check_pages : [
			'members/sequential'
		],
		
		/**
		 * Parses a JSON string only if it really is a string
		 *
		 * @param  string json_string String to parse.
		 * @return mixed
		 */
		json_parse : function(json_string) {
			return ('string' == typeof json_string ? JSON.parse(json_string) : json_string);
		},
    
    /**
     * Return WordPress timezone-based date from unix timestamp
     * @param  int    unix_timestamp Unix Timestamp
     * @param  object options        Formatting options
     * {
     *     @type string  format           Default WLM3VARS.js_date_format.
     *     @type boolean include_timezone Default false.
     * }
     * @return string
     */
    date : function(unix_timestamp, options) {
      options = Object.assign({
        format : WLM3VARS.js_datetime_format,
        include_timezone : false
      }, options );
      return moment( ( unix_timestamp + parseFloat( WLM3VARS.js_time_offset ) ) * 1000).utc().format( options.format ) + (options.include_timezone ? ' ' + WLM3VARS.js_timezone_string_pretty : '');
    },

		html2text : function(html) {
			return $('<div/>').html(html.replace( /[\n\r]/ig, '' ).replace( /<\/p>/ig, '\n\n' ).replace( /<br[^>]*>/ig, '\n' ).replace( /(<([^>]+)>)/ig, '' )).text();
			
		},

		text2html : function(text) {
			return '<p>' + text.replace( /\n\n/ig, '<p>' ).replace( /\n/ig, '<br>' );
		},

		state_changed : function() {
			wlm.state_fields_changed = wlm.parse_string($('.wlm3wrapper :input').serialize());
		},
		state_update : function() {
			wlm.state_fields = wlm.state_fields_changed = wlm.parse_string($('.wlm3wrapper :input').serialize());
		},
		state_check : function() {
			var get = wlm.parse_string(location.search);
			if(wlm.state_check_pages.indexOf(get.wl) < 0) return true;
			if(wlm.state_fields_changed == []) return true;
			return $.param(wlm.state_fields) == $.param(wlm.state_fields_changed);
		},
		unload_check : function() {
			if( !wlm.state_check() ) {
				if( !confirm( wp.i18n.__( 'Reload site?\n\nChanges you made may not be saved.', 'wishlist-member' ) ) ) return false;
			}	
			wlm.state_fields = wlm.state_fields_changed = [];
			return true;
		},

		is_saving : function(obj, set, target) {
			if(target == null	) {
				target = '.form-group';
			}
			if(set == true) {
				$(obj).filter(target).addClass('-is-saving');
				$(obj).find(target).addClass('-is-saving');
			} else {
				$(obj).filter(target).removeClass('-is-saving');
				$(obj).find(target).removeClass('-is-saving');
			}
		},

		form2object : function( form ) {
			var data = {};
			$.each( form, function() {
				$( this ).find( ':input' ).each( function() {
					var json = '{"' + this.name.replace( /\]/g, '').replace( /\[/g, '":{"' ) + '":' + JSON.stringify( this.value ) + Array( this.name.split( '[' ).length ).join( '}' ) + '}';
					$.extend(true, data, wlm.json_parse( json ) );
				});
			} );
			return data;
		},

		parse_string : function(str) {
			var parts, match, i, result = {};
			parts = str.split('&');
			for (i in parts){
				match = parts[i].match(/^([^=]+)=(.*)/);
				if(match) {
					var name = decodeURIComponent(match[1]);
					var value = decodeURIComponent(match[2]);
					if(name in result && !Array.isArray(result[name])) {
						result[name] = [result[name]];
					}
					if(Array.isArray(result[name])) {
						result[name].push(value);
					} else {
						result[name] = value;
					}
				}
			}
			return result;
		},

		// generate random string based on current time
		random_string : function() {
			var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
			var number = new Date().getTime();

			var result = [];
			while(number) {
				var y = number % range.length;
				result.unshift(range[y])
				number = Math.floor(number/range.length);
			}
			return result.join('');
		},

		// history push state
		pushState : function($section, $title, $url, replace) {

			// blur tabbar and sidebar links
			$('#wlm3-tabbar a').blur();
			$('#wlm3-sidebar a').blur();
			

			var $state = {
				source : 'wlm3',
				section : $section,
				title : $title ? $title : '',
				url : $url
			}
			if(replace === true) {
				history.replaceState ($state, $title, $url);
			} else {
				history.pushState ($state, $title, $url);
			}
		},

		popState : function(e) {
			if(!e.state) {
				$('#the-content').load_screen(window.parent.location.href, window.parent.document.title);
			} else {
				if(e.state.source == 'wlm3') {
					if(e.state.section == 'hash-only') {
						$('a[href="'+e.state.url+'"].nav-link').each(function () {
							$(this).tab('show');
						});
					} else {
						var section = e.state.section;

						var prevurl = document.cookie.match(/\bwlm3url=(.+?);/)[1].split('/');
						var url = decodeURIComponent(e.state.url).match(/\bwl=([^&]+)/)[1].split('/');
						if(prevurl[0] != url[0] || prevurl[1] != url[1]) {
							section = 'the-content';
						} else {
							section = 'the-screen';
						}
						
						var screen = '#' + section;
						$(screen).load_screen(e.state.url, e.state.title);
					}
					if(e.state.title) {
						window.parent.document.title = e.state.title;
					}
				}
			}
		},

		// popover executor
		popover : {
			init : function() {
				$(document).popover({
					html: true,
					trigger: 'click',
					selector: '.wlm-popover',
					container: $(this).closest('.modal-body').length ? '.modal-body' : '#the-screen',
					content: function() {
						return wlm.popover.getval('content', this);
					},
					title: function() {
						return wlm.popover.getval('title', this);
					},
					placement: function() {
						return wlm.popover.getval('placement', this.element);
					}
				}).on('show.bs.popover', function(e) {
					wlm.popover.event('show', e);
				}).on('shown.bs.popover', function(e) {
					wlm.popover.event('shown', e);
				}).on('hide.bs.popover', function(e) {
					wlm.popover.event('hide', e);
				}).on('hidden.bs.popover', function(e) {
					wlm.popover.event('hidden', e);
				}).on('inserted.bs.popover', function(e) {
					wlm.popover.event('inserted', e);
				}).on('click', '.wlm-popover', function(e) {
					return false;
				});

				// run init stuff
				$.each(wlm.popovers, function(k, v) {
					if(typeof v.init == 'function') {
						v.init();
					}
				});
			},
			getval : function(fxn, obj) {
				var $me = $(obj);
				var result = '';
				$.each(wlm.popovers, function(k, v) {
					if($me.hasClass(v.class)) {
						if(typeof v.options[fxn] == 'function') {
							result = v.options[fxn](obj);
							return false;
						}
					}
				});
				return result;
			},
			event : function(fxn, e) {
				var $me = $(e.target);
				$.each(wlm.popovers, function(k, v) {
					if($me.hasClass(v.class)) {
						if(typeof v.events[fxn] == 'function') {
							v.events[fxn](e);
							return false;
						}
					}
				});
			}
		},

		// our popovers
		popovers : [
			// clipboard popover
			{
				class : 'clipboard',
				init : function() {
					// rudimentary clipboard handling
					$('html').click(function(e) {
						var target = $(e.target);
						if(!target.closest('.clipboard-popover').length) {
							$('.clipboard-popover').popover('hide');
						}
					}).keydown(function(e) {
						if(e.keyCode == 27) {
							$('.clipboard-popover').popover('hide');
						}
					});
					$('body').on('blur', '.clipboard-content', function() {
						$(this).focus().click();
					}).on('focus click', '.clipboard-content', function() {
						$(this).select_text();
					});
				},
				options : {
					content: function(el) {
						var x = $('.clipboard-template').clone();
						var c = '';
						if($(el).data('target')) {
							c = $($(el).data('target')).val();
						} else if ($(el).data('function')) {
							c = $(el).data('function')();
						} else {
							c = $(el).data('text');
						}
						c = $.trim(c);

						x.find('.clipboard-content').first().text(c);
						return x.html();
					},
					title: function(el) {
						return wp.i18n.__( 'Clipboard', 'wishlist-member' );
					},
					placement: function(el) {
						return 'auto';
					}
				},
				events : {
					show : function(e) {
						if(!$(e.target).data('text')) return false;
						var p = $($(e.target).data('bs.popover').tip);
						p.css('max-width', '500px').css('width','auto').addClass('clipboard-popover');
					},
					shown: function(e) {
						var p = $($(e.target).data('bs.popover').tip);
						var t = p.find('.clipboard-content').first();
						t.focus().click();
					},
					hide : null,
					hidden : function(e) {
					    $(e.target).data("bs.popover").inState = { click: false, hover: false, focus: false }
					},
					inserted : null
				}
			},
		],

		richtext : function( options ) {

			setTimeout(function() {
				var settings = {
					selector: 'textarea.richtext',
					relative_urls: false,
					remove_script_host: false,
					convert_urls: true,
					height: 100,
					menubar: false,
					branding: false,
					plugins: 'advlist anchor charmap code colorpicker contextmenu fullpage hr link lists nonbreaking pagebreak searchreplace table textcolor textpattern',
					external_plugins: WLM3VARS.tinymce_external_plugins,
					toolbar1: 'styleselect | bold italic forecolor | alignleft aligncenter alignright alignjustify  | numlist bullist | table link | code | undo redo',
					  browser_spellcheck: true,
				}

				$.extend( settings, options ? options : {} );

				settings.init_instance_callback = function(editor) {
					var content = $(editor.targetElm).val();
					if(!content.match(/<(\/p|br|br\s*\/)>/)) {
						content = content.replace(/\n{1}/g, '<br>');
					}
					editor.setContent(content.replace(/<\/p>\s+<p>/g, '</p><p>'));

					editor.on('KeyUp, Change', function(e) {
						$(this.targetElm).val(this.getContent().replace(/<\/p>\s+<p>/g, '</p><p>'));
					});

					editor.on('focus', function(e) {
						var select = $(this.targetElm).closest('.row').find('.insert_text_at_caret');
						var t = '[name="' +$(this.targetElm).attr("name") + '"]';
						if ( select.data('select2') ) select.select2('destroy');
						select.data('target', t).select2({theme:"bootstrap"});
					});
				}
        
        /**
         * URL Converter Callback. Prevents mergecodes from being converted.
         * Calls TinyMCE's built-in converter if url does not look like a mergecode.
         *
         * See https://www.tiny.cloud/docs-4x/configure/url-handling/#urlconverter_callback for parameter documentation
         */
        settings.urlconverter_callback = function(url, node, on_save, name) {
          if(url.substring(0,1) == '[') { // looks like a mergecode
            // no url transformations for mergecodes
            return url;
          } else {
            // call tinymce's url converter
            // but we need to prevent and infinite so loop so...
            // ...first we save ourself...
            var x = this.settings.urlconverter_callback;
            // ...then remove ourself from tinymce's settings...
            this.settings.urlconverter_callback = false;
            // ...then call tinymce's url converter function...
            var url = this.convertURL(url, name, node);
            // ...restore ourself...
            this.settings.urlconverter_callback = x;
            // ...and return the converted URL.
            return url;
          }
        }

				// tinymce
				tinymce.remove(settings.selector);
				tinymce.init( settings );

				// Fix for tinymce link button fields not working in Firefox.
				$(document).on('focusin', function(e) {
			    if ($(e.target).closest(".mce-window").length) {
			    	e.stopImmediatePropagation();
			    }
				});
				
			}, 10);

			// $(settings.selector).removeClass('richtext');
		}
	}

	// registration form defaults
	wlm.regform_defaults = {};

}( jQuery ));
