/* global FusionPageBuilderApp */

window.hubspotConsentOption = {

	/**
	 * Run actions on load.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	onReady: function() {
		var self = this;

		// Cut off check.
		if ( 'undefined' === typeof window.fusionHubspot ) {
			return;
		}

		// Set reusable vars.
		this.preferences = window.fusionHubspot.preferences;
		this.$el         = jQuery( '.fusion-hubspot-consent-option .hubspot-map-holder .fusion-mapping' );
		this.options     = false;
		this.$input      = jQuery( '#pyre_hubspot_consent_map' );
		this.values      = {};

		try {
			self.values = JSON.parse( self.$input.val() );
		} catch ( e ) {
			console.warn( 'Error triggered - ' + e );
		}

		// Add listeners.
		jQuery( document ).on( 'fusion-builder-content-updated', function() {
			self.updateMap();
		} );

		this.$el.on( 'change', 'select', function() {
			self.updateValues();
		} );
	},

	/**
	 * Update the map with new data.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	updateValues: function() {
		var values = {};

		this.$el.find( 'select' ).each( function() {
			values[ jQuery( this ).attr( 'name' ) ] = jQuery( this ).val();
		} );

		this.values = values;
		this.$input.val( JSON.stringify( values ) ).change();
	},

	/**
	 * Update the map with new data.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	updateMap: function() {
		var self         = this,
			options      = this.getOptions(),
			$legitOption = jQuery( '#pyre_hubspot_legitimate_interest' ).closest( '.pyre_metabox_field' ),
			startValue   = '' === $legitOption.find( 'select' ).val() ? $legitOption.find( 'select' ).attr( 'data-value' ) : $legitOption.find( 'select' ).val();

		if ( 'object' !== typeof FusionPageBuilderApp.simplifiedMap ) {
			self.$el.empty();
			return;
		}

		if ( ! self.$el.find( '#fusionmap-data' ).length  ) {
			self.$el.append( '<div class="form-input-entry"><label for="fusionmap-data">' + window.fusionHubspot.data + '</label><select class="fusion-dont-update" name="preference_data" id="fusionmap-data"><option value="always">' + window.fusionHubspot.always + '</option><option value="automatic">' + window.fusionHubspot.automatic_consent + '</option>' + options + '</select></div>' );
		} else {
			self.$el.find( '#fusionmap-data' ).closest( '.form-input-entry' ).html( '<label for="fusionmap-data">' + window.fusionHubspot.data + '</label><select class="fusion-dont-update" name="preference_data" id="fusionmap-data"><option value="always">' + window.fusionHubspot.always + '</option><option value="automatic">' + window.fusionHubspot.automatic_consent + '</option>' + options + '</select>' );
		}

		// Make sure value is selected.
		if ( 'string' === typeof self.values.preference_data ) {
			self.$el.find( '#fusionmap-data' ).val( self.values.preference_data );
		}

		// Add entries.
		_.each( this.preferences, function( preference ) {

			// If we don't already have this, add it.
			if ( ! self.$el.find( '#fusionmap-' + preference.id ).length ) {
				self.$el.append( '<div class="form-input-entry"><label for="fusionmap-' + preference.id + '">' + preference.name + '</label><select class="fusion-dont-update" name="preference_' + preference.id + '" id="fusionmap-' + preference.id + '"><option value="">' + window.fusionHubspot.no_consent + '</option>' + options + '</select></div>' );
			} else {
				self.$el.find( '#fusionmap-' + preference.id ).html( '<option value="" selected>' + window.fusionHubspot.no_consent + '</option>' + options );
			}

			// Make sure value is selected.
			if ( 'string' === typeof self.values[ 'preference_' + preference.id ] ) {
				self.$el.find( '#fusionmap-' + preference.id ).val( self.values[ 'preference_' + preference.id ] );
			}
		} );

		// Update the legit option select.
		$legitOption.find( 'select option:not([value=""])' ).remove();
		$legitOption.find( 'select' ).append( options );
		$legitOption.find( 'select' ).val( startValue ).trigger( 'change' );
	},

	getOptions: function() {
		var formElements = false,
			options      = '';

		// Filter map to only get form elements.
		formElements = _.filter( FusionPageBuilderApp.simplifiedMap, function( element ) {
			return 'fusion_form_consent' === element.type && ( 'string' === typeof element.params.label || 'string' === typeof element.params.name );
		} );

		if ( ! formElements.length ) {
			return options;
		}
		_.each( formElements, function( formElement ) {
			var inputLabel = 'string' === typeof formElement.params.label && '' !== formElement.params.label ? formElement.params.label : formElement.params.name;

			options += '<option value="' + formElement.params.name + '">' + inputLabel + '</option>';
		} );

		this.options = options;

		return this.options;
	}
};

( function( jQuery ) {

	'use strict';

	jQuery( document ).ready( function() {

		// Trigger actions on ready event.
		jQuery( document ).ready( function() {
			window.hubspotConsentOption.onReady();
		} );

	} );
}( jQuery ) );
