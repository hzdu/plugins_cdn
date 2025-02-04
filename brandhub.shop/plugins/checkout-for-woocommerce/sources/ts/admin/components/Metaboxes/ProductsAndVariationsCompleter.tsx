/**
 * External dependencies
 */
import { addQueryArgs }                    from '@wordpress/url';
import apiFetch                            from '@wordpress/api-fetch';
import { Fragment }                        from '@wordpress/element';
import interpolateComponents               from '@automattic/interpolate-components';

/**
 * Internal dependencies
 */
import { ProductImage }                    from '@woocommerce/components';
import { AutoCompleter }                   from '@woocommerce/components/build-types/search/autocompleters';
import React                               from 'react';
import { computeSuggestionMatch }          from '@woocommerce/components/build/search/autocompleters/utils';
import { cfw__ }                           from '../../../functions/translationWrappers';

const completer: AutoCompleter = {
    name: 'products_and_variations',
    className: 'woocommerce-search__product-result',
    options( search ) {
        const query = search
            ? {
                search,
                per_page: 10,
                orderby: 'popularity',
            }
            : {};
        return apiFetch( {
            path: addQueryArgs( '/wc-analytics/products_and_variations', query ),
        } );
    },
    isDebounced: true,
    getOptionIdentifier( product ) {
        return product.id;
    },
    getOptionKeywords( product ) {
        return [ product.name, product.sku ];
    },
    getFreeTextOptions( query ) {
        const label = (
            <span key="name" className="woocommerce-search__result-name">
                { interpolateComponents( {
                    mixedString: cfw__(
                        'All products with titles that include {{query /}}',
                        'woocommerce',
                    ),
                    components: {
                        query: (
                            <strong className="components-form-token-field__suggestion-match">
                                { query }
                            </strong>
                        ),
                    },
                } ) }
            </span>
        );
        const titleOption = {
            key: 'title',
            label,
            value: { id: query, name: query },
        };

        return [ titleOption ];
    },
    getOptionLabel( product, query ) {
        const match = computeSuggestionMatch( product.name, query );
        return (
            <Fragment>
                <ProductImage
                    key="thumbnail"
                    className="woocommerce-search__result-thumbnail"
                    product={ product }
                    width={ 18 }
                    height={ 18 }
                    alt=""
                />
                <span
                    key="name"
                    className="woocommerce-search__result-name"
                    aria-label={ product.name }
                >
                    { match?.suggestionBeforeMatch }
                    <strong className="components-form-token-field__suggestion-match">
                        { match?.suggestionMatch }
                    </strong>
                    { match?.suggestionAfterMatch }
                    { product.sku.length > 0 && <span className="woocommerce-search__result-sku">&nbsp;({ product.sku })</span> }
                </span>
            </Fragment>
        );
    },
    // This is slightly different than gutenberg/Autocomplete, we don't support different methods
    // of replace/insertion, so we can just return the value.
    getOptionCompletion( product ) {
        const value = {
            key: product.id,
            label: product.name,
        };
        return value;
    },
};

export default completer;
