/* Dynamic Category Start */

let mainDc = document.querySelectorAll('.tpgb-dy-cat-list, .dynamic-cat-style_3');
if (mainDc) {
    mainDc.forEach( (element) => {
        let onHoverBg = element.classList.contains('tpgb-dc-st3-bgimg');
        if (onHoverBg) {
            let gridData = element.querySelectorAll('.grid-item');
            gridData.forEach( (el) => {
                el.addEventListener('mouseenter', function() {
                let bgimage = this.querySelector('.tpgb-dynamic-wrapper.style_3').dataset.bgimage;
                this.style.background = "url(" + bgimage + ") center/cover";

                });
                el.addEventListener('mouseleave', function() {
                this.style.background = "";
                });
            });
        }
    });
}

/* Dynamic Category End */

