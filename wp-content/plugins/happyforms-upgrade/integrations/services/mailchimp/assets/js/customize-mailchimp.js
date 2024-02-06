( function( $, _, Backbone, api, mailchimpData, settings ) {
	var FormEmail = happyForms.classes.views.FormEmail;

	happyForms.classes.views.FormEmail = FormEmail.extend( {
		initialize: function() {
			FormEmail.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:mailchimp_list', this.mailchimpOnListChange );
			this.listenTo( this.model, 'change:mailchimp_list_unsubscribe', this.mailchimpOnListChange );
		},

		ready: function() {
			FormEmail.prototype.ready.apply( this, arguments );

			this.mailchimpGroupsTemplate = '#happyforms-customize-mailchimp-groups-template';
			this.$mailchimpGroupsControl = $( '#customize-control-mailchimp_groups', this.$el );
			this.$mailchimpGroupsUnsubscribeControl = $( '#customize-control-mailchimp_groups_unsubscribe', this.$el );

			var mailchimpGroups = this.mailchimpGetGroups( 'mailchimp_list' );
			var mailchimpGroupsValue = this.model.get( 'mailchimp_groups' );
			this.mailchimpRenderGroups( mailchimpGroups, mailchimpGroupsValue, this.$mailchimpGroupsControl );

			var mailchimpGroupsUnsubscribe = this.mailchimpGetGroups( 'mailchimp_list_unsubscribe' );
			var mailchimpGroupsUnsubscribeValue = this.model.get( 'mailchimp_groups_unsubscribe' );
			this.mailchimpRenderGroups( mailchimpGroupsUnsubscribe, mailchimpGroupsUnsubscribeValue, this.$mailchimpGroupsUnsubscribeControl );
		},

		mailchimpRenderGroups: function( groups, value, $control ) {
			var template = _.template( $( this.mailchimpGroupsTemplate ).text() );
			var html = template( { groups: groups, value: value } );

			$( '.customize-control-options', $control ).html( html );

			if ( $( 'input', $control ).length || $( 'select', $control ).length ) {
				$( '.no-groups', $control ).hide();
			} else {
				$( '.no-groups', $control ).show();
			}

			$( 'input, select', $control ).on( 'change', this.mailchimpOnGroupChange.bind( this ) );
		},

		mailchimpResetGroupsValue: function( groups_field ) {
			this.model.set( groups_field, '' );
		},

		mailchimpOnGroupChange: function( e ) {
			var value = [];
			var $control = $( e.target ).parents( '.customize-control' );
			var $options = $( '.customize-control-options', $control );

			$( 'input, select', $options ).each( function( index, input ) {
				var $input = $( input );

				if ( $input.is( ':checked' ) ) {
					value.push( $input.val() );
				}

				if ( 'select' === $input[0].tagName.toLowerCase() && $input.val() ) {
					value.push( $input.val() );
				}
			} );

			if ( $control.is( '#customize-control-mailchimp_groups' ) ) {
				this.model.set( 'mailchimp_groups', value );
			} else {
				this.model.set( 'mailchimp_groups_unsubscribe', value );
			}
		},

		mailchimpOnListChange: function( e ) {
			if ( ! e.changed.hasOwnProperty( 'mailchimp_list' ) && ! e.changed.hasOwnProperty( 'mailchimp_list_unsubscribe' ) ) {
				return;
			}

			var list_field = e.changed.hasOwnProperty( 'mailchimp_list' ) ? 'mailchimp_list' : 'mailchimp_list_unsubscribe';
			var groups_field = e.changed.hasOwnProperty( 'mailchimp_list' ) ? 'mailchimp_groups' : 'mailchimp_groups_unsubscribe';
			var groups_value = this.model.get( groups_field );
			
			this.mailchimpResetGroupsValue( groups_field );

			var groups = this.mailchimpGetGroups( list_field );
			var control = e.changed.hasOwnProperty( 'mailchimp_list' ) ? 'mailchimp_groups' : 'mailchimp_groups_unsubscribe';
			var $control = e.changed.hasOwnProperty( 'mailchimp_list' ) ? this.$mailchimpGroupsControl : this.$mailchimpGroupsUnsubscribeControl;
			this.mailchimpRenderGroups( groups, groups_value, $control );

			$control.trigger( 'conditions-refresh', { control: control, data: groups } );
		},

		mailchimpGetGroups: function( list_field ) {
			var listID = this.model.get( list_field );
			var groups = mailchimpData.groups[listID];

			return groups;
		},

		getLogicOptions: function( controlID ) {
			if ( 'mailchimp_groups' !== controlID && 'mailchimp_groups_unsubscribe' !== controlID ) {
				return _happyFormsConditionSettings.controls[controlID].options;
			}

			var listID = ( 
				'mailchimp_groups' === controlID ?
				this.model.get( 'mailchimp_list' ) :
				this.model.get( 'mailchimp_list_unsubscribe' )
			);
			var groups = mailchimpData.groups[listID];

			return groups;
		}
	} );
} ) ( jQuery, _, Backbone, wp.customize, _happyFormsMailchimpData, _happyFormsSettings );
