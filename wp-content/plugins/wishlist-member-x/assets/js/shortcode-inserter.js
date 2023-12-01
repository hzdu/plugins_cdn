if(jQuery.type(window.wlm) != 'object' ) {
  window.wlm = {}
}

/**
 * Generate shortcode and send it to handler
 * @param  string shortcode  name of shortcode
 * @param  object properties shortcode properties
 */
wlm.generate_shortcode = function(shortcode, properties) {
  // allow others to modify the properties
  properties = jQuery('body').triggerHandler('wlm_shortcode_properties.' + shortcode, [properties, shortcode]) || properties;
  shortcode = jQuery('body').triggerHandler('wlm_shortcode.' + shortcode, [shortcode, properties]) || shortcode;

  // get enclosed content for enclosing shortcodes
  var enclosed_content = '';
  if (jQuery.isPlainObject(properties) && '__enclosed_content__' in properties) {
    enclosed_content = properties.__enclosed_content__ || ' ';
    delete properties.__enclosed_content__;
  }

  if (properties == 'invalid') {
    // set shortcode to empty if properties is "invalid"
    // (ie when modified by other code via the wlm_shortcode_properties event)
    output = '';
  } else {
    // generate the shortcode
    var output = '[' + shortcode;
    // combine properties
    if (properties) {
      Object.keys(properties).forEach(function(key) {
        if (properties[key]) {
          output += ' ' + (key ? key + '="' : '"') + properties[key] + '"';
        }
      });
    }
    output += ']';
  }
  if (enclosed_content && output) {
    // wrap enclosed content in our shortcode if it is set
    output += enclosed_content + '[/' + shortcode + ']';
  }

  // tell listeners that the shortcode is now ready so they can do
  // what they want with it (ie put it in a textbox)
  jQuery('body').trigger('wlm_shortcode_preview', output);
}

/**
 * Generate shortcode menu for tinyMCE editor
 * @param  string          shortcode
 * @param  has_attributes  booleam
 */
wlm.tinymce_show_shortcode = function( shortcode, title, has_attributes ) {
  if(has_attributes) {
    jQuery('#wlm-tinymce-shortcode-creator-preview').val('');
    jQuery('#wlm-tinymce-shortcode-creator .media-frame-title h1 span').text(title);
    jQuery('#wlm-tinymce-shortcode-creator .media-modal').show();
    jQuery('#wlm-tinymce-shortcode-creator .media-modal-backdrop').show();
    jQuery('form.wlm-shortcode-attributes').hide();
    jQuery('form#wlm-shortcode-inserter-' + shortcode).show();
    jQuery('form#wlm-shortcode-inserter-' + shortcode + ' :input').first().change();
  } else {
    tinyMCE.activeEditor.execCommand('mceInsertContent', false, '[' + shortcode + ']');  
  }
}

// close tinymce modal with escape
jQuery('body').on('keydown', function(event) {
	if ( 27 === event.which ) {
		jQuery('body').trigger('wlmtnmcelbox:closed');
	}
});
// close tinymce modal by clicking modal close button
jQuery('body').on('click', '#wlm-tinymce-shortcode-creator .media-modal-close', function() {
  jQuery('body').trigger('wlmtnmcelbox:closed');
});

// close tinymce modal
jQuery('body').on('wlmtnmcelbox:closed', function() {
  jQuery('form.wlm-shortcode-attributes').hide();
  jQuery('#wlm-tinymce-shortcode-creator .media-modal').hide();
  jQuery('#wlm-tinymce-shortcode-creator .media-modal-backdrop').hide();
});

// set tinymce shortcode preview
jQuery('body').on('wlm_shortcode_preview', function(e, shortcode) {
	jQuery('#wlm-tinymce-shortcode-creator-preview').val(shortcode);
});

// insert tinymce shortcode
jQuery('body').on('click', '#wlm-tinymce-insert-shortcode', function() {
  tinyMCE.activeEditor.execCommand('mceInsertContent', false, jQuery('#wlm-tinymce-shortcode-creator-preview').val());
  jQuery('body').trigger('wlmtnmcelbox:closed');
});

/**
 * Hide/show fields based on dependency
 * Generate shortcode properties
 * @param  object e Javascript event object
 */
jQuery('body').on('change change.wlm', '.wlm-shortcode-attributes :input', function(e) {
  // get parent container
  var container = jQuery(this).closest('form.wlm-shortcode-attributes');

  // exit if container is not visible
  if (!container.is(':visible')) {
    return;
  }

  // get shortcode name
  var shortcode = container.data('shortcode');

  // allow others to make modifications to the property fields before we process them
  jQuery('body').trigger('wlm_pre_shortcode_properties', shortcode);

  // hide/show dependencies
  container.find('[data-dependency]:not([data-dependency=""])').each(function() {
    var show_and_enable = true
    jQuery(this).data('dependency').split('&&').forEach(function(dep) {
      show_and_enable = show_and_enable && container.find(dep.trim()).length > 0;
    });
    jQuery(this).prop('disabled', !show_and_enable).toggle(show_and_enable);
    jQuery(this).find(':input:not([type="hidden"]), option').prop('disabled', !show_and_enable).toggle(show_and_enable);
  });

  // deselect disabled options and select the first available non-disabled option
  // but ONLY IF e.namespace is empty to prevent a loop
  if (e.namespace == '') {
    container.find('select option:disabled:selected').each(function() {
      jQuery(this).closest('select').find('option:not(:disabled)').first().prop('selected', true);
      jQuery(this).closest('select').trigger('change.wlm');
    });
  }
  // regenerate select2 fields
  try {
    container.find('select').wlmselect2({ theme: "default wlm3-select2" });
  } catch(e) {
    container.find('select').select2();
  }

  // process shortcode properties
  var properties = {};
  // look for all non-disabled fields
  container.find(':input:not(:disabled):not(.select2-search__field)').each(function() {
    if(jQuery(this).closest('.wlm-shortcode-inserter-preview').length) {
      // skip preview input fields
      return;
    }
    if ((this.type == 'checkbox' || this.type == 'radio') && !this.checked) {
      return;
    }
    // get the field value
    var val = jQuery(this).val() || '';

    // combine array values with the pipe "|" symbol
    if (Array.isArray(val)) {
      val = val.join(jQuery(this).data('separator').trim() || '|');
    }
    // finalize value
    // if value is empty then try the placeholder. if placeholder is empty then set it to ''
    val = val.toString() || jQuery(this).attr('placeholder') || '';

    // add value to properties
    if (!(this.name in properties)) {
      properties[this.name] = val;
    } else {
      if (this.type != 'hidden') {
        properties[this.name] += '|' + val;
      }
    }
  });

  // generate the shortcode
  wlm.generate_shortcode(shortcode, properties);
});


/**
 * Handle shortcode menu clicks
 */
jQuery('body').on('click', '.wlm-shortcodes-menu .shortcode-creator', function() {
  // hide all shortcode attributes forms
  jQuery('.wlm-shortcode-attributes').hide();
  // get the shortcode
  var shortcode = jQuery(this).data('value');
  if (shortcode.charAt(0) == '#') {
    // if the shortcode starts with '#' then we show it's properties form
    jQuery(shortcode).show();
    jQuery(shortcode + ' :input').first().change();
  } else {
    // if the shortcode does not start with '#' then we just generate it
    wlm.generate_shortcode(shortcode, {});
  }
});

/**
 * Disable clicks for 2nd level menu items
 * @param  object e Javascript event object
 */
jQuery('body').on('click', '#shortcode-creator-modal .dropdown-item.dropdown-toggle', function(e) {
  e.preventDefault();
  return false;
});

// SHORTCODE : wlm_private
jQuery('body').on('wlm_shortcode_properties.wlm_private', function( e, properties, shortcode ) {
  if('levels' in properties) {
    properties[''] = properties.levels
    delete properties.levels
  }
  return properties;
} );
jQuery('body').on('wlm_shortcode.wlm_private', function( e, shortcode, properties ) {
  if('reverse' in properties) {
    shortcode = '!' + shortcode;
    delete properties.reverse;
  }
  return shortcode;
} );
// END SHORTCODE : wlm_private
// SHORTCODE : wlm_private
jQuery('body').on('wlm_shortcode_properties.wlm_register', function( e, properties, shortcode ) {
  if('level' in properties) {
    properties[''] = properties.level
    delete properties.level
  }
  return properties;
} );
// END SHORTCODE : wlm_private
