document.addEventListener("DOMContentLoaded", function() {
	tpgbctaTilt(document)
});

function tpgbctaTilt(doc){
	let ctaBanner = doc.querySelectorAll('.tpgb-cta-banner');
	if( ctaBanner.length ){
		ctaBanner.forEach((hh)=>{
			let hoverTilt = hh.querySelector('.hover-tilt');
			let ctablock = hh.querySelector('.cta-block-inner');
			if(hoverTilt && ctablock){
				VanillaTilt.init(ctablock);
			}
		})
	}
}
