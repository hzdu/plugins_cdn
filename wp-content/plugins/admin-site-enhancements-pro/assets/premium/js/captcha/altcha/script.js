// From https://plugins.trac.wordpress.org/browser/altcha-spam-protection/tags/1.16.0/public/script.js
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      [...document.querySelectorAll('altcha-widget')].forEach((el) => {
        // add the name attr to fix input validation exception
        el.querySelector('input[type="checkbox"]')?.setAttribute('name', '');
        const form = el.closest('form');
        if (form) {
          form.addEventListener('submit', (ev) => {
            if (!form.reportValidity()) {
              ev.preventDefault();
              ev.stopPropagation();
            }
          }, true);
        }
      });
    });
  });
})();
