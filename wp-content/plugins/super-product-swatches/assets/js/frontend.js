;(function ( $ ) {
	'use strict';

	$.fn.sps_variation_swatches_form = function () {
		return this.each( function() {
			var $form = $( this ),
				clicked = null,
				selected = [];

			$form
				.addClass( 'swatches-support' )
				.on( 'click', '.superSwatch', function ( e ) {
					
					e.preventDefault();
					var $el = $( this ),
						$select = $el.closest( '.value' ).find( 'select' ),
						attribute_name = $select.data( 'attribute_name' ) || $select.attr( 'name' ),
						value = $el.data( 'value' );
 
					if ($(".sps_error_validation")[0]){
						$(".sps_error_validation").remove();
					}
					 
					$select.trigger( 'focusin' );
					
					
					// Check if this variation combination is available
					if ( ! $select.find( 'option[value="' + value + '"]' ).length ) {
						
						$el.siblings( '.superSwatch' ).removeClass( 'selected' );
						$select.val( '' ).change();
						$form.trigger( 'sps_no_matching_variations', [$el] );
						return;
					}

					clicked = attribute_name;

					if ( selected.indexOf( attribute_name ) === -1 ) {
						selected.push(attribute_name);
					}

					if ( $el.hasClass( 'selected' ) ) {
						$select.val( '' );
						$el.removeClass( 'selected' );

						delete selected[selected.indexOf(attribute_name)];
					} else {
						$el.addClass( 'selected' ).siblings( '.selected' ).removeClass( 'selected' );
						$select.val( value );
					}
					

					$select.change();
					
					colorSelect();
				} )
				.on( 'click', '.reset_variations', function () {
					$( this ).closest( '.variations_form' ).find( '.superSwatch.selected' ).removeClass( 'selected' );
					selected = [];
				} )
				.on( 'sps_no_matching_variations', function() {
					// Display Error message if variation combination is not found
					if ($(".sps_error_validation")[0]){
						$(".sps_error_validation").text(wc_add_to_cart_variation_params.i18n_no_matching_variations_text);
					} else {
						$( ".woocommerce-variation-add-to-cart" ).before( "<div class='sps_error_validation'>"+wc_add_to_cart_variation_params.i18n_no_matching_variations_text+"</div>" );
					}
					
					
				} );
		} );
	};

	$( function () {
		 
		$( '.variations_form' ).sps_variation_swatches_form();
		$( document.body ).trigger( 'sps_initialized' );
		
		setTimeout(function(){ colorSelect(); }, 300);
		
		
	} );
	
})( jQuery );

// Set disabled non interactable combination
function colorSelect(){
	

jQuery(".variations").find("select").each(function(){
	checkVariation(jQuery(this).attr("id"));
});
	


}

function checkVariation(pa){
	
	jQuery("div[data-attribute='attribute_"+pa+"'] .superSwatch").each(function(){

    var swatchValue = jQuery(this).attr("data-value");
	
	if(jQuery.inArray(swatchValue, checkWoo(pa)) !== -1){
		jQuery(this).removeClass("disabled");
	} else {
		jQuery(this).addClass("disabled");
	}
	
	});
	

	
}

function checkWoo(t){
	

	var itemVarExist = Array();
	jQuery("#"+t+" > option").each(function() {
		if(this.value!=""){
		itemVarExist.push(this.value);
		}
	});
	return itemVarExist;

	
}