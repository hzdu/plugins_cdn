document.addEventListener('DOMContentLoaded', () => {
	tpsocialReview(document);
});

function tpsocialReview(doc){

 let allSocRev = doc.querySelectorAll('.tpgb-social-reviews');
    if(allSocRev){
        allSocRev.forEach((sr)=>{
            var scroll_nrml = {
            ScrollOn: sr.getAttribute("data-scroll-normal"),
            TextLimit: sr.getAttribute("data-textlimit")
            };
            var Get_TL = sr.getAttribute("data-textlimit");
            Get_TL = (Get_TL) ? JSON.parse(Get_TL) : '';

            if (scroll_nrml.ScrollOn == "true" && scroll_nrml.TextLimit == "false") {
                var SF_Text = sr.querySelectorAll(".showtext");
                if(SF_Text){
                    SF_Text.forEach(function(element) {
                        if (element.clientHeight >= scroll_nrml.Height) {
                            element.classList.add(scroll_nrml.className);
                            element.style.height = scroll_nrml.Height;
                        }
                    });
                }
            }

			document.addEventListener('click', function(e) {
				if (e.target.matches('.readbtn')) {
					let target = e.target;
					var rMsg = target.closest('.tpgb-message');
					var container = rMsg.closest('.tpgb-isotope .post-loop-inner');
					var Scroll = target.closest('.tpgb-social-reviews').dataset.scrollNormal;
					Scroll = (Scroll) ? JSON.parse(Scroll) : '';

					var showtxt = rMsg.querySelector('.showtext');

					if (rMsg.classList.contains('show-text')) {
						rMsg.classList.remove('show-text', 'show-less');
						target.innerHTML = Get_TL.showmoretxt;
						rMsg.querySelector('.sf-dots').style.display = 'inline';
						if (Scroll && Scroll.ScrollOn && Scroll.TextLimit) {
							showtxt.classList.remove(Scroll.className);
							showtxt.removeAttribute('style');
						}
					} else {
						rMsg.classList.add('show-text', 'show-less');
						target.innerHTML = Get_TL.showlesstxt;
						rMsg.querySelector('.sf-dots').style.display = 'none';
						if (Scroll && Scroll.ScrollOn && Scroll.TextLimit) {
							if (showtxt.clientHeight >= Scroll.Height) {
								showtxt.classList.add(Scroll.className);
								showtxt.style.height = Scroll.Height+'px';
							}
						}
					}
					if(container){
						new Isotope( container, {
							itemSelector: '.grid-item',
							resizable: true,
							sortBy: 'original-order'
						});
					}			
				}
			});
    });
  }
}