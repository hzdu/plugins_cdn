( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.date = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.date.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.date = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-date-template',

		initialize: function () {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			var refreshDatePart = _.debounce( this.refreshDatePart.bind( this ), 500 );

			this.listenTo( this.model, 'change:date_type', this.onDateTypeChange );
			this.listenTo( this.model, 'change:time_format', this.onTimeFormatChange );
			this.listenTo( this.model, 'change:min_year', refreshDatePart );
			this.listenTo( this.model, 'change:max_year', refreshDatePart );
			this.listenTo( this.model, 'change:min_hour', refreshDatePart );
			this.listenTo( this.model, 'change:max_hour', refreshDatePart );
			this.listenTo( this.model, 'change:default_datetime', refreshDatePart );
			this.listenTo( this.model, 'change:years_option', this.onYearsOptionChange );
			this.listenTo( this.model, 'change:required', refreshDatePart );
			this.listenTo( happyForms.form, 'save', this.onFormSave );
		},

		onDateTypeChange: function() {
			var $timeOptions = $( '.time-options', this.$el );
			var $dateOptions = $( '.date-options', this.$el );

			switch ( this.model.get( 'date_type' ) ) {
				case 'datetime':
					$timeOptions.show();
					$dateOptions.show();
					break;

				case 'time':
					$timeOptions.show();
					$dateOptions.hide();
					break;

				case 'month':
					$timeOptions.hide();
					$dateOptions.hide();
					break;

				default:
					$dateOptions.show();
					$timeOptions.hide();
					break;

			}

			this.refreshDatePart();
		},

		onTimeFormatChange: function( model, value ) {
			if ( 12 === parseInt( value, 10 ) ) {
				model.set('min_hour', 1, {
					silent: true
				});

				this.$el.find('input[data-bind=min_hour]').val(1).attr({
					'min': 1,
					'max': 12
				});

				model.set('max_hour', 12, {
					silent: true
				});

				this.$el.find('input[data-bind=max_hour]').val(12).attr({
					'min': 1,
					'max': 12
				});
			} else {
				model.set('min_hour', 1, {
					silent: true
				});

				this.$el.find('input[data-bind=min_hour]').val(0).attr({
					'min': 0,
					'max': 23
				});

				model.set('max_hour', 23, {
					silent: true
				});

				this.$el.find('input[data-bind=max_hour]').val(23).attr({
					'min': 0,
					'max': 23
				});
			}

			this.refreshDatePart();
		},

		refreshDatePart: function() {
			var model = this.model;

			model.fetchHtml(function (response) {
				var data = {
					id: model.get('id'),
					html: response
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		onYearsOptionChange: function( model, value ) {
			var $minYearInput = $('[data-bind=min_year]', this.$el);
			var $maxYearInput = $('[data-bind=max_year]', this.$el);
			var currentYear = (new Date()).getFullYear();

			if ( 'all' === value ) {
				$minYearInput.val(currentYear - 100);
				$maxYearInput.val(currentYear + 20);
				model.set('min_year', currentYear - 100, {
					silent: true
				});
				model.set('max_year', currentYear + 20, {
					silent: true
				});
			}

			if ( 'past' === value ) {
				$minYearInput.val(currentYear - 100);
				$maxYearInput.val(currentYear - 1);
				model.set('min_year', currentYear - 100, {
					silent: true
				});
				model.set('max_year', currentYear - 1, {
					silent: true
				});
			}

			if ( 'future' === value ) {
				$minYearInput.val(currentYear + 1);
				$maxYearInput.val(currentYear + 100);
				model.set('min_year', currentYear + 1, {
					silent: true
				});
				model.set('max_year', currentYear + 100, {
					silent: true
				});
			}

			this.refreshDatePart();
		},

		onFormSave: function( form ) {
			var part = _.findWhere( form.parts, {
				id: this.model.get( 'id' )
			} );

			if ( ! part ) {
				return;
			}

			$( '[data-bind="min_hour"]', this.$el ).val( part.min_hour );
			$( '[data-bind="max_hour"]', this.$el ).val( part.max_hour );
			$( '[data-bind="minute_step"]', this.$el ).val( part.minute_step );
		},
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onDateDateTypeChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var dateType = part.get( 'date_type' );

			switch ( dateType ) {
				case 'date':
					$part.removeClass( 'happyforms-part-date--datetime' );
					$part.removeClass( 'happyforms-part-date--time' );
					break;

				case 'datetime':
					$part.removeClass( 'happyforms-part-date--date' );
					$part.removeClass( 'happyforms-part-date--time' );
					break;

				case 'time':
					$part.removeClass( 'happyforms-part-date--date' );
					$part.removeClass( 'happyforms-part-date--datetime' );
					break;
			}

			$part.addClass( 'happyforms-part-date--' + dateType );
		},

		onDateTimeFormatChange: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $period = this.$( '.happyforms-part-date__time-input--period', $part );
			var $hours = this.$( '.format-24', $part );

			if ( '12' === part.get( 'time_format' ) ) {
				$period.show();
				$hours.hide();
			} else {
				$period.hide();
				$hours.show();
			}
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
