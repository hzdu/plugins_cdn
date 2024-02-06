( function( $, _, Backbone, api, settings ) {

	var FormSetup = happyForms.classes.views.FormSetup;

	happyForms.classes.views.FormSetup = FormSetup.extend( {
		events: _.extend( {}, FormSetup.prototype.events, {
			'input [data-component=date]': 'onDateComponentInput',
			'input [data-component=time]': 'onTimeComponentInput',
			'change [data-component=period]': 'onPeriodComponentChange',
			'click [href="#clear"]': 'onClearClick',
			'keyup [data-component=date]': 'onScheduleInputsKeyup',
			'keyup [data-component=time]': 'onScheduleInputsKeyup',
		} ),

		clampValue: function( value, min, max ) {
			value = Math.min( max, Math.max( min, parseInt( value, 10 ) ) );

			return value;
		},

		onDateComponentInput: function( e ) {
			var $component = $( e.target );
			var attribute = $component.parents( '[data-attribute]' ).attr( 'data-attribute' );
			var datetime = this.model.get( attribute );
			var value = $component.val().replace( /[^\d]/g, '' ).substring( 0, 8 );
			var month = value.substring( 0, 2 );

			if ( 2 === month.length ) {
				month = this.clampValue( month, 1, 12 ).toString().padStart( 2, '0' );
			}

			var displayValue = month;
			var day = value.substring( 2, 4 );

			if ( day ) {
				if ( 2 === day.length ) {
					day = this.clampValue( day, 1, 31 ).toString().padStart( 2, '0' );
				}

				displayValue += '/' + day;
			}

			var year = value.substring( 4, 8 );

			if ( year ) {
				displayValue += '/' + year;
			}

			$component.val( displayValue );
			datetime.date = displayValue;
			this.model.set( attribute, datetime );
			this.model.trigger( 'change' );
		},

		onTimeComponentInput: function( e ) {
			var $component = $( e.target );
			var $control = $component.parents( '[data-attribute]' );
			var attribute = $control.attr( 'data-attribute' );
			var datetime = this.model.get( attribute );
			var value = $component.val().replace( /[^\d]/g, '' ).substring( 0, 4 );
			var hour = value.substring( 0, 2 );

			if ( 2 === hour.length ) {
				hour = this.clampValue( hour, 1, 12 ).toString().padStart( 2, '0' );
			}

			var displayValue = hour;
			var minute = value.substring( 2, 4 );

			if ( minute ) {
				if ( 2 === minute.length ) {
					minute = this.clampValue( minute, 0, 59 ).toString().padStart( 2, '0' );
				}

				displayValue += ':' + minute;
			}

			$component.val( displayValue );
			datetime.time = displayValue;

			this.model.set( attribute, datetime );
			this.model.trigger( 'change' );
		},

		onPeriodComponentChange: function( e ) {
			var $component = $( e.target );
			var $control = $component.parents( '[data-attribute]' );
			var attribute = $control.attr( 'data-attribute' );
			var datetime = this.model.get( attribute );
			var value = $component.val();

			datetime.period = value;
			this.model.set( attribute, datetime );
			this.model.trigger( 'change' );
		},

		onClearClick: function( e ) {
			e.preventDefault();

			var $link = $( e.target );
			var $control = $link.parents( '[data-attribute]' );
			var attribute = $control.attr( 'data-attribute' );
			var $inputs = $( 'input', $control );
			var $periodSelect = $( 'select', $control );
			var datetime = this.model.get( attribute );

			$inputs.val( '' );
			$periodSelect.val( 'AM' );
			datetime.date = '';
			datetime.time = '';
			datetime.period = '';
			$link.hide();
			this.model.set( attribute, datetime );
			this.model.trigger( 'change' );
		},

		onScheduleInputsKeyup: function( e ) {
			var $control = $( e.target ).parents( '[data-attribute]' );

			this.handleClearButtonVisibility( $control );
		},

		handleClearButtonVisibility: function( $context ) {
			var $dateInput = $( 'input[data-component=date]', $context );
			var $timeInput = $( 'input[data-component=time]', $context );
			var $clearButton = $( 'a[href="#clear"]', $context );

			if ( '' !== $dateInput.val() || '' !== $timeInput.val() ) {
				$clearButton.show();
			} else {
				$clearButton.hide();
			}
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );