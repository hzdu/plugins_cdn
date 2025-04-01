/**
 * External dependencies
 */
import { addQueryArgs }           from '@wordpress/url';
import apiFetch                   from '@wordpress/api-fetch';
import { Fragment }               from '@wordpress/element';
import interpolateComponents      from '@automattic/interpolate-components';
import React                      from 'react';

/**
 * Internal dependencies
 */
import { AutoCompleter }          from '@woocommerce/components/build-types/search/autocompleters';
import { computeSuggestionMatch } from '@woocommerce/components/build/search/autocompleters/utils';
import { cfw__ }                  from '../../../functions/translationWrappers';

const completer: AutoCompleter = {
    name: 'product_tags',
    className: 'woocommerce-search__product-result',
    options( search ) {
        const query = search
            ? {
                search,
                per_page: 10,
                orderby: 'count',
                order: 'desc',
            }
            : {};
        return apiFetch( {
            path: addQueryArgs( '/wc/v3/products/tags', query ),
        } );
    },
    isDebounced: true,
    getOptionIdentifier( tag ) {
        return tag.id;
    },
    getOptionKeywords( tag ) {
        return [ tag.name ];
    },
    getFreeTextOptions( query ) {
        const label = (
            <span key="name" className="woocommerce-search__result-name">
                {interpolateComponents( {
                    mixedString: cfw__(
                        'All product tags that include {{query /}}',
                        'woocommerce',
                    ),
                    components: {
                        query: (
                            <strong className="components-form-token-field__suggestion-match">
                                {query}
                            </strong>
                        ),
                    },
                } )}
            </span>
        );
        const titleOption = {
            key: 'title',
            label,
            value: { id: query, name: query },
        };

        return [ titleOption ];
    },
    getOptionLabel( tag, query ) {
        const match = computeSuggestionMatch( tag.name, query );
        return (
            <Fragment>
                <span
                    key="name"
                    className="woocommerce-search__result-name"
                    aria-label={tag.name}
                >
                    {match?.suggestionBeforeMatch}
                    <strong className="components-form-token-field__suggestion-match">
                        {match?.suggestionMatch}
                    </strong>
                    {match?.suggestionAfterMatch}
                </span>
            </Fragment>
        );
    },
    // This is slightly different than Gutenberg's Autocomplete; we don't support different methods
    // of replace/insertion, so we can just return the value.
    getOptionCompletion( tag ) {
        return {
            key: tag.id,
            label: tag.name,
        };
    },
};

export default completer;
