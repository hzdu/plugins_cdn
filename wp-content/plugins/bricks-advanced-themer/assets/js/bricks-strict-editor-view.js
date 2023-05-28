const ADMINBRXC = {
    appendElements: function(){
        const els = document.querySelector('#bricks-panel-inner #bricks-panel-elements');
        const defaultPanel = document.querySelector('#bricks-panel-inner #default-panel')

        if(!els || defaultPanel) return;

        els.innerHTML = '<div id="default-panel" class="no-results"><p>No element selected. Hover the page and click on an selectable element (with a green outline) to modify the content.</p><a href="https://academy.bricksbuilder.io/article/builder-intro/" target="_blank" class="button">Learn more</a></div>';
    },
    runObserver: function() {
        const self = this;

        const panelInner = document.querySelector('#bricks-panel-inner');
        if (!panelInner) return;

        const observer = new MutationObserver(function(mutations) {
            self.appendElements();
        });
        observer.observe(panelInner, { subtree: true, childList: true });
    },
    initObservers: function(){
        const self = this;
        self.runObserver();
    },
    init: function(){
        const self = this;
        self.initObservers();
        self.appendElements();
    }
}


window.addEventListener('load', () => {
    setTimeout(ADMINBRXC.init(), 300);
})

