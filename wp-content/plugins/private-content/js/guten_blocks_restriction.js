const addSpacingControlAttribute = (settings, name) => {

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = lodash.assign(settings.attributes, {
		pvtcont_allow : {
			type: 'array',
			default: [],
		},
        pvtcont_block : {
			type: 'array',
			default: [],
		},
	});

	return settings;
};

wp.hooks.addFilter('blocks.registerBlockType', 'extend-block-example/attribute/spacing', addSpacingControlAttribute);






var el = wp.element.createElement;
 
var withInspectorControls = wp.compose.createHigherOrderComponent(function(
    BlockEdit
) {
    return function ( props ) {

        const { pvtcont_allow, pvtcont_block } = props.attributes;
        
        let block_vals = JSON.parse(JSON.stringify(window.pc_gbr_opts));
        block_vals.splice(0, 2);
        
        return el(
            wp.element.Fragment,
            {},
            el( BlockEdit, props ),
            el(
                wp.blockEditor.InspectorControls,
                {},
                el( wp.components.PanelBody, 
                    {
                        title : window.pc_gbr_labels.panel_heading,
                        className: 'pc_gbr_wrap',
                    }, 
                    el( 
                        wp.components.SelectControl, 
                        {
                            value: pvtcont_allow,
                            multiple: 1,
                            label: window.pc_gbr_labels.allow_label,
                            className: 'pc_gbr_allow',
                            options: window.pc_gbr_opts,
                            onChange: function(value) {
                                
                                const conditioned_val_evt = new CustomEvent('pc_gbr_cv_event');
                                
                                if(value.length && value.indexOf('all') !== -1) {
                                    value = ['all'];
                                    document.dispatchEvent(conditioned_val_evt);
                                }
                                else if(value.length && value.indexOf('unlogged') !== -1) {
                                    value = ['unlogged'];
                                    document.dispatchEvent(conditioned_val_evt);
                                }
                                
                                props.setAttributes({
									pvtcont_allow: value,
								});
                            }
                        }  
                    ),
                   el( 
                        wp.components.SelectControl, 
                        {
                            value: pvtcont_block,
                            multiple: 1,
                            label: window.pc_gbr_labels.block_label,
                            className: 'pc_gbr_block',
                            options: block_vals,
                            onChange: function(value) {
                                props.setAttributes( {
									pvtcont_block: value,
								} );
                            }
                        }  
                    )
                )
            )
        );
    };
},
'withInspectorControls');
 
wp.hooks.addFilter('editor.BlockEdit', 'my-plugin/with-inspector-controls', withInspectorControls);

