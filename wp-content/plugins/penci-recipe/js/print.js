jQuery('body').on('click','.penci-recipe-print-btn',function(){
	var printWindow = window.open('', '', 'height=800,width=800');
	var printCSS = jQuery(this).data('print'),
		wrapper_penci_recipe = jQuery(this).closest('.penci-single-block').find('.wrapper-penci-recipe').first();
	if( wrapper_penci_recipe.length ){
		var divContents = "<div class='post-entry'><div class='wrapper-penci-recipe'>" + wrapper_penci_recipe.html() +
							"</div></div><script>" +
							"window.onload = function() {" +
							"     window.print();" +
							"};" +
							"<" + "/script>";
		var srcCSS = '<link href=\"' + printCSS + '\" rel=\"stylesheet\" type=\"text/css\">';
		setTimeout(function() {
			printWindow.document.write( srcCSS + divContents);
			printWindow.document.close();
		}, 250);
	}
	return false;
});