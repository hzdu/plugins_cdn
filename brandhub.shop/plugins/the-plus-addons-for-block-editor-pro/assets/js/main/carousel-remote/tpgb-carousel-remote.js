
document.addEventListener("DOMContentLoaded", (event) => {
    tpcaroRemote(document);
})

function tpcaroRemote(doc){
    var caroRemote = doc.querySelectorAll('.tpgb-carousel-remote');
    
    if(caroRemote) {
        caroRemote.forEach(function(element) {
            var dotdiv = element.querySelector('.tpgb-carousel-dots .tpgb-carodots-item'),
                exid = element.getAttribute('data-extra-conn'),
                acttab = document.querySelector('.' + exid + '.tpgb-tabs-wrapper .tpgb-tab-li .tpgb-tab-header.active'),
                activetab = ( acttab ) ? acttab.getAttribute('data-tab') : '';

            element.querySelectorAll('.slider-btn').forEach(function(btn) {
                btn.addEventListener("click", function(e) {
                    e.preventDefault();
                    var remote_uid = this.getAttribute("data-id");
                    var remote_type = element.getAttribute("data-remote");
                    var carousel_slide = this.getAttribute("data-nav");
                    var extrconn = element.getAttribute("data-extra-conn");

                    if (remote_uid && remote_type === 'switcher') {
                        var switcher_toggle = this.getAttribute("data-nav");
                        var switch_toggle = document.getElementById(remote_uid).querySelector('.switch-toggle');
                        var switch_1_toggle = document.getElementById(remote_uid).querySelector('.switch-1');
                        var switch_2_toggle = document.getElementById(remote_uid).querySelector('.switch-2');

                        element.querySelectorAll(".slider-btn").forEach(function(sliderBtn) {
                            sliderBtn.classList.remove("active");
                        });
                        this.classList.add("active");

                        if (switcher_toggle === 'next') {
                            switch_2_toggle.click();
                        } else if (switcher_toggle === 'prev') {
                            switch_1_toggle.click();
                        }
                    }

                    if (extrconn && remote_type === 'tab') {
                        var tab_exid = document.querySelector('.' + extrconn + '.tpgb-tabs-wrapper').getAttribute('data-extra-conn');
                        var tab = document.querySelector('.' + extrconn + '.tpgb-tabs-wrapper .tpgb-tabs-nav').children.length;

                        if (tab_exid) {
                            if (carousel_slide === 'next') {
                                activetab++;
                                if (activetab > tab) activetab = 1;
                                document.querySelector('.' + extrconn + '.tpgb-tabs-wrapper .tpgb-tab-li .tpgb-tab-header[data-tab="' + parseInt(activetab) + '"]').click();
                            } else if (carousel_slide === 'prev') {
                                activetab--;
                                if (activetab < 1) activetab = tab;
                                document.querySelector('.' + extrconn + '.tpgb-tabs-wrapper .tpgb-tab-li .tpgb-tab-header[data-tab="' + parseInt(activetab) + '"]').click();
                            }
                        }
                    }
                });
            });
        });
    }
}