( function( $, _, Backbone, api, settings, partSettings ) {

	happyForms.classes.models.parts.table = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.table.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},

		initialize: function( attrs, options ) {
			happyForms.classes.models.Part.prototype.initialize.apply( this, arguments );

			this.attributes.columns = new ColumnCollection( this.get( 'columns' ), options );
			this.attributes.rows = new RowCollection( this.get( 'rows' ), options );
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply( this, arguments );
			json.columns = json.columns.toJSON();
			json.rows = json.rows.toJSON();

			return json;
		},
	} );

	var ColumnModel = Backbone.Model.extend( {
		defaults: partSettings.column,
	} );

	var ColumnCollection = Backbone.Collection.extend( {
		model: ColumnModel,
	} );

	var RowModel = Backbone.Model.extend( {
		defaults: partSettings.row,
	} );

	var RowCollection = Backbone.Collection.extend( {
		model: RowModel,
	} );

	var ColumnView = Backbone.View.extend( {
		template: '#customize-happyforms-table-column-template',

		events: {
			'click .delete-column': 'onDeleteClick',
			'keyup [name=label]': 'onLabelChange',
			'change [name=is_default]': 'onDefaultChange',
			'click .advanced-column': 'onAdvancedColumnClick',
			'keyup [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
		},

		initialize: function( options ) {
			this.template = _.template( $( this.template ).text() );
			this.part = options.part;

			this.listenTo( this, 'ready', this.onReady );
		},

		render: function() {
			this.setElement( this.template( this.model.toJSON() ) );
			return this;
		},

		onReady: function() {
			$( '[name=label]', this.$el ).trigger( 'focus' );
		},

		onAdvancedColumnClick: function( e ) {
			e.preventDefault();

			$( '.happyforms-part-item-advanced', this.$el ).slideToggle( 300, function() {
				$( e.target ).toggleClass( 'opened' );
			} );
		},

		onDeleteClick: function( e ) {
			e.preventDefault();

			this.model.collection.remove( this.model );
		},

		onLabelChange: function( e ) {
			this.model.set( 'label', $( e.target ).val() );
			this.part.trigger( 'change' );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onTableColumnLabelChangeCallback',
				options: {
					columnID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onDefaultChange: function( e ) {
			var isChecked = $( e.target ).is( ':checked' );

			if ( ! this.part.get( 'allow_multiple_selection' ) ) {
				this.part.get( 'columns' ).forEach( function( column ) {
					column.set( 'is_default', 0 );
				} );

				$( '[name=is_default]', this.$el.siblings() ).prop( 'checked', false );
			}

			this.model.set( 'is_default', isChecked ? 1 : 0 );
			$( e.target ).prop( 'checked', isChecked );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onTableColumnDefaultChangeCallback',
				options: {
					columnID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onItemLimitSubmissionsAmountChange: function( e ) {
			this.model.set( 'limit_submissions_amount', $( e.target ).val() );
			this.part.trigger( 'change' );
		},
	} );

	var RowView = Backbone.View.extend( {
		template: '#customize-happyforms-table-row-template',

		events: {
			'click .delete-row': 'onDeleteClick',
			'keyup [name=label]': 'onLabelChange',
		},

		initialize: function( options ) {
			this.template = _.template( $( this.template ).text() );
			this.part = options.part;

			this.listenTo( this, 'ready', this.onReady );
		},

		render: function() {
			this.setElement( this.template( this.model.toJSON() ) );
			return this;
		},

		onReady: function() {
			$( '[name=label]', this.$el ).trigger( 'focus' );
		},

		onDeleteClick: function( e ) {
			e.preventDefault();

			this.model.collection.remove( this.model );
		},

		onLabelChange: function( e ) {
			this.model.set( 'label', $( e.target ).val() );
			this.part.trigger( 'change' );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onTableRowLabelChangeCallback',
				options: {
					rowID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.parts.table = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-table-template',

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'click [data-happyforms-tab]': 'onTabClick',
			'click .add-column': 'onAddColumnClick',
			'click .add-row': 'onAddRowClick',
			'click .import-row': 'onImportRowClick',
			'click .import-column': 'onImportColumnClick',
			'click .import-options': 'onImportOptionsClick',
			'click .add-options': 'onAddOptionsClick',
			'change [data-bind=limit_choices_min]': 'refreshMinMaxChoices',
			'change [data-bind=limit_choices_max]': 'refreshMinMaxChoices',
		} ),

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.columnViews = new Backbone.Collection();
			this.rowViews = new Backbone.Collection();

			this.listenTo( this.model.get( 'columns' ), 'add', this.onColumnModelAdd );
			this.listenTo( this.model.get( 'columns' ), 'change', this.onColumnModelChange );
			this.listenTo( this.model.get( 'columns' ), 'remove', this.onColumnModelRemove );
			this.listenTo( this.model.get( 'columns' ), 'reset', this.onColumnModelsSorted );
			this.listenTo( this.columnViews, 'add', this.onColumnViewAdd );
			this.listenTo( this.columnViews, 'remove', this.onColumnViewRemove );
			this.listenTo( this.columnViews, 'reset', this.onColumnViewsSorted );

			this.listenTo( this.model.get( 'rows' ), 'add', this.onRowModelAdd );
			this.listenTo( this.model.get( 'rows' ), 'change', this.onRowModelChange );
			this.listenTo( this.model.get( 'rows' ), 'remove', this.onRowModelRemove );
			this.listenTo( this.model.get( 'rows' ), 'reset', this.onRowModelsSorted );
			this.listenTo( this.rowViews, 'add', this.onRowViewAdd );
			this.listenTo( this.rowViews, 'remove', this.onRowViewRemove );
			this.listenTo( this.rowViews, 'reset', this.onRowViewsSorted );

			this.listenTo( this, 'sort-stop-column', this.onColumnSortStop );
			this.listenTo( this, 'sort-stop-row', this.onRowSortStop );

			this.listenTo( this.model, 'change:allow_multiple_selection', this.onMultipleSelectionChange );
			this.listenTo( this.model, 'change:limit_choices', this.onLimitChoices );
			this.listenTo( this.model.get( 'rows' ), 'add remove', this.refreshMinMaxChoices );
			this.listenTo( this.model.get( 'columns' ), 'add remove', this.refreshMinMaxChoices );
			this.listenTo( this, 'ready', this.onReady );
		},

		onReady: function() {
			this.model.get( 'columns' ).each( function( columnModel ) {
				this.addColumnView( columnModel );
			}, this );

			this.model.get( 'rows' ).each( function( rowModel ) {
				this.addRowView( rowModel );
			}, this );

			$( '.column-list', this.$el ).sortable( {
				handle: '.happyforms-part-item-handle',
				helper: 'clone',

				stop: function ( e, ui ) {
					this.trigger( 'sort-stop-column', e, ui );
				}.bind( this ),
			} );

			$( '.row-list', this.$el ).sortable( {
				handle: '.happyforms-part-item-handle',
				helper: 'clone',

				stop: function ( e, ui ) {
					this.trigger( 'sort-stop-row', e, ui );
				}.bind( this ),
			} );
		},

		onColumnModelAdd: function( rowModel, rowsCollection, options ) {
			this.model.trigger( 'change' );
			this.addColumnView( rowModel, options );

			var model = this.model;

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		onColumnModelChange: function( rowModel ) {
			this.model.trigger( 'change' );
		},

		onColumnModelRemove: function( columnModel ) {
			this.model.trigger( 'change' );

			var columnViewModel = this.columnViews.find( function( viewModel ) {
				return viewModel.get( 'view' ).model.id === columnModel.id;
			}, this );

			this.columnViews.remove( columnViewModel );

			if ( this.model.get( 'columns' ).length == 0 ) {
				$( '.column-list', this.$el ).html( '' );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onTableColumnDeleteCallback',
				options: {
					itemID: columnModel.id,
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onColumnModelsSorted: function() {
			this.columnViews.reset( _.map( this.model.get( 'columns' ).pluck( 'id' ), function( id ) {
				return this.columnViews.get( id );
			}, this ) );
			this.model.trigger( 'change' );

			var model = this.model;

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		addColumnView: function( columnModel, options ) {
			var columnView = new ColumnView( _.extend( {
				model: columnModel,
				part: this.model,
			}, options ) );

			var columnViewModel = new Backbone.Model( {
				id: columnModel.id,
				view: columnView,
			} );

			this.columnViews.add( columnViewModel, options );
		},

		onColumnViewAdd: function( viewModel, collection, options ) {
			var columnView = viewModel.get( 'view' );
			$( '.column-list', this.$el ).append( columnView.render().$el );
			columnView.trigger( 'ready' );
		},

		onColumnViewRemove: function( viewModel ) {
			var columnView = viewModel.get( 'view' );
			columnView.remove();
		},

		onColumnSortStop: function( e, ui ) {
			var $sortable = $( '.column-list', this.$el );
			var ids = $sortable.sortable( 'toArray', { attribute: 'data-column-id' } );

			this.model.get( 'columns' ).reset( _.map( ids, function( id ) {
				return this.model.get( 'columns' ).get( id );
			}, this ) );
		},

		onRowSortStop: function( e, ui ) {
			var $sortable = $( '.row-list', this.$el );
			var ids = $sortable.sortable( 'toArray', { attribute: 'data-row-id' } );

			this.model.get( 'rows' ).reset( _.map( ids, function( id ) {
				return this.model.get( 'rows' ).get( id );
			}, this ) );
		},

		onColumnViewsSorted: function( columnViews ) {
			var $stage = $( '.column-list', this.$el );

			columnViews.forEach( function( columnViewModel ) {
				var columnView = columnViewModel.get( 'view' );
				var $columnViewEl = columnView.$el;
				$columnViewEl.detach();
				$stage.append( $columnViewEl );
				columnView.trigger( 'refresh' );
			}, this );
		},

		onRowModelAdd: function( rowModel, rowsCollection, options ) {
			this.model.trigger( 'change' );
			this.addRowView( rowModel, options );

			var model = this.model;

			if ( options.refresh !== false ) {
				this.model.fetchHtml( function( response ) {
					var data = {
						id: model.get( 'id' ),
						html: response,
					};

					happyForms.previewSend( 'happyforms-form-part-refresh', data );
				} );
			}
		},

		onRowModelChange: function( rowModel ) {
			this.model.trigger( 'change' );
		},

		onRowModelRemove: function( rowModel ) {
			this.model.trigger( 'change' );

			var rowViewModel = this.rowViews.find( function( viewModel ) {
				return viewModel.get( 'view' ).model.id === rowModel.id;
			}, this );

			this.rowViews.remove( rowViewModel );

			if ( this.model.get( 'rows' ).length == 0 ) {
				$( '.row-list', this.$el ).html( '' );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onTableRowDeleteCallback',
				options: {
					itemID: rowModel.id,
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onRowModelsSorted: function() {
			this.rowViews.reset( _.map( this.model.get( 'rows' ).pluck( 'id' ), function( id ) {
				return this.rowViews.get( id );
			}, this ) );
			this.model.trigger( 'change' );

			var model = this.model;

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		addRowView: function( rowModel, options ) {
			var rowView = new RowView( _.extend( {
				model: rowModel,
				part: this.model,
			}, options ) );

			var rowViewModel = new Backbone.Model( {
				id: rowModel.id,
				view: rowView,
			} );

			this.rowViews.add( rowViewModel, options );
		},

		onRowViewAdd: function( viewModel, collection, options ) {
			var rowView = viewModel.get( 'view' );
			$( '.row-list', this.$el ).append( rowView.render().$el );
			rowView.trigger( 'ready' );
		},

		onRowViewRemove: function( viewModel ) {
			var rowView = viewModel.get( 'view' );
			rowView.remove();
		},

		onRowViewsSorted: function( rowViews ) {
			var $stage = $( '.row-list', this.$el );

			rowViews.forEach( function( rowViewModel ) {
				var rowView = rowViewModel.get( 'view' );
				var $rowViewEl = rowView.$el;
				$rowViewEl.detach();
				$stage.append( $rowViewEl );
				rowView.trigger( 'refresh' );
			}, this );
		},

		onMultipleSelectionChange: function( model, value ) {
			if ( 1 == value ) {
				$( '.happyforms-poll-limit-choices-wrap', this.$el ).show();
			} else {
				$( '[data-bind=limit_choices]', this.$el ).prop( 'checked', false );
				this.model.set( 'limit_choices', 0 );
				$( '.happyforms-poll-limit-choices-wrap', this.$el ).hide();
			}

			model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		onRowsChange: function() {
			this.model.trigger( 'change' );
		},

		onAddColumnClick: function( e ) {
			e.preventDefault();

			var columnID = happyForms.utils.uniqueId( this.model.get( 'id' ) + '_column_', this.model.get( 'columns' ) );
			var columnModel = new ColumnModel( { id: columnID } );
			this.model.get( 'columns' ).add( columnModel );
		},

		getRowModelID: function() {
			var prefix = this.model.get( 'id' ) + '_row_';
			var collection = this.model.get( 'rows' );
			var timestamp = new Date().getTime();
			var id = prefix + timestamp;

			return id;
		},

		getColumnModelID: function() {
			var prefix = this.model.get( 'id' ) + '_column_';
			var collection = this.model.get( 'columns' );
			var timestamp = new Date().getTime();
			var id = prefix + timestamp;

			return id;
		},

		onAddRowClick: function( e ) {
			var rowID = this.getRowModelID();
			var rowModel = new RowModel( { id: rowID } );
			this.model.get( 'rows' ).add( rowModel );
		},

		onTabClick: function( e ) {
			var $link = $( e.target );
			var $links = $link.siblings();
			var tabClass = $link.attr( 'data-happyforms-tab' );
			var $tabs = $( '.tab-content > div', this.$el );
			var $tab = $( '.tab-content > .' + tabClass, this.$el );

			$links.removeClass( 'active' );
			$link.addClass( 'active' );
			$tabs.removeClass( 'active' );
			$tab.addClass( 'active' );
		},

		onImportOptionsClick: function( e ) {
			e.preventDefault();

			var type = $( e.target ).attr( 'data-type' );

			$( '.options', this.$el ).hide();
			$( '.options-import[data-type=' + type + ']', this.$el ).show();
			$( '.links.mode-manual', this.$el ).hide();
			$( '.links.mode-import', this.$el ).show();
			$( '.option-import-area', this.$el ).trigger( 'focus' );
		},

		onAddOptionsClick: function( e ) {
			e.preventDefault();

			$( '.options', this.$el ).show();
			$( '.options-import', this.$el ).hide();
			$( '.links.mode-import', this.$el ).hide();
			$( '.links.mode-manual', this.$el ).show();
			$( '.option-import-area', this.$el ).val( '' );
		},

		onImportRowClick: function( e ) {
			e.preventDefault();

			var $textarea = $( '.option-import-area[data-type=row]', this.$el );
			var list = $textarea.val();
			var self = this;

			var models = list
				.split( /[\r\n]+/g )
				.map( function( s ) {
					return s.trim();
				} )
				.filter( function( s ) {
					return s;
				} )
				.forEach( function( label, i, list ) {
					_.delay( function() {
						var rowID = self.getRowModelID();
						var row = new RowModel( {
							id: rowID,
							label: label
						} );

						self.model.get( 'rows' ).add( row, { refresh: ( list.length - 1 === i ) } );
					}, i );
				} );

			$textarea.val( '' );
			$( '.add-options', this.$el ).trigger( 'click' );
		},

		onImportColumnClick: function( e ) {
			e.preventDefault();

			var $textarea = $( '.option-import-area[data-type=column]', this.$el );
			var list = $textarea.val();
			var self = this;

			var models = list
				.split( /[\r\n]+/g )
				.map( function( s ) {
					return s.trim();
				} )
				.filter( function( s ) {
					return s;
				} )
				.forEach( function( label, i, list ) {
					_.delay( function() {
						var columnID = self.getColumnModelID();
						var column = new ColumnModel( {
							id: columnID,
							label: label
						} );

						self.model.get( 'columns' ).add( column, { refresh: ( list.length - 1 === i ) } );
					}, i );
				} );

			$textarea.val( '' );
			$( '.add-options', this.$el ).trigger( 'click' );
		},

		onLimitChoices: function( model, value ) {
			var $limitChoicesOptions = $( '.happyforms-nested-settings[data-trigger="limit_choices"]', this.$el );

			if ( 1 == value ) {
				$limitChoicesOptions.show();
			} else {
				$limitChoicesOptions.hide();
			}
		},

		refreshMinMaxChoices: function() {
			var minChoices = this.model.get( 'limit_choices_min' );
			var maxChoices = this.model.get( 'limit_choices_max' );
			var numChoicesColumns = this.model.get( 'columns' ).length;
			var numChoicesRows = this.model.get( 'rows' ).length;
			var numChoices = numChoicesColumns * numChoicesRows;

			var clamp = function( v, min, max ) {
				return Math.min( Math.max( v, min ), max );
			};

			minChoices = clamp( minChoices, numChoices > 1 ? 2 : 1, minChoices );
			minChoices = clamp( minChoices, minChoices, numChoices );
			maxChoices = clamp( maxChoices, minChoices, numChoices );

			this.model.set( 'limit_choices_min', minChoices );
			this.model.set( 'limit_choices_max', maxChoices );

			var $limitMinChoice = $( '[data-trigger="limit_choices_min"]', this.$el );
			var $limitMaxChoice = $( '[data-trigger="limit_choices_max"]', this.$el );

			$limitMinChoice.val( minChoices );
			$limitMaxChoice.val( maxChoices );
		}
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {

		onTableColumnDeleteCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $column = $( '#' + options.itemID, $part );
			var columnIndex = $column.index() + 1;

			this.$( '.happyforms-table__cell:nth-child(' + columnIndex + ')', $part ).remove();
		},

		onTableColumnLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var column = part.get( 'columns' ).get( options.columnID );
			var $column = $( '#' + options.columnID, $part );

			this.$( 'span', $column ).text( column.get( 'label' ) );
		},

		onTableColumnDescriptionChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var column = part.get( 'columns' ).get( options.columnID );
			var $column = $( '#' + options.columnID, $part );

			this.$( '.happyforms-part-option__description', $column ).text( column.get( 'description' ) );
		},

		onTableRowDeleteCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $row = $( '#' + options.itemID, $part );

			$row.remove();
		},

		onTableRowDescriptionChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var row = part.get( 'rows' ).get( options.rowID );
			var $row = $( '#' + options.rowID, $part );

			this.$( '.happyforms-part-option__description', $row ).text( row.get( 'description' ) );
		},

		onTableRowLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var row = part.get( 'rows' ).get( options.rowID );
			var $row = $( '#' + options.rowID, $part );

			this.$( '.happyforms-table__row-label', $row ).text( row.get('label') );
		},

		onTableColumnDefaultChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var column = part.get( 'columns' ).get( options.columnID );
			var $column = $( '#' + options.columnID, $part );
			var columnIndex = $column.index() + 1;
			var isDefault = column.get( 'is_default' );

			this.$( '.happyforms-table__row--body .happyforms-table__cell:nth-child(' + columnIndex + ') input', $part ).prop( 'checked', isDefault );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings, _happyFormsTableSettings );
