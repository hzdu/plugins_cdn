jQuery(document).ready(function($)
{
	$('#bg_gradient_select'). on("click", function(e){
		e.preventDefault();
		
		$('#qcld-hero-gradient-modal').show();
		
		
	})
	$( '.qcld-hero-gradient-modal-close' ).on( 'click', function() {
		
		$('#qcld-hero-gradient-modal').hide();
	});
	$('.gradient-box-hero').on ("click", function(){
		
		$('#bg_gradient').val($(this).data('gd'));
		$('#qcld-hero-gradient-modal').hide();
		var css = $(this).data('gd').split(':');
		head = css[0];
		value = css[1].replace(";","");
		
		$('#gradient_view').css({
				'display' : 'block',
				'background-image' : value
		});
		
		
		
	})
	$('.remove_gradient').on ("click", function(){
		
		$('#gradient_view').css('display','none');
		$('#bg_gradient').val('');
	})
});