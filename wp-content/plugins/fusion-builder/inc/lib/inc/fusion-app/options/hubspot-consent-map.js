/* globals FusionPageBuilderApp, FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};
FusionPageBuilder.options = FusionPageBuilder.options || {};

function fusionHubSpotConsentMapOption( $element ) {
	var self = this;

	// Cut off check.
	if ( 'object' !== typeof FusionApp.data.hubspot || 'undefined' === typeof FusionApp.data.hubspot.preferences ) {
		return;
	}

	// Set reusable vars.
	this.$base       = $element;
	this.preferences = FusionApp.data.hubspot.preferences;
	this.$el         = $element.find( '.hubspot_consent_map .fusion-mapping' );
	this.options     = false;
	this.$input      = $element.find( 'input#hubspot_consent_map' );
	this.values      = {};

	try {
		self.values = JSON.parse( self.$input.val() );
	} catch ( e ) {
		console.warn( 'Error triggered - ' + e );
	}

	// Initial build.
	this.updateMap();

	// Add listeners.
	FusionPageBuilderApp.collection.on( 'change reset add remove', function() {
		self.updateMap();
	} );

	this.$el.on( 'change', 'select', function() {
		self.updateValues();
	} );
}

fusionHubSpotConsentMapOption.prototype.updateValues  = function() {
	var values = {};

	this.$el.find( 'select' ).each( function() {
		values[ jQuery( this ).attr( 'name' ) ] = jQuery( this ).val();
	} );

	this.values = values;

	this.$input.val( JSON.stringify( values ) );
	setTimeout( () => {
		this.$input.trigger( 'change' );
	}, 10 );
};

fusionHubSpotConsentMapOption.prototype.updateMap  = function() {
	var self         = this,
		options      = this.getOptions(),
		$legitOption = self.$base.find( '[data-option-id="hubspot_legitimate_interest"] .fusion-select-options' );

	if ( 'object' !== typeof FusionPageBuilderApp.collection ) {
		self.$el.empty();
		return;
	}

	if ( ! self.$el.find( '#fusionmap-data' ).length  ) {
		self.$el.append( '<div class="form-input-entry"><label for="fusionmap-data">' + FusionApp.data.hubspot.data + '</label><div class="fusion-select-wrapper"><select class="fusion-dont-update" name="preference_data" id="fusionmap-data"><option value="always">' + FusionApp.data.hubspot.always + '</option><option value="automatic">' + FusionApp.data.hubspot.automatic_consent + '</option>' + options + '</select><span class="fusiona-arrow-down"></span></div></div>' );
	} else {
		self.$el.find( '#fusionmap-data' ).closest( '.form-input-entry' ).html( '<label for="fusionmap-data">' + FusionApp.data.hubspot.data + '</label><div class="fusion-select-wrapper"><select class="fusion-dont-update" name="preference_data" id="fusionmap-data"><option value="always">' + FusionApp.data.hubspot.always + '</option><option value="automatic">' + FusionApp.data.hubspot.automatic_consent + '</option>' + options + '</select><span class="fusiona-arrow-down"></span></div>' );
	}

	// Make sure value is selected.
	if ( 'string' === typeof self.values.preference_data ) {
		self.$el.find( '#fusionmap-data' ).val( self.values.preference_data );
	}

	// Add entries.
	_.each( this.preferences, function( preference ) {

		// If we don't already have this, add it.
		if ( ! self.$el.find( '#fusionmap-' + preference.id ).length ) {
			self.$el.append( '<div class="form-input-entry"><label for="fusionmap-' + preference.id + '">' + preference.name + '</label><div class="fusion-select-wrapper"><select class="fusion-dont-update" name="preference_' + preference.id + '" id="fusionmap-' + preference.id + '"><option value="" selected>' + FusionApp.data.hubspot.no_consent + '</option>' + options + '</select><span class="fusiona-arrow-down"></span></div></div>' );
		} else {
			self.$el.find( '#fusionmap-' + preference.id ).html( '<option value="" selected>' + FusionApp.data.hubspot.no_consent + '</option>' + options );
		}

		// Make sure value is selected.
		if ( 'string' === typeof self.values[ 'preference_' + preference.id ] ) {
			self.$el.find( '#fusionmap-' + preference.id ).val( self.values[ 'preference_' + preference.id ] );
		}
	} );

	// Update the legit option select.
	$legitOption.find( '.fusion-select-label:not([data-value=""])' ).remove();
	$legitOption.append( this.getStyledOptions() );

	$legitOption.find( '[data-value="' + self.$base.find( '#hubspot_legitimate_interest' ).val() + '"]' ).addClass( 'fusion-option-selected' );
	$legitOption.closest( '.select' ).find( '.fusion-select-preview' ).text( $legitOption.find( '.fusion-option-selected' ).text() );
};

fusionHubSpotConsentMapOption.prototype.getOptions = function() {
	var formElements = false,
		options      = '';

	// Filter map to only get form elements.
	formElements = _.filter( FusionPageBuilderApp.collection.models, function( element ) {
		var params = element.get( 'params' );
		if ( 'object' !== typeof params ) {
			return false;
		}
		return 'fusion_form_consent' === element.get( 'element_type' ) && ( 'string' === typeof params.label || 'string' === typeof params.name );
	} );

	if ( ! formElements.length ) {
		return options;
	}
	_.each( formElements, function( formElement ) {
		var params     = formElement.get( 'params' ),
			inputLabel = 'string' === typeof params.label && '' !== params.label ? params.label : params.name;

		options += '<option value="' + params.name + '">' + inputLabel + '</option>';
	} );

	this.options = options;

	return this.options;
};

fusionHubSpotConsentMapOption.prototype.getStyledOptions = function() {
	var formElements = false,
		options      = '';

	// Filter map to only get form elements.
	formElements = _.filter( FusionPageBuilderApp.collection.models, function( element ) {
		var params = element.get( 'params' );
		if ( 'object' !== typeof params ) {
			return false;
		}
		return 'fusion_form_consent' === element.get( 'element_type' ) && ( 'string' === typeof params.label || 'string' === typeof params.name );
	} );

	if ( ! formElements.length ) {
		return options;
	}
	_.each( formElements, function( formElement ) {
		var params     = formElement.get( 'params' ),
			inputLabel = 'string' === typeof params.label && '' !== params.label ? params.label : params.name;

		options += '<label class="fusion-select-label" data-value="' + params.name + '">' + inputLabel + '</label>';
	} );

	return options;
};

FusionPageBuilder.options.fusionHubSpotConsentMap = {

	/**
	 * Run actions on load.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	optionHubSpotConsentMap: function( $element ) {
		if ( 'undefined' === typeof this.hubspotConsentMap ) {
			this.hubspotConsentMap = new fusionHubSpotConsentMapOption( $element );
		}
	}
};
