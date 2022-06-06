/**
 * Thrive Headline Optimizer Models and Collections
 */

var TVO_Front = TVO_Front || {};
TVO_Front.models = TVO_Front.models || {};
TVO_Front.collections = TVO_Front.collections || {};

(function ( $ ) {

	Backbone.emulateHTTP = true;

	/**
	 * Base Model and Collection
	 */
	TVO_Front.models.Base = Backbone.Model.extend( {
		idAttribute: 'id',
		/**
		 * Set nonce header before every Backbone sync.
		 *
		 * @param {string} method.
		 * @param {Backbone.Model} model.
		 * @param {{beforeSend}, *} options.
		 * @returns {*}.
		 */
		sync: function ( method, model, options ) {
			var beforeSend;

			options = options || {};

			options.cache = false;

			if ( ! _.isUndefined( TVO_Front.nonce ) && ! _.isNull( TVO_Front.nonce ) ) {
				beforeSend = options.beforeSend;

				options.beforeSend = function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', TVO_Front.nonce );

					if ( beforeSend ) {
						return beforeSend.apply( this, arguments );
					}
				};
			}

			return Backbone.sync( method, model, options );
		}
	} );

	TVO_Front.collections.Base = Backbone.Collection.extend( {
		/**
		 * Set nonce header before every Backbone sync.
		 *
		 * @param {string} method.
		 * @param {Backbone.Model} model.
		 * @param {{beforeSend}, *} options.
		 * @returns {*}.
		 */
		sync: function ( method, model, options ) {
			var beforeSend;

			options = options || {};
			options.cache = false;
			options.url = this.url;

			if ( ! _.isUndefined( TVO_Front.nonce ) && ! _.isNull( TVO_Front.nonce ) ) {
				beforeSend = options.beforeSend;

				options.beforeSend = function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', TVO_Front.nonce );

					if ( beforeSend ) {
						return beforeSend.apply( this, arguments );
					}
				};
			}

			return Backbone.sync( method, model, options );
		}
	} );


	TVO_Front.models.Shortcode = TVO_Front.models.Base.extend( {
		url: function () {
			return TVO_Front.routes.shortcodes + '/' + this.get( 'id' );
		}
	} );

	TVO_Front.collections.Shortcodes = TVO_Front.collections.Base.extend( {
		model: TVO_Front.models.Shortcode,
		url: TVO_Front.routes.shortcodes,
		parse: function ( response ) {
			response.forEach( function ( shortcode ) {
				if ( TVO_Front.selected_template && (shortcode.id == TVO_Front.selected_template) ) {
					shortcode.active = 1;
				} else {
					shortcode.active = 0;
				}
				shortcode.display = shortcode.config.display;
				shortcode.testimonials = shortcode.config.testimonials.length;
				if ( shortcode.config.tags ) {
					shortcode.tags = shortcode.config.tags.length;
				} else {
					shortcode.tags = 0;
				}
			} );
			return response;
		},
		comparator: function ( model ) {
			return - model.get( 'id' );
		}
	} );

	TVO_Front.models.Tag = TVO_Front.models.Base.extend( {} );

	TVO_Front.collections.Tags = TVO_Front.collections.Base.extend( {
		model: TVO_Front.models.Tag,
		url: TVO_Front.routes.tags
	} );

	TVO_Front.models.Testimonial = TVO_Front.models.Base.extend( {} );

	TVO_Front.collections.Testimonials = TVO_Front.collections.Base.extend( {
		model: TVO_Front.models.Testimonial,
		url: TVO_Front.routes.testimonials
	} );


})( jQuery );;/**
 * Thrive Ovation Routers
 */

var TVO_Front = TVO_Front || {};
TVO_Front.objects = TVO_Front.objects || {};

(function ( $ ) {
	var Router = Backbone.Router.extend( {
		$element: '#tvo-testimonial-display',
		view: null,
		routes: {
			'start': 'start',
			'pre-select': 'preSelect',
			'select-testimonials(/:id)': 'selectTestimonials',
			'select-tags(/:id)': 'selectTags',
			'display-options': 'displayOptions',
			'save-list': 'saveList'
		},
		backNextButtons: function ( back, next ) {
			if ( back.length === 0 ) {
				$( '.tvo-back' ).attr( 'href', '' ).hide();
			} else {
				$( '.tvo-back' ).attr( 'href', '#' + back ).show();
			}

			if ( next.length === 0 ) {
				$( '.tvo-next' ).attr( 'href', '' ).hide();
			} else {
				$( '.tvo-next' ).attr( 'href', '#' + next ).show();
			}
		},
		start: function () {

			if ( this.view ) {
				this.view.remove();
			}

			if ( typeof TVO_Front.preloader !== 'undefined' ) {
				TVO_Front.preloader.show();
			}

			this.backNextButtons( '', '' );

			TVO_Front.objects.Shortcodes = new TVO_Front.collections.Shortcodes();

			var view = this.view = new TVO_Front.views.Shortcodes( {
				collection: TVO_Front.objects.Shortcodes
			} );

			TVO_Front.objects.selectedTestimonials = new TVO_Front.collections.Testimonials();
			TVO_Front.objects.selectedTags = [];
			TVO_Front.objects.editShortcode = '';

			TVO_Front.objects.Shortcodes.fetch( {
				data: {
					type: 'display'
				},
				success: function () {
					view.render();
				}
			} );

			$( this.$element ).html( this.view.$el );

		},
		preSelect: function () {
			if ( this.view ) {
				this.view.remove();
			}

			TVO_Front.objects.selectedTestimonials = new TVO_Front.collections.Testimonials();
			TVO_Front.objects.selectedTags = [];

			this.view = new TVO_Front.views.PreSelectView();

			this.backNextButtons( '', '' );

			$( this.$element ).html( this.view.render().$el );
		},
		selectTestimonials: function ( id ) {
			if ( this.view ) {
				this.view.remove();
			}

			if ( typeof TVO_Front.preloader !== 'undefined' ) {
				TVO_Front.preloader.show();
			}

			this.backNextButtons( 'pre-select', 'display-options' );

			TVO_Front.objects.currentSelection = 'testimonials';

			TVO_Front.objects.Testimonials = new TVO_Front.collections.Testimonials();

			var self = this;

			TVO_Front.objects.Testimonials.fetch( {
				data: {
					status: TVO_Front.const.ready_to_display_status
				},
				success: function () {
					var _testimonials;
					if ( ! id || isNaN( id ) ) {
						_testimonials = TVO_Front.active_config ? TVO_Front.active_config.testimonials : [];
					} else {
						var _current = TVO_Front.objects.Shortcodes.get( id );
						_testimonials = _current.get( 'config' ).testimonials;

						TVO_Front.objects.editShortcode = id;
					}

					if ( TVO_Front.objects.selectedTestimonials.length === 0 ) {
						for ( var i in _testimonials ) {
							TVO_Front.objects.selectedTestimonials.add( TVO_Front.objects.Testimonials.get( _testimonials[i] ) );
						}
					}

					self.view.render();
				}
			} );

			this.view = new TVO_Front.views.SelectTestimonials();

			$( this.$element ).html( this.view.$el );
		},
		selectTags: function ( id ) {

			if ( this.view ) {
				this.view.remove();
			}

			if ( typeof TVO_Front.preloader !== 'undefined' ) {
				TVO_Front.preloader.show();
			}

			this.backNextButtons( 'pre-select', 'save-list' );

			TVO_Front.objects.currentSelection = 'tags';

			TVO_Front.objects.Tags = new TVO_Front.collections.Tags();

			TVO_Front.objects.Tags.fetch( {
				success: function () {
					var _tags;

					if ( ! id || isNaN( id ) ) {
						_tags = TVO_Front.active_config ? TVO_Front.active_config.tags : [];
						TVO_Front.objects.max_testimonials = TVO_Front.active_config ? TVO_Front.active_config.max_testimonials : 100;
					} else {
						var _current = TVO_Front.objects.Shortcodes.get( id );
						_tags = _current.get( 'config' ).tags;

						TVO_Front.objects.editShortcode = id;
						TVO_Front.objects.max_testimonials = _current.max_testimonials;
					}

					if ( TVO_Front.objects.selectedTags.length === 0 ) {
						TVO_Front.objects.selectedTags = _tags instanceof Array ? _tags : [];
						TVO_Front.objects.selectedTags = TVO_Front.objects.selectedTags.map( function ( x ) {
							return parseInt( x, 10 );
						} );
					}

					TVO_Front.objects.TagsList.render();
				}
			} );

			TVO_Front.objects.TagsList = this.view = new TVO_Front.views.SelectTags();

			if ( ! ( TVO_Front.objects.selectedTags instanceof Array ) ) {
				TVO_Front.objects.selectedTags = [];
			}

			$( this.$element ).html( this.view.$el );
		},
		displayOptions: function () {
			if ( this.view ) {
				this.view.remove();
			}

			this.backNextButtons( 'select-testimonials', 'save-list' );

			if ( ! TVO_Front.objects.selectedTestimonials || TVO_Front.objects.selectedTestimonials.length === 0 ) {
				this.selectTestimonials();
				return;
			}

			if ( TVO_Front.objects.selectedTestimonials.length < 2 ) {
				this.saveList();
				return;
			}

			this.view = new TVO_Front.views.TestimonialDisplayOptions( {
				collection: TVO_Front.objects.selectedTestimonials
			} );

			$( this.$element ).html( this.view.render().$el );
		},
		saveList: function () {
			if ( this.view ) {
				this.view.remove();
			}

			var backView;
			if ( TVO_Front.objects.currentSelection === 'testimonials' ) {
				if ( TVO_Front.objects.selectedTestimonials.length > 1 ) {
					backView = 'display-options';
				} else {
					backView = 'select-testimonials';
				}
			} else {
				backView = 'select-tags';
			}

			this.backNextButtons( backView, '' );

			TVO_Front.objects.Testimonials = new TVO_Front.collections.Testimonials();

			this.view = new TVO_Front.views.SaveTestimonialList( {
				collection: TVO_Front.objects.Testimonials
			} );

			$( this.$element ).html( this.view.render().$el );
		}
	} );

	$( function () {
		parent.location.hash = '';
		TVO_Front.router = new Router;

		/* when clicking the menu, we reset the route */
		$( document ).on( 'click', '#tvo_display_testimonial_settings, #tvo_display_testimonial_template', function () {
			document.location.hash = '';
		} );
	} );
})( jQuery );;var TVO_Front = TVO_Front || {};
TVO_Front.views = TVO_Front.views || {};
TVO_Front.objects = TVO_Front.objects || {};

_.templateSettings = {
	evaluate: /<#([\s\S]+?)#>/g,
	interpolate: /<#=([\s\S]+?)#>/g,
	escape: /<#-([\s\S]+?)#>/g
};

( function ( $ ) {
	$( function () {

		TVO_Front.tpl = function ( tpl_path, opt ) {
			var _html = $( 'script#tve-' + tpl_path.replace( /\//g, '-' ) ).html() || '';
			if ( opt ) {
				return _.template( _html )( opt );
			}
			return _.template( _html );
		};

		TVO_Front.views.GenericItem = Backbone.View.extend( {
			initialize: function ( options ) {
				this.template = TVO_Front.tpl( options.template );
			},
			render: function () {

				this.$el.html( this.template() );

				return this;
			}
		} );

		TVO_Front.views.Shortcodes = Backbone.View.extend( {
			events: {
				'click .tvo-create-testimonial-list': 'createShortcode'
			},
			initialize: function () {
				this.template = TVO_Front.tpl( 'create-testimonial' );
			},
			renderOne: function ( item ) {
				/* don't display empty templates */
				if ( item.get( 'testimonials' ) == 0 && item.get( 'tags' ) == 0 ) {
					return;
				}

				var view = new TVO_Front.views.ShortcodeItem( {
					template: 'shortcode-box',
					className: 'tvo-shortcode-box-container tvo-row',
					model: item
				} );

				this.$( '#tvo-testimonial-shortcode-list' ).prepend( view.render().$el );
			},
			render: function () {
				this.$el.html( this.template() );

				this.$( '#tvo-testimonial-shortcode-list .tvo-shortcode-box' ).not( '.tvo-create-testimonial-list' ).remove();

				this.collection.sort();

				this.collection.each( this.renderOne, this );

				if ( typeof TVO_Front.preloader !== 'undefined' ) {
					TVO_Front.preloader.hide();
				}

				return this;
			},
			createShortcode: function () {
				delete TVO_Front.active_config;
			}
		} );

		TVO_Front.views.ShortcodeItem = Backbone.View.extend( {
			events: {
				'click .tvo-edit-title': 'editTitle',
				'change .tvo-edit-title-input': 'saveTitle',
				'keyup .tvo-edit-title-input': 'saveTitleKeyup',
				'blur .tvo-edit-title-input': 'closeEditTitle',
				'click .tvo-copy-shortcode': 'copyShortcode',
				'click .tvo-delete-shortcode': 'deleteShortcode',
				'click .tvo-existing-shortcode-template': 'selectExistingTemplate'
			},
			initialize: function ( options ) {
				this.template = TVO_Front.tpl( options.template );
			},
			render: function () {
				this.$el.html( this.template() );

				return this;
			},
			editTitle: function ( e ) {
				var self = this,
					$target = $( e.currentTarget ),
					$title = self.$( '.tvo-testimonial-title' ).hide(),
					$input = self.$( '.tve_lightbox_input' );

				$input.show().val( $title.text().trim() ).focus().select();
				$target.hide();

				e.stopPropagation();
			},
			saveTitle: function ( e ) {
				var new_title = e.currentTarget.value;

				if ( new_title != this.model.get( 'name' ) ) {
					this.model.set( 'name', new_title );
					this.$( '.tvo-testimonial-edit-title-box .tvo-testimonial-title' ).html( new_title );
					this.model.save();
				}

				this.closeEditTitle();
			},
			saveTitleKeyup: function ( e ) {
				if ( e.which === 27 ) {
					this.closeEditTitle();
				} else if ( e.which === 13 ) {
					this.saveTitle()
				}
			},
			closeEditTitle: function () {
				this.$( '.tvo-edit-title-input' ).hide();
				this.$( '.tvo-testimonial-title,.tvo-edit-title' ).show();
			},
			copyShortcode: function () {
				var copy,
					attributes = this.model.attributes;
				delete attributes.id;
				attributes.type = attributes.config.type;
				$.ajax( {
					headers: {
						'X-WP-Nonce': TVO_Front.nonce
					},
					cache: false,
					url: TVO_Front.routes.shortcodes,
					type: 'POST',
					data: attributes
				} ).done( function ( response ) {
					TVO_Front.router.start();
				} ).always( function () {
				} );
			},
			deleteShortcode: function () {
				var self = this;
				this.model.destroy( {
					success: function ( model, response ) {
						self.$el.remove();
					}
				} );
			},
			selectExistingTemplate: function () {
				var config = this.model.get( 'config' );
				config.template = TVO_Front.init_template;
				$( document ).trigger( 'tvo.get.shortcode', config );
			}
		} );

		TVO_Front.views.PreSelectView = Backbone.View.extend( {
			currentSelection: '',
			events: {
				'click .tvo-select-tags': 'selectTags',
				'click .tvo-select-testimonials': 'selectTestimonials'
			},
			initialize: function ( options ) {
				this.template = TVO_Front.tpl( 'pre-select' );
			},
			render: function () {
				this.$el.html( this.template() );

				if ( typeof TVO_Front.preloader !== 'undefined' ) {
					TVO_Front.preloader.hide();
				}

				return this;
			},
			selectTags: function () {
				TVO_Front.router.navigate( '#select-tags', {trigger: true} );
			},
			selectTestimonials: function () {
				TVO_Front.router.navigate( '#select-testimonials', {trigger: true} );
			}

		} );

		TVO_Front.views.SelectTestimonials = Backbone.View.extend( {
			className: 'tve_scT tve_green',
			testimonialsPagination: null,
			events: {
				'click .tvo-testimonial-item': 'addTestimonial',
				'keyup .tvo-testimonials-search': 'searchTestimonials',
				'change #tvo-testimonial-select-all': 'checkUncheckTestimonials',
				'change .tvo-filter-content': 'filterContent'
			},
			initialize: function () {
				this.template = TVO_Front.tpl( 'select-testimonials' );
			},
			updateTestimonialCount: function ( count ) {
				this.$( '.tvo_testimonials_count b' ).html( count );
			},
			addTestimonial: function ( e ) {
				var id = parseInt( e.currentTarget.value, 10 );

				if ( e.currentTarget.checked ) {
					TVO_Front.objects.selectedTestimonials.push( TVO_Front.objects.Testimonials.get( id ) );
				} else {
					var model = TVO_Front.objects.selectedTestimonials.get( id );
					if ( model ) {
						TVO_Front.objects.selectedTestimonials.remove( model );
					}
				}

				this.updateTestimonialCount( TVO_Front.objects.selectedTestimonials.length );
				this.showContinueButton();
			},
			showContinueButton: function () {
				if ( TVO_Front.objects.selectedTestimonials.length > 0 ) {
					jQuery( '.tvo-next' ).show();
				} else {
					jQuery( '.tvo-next' ).hide();
				}
			},
			filterContent: function ( event ) {
				if ( event.currentTarget.value === 'summary' ) {
					this.$( '.tvo-testimonial-content-full' ).addClass( 'tvd-hide' );
				} else {
					this.$( '.tvo-testimonial-content-summary' ).addClass( 'tvd-hide' );
				}
				this.$( '.tvo-testimonial-content-' + event.currentTarget.value ).removeClass( 'tvd-hide' );
			},
			checkUncheckTestimonials: function ( ev ) {
				var elem = jQuery( ev.currentTarget );
				this.$( '.tvo-testimonial-item' ).each( function () {
					var $item = $( this );
					if ( $item.is( ':checked' ) !== elem.is( ':checked' ) ) {
						$item.trigger( 'click' );
					}
				} );
				this.showContinueButton();
			},
			searchTestimonials: function () {
				var text = this.$( '.tvo-testimonials-search' ).val(),
					tags_arr = this.$( '#tvo-filter-tags' ).val(),
					title_filter = this.$( "#tvo-filter-title" ).val(),
					image_filter = this.$( "#tvo-filter-image" ).val(),
					count_from = this.$( "#tvo-from-value" ).val(),
					count_to = this.$( "#tvo-to-value" ).val(),
					check_word_count = this.$( '#tvo-testimonial-word-count-check' ).is( ':checked' );

				this.testimonialsPagination.changePage( null, {
					search_by: text,
					tags: tags_arr,
					title_filter: title_filter,
					image_filter: image_filter,
					count_from_filter: count_from,
					count_to_filter: count_to,
					check_word_count: check_word_count
				} );
			},
			renderSelectTags: function () {
				var select = this.$( '#tvo-filter-tags' ),
					self = this;

				if ( select.data( 'select2' ) ) {
					select.select2( 'destroy' );
				}

				select.select2( {
					tags: true,
					multiple: true,
					data: TVO_Front.all_tags,
					placeholder: 'Select tags to filter content'
				} ).on( "select2:select", function ( e ) {
					self.searchTestimonials();
				} ).on( "select2:unselect", function ( evt ) {
					if ( !evt.params.originalEvent ) {
						return;
					}
					self.searchTestimonials();
					evt.params.originalEvent.stopPropagation();
				} );

			},
			renderFilterTitle: function () {
				var select = this.$( '#tvo-filter-title' ),
					self = this;

				select.on( "change", function ( e ) {
					//if any is selected return to the initial value
					if ( select.val() === 'any' ) {
						select.val( 'select-title' )
					}

					self.searchTestimonials();
				} )

			},
			renderFilterImage: function () {
				var select = this.$( '#tvo-filter-image' ),
					self = this;

				select.on( "change", function ( e ) {

					//if any is selected return to the initial value
					if ( select.val() === 'any' ) {
						select.val( 'select-image' );
					}

					self.searchTestimonials();
				} );
			},
			renderWordCount: function () {
				var inputFrom = this.$( '#tvo-from-value' ),
					inputTo = this.$( '#tvo-to-value' ),
					checkBox = this.$( '#tvo-testimonial-word-count-check' ),
					errorElem = this.$( '.tvo-filter-error-message' ),
					self = this;

				inputFrom.keyup( function ( ev ) {
					self.searchWordCount( ev, inputFrom, inputTo, checkBox, errorElem )
				} );

				inputTo.keyup( function ( ev ) {
					self.searchWordCount( ev, inputFrom, inputTo, checkBox, errorElem )
				} );

				checkBox.change( function ( ev ) {
					if ( !checkBox.is( ':checked' ) ) {
						self.searchTestimonials();
					} else {
						self.searchWordCount( ev, inputFrom, inputTo, $( this ), errorElem );
					}
				} );

			},
			searchWordCount: function ( ev, inputFrom, inputTo, checkBox, errorElem ) {
				var self = this,
					doSearch = true,
					fromValue = inputFrom.val(),
					toValue = inputTo.val(),
					re = new RegExp( "^([0-9]*)$" );

				if ( ev.keyCode === 13 || checkBox.is( ':checked' ) ) {

					if ( parseInt( toValue ) < parseInt( fromValue ) ) {
						self.showErrorMessage( inputFrom, inputTo, errorElem, TVO_Front.translations.bigger_value );
						doSearch = false;
					}

					if ( !re.test( toValue ) || !re.test( fromValue ) ) {
						self.showErrorMessage( inputFrom, inputTo, errorElem, TVO_Front.translations.only_numbers );
						doSearch = false;
					}
					//include here the case where the checkbox is checked and not value is set on inputs
					if ( doSearch || ( fromValue == '' && toValue == '' ) ) {
						errorElem.hide();
						self.searchTestimonials();
					}
				}
			},
			showErrorMessage: function ( inputFrom, inputTo, errorElem, message ) {
				errorElem.show();
				errorElem.html( message );
			},
			render: function () {
				this.$el.html( this.template() );
				this.renderSelectTags();
				this.renderFilterTitle();
				this.renderFilterImage();
				this.renderWordCount();

				this.$( '#tvo-testimonials-list' ).empty();

				TVO_Front.objects.TestimonialsList = new TVO_Front.views.TestimonialsList( {
					collection: TVO_Front.objects.Testimonials,
					el: this.$( '#tvo-testimonials-list' )
				} );

				this.testimonialsPagination = new TVO_Front.views.TestimonialPagination( {
					collection: TVO_Front.objects.Testimonials,
					view: TVO_Front.objects.TestimonialsList,
					el: this.$( '.tvo-top-pagination' ),
					type: 'static'
				} );

				this.testimonialsPagination.changePage( null, {} );
				this.updateTestimonialCount( TVO_Front.objects.selectedTestimonials.length );
				this.showContinueButton();

				if ( typeof TVO_Front.preloader !== 'undefined' ) {
					TVO_Front.preloader.hide();
				}

				return this;
			}
		} );

		TVO_Front.views.SelectTags = Backbone.View.extend( {
			className: 'tve_scT tve_green',
			events: {
				'click .tvo-tag-item': 'addTag',
				'change .tvo_max_testimonials': 'saveMaxTestimonials'
			},
			initialize: function () {
				this.template = TVO_Front.tpl( 'select-tags' );
			},
			updateTagCount: function ( count ) {
				this.$( '.tvo_tags_count b' ).html( count );
			},
			addTag: function ( e ) {
				var id = parseInt( e.currentTarget.value, 10 ),
					index = TVO_Front.objects.selectedTags.indexOf( id );

				if ( e.currentTarget.checked ) {
					TVO_Front.objects.selectedTags.push( id );
				} else {
					TVO_Front.objects.selectedTags.splice( index, 1 );
				}

				this.updateTagCount( TVO_Front.objects.selectedTags.length );
				this.showContinueButton();
			},
			showContinueButton: function () {
				if ( TVO_Front.objects.selectedTags.length > 0 ) {
					jQuery( '.tvo-next' ).show();
				} else {
					jQuery( '.tvo-next' ).hide();
				}
			},
			render: function () {
				this.$el.html( this.template( {
					max_testimonials: TVO_Front.objects.max_testimonials
				} ) );

				this.$( '#tvo-tags-list' ).empty();

				TVO_Front.objects.Tags.each( this.renderTag, this );

				$( '.tvo-next' ).hide();

				this.updateTagCount( TVO_Front.objects.selectedTags.length );
				this.showContinueButton();

				if ( typeof TVO_Front.preloader !== 'undefined' ) {
					TVO_Front.preloader.hide();
				}

				return this;
			},
			renderTag: function ( item ) {
				item.set( 'checked', TVO_Front.objects.selectedTags.indexOf( item.get( 'id' ) ) !== - 1 );
				var view = new TVO_Front.views.GenericItem( {
					model: item,
					template: 'tag-item',
					className: 'tvo-col tvo-l4 tvo-m6 tvo-s12'
				} );

				this.$( '#tvo-tags-list' ).append( view.render().$el );
			},
			saveMaxTestimonials: function ( event ) {
				TVO_Front.objects.max_testimonials = event.currentTarget.value;
			}
		} );

		TVO_Front.views.TestimonialsList = Backbone.View.extend( {
			render: function ( collection ) {
				this.$el.empty();
				var c = this.collection;
				if ( typeof collection !== 'undefined' ) {
					c = new TVO_Front.collections.Testimonials( collection );
				}

				c.each( this.renderOne, this );
				return this;
			},
			renderOne: function ( item ) {
				item.set( 'tagNames', this.getTags( item.get( 'tags' ) ) );

				/* if this item has the id in the selected testimonials, then we mark it as checked */
				item.set( 'checked', typeof TVO_Front.objects.selectedTestimonials.get( item.get( 'id' ) ) !== 'undefined' );

				var view = new TVO_Front.views.GenericItem( {
						model: item,
						template: 'testimonial-item',
						className: 'tvo-testimonial-item tvo-row tvo-collapse'
					} ),
					el = view.render().$el;
				this.$el.append( el );
			},
			getTags: function ( ids ) {
				var names = [];

				_.each( ids, function ( v, k ) {
					TVO_Front.all_tags.filter( function ( item ) {
						if ( item.id == v.id ) {
							names.push( item.text );
						}
					} );

				} );
				return names;
			}
		} );

		TVO_Front.views.TestimonialDisplayOptions = Backbone.View.extend( {
			events: {
				'click .tvo-randomize-testimonials': 'randomizeTestimonials'
			},
			testimonials: [],
			initialize: function () {
				this.template = TVO_Front.tpl( 'display-options' );
			},
			renderOne: function ( item ) {
				var view = new TVO_Front.views.GenericItem( {
					model: item,
					template: 'testimonial-order',
					className: 'tvo-testimonial-order-item',
					attributes: {
						'data-id': item.get( 'id' )
					}
				} );

				this.$( '.tvo-testimonials-list-order' ).append( view.render().$el );

				return this;
			},
			render: function () {
				this.$el.html( this.template() );

				var $testimonialList = this.$( '.tvo-testimonials-list-order' );

				$testimonialList.empty();

				$testimonialList.sortable( {
					placeholder: 'ui-sortable-placeholder',
					forcePlaceholderSize: true
				} );
				this.collection.each( this.renderOne, this );
				this.saveOrder();

				return this;
			},
			saveOrder: function () {
				var self = this,
					testimonialItem = self.$( '.tvo-testimonial-order-item' );

				$( '.tvo-next' ).on( 'click', function () {
					testimonialItem.each( function () {
						var $this = $( this ),
							index = $this.index(),
							id = $this.attr( 'data-id' );
						self.collection.get( id ).set( 'order', index );
					} );
				} );
			},
			randomizeTestimonials: function () {
				this.collection.reset( this.collection.shuffle(), {silent: true} );

				this.render();
			}
		} );

		TVO_Front.views.SaveTestimonialList = Backbone.View.extend( {
			events: {
				'click .tvo-save-template': 'displayTemplateSave',
				'click #tvo-display-testimonials-shortcode-wrapper': 'displayShortcode',
				'click .tvo-save-testimonial-shortcode': 'saveShortcode'
			},
			shortcode: {
				tags: [],
				testimonials: [],
				name: '',
				max_testimonials: 0,
				show_site: 1
			},
			initialize: function () {
				this.template = TVO_Front.tpl( 'save-testimonials-list' );
				this.setShortcodeConfig();
			},
			render: function () {
				this.$el.html( this.template( {
					count: TVO_Front.objects.currentSelection === 'testimonials' ? TVO_Front.objects.selectedTestimonials.length : TVO_Front.objects.selectedTags.length,
					selection: TVO_Front.objects.currentSelection
				} ) );

				return this;
			},
			setShortcodeConfig: function () {
				var testimonial_ids = [],
					tag_ids = [];

				if ( typeof TVO_Front.objects.selectedTestimonials === 'undefined' || TVO_Front.objects.currentSelection === 'tags' ) {
					this.shortcode.testimonials = [];
				} else {
					TVO_Front.objects.selectedTestimonials.forEach( function ( entry, i ) {
						var index = entry.get( 'order' );
						if ( typeof index !== 'undefined' ) {
							testimonial_ids[ index ] = entry.get( 'id' );
						} else {
							testimonial_ids[ i ] = entry.get( 'id' );
						}

					} );
					this.shortcode.testimonials = testimonial_ids;
				}

				if ( typeof TVO_Front.objects.selectedTags === 'undefined' || TVO_Front.objects.currentSelection === 'testimonials' ) {
					this.shortcode.tags = [];
				} else {
					TVO_Front.objects.selectedTags.forEach( function ( entry ) {
						tag_ids.push( entry );
					} );
					this.shortcode.tags = tag_ids;
					this.shortcode.max_testimonials = TVO_Front.objects.max_testimonials;
				}
			},
			displayTemplateSave: function () {
				$( '.tvo-template-name' ).show();
			},
			displayShortcode: function () {
				if ( typeof TVE !== 'undefined' ) {
					TVE.ActiveElement.attr( 'data-update-styles', 1 );
				}

				$( document ).trigger( 'tvo.get.shortcode', this.shortcode );
			},
			saveShortcode: function () {
				if ( typeof TVE !== 'undefined' ) {
					TVE.ActiveElement.attr( 'data-update-styles', 1 );
				}

				this.shortcode.name = this.$( '.tvo-display-testimonial-shortcode-name' ).val();

				$( document ).trigger( 'tvo.save.shortcode', this.shortcode );
			}
		} );

		/**
		 * Pagination View
		 */
		TVO_Front.views.TestimonialPagination = Backbone.View.extend( {
			events: {
				'click a.page': 'changePage',
				'change .tvo-items-per-page': 'changeItemPerPage'
			},
			currentPage: 1,
			pageCount: 1,
			itemsPerPage: 10,
			total_items: 0,
			collection: null,
			params: null,
			type: '',
			view: null,
			template: null,
			initialize: function ( options ) {
				this.collection = options.collection;
				this.view = options.view;
				this.type = options.type;
				this.template = TVO_Front.tpl( 'pagination/post-view' );
			},
			changeItemPerPage: function ( event ) {
				this.itemsPerPage = jQuery( event.target ).val();
				this.changePage( null, {page: 1} );
			},
			changePage: function ( event, args ) {
				var self = this,
					data = {
						itemsPerPage: this.itemsPerPage
					};

				/* Set the current page of the pagination. This can be changed by clicking on a page or by just calling this method with params */
				if ( event && typeof event.currentTarget !== 'undefined' ) {
					data.page = jQuery( event.currentTarget ).attr( 'value' );
				} else if ( args && typeof args.page !== 'undefined' ) {
					data.page = parseInt( args.page );
				} else {
					data.page = this.currentPage;
				}

				/* just to make sure */
				if ( data.page < 1 ) {
					data.page = 1;
				}

				/* Parse args sent to pagination */
				if ( typeof args !== 'undefined' ) {

					if ( typeof args.search_by !== 'undefined' ) {
						this.search_by = args.search_by;
					}

					if ( typeof args.tags !== 'undefined' ) {
						this.tags = args.tags;
					}

					if ( typeof args.title_filter !== 'undefined' ) {
						this.title_filter = args.title_filter;
					}

					if ( typeof args.image_filter !== 'undefined' ) {
						this.image_filter = args.image_filter;
					}

					if ( typeof args.count_from_filter !== 'undefined' ) {
						this.count_from_filter = args.count_from_filter;
					}

					if ( typeof args.count_to_filter !== 'undefined' ) {
						this.count_to_filter = args.count_to_filter;
					}

					if ( typeof args.count_to_filter !== 'undefined' ) {
						this.check_word_count = args.check_word_count;
					}
				}

				/* In case we've saved this before */
				data.search_by = this.search_by ? this.search_by : '';
				data.tags = this.tags ? this.tags : [];
				data.title_filter = this.title_filter ? this.title_filter : '';
				data.image_filter = this.image_filter ? this.image_filter : '';
				data.count_from_filter = this.count_from_filter ? this.count_from_filter : '';
				data.count_to_filter = this.count_to_filter ? this.count_to_filter : '';
				data.check_word_count = this.check_word_count;

				data.exclude = this.exclude ? this.exclude : [];

				/* A dynamic pagination, on search, gets data with an AJAX request */
				if ( this.type == 'dynamic' ) {
					this.collection.fetch( {
						reset: true,
						data: $.param( data ),
						success: function () {

							/* When we're on the last page and there are no elements to display,  */
							if ( self.collection.length === 0 && self.collection.total_count > 0 && self.currentPage != 1 ) {
								self.changePage( null, {page: self.currentPage - 1} );
								return;
							}

							self.updateParams( data.page, self.collection.total_count );
							self.render();
						}
					} );

					/* A static pagination, on search, gets data from within the collection, without any other calls */
				} else if ( this.type == 'static' && typeof this.view != 'undefined' && this.view != null ) {

					/* Prepare params for pagination render */
					this.updateParams( data.page, this.collection.length );

					var currentCollection = this.collection.clone(),
						from = (
							       this.currentPage - 1
						       ) * this.itemsPerPage,
						collectionSlice,
						removeIds = [];

					if ( typeof currentCollection.comparator !== 'undefined' ) {
						currentCollection.sort();
					}

					currentCollection.each( function ( model ) {
						//filter by text
						if ( data.search_by.length > 0 ) {
							var text = data.search_by,
								name = model.get( 'name' ) || '',
								content = model.get( 'content' ) || '';

							if ( name.toLowerCase().indexOf( text.toLowerCase() ) === - 1 && content.toLowerCase().indexOf( text.toLowerCase() ) === - 1 ) {
								removeIds.push( model );
							}
						}

						//filter by tags
						if ( data.tags.length > 0 ) {
							var removeModel = true,
								testimonial_tags = model.get( 'tags' ).map( function ( tag ) {
									return tag.id;
								} );

							for ( var i = 0; i < data.tags.length; i ++ ) {
								if ( testimonial_tags.indexOf( parseInt( data.tags[ i ] ) ) !== - 1 ) {
									removeModel = false;
								}
							}
							if ( removeModel ) {
								removeIds.push( model );
							}
						}

						//filter by title
						if ( data.title_filter != '' ) {
							var title = data.title_filter,
								modelTitle = model.get( 'title' ) || '';

							switch ( title ) {
								case 'with-title':
									if ( modelTitle == '' ) {
										removeIds.push( model );
									}
									break;
								case 'without-title':
									if ( modelTitle != '' ) {
										removeIds.push( model );
									}
									break;
								default:
									break;
							}
						}

						//filter by image
						if ( data.image_filter != '' ) {
							var image = data.image_filter;

							switch ( image ) {
								case 'with-image':
									if ( model.get( 'has_picture' ) == 0 ) {
										removeIds.push( model );
									}
									break;
								case 'without-image':
									if ( model.get( 'has_picture' ) == 1 ) {
										removeIds.push( model );
									}
									break;
								default:
									break;
							}
						}

						//filter by word count from ... to ...
						if ( data.check_word_count && data.count_from_filter != '' && data.count_to_filter != '' ) {
							var summary = model.get( 'summary' ),
								wordsCount = summary.match( /\b(\w+)\b/g ).length;

							if ( wordsCount < data.count_from_filter || wordsCount > data.count_to_filter ) {
								removeIds.push( model );
							}
						}
					} );

					for ( var i in removeIds ) {
						currentCollection.remove( removeIds[ i ] );
					}

					/* Update params one more time after the collection has been modified */
					this.updateParams( data.page, currentCollection.length );

					collectionSlice = currentCollection.chain().rest( from ).first( this.itemsPerPage ).value();
					/* render sliced view collection */
					this.view.render( collectionSlice );

					if ( collectionSlice.length === 0 ) {
						jQuery( '#tvo-testimonials-list' ).html( TVO_Front.tpl( 'pagination/no-results' ) );
					}

					/* render pagination */
					this.render();
				}
				return false;
			},
			updateParams: function ( page, total ) {
				this.currentPage = page;
				this.total_items = total;
				this.pageCount = Math.ceil( this.total_items / this.itemsPerPage );
			},
			setupParams: function ( page ) {
				this.currentPage = page;
				this.total_items = this.collection.length;
				this.pageCount = Math.ceil( this.total_items / this.itemsPerPage );
			},
			render: function () {
				this.$el.html( this.template( {
					currentPage: parseInt( this.currentPage ),
					pageCount: parseInt( this.pageCount ),
					total_items: parseInt( this.total_items ),
					itemsPerPage: parseInt( this.itemsPerPage )
				} ) );
				return this;
			}
		} );

	} );
} )( jQuery );