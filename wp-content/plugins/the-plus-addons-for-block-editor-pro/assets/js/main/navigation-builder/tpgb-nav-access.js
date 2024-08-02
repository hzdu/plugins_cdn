
tpnavAcc(document)   

function tpnavAcc(doc){
    doc.querySelectorAll(".tpgb-navbuilder.tpgb-web-access a").forEach(function(anchor) {
        anchor.addEventListener('focus', function(event) {
            toggleFocus(event.target);
        });
        anchor.addEventListener('blur', function(event) {
            toggleFocus(event.target);
        });
    });
}

function toggleFocus(anchor) {
    var self = anchor.closest('li'),
        hoversty = anchor.closest(".tpgb-nav-inner").getAttribute("data-menu_transition");

    let getLI = anchor.closest('li.menu-item.depth-0');

    if(getLI && getLI.previousSibling && getLI.previousSibling.classList.contains('access-added')){
        getLI.previousElementSibling.classList.remove('access-added')
        var dmenu = getLI.previousElementSibling.querySelector('ul.dropdown-menu');
        if (dmenu) {
            if (hoversty == 'style-1') {
                slideUpP(dmenu, 300);
            } else if (hoversty == 'style-2') {
                fadeOutP(dmenu, 300);
            } else if (hoversty == 'style-3' || hoversty == 'style-4') {
                dmenu.classList.remove('open-menu');
            }
        }
    }
    
    while (!self.classList.contains('navbar-nav')) {
        var dmenu = self.querySelector('ul.dropdown-menu');
        if(!self.querySelector('a') && self.classList.contains('access-added')){
            self.classList.remove('access-added')
        }
        if(!self.classList.contains('access-added')){
            if (self.tagName.toLowerCase() === 'li') {
                if (self.classList.contains('open')) {
                    self.classList.remove('open');
                    if (dmenu) {
                        if (hoversty == 'style-1') {
                            slideUpP(dmenu, 300);
                        } else if (hoversty == 'style-2') {
                            fadeOutP(dmenu, 300);
                        } else if (hoversty == 'style-3' || hoversty == 'style-4') {
                            dmenu.classList.remove('open-menu');
                        }
                    }
                } else {
                    self.classList.add('open');
                    if (dmenu) {
                        if (hoversty == 'style-1') {
                            slideDownP(dmenu, 300);
                        } else if (hoversty == 'style-2') {
                            fadeInP(dmenu, 300);
                        } else if (hoversty == 'style-3' || hoversty == 'style-4') {
                            dmenu.classList.add('open-menu');
                        }
                    }
                }
            }
        }
        if(self.querySelector('a')){
            self.classList.add('access-added')
        }
        self = self.parentElement;
    }
}
