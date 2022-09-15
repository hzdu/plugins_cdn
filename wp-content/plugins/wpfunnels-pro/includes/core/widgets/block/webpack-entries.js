/**
 * External dependencies
 */
const { omit } = require( 'lodash' );
const glob = require( 'glob' );

// List of blocks that should be used as webpack entry points. They are expected
// to be in `/assets/js/blocks/[BLOCK_NAME]`. If they are not, their relative
// path should be defined in the `customDir` property. The scripts below will
// take care of looking for `index.js`, `frontend.js` and `*.scss` files in each
// block directory.
// If a block is experimental, it should be marked with the `isExperimental`
// property.
const blocks = {
    'offer-button': {},
    'lms-offer-button': {},
    'offer-title': {},
    'offer-price': {},
    'offer-product': {},
};

// Returns the entries for each block given a relative path (ie: `index.js`,
// `**/*.scss`...).
// It also filters out elements with undefined props and experimental blocks.
const getBlockEntries = ( relativePath ) => {
    return Object.fromEntries(
        Object.entries( blocks )
            .map( ( [ blockCode, config ] ) => {
                const filePaths = glob.sync(
                    `./assets/js/blocks/${ config.customDir || blockCode }/` +
                    relativePath
                );
                if ( filePaths.length > 0 ) {
                    return [ blockCode, filePaths ];
                }
                return null;
            } )
            .filter( Boolean )
    );
};

const entries = {
    styling: {
        ...getBlockEntries( '**/*.scss' ),
    },
    main: {
        ...getBlockEntries( 'index.{t,j}s{,x}' ),
    },
    frontend: {
        ...getBlockEntries( 'frontend.{t,j}s{,x}' ),
    },
};

const getEntryConfig = ( type = 'main', exclude = [] ) => {
    return omit( entries[ type ], exclude );
};

module.exports = {
    getEntryConfig,
};
