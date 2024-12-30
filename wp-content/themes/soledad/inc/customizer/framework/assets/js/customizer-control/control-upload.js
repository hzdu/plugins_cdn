(function($, api){
  "use strict";

  api.controlConstructor['soledad-fw-upload'] = api.UploadControl.extend({
    initialize: function( id, options ) {
      api.Control.prototype.initialize.call( this, id, options );
      window.initializeControl(this, id, options);
    },
  });
})(jQuery, wp.customize);
