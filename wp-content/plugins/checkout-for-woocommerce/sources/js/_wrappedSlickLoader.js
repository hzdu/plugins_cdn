module.exports = function ( source ) {
    return `
    (function() {
      if (typeof jQuery.fn.slick === 'undefined') {
        ${source}
      }
    })();
  `;
};
