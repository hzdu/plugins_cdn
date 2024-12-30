( function($, api) {
  "use strict";
  
  api.sectionConstructor.default = api.Section.extend({
    expand : function(params)
    {
      var section = this.container[1];
      
      if(!$(section).hasClass('soledad-fw-section-loaded'))
      {
        $(section).addClass('soledad-fw-section-loaded').trigger('soledad-fw-open-section');
      }
      
      api.Section.prototype.expand.call(this, params);
    }
  });
  
  
})( jQuery, wp.customize );
