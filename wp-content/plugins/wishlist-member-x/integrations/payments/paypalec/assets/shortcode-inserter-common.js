/**
 * Filter and modify properties for wlm_paypalec_btn, wlm_payflow_btn, wlm_paypalpro_btn, and wlm_paypalps_btn
 * @param  object e          Javascript event object
 * @param  object properties Shortcode properties
 * @param  string shortcode  Shortcode
 * @return object            Modified properties
 */
jQuery('body').on('wlm_shortcode_properties.wlm_paypalec_btn wlm_shortcode_properties.wlm_payflow_btn wlm_shortcode_properties.wlm_paypalpro_btn wlm_shortcode_properties.wlm_paypalps_btn', function(e, properties, shortcode) {
  // we only want to process our shortcode
  if(properties.sku == '') {
    // sku is required
    return 'invalid';
  }
  
  // inject name from the text of the selected option
  var container = jQuery('form#wlm-shortcode-inserter-' + shortcode);
  var preview = jQuery('form#wlm-shortcode-inserter-' + shortcode + ' .wlm-shortcode-inserter-preview');
  properties.name = jQuery('form#wlm-shortcode-inserter-' + shortcode + ' [name="sku"] option:selected').text();

  // choose what button to display
  if('btn' in properties) {
    // non-spb buttons
    var origbtn = properties.btn
    if(properties.btn == 'custom') {
      properties.btn = properties['btn-custom'];
    } else {
      properties.btn += ':' + properties['btn-size'];
    }
    delete properties['btn-size'];
    delete properties['btn-custom'];
    
    // generate button preview
    preview.html( '<p><label>Button Preview</label></p>');
    if(origbtn == 'custom') {
      if(properties.btn.match(/^http|https:\/\/.+/)) {
        preview.append('<p><img border="0" style="max-width:400px;max-height:90px;" src="' + properties.btn + '"></p>');
      } else {
        preview.append('<p><input type="button" value="' + properties.btn + '"></p>');
      }
    } else {
      preview.append('<p><img border="0" src="' + wlm_paypal_buttons[properties.btn] + '"></p>');
    }
  } else {
    // spb buttons
    if('funding' in properties) {
      properties.funding = properties.funding.replace( /\|/g, ',' );
    }
    
    if('layout' in properties){
			var settings = {
				env : 'sandbox',
				style : {
					layout : properties.layout,
					size : properties.size,
					shape : properties.shape,
					color : properties.color,
				},
				funding : {
					allowed : container.find('[name="funding"]:checked').map(function() {return paypal.FUNDING[this.value]}).get(),
					disallowed : container.find('[name="funding"]:not(:checked)').map(function() {return paypal.FUNDING[this.value]}).get(),
				},
				payment : function() {},
				onAuthorize : function() {},
			}
      var xid = Date.now();
      preview.html( '<p><label>Button Preview</label></p><div id="wlm-paypal-spb-preview-' + xid + '"></div>');
			paypal.Button.render(settings, '#wlm-paypal-spb-preview-' + xid);
    }
  }
  // return modified properties
  return properties;
});
