"use strict";

(function () {
  window.addEventListener('load', function () {
    var currentTab;
    var lastTab = sessionStorage.getItem('scxi-settings-tab') || 'general';
    var tabs = document.getElementsByClassName('scxi-tab-link'); // show default tab on page load

    _enableTab(lastTab, 'general'); // listen tab link clicks

    for (var el of tabs) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        currentTab = new URL(e.target.href).hash.substring(1);

        if (currentTab !== lastTab) {
          _enableTab(currentTab, lastTab); // keep last active tab

          sessionStorage.setItem('scxi-settings-tab', currentTab);
          lastTab = currentTab;
        }
      });
    }

    // Ask if visitor wants to reset connection?
    var disconnBtn = document.getElementById('scxi-disconnect-btn');

    if (disconnBtn !== null) {
      disconnBtn.addEventListener('click', function(e) {
        e.preventDefault();

        if (confirm(e.target.getAttribute('data-confirm'))) {
          window.location.replace(e.target.href);
        }
      });
    }
  });

  var _enableTab = (current, last) => {
    // enable tab
    document.getElementById(`scxi-tab-link-${current}`).classList.add('nav-tab-active');
    document.getElementById(`scxi-tab-${current}`).classList.add('scxi-tab-active'); // hide last tab

    if (last !== current && last !== undefined) {
      document.getElementById(`scxi-tab-link-${last}`).classList.remove('nav-tab-active');
      document.getElementById(`scxi-tab-${last}`).classList.remove('scxi-tab-active');
    }
  };

})();