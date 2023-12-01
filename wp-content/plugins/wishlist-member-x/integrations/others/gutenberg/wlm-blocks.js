'use strict';

var wlmComboBoxControl = wp.components.ComboboxControl,
  wlmSelectControl = wp.components.SelectControl,
  wlmFormTokenField = wp.components.FormTokenField,
   wlmCustomSelectControl  = wp.components.CustomSelectControl ,
  wlmTextareaControl = wp.components.TextareaControl;


function wlm_admin_blocks_custom_fields( wlm_data_fields, props ) {
  return wp.hooks.applyFilters( 'wlm_admin_blocks_custom_fields', [], wlm_data_fields, props );
}

var wlm_block_restriction = wp.compose.createHigherOrderComponent( function( BlockEdit ) {
  var wlm_data_fields = {
    wlm_block_access:      'wlm_block_settings_hide',
    wlm_level_access:    'wlm_block_settings_hide',
    wlm_message_type:    'wlm_block_settings_hide',
    wlm_message_content: 'wlm_block_settings_hide'
  };

  wlm_data_fields = wp.hooks.applyFilters( 'wlm_admin_blocks_condition_fields_default', wlm_data_fields );

  return function( props ) {

    if ( props.attributes.wlm_block_restriction !== true ) {
      wlm_data_fields['wlm_block_access'] = 'wlm_block_settings_hide';
      wlm_data_fields['wlm_level_access'] = 'wlm_block_settings_hide';
      wlm_data_fields['wlm_message_type'] = 'wlm_block_settings_hide';
      wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
    } else {
      wlm_data_fields['wlm_block_access'] = '';

      if ( parseInt( props.attributes.wlm_block_access ) === 0 || typeof props.attributes.wlm_block_access === 'undefined' ) {
        wlm_data_fields['wlm_level_access'] = 'wlm_block_settings_hide';
        wlm_data_fields['wlm_message_type'] = 'wlm_block_settings_hide';
        wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
      } else if ( parseInt( props.attributes.wlm_block_access ) === 1 || parseInt( props.attributes.wlm_block_access ) === 2 ) {
        wlm_data_fields['wlm_level_access'] = '';
        wlm_data_fields['wlm_message_type'] = '';

        if ( parseInt( props.attributes.wlm_message_type ) === 2 ) {
          wlm_data_fields['wlm_message_content'] = '';
        } else {
          wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
        }
      } else {
        wlm_data_fields['wlm_message_type'] = '';
        wlm_data_fields['wlm_level_access'] = 'wlm_block_settings_hide';
        if ( parseInt( props.attributes.wlm_message_type ) === 2 ) {
          wlm_data_fields['wlm_message_content'] = '';
        } else {
          wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
        }
      }
    }

    wlm_data_fields = wp.hooks.applyFilters( 'wlm_admin_blocks_condition_fields', wlm_data_fields, props );

    return wp.element.createElement(
      wp.element.Fragment,
      {},
      wp.element.createElement( BlockEdit, props ),
      wp.element.createElement(
        wp.blockEditor.InspectorControls,
        {},
        wp.element.createElement(
          wp.components.PanelBody,
          {
            title: wp.i18n.__( 'WishList Member', 'wishlist-member' ),
            className: 'wlm_block_settings'
          },
          wp.element.createElement(
            wp.components.ToggleControl,
            {
              label: wp.i18n.__( 'Restrict access to this block.', 'wishlist-member' ),
              checked: props.attributes.wlm_block_restriction,
              onChange: function onChange( value ) {
                props.setAttributes({ wlm_block_restriction: value });
                if ( value === false ) {
                  wlm_data_fields['wlm_block_access'] = 'wlm_block_settings_hide';
                  wlm_data_fields['wlm_level_access'] = 'wlm_block_settings_hide';
                  wlm_data_fields['wlm_message_type'] = 'wlm_block_settings_hide';
                  wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
                } else {
                  wlm_data_fields['wlm_block_access'] = '';
                }

                wlm_data_fields = wp.hooks.applyFilters( 'wlm_admin_blocks_condition_fields_on_change', wlm_data_fields, 'wlm_block_restriction', value );
              }
            }
          ),
          // Select Element for Who Can Access.
          wp.element.createElement(
            wlmSelectControl,
            {
              type: 'number',
              className: wlm_data_fields['wlm_block_access'],
              label: wp.i18n.__( 'Who can access this block?', 'wishlist-member' ),
              value: props.attributes.wlm_block_access,
              options: [
                {
                  label: wp.i18n.__( 'Everybody', 'wishlist-member' ),
                  value: 0
                },
                {
                  label: wp.i18n.__( 'Not Logged-in', 'wishlist-member' ),
                  value: 4
                }, 
                {
                  label: wp.i18n.__( 'Logged-in', 'wishlist-member' ),
                  value: 3
                },
                {
                  label: wp.i18n.__( 'Members in Membership Level(s)', 'wishlist-member' ),
                  value: 1
                },
                {
                  label: wp.i18n.__( 'Members not in Membership Level(s)', 'wishlist-member' ),
                  value: 2
                },
              ],
              onChange: function onChange( value ) {
                props.setAttributes({ wlm_block_access: value });
                if ( parseInt( value ) === 0 ) {
                  wlm_data_fields['wlm_message_type'] = 'wlm_block_settings_hide';
                  wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
                  wlm_data_fields['wlm_level_access'] = 'wlm_block_settings_hide';
                } else if ( parseInt( value ) === 1 || parseInt( value ) === 2 ) {
                      wlm_data_fields['wlm_message_type'] = '';
                     wlm_data_fields['wlm_level_access'] = '';
                } else {
                   
                    wlm_data_fields['wlm_message_type'] = '';
                    wlm_data_fields['wlm_level_access'] = 'wlm_block_settings_hide';
                 
                }

                wlm_data_fields = wp.hooks.applyFilters( 'wlm_admin_blocks_condition_fields_on_change', wlm_data_fields, 'wlm_block_access', value );
              }
            }
          ),
          // Dropdown Element for Membership Levels.
          wp.element.createElement(
            wlmSelectControl,
            {
              multiple: true,
              className: wlm_data_fields['wlm_level_access'],
              label: wp.i18n.__( 'Select Membership Levels:', 'wishlist-member' ),
              value: props.attributes.wlm_level_access,
              options: wlm_restrict_blocks,
              onChange: function onChange( value ) {
                props.setAttributes({ wlm_level_access: value });
              }
            }
          ),

          // Dropdown for Restrict Action.
          wp.element.createElement(
            wlmSelectControl,
            {
              type: 'number',
              className: wlm_data_fields['wlm_message_type'],
              label: wp.i18n.__( 'Restriction Action: ', 'wishlist-member' ),
              value: props.attributes.wlm_message_type,
              options: [
                {
                  label: wp.i18n.__( 'Hide block', 'wishlist-member' ),
                  value: 0
                },
                {
                  label: wp.i18n.__( 'Show custom message', 'wishlist-member' ),
                  value: 2
                }
              ],
              onChange: function onChange( value ) {
                props.setAttributes({ wlm_message_type: value });
                if ( parseInt( value ) === 1 ) {
                  wlm_data_fields['wlm_message_content'] = '';
                } else {
                  wlm_data_fields['wlm_message_content'] = 'wlm_block_settings_hide';
                }
              }
            }
          ),
          wp.element.createElement(
            wlmTextareaControl,
            {
              type: 'number',
              className: wlm_data_fields['wlm_message_content'],
              label: wp.i18n.__( 'Restriction Message Content:', 'wishlist-member' ),
              value: props.attributes.wlm_message_content,
              onChange: function onChange( value ) {
                props.setAttributes({ wlm_message_content: value });
              }
            }
          ),
          wlm_admin_blocks_custom_fields( wlm_data_fields, props )
        )
      )
    );
  };
}, 'wlm_block_restriction' );

wp.hooks.addFilter( 'editor.BlockEdit', 'wlm-block/wlm_block_restriction', wlm_block_restriction );


/**
 * Save Attributes
 *
 * @type {{wlm_block_restriction: {type: string}, wlm_block_access: {type: string}, wlm_message_type: {type: string}, wlm_message_content: {type: string}}}
 */
var wlm_block_restrict_settings = {
  wlm_block_restriction: {
    type: "boolean"
  },
  wlm_block_access: {
    type: "select"
  },
  wlm_level_access: {
    type: "select"
  },
  wlm_message_type: {
    type: "select"
  },
  wlm_message_content: {
    type: "string"
  }
};

wlm_block_restrict_settings = wp.hooks.applyFilters( 'wlm_admin_blocks_restrict_settings', wlm_block_restrict_settings );

/**
 *
 * @param settings
 * @returns {*}
 */
function wlm_add_block_attributes( settings ) {
  var _lodash = lodash,
    assign = _lodash.assign;

  settings.attributes = assign( settings.attributes, wlm_block_restrict_settings );
  return settings;
}

wp.hooks.addFilter( 'blocks.registerBlockType', 'wlm-block/wlm_add_block_attributes', wlm_add_block_attributes );