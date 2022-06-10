( function( $, _, Backbone, api, mailchimpData, settings ) {
	var FormEmail = happyForms.classes.views.FormEmail;

	happyForms.classes.views.FormEmail = FormEmail.extend( {
		initialize: function() {
			FormEmail.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:mailchimp_list', this.mailchimpOnListChange );
		},

		ready: function() {
			FormEmail.prototype.ready.apply( this, arguments );

			this.mailchimpGroupsTemplate = '#happyforms-customize-mailchimp-groups-template';
			this.$mailchimpGroupsControl = $( '#customize-control-mailchimp_groups', this.$el );

			var mailchimpGroups = this.mailchimpGetGroups();
			this.mailchimpRenderGroups( mailchimpGroups );
		},

		mailchimpRenderGroups: function( groups ) {
			var template = _.template( $( this.mailchimpGroupsTemplate ).text() );
			var html = template( { groups: groups, value: this.model.get( 'mailchimp_groups' ) } );

			$( '.customize-control-options', this.$mailchimpGroupsControl ).html( html );

			if ( $( 'input', this.$mailchimpGroupsControl ).length || $( 'select', this.$mailchimpGroupsControl ).length ) {
				this.$mailchimpGroupsControl.show();
				$( '.no-groups', this.$mailchimpGroupsControl ).hide();
			} else {
				$( '.no-groups', this.$mailchimpGroupsControl ).show();
				this.$mailchimpGroupsControl.hide();
			}

			$( 'input, select', this.$mailchimpGroupsControl ).on( 'change', this.mailchimpOnGroupChange.bind( this ) );
		},

		mailchimpResetGroupsValue: function() {
			this.model.set( 'mailchimp_groups', '' );
		},

		mailchimpOnGroupChange: function( e ) {
			var value = [];
			var $options = $( '.customize-control-options', this.$mailchimpGroupsControl );

			$( 'input, select', $options ).each( function( index, input ) {
				var $input = $( input );

				if ( $input.is( ':checked' ) ) {
					value.push( $input.val() );
				}

				if ( 'select' === $input[0].tagName.toLowerCase() && $input.val() ) {
					value.push( $input.val() );
				}
			} );

			this.model.set( 'mailchimp_groups', value );
		},

		mailchimpOnListChange: function() {
			this.mailchimpResetGroupsValue();

			var groups = this.mailchimpGetGroups();
			this.mailchimpRenderGroups( groups );

			$( '#customize-control-mailchimp_groups' ).trigger( 'conditions-refresh', { control: 'mailchimp_groups', data: groups } );
		},

		mailchimpGetGroups: function() {
			var listID = this.model.get( 'mailchimp_list' );
			var groups = mailchimpData.groups[listID];

			return groups;
		},

		getLogicOptions: function( controlID ) {
			if ( 'mailchimp_groups' !== controlID ) {
				return _happyFormsConditionSettings.controls[controlID].options;
			}

			var listID = this.model.get( 'mailchimp_list' );
			var groups = mailchimpData.groups[listID];

			return groups;
		}
	} );
} ) ( jQuery, _, Backbone, wp.customize, _happyFormsMailchimpData, _happyFormsSettings );
