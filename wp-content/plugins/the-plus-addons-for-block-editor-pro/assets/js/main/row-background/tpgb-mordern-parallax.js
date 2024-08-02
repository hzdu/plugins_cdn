document.addEventListener("DOMContentLoaded", () => {
	tpgbmodenParellex(document)
})

function tpgbmodenParellex(doc) {
	let getConSec = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor),.tpgb-container-row:not(.tpgb-container-row-editor)');
	if(getConSec){
		getConSec.forEach((cs)=>{
			var middlecls = cs.querySelector('.tpgb-middle-layer');
            // console.log(middlecls.classList.contains("tpgb-mordern-parallax"));

			/* mouse hover parallax image*/
			if(middlecls && middlecls.classList.contains("tpgb-mordern-parallax")){
				var elements = middlecls.querySelectorAll('.tpgb-parlximg-wrap');

				Array.prototype.forEach.call(elements, function(el, i) {
					// find Row
					var row = el.parentNode;
					row.parentElement.parentElement.classList.add('tpgb-image-parallax-row');		
				});
				//Bind to mousemove so animate the hover row
				var elements = document.querySelectorAll('.tpgb-image-parallax-row');
				Array.prototype.forEach.call(elements, function(row, i) {
					
					row.addEventListener('mousemove', function(e) {
						// Get the parent row
						var parentRow = e.target.parentNode;
						while ( ! parentRow.classList.contains('tpgb-image-parallax-row') ) {
							if ( parentRow.tagName === 'HTML' ) {
								return;
							}
							parentRow = parentRow.parentNode;
						}
						
						// Get the % location of the mouse position inside the row
						var rect = parentRow.getBoundingClientRect();
						var top = e.pageY - ( rect.top + window.pageYOffset );
						var left = e.pageX  - ( rect.left + window.pageXOffset );
						top /= parentRow.clientHeight;
						left /= parentRow.clientWidth;
						
						// Move all the hover inner divs
						var hoverRows = parentRow.querySelectorAll('.tpgb-parlximg');
						Array.prototype.forEach.call(hoverRows, function(hoverBg, i) {
							// Parameters
							var amount = parseFloat( hoverBg.getAttribute( 'data-parallax' ) );
							TweenLite.to( hoverBg, 0.2, {x : -(( e.clientX - (window.innerWidth/2) ) / amount ),y : -(( e.clientY - (window.innerHeight/2) ) / amount ) });
						});
					});

					// Bind to mousemove so animate the hover row to it's default state
					row.addEventListener('mouseout', function(e) {
						// Get the parent row
						var parentRow = e.target.parentNode;
						while ( ! parentRow.classList.contains('tpgb-image-parallax-row') ) {
							if ( parentRow.tagName === 'HTML' ) {
								return;
							}
							parentRow = parentRow.parentNode;
						}
						// Reset all the animations
						var hoverRows = parentRow.querySelectorAll('.tpgb-parlximg');
						Array.prototype.forEach.call(hoverRows, function(hoverBg, i) {
							var amount = parseFloat( hoverBg.getAttribute( 'data-parallax' ) );
							TweenLite.to( hoverBg, 0.2, {x : -(( e.clientX - (window.innerWidth/2) ) / amount ),y : -(( e.clientY - (window.innerHeight/2) ) / amount ) });
						});
					});
				});
			}
		})
	}
}